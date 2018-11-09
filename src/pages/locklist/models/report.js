import pathToRegexp from "path-to-regexp";
import * as db from "../services/report";
import {
    setStore
} from '@/utils/lib';
const namespace = "locklist";
export default {
    namespace,
    state: {
        dataSrc: [],
        visible: false,
        confirmLoading: false,
        remark: '',
        cart_number: '',
        lock_type: 0
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
            let dataSrc = yield call(db.getVwBlacklist);
            yield put({
                type: "setStore",
                payload: {
                    dataSrc
                }
            });
        },
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
                    dispatch({
                        type: "handleReportData"
                    });
                }
            });
        }
    }
};