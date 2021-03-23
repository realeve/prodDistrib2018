import { axios, DEV, mock, _commonData } from "@/utils/axios";
import http from "axios";
/**
*   @database: { 质量信息系统 }
*   @desc:     { 异常产品原因列表 } 
  
*/
export const getPrintAbnormalProd = () =>
  axios({
    url: "/72/2b853fe9ed.json"
  });

/**
*   @database: { 质量信息系统 }
*   @desc:     { 异常产品车号列表 } 
  
    const { tstart, tend } = params;
*/
export const getViewPrintAbnormalProd = params =>
  axios({
    url: "/73/2dcf6571e6/array.json",
    params
  });

/**
*   @database: { 质量信息系统 }
*   @desc:     { 添加异常品 } 
  
    const { prod_id, cart_number, rec_date, machine_name, reason, proc_stream, proc_name, captain_name, prod_date, problem_type } = params;
*/
export const addPrintAbnormalProd = params =>
  axios({
    url: "/77/d9072e2900.json",
    params
  });

/**
*   @database: { 接口管理 }
*   @desc:     { 根据车号查询生产信息 } 
  
    const { cart } = params;
*/
// export const getViewCartfinder = async (params) =>
//   await axios({
//     url: '/86/2f2847fddf.json',
//     params
//   })

/**
 *   @database: { MES_MAIN }
 *   @desc:     { 根据车号查询生产信息 } 
    const { cart } = params;
 */
export const getViewCartfinder = params =>
  axios({
    url: "/350/e20e9bbe6e.json",
    params
  });

export const getTbstock = carnos =>
  getTbbaseCarTechnologHistory({
    carnos
  });

/**
*   @database: { MES系统_生产环境 }
*   @desc:     { 查询批次状态 } 
    const { carnos1, carnos2, carnos3 } = params;
*/
const getTbbaseCarTechnologHistory = params =>
  axios({
    url: "/334/f47b05f146/array.json",
    params
  });

/**
*   @database: { 质量信息系统 }
*   @desc:     { 人工拉号车号万数汇总 } 
    const { tstart, tend, tstart2, tend2 } = params;
*/
export const getPrintSampleCartlist = params =>
  axios({
    url: "/124/cd6e54e7e3.json",
    params
  });

/**
 *   @database: { MES_MAIN }
 *   @desc:     { 图核排产_人员列表 }
 */
export const getUserList = () =>
  DEV
    ? mock(require("@/mock/365_2f288db095.json"))
    : axios({
        url: "/365/2f288db095.json"
      });

// export const getUserList = () => mock(require('../../../../mock/userList.js'));

// 判废人员名单信息存储
const KEY_OPERATOR = "imagecheck_operator";
export const saveOperatorList = users => {
  window.localStorage.setItem(KEY_OPERATOR, JSON.stringify(users));
};

export const loadOperatorList = () => {
  let users = window.localStorage.getItem(KEY_OPERATOR);
  if (users == null) {
    return [];
  }
  return JSON.parse(users);
};

// DEV? mock(require("@/mock/addcart_task.js").data):
// 开始图核排产
export const getHechaTasks = data =>
  http({
    url: DEV
      ? "http://localhost:3000/api/hecha/task"
      : "http://10.8.1.27:4000/api/hecha/task", //"http://10.8.1.27:4000/api/hecha/task", // 'http://localhost:3000/api/hecha/task', //
    method: "post",
    data
  }).then(({ data }) => data);

/**
*   @database: { 质量信息系统 }
*   @desc:     { 记录核查任务信息 } 
    const { task_info, rec_time } = params;
*/
export const addPrintHechatask = params =>
  DEV
    ? mock(_commonData)
    : axios({
        method: "post",
        data: {
          ...params,
          id: 366,
          nonce: "f34a198b23"
        }
      });

/**
 *   @database: { 质量信息系统 }
 *   @desc:     { 读取最近排产任务 }
 */
export const getPrintHechatask = () =>
  DEV
    ? mock(require("@/mock/367_ffd6916add.json"))
    : axios({
        url: "/367/ffd6916add.json"
      });

/**
*   @database: { 全幅面 }
*   @desc:     { 图像判废日均产量原始记录 } 
    const { tstart, tend, tstart2, tend2, tstart3, tend3, tstart4, tend4 } = params;
*/
export const getWipProdLogs = params =>
  // DEV
  //   ? mock(require('@/mock/383_7f95a2c2a7.json'))
  //   :
  axios({
    url: "/383/7f95a2c2a7/array.json",
    params
  });

/**
*   @database: { 全幅面 }
*   @desc:     { 图像判废月度产量汇总 } 
    const { tstart, tend } = params;
*/
export const getQfmWipProdLogs = params =>
  DEV
    ? mock(require("@/mock/186_9a8e4c9d74.json"))
    : axios({
        url: "/186/9a8e4c9d74.json",
        params: {
          ...params,
          cache: 5
        }
      });

export const getVCbpcCartlist = params =>
  DEV
    ? mock(require("@/mock/373_c990d890b4.json")).then(res => {
        res.data = res.data.map(item => Object.values(item));
        return res;
      })
    : axios({
        url: "/1263/53a08bed25/array.json",
        params
      });

/**
 *   @database: { 全幅面 }
 *   @desc:     { 指定时间范围判活原始记录 }
 */
export const getPFLogs = params =>
  axios({
    url: DEV ? "@/mock/1262_ad0e9174ae.json" : "/1262/ad0e9174ae.array",
    params
  });

/**
*   @database: { 号码三合一 }
*   @desc:     { 号码判废量原始记录 } 
    const { tstart, tend } = params;
*/
export const getWipProdLogsCode = params =>
  DEV
    ? mock(require("@/mock/385_29fd5573a4.json"))
    : axios({
        url: "/385/29fd5573a4/array.json",
        params
      });

/**
*   @database: { 号码三合一 }
*   @desc:     { 号码判废量汇总 } 
    const { tstart, tend } = params;
*/
export const getWipProdLogsCodeCount = params =>
  DEV
    ? mock(require("@/mock/386_666b98f1d1.json"))
    : axios({
        url: "/386/666b98f1d1.json",
        params
      });

/**
*   @database: { MES_MAIN }
*   @desc:     { 图核判废用户关注信息 } 
    const { tstart, tend } = params;
*/
export const getVCbpcCartcare = params =>
  DEV
    ? mock(require("@/mock/481_77013f03b6.json"))
    : axios({
        url: "/481/77013f03b6/array.json",
        params
      });

/**
 *   @database: { MES系统_生产环境 }
 *   @desc:     { 指定车号冠字信息查询 }
 */
export const getVCbpcCartLite = carts =>
  DEV
    ? mock(require("@/mock/588_9f836c859a.json"))
    : axios({
        url: "/588/9f836c859a.json",
        params: {
          carts
        }
      });
