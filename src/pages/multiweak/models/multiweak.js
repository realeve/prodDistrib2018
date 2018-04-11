const namespace = "multiweak";
export default {
  namespace,
  state: {
    fileList: []
  },
  reducers: {
    setFileList(state, { payload: fileList }) {
      return {
        ...state,
        fileList
      };
    }
  }
};
