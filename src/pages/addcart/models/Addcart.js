import pathToRegexp from "path-to-regexp";
import * as db from "../services/Addcart";
import dateRanges from "../../../utils/ranges";
const R = require("ramda");

const namespace = "addcart";
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
    dateRange: [],
    machines: [],
    productList: [],
    procList: []
  },
  reducers: {
    save(state, { payload: { dataSrc, dataSource, total } }) {
      return { ...state, dataSrc, dataSource, total };
    },
    setColumns(state, { payload: { dataClone, columns } }) {
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
    },
    setMachines(state, { payload: machines }) {
      return {
        ...state,
        machines
      };
    },
    setProduct(state, { payload: productList }) {
      return {
        ...state,
        productList
      };
    },
    setProc(state, { payload: procList }) {
      return {
        ...state,
        procList
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
    *handleReportData(payload, { call, put, select }) {
      const store = yield select(state => state[namespace]);
      const { pageSize, page, dateRange } = store;

      let data = yield call(db.getViewPrintAbnormalProd, {
        tstart: dateRange[0],
        tend: dateRange[1]
      });

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
        filteredInfo: {},
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
    *getMachines(payload, { put, select, call }) {
      let machines = yield call(db.getMachine);
      yield put({
        type: "setMachines",
        payload: R.map(R.nth(0))(machines.data)
      });
    },
    *getProducts(payload, { put, select, call }) {
      let products = yield call(db.getProduct);
      yield put({
        type: "setProduct",
        payload: products.data
      });
    },
    *getProc(payload, { put, select, call }) {
      let proc = yield call(db.getPrintAbnormalProd);
      yield put({
        type: "setProc",
        payload: proc.data
      });
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(async ({ pathname, query }) => {
        const match = pathToRegexp("/" + namespace).exec(pathname);
        if (match && match[0] === "/" + namespace) {
          const [tstart, tend] = dateRanges["本周"];
          const [ts, te] = [tstart.format("YYYYMMDD"), tend.format("YYYYMMDD")];

          await dispatch({
            type: "updateDateRange",
            payload: [ts, te]
          });
          dispatch({
            type: "handleReportData"
          });
          dispatch({ type: "getMachines" });
          dispatch({ type: "getProducts" });
          dispatch({ type: "getProc" });
        }
      });
    }
  }
};
