import { axios } from "../utils/axios";

/**
*   @database: { 质量信息系统 }
*   @desc:     { 流转工艺列表 } 
  
*/
export const getPrintNewprocType = async () =>
  await axios({
    url: "/87/a7835c9ebc.json"
  }).then(res => res);

/**
*   @database: { 质量信息系统 }
*   @desc:     { 印钞品种列表 } 
  
*/
export const getProduct = async () =>
  await axios({
    url: "/71/0fff65bc40.json"
  }).then(res => res);
