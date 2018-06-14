import pathToRegexp from "path-to-regexp";
import dateRanges from "../../../utils/ranges";
import * as db from '../services/multiweak';

const namespace = "multiweak";
export default {
  namespace,
  state: {
    dataWeakList: [],
    dateRange: []
  },
  reducers: {
    setStore(state, {
      payload
    }) {
      return { ...state,
        ...payload
      };
    }
  },
  effects: {
    * getData(payload, {
      call,
      put,
      select
    }) {
      const {
        dateRange
      } = yield select(state => state[namespace]);

      let dataWeakList = yield call(db.getViewPrintMachinecheckMultiweak, {
        tstart: dateRange[0],
        tend: dateRange[1]
      });

      yield put({
        type: "setStore",
        payload: {
          dataWeakList
        }
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
            type: "setStore",
            payload: {
              dateRange: [ts, te]
            }
          });

          dispatch({
            type: "getData"
          });
        }
      });
    }
  }
};
