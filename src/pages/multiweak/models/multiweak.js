import pathToRegexp from "path-to-regexp";
import * as db from "../services/multiweak";

const namespace = "multiweak";
export default {
  namespace,
  state: {
    productList: [],
    fileList: []
  },
  reducers: {
    setProduct(state, { payload: productList }) {
      return {
        ...state,
        productList
      };
    },
    setFileList(state, { payload: fileList }) {
      return {
        ...state,
        fileList
      };
    }
  },
  effects: {
    *getProducts(payload, { put, call }) {
      let { data } = yield call(db.getProduct);
      yield put({
        type: "setProduct",
        payload: data
      });
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(async ({ pathname, query }) => {
        const match = pathToRegexp("/" + namespace).exec(pathname);
        if (match && match[0] === "/" + namespace) {
          dispatch({ type: "getProducts" });
        }
      });
    }
  }
};
