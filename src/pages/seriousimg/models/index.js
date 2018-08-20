import * as db from "../db";
import pathToRegexp from "path-to-regexp";
import dateRanges from "../../../utils/ranges";
const R = require('ramda')

const namespace = "seriousimg";
export default {
    namespace,
    state: {
        dateRange: [],
        dataSrc: [],
        seriousImg: [],
    },
    reducers: {
        setStore(state, {
            payload
        }) {
            return {
                ...state,
                ...payload
            };
        }
    },
    effects: {
        * fetchAPIData({
            payload: {
                params
            }
        }, {
            call,
            put
        }) {
            let dataSrc = yield call(db.getMahoudata, params);
            let carts = yield call(db.getUniqCarts, dataSrc.data);
            let seriousImg = yield call(db.getSeriousImg, carts);
            let seriousImgStatus = yield call(db.getSeriousImgStatus, carts);
            seriousImg.data = seriousImg.data.map(item => {
                let res = R.find(s => s.id == item.id)(seriousImgStatus.data);
                let status = (res.status || 0);
                switch (parseInt(status, 10)) {
                    case 0:
                        item.status = '未判废';
                        break;
                    case 1:
                        item.status = '误废';
                        break;
                    case 2:
                        item.status = '二次误废';
                        break;
                    case 3:
                        item.status = '人工实废';
                        break;
                    case 7:
                        item.status = '二次疑似废';
                        break;
                    case 8:
                        item.status = '锁定实废';
                        break;
                    default:
                        item.status = '未知'
                        break;
                }
                item.img_data = 'data:image/jpg;base64,' + item.img_data
                return R.compose(R.values, R.pick(['id', 'cart_number', 'client_no', 'macro_id', 'img_data', 'format_pos', 'status']))(item);
            })

            seriousImg.header = ['id', '车号', '检测站', '宏区编号', '缺陷图', '开位', '判废结果'];
            yield put({
                type: "setStore",
                payload: {
                    dataSrc,
                    seriousImg
                }
            });
        }
    },
    subscriptions: {
        setup({
            dispatch,
            history
        }) {
            return history.listen(async({
                pathname,
                query
            }) => {
                const match = pathToRegexp("/" + namespace).exec(pathname);
                if (match && match[0] === "/" + namespace) {
                    const [tstart, tend] = dateRanges["7天前"];
                    const [ts, te] = [tstart.format("YYYYMMDD"), tend.format("YYYYMMDD")];
                    dispatch({
                        type: "setStore",
                        payload: {
                            dateRange: [ts, te]
                        }
                    });

                    // load default data
                    const config = {
                        type: 'fetchAPIData',
                        payload: {
                            params: {...query,
                                tstart: ts,
                                tend: te
                            }
                        }
                    }
                    await dispatch(config);
                }
            });
        }
    }
};