import * as db from '../db';
import pathToRegexp from 'path-to-regexp';
import dateRanges from '../../../utils/ranges';

import { setStore } from '@/utils/lib';

const namespace = 'package_report';
export default {
  namespace,
  state: {
    dateRange: [],
    dataSrc: [],
    dataReal: []
  },
  reducers: {
    setStore
  },
  effects: {
    *fetchAPIData(
      {
        payload: { params }
      },
      { call, put }
    ) {
      let dataSrc = yield call(db.getPrintCutProdLog, params);
      let dataReal = yield call(db.getCartinfodata, params);
      yield put({
        type: 'setStore',
        payload: {
          dataSrc,
          dataReal
        }
      });
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(async ({ pathname, query }) => {
        const match = pathToRegexp('/' + namespace).exec(pathname);
        if (match && match[0] === '/' + namespace) {
          const [tstart, tend] = dateRanges['7天前'];
          const [ts, te] = [tstart.format('YYYYMMDD'), tend.format('YYYYMMDD')];
          dispatch({
            type: 'setStore',
            payload: {
              dateRange: [ts, te]
            }
          });

          // load default data
          const config = {
            type: 'fetchAPIData',
            payload: {
              params: { ...query, tstart: ts, tend: te }
            }
          };
          await dispatch(config);
        }
      });
    }
  }
};
