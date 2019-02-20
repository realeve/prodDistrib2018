import { axios, DEV } from '../../../utils/axios';
import http from 'axios';
/**
*   @database: { 质量信息系统 }
*   @desc:     { 异常产品原因列表 } 
  
*/
export const getPrintAbnormalProd = () =>
  axios({
    url: '/72/2b853fe9ed.json'
  });

/**
*   @database: { 质量信息系统 }
*   @desc:     { 异常产品车号列表 } 
  
    const { tstart, tend } = params;
*/
export const getViewPrintAbnormalProd = (params) =>
  axios({
    url: '/73/2dcf6571e6/array.json',
    params
  });

/**
*   @database: { 质量信息系统 }
*   @desc:     { 添加异常品 } 
  
    const { prod_id, cart_number, rec_date, machine_name, reason, proc_stream, proc_name, captain_name, prod_date, problem_type } = params;
*/
export const addPrintAbnormalProd = (params) =>
  axios({
    url: '/77/d9072e2900.json',
    params
  });

/**
*   @database: { 接口管理 }
*   @desc:     { 根据车号查询生产信息 } 
  
    const { cart } = params;
*/
// export const getViewCartfinder = async (params) =>
//   await axios({
//     url: '/86/db8acd1ea1.json',
//     params
//   })

/**
 *   @database: { MES_MAIN }
 *   @desc:     { 根据车号查询生产信息 } 
    const { cart } = params;
 */
export const getViewCartfinder = (params) =>
  axios({
    url: '/350/e20e9bbe6e.json',
    params
  });

export const getTbstock = (carnos) =>
  getTbbaseCarTechnologHistory({
    carnos
  });

/**
*   @database: { 库管系统 }
*   @desc:     { 查询批次状态 } 
    const { carnos1, carnos2, carnos3 } = params;
*/
const getTbbaseCarTechnologHistory = (params) =>
  axios({
    url: '/334/f47b05f146/array.json',
    params
  });

/**
*   @database: { 质量信息系统 }
*   @desc:     { 人工拉号车号万数汇总 } 
    const { tstart, tend, tstart2, tend2 } = params;
*/
export const getPrintSampleCartlist = (params) =>
  axios({
    url: '/124/cd6e54e7e3.json',
    params
  });

export const getUserList = () => require('../../../../mock/userList.js');

// 判废人员名单信息存储
const KEY_OPERATOR = 'image_check_operator';
export const saveOperatorList = (users) => {
  window.localStorage.setItem(KEY_OPERATOR, JSON.stringify(users));
};

export const loadOperatorList = () => {
  let users = window.localStorage.getItem(KEY_OPERATOR);
  if (users == null) {
    return [];
  }
  return JSON.parse(users);
};

// 图核排产
export const getHechaTasks = (data) =>
  DEV
    ? require('../../../../mock/addcart_task.js').data
    : http({
        url: 'http://10.8.1.27:4000/api/hecha/task',
        method: 'post',
        data
      });
