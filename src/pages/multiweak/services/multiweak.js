import { axios } from '../../../utils/axios';

/**
*   @database: { 机台作业 }
*   @desc:     { 车号信息查询 } 
  
    const { cart } = params;
*/
// export const getVIEWCARTFINDER = async params =>
//   await axios({
//     url: "/82/882df77c3a.json",
//     params
//   }).then(res => res);

/**
 *   @database: { MES_MAIN }
 *   @desc:     { 车号信息查询 }
 */
export const getVIEWCARTFINDER = (params) =>
  axios({
    url: '/404/afe4110b5e.json',
    params
  });

/**
*   @database: { 质量信息系统 }
*   @desc:     { 机台连续废信息通知 } 
  
    const { cart_number, prod_id, proc_name, machine_name, captain_name, fake_type, kilo_num, pos_num, remark, rec_time } = params;
*/
export const addPrintMachinecheckMultiweak = async (params) =>
  await axios({
    url: '/83/3475990fbf.json',
    params
  }).then((res) => res);

/**
*   @database: { 质量信息系统 }
*   @desc:     { 机台连续废通知产品列表 } 
    const { tstart, tend } = params;
*/
export const getViewPrintMachinecheckMultiweak = async (params) =>
  await axios({
    url: '/148/c882234fd8/array.json',
    params
  }).then((res) => res);
