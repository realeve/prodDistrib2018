import React from "react";
import { connect } from "dva";
import { Button, Modal } from "antd";
import VTable from "../../../components/Table";
import * as db from "../services/report";

import userLib from "../../../utils/users";

let userSetting = userLib.getUserSetting();
let userName = userSetting.data.setting.name;
const confirm = Modal.confirm;

function Tasks({ dispatch, dataSrc, dateRange, loading }) {
  const callback = text => {
    const onOk = () => {
      console.log(text);
      // db.unlockCart(text).then(res => {
      //   // 刷新数据
      //   dispatch({
      //     type: "locklist/handleTaskData"
      //   });
      // });
    };

    confirm({
      title: "系统提示",
      content: `确定解锁本车?`,
      maskClosable: true,
      onOk
    });
  };

  // 在行末添加操作列
  const actions = [
    {
      title: "解锁", //标题
      render: record =>
        record.col8 === userName && (
          <Button type="primary" onClick={() => callback(record)}>
            {record.col0}
          </Button>
        )
    }
  ];

  return <VTable dataSrc={dataSrc} actions={actions} />;
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.locklist,
    ...state.locklist
  };
}

export default connect(mapStateToProps)(Tasks);
