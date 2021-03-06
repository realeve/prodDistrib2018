import * as db from "../services/weaklist";
// import * as dbTblHandler from "../../../services/table";

/*
redux-saga:
  call:   调用 services中的异步事件
  put:    dispatch({type:'namespace/reducer',payload});
  select: getState(state)
*/
const namespace = "weaklist";
export default {
    namespace,
    state: {
        dataSrc: [],
        dataCount: [],
        dataCount2: [],
        dataCount3: [],
        dataCount4: [],
        dataCount5: [],
        dataCount6: []
    },
    reducers: {
        save(
            state, {
                payload: {
                    dataSrc,
                    dataCount,
                    dataCount2,
                    dataCount3,
                    dataCount4,
                    dataCount5,
                    dataCount6
                }
            }
        ) {
            return {
                ...state,
                dataSrc,
                dataCount,
                dataCount2,
                dataCount3,
                dataCount4,
                dataCount5,
                dataCount6
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
            let dataSrc = yield call(db.getViewPrintMachinecheckWeakSrc, params);
            let dataCount = yield call(db.getViewPrintMachinecheckWeak, params);
            let dataCount2 = yield call(
                db.getViewPrintMachinecheckWeakCount2,
                params
            );
            let dataCount3 = yield call(
                db.getViewPrintMachinecheckWeakCount3,
                params
            );
            let dataCount4 = yield call(db.getPrintMachinecheckWeak, params);
            let dataCount5 = yield call(db.getViewPrintMachinecheckWeakCompetition, params);
            let dataCount6 = yield call(db.getViewPrintMachinecheckWeakJF, params);

            yield put({
                type: "save",
                payload: {
                    dataSrc,
                    dataCount,
                    dataCount2,
                    dataCount3,
                    dataCount4,
                    dataCount5,
                    dataCount6
                }
            });
        }
    }
};