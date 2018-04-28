// import * as dbTblHandler from "../../../services/table";
import * as db from "../services/Weak";

const namespace = "weak";
export default {
  namespace,
  state: {
    imgUrl: "",
    fileList: [
      // {
      //   uid: "MTUyNDkyODEzNF80ODUxNjhfMjAxN2Zpd0RMSDlscDlsR1Vjb1UzNkdUa2dFSw==",
      //   thumbUrl:
      //     "//localhost/upload//image/MTUyNDkyODEzNF80ODUxNjhfMjAxN2Zpd0RMSDlscDlsR1Vjb1UzNkdUa2dFSw==.webp"
      // }
    ],
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
      let inputDataList = yield call(db.getViewPrintMachinecheckWeak, params);
      yield put({
        type: "setInputedData",
        payload: {
          inputDataList
        }
      });
    }
  }
};
