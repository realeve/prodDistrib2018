import * as db from "../services/table";
const namespace = "table";
export default {
  namespace,
  state: {
    dataSrc: []
  },
  reducers: {
    save(state, {
      payload: {
        dataSrc
      }
    }) {
      return { ...state,
        dataSrc
      };
    }
  },
  effects: {
    * fetchAPIData({
      payload: {
        url,
        params
      }
    }, {
      call,
      put,
      select
    }) {
      let data = yield call(db.fetchData, {
        url,
        params
      });

      yield put({
        type: "save",
        payload: {
          dataSrc: data
        }
      });
    }
  }
};
