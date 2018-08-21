import {
    axios
} from '../../utils/axios'
const R = require('ramda');

/**
*   @database: { 接口管理 }
*   @desc:     { 码后核查严重废锁图车号列表 } 
    const { tstart, tend } = params;
*/
export const getMahoudata = async params => await axios({
    url: '/173/ac85e53805/array.json?cache=10',
    params,
}).then(res => res);

export const getUniqCarts = cartList => R.compose(R.uniq, R.map(R.trim), R.map(R.nth(0)), R.filter(item => item[4] < 101))(cartList)

/**
 *   @database: { 质量信息系统_图像库 }
 *   @desc:     { 码后核查严重废图像列表 } 
 */
export const getSeriousImg = async carts => await axios({
    url: '/171/994d3ec6b8.json?blob[]=img_data&cache=50000',
    params: {
        carts
    },
}).then(res => res);

/**
 *   @database: { 质量信息系统 }
 *   @desc:     { 码后核查严重废图像判废结果 } 
 */
export const getSeriousImgStatus = async carts => await axios({
    url: '/174/76844be75f.json',
    params: {
        carts
    },
}).then(res => res);

/**
 *   @database: { 质量信息系统_图像库 }
 *   @desc:     { 码后核查严重废锁图各区域报错情况 } 
 */
export const getSeriousImgCount = async carts => await axios({
    url: '/178/005fdd6e3f/array.json',
    params: {
        carts
    },
}).then(res => res);