import * as db from "../services/table";
import wms from "../services/wms";
import handler from "../services/preHandler";
import * as lib from "../../../utils/lib";
const R = require("ramda");

const namespace = "tasks";
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
    sampling: {},
    sampleStatus: 0,
    sampledCarts: [],
    sampledMachines: []
  },
  reducers: {
    save(
      state, {
        payload: {
          dataSrc,
          dataSource,
          total
        }
      }
    ) {
      return { ...state,
        dataSrc,
        dataSource,
        total
      };
    },
    setPage(state, {
      payload: page
    }) {
      return {
        ...state,
        page
      };
    },
    setPageSize(state, {
      payload: pageSize
    }) {
      return {
        ...state,
        pageSize
      };
    },
    refreshTable(state, {
      payload: dataSource
    }) {
      return {
        ...state,
        dataSource
        // total: dataSource.length
      };
    },
    setColumns(
      state, {
        payload: {
          dataClone,
          columns
        }
      }
    ) {
      return {
        ...state,
        dataClone,
        columns
      };
    },
    setSampling(state, {
      payload: sampling
    }) {
      return {
        ...state,
        sampling
      };
    },
    setSampleStatus(state, {
      payload: sampleStatus
    }) {
      return {
        ...state,
        sampleStatus
      };
    },
    setSampledCarts(state, {
      payload: sampledCarts
    }) {
      return {
        ...state,
        sampledCarts
      };
    },
    setSampledMachines(state, {
      payload: sampledMachines
    }) {
      return {
        ...state,
        sampledMachines
      };
    }
  },
  effects: {
    * changePageSize({
      payload: pageSize
    }, {
      put,
      select
    }) {
      yield put({
        type: "setPageSize",
        payload: pageSize
      });
    },
    * changePage({
      payload: page
    }, {
      put,
      select
    }) {
      const store = yield select(state => state.tasks);
      const {
        pageSize,
        dataClone
      } = store;
      const dataSource = db.getPageData({
        data: dataClone,
        page,
        pageSize
      });

      yield put({
        type: "refreshTable",
        payload: dataSource
      });
      yield put({
        type: "setPage",
        payload: page
      });
    },
    * fetchSampledData({
      payload: {
        tstart,
        tend
      }
    }, {
      call,
      put,
      select
    }) {
      let data = yield call(db.getSampledCartlist, {
        tstart,
        tend
      });
      let carts = R.compose(
        R.uniq(),
        R.map(R.prop(0)),
        R.filter(R.propEq(6, "1"))
      )(data.data);
      yield put({
        type: "setSampledCarts",
        payload: carts
      });
    },
    // 对尚未抽检的设备单独统计
    * fetchSampledMachines({
      payload: {
        tstart,
        tend
      }
    }, {
      call,
      put,
      select
    }) {
      let data = yield call(db.getPrintSampleMachine, {
        tstart,
        tend
      });

      let sampledMachines = R.compose(
        R.map(R.prop(0)),
        R.filter(R.propEq(3, "0"))
      )(data.data);
      yield put({
        type: "setSampledMachines",
        payload: sampledMachines
      });
    },
    * handleTaskData({
      payload
    }, {
      call,
      put,
      select
    }) {
      const store = yield select(state => state.tasks);
      let {
        dataSrc: data,
        columns
      } = yield select(state => state.table);

      const {
        pageSize,
        page,
        sampledMachines,
        sampledCarts
      } = store;

      // 车号列表，未确认是否在库
      let unStockedData = data.data.map(item => Object.values(item).slice(1));
      let uniqCarts = R.compose(
        R.uniqBy(R.prop(0)),
        R.filter(R.propEq(3, "印码"))
      )(unStockedData);

      let cartList = R.compose(R.uniq, R.map(R.nth(0)))(uniqCarts);
      let stockCarts = yield call(wms.getStockStatus, cartList);
      stockCarts = stockCarts.result;

      let stockData = [];
      if (stockCarts.length > 0) {
        stockCarts.forEach(item => {
          let stockItem = R.filter(R.propEq("0", item.carno))(unStockedData);
          stockData = [...stockData, ...stockItem];
        });
      }
      console.log("在库车号列表:", stockCarts);

      // 自动排活
      let disData = handler.init({
        data: unStockedData,
        sampledMachines,
        sampledCarts,
        stockData
      });

      const sampling = {
        taskInfo: {
          ...disData.taskInfo,
          machines: disData.machine.length,
          stockCount: stockCarts.length
        },
        weekDay: disData.weekDay,
        classDis: disData.className,
        save2db: {
          cartLog: disData.cartLog,
          machine: disData.machine
        }
      };

      let dataSource = [],
        dataClone = [];
      if (data.rows) {
        // 使用 disData.log 时全部只输出到印码
        dataClone = disData.taskList.map((item, key) => {
          let col = {
            key
          };
          item.forEach((td, idx) => {
            col["col" + idx] = td;
          });
          return col;
        });

        dataSource = db.getPageData({
          data: dataClone,
          page,
          pageSize
        });
      }

      yield put({
        type: "setColumns",
        payload: {
          dataClone,
          columns: R.map(item => ({
            title: item.title,
            dataIndex: item.dataIndex
          }))(columns)
        }
      });

      yield put({
        type: "save",
        payload: {
          dataSrc: data,
          dataSource,
          total: dataClone.length,
          dataSearchClone: []
        }
      });

      yield put({
        type: "setSampling",
        payload: sampling
      });

      data = yield call(db.getPrintSampleCartlist, {
        week_num: lib.weeks()
      });
      yield put({
        type: "setSampleStatus",
        payload: parseInt(data[0].nums, 10)
      });
    }
  }
};
