import React from "react";
import { connect } from "dva";
import { DatePicker } from "antd";
import styles from "./index.less";

import VTable from "../../components/Table";
// import ImgList from "./imgList";

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
  seriousImg,
  seriousImgCount
}) {
  const onDateChange = async (dates, dateStrings) => {
    const [tstart, tend] = dateStrings;
    dispatch({
      type: "seriousimg/fetchAPIData",
      payload: { params: { tstart, tend } }
    });
    dispatch({
      type: "seriousimg/setStore",
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

      <VTable dataSrc={dataSrc} loading={loading} />
      <VTable dataSrc={seriousImgCount} loading={loading} />
      <VTable dataSrc={seriousImg} loading={loading} />
      {/* <ImgList dataSrc={seriousImg} /> */}
    </>
  );
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.seriousimg,
    ...state.seriousimg
  };
}

export default connect(mapStateToProps)(Tables);
