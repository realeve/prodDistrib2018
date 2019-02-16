import { axios } from '../../../utils/axios';

/**
*   @database: { 质量信息系统 }
*   @desc:     { 异常产品原因列表 } 
  
*/
export const getPrintAbnormalProd = async () =>
  await axios({
    url: '/72/2b853fe9ed.json'
  }).then((res) => res);

/**
*   @database: { 质量信息系统 }
*   @desc:     { 异常产品车号列表 } 
  
    const { tstart, tend } = params;
*/
export const getViewPrintAbnormalProd = async (params) =>
  await axios({
    url: '/73/2dcf6571e6/array.json',
    params
  }).then((res) => res);

/**
*   @database: { 质量信息系统 }
*   @desc:     { 添加异常品 } 
  
    const { prod_id, cart_number, rec_date, machine_name, reason, proc_stream, proc_name, captain_name, prod_date, problem_type } = params;
*/
export const addPrintAbnormalProd = async (params) =>
  await axios({
    url: '/77/d9072e2900.json',
    params
  }).then((res) => res);

/**
*   @database: { 接口管理 }
*   @desc:     { 根据车号查询生产信息 } 
  
    const { cart } = params;
*/
// export const getViewCartfinder = async (params) =>
//   await axios({
//     url: '/86/db8acd1ea1.json',
//     params
//   }).then((res) => res);

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

export const getTbstock = async (carnos) =>
  await getTbbaseCarTechnologHistory({
    carnos1: carnos,
    carnos2: carnos,
    carnos3: carnos
  });

/**
*   @database: { 库管系统 }
*   @desc:     { 查询批次状态 } 
    const { carnos1, carnos2, carnos3 } = params;
*/
const getTbbaseCarTechnologHistory = async (params) =>
  await axios({
    url: '/132/6ac1e30d85/array.json',
    params
  }).then((res) => res);

/**
*   @database: { 质量信息系统 }
*   @desc:     { 人工拉号车号万数汇总 } 
    const { tstart, tend, tstart2, tend2 } = params;
*/
export const getPrintSampleCartlist = async (params) =>
  await axios({
    url: '/124/cd6e54e7e3.json',
    params
  }).then((res) => res);
