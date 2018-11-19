import pathToRegexp from 'path-to-regexp';
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
    lockList: [],
    unCompleteList: [],
    abnormalList: [],
    prodList: [],
    prodResult: []
  },
  reducers: {
    setStore
  },
  effects: {
    *refreshPreview(_, { call, put }) {
      // 排产结果
      let prodResult = yield call(db.getViewPrintCutProdLog);
      yield put({
        type: 'setStore',
        payload: {
          prodResult
        }
      });
    },
    *refreshMachineList(_, { call, put }) {
      let { data: machineList } = yield call(db.getPrintCutMachine);
      yield put({
        type: 'setStore',
        payload: {
          machineList
        }
      });
    },
    *getData(_, { call, put }) {
      // 机台列表
      let { data: machineList } = yield call(db.getPrintCutMachine);
      // 工艺
      let { data: procTypeList } = yield call(db.getPrintCutProcList);
      // 班次
      let { data: workTypeList } = yield call(db.getPrintCutWorktype);
      //
      let { data: produceProdList } = yield call(db.getViewCartfinder);
      // 锁车列表
      let { data: lockList } = yield call(db.getVwWimWhitelist);
      lockList = lockList.map((item) => {
        item.lock_reason = item.lock_reason.replace('锁车', '');
        return item;
      });

      // 未完工列表
      let { data: unCompleteList } = yield call(db.getVwWimWhitelistUncomplete);

      // 品种阈值
      let { data: prodList } = yield call(db.getProductdata);

      let params = yield call(db.getThreadByProdname, prodList);

      // 开包量超过设定值产品
      let { data: abnormalList } = yield call(
        db.getVwWimWhitelistAbnormal,
        params
      );

      // 排产结果
      let prodResult = yield call(db.getViewPrintCutProdLog);

      yield put({
        type: 'setStore',
        payload: {
          machineList,
          procTypeList,
          workTypeList,
          produceProdList,
          prodList,
          prodResult,
          abnormalList: [
            {
              prodname: '品种',
              gh: '冠号',
              carno: '大万号',
              open_num: '开包量',
              tech: '工艺'
            },
            ...abnormalList
          ],
          lockList: [
            {
              prodname: '品种',
              gh: '冠号',
              carno: '大万号',
              open_num: '开包量',
              tech: '工艺',
              lock_reason: '锁车原因'
            },
            ...lockList
          ],
          unCompleteList: [
            {
              prodname: '品种',
              carno: '大万号',
              open_num: '开包量'
            },
            ...unCompleteList
          ]
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
