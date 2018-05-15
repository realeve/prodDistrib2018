import pathToRegexp from "path-to-regexp";
import * as db from "../services/tasks";
import dateRanges from "../../../utils/ranges";

const namespace = "taskGet";
export default {
  namespace,
  state: {
    dataSource: [],
    dateRange: [],
    dataSrcNewproc: []
  },
  reducers: {
    saveNewproc(state, {
      payload: dataSrcNewproc
    }) {
      return {
        ...state,
        dataSrcNewproc
      }
    },
    save(
      state, {
        payload: {
          dataSource,
        }
      }
    ) {
      return { ...state,
        dataSource,
      };
    },
    refreshTable(state, {
      payload: dataSource
    }) {
      return {
        ...state,
        dataSource
      };
    },
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
    },
    * handleTaskData(payload, {
      call,
      put,
      select
    }) {
      const store = yield select(state => state[namespace]);
      const {
        dateRange
      } = store;
      let params = {
        tstart: dateRange[0],
        tend: dateRange[1]
      };
      let dataSource = yield call(
        // getPrintSampleCartlistAll
        db.getPrintSampleCartlist, params
      );
      yield put({
        type: "save",
        payload: {
          dataSource,
        }
      });

      let dataSrcNewproc = yield call(db.getPrintWmsProclist, params);
      yield put({
        type: "saveNewproc",
        payload: dataSrcNewproc
      })
    },
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
        const match = pathToRegexp("/task").exec(pathname);
        if (match && match[0] === "/task") {
          const [tstart, tend] = dateRanges["最近一月"];
          const [ts, te] = [tstart.format("YYYYMMDD"), tend.format("YYYYMMDD")];
          await dispatch({
            type: "updateDateRange",
            payload: [ts, te]
          });
          dispatch({
            type: "handleTaskData"
          });
        }
      });
    }
  }
};
