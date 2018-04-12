import pathToRegexp from "path-to-regexp";
import * as db from "../services/Newproc";
import dateRanges from "../../../utils/ranges";
const namespace = "newproc";
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
    procList: [],
    machineList: []
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
    setProc(state, { payload: procList }) {
      return {
        ...state,
        procList
      };
    },
    setMachineList(state, { payload: machineList }) {
      return {
        ...state,
        machineList
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

      let data = yield call(db.getViewPrintNewprocPlan, {
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
    *getMachineList(payload, { call, put }) {
      let { data } = yield call(db.getTBBASEMACHINEINFO);
      yield put({
        type: "setMachineList",
        payload: data
      });
    },
    *getProc(payload, { put, select, call }) {
      // let proc = yield call(db.getPrintAbnormalProd);
      // yield put({
      //   type: "setProc",
      //   payload: proc.data
      // });
      yield put({
        type: "setProc",
        payload: [
          {
            proc_name: "新设备"
          },
          {
            proc_name: "新工艺"
          },
          {
            proc_name: "新技术"
          },
          {
            proc_name: "新产品"
          },
          {
            proc_name: "其它"
          }
        ]
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
          dispatch({ type: "getMachineList" });

          dispatch({ type: "getProc" });
        }
      });
    }
  }
};