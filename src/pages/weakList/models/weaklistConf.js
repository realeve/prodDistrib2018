import pathToRegexp from "path-to-regexp";
import * as db from "../services/weaklist";
import dateRanges from "../../../utils/ranges";

const namespace = "weaklistConf";
export default {
  namespace,
  state: {
    // tid: "",
    dateRange: []
  },
  reducers: {
    // setTid(state, { payload: tid }) {
    //   return {
    //     ...state,
    //     tid
    //   };
    // },
    setDateRange(state, { payload: dateRange }) {
      return {
        ...state,
        dateRange
      };
    }
  },
  effects: {
    // *updateTid({ payload: tid }, { put }) {
    //   yield put({
    //     type: "setTid",
    //     payload: tid
    //   });
    // },
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
        const match = pathToRegexp("/weaklist").exec(pathname);
        if (match && match[0] === "/weaklist") {
          const [tstart, tend] = dateRanges["本周"];
          const [ts, te] = [tstart.format("YYYYMMDD"), tend.format("YYYYMMDD")];
          dispatch({
            type: "setDateRange",
            payload: [ts, te]
          });

          const config = db.getQueryConfig({
            ...query,
            // tid,
            tstart: ts,
            tend: te
          });
          await dispatch(config);
          await dispatch({
            type: "weaklist/fetchSampledData",
            payload: { tstart: ts, tend: te }
          });
          await dispatch({
            type: "weaklist/fetchSampledMachines",
            payload: { tstart: ts, tend: te }
          });
          await dispatch({
            type: "weaklist/handleTaskData"
          });
        }
      });
    }
  }
};
