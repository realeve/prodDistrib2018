import { axios, DEV } from "../../../utils/axios";
import * as lib from "../../../utils/lib";
const R = require("ramda");

/**
*   @database: { 接口管理 }
*   @desc:     { 产品抽检车号原始记录 } 
  
    const { tstart, tend, tstart2, tend2 } = params;
*/
const getVIEWCARTFINDER = async params =>
  await axios({
    url: DEV
      ? "http://localhost:8000/public/40614909a0.json"
      : "/69/9e2d18889f/array.json",
    params
  }).then(res => res);

export const fetchData = async ({ url, params }) => {
  let data = await getVIEWCARTFINDER(params);
  data.data = R.map(item =>
    R.update(3, R.equals(R.nth(3, item), "") ? "丝印" : R.nth(3, item))(item)
  )(data.data);
  return data;
};

const isFilterColumn = (data, key) => {
  let isValid = true;
  const handleItem = item => {
    if (isValid) {
      item = item.trim();
      let isNum = lib.isNumOrFloat(item);
      let isTime = lib.isDateTime(item);
      if (isNum || isTime) {
        isValid = false;
      }
    }
  };

  let uniqColumn = R.compose(R.uniq, R.map(R.prop(key)))(data);
  R.map(handleItem)(uniqColumn);

  return { uniqColumn, filters: isValid };
};

export function handleColumns({ dataSrc, sortedInfo, filteredInfo }) {
  let { data, header, rows } = dataSrc;
  let showURL = typeof data !== "undefined" && rows > 0;
  if (!rows || rows === 0) {
    return [];
  }
  let column = header.map((title, i) => {
    let key = "col" + i;
    let item = { title };
    item.dataIndex = key;
    // item.key = key;

    let tdValue = data[0][key];
    if (lib.isNumOrFloat(tdValue)) {
      item.sorter = (a, b) => {
        return a[key] - b[key];
      };
    }
    if (!showURL) {
      return item;
    }

    if (lib.isCartOrReel(tdValue)) {
      item.render = text => {
        const attrs = {
          href: lib.searchUrl + text,
          target: "_blank"
        };
        return <a {...attrs}>{text}</a>;
      };
      return item;
    } else if (lib.isInt(tdValue) && !lib.isDateTime(tdValue)) {
      item.render = text => parseInt(text, 10).toLocaleString();
      return item;
    }

    let fInfo = isFilterColumn(data, key);

    if (filteredInfo && fInfo.filters) {
      item.filters = fInfo.uniqColumn.map(text => ({
        text,
        value: text
      }));
      item.onFilter = (value, record) => record[key].includes(value);
      item.filteredValue = filteredInfo[key] || null;
    }
    return item;
  });
  return column;
}

export function handleFilter({ data, filters }) {
  R.compose(
    R.forEach(key => {
      if (filters[key] !== null && filters[key].length !== 0) {
        data = R.filter(item => filters[key].includes(item[key]))(data);
      }
    }),
    R.keys
  )(filters);
  return data;
}

export function updateColumns({ columns, filters }) {
  R.compose(
    R.forEach(key => {
      let idx = R.findIndex(R.propEq("dataIndex", key))(columns);
      columns[idx].filteredValue = filters[key];
    }),
    R.keys
  )(filters);
  return columns;
}

export function handleSort({ dataClone, field, order }) {
  return R.sort((a, b) => {
    if (order === "descend") {
      return b[field] - a[field];
    }
    return a[field] - b[field];
  })(dataClone);
}

export const getPageData = ({ data, page, pageSize }) =>
  data.slice((page - 1) * pageSize, page * pageSize);

// tid,
export const getQueryConfig = ({ tstart, tend }) => ({
  type: "table/fetchAPIData",
  payload: {
    url: lib.apiHost,
    params: {
      // ID: tid,
      // cache: 10,
      tstart,
      tend,
      tstart2: tstart,
      tend2: tend,
      tstart3: tstart,
      tend3: tend
    }
  }
});

/**
*   @database: { 质量管理数据库 }
*   @desc:     { 批量插入机台列表 } 
	以下参数在建立过程中与系统保留字段冲突，已自动替换:
	@desc:批量插入数据时，约定使用二维数组values参数，格式为[[machine_name,check_num,week_num,sample_num,rec_time ]]，数组的每一项表示一条数据
*/
export const addPrintSampleMachine = async values =>
  await axios({
    method: "post",
    data: {
      values,
      id: 53,
      nonce: "2bfaf3357e"
    }
  }).then(res => res);

/**
*   @database: { 质量管理数据库 }
*   @desc:     { 批量插入抽样车号列表 } 
	以下参数在建立过程中与系统保留字段冲突，已自动替换:
	@desc:批量插入数据时，约定使用二维数组values参数，格式为[[cart_number,gz_no,code_no,proc_name,class_name,machine_name,captain_name,print_date,week_name,prod_name,week_num,rec_time,status ]]，数组的每一项表示一条数据
*/
export const addPrintSampleCartlist = async values =>
  await axios({
    method: "post",
    data: {
      values,
      id: 52,
      nonce: "ecf47927ee"
    }
  }).then(res => res);

/**
*   @database: { 质量管理数据库 }
*   @desc:     { 已领取车号数 } 
  
    const { week_num } = params;
*/
export const getPrintSampleCartlist = async params =>
  await axios({
    url: DEV
      ? "http://localhost:8000/public/40614909a0.json"
      : "/54/40614909a0.json",
    params
  }).then(res => res.data);

/**
*   @database: { 质量信息系统 }
*   @desc:     { 本周待检车号列表 } 
    const { tstart, tend } = params;
*/
export const getSampledCartlist = async params =>
  await axios({
    url: "/126/d8f5882e8b/array.json",
    params
  }).then(res => res);

/**
*   @database: { 质量管理数据库 }
*   @desc:     { 各机台产品抽检情况 } 
  
    const { tstart, tend } = params;
*/
export const getPrintSampleMachine = async params =>
  await axios({
    url: DEV
      ? "http://localhost:8000/public/0695d9575b.json"
      : "/58/0695d9575b/array.json",
    params
  }).then(res => res);

/**
 *   @database: { 机台作业 }
 *   @desc:     { 根据车号列表查询机台信息 }
 */
export const getPrintSampleMachineFromViewCartfinder = async carts =>
  await axios({
    url: "/127/3039fdade1/array.json",
    params: {
      carts
    }
  }).then(res => res);

/**
*   @database: { 质量信息系统 }
*   @desc:     { 当前时间已添加异常品车号列表 } 
    const { tstart, tend } = params;
*/
export const getPrintAbnormalProd = async params =>
  await axios({
    url: "/128/be6c4a1438/array.json",
    params
  }).then(res => res);

/**
*   @database: { 质量信息系统 }
*   @desc:     { 更新四新计划状态信息 } 
	以下参数在建立过程中与系统保留字段冲突，已自动替换:
	@id:_id. 参数说明：api 索引序号
  
    const { complete_num, complete_status, update_time, _id } = params;
*/
export const setPrintNewprocPlan = async params =>
  await axios({
    url: "/90/a6c66f8d72.json",
    params
  }).then(res => res);

/**
*   @database: { 质量信息系统 }
*   @desc:     { 批量记录库管系统日志信息 } 
以下参数在建立过程中与系统保留字段冲突，已自动替换:
@desc:批量插入数据时，约定使用二维数组values参数，格式为[{remark,rec_time }]，数组的每一项表示一条数据*/

export const addPrintWmsLog = async values =>
  await axios({
    method: "post",
    data: {
      values,
      id: 91,
      nonce: "f0500427cb"
    }
  }).then(res => res);

/**
*   @database: { 质量信息系统 }
*   @desc:     { 更新wms日志信息 } 
    const { return_info, _id } = params;
*/
export const setPrintWmsLog = async params =>
  await axios({
    url: "/120/e7d88969ca.json",
    params
  }).then(res => res);

/**
 *   @database: { 机台作业 }
 *   @desc:     { 指定车号列表生产原始信息 }
 */
export const getViewCartfinderByCarts = async carts =>
  await axios({
    url: "/133/97b29df2a0/array.json",
    params: {
      carts
    }
  }).then(res => res);
