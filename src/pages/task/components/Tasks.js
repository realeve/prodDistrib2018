import React from "react";
import { connect } from "dva";
import { Table, Pagination, Card, Button, Badge } from "antd";
import * as lib from "../../../utils/lib.js";
import * as db from "../services/table";
import { notification, Icon, Modal } from "antd";

import styles from "./Tasks.less";
const R = require("ramda");

const confirm = Modal.confirm;

function Tasks({
  dispatch,
  dataSource,
  dataSrc,
  total,
  page,
  pageSize,
  loading,
  filteredInfo,
  columns
}) {
  // 页码更新
  const pageChangeHandler = page => {
    dispatch({
      type: "tasks/changePage",
      payload: page
    });
  };

  // 分页数
  const onShowSizeChange = async (current, nextPageSize) => {
    let newPage = Math.floor(pageSize * current / nextPageSize);
    await dispatch({
      type: "tasks/changePageSize",
      payload: nextPageSize
    });
    reloadData(newPage);
  };

  const reloadData = (newPage = 1) => {
    dispatch({
      type: "tasks/changePage",
      payload: newPage
    });
  };

  const removeTask = keyId => {
    let data = R.reject(R.propEq("key", keyId))(dataSource);
    dispatch({
      type: "taskGet/refreshTable",
      payload: data
    });
  };

  const addTask = e => {
    const cartNumber = e.col0;
    console.log(cartNumber);
    console.log("添加该信息至数据库,成功后清除信息");
    removeTask(e.key);
  };

  const openNotification = description => {
    notification.open({
      message: "系统提示",
      description,
      icon: <Icon type="info-circle-o" style={{ color: "#108ee9" }} />
    });
  };
  const distColumn = () => {
    if (columns.length) {
      columns[7].render = (text, record) =>
        text === "0" ? (
          <Button type="primary" onClick={addTask.bind(null, record)}>
            添加任务
          </Button>
        ) : (
          ""
        );
    }
    return columns;
  };

  return (
    <div className={styles.container}>
      <Card
        loading={loading}
        style={{ width: "100%", marginTop: "30px" }}
        bodyStyle={{ padding: "0px 0px 12px 0px" }}
      >
        <Table
          loading={loading}
          columns={distColumn()}
          dataSource={dataSource}
          rowKey="key"
          pagination={false}
          size="medium"
          footer={() =>
            dataSrc.source ? `${dataSrc.source} (共耗时${dataSrc.timing})` : ""
          }
        />
        <Pagination
          className="ant-table-pagination"
          showTotal={(total, range) =>
            total ? `${range[0]}-${range[1]} 共 ${total} 条数据` : ""
          }
          showSizeChanger
          onShowSizeChange={onShowSizeChange}
          total={total}
          current={page}
          pageSize={pageSize}
          onChange={pageChangeHandler}
          pageSizeOptions={["5", "10", "15", "20", "30", "40", "50", "100"]}
        />
      </Card>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.taskGet,
    ...state.taskGet
  };
}

export default connect(mapStateToProps)(Tasks);
