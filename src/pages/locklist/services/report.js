import {
    axios
} from "../../../utils/axios";

const R = require('ramda');
/**
 *   @database: { 库管系统 }
 *   @desc:     { 在库锁车列表 } 
 */
export const getVwBlacklist = async() => {
    let res = await axios({
        url: '/160/1e8982e423.json?cache=10'
    }).then(async res => res);
    res.header = ['车号', '品种', '类型', '锁车时间', '锁车原因', '工艺', '库房', '锁车原因', '锁车人'];
    res.data = R.map(R.compose(R.values, R.pick(['carno', 'prodName', 'psname', 'lockedAtStr', 'lockReasonStr', 'tech', 'orgName'])))(res.data);
    let carts1 = R.map(R.nth(0))(res.data);
    let {
        data
    } = await getPrintWmsProclist({
        carts1,
        carts2: carts1,
        carts3: carts1,
        cache: 10
    });
    res.data = res.data.map(item => {
        let cart = item[0];
        item[1] = item[1].replace('主业品', '')
        let lockReason = data.filter(([cart_number]) => cart_number === cart);
        if (lockReason.length === 0) {
            return [...item, '', ''];
        }
        let [lockInfo] = lockReason;
        if (lockReason.length > 1) {
            lockInfo = lockReason[lockReason.length - 1];
        }
        return [...item, lockInfo[1], lockInfo[2]];
    })
    return res;
}

/**
*   @database: { 质量信息系统 }
*   @desc:     { 批量查询锁车原因 } 
    const { carts1, carts2, carts3 } = params;
*/
const getPrintWmsProclist = async params => await axios({
    url: '/163/6e24e68067/array.json',
    params
    // method: 'post',
    // data: {
    //     id: 163,
    //     nonce: '6e24e68067',
    //     mode: 'array',
    //     ...params
    // },
}).then(res => res);



/**
*   @database: { 质量信息系统 }
*   @desc:     { 批量解锁 } 
    const { remark, carts } = params;
*/
export const setPrintAbnormalProd = async params => await axios({
    url: '/139/00cbb681ae.json',
    params,
}).then(res => res);