import pathToRegexp from "path-to-regexp";
import * as db from "../services/table";
import dateRanges from "../../../utils/ranges";

const namespace = "tableConf";
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
        const match = pathToRegexp("/").exec(pathname);

        if (match && match[0] === "/") {
          const [tstart, tend] = dateRanges["上周"];
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
          await dispatch({
            type: "tasks/fetchSampledData",
            payload: {
              tstart: ts,
              tend: te
            }
          });

          await dispatch({
            type: "tasks/handleTaskData"
          });
        }
      });
    }
  }
};
