import pathToRegexp from "path-to-regexp";
import * as db from "../services/Newproc";
import dateRanges from "../../../utils/ranges";
// import {
//   DEV
// } from '../../../utils/axios';

import {
    setStore
} from '@/utils/lib';

const namespace = "newproc";
export default {
    namespace,
    state: {
        dataSrc: [],
        dateRange: [],
        procList: [],
        machineList: []
    },
    reducers: {
        setStore
    },
    effects: {
        * handleReportData(payload, {
            call,
            put,
            select
        }) {
            const {
                dateRange
            } = yield select(state => state[namespace]);

            let dataSrc = yield call(db.getViewPrintNewprocPlan, {
                tstart: dateRange[0],
                tend: dateRange[1]
            });

            yield put({
                type: "setStore",
                payload: {
                    dataSrc
                }
            });
        },
        * getMachineList(payload, {
            call,
            put
        }) {
            let {
                data
            } = yield call(db.getTBBASEMACHINEINFO);
            yield put({
                type: "setStore",
                payload: {
                    machineList: data
                }
            });
        },
        * getProc(payload, {
            put,
            select,
            call
        }) {
            // let proc = yield call(db.getPrintAbnormalProd);
            // yield put({
            //   type: "setProc",
            //   payload: proc.data
            // });
            yield put({
                type: "setStore",
                payload: {
                    procList: [{
                            proc_name: "新设备"
                        },
                        {
                            proc_name: "新工艺"
                        },
                        {
                            proc_name: "新技术"
                        },
                        {
                            proc_name: "新产品"
                        },
                        {
                            proc_name: "新材料"
                        },
                        {
                            proc_name: "其它"
                        }
                    ]
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
                    const [tstart, tend] = dateRanges["最近一月"];
                    const [ts, te] = [tstart.format("YYYYMMDD"), tend.format("YYYYMMDD")];

                    await dispatch({
                        type: "setStore",
                        payload: {
                            dateRange: [ts, te]
                        }
                    });
                    dispatch({
                        type: "handleReportData"
                    });

                    // if (!DEV) {
                    //   dispatch({
                    //     type: "getMachineList"
                    //   });
                    // }
                    dispatch({
                        type: "getMachineList"
                    });

                    dispatch({
                        type: "getProc"
                    });
                }
            });
        }
    }
};