import pathToRegexp from "path-to-regexp";
import * as db from "../services/Weak";

const namespace = "weak";
export default {
  namespace,
  state: {
    productList: [],
    imgUrl: "",
    fileList: []
  },
  reducers: {
    setProduct(state, { payload: productList }) {
      return {
        ...state,
        productList
      };
    },
    setImgUrl(state, { payload: imgUrl }) {
      return {
        ...state,
        imgUrl
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
