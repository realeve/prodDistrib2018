import initData from '../data/init.json';
import setting from './common/setting';

const R = require('./common/ramda.min');

const { data } = initData;

// 数据预处理
const preHandle = () => {
  // 印码工序车号列表
  let proc = '印码';
  let codeList = R.filter(R.propEq(3, proc))(data);
  let totalCount = 0;

  let uniqCarts = R.uniqBy(R.prop(0), codeList);

  let cartChecks = Math.ceil(uniqCarts.length * setting.percent / 100);
  console.log('印码工序共有：', codeList);
  console.log('非重复车号：', uniqCarts);
  console.log('在抽检比例为', setting.percent, '%的情况下共需抽检：', cartChecks);

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
  let findMahine = machine => R.filter(R.whereEq({ 3: proc, 5: machine }))(data)

  // 返回列表中最先生产的产品
  let getFirstCart = R.compose(R.prop(0), R.sortBy(R.prop(7)), findMahine);
  let getEachMachineCarts = R.map(getFirstCart);

  return getEachMachineCarts(machineList);
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



export const init = () => {
  // 处理号码
  let taskInfo = preHandle();
  console.log(taskInfo);

  // 非重复机台
  let machines = handleMachines();
  console.log(machines);

  let proc = '印码';
  let taskList = step1(machines, proc);
  console.log(taskList);

  // 已抽取的车号列表
  let checkedMachines = getMachinesOfCarts(taskList);

  machines.data = updateMachines(machines.data, checkedMachines);
  console.log(machines);
}

