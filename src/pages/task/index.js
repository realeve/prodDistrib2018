import React from "react";
import { connect } from "dva";
import { DatePicker, Button, Input, Card, Menu, Dropdown, Icon } from "antd";
import * as db from "./services/table";
import styles from "./index.less";

import dateRanges from "../../utils/ranges";
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");
const RangePicker = DatePicker.RangePicker;

const R = require("ramda");

function Tables({ dispatch, tid, dateRange, title, columns, data, loading }) {
  const onDateChange = async (dates, dateStrings) => {
    const [tstart, tend] = dateStrings;
    await dispatch(db.getQueryConfig({ tid, tstart, tend }));
    await dispatch({
      type: "taskGet/handleTaskData"
    });
    dispatch({
      type: "taskConf/setDateRange",
      payload: dateStrings
    });
  };

  const tableTitle = () => {
    if (title) {
      return (
        <div className={styles.tips}>
          <div className={styles.title}>{title}</div>
          <small>时间范围 : {dateRange.join("至")}</small>
        </div>
      );
    }
    return "";
  };

  return (
    <Card
      title={
        <div className={styles.header}>
          {tableTitle()}
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
        </div>
      }
      style={{ width: "100%" }}
      bodyStyle={{ padding: "0px 0px 12px 0px" }}
      className={styles.exCard}
    />
  );
}

function mapStateToProps(state) {
  return {
    ...state.taskConf,
    // loading: state.loading.models.table,
    title: state.table.dataSrc.title || "",
    columns: state.table.columns,
    data: state.table.dataClone
  };
}

export default connect(mapStateToProps)(Tables);
