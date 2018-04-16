import pathToRegexp from "path-to-regexp";
import * as db from "../services/tasks";
import dateRanges from "../../../utils/ranges";

const namespace = "taskGet";
export default {
  namespace,
  state: {
    dataSource: [],
    dataSrc: [],
    dataClone: [],
    columns: [],
    total: null,
    page: 1,
    pageSize: 15,
    dateRange: []
  },
  reducers: {
    save(
      state,
      {
        payload: { dataSrc, dataSource, total }
      }
    ) {
      return { ...state, dataSrc, dataSource, total };
    },
    setColumns(
      state,
      {
        payload: { dataClone, columns }
      }
    ) {
      return {
        ...state,
        dataClone,
        columns
      };
    },
    setPage(state, { payload: page }) {
      return {
        ...state,
        page
      };
    },
    setPageSize(state, { payload: pageSize }) {
      return {
        ...state,
        pageSize
      };
    },
    refreshTable(state, { payload: dataSource }) {
      return {
        ...state,
        dataSource
      };
    },
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
    },
    *changePageSize({ payload: pageSize }, { put, select }) {
      yield put({
        type: "setPageSize",
        payload: pageSize
      });
    },
    *changePage({ payload: page }, { put, select }) {
      const store = yield select(state => state[namespace]);
      const { pageSize, dataClone } = store;
      const dataSource = db.getPageData({ data: dataClone, page, pageSize });

      yield put({
        type: "refreshTable",
        payload: dataSource
      });
      yield put({
        type: "setPage",
        payload: page
      });
    },
    *handleTaskData(payload, { call, put, select }) {
      const store = yield select(state => state[namespace]);
      const { pageSize, page } = store;

      let data = yield call(
        db.getPrintSampleCartlistAll
        //   , {
        //   tstart: dateRange[0],
        //   tend: dateRange[1]
        // }
      );

      let dataSource = [],
        dataClone = [];
      if (data.rows) {
        data.data = data.data.map((item, key) => {
          let col = { key };
          item.forEach((td, idx) => {
            col["col" + idx] = td;
          });
          return col;
        });
        dataClone = data.data;
        dataSource = db.getPageData({ data: dataClone, page, pageSize });
      }
      let columns = yield call(db.handleColumns, {
        dataSrc: data,
        // filteredInfo: {},
        sortedInfo: {}
      });

      yield put({
        type: "setColumns",
        payload: {
          dataClone,
          columns
        }
      });

      yield put({
        type: "save",
        payload: {
          dataSrc: data,
          dataSource,
          total: data.rows
        }
      });
    },
    *checkTask(
      {
        payload: { cart_number, keyId }
      },
      { call, select, put }
    ) {
      const store = yield select(state => state[namespace]);
      const { dataSource } = store;

      let data = yield call(db.setPrintSampleCartlist, {
        cart_number
      });

      if (data.rows) {
        yield call(db.setPrintSampleMachine, {
          cart1: cart_number,
          cart2: cart_number
        });

        // let data = R.reject(R.propEq("key", keyId))(dataSource);// 删除
        let data = dataSource.map(item => {
          if (item.key === keyId) {
            item.col6 = 1;
          }
          return item;
        });
        yield put({
          type: "refreshTable",
          payload: data
        });
      }
      return data.rows > 0;
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(async ({ pathname, query }) => {
        const match = pathToRegexp("/task").exec(pathname);
        if (match && match[0] === "/task") {
          const [tstart, tend] = dateRanges["上周"];
          const [ts, te] = [tstart.format("YYYYMMDD"), tend.format("YYYYMMDD")];

          // let data = await db.getPrintSampleCartlist({ tstart: ts, tend: te });

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
