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
        return <a {...attrs}> {text} </a>;
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
*   @database: { 质量信息系统 }
*   @desc:     { 印钞品种列表 } 
  
*/
export const getProduct = async () =>
  await axios({
    url: "/71/0fff65bc40.json"
  }).then(res => {
    res.data = res.data.map(item => {
      item.name = item.name.trim();
      return item;
    });
    return res;
  });

/**
*   @database: { 机台作业 }
*   @desc:     { 车号信息查询 } 
  
    const { cart } = params;
*/
export const getVIEWCARTFINDER = async params =>
  await axios({
    url: "/82/32635d468b.json",
    params
  }).then(res => res);

/**
*   @database: { 质量信息系统 }
*   @desc:     { 机台连续废信息通知 } 
  
    const { cart_number, prod_id, proc_name, machine_name, captain_name, fake_type, kilo_num, pos_num, remark, rec_time } = params;
*/
export const addPrintMachinecheckMultiweak = async params =>
  await axios({
    url: "/83/3475990fbf.json",
    params
  }).then(res => res);
