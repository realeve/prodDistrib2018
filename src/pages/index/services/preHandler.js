import setting from "./setting";
import {
  getViewCartfinderByCarts
} from './table'
const R = require("ramda");

// 数据预处理
const preHandle = data => {
  console.log("start:开始处理车号分配：");
  let uniqCarts = R.compose(R.uniqBy(R.prop(0)), R.filter(R.propEq(3, "印码")))(
    data
  );

  let cartChecks = Math.ceil(uniqCarts.length * setting.percent / 100);
  return {
    total: uniqCarts.length,
    checks: cartChecks
  };
};

// 统计各工序已开印机台数量
// const handleMachines = data => {
//   let getMachines = R.compose(
//     R.uniq,
//     R.map(item => ({
//       proc: item[3],
//       machine: item[5]
//     }))
//   );
//   let uniqMachines = getMachines(data);
//   let procs = R.countBy(R.prop("proc"))(uniqMachines);
//   let count = R.compose(
//     R.map(item => ({
//       name: item,
//       num: procs[item]
//     })),
//     R.keys
//   )(procs);
//   return {
//     count,
//     data: uniqMachines
//   };
// };

// // // 印码抽取
// // const step1 = (machines, proc, data) => {
// //   //印码机台列表
// //   let machineList = R.compose(
// //     R.map(R.prop("machine")),
// //     R.filter(R.propEq("proc", proc))
// //   )(machines.data);

// //   let findMahine = machine => R.filter(R.whereEq({
// //     5: machine
// //   }))(data);
// //   let cartsByMachine = R.map(findMahine, machineList);
// //   return R.map(item =>
// //     R.compose(
// //       R.prop(0),
// //       R.sortBy(R.prop(8)),
// //       R.filter(R.whereEq({
// //         9: item[0][9]
// //       }))
// //     )(item)
// //   )(cartsByMachine);
// // };

// // // // 指定车号列表中覆盖了多少设备
// // // let getMachinesOfCarts = (carts, data) => {
// // //   let cartList = R.map(R.prop(0))(carts);
// // //   let isInCart = item => cartList.includes(item[0]);
// // //   return R.compose(R.uniq, R.map(R.prop(5)), R.filter(isInCart))(data);
// // // };

// // // // 更新各机台抽检情况
// // // let updateMachines = (machines, checkedMachines) => {
// // //   let handleMachine = item => {
// // //     item.status = checkedMachines.includes(item.machine);
// // //     return item;
// // //   };
// // //   return R.map(handleMachine)(machines);
// // // };

// let refreshMachineStatus = (taskList, machines, data) => {
//   // 已抽取的车号列表
//   let checkedMachines = getMachinesOfCarts(taskList, data);
//   machines.data = updateMachines(machines.data, checkedMachines); //.filter(item => item.proc != '');
//   return machines;
// };

// let checkStep2 = (machines, data) => {
//   // 优化前：第2步追加的机台(预计11台)
//   let unCheckedMachines = R.compose(
//     R.map(R.prop("machine")),
//     R.reject(R.prop("status"))
//   )(machines);
//   // console.log(
//   //   `准备抽检这些机台(${unCheckedMachines.length})：`,
//   //   unCheckedMachines
//   // );
//   // 获取指定设备中班最后一万产品
//   let findMachine = machine => R.filter(R.whereEq({
//     5: machine
//   }))(data);
//   let cartsByMachine = R.map(findMachine, unCheckedMachines);
//   return R.map(R.compose(R.prop(0), R.sort(R.descend(R.prop(8)))))(
//     cartsByMachine
//   );
// };

// let getUnCheckedMachines = R.compose(
//   R.map(R.prop("machine")),
//   R.reject(R.prop("status"))
// );
// let step2 = (taskList, machines, data) => {
//   let unCheckedMachines = getUnCheckedMachines(machines.data);
//   while (unCheckedMachines.length) {
//     let appendList = checkStep2(machines.data, data);
//     taskList = [...taskList, appendList[0]];
//     machines = refreshMachineStatus(taskList, machines, data);
//     unCheckedMachines = getUnCheckedMachines(machines.data);
//     // console.log(unCheckedMachines);
//     // console.log('还剩', unCheckedMachines.length, '未抽检')
//   }
//   return taskList;
// };

// let step3 = (machines, data) => {
//   // 需要调试
//   let lastCart = R.compose(
//     R.reject(R.whereEq({
//       3: "印码"
//     })),
//     R.filter(R.whereEq({
//       9: setting.firstDay
//     }))
//   )(data);
//   let uniqMachine = R.compose(R.uniq, R.map(R.prop(5)))(lastCart);
//   // console.log("周一生产的所有产品:", lastCart);
//   // console.log("以上产品共包含在这些机台中：", uniqMachine);
//   let findMachine = machine => R.filter(R.whereEq({
//     5: machine
//   }))(lastCart);
//   let getLastCart = R.compose(
//     R.prop(0),
//     R.sort(R.descend(R.prop(8))),
//     findMachine
//   );

//   // let getFirstCart = R.compose(R.prop(0), R.sortBy(R.prop(8)), findMachine);
//   return R.map(getLastCart, uniqMachine);
// };

// let getCheckedCarts = (data, taskInfo) => {
//   // 非重复机台
//   let machines = handleMachines(data);
//   // console.log("本周产品共涉及以下机台：", machines);

//   let proc = "印码";
//   let taskList = step1(machines, proc, data);
//   // console.log("第1步抽检列表:", taskList);
//   machines = refreshMachineStatus(taskList, machines, data);
//   // console.log(machines);

//   let appendList = step2(taskList, machines, data);
//   // console.log(
//   //   `第2步追加的机台(预计${appendList.length - taskList.length}台):`,
//   //   appendList.slice(taskList.length, appendList.length)
//   // );

//   taskList = appendList;
//   // console.log("当前所抽检的车号列表为：", taskList);
//   machines = refreshMachineStatus(taskList, machines, data);
//   // 是否已经抽检够对应的数量
//   if (taskList.length >= taskInfo.checks) {
//     return taskList;
//     // return appendList.slice(0, taskInfo.checks);
//   }

//   // 继续按规则3抽检
//   appendList = step3(machines.data, data);
//   // console.log("第3步追加的机台:", appendList);
//   taskList = [...taskList, ...appendList];
//   // console.log("当前所抽检的车号列表为：", taskList);
//   machines = refreshMachineStatus(taskList, machines, data);
//   // 是否已经抽检够对应的数量
//   if (taskList.length >= taskInfo.checks) {
//     return taskList.slice(0, taskInfo.checks);
//   }
//   return taskList;
// };

let convertObj2Array = obj => {
  const keys = R.keys(obj);
  return R.map(key => ({
    name: key,
    value: obj[key]
  }))(keys);
};

let countMachineCheckInfo = async cartList => {
  // let cartLog = R.compose(R.uniq, R.map(item => [...item.slice(0, 6), item[10]]), R.filter(item => cartList.includes(item[0])))(data)
  // let cartLog = R.filter(item => cartList.includes(item[0]))(data);
  let {
    data
  } = await getViewCartfinderByCarts(cartList);
  console.log(data)
  console.log(cartList);
  // 
  console.log('从机台作业重新获取信息;')
  console.log(data);

  let className = R.countBy(R.prop(4), data);
  let machine = R.countBy(R.prop(5), data);
  let weekDay = R.countBy(R.prop(10), data);
  return {
    className: convertObj2Array(className),
    machine: convertObj2Array(machine),
    weekDay: convertObj2Array(weekDay),
    log: R.filter(R.propEq(3, "印码"))(data),
    cartLog: data
  };
};

let getMachinesByProcName = (prodName, machines, remainedCarts) => {
  // 先按车号整理生产信息
  remainedCarts = R.filter(R.propEq(11, prodName))(remainedCarts);
  let filtedCarts = R.compose(R.uniq, R.map(R.prop(0)))(remainedCarts);
  // 待抽机台
  let pMachineList = R.compose(
    R.uniq,
    R.map(R.prop(2)),
    R.filter(R.propEq(0, prodName))
  )(machines);
  // console.log(remainedCarts);
  // let codeCarts = R.filter(R.propEq(3, "印码"))(remainedCarts);
  filtedCarts = R.map(cart => {
    // 产品权重
    let uniqNums = 0;
    let machines = R.compose(
      R.uniq,
      R.map(R.prop(5)),
      R.filter(R.propEq(0, cart))
    )(remainedCarts);

    R.forEach(machine => {
      if (pMachineList.includes(machine)) {
        uniqNums++;
      }
    })(machines);
    // let cartInfo = R.find(R.propEq(0, cart))(codeCarts);
    return {
      cart,
      uniqNums,
      machines
      // cartInfo: {
      //   week: cartInfo[10],
      //   dateTime: parseInt(cartInfo[8].replace(/:/g, ""), 10)
      // }
    };
  })(filtedCarts);
  // 按权重逆序
  filtedCarts = R.sort((b, a) => a.uniqNums - b.uniqNums)(filtedCarts);

  // 加入印码周一的优先级，导致多抽1万
  // let maxUniqNums = filtedCarts[0].uniqNums;
  // filtedCarts = R.filter(R.propEq("uniqNums", maxUniqNums))(filtedCarts);

  // // 是否周一
  // let mondayData = R.filter(R.pathEq(["cartInfo", "week"], "1"))(filtedCarts);
  // if (mondayData.length) {
  //   // 按生产时间降序
  //   filtedCarts = R.sort((a, b) => a.cartInfo.dateTime - b.cartInfo.dateTime)(
  //     filtedCarts
  //   );
  // } else {
  //   // 按生产时间逆序
  //   filtedCarts = R.sort((b, a) => a.cartInfo.dateTime - b.cartInfo.dateTime)(
  //     filtedCarts
  //   );
  // }
  // 按生产时间降序
  // filtedCarts = R.sort((a, b) => a.cartInfo.dateTime - b.cartInfo.dateTime)(
  //   filtedCarts
  // );

  R.sortBy(R.compose(R.toLower, R.prop("name")));
  // console.log("按时间排序：");
  // console.log(filtedCarts);
  return filtedCarts.length ? filtedCarts[0] : false;
};

const sampleByLessCarts = (data, sampledMachines, sampledCarts) => {
  let rejectArrByIdx = (arr, idx) =>
    R.reject(item => R.contains(R.prop(idx)(item), arr));

  // 过滤已抽取的车号列表
  let remainedCarts = rejectArrByIdx(sampledCarts, 0)(data);

  // 筛选出尚未抽取的机台详情
  let taskMachineList = R.compose(
    R.uniq,
    R.map(R.props([11, 3, 5])),
    rejectArrByIdx(sampledMachines, 5)
  )(remainedCarts);

  let prodList = R.compose(R.uniq, R.map(R.prop(0)))(taskMachineList);
  // console.log(prodList);

  // 方案3：周一第一万必抽，其它按车号最少,实际抽取16车

  // 方案2：按车号最少，实际抽取12车
  R.forEach(prodName => {
    let unSampledCarts = R.filter(R.propEq(0, prodName))(taskMachineList);
    while (unSampledCarts.length) {
      // 开始抽样

      let newSampleCart = getMachinesByProcName(
        prodName,
        unSampledCarts,
        remainedCarts
      );

      // console.log(newSampleCart);
      if (newSampleCart) {
        sampledCarts = R.uniq(sampledCarts.concat(newSampleCart.cart));
        sampledMachines = R.uniq(
          sampledMachines.concat(newSampleCart.machines)
        );
        unSampledCarts = R.reject(item =>
          newSampleCart.machines.includes(item[2])
        )(unSampledCarts);
      }
    }
  })(prodList);
  return sampledCarts;
};

const getUnionCarts = carts => {
  let cartList = R.compose(R.uniq, R.map(R.prop(0)))(carts);
  let newCarts = R.map(item => R.find(R.propEq(0, item))(carts))(cartList);
  // console.log(newCarts);
  return newCarts;
};

const init = async ({
  data,
  sampledMachines,
  sampledCarts,
  stockData
}) => {
  let usedData = stockData;

  // 任务量
  let taskInfo = preHandle(data);
  taskInfo.percent = setting.percent;
  // 已经领取的车号
  taskInfo.sampled = sampledCarts.length;

  let taskList, sCarts;

  console.log('已抽取车号列表：')
  console.log(sampledMachines, sampledCarts);

  // 使用历史数据
  sCarts = sampleByLessCarts(usedData, sampledMachines, sampledCarts);

  // 文案2：效率优先，同时不使用历史数据
  // sCarts = sampleByLessCarts(usedData, [], []);
  // console.log(sCarts);

  // 方案1：按风险最低 ———— 码后核查共生产275车产品，按4%抽样将抽取11车产品 实际抽取20车
  // taskList = getCheckedCarts(usedData, taskInfo);
  // console.log(taskList);
  // sCarts = R.map(R.prop(0))(taskList);
  console.log('抽取的车号列表，附异常品：')
  console.log(sCarts);

  // 未抽取的车号
  // let stockedCartList = R.map(R.prop(0))(usedData);
  // console.log(R.difference(sCarts, stockedCartList))

  // 数据汇总
  // 针对在库车号抽检
  let count = await countMachineCheckInfo(sCarts, usedData);
  // 非在库车号显示
  // let count = countMachineCheckInfo(sCarts, data);

  taskList = getUnionCarts(count.log);
  return { ...count,
    taskList,
    taskInfo
  };
};
export default {
  init
};
