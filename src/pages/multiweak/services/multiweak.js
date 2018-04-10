import { axios } from "../../../utils/axios";

/**
*   @database: { 质量信息系统 }
*   @desc:     { 印钞品种列表 } 
  
*/
export const getProduct = async () =>
  await axios({
    url: "/71/0fff65bc40.json"
  }).then(res => {
    res.data = res.data.map(item => {
      item.name = item.name.trim();
      return item;
    });
    return res;
  });

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
