import pathToRegexp from "path-to-regexp";
import * as db from "../services/Addcart";
import dateRanges from "@/utils/ranges";
import wms from "../../index_task/services/wms";
import { setStore } from "@/utils/lib";

import * as R from "ramda";

const sortCarts = arr => {
  let res = arr.sort((a, b) => {
    let res = a[3].localeCompare(b[3]);
    if (res === 0) {
      res = a[4].localeCompare(b[4]);
      if (res === 0) {
        res = a[2].localeCompare(b[2]);
      }
    }
    return res;
  });
  res = res.map(([idx, ...item], i) => [i + 1, ...item]);
  return res;
};
function* getCarts(task_list, call) {
  const printCartList = {
    data: [],
    rows: task_list.length,
    time: "",
    title: "图核判废确认单",
    header: [
      "序号",
      "车号",
      "冠字",
      "类型",
      "品种",
      "判废量",
      "判废人员",
      "判废日期",
      "确认签字"
    ]
  };
  let idx = 0;
  printCartList.data = task_list.map(
    ({
      proc_name,
      user_name,
      cart_number,
      product_name,
      pf_num,
      operate_date
    }) => [
      idx++,
      cart_number,
      "",
      proc_name,
      product_name,
      pf_num,
      user_name,
      operate_date,
      "  "
    ]
  );

  // 获取冠字信息
  let carts = R.pluck(1)(printCartList.data);

  let { data: cartInfo } = yield call(db.getVCbpcCartLite, carts);
  printCartList.data = printCartList.data.map(item => {
    let cart = item[1];
    let res = R.find(R.propEq("cart", cart))(cartInfo);
    if (res) {
      item[2] = res.gz;
    }
    return item;
  });

  printCartList.data = sortCarts(printCartList.data);

  return printCartList;
}

// export const handleCarts = async task_list => {
//   const printCartList = {
//     data: [],
//     rows: 0,
//     time: "",
//     title: "图核判废确认单",
//     header: [
//       "序号",
//       "车号",
//       "冠字",
//       "类型",
//       "品种",
//       "判废量",
//       "判废人员",
//       "确认签字"
//     ]
//   };

//   let idx = 1;
//   task_list.forEach(({ user_name, data }) => {
//     let res = data.map(({ type, cart_number, product_name, pf_num }) => [
//       idx++,
//       cart_number,
//       "",
//       ["码后", "丝印", "涂布"][type],
//       product_name,
//       pf_num,
//       user_name,
//       "  "
//     ]);
//     printCartList.data = [...printCartList.data, ...res];
//   });
//   printCartList.rows = printCartList.data.length;

//   // 获取冠字信息
//   let carts = R.pluck(1)(printCartList.data);

//   let { data: cartInfo } = await db.getVCbpcCartLite(carts);

//   printCartList.data = printCartList.data.map(item => {
//     let cart = item[1];
//     let res = R.find(R.propEq("cart", cart))(cartInfo);
//     if (res) {
//       item[2] = res.gz;
//     }
//     return item;
//   });
//   printCartList.data = sortCarts(printCartList.data);

//   return printCartList;
// };

export const handleTasklist = hechaTask => {
  let taskList = hechaTask.task_list;
  let sum = 0,
    prodList = [];
  let srcList = {};

  // 7T码后及涂布抽检，其它不抽检
  let needCheck = detail =>
    (detail.type == 0 && detail.product_name == "9607T") || detail.type == 2;

  // 求和
  taskList.forEach(item => {
    item.data.forEach(detail => {
      if (needCheck(detail)) {
        prodList.push(detail.product_name);
        sum += detail.pf_num;
      }
    });
  });
  prodList = R.uniq(prodList);

  // 抽检比5%;
  sum = sum * 0.05;
  if (prodList.length == 0) {
    return hechaTask;
  }

  // 平均条数
  let avg = sum / prodList.length;
  taskList.forEach(item => {
    item.data.forEach(detail => {
      if (needCheck(detail)) {
        if (typeof srcList[detail.product_name] == "undefined") {
          srcList[detail.product_name] = [detail];
        } else {
          srcList[detail.product_name].push(detail);
        }
      }
    });
  });

  let cartList = prodList.map(key => {
    srcList[key] = srcList[key].sort((a, b) => a.pf_num - b.pf_num);
    let status = false;
    let result = "";
    srcList[key].forEach(item => {
      if (!status && item.pf_num > avg) {
        status = true;
        result = item.cart_number;
      }
    });
    // 如果某品种没有满足条件的，以最多的一万为准
    if (!status) {
      result = R.last(srcList[key]).cart_number;
    }
    return result;
  });

  hechaTask.task_list = hechaTask.task_list.map(item => {
    item.data = item.data.map(detail => {
      if (cartList.includes(detail.cart_number)) {
        detail.is_check = true;
      } else {
        detail.is_check = false;
      }
      return detail;
    });
    return item;
  });

  return hechaTask;
};

const namespace = "addcart";
export default {
  namespace,
  state: {
    dataSource: [],
    dateRange: [],
    abnormalTypeList: [],
    abnormalWMS: [],
    lockInfo: {
      checkByWeek: 0,
      abnormal: 0
    },
    operatorList: [],
    hechaTask: { task_list: [], unhandle_carts: [], unupload_carts: [] },
    hechaLoading: false,
    rec_time: "",
    pfNums: [],
    allCheckList: {},
    pfList: {},
    remarkData: {},
    printCartList: { rows: 0, data: [] }
  },
  reducers: {
    setStore,
    save(
      state,
      {
        payload: { dataSource }
      }
    ) {
      return { ...state, dataSource };
    },
    setDateRange(state, { payload: dateRange }) {
      return {
        ...state,
        dateRange
      };
    },
    setProc(state, { payload: abnormalTypeList }) {
      return {
        ...state,
        abnormalTypeList
      };
    },
    saveWMS(
      state,
      {
        payload: { abnormalWMS }
      }
    ) {
      return {
        ...state,
        abnormalWMS
      };
    },
    saveLockInfo(
      state,
      {
        payload: { lockInfo }
      }
    ) {
      return {
        ...state,
        lockInfo
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
    *getLockCart(_, { call, put, select }) {
      const [ts, te] = dateRanges["本周"];
      const [tstart, tend] = [ts.format("YYYYMMDD"), te.format("YYYYMMDD")];

      // 获取每周人工拉号锁车产品信息
      let { data } = yield call(db.getPrintSampleCartlist, {
        tstart,
        tend,
        tstart2: tstart,
        tend2: tend
      });
      // console.log(data)

      let lockInfo = {
        checkByWeek: 0,
        abnormal: 0
      };

      data.forEach(({ num, type }) => {
        if (type === "1") {
          lockInfo.checkByWeek = num;
        } else {
          lockInfo.abnormal = num;
        }
      });

      yield put({
        type: "saveLockInfo",
        payload: {
          lockInfo
        }
      });
    },
    *handleReportData(_, { call, put, select }) {
      yield put({
        type: "save",
        payload: {
          dataSource: []
        }
      });

      yield put({
        type: "saveWMS",
        payload: {
          abnormalWMS: []
        }
      });

      const store = yield select(state => state[namespace]);
      const { dateRange } = store;

      let dataSource = yield call(db.getViewPrintAbnormalProd, {
        tstart: dateRange[0],
        tend: dateRange[1],
        only_lock_cart: 0
      });

      // 车号列表
      let carts = R.map(R.nth(1))(dataSource.data);
      if (R.isNil(carts) || carts.length === 0) {
        return;
      }
      let abnormalWMS = yield call(db.getTbstock, carts);
      abnormalWMS.data = abnormalWMS.data.map(item => {
        item[6] = wms.getLockReason(item[6]);
        return item;
      });

      // 将库管系统数据合并
      dataSource.header = [
        ...dataSource.header.slice(0, 8),
        "锁车状态(库管系统)",
        "工艺(库管系统)",
        "完成状态(调度服务)",
        ...dataSource.header.slice(9, 12)
      ];
      dataSource.data = dataSource.data.map(item => {
        let iTemp = item.slice(0, 8);
        let lockStatus = abnormalWMS.data.filter(
          wmsItem => wmsItem[2] === item[1]
        );
        if (lockStatus.length === 0) {
          iTemp = [...iTemp, "", ""];
        } else {
          iTemp = [...iTemp, lockStatus[0][5], lockStatus[0][7]];
        }
        return [...iTemp, ...item.slice(8, 12)];
      });

      yield put({
        type: "save",
        payload: {
          dataSource
        }
      });

      yield put({
        type: "saveWMS",
        payload: {
          abnormalWMS
        }
      });
      yield put({
        type: "setLoading",
        payload: {
          loading: false
        }
      });
    },
    *getProc(_, { put, call }) {
      let proc = yield call(db.getPrintAbnormalProd);
      yield put({
        type: "setProc",
        payload: proc.data
      });
    },
    *getRemarkData(_, { put, call, select }) {
      const store = yield select(state => state[namespace]);
      const { dateRange } = store;
      let remarkData = yield call(db.getVCbpcCartcare, {
        tstart: dateRange[0],
        tend: dateRange[1]
      });
      yield put({
        type: "setStore",
        payload: { remarkData }
      });
    },
    *getOperatorList(_, { put, call }) {
      let { data: operatorList } = yield call(db.getUserList);

      yield put({
        type: "setStore",
        payload: {
          operatorList
        }
      });
    },
    *updateAllCheckList(
      {
        payload: {
          daterange: [tstart, tend]
        }
      },
      { put, call }
    ) {
      yield put({
        type: "setStore",
        payload: {
          dateRange: [tstart, tend]
        }
      });

      // TODO 获取M97打印车号列表对应的车号名单
      let allCheckList = yield call(db.getVCbpcCartlist, {
        tstart,
        tend,
        tstart2: tstart,
        tend2: tend
      });

      // TODO 需要优化查询语句，只处理当天判废的
      let printCartList = yield call(db.getPFLogs, { tstart, tend });

      // let printCartList = yield getCarts(details, call);

      yield put({
        type: "setStore",
        payload: { allCheckList, printCartList }
      });
    },
    // 核查排产
    *getHechaTask(
      {
        payload: { params }
      },
      { put, call }
    ) {
      console.log("start now", params);
      yield put({
        type: "setStore",
        payload: {
          hechaLoading: true,
          hechaTask: { task_list: [], unhandle_carts: [], unupload_carts: [] }
        }
      });
      let hechaTask = yield call(db.getHechaTasks, params);
      hechaTask = handleTasklist(hechaTask);

      // console.log(hechaTask);
      yield put({
        type: "setStore",
        payload: {
          hechaTask,
          hechaLoading: false
        }
      });
    },
    *loadHechaTask(_, { put, call }) {
      yield put({
        type: "setStore",
        payload: {
          hechaLoading: true
        }
      });
      let {
        data: [{ task_info, rec_time }]
      } = yield call(db.getPrintHechatask);
      let hechaTask = JSON.parse(task_info);

      yield put({
        type: "setStore",
        payload: {
          hechaTask,
          hechaLoading: false,
          rec_time
        }
      });
    },
    *loadPfNums(_, { put, call, select }) {
      yield put({
        type: "setStore",
        payload: {
          hechaLoading: true
        }
      });
      const store = yield select(state => state[namespace]);
      const {
        dateRange: [tstart, tend]
      } = store;

      let { data: pfNums } = yield call(db.getQfmWipProdLogs, {
        tstart,
        tend,
        tstart2: tstart,
        tend2: tend,
        tstart3: tstart,
        tend3: tend,
        tstart4: tstart,
        tend4: tend
      });

      let { data: codeNumCount } = yield call(db.getWipProdLogsCodeCount, {
        tstart,
        tend
      });

      codeNumCount.forEach(item => {
        let idx = pfNums.findIndex(
          all => all.operator_name == item.operator_name
        );
        if (idx < 0) {
          pfNums.push({
            ...item,
            pf_num: 0,
            check_num: 0,
            total_num: item.code_num
          });
        } else {
          pfNums[idx].code_num = parseInt(item.code_num, 10);
          pfNums[idx].cart_nums =
            parseInt(pfNums[idx].cart_nums, 10) + parseInt(item.cart_nums, 10);
          pfNums[idx].total_num =
            parseInt(pfNums[idx].total_num, 10) + pfNums[idx].code_num;
        }
      });

      let res = yield call(db.getWipProdLogs, {
        tstart: tend,
        tend,
        tstart2: tend,
        tend2: tend,
        tstart3: tend,
        tend3: tend,
        tstart4: tend,
        tend4: tend
      });

      // 号码数据同票面数据合并
      let codeList = yield call(db.getWipProdLogsCode, {
        tstart: tend,
        tend
      });
      res.data = res.data.map(item => {
        item.push(0);
        return item;
      });
      codeList.data = [...res.data, ...codeList.data];
      codeList.rows = codeList.data.length;

      let allCheckList = yield call(db.getVCbpcCartlist, {
        tstart,
        tend,
        tstart2: tstart,
        tend2: tend
      });

      let printCartList = yield call(db.getPFLogs, { tstart, tend });

      yield put({
        type: "setStore",
        payload: {
          pfNums,
          pfList: codeList,
          hechaLoading: false,
          printCartList,
          allCheckList
        }
      });
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(async ({ pathname, query }) => {
        const match = pathToRegexp("/" + namespace).exec(pathname);

        const [tstart, tend] = dateRanges["本月"];
        const [ts, te] = [tstart.format("YYYYMMDD"), tend.format("YYYYMMDD")];

        if (match && match[0] === "/" + namespace) {
          await dispatch({
            type: "setStore",
            payload: {
              dateRange: [ts, te]
            }
          });
          dispatch({
            type: "handleReportData"
          });

          dispatch({
            type: "getProc"
          });

          dispatch({
            type: "getLockCart"
          });
        }

        // 自动排产载入人员信息
        if (pathname === `/${namespace}/task`) {
          const [tstart, tend] = dateRanges["今天"];
          const [ts, te] = [tstart.format("YYYYMMDD"), tend.format("YYYYMMDD")];
          await dispatch({
            type: "setStore",
            payload: {
              dateRange: [ts, te]
            }
          });

          dispatch({
            type: "getOperatorList"
          });

          dispatch({
            type: "loadHechaTask"
          });
          dispatch({
            type: "getRemarkData"
          });
          dispatch({
            type: "loadPfNums"
          });

          dispatch({
            type: "updateAllCheckList",
            payload: { daterange: [ts, te] }
          });
        }
      });
    }
  }
};
