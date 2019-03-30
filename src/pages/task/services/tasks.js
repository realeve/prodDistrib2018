import { axios } from '../../../utils/axios';

/**
*   @database: { 质量管理数据库 }
*   @desc:     { 已领取车号列表 } 
  
    const { tstart, tend ,status } = params;
*/
export const getPrintSampleCartlist = async (params) =>
  await axios({
    url: '/55/38989f6661/array.json',
    params
  }).then((res) => res);

/**
 *   @database: { 质量信息系统 }
 *   @desc:     { 待检车号列表 }
 */
export const getPrintSampleCartlistAll = async () =>
  await axios({
    url: '/104/f0241dd3d4/array.json'
  }).then((res) => res);

/**
*   @database: { 质量管理数据库 }
*   @desc:     { 人工抽检领活 } 
  
    const { cart_number } = params;
*/
export const setPrintSampleCartlist = async (params) =>
  await axios({
    url: '/56/fe353b42f0.json',
    params
  }).then((res) => res);

/**
*   @database: { 质量管理数据库 }
*   @desc:     { 人工抽检更新设备抽检数 } 
  
    const { cart1, cart2 } = params;
*/
export const setPrintSampleMachine = async (params) =>
  await axios({
    url: '/57/3bbab164ad.json',
    params
  }).then((res) => res);

/**
*   @database: { 质量信息系统 }
*   @desc:     { 四新及异常品人工拉号产品列表 } 
    const { tstart, tend } = params;
*/
export const getPrintWmsProclist = async (params) =>
  await axios({
    url: '/121/fff29f5a04/array.json',
    params
  }).then((res) => res);

/**
 *   @database: { 库管系统 }
 *   @desc:     { 人工拉号准许出库查询 }
 */
export const getTbDryingstatusTask = async (carnos) =>
  await axios({
    url: '/125/0ec8ee76b3/array.json',
    params: {
      carnos
    }
  }).then((res) => res);

export const unlockCart = async (cart, update_machine = 1) =>
  await axios({
    url: 'http://10.8.1.27:4000/api/manual_status',
    params: {
      cart,
      update_machine
    }
  }).then((res) => res);
