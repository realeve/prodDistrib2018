import pathToRegexp from "path-to-regexp";
import * as db from "../services/weaklist";
import dateRanges from "../../../utils/ranges";

const namespace = "weaklistConf";
export default {
  namespace,
  state: {
    dateRange: []
  },
  reducers: {
    setDateRange(state, {
      payload: dateRange
    }) {
      return {
        ...state,
        dateRange
      };
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
        const match = pathToRegexp("/weaklist").exec(pathname);
        if (match && match[0] === "/weaklist") {
          const [tstart, tend] = dateRanges["最近一月"];
          const [ts, te] = [tstart.format("YYYYMMDD"), tend.format("YYYYMMDD")];
          dispatch({
            type: "setDateRange",
            payload: [ts, te]
          });

          const config = db.getQueryConfig({
            ...query,
            tstart: ts,
            tend: te
          });
          await dispatch(config);
        }
      });
    }
  }
};
