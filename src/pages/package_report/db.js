import { axios } from '../../utils/axios';

/**
*   @database: { 质量信息系统 }
*   @desc:     { 核查排产结果汇总 } 
    const { tstart, tend } = params;
*/
export const getPrintCutProdLog = (params) =>
  axios({
    url: '/284/43aa65d139/array',
    params
  });

/**
*   @database: { 质量信息系统 }
*   @desc:     { 检封机台实际开包量汇总 } 
    const { tstart, tend } = params;
*/
export const getCartinfodata = (params) =>
  axios({
    url: '/285/51d816d1fc/array',
    params
  });
