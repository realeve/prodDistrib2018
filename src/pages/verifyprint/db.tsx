import { axios, mock } from "@/utils/axios";
import { now } from "@/utils/lib";
/**
 *   @database: { 印码抽样及图像审核 }
 *   @desc:     { 图像审核信息 }
 */
export const getVerifyLog = cartid =>
  axios({
    url: "/978/4939b667ba.json",
    params: {
      cartid
    }
  });
/**
*   @database: { 印码抽样及图像审核 }
*   @desc:     { 图像审核打单字段更新 } 
	以下参数在建立过程中与系统保留字段冲突，已自动替换:
	@id:_id. 参数说明：api 索引序号
    const { print_time, _id } = params;
*/
export const setVerifyCarts = _id =>
  axios({
    url: "/979/e00f18f310.json",
    params: {
      _id,
      print_time: now()
    }
  });
