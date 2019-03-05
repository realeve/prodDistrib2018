import pathToRegexp from 'path-to-regexp';
import * as db from '../services/Addcart';
import dateRanges from '@/utils/ranges';
import wms from '../../index/services/wms';
import { setStore } from '@/utils/lib';
const R = require('ramda');

const namespace = 'addcart';
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
    },
    operatorList: [],
    hechaTask: { task_list: [], unhandle_carts: [], unupload_carts: [] },
    hechaLoading: false,
    rec_time: '',
    pfNums: [],
    allCheckList: {}
  },
  reducers: {
    setStore,
    save(
      state,
      {
        payload: { dataSource }
      }
    ) {
      return { ...state, dataSource };
    },
    setDateRange(state, { payload: dateRange }) {
      return {
        ...state,
        dateRange
      };
    },
    setProc(state, { payload: abnormalTypeList }) {
      return {
        ...state,
        abnormalTypeList
      };
    },
    saveWMS(
      state,
      {
        payload: { abnormalWMS }
      }
    ) {
      return {
        ...state,
        abnormalWMS
      };
    },
    saveLockInfo(
      state,
      {
        payload: { lockInfo }
      }
    ) {
      return {
        ...state,
        lockInfo
      };
    }
  },
  effects: {
    *updateDateRange({ payload: dateRange }, { put }) {
      yield put({
        type: 'setDateRange',
        payload: dateRange
      });
    },
    *getLockCart(_, { call, put, select }) {
      const [ts, te] = dateRanges['本周'];
      const [tstart, tend] = [ts.format('YYYYMMDD'), te.format('YYYYMMDD')];

      // 获取每周人工拉号锁车产品信息
      let { data } = yield call(db.getPrintSampleCartlist, {
        tstart,
        tend,
        tstart2: tstart,
        tend2: tend
      });
      // console.log(data)

      let lockInfo = {
        checkByWeek: 0,
        abnormal: 0
      };

      data.forEach(({ num, type }) => {
        if (type === '1') {
          lockInfo.checkByWeek = num;
        } else {
          lockInfo.abnormal = num;
        }
      });

      yield put({
        type: 'saveLockInfo',
        payload: {
          lockInfo
        }
      });
    },
    *handleReportData(_, { call, put, select }) {
      yield put({
        type: 'save',
        payload: {
          dataSource: []
        }
      });

      yield put({
        type: 'saveWMS',
        payload: {
          abnormalWMS: []
        }
      });

      const store = yield select((state) => state[namespace]);
      const { dateRange } = store;

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
      abnormalWMS.data = abnormalWMS.data.map((item) => {
        item[6] = wms.getLockReason(item[6]);
        return item;
      });

      // 将库管系统数据合并
      dataSource.header = [
        ...dataSource.header.slice(0, 8),
        '锁车状态(库管系统)',
        '工艺(库管系统)',
        '完成状态(调度服务)',
        ...dataSource.header.slice(9, 12)
      ];
      dataSource.data = dataSource.data.map((item) => {
        let iTemp = item.slice(0, 8);
        let lockStatus = abnormalWMS.data.filter(
          (wmsItem) => wmsItem[2] === item[1]
        );
        if (lockStatus.length === 0) {
          iTemp = [...iTemp, '', ''];
        } else {
          iTemp = [...iTemp, lockStatus[0][5], lockStatus[0][7]];
        }
        return [...iTemp, ...item.slice(8, 12)];
      });

      yield put({
        type: 'save',
        payload: {
          dataSource
        }
      });

      yield put({
        type: 'saveWMS',
        payload: {
          abnormalWMS
        }
      });
      yield put({
        type: 'setLoading',
        payload: {
          loading: false
        }
      });
    },
    *getProc(_, { put, call }) {
      let proc = yield call(db.getPrintAbnormalProd);
      yield put({
        type: 'setProc',
        payload: proc.data
      });
    },
    *getOperatorList(_, { put, call }) {
      let { data: operatorList } = yield call(db.getUserList);

      yield put({
        type: 'setStore',
        payload: {
          operatorList
        }
      });
    },
    *updateAllCheckList(
      {
        payload: {
          daterange: [tstart, tend]
        }
      },
      { put, call }
    ) {
      yield put({
        type: 'setStore',
        payload: {
          dateRange: [tstart, tend]
        }
      });

      let allCheckList = yield call(db.getVCbpcCartlist, {
        tstart,
        tend,
        tstart2: tstart,
        tend2: tend
      });

      yield put({
        type: 'setStore',
        payload: { allCheckList }
      });
    },
    // 核查排产
    *getHechaTask(
      {
        payload: { params }
      },
      { put, call }
    ) {
      yield put({
        type: 'setStore',
        payload: {
          hechaLoading: true,
          hechaTask: { task_list: [], unhandle_carts: [], unupload_carts: [] }
        }
      });
      let hechaTask = yield call(db.getHechaTasks, params);

      yield put({
        type: 'setStore',
        payload: {
          hechaTask,
          hechaLoading: false
        }
      });
    },
    *loadHechaTask(_, { put, call }) {
      yield put({
        type: 'setStore',
        payload: {
          hechaLoading: true
        }
      });
      let {
        data: [{ task_info, rec_time }]
      } = yield call(db.getPrintHechatask);

      let hechaTask = JSON.parse(task_info);
      yield put({
        type: 'setStore',
        payload: {
          hechaTask,
          hechaLoading: false,
          rec_time
        }
      });
    },
    *loadPfNums(_, { put, call, select }) {
      yield put({
        type: 'setStore',
        payload: {
          hechaLoading: true
        }
      });
      const store = yield select((state) => state[namespace]);
      const {
        dateRange: [tstart, tend]
      } = store;

      let { data: pfNums } = yield call(db.getQfmWipProdLogs, {
        tstart,
        tend,
        tstart2: tstart,
        tend2: tend,
        tstart3: tstart,
        tend3: tend,
        tstart4: tstart,
        tend4: tend
      });
      yield put({
        type: 'setStore',
        payload: {
          pfNums,
          hechaLoading: false
        }
      });
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(async ({ pathname, query }) => {
        const match = pathToRegexp('/' + namespace).exec(pathname);

        const [tstart, tend] = dateRanges['本月'];
        const [ts, te] = [tstart.format('YYYYMMDD'), tend.format('YYYYMMDD')];

        await dispatch({
          type: 'setStore',
          payload: {
            dateRange: [ts, te]
          }
        });

        if (match && match[0] === '/' + namespace) {
          dispatch({
            type: 'handleReportData'
          });

          dispatch({
            type: 'getProc'
          });

          dispatch({
            type: 'getLockCart'
          });
        }

        // 自动排产载入人员信息
        if (pathname === `/${namespace}/task`) {
          dispatch({
            type: 'getOperatorList'
          });

          dispatch({
            type: 'loadHechaTask'
          });

          dispatch({
            type: 'loadPfNums'
          });

          const [tstart, tend] = dateRanges['昨天'];
          const [ts, te] = [tstart.format('YYYYMMDD'), tend.format('YYYYMMDD')];
          dispatch({
            type: 'updateAllCheckList',
            payload: { daterange: [ts, te] }
          });
        }
      });
    }
  }
};
