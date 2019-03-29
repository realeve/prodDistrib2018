import pathToRegexp from 'path-to-regexp';
import * as db from '../services/tasks';
import dateRanges from '../../../utils/ranges';
import wms from '../../index/services/wms';
const R = require('ramda');

const namespace = 'taskGet';
export default {
  namespace,
  state: {
    dataSource: [],
    dateRange: [],
    dataSrcNewproc: [],
    dataComplete: []
  },
  reducers: {
    saveNewproc(state, { payload: dataSrcNewproc }) {
      return {
        ...state,
        dataSrcNewproc
      };
    },
    save(
      state,
      {
        payload: { dataSource, dataComplete }
      }
    ) {
      return {
        ...state,
        dataSource,
        dataComplete
      };
    },
    refreshTable(state, { payload: dataSource }) {
      return {
        ...state,
        dataSource
      };
    },
    setDateRange(state, { payload: dateRange }) {
      return {
        ...state,
        dateRange
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
    *handleTaskData(payload, { call, put, select }) {
      const store = yield select((state) => state[namespace]);
      const { dateRange } = store;
      let params = {
        tstart: dateRange[0],
        tend: dateRange[1]
      };
      let dataSource = yield call(
        // getPrintSampleCartlistAll
        db.getPrintSampleCartlist,
        {
          ...params,
          status: 0
        }
      );

      // 已领用车号列表
      let dataComplete = yield call(db.getPrintSampleCartlist, {
        ...params,
        status: 1
      });

      dataComplete.title = '本周已领用车号列表';

      let { header, data } = dataSource;
      dataSource.header = [
        header[0],
        '四新或异常品',
        '允许拉号时间',
        '出库状态',
        '产品工序',
        ...header.slice(1)
      ];
      let manulCarts = R.map(R.nth(0))(data);
      let dataSrcNewproc = yield call(db.getPrintWmsProclist, params);
      let newProcCarts = R.map(R.nth(0))(dataSrcNewproc.data);
      console.log(newProcCarts, dataSrcNewproc);
      console.log([...manulCarts, ...newProcCarts]);
      // 产品干燥状态
      let dryingList = yield call(db.getTbDryingstatusTask, [
        ...manulCarts,
        ...newProcCarts
      ]);

      data = data.map((item) => {
        let status = newProcCarts.includes(item[0]);
        let dryingInfo = R.find(R.propEq(0, item[0]))(dryingList.data);
        let dryingStatus = ['', '', ''];
        if (!R.isNil(dryingInfo)) {
          let { psname } = wms.getProcStatus(dryingInfo[1]);

          dryingStatus = [
            dryingInfo[2],
            dryingInfo[3] === '1' ? '允许出库' : '禁止出库',
            psname
          ];
        }
        return [item[0], status, ...dryingStatus, ...item.slice(1)];
      });
      data = data.sort((a, b) => a[1] - b[1]);
      dataSource.data = data.map((item) => {
        item[1] = item[1] ? '是' : '否';
        return item;
      });

      dataSrcNewproc.header = [
        ...dataSrcNewproc.header.slice(0, 4),
        '允许拉号时间',
        '出库状态',
        '产品工序',
        ...dataSrcNewproc.header.slice(4)
      ];
      dataSrcNewproc.data = dataSrcNewproc.data.map((item) => {
        let dryingInfo = R.find(R.propEq(0, item[0]))(dryingList.data);
        let dryingStatus = ['', '', ''];
        if (!R.isNil(dryingInfo)) {
          let { psname } = wms.getProcStatus(dryingInfo[1]);
          dryingStatus = [
            dryingInfo[2],
            dryingInfo[3] === '1' ? '允许出库' : '禁止出库',
            psname
          ];
        }
        return [...item.slice(0, 4), ...dryingStatus, ...item.slice(4)];
      });

      yield put({
        type: 'saveNewproc',
        payload: dataSrcNewproc
      });

      yield put({
        type: 'save',
        payload: {
          dataSource,
          dataComplete
        }
      });
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(async ({ pathname, query }) => {
        const match = pathToRegexp('/task').exec(pathname);
        if (match && match[0] === '/task') {
          const [tstart, tend] = dateRanges['最近一月'];
          const [ts, te] = [tstart.format('YYYYMMDD'), tend.format('YYYYMMDD')];
          await dispatch({
            type: 'updateDateRange',
            payload: [ts, te]
          });
          dispatch({
            type: 'handleTaskData'
          });
        }
      });
    }
  }
};
