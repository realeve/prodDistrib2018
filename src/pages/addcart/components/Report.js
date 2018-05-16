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

function Addcart({ dispatch, dataSource, loading, dateRange, abnormalWMS }) {
  const onDateChange = async (dates, dateStrings) => {
    await dispatch({
      type: "addcart/setDateRange",
      payload: dateStrings
    });
    dispatch({
      type: "addcart/handleReportData"
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
      <VTable dataSrc={abnormalWMS} />
    </>
  );
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.addcart,
    ...state.addcart
  };
}

export default connect(mapStateToProps)(Addcart);
