import React from "react";
import { connect } from "dva";
import { DatePicker } from "antd";
import * as db from "./services/weaklist";
import styles from "./index.less";

import VTable from "../../components/Table";

import dateRanges from "../../utils/ranges";
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");

const RangePicker = DatePicker.RangePicker;

function Tables({
  dispatch,
  dateRange,
  loading,
  dataSrc,
  dataCount,
  dataCount2,
  dataCount3,
  dataCount4
}) {
  const onDateChange = async (dates, dateStrings) => {
    const [tstart, tend] = dateStrings;
    await dispatch(db.getQueryConfig({ tstart, tend }));
    dispatch({
      type: "weaklistConf/setDateRange",
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

      <VTable dataSrc={dataSrc} loading={loading} />
      <VTable dataSrc={dataCount} loading={loading} />
      <VTable dataSrc={dataCount2} loading={loading} />
      <VTable dataSrc={dataCount3} loading={loading} />
      <VTable dataSrc={dataCount4} loading={loading} />
    </>
  );
}

function mapStateToProps(state) {
  return {
    ...state.weaklistConf,
    ...state.weaklist
  };
}

export default connect(mapStateToProps)(Tables);
