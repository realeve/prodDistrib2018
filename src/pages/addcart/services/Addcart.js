import { axios } from "../../../utils/axios";
import * as lib from "../../../utils/lib";
const R = require("ramda");

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

    // let fInfo = isFilterColumn(data, key);

    // if (filteredInfo && fInfo.filters) {
    //   item.filters = fInfo.uniqColumn.map(text => ({
    //     text,
    //     value: text
    //   }));
    //   item.onFilter = (value, record) => record[key].includes(value);
    //   item.filteredValue = filteredInfo[key] || null;
    // }
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

/**
*   @database: { 质量管理数据库 }
*   @desc:     { 各机台产品抽检情况 } 
  
    const { tstart, tend } = params;
*/
export const getPrintSampleMachine = async params =>
  await axios({
    url: "/58/0695d9575b/array.json",
    params
  }).then(res => res);

/**
*   @database: { 质量信息系统 }
*   @desc:     { 印码机台列表 } 
  
*/
export const getMachine = async () =>
  await axios({
    url: "/70/6410480d19/array.json"
  }).then(res => res);

/**
*   @database: { 质量信息系统 }
*   @desc:     { 印钞品种列表 } 
  
*/
export const getProduct = async () =>
  await axios({
    url: "/71/0fff65bc40.json"
  }).then(res => res);

/**
*   @database: { 质量信息系统 }
*   @desc:     { 异常产品原因列表 } 
  
*/
export const getPrintAbnormalProd = async () =>
  await axios({
    url: "/72/2b853fe9ed.json"
  }).then(res => res);

/**
*   @database: { 质量信息系统 }
*   @desc:     { 异常产品车号列表 } 
  
    const { tstart, tend } = params;
*/
export const getViewPrintAbnormalProd = async params =>
  await axios({
    url: "/73/2dcf6571e6/array.json",
    params
  }).then(res => res);

/**
*   @database: { 质量信息系统 }
*   @desc:     { 添加异常品 } 
  
    const { prod_id, cart_number, rec_date, machine_name, reason, proc_stream, proc_name, captain_name, prod_date, problem_type } = params;
*/
export const addPrintAbnormalProd = async params =>
  await axios({
    url: "/77/d9072e2900.json",
    params
  }).then(res => res);

/**
*   @database: { 接口管理 }
*   @desc:     { 根据车号查询生产信息 } 
  
    const { cart } = params;
*/
export const getViewCartfinder = async params =>
  await axios({
    url: "/86/db8acd1ea1.json",
    params
  }).then(res => res);
