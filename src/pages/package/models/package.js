import pathToRegexp from 'path-to-regexp';
import dateRanges from '../../../utils/ranges';
import * as db from '../services/package';

import { setStore } from '@/utils/lib';
const namespace = 'package';
export default {
  namespace,
  state: {
    machineList: [],
    procTypeList: [],
    workTypeList: [],
    produceProdList: [],
    lockList: []
  },
  reducers: {
    setStore
  },
  effects: {
    *getData(_, { call, put }) {
      let { data: machineList } = yield call(db.getPrintCutMachine);
      let { data: procTypeList } = yield call(db.getPrintCutProcList);
      let { data: workTypeList } = yield call(db.getPrintCutWorktype);
      let { data: produceProdList } = yield call(db.getViewCartfinder);
      let { data: lockList } = yield call(db.getVwWimWhitelist);
      yield put({
        type: 'setStore',
        payload: {
          machineList,
          procTypeList,
          workTypeList,
          produceProdList,
          lockList
        }
      });
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(async ({ pathname, query }) => {
        const match = pathToRegexp('/' + namespace).exec(pathname);
        if (match && match[0] === '/' + namespace) {
          dispatch({
            type: 'getData'
          });
        }
      });
    }
  }
};
