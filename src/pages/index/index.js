import React from "react";
import { connect } from "dva";

import VTable from "../../components/Table";

import { DatePicker } from "antd";
import * as db from "./services/table";
import styles from "./index.less";

import dateRanges from "../../utils/ranges";
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");

const RangePicker = DatePicker.RangePicker;

function Tables({ dispatch, tid, dateRange, dataSrc, loading }) {
  const onDateChange = async (dates, dateStrings) => {
    const [tstart, tend] = dateStrings;
    await dispatch(db.getQueryConfig({ tid, tstart, tend }));
    await dispatch({
      type: "tasks/fetchSampledData",
      payload: { tstart, tend }
    });
    await dispatch({
      type: "tasks/handleTaskData"
    });
    dispatch({
      type: "tableConf/setDateRange",
      payload: dateStrings
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
      <VTable dataSrc={dataSrc} loading={loading} cartLinkMode="img" />
    </>
  );
}

function mapStateToProps(state) {
  return {
    ...state.tableConf,
    dataSrc: state.table.dataSrc
  };
}

export default connect(mapStateToProps)(Tables);
