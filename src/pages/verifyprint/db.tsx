import { axios, mock } from "@/utils/axios";
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
