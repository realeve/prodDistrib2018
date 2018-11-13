import { axios } from '../../../utils/axios';

/**
 *   @database: { 质量信息系统 }
 *   @desc:     { 核查排活任务列表 }
 */
export const getPrintCutMachine = () =>
  axios({
    url: '/255/8d354d317b.json'
  });

/**
 *   @database: { 质量信息系统 }
 *   @desc:     { 工艺列表 }
 */
export const getPrintCutProcList = () =>
  axios({
    url: '/257/8cc4ce7bb2/200.json'
  });

/**
 *   @database: { 质量信息系统 }
 *   @desc:     { 班次列表 }
 */
export const getPrintCutWorktype = () =>
  axios({
    url: '/258/698d58a01a/2000.json'
  });

/**
 *   @database: { 机台作业 }
 *   @desc:     { 裁封自动线最近一月机台品种列表 }
 */
export const getViewCartfinder = () =>
  axios({
    url: '/259/d390c28544.json'
  });

/**
 *   @database: { 库管系统 }
 *   @desc:     { 码后核查在库锁车产品列表 }
 */
export const getVwWimWhitelist = () =>
  axios({
    url: '/260/4c0645f3d4/30.json'
  });

/**
 *   @database: { 全幅面 }
 *   @desc:     { 码后核查判废完工车号列表 }
 */
export const getQfmWipJobs = (carts) =>
  axios({
    url: '/250/b3d68925f6.array',
    params: {
      carts
    }
  }).then(({ data }) => R.uniq(R.flatten(data)));

/** NodeJS服务端调用：
 *
 *   @database: { 库管系统 }
 *   @desc:     { 码后核查在库产品未判废或未同步车号列表 }
 */
module.exports.getVwWimWhitelistUncomplete = () =>
  axios({
    url: '/262/37762ded85/30.json'
  });

/**
*   @database: { 质量信息系统 }
*   @desc:     { 新建排产任务信息 } 
    const { prod_id, machine_id, worktype_id, num, limit, proc_type_id, status } = params;
*/
export const addPrintCutTask = (params) =>
  axios({
    url: '/263/95f28321f8.json',
    params
  });

/**
 *   @database: { 质量信息系统 }
 *   @desc:     { 移除排产任务 }
 */
export const delPrintCutTask = (task_id) =>
  axios({
    url: '/264/efd6e5a164.json',
    params: {
      task_id
    }
  });

/**
*   @database: { 质量信息系统 }
*   @desc:     { 更新排产任务 } 
    const { prod_id, machine_id, worktype_id, num, limit, proc_type_id, status, task_id } = params;
*/
export const setPrintCutTask = (params) =>
  axios({
    url: '/265/62d86b30c1.json',
    params
  });

/**
 *   @database: { 库管系统 }
 *   @desc:     { 立体库查询一组产品锁车状态 }
 */
export const getVwBlacklist = (carts) =>
  axios({
    url: '/266/050298c7cf.json',
    params: {
      carts
    }
  });
