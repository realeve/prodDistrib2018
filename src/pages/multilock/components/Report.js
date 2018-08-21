import React from "react";
import { connect } from "dva";
import { DatePicker } from "antd";
import moment from "moment";
import "moment/locale/zh-cn";
import styles from "./Report.less";
import dateRanges from "../../../utils/ranges";
import VTable from "../../../components/Table";
import userLib from "../../../utils/users";
let { data } = userLib.getUserSetting();
let user_name = data.setting.name;
const R = require("ramda");

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

  let myList = R.clone(dataSource);
  let theOthersList = R.clone(dataSource);
  if (myList.data) {
    myList.data = myList.data.filter(item => item.col10 === user_name);
    myList.title = "我的锁车列表";
    myList.rows = myList.data.length;

    theOthersList.data = theOthersList.data.filter(
      item => item.col10 !== user_name
    );
    // theOthersList.title = "我的锁车列表";
    theOthersList.rows = theOthersList.data.length;
  }

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
      {myList.data &&
        myList.data.length > 0 && <VTable dataSrc={myList} loading={loading} />}
      {theOthersList.data &&
        theOthersList.data.length > 0 && (
          <VTable dataSrc={theOthersList} loading={loading} />
        )}
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
