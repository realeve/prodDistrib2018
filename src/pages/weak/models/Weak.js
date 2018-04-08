import pathToRegexp from "path-to-regexp";
import * as db from "../services/Weak";

const namespace = "weak";
export default {
  namespace,
  state: {
    productList: []
  },
  reducers: {
    setProduct(state, { payload: productList }) {
      return {
        ...state,
        productList
      };
    }
  },
  effects: {
    *getProducts(payload, { put, select, call }) {
      let products = yield call(db.getProduct);
      yield put({
        type: "setProduct",
        payload: products.data
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
