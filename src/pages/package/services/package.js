import { axios } from '../../../utils/axios';

const R = require('ramda');

const handleBaseInfo = (data) => {
  // let white = R.filter(R.propEq('worktype_name', '白班'))(data);
  // let black = R.reject(R.propEq('worktype_name', '白班'))(data);
  // white = white.sort(
  //   (a, b) => a.gh.replace(/[a-zA-Z]/g, '') - b.gh.replace(/[a-zA-Z]/g, '')
  // );
  // black = black.sort(
  //   (a, b) => a.gh.replace(/[a-zA-Z]/g, '') - b.gh.replace(/[a-zA-Z]/g, '')
  // );
  // return [...white, ...black]
  return data.map((item) => {
    item.tech =
      item.tech === '码后核查'
        ? '码后'
        : item.tech == '全检品'
        ? '全检'
        : item.tech;
    return item;
  });
};

const handleProdResult = (data) => {
  let res = R.groupBy(R.prop('machine_name'))(data);
  return R.compose(
    R.map((key) => {
      let item = res[key];
      // let baseInfo = R.compose(
      //   R.pick(
      //     'machine_id,machine_name,prod_name,expect_num,real_num,type,rec_date'.split(
      //       ','
      //     )
      //   ),
      //   R.nth(0)
      // )(item);
      let baseInfo = R.nth(0, item);
      baseInfo.data = [];
      item.forEach((cartInfo) => {
        baseInfo.data.push(
          R.pick(
            'carno,ex_opennum,gh,status_name,rec_id,tech,work_type_name,worktype_name'.split(
              ','
            )
          )(cartInfo)
        );
      });
      baseInfo.data = handleBaseInfo(baseInfo.data);
      return baseInfo;
    }),
    R.keys
  )(res);
};

/**
 *   @database: { 质量信息系统 }
 *   @desc:     { 核查排活任务列表 }
 */
export const getPrintCutMachine = () =>
  axios({
    url: '/255/8d354d317b.json'
  });

/**
 *   @database: { 质量信息系统 }
 *   @desc:     { 工艺列表 }
 */
export const getPrintCutProcList = () =>
  axios({
    url: '/257/8cc4ce7bb2/2000.json'
  });

/**
 *   @database: { 质量信息系统 }
 *   @desc:     { 班次列表 }
 */
export const getPrintCutWorktype = () =>
  axios({
    url: '/258/698d58a01a/2000.json'
  });

/**
 *   @database: { 机台作业 }
 *   @desc:     { 裁封自动线最近一月机台品种列表 }
 */
export const getViewCartfinder = () =>
  axios({
    url: '/259/d390c28544.json'
  });

/**
 *   @database: { 库管系统 }
 *   @desc:     { 码后核查在库锁车产品列表 }
 */
export const getVwWimWhitelist = () =>
  axios({
    url: '/260/4c0645f3d4/1.json'
  });

/**
 *   @database: { 全幅面 }
 *   @desc:     { 码后核查判废完工车号列表 }
 */
export const getQfmWipJobs = (carts) =>
  axios({
    url: '/250/b3d68925f6.array',
    params: {
      carts
    }
  }).then(({ data }) => R.uniq(R.flatten(data)));

/** NodeJS服务端调用：
 *
 *   @database: { 库管系统 }
 *   @desc:     { 码后核查在库产品未判废或未同步车号列表 }
 */
module.exports.getVwWimWhitelistUncomplete = () =>
  axios({
    url: '/262/37762ded85.json'
  });

/**
*   @database: { 质量信息系统 }
*   @desc:     { 新建排产任务信息 } 
    const { prod_id, machine_id, worktype_id, num,  proc_type_id, status,remark } = params;
*/
export const addPrintCutTask = (params) =>
  axios({
    url: '/263/95f28321f8.json',
    params
  });

/**
 *   @database: { 质量信息系统 }
 *   @desc:     { 移除排产任务 }
 */
export const delPrintCutTask = (task_id) =>
  axios({
    url: '/264/efd6e5a164.json',
    params: {
      task_id
    }
  });

/**
*   @database: { 质量信息系统 }
*   @desc:     { 更新排产任务 } 
    const { prod_id, machine_id, worktype_id, num,  proc_type_id, status, task_id } = params;
*/
export const setPrintCutTask = (params) =>
  axios({
    url: '/265/62d86b30c1.json',
    params
  });

/**
 *   @database: { 库管系统 }
 *   @desc:     { 立体库查询一组产品锁车状态 }
 */
export const getVwBlacklist = (carts) =>
  axios({
    url: '/266/050298c7cf.json',
    params: {
      carts
    }
  });

/**
*   @database: { 库管系统 }
*   @desc:     { 开包量异常产品列表 } 
    const { prod2, prod3, prod4, prod6, prod7 } = params;
*/
export const getVwWimWhitelistAbnormal = (params) =>
  axios({
    url: '/269/15c7b56487.json',
    params
  });

/**
 *   @database: { 质量信息系统 }
 *   @desc:     { 各品种开包量限额 }
 */
export const getProductdata = () =>
  axios({
    url: '/272/eae49a15d0.json'
  });

/**
*   @database: { 质量信息系统 }
*   @desc:     { 更新品种开包量阈值设置 } 
    const { limit, prod_name } = params;
*/
export const setProductdata = (params) =>
  axios({
    url: '/273/920c2e5dfb.json',
    params
  });

export const getThreadByProdname = (prodList) => {
  let params = {
    prod2: 150,
    prod3: 150,
    prod4: 150,
    prod6: 150,
    prod7: 150
  };
  prodList.forEach(({ prod_name, limit }) => {
    switch (prod_name) {
      case '9602A':
        params.prod2 = limit;
        break;
      case '9603A':
        params.prod3 = limit;
        break;
      case '9604A':
        params.prod4 = limit;
        break;
      case '9606A':
        params.prod6 = limit;
        break;
      case '9607T':
        params.prod7 = limit;
        break;
      default:
        break;
    }
  });
  return params;
};

/**
 *   @database: { 质量信息系统 }
 *   @desc:     { 检封排活结果 }
 */
export const getViewPrintCutProdLog = () =>
  axios({
    url: '/274/9a3ae8bb4b.json'
  }).then(({ data }) => handleProdResult(data));

/**
 *   @database: { 质量信息系统 }
 *   @desc:     { 取消单万排活任务 }
 */
export const setPrintCutProdLog = (rec_id) =>
  axios({
    url: '/275/fa49156e41.json',
    params: {
      rec_id
    }
  });

/**
 *   @database: { 库管系统 }
 *   @desc:     { 指定车号在库信息查询 }
 */
export const getVwWimWhitelistStatus = (carts) =>
  axios({
    url: '/268/5c9f14f76f.json',
    params: {
      carts
    }
  });

/**
*   @database: { 质量信息系统 }
*   @desc:     { 批量批量记录检封排产任务 } 
	以下参数在建立过程中与系统保留字段冲突，已自动替换:
	@desc:批量插入数据时，约定使用二维数组values参数，格式为[{task_id,type,expect_num,real_num,gh,prodname,tech,carno,ex_opennum,status,rec_date }]，数组的每一项表示一条数据*/
export const addPrintCutProdLog = (values) =>
  axios({
    method: 'post',
    data: {
      values,
      id: 270,
      nonce: '6f3ed8e1ec'
    }
  });

/**
 *   @database: { 质量信息系统 }
 *   @desc:     { 更新车号列表领用状态 }
 */
export const setPrintCutProdLogByCarts = (carts) =>
  axios({
    url: '/276/84a244aae0.json',
    params: {
      carts
    }
  });
