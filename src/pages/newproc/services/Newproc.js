import { axios } from '../../../utils/axios';

/**
*   @database: { 质量信息系统 }
*   @desc:     { 印码机台列表 } 
  
*/
export const getMachine = async () =>
  await axios({
    url: '/70/75b4becb09/array.json'
  }).then((res) => res);

/**
*   @database: { 质量信息系统 }
*   @desc:     { 四新计划列表 } 
  
    const { tstart, tend } = params;
*/
export const getViewPrintNewprocPlan = async (params) =>
  await axios({
    url: '/75/6ac934ad66/array.json',
    params
  }).then((res) => res);

/**
*   @database: { 质量信息系统 }
*   @desc:     { 按开始时间插入四新计划 } 
  
    const { date_type, machine_name, proc_name, prod_id, reason, num1, num2, proc_stream1, proc_stream2, rec_date1, rec_date2, rec_time } = params;
*/
export const addPrintNewprocPlan1 = async (params) =>
  await axios({
    url: '/74/05807b4c13.json',
    params
  }).then((res) => res);

/**
*   @database: { 质量信息系统 }
*   @desc:     { 按时间范围插入四新计划 } 
  
    const { date_type, machine_name, proc_name, prod_id, reason, proc_stream1, rec_date1, rec_date2, rec_time } = params;
*/
export const addPrintNewprocPlan2 = async (params) =>
  await axios({
    url: '/76/e261b7e26b.json',
    params
  }).then((res) => res);

/**
*   @database: { 质量信息系统 }
*   @desc:     { 增加冠字号段验证计划 } 
  
    const { alpha_num, date_type, num1, num2, proc_name, proc_stream1, prod_id, reason, rec_time } = params;
*/
export const addPrintNewprocPlan3 = async (params) =>
  await axios({
    url: '/85/4f8c1cbb45.json',
    params
  }).then((res) => res);

/**
*   @database: { 	MES系统_生产环境 }
*   @desc:     { 印刷工序所有机台列表 } 
  
*/
export const getTBBASEMACHINEINFO = async () =>
  await axios({
    url: '/88/6d0e2a4781.json'
  }).then((res) => res);

/**
*   @database: { MES系统_生产环境 }
*   @desc:     { 机台最近开印品种 } 
  
    const { machine_name } = params;
*/
export const getLatestMachineProd = async (params) =>
  await axios({
    url: '/89/cab08fa0d8.json',
    params
  }).then((res) => res);
