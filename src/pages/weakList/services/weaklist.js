import { axios } from "../../../utils/axios";

// 处理所有数据更新请求
export const getQueryConfig = params => ({
  type: "weaklist/fetchAPIData",
  payload: { params }
});

/**
*   @database: { 质量信息系统 }
*   @desc:     { 机检弱项记废列表 } 
    const { tstart, tend } = params;
*/
export const getViewPrintMachinecheckWeakSrc = async params =>
  await axios({
    url: "/81/a22afbf675/array.json",
    params
  }).then(res => res);

/**
*   @database: { 质量信息系统 }
*   @desc:     { 机检弱项产品作废汇总 } 
    const { tstart, tend } = params;
*/
export const getViewPrintMachinecheckWeak = async params =>
  await axios({
    url: "/110/b579b29ab8/array.json",
    params
  }).then(res => res);

/**
*   @database: { 质量信息系统 }
*   @desc:     { 各机台弱项类型汇总 } 
    const { tstart, tend } = params;
*/
export const getViewPrintMachinecheckWeakCount2 = async params =>
  await axios({
    url: "/111/0dfc50bc58/array.json",
    params
  }).then(res => res);

/**
*   @database: { 质量信息系统 }
*   @desc:     { 胶凹设备机检弱项分布 } 
    const { tstart, tend } = params;
*/
export const getViewPrintMachinecheckWeakCount3 = async params =>
  await axios({
    url: "/112/e91457516b/array.json",
    params
  }).then(res => res);
