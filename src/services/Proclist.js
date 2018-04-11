import { axios } from "../utils/axios";

/**
*   @database: { 质量信息系统 }
*   @desc:     { 流转工艺列表 } 
  
*/
export const getPrintNewprocType = async () =>
  await axios({
    url: "/87/a7835c9ebc.json"
  }).then(res => res);
