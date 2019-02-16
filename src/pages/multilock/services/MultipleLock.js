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
*   @desc:     { 批量工艺流程处理 } 
    const { tstart, tend, only_lock_cart } = params;
*/
export const getViewPrintAbnormalProd = async (params) =>
  await axios({
    url: '/137/d473b0d66a/array.json',
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
// export const getViewCartfinder = async params =>
//     await axios({
//         url: "/86/db8acd1ea1.json",
//         params
//     }).then(res => res);
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
    // url: '/132/6ac1e30d85/array.json',
    method: 'post',
    data: { ...params, id: 132, nonce: '6ac1e30d85', mode: 'array' }
  }).then((res) => res);

/**
*   @database: { 质量信息系统 }
*   @desc:     { 批量添加批量锁车车号列表 } 
	以下参数在建立过程中与系统保留字段冲突，已自动替换:
	@desc:批量插入数据时，约定使用二维数组values参数，格式为[{prod_id,cart_number,unlock_date,rec_date,reason,only_lock_cart,abnormal_type, complete_status, proc_stream }]，数组的每一项表示一条数据*/
export const addLockCartlist = async (values) =>
  await axios({
    method: 'post',
    data: {
      values,
      id: 138,
      nonce: '1d999548c0'
    }
  }).then((res) => res);

/**
*   @database: { 质量信息系统 }
*   @desc:     { 批量记录库管系统日志信息 } 
	以下参数在建立过程中与系统保留字段冲突，已自动替换:
	@desc:批量插入数据时，约定使用二维数组values参数，格式为[{remark,rec_time }]，数组的每一项表示一条数据*/
export const addPrintWmsLog = async (values) =>
  await axios({
    method: 'post',
    data: {
      values,
      id: 91,
      nonce: 'f0500427cb'
    }
  }).then((res) => res);

/**
*   @database: { 质量信息系统 }
*   @desc:     { 批量解锁 } 
    const { remark, carts } = params;
*/
export const setPrintAbnormalProd = async (params) =>
  await axios({
    url: '/139/00cbb681ae.json',
    params
  }).then((res) => res);

/**
 *   @database: { 机台作业 }
 *   @desc:     { 车号查冠字 }
 */
// export const getViewCartfinderGZ = async (carnos) =>
//   await axios({
//     url: '/105/153ec8ad02.json',
//     params: {
//       carnos
//     }
//   }).then((res) => res);

/**
 *   @database: { MES_MAIN }
 *   @desc:     { 车号查冠字 }
 */
export const getViewCartfinderGZ = (carnos) =>
  axios({
    url: '/347/d0fdd5b3d1.json',
    params: {
      carnos
    }
  });

/**
*   @database: { 质量信息系统 }
*   @desc:     { 批量批量插入立体库四新计划工艺流转信息 } 
	以下参数在建立过程中与系统保留字段冲突，已自动替换:
	@desc:批量插入数据时，约定使用二维数组values参数，格式为[{cart_number,gz_num,proc_plan,proc_real,rec_time }]，数组的每一项表示一条数据*/
export const addPrintWmsProclist = async (values) =>
  await axios({
    method: 'post',
    data: {
      values,
      id: 140,
      nonce: '1d8a3759f2'
    }
  }).then((res) => res);

/**
*   @database: { 质量信息系统 }
*   @desc:     { 更新wms日志信息 } 
    const { return_info, _id } = params;
*/
export const setPrintWmsLog = async (params) =>
  await axios({
    url: '/120/e7d88969ca.json',
    params
  }).then((res) => res);

/**
 *   @database: { 质量信息系统 }
 *   @desc:     { 获取当前用户锁车列表 }
 */
export const getLockedUsers = async (values) =>
  await axios({
    url: '/159/e3e4d8dd13/array.json',
    params: {
      values
    }
  }).then((res) => res);

/**
 *   @database: { 质量信息系统 }
 *   @desc:     { 指定车号列表是否是本周人工拉号任务 }
 */
export const getPrintSampleCartlist = async (cart_number) =>
  await axios({
    url: '/164/abd796c14c.json',
    params: {
      cart_number
    }
  }).then((res) => res);
