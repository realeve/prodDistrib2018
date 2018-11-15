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
    prodList: []
  },
  reducers: {
    setStore
  },
  effects: {
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

      let params = {
        prod2: 150,
        prod3: 150,
        prod4: 150,
        prod6: 150,
        prod7: 150
      };
      prodList.map(({ prod_name, limit }) => {
        switch (prod_name) {
          case '9602A':
            params.prod2 = limit;
            break;
          case '9603A':
            params.prod3 = limit;
            break;
          case '9604A':
            params.prod4 = limit;
            break;
          case '9606A':
            params.prod6 = limit;
            break;
          case '9607T':
            params.prod7 = limit;
            break;
          default:
            break;
        }
      });
      // 开包量超过设定值产品
      let { data: abnormalList } = yield call(
        db.getVwWimWhitelistAbnormal(params)
      );

      yield put({
        type: 'setStore',
        payload: {
          machineList,
          procTypeList,
          workTypeList,
          produceProdList,
          prodList,
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
