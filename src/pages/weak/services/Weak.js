import { axios } from '../../../utils/axios';
/**
*   @database: { 机台作业 }
*   @desc:     { 冠字查车号 } 
  
    const { prod, alpha, start, end, alpha2, start2, end2 } = params;
*/
// export const getVIEWCARTFINDER = async params =>
//   await axios({
//     url: "/79/797066c5d6.json",
//     params
//   }).then(res => res);

/**
*   @database: { MES_MAIN }
*   @desc:     { 冠字查车号 } 
    const { prod, alpha, start, end, alpha2, start2, end2 } = params;
*/

export const getVIEWCARTFINDER = async (params) => {
  let res1 = await await axios({
    url: '/79/797066c5d6.json',
    params
  });
  let res2 = await axios({
    url: '/353/6a7cbf14d5.json',
    params
  });

  // 机台作业未搜到冠字
  if (res1.rows == 0 && res2.rows > 0) {
    // 根据车号重新搜索
    let cart = res2.data[0].cartNumber;
    res1 = await axios({
      url: '/354/2b31102d60.json',
      params: {
        cart
      }
    });
  }

  res1.rows += res2.rows;
  res1.data = [...res1.data, ...res2.data];
  return res1;
};

/**
*   @database: { 质量信息系统 }
*   @desc:     { 添加机检弱项信息 } 
  
    const { prod_id, code_num, cart_number, proc_name, machine_name, captain_name, fake_type, paper_num, level_type, img_url, remark, rec_time } = params;
*/
export const addPrintMachinecheckWeak = async (params) =>
  await axios({
    url: '/80/c2f98ddf63.json',
    params
  }).then((res) => res);

/**
*   @database: { 质量信息系统 }
*   @desc:     { 机台是否通知作废信息 } 
  
    const { cart_number } = params;
*/
export const getPrintMachinecheckMultiweak = async (params) =>
  await axios({
    url: '/84/4c10668fdd.json',
    params
  }).then((res) => res);

/**
 *   @database: { 质量信息系统 }
 *   @desc:     { 当前车号已输入信息 }
 */
export const getViewPrintMachinecheckWeak = async (cart) =>
  await axios({
    url: '/113/898aa211d8/array.json',
    params: {
      cart
    }
  }).then((res) => res);
