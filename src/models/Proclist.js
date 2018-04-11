import * as db from "../services/Proclist";

const namespace = "proclist";
export default {
  namespace,
  state: {
    procList: []
  },
  reducers: {
    setProcList(state, { payload: procList }) {
      return {
        ...state,
        procList
      };
    }
  },
  effects: {
    *getProclist(payload, { put, select, call }) {
      let { data } = yield call(db.getPrintNewprocType);
      yield put({
        type: "setProcList",
        payload: data
      });
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(async () => {
        dispatch({ type: "getProclist" });
      });
    }
  }
};
