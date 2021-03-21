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
      : "1259/44f5fc8933",
    params: { tstart, tend }
  }).then(res => res.data);

// 判废人员名单信息存储
const KEY_OPERATOR = "image_check_operator";
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
