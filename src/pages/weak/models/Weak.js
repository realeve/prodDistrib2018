import * as dbTblHandler from "../../../services/table";
import * as db from "../services/Weak";

const namespace = "weak";
export default {
  namespace,
  state: {
    imgUrl: "",
    fileList: [],
    inputDataList: []
  },
  reducers: {
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
    },
    setInputedData(state, { payload: inputDataList }) {
      return {
        ...state,
        inputDataList
      };
    }
  },
  effects: {
    *fetchInputedData({ payload: params }, { call, put }) {
      console.log(params);
      let inputDataList = yield call(db.getViewPrintMachinecheckWeak, params);
      inputDataList = yield call(dbTblHandler.handleSrcData, inputDataList);
      yield put({
        type: "setInputedData",
        payload: {
          inputDataList
        }
      });
    }
  }
};
