import * as db from "../services/Proclist";

const namespace = "common";
export default {
  namespace,
  state: {
    procList: [],
    productList: []
  },
  reducers: {
    setProcList(state, { payload: procList }) {
      return {
        ...state,
        procList
      };
    },
    setProduct(state, { payload: productList }) {
      return {
        ...state,
        productList
      };
    }
  },
  effects: {
    *getProclist(payload, { put, call }) {
      let { data } = yield call(db.getPrintNewprocType);
      yield put({
        type: "setProcList",
        payload: data
      });
    },
    *getProduct(payload, { put, call }) {
      let { data } = yield call(db.getProduct);
      yield put({
        type: "setProduct",
        payload: data.map(item => {
          item.name = item.name.trim();
          return item;
        })
      });
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(async () => {
        dispatch({ type: "getProclist" });
        dispatch({ type: "getProduct" });
      });
    }
  }
};
