import pathToRegexp from 'path-to-regexp';
import * as db from '../services/Proclist';
import userTool from '../utils/users';
import { setStore } from '@/utils/lib';
const namespace = 'common';
export default {
  namespace,
  state: {
    procList: [],
    productList: [],
    userSetting: {
      uid: '',
      name: '',
      avatar: ''
    },
    inited: false
  },
  reducers: {
    setStore
  },
  effects: {
    *getProclist(payload, { put, call, select }) {
      const store = yield select((state) => state[namespace]);
      const { inited } = store;
      if (inited) {
        return;
      }

      let { data } = yield call(db.getPrintNewprocType);
      yield put({
        type: 'setStore',
        payload: {
          procList: data
        }
      });
    },
    *getProduct(payload, { put, call, select }) {
      const store = yield select((state) => state[namespace]);
      const { inited } = store;
      if (inited) {
        return;
      }

      let { data } = yield call(db.getProduct);
      yield put({
        type: 'setStore',
        payload: {
          productList: data.map((item) => {
            item.name = item.name.trim();
            if (item.name == '9606品') {
              item.name = '9606T';
            }
            return item;
          })
        }
      });
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(async ({ pathname, query }) => {
        const match = pathToRegexp('/login').exec(pathname);
        if (match && match[0] === '/login') {
          return;
        }

        userTool.saveLastRouter(pathname);

        await dispatch({
          type: 'getProclist'
        });

        await dispatch({
          type: 'getProduct'
        });

        dispatch({
          type: 'setStore',
          payload: {
            inited: true
          }
        });
      });
    }
  }
};
