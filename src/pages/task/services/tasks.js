import { axios } from "../../../utils/axios";
import * as lib from "../../../utils/lib";
const R = require("ramda");

export function handleColumns({ dataSrc, sortedInfo }) {
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
*   @desc:     { 已领取车号列表 } 
  
    const { tstart, tend } = params;
*/
export const getPrintSampleCartlist = async params =>
  await axios({
    url: "/55/38989f6661/array.json",
    params
  }).then(res => res);

/**
 *   @database: { 质量信息系统 }
 *   @desc:     { 待检车号列表 }
 */
export const getPrintSampleCartlistAll = async () =>
  await axios({
    url: "/104/fe5d8ec5c9/array.json"
  }).then(res => res);

/**
*   @database: { 质量管理数据库 }
*   @desc:     { 人工抽检领活 } 
  
    const { cart_number } = params;
*/
export const setPrintSampleCartlist = async params =>
  await axios({
    url: "/56/fe353b42f0.json",
    params
  }).then(res => res);

/**
*   @database: { 质量管理数据库 }
*   @desc:     { 人工抽检更新设备抽检数 } 
  
    const { cart1, cart2 } = params;
*/
export const setPrintSampleMachine = async params =>
  await axios({
    url: "/57/3bbab164ad.json",
    params
  }).then(res => res);

/**
*   @database: { 质量信息系统 }
*   @desc:     { 四新及异常品人工拉号产品列表 } 
    const { tstart, tend } = params;
*/
export const getPrintWmsProclist = async params =>
  await axios({
    url: "/121/fff29f5a04/array.json",
    params
  }).then(res => res);

/**
 *   @database: { 库管系统 }
 *   @desc:     { 人工拉号准许出库查询 }
 */
export const getTbDryingstatusTask = async carnos =>
  await axios({
    url: "/125/0ec8ee76b3/array.json",
    params: {
      carnos
    }
  }).then(res => res);
