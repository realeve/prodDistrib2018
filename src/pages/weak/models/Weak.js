const namespace = "weak";
export default {
  namespace,
  state: {
    imgUrl: "",
    fileList: []
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
    }
  }
};
