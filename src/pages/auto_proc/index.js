import React from "react";
import { connect } from "dva";
import { DatePicker } from "antd";
import styles from "./index.less";
import VTable from "../../components/Table";
import dateRanges from "../../utils/ranges";
import moment from "moment";
import { namespace } from "./models/";

import "moment/locale/zh-cn";
moment.locale("zh-cn");

const RangePicker = DatePicker.RangePicker;

function Tables({ dispatch, dateRange, loading, dataSrc }) {
  const onDateChange = async (_, dateStrings) => {
    const [tstart, tend] = dateStrings;
    dispatch({
      type: `${namespace}/fetchAPIData`,
      payload: { params: { tstart, tend } }
    });
    dispatch({
      type: `${namespace}/setStore`,
      payload: { dateRange: dateStrings }
    });
  };

  return (
    <>
      <div className={styles.dateRange}>
        <RangePicker
          ranges={dateRanges}
          format="YYYYMMDD"
          onChange={onDateChange}
          defaultValue={[moment(dateRange[0]), moment(dateRange[1])]}
          locale={{
            rangePlaceholder: ["开始日期", "结束日期"]
          }}
        />
      </div>

      <VTable
        dataSrc={dataSrc}
        loading={loading}
        cartLinkPrefix="//10.8.2.133:8000/search/image/#"
      />
    </>
  );
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models[namespace],
    ...state[namespace]
  };
}

export default connect(mapStateToProps)(Tables);
