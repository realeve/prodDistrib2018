import pathToRegexp from "path-to-regexp";
import * as db from "../services/table";
import dateRanges from "../../../utils/ranges";

const namespace = "taskConf";
export default {
  namespace,
  state: {
    dateRange: []
  },
  reducers: {
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
        type: "setDateRange",
        payload: dateRange
      });
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(async ({ pathname, query }) => {
        const match = pathToRegexp("/task").exec(pathname);

        if (match && match[0] === "/task") {
          const [tstart, tend] = dateRanges["本周"];
          const [ts, te] = [tstart.format("YYYYMMDD"), tend.format("YYYYMMDD")];

          let data = await db.getPrintSampleCartlist({ tstart: ts, tend: te });

          dispatch({
            type: "taskGet/handleTaskData",
            payload: data
          });

          dispatch({
            type: "setDateRange",
            payload: [ts, te]
          });
        }
      });
    }
  }
};
