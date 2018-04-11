import { axios } from "../../../utils/axios";

/**
*   @database: { 机台作业 }
*   @desc:     { 车号信息查询 } 
  
    const { cart } = params;
*/
export const getVIEWCARTFINDER = async params =>
  await axios({
    url: "/82/32635d468b.json",
    params
  }).then(res => res);

/**
*   @database: { 质量信息系统 }
*   @desc:     { 机台连续废信息通知 } 
  
    const { cart_number, prod_id, proc_name, machine_name, captain_name, fake_type, kilo_num, pos_num, remark, rec_time } = params;
*/
export const addPrintMachinecheckMultiweak = async params =>
  await axios({
    url: "/83/3475990fbf.json",
    params
  }).then(res => res);
