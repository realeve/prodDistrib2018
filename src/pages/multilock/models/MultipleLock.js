import pathToRegexp from 'path-to-regexp';
import * as db from '../services/MultipleLock';
import dateRanges from '../../../utils/ranges';
import wms from '../../index/services/wms';
const R = require('ramda');

const namespace = 'multilock';

export default {
  namespace,
  state: {
    dataSource: [],
    dateRange: [],
    abnormalTypeList: []
  },
  reducers: {
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
    }
  },
  effects: {
    *updateDateRange({ payload: dateRange }, { put }) {
      yield put({
        type: 'setDateRange',
        payload: dateRange
      });
    },
    *handleReportData(payload, { call, put, select }) {
      yield put({
        type: 'save',
        payload: {
          dataSource: []
        }
      });

      const store = yield select((state) => state[namespace]);
      const { dateRange } = store;

      let dataSource = yield call(db.getViewPrintAbnormalProd, {
        tstart: dateRange[0],
        tend: dateRange[1],
        tstart2: dateRange[0],
        tend2: dateRange[1],
        only_lock_cart: 1
      });

      // 车号列表
      let carts = R.map(R.nth(1))(dataSource.data);
      if (R.isNil(carts) || carts.length === 0) {
        return;
      }
      carts = R.uniq(carts);

      let abnormalWMS = yield call(db.getTbstock, carts);
      abnormalWMS.data = abnormalWMS.data.map((item) => {
        item[6] = wms.getLockReason(item[6]);
        return item;
      });
      // 将库管系统数据合并
      dataSource.header = [
        ...dataSource.header.slice(0, 4),
        '锁车状态(库管系统)',
        '工艺(库管系统)',
        '完成状态(调度服务)',
        ...dataSource.header.slice(5, 9)
      ];
      dataSource.data = dataSource.data.map((item) => {
        let iTemp = item.slice(0, 4);
        let lockStatus = abnormalWMS.data.filter(
          (wmsItem) => wmsItem[2] === item[1]
        );
        if (lockStatus.length === 0) {
          iTemp = [...iTemp, '', ''];
        } else {
          iTemp = [...iTemp, lockStatus[0][5], lockStatus[0][7]];
        }
        return [...iTemp, ...item.slice(4, 9)];
      });

      yield put({
        type: 'save',
        payload: {
          dataSource
        }
      });
    },
    *getProc(payload, { put, call }) {
      let proc = yield call(db.getPrintAbnormalProd);
      yield put({
        type: 'setProc',
        payload: proc.data
      });
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(async ({ pathname, query }) => {
        const match = pathToRegexp('/' + namespace).exec(pathname);
        if (match && match[0] === '/' + namespace) {
          const [tstart, tend] = dateRanges['最近一月'];
          const [ts, te] = [tstart.format('YYYYMMDD'), tend.format('YYYYMMDD')];
          await dispatch({
            type: 'updateDateRange',
            payload: [ts, te]
          });
          dispatch({
            type: 'handleReportData'
          });
          dispatch({
            type: 'getProc'
          });
        }
      });
    }
  }
};
