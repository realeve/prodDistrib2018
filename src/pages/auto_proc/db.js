import { axios } from '../../utils/axios';

/**
*   @database: { 质量信息系统 }
*   @desc:     { 码前产品工艺自动优选 } 
    const { tstart, tend } = params;
*/
export const getPrintWmsAutoproc = (params) =>
  axios({
    url: '/289/ee8ec83580/array.json',
    params
  });
