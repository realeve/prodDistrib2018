import React from "react";
import { connect } from "dva";
import { DatePicker, Button, Modal } from "antd";
import moment from "moment";
import "moment/locale/zh-cn";
import styles from "./Tasks.less";
import dateRanges from "../../../utils/ranges";
import VTable from "../../../components/Table";
import * as db from "../services/tasks";
const confirm = Modal.confirm;

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

  const callback = text => {
    const onOk = () => {
      db.unlockCart(text).then(res => {
        // 刷新数据
        dispatch({
          type: "taskGet/handleTaskData"
        });
      });
    };

    confirm({
      title: "系统提示",
      content: `本功能仅用于系统未正常执行自动领取状态，是否继续？`,
      maskClosable: true,
      onOk
    });
  };

  // 在行末添加操作列
  const actions = [
    {
      title: "手动领用", //标题
      render: record => (
        <Button onClick={() => callback(record.col0)}>{record.col0}</Button>
      )
    }
  ];

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
      <VTable dataSrc={dataSource} actions={actions} />
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
