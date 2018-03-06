import initData from '../data/init.json';
import setting from './common/setting';

const R = require('./common/ramda.min');

let { data } = initData;
// 滤掉丝印
// data = R.filter(item => item[3].length)(data)

// 数据预处理
const preHandle = () => {
  let uniqCarts = R.compose(R.uniqBy(R.prop(0)), R.filter(R.propEq(3, '印码')))(data)
  let cartChecks = Math.ceil(uniqCarts.length * setting.percent / 100);
  return {
    total: uniqCarts.length,
    checks: cartChecks
  }
}

// 统计各工序已开印机台数量
const handleMachines = () => {
  let getMachines = R.compose(R.uniq, R.map(item => ({ proc: item[3], machine: item[5] })));
  let uniqMachines = getMachines(data);
  let procs = R.countBy(R.prop('proc'))(uniqMachines);
  let count = R.compose(R.map(item => ({ name: item, num: procs[item] })), R.keys)(procs)
  return {
    count,
    data: uniqMachines
  }
}

// 印码抽取
const step1 = (machines, proc) => {
  //印码机台列表
  let machineList = R.compose(R.map(R.prop('machine')), R.filter(R.propEq('proc', proc)))(machines.data);

  let findMahine = machine => R.filter(R.whereEq({ 5: machine }))(data)
  let cartsByMachine = R.map(findMahine, machineList);
  return R.map(item => R.compose(R.prop(0), R.sortBy(R.prop(8)), R.filter(R.whereEq({ 9: item[0][9] })))(item))(cartsByMachine)
}

// 指定车号列表中覆盖了多少设备
let getMachinesOfCarts = carts => {
  let cartList = R.map(R.prop(0))(carts);
  let isInCart = item => cartList.includes(item[0]);
  return R.compose(R.uniq, R.map(R.prop(5)), R.filter(isInCart))(data);
}

// 更新各机台抽检情况
let updateMachines = (machines, checkedMachines) => {
  let handleMachine = item => {
    item.status = checkedMachines.includes(item.machine)
    return item;
  };
  return R.map(handleMachine)(machines);
}

let refreshMachineStatus = (taskList, machines) => {
  // 已抽取的车号列表
  let checkedMachines = getMachinesOfCarts(taskList);
  machines.data = updateMachines(machines.data, checkedMachines);//.filter(item => item.proc != '');
  return machines;
}

let checkStep2 = machines => {
  // 优化前：第2步追加的机台(预计11台)
  let unCheckedMachines = R.compose(R.map(R.prop('machine')), R.reject(R.prop('status')))(machines);
  console.log(`准备抽检这些机台(${unCheckedMachines.length})：`, unCheckedMachines);
  // 获取指定设备中班最后一万产品 
  let findMachine = machine => R.filter(R.whereEq({ 5: machine }))(data);
  let cartsByMachine = R.map(findMachine, unCheckedMachines);
  return R.map(R.compose(R.prop(0), R.sort(R.descend(R.prop(8)))))(cartsByMachine);
}

let getUnCheckedMachines = R.compose(R.map(R.prop('machine')), R.reject(R.prop('status')));
let step2 = (taskList, machines) => {
  let unCheckedMachines = getUnCheckedMachines(machines.data);
  while (unCheckedMachines.length) {
    let appendList = checkStep2(machines.data);
    taskList = [...taskList, appendList[0]];
    machines = refreshMachineStatus(taskList, machines);
    unCheckedMachines = getUnCheckedMachines(machines.data);
    // console.log(unCheckedMachines);
    // console.log('还剩', unCheckedMachines.length, '未抽检')
  }
  return taskList;
}

let step3 = machines => {
  // 需要调试
  let lastCart = R.compose(R.reject(R.whereEq({ 3: '印码' })), R.filter(R.whereEq({ 9: setting.firstDay })))(data);
  let uniqMachine = R.compose(R.uniq, R.map(R.prop(5)))(lastCart);
  console.log('周一生产的所有产品:', lastCart);
  console.log('以上产品共包含在这些机台中：', uniqMachine);
  let findMachine = machine => R.filter(R.whereEq({ 5: machine }))(lastCart);
  let getLastCart = R.compose(R.prop(0), R.sort(R.descend(R.prop(8))), findMachine);

  // let getFirstCart = R.compose(R.prop(0), R.sortBy(R.prop(8)), findMachine);
  return R.map(getLastCart, uniqMachine)
}



let getCheckedCarts = () => {
  // 处理号码
  let taskInfo = preHandle();
  console.log(taskInfo);

  console.log('在抽检比例为', setting.percent, '%的情况下共需抽检：', taskInfo.checks);
  // 非重复机台
  let machines = handleMachines();
  console.log('本周产品共涉及以下机台：', machines);

  let proc = '印码';
  let taskList = step1(machines, proc);
  console.log('第1步抽检列表:', taskList);
  machines = refreshMachineStatus(taskList, machines);
  console.log(machines);

  let appendList = step2(taskList, machines);
  console.log(`第2步追加的机台(预计${appendList.length - taskList.length}台):`, appendList.slice(taskList.length, appendList.length));

  taskList = appendList;
  console.log('当前所抽检的车号列表为：', taskList);
  machines = refreshMachineStatus(taskList, machines);
  // 是否已经抽检够对应的数量
  if (taskList.length >= taskInfo.checks) {
    return taskList;
    // return appendList.slice(0, taskInfo.checks);
  }

  // 继续按规则3抽检
  appendList = step3(machines.data);
  console.log('第3步追加的机台:', appendList);
  taskList = [...taskList, ...appendList];
  console.log('当前所抽检的车号列表为：', taskList);
  machines = refreshMachineStatus(taskList, machines);
  // 是否已经抽检够对应的数量
  if (taskList.length >= taskInfo.checks) {
    return taskList.slice(0, taskInfo.checks);
  }
}

let convertObj2Array = obj => {
  const keys = R.keys(obj);
  return R.map(key => ({ name: key, value: obj[key] }))(keys)
}

let countMachineCheckInfo = carts => {
  let cartList = R.map(R.prop(0))(carts);
  // let cartLog = R.compose(R.uniq, R.map(item => [...item.slice(0, 6), item[10]]), R.filter(item => cartList.includes(item[0])))(data)
  let cartLog = R.filter(item => cartList.includes(item[0]))(data)

  let className = R.countBy(R.prop(4), cartLog);
  let machine = R.countBy(R.prop(5), cartLog);
  let weekDay = R.countBy(R.prop(10), cartLog);
  return {
    className: convertObj2Array(className),
    machine: convertObj2Array(machine),
    weekDay: convertObj2Array(weekDay),
    log: R.filter(R.propEq(3, '印码'))(cartLog),
    cartLog
  }
}

export const init = () => {
  let carts = getCheckedCarts();
  let count = countMachineCheckInfo(carts);
  return { carts, count };
}

