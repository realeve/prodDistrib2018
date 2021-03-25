import { axios, DEV, mock, _commonData } from "@/utils/axios";
import http from "axios";

export interface ICartItem {
  prod_name: string;
  cart_number: string;
  工序: string;
  机台: string;
  完成时间: string;
  产量: string;
  零头产品: string;
}

export const getCompleteCarts: (params: {
  tstart: string;
  tend: string;
}) => Promise<string[]> = ({ tstart, tend }) =>
  axios({
    url: DEV
      ? "http://localhost:8000/data/1259_44f5fc8933.json"
      : "1259/44f5fc8933.array",
    params: { tstart, tend }
  }).then(res => res.data);

/**
 *   @database: { MES系统_生产环境 }
 *   @desc:     { 图核排产_号码完工产品列表 }
 */
export const getCodeCompleteCarts = params =>
  axios({
    url: DEV ? "@/mock/1265_6fd7879f29.json" : "/1265/6fd7879f29.array",
    params
  }).then(res => res.data);

// 判废人员名单信息存储
const KEY_OPERATOR = "imagecheck_operator";
export const saveOperatorList = (users, key = KEY_OPERATOR) => {
  window.localStorage.setItem(key, JSON.stringify(users));
};

export const loadOperatorList = (key = KEY_OPERATOR) => {
  let users = window.localStorage.getItem(key);
  if (users == null) {
    return {};
  }
  return JSON.parse(users);
};

export const saveMachineList = (machines, key = "imagecheck_machine") =>
  saveOperatorList(machines, key);

export const loadMachineList = (key = "imagecheck_machine") =>
  loadOperatorList(key);

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

// DEV? mock(require("@/mock/addcart_task.js").data):
// 开始图核排产
export const getHechaTasks = data =>
  http({
    url: !DEV
      ? "http://localhost:3000/api/hecha/task"
      : "http://10.8.1.27:4000/api/hecha/task", // 'http://localhost:3000/api/hecha/task', //
    method: "post",
    data
  }).then(({ data }) => data);

export const getCodeTasks = data =>
  http({
    url: !DEV
      ? "http://localhost:3000/api/hecha/code"
      : "http://10.8.1.27:4000/api/hecha/code", // 'http://localhost:3000/api/hecha/task', //
    method: "post",
    data
  }).then(({ data }) => data);
