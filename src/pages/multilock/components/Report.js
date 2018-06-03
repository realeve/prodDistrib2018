import React from "react";
import { connect } from "dva";
import { DatePicker } from "antd";
import moment from "moment";
import "moment/locale/zh-cn";
import styles from "./Report.less";
import dateRanges from "../../../utils/ranges";
import VTable from "../../../components/Table";

const RangePicker = DatePicker.RangePicker;
moment.locale("zh-cn");

function MultiLock({ dispatch, dataSource, loading, dateRange }) {
  const onDateChange = async (dates, dateStrings) => {
    await dispatch({
      type: "multilock/setDateRange",
      payload: dateStrings
    });
    dispatch({
      type: "multilock/handleReportData"
    });
  };
  // console.log("载入状态:", loading);
  //  loading={loading}
  return (
    <>
      <div className={styles.header}>
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
      <VTable dataSrc={dataSource} />
    </>
  );
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.multilock,
    ...state.multilock
  };
}

export default connect(mapStateToProps)(MultiLock);
