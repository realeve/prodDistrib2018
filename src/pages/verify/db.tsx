import { axios, mock } from "@/utils/axios";

let DEV = false;

/**
 *   @database: { 全幅面 }
 *   @desc:     { 票面实废图像信息查询 }
 */
export const getQfmWipJobs = cart =>
  DEV
    ? mock(require("./qfmwipjob.json"))
    : axios({
        url: "/438/49a52af747.json",
        params: {
          cart,
          blob: "image",
          cache: 5
        }
      });
/**
 *   @database: { 小张核查 }
 *   @desc:     { 丝印实废图像信息查询 }
 */
export const getWipJobs = cart =>
  DEV
    ? mock(require("./wipjobs.json"))
    : axios({
        url: "/439/e6ccdf08a7.json",
        params: {
          cart,
          blob: "image",
          cache: 5
        }
      });
/**
 *   @database: { 全幅面 }
 *   @desc:     { 指定大万实废分布 }
 */
export const getQfmWipJobsPos = carts =>
  DEV
    ? mock(require("./row.json"))
    : axios({
        url: "/534/bc70063e23.json",
        params: {
          carts
        }
      });

/**
*   @database: { 印码抽样及图像审核 }
*   @desc:     { 插入图像审核车号 } 
    const { cart, operator } = params;
*/
export const addVerifyCarts = params =>
  axios({
    url: "/976/2ccc85d85d.json",
    params
  });
/**
*   @database: { MES系统_测试环境 }
*   @desc:     { 批量图像审核标记 } 
	以下参数在建立过程中与系统保留字段冲突，已自动替换:
	@desc:批量插入数据时，约定使用二维数组values参数，格式为[{cartid,code,type,pos }]，数组的每一项表示一条数据*/
export const addVerifyLog = values =>
  axios({
    method: "post",
    data: {
      values,
      id: 977,
      nonce: "da27035b70"
    }
  });
