import pathToRegexp from "path-to-regexp";
import * as db from "../services/Addcart";
import dateRanges from "../../../utils/ranges";
import wms from '../../index/services/wms';
const R = require('ramda');

const namespace = "addcart";
export default {
  namespace,
  state: {
    dataSource: [],
    dateRange: [],
    abnormalTypeList: [],
    abnormalWMS: [],
    lockInfo: {
      checkByWeek: 0,
      abnormal: 0
    }
  },
  reducers: {
    save(state, {
      payload: {
        dataSource,
      }
    }) {
      return { ...state,
        dataSource,
      };
    },
    setDateRange(state, {
      payload: dateRange
    }) {
      return {
        ...state,
        dateRange
      };
    },
    setProc(state, {
      payload: abnormalTypeList
    }) {
      return {
        ...state,
        abnormalTypeList
      };
    },
    saveWMS(state, {
      payload: {
        abnormalWMS
      }
    }) {
      return {
        ...state,
        abnormalWMS
      }
    },
    saveLockInfo(state, {
      payload: {
        lockInfo
      }
    }) {
      return {
        ...state,
        lockInfo
      }
    }
  },
  effects: {
    * updateDateRange({
      payload: dateRange
    }, {
      put
    }) {
      yield put({
        type: "setDateRange",
        payload: dateRange
      });
    },
    * getLockCart(payload, {
      call,
      put,
      select
    }) {
      const [ts, te] = dateRanges["本周"];
      const [tstart, tend] = [ts.format("YYYYMMDD"), te.format("YYYYMMDD")];

      // 获取每周人工拉号锁车产品信息
      let {
        data
      } = yield call(db.getPrintSampleCartlist, {
        tstart,
        tend,
        tstart2: tstart,
        tend2: tend
      });
      // console.log(data)

      let lockInfo = {
        checkByWeek: 0,
        abnormal: 0
      }

      data.forEach(({
        num,
        type
      }) => {
        if (type === '1') {
          lockInfo.checkByWeek = num;
        } else {
          lockInfo.abnormal = num;
        }
      })

      yield put({
        type: 'saveLockInfo',
        payload: {
          lockInfo
        }
      })

    },
    * handleReportData(payload, {
      call,
      put,
      select
    }) {
      yield put({
        type: "save",
        payload: {
          dataSource: [],
        }
      });

      yield put({
        type: 'saveWMS',
        payload: {
          abnormalWMS: []
        }
      })

      const store = yield select(state => state[namespace]);
      const {
        dateRange
      } = store;

      let dataSource = yield call(db.getViewPrintAbnormalProd, {
        tstart: dateRange[0],
        tend: dateRange[1],
        only_lock_cart: 0
      });

      // 车号列表
      let carts = R.map(R.nth(1))(dataSource.data);
      if (R.isNil(carts) || carts.length === 0) {
        return;
      }
      let abnormalWMS = yield call(db.getTbstock, carts);
      abnormalWMS.data = abnormalWMS.data.map(item => {
        item[6] = wms.getLockReason(item[6]);
        return item;
      })

      // 将库管系统数据合并
      dataSource.header = [...dataSource.header.slice(0, 8), '锁车状态(库管系统)', '工艺(库管系统)', '完成状态(调度服务)', ...dataSource.header.slice(9, 12)]
      dataSource.data = dataSource.data.map(item => {
        let iTemp = item.slice(0, 8);
        let lockStatus = abnormalWMS.data.filter(wmsItem => wmsItem[2] === item[1]);
        if (lockStatus.length === 0) {
          iTemp = [...iTemp, '', ''];
        } else {
          iTemp = [...iTemp, lockStatus[0][5], lockStatus[0][7]];
        }
        return [...iTemp, ...item.slice(8, 12)];
      });

      yield put({
        type: "save",
        payload: {
          dataSource,
        }
      });

      yield put({
        type: 'saveWMS',
        payload: {
          abnormalWMS
        }
      })
      yield put({
        type: "setLoading",
        payload: {
          loading: false,
        }
      });
    },
    * getProc(payload, {
      put,
      select,
      call
    }) {
      let proc = yield call(db.getPrintAbnormalProd);
      yield put({
        type: "setProc",
        payload: proc.data
      });
    }
  },
  subscriptions: {
    setup({
      dispatch,
      history
    }) {
      return history.listen(async ({
        pathname,
        query
      }) => {
        const match = pathToRegexp("/" + namespace).exec(pathname);
        if (match && match[0] === "/" + namespace) {
          const [tstart, tend] = dateRanges["最近一月"];
          const [ts, te] = [tstart.format("YYYYMMDD"), tend.format("YYYYMMDD")];

          await dispatch({
            type: "updateDateRange",
            payload: [ts, te]
          });
          dispatch({
            type: "handleReportData"
          });

          dispatch({
            type: "getProc"
          });

          dispatch({
            type: 'getLockCart'
          })
        }
      });
    }
  }
};
