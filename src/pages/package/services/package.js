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
    url: '/257/8cc4ce7bb2.json'
  });

/**
 *   @database: { 质量信息系统 }
 *   @desc:     { 班次列表 }
 */
export const getPrintCutWorktype = () =>
  axios({
    url: '/258/698d58a01a.json'
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
    url: '/260/4c0645f3d4.json'
  });
