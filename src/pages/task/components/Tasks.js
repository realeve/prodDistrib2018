import React from "react";
import { connect } from "dva";
import { DatePicker } from "antd";
import moment from "moment";
import "moment/locale/zh-cn";
import styles from "./Tasks.less";
import dateRanges from "../../../utils/ranges";
import VTable from "../../../components/Table";

const RangePicker = DatePicker.RangePicker;
moment.locale("zh-cn");

function Tasks({
  dispatch,
  dataSource,
  loading,
  dateRange,
  dataSrcNewproc,
  dataComplete
}) {
  const onDateChange = async (dates, dateStrings) => {
    await dispatch({
      type: "taskGet/setDateRange",
      payload: dateStrings
    });
    dispatch({
      type: "taskGet/handleTaskData"
    });
  };

  return (
    <>
      <div className="header">
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
      <VTable dataSrc={dataSrcNewproc} cartLinkMode="img" />
      <VTable dataSrc={dataComplete} cartLinkMode="img" />
    </>
  );
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.taskGet,
    ...state.taskGet
  };
}

export default connect(mapStateToProps)(Tasks);
