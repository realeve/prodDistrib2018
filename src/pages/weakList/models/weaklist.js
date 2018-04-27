import * as db from "../services/weaklist";
import * as dbTblHandler from "../../../services/table";

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
    dataCount3: []
  },
  reducers: {
    save(
      state,
      {
        payload: { dataSrc, dataCount, dataCount2, dataCount3 }
      }
    ) {
      return { ...state, dataSrc, dataCount, dataCount2, dataCount3 };
    }
  },
  effects: {
    *fetchAPIData(
      {
        payload: { params }
      },
      { call, put }
    ) {
      let dataSrc = yield call(db.getViewPrintMachinecheckWeakSrc, params);
      dataSrc = yield call(dbTblHandler.handleSrcData, dataSrc);

      let dataCount = yield call(db.getViewPrintMachinecheckWeak, params);
      dataCount = yield call(dbTblHandler.handleSrcData, dataCount);

      let dataCount2 = yield call(
        db.getViewPrintMachinecheckWeakCount2,
        params
      );
      dataCount2 = yield call(dbTblHandler.handleSrcData, dataCount2);

      let dataCount3 = yield call(
        db.getViewPrintMachinecheckWeakCount3,
        params
      );
      dataCount3 = yield call(dbTblHandler.handleSrcData, dataCount3);

      yield put({
        type: "save",
        payload: {
          dataSrc,
          dataCount,
          dataCount2,
          dataCount3
        }
      });
    }
  }
};
