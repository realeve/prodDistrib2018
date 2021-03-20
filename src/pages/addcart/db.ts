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
}) => Promise<ICartItem[]> = ({ tstart, tend }) =>
  axios({
    url: DEV
      ? "http://localhost:8000/data/1259_44f5fc8933.json"
      : "1259/44f5fc8933",
    params: { tstart, tend }
  }).then(res => res.data);
