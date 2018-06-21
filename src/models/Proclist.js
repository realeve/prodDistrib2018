import * as db from "../services/Proclist";

const namespace = "common";
export default {
  namespace,
  state: {
    procList: [],
    productList: [],
    userSetting: {
      uid: '',
      name: '',
      avatar: ''
    }
  },
  reducers: {
    setStore(state, {
      payload
    }) {
      return { ...state,
        ...payload
      };
    }
  },
  effects: {
    * getProclist(payload, {
      put,
      call
    }) {
      let {
        data
      } = yield call(db.getPrintNewprocType);
      yield put({
        type: "setStore",
        payload: {
          procList: data
        }
      });
    },
    * getProduct(payload, {
      put,
      call
    }) {
      let {
        data
      } = yield call(db.getProduct);
      yield put({
        type: "setStore",
        payload: {
          productList: data.map(item => {
            item.name = item.name.trim();
            return item;
          })
        }
      });
    }
  },
  subscriptions: {
    setup({
      dispatch,
      history
    }) {
      return history.listen(async () => {
        dispatch({
          type: "getProclist"
        });
        dispatch({
          type: "getProduct"
        });
      });
    }
  }
};
