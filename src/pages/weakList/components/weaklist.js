import React from "react";
import { connect } from "dva";
import { Table, Pagination } from "antd";
import * as axios from "../../../utils/axios";
import styles from "./weaklist.less";
const R = require("ramda");

function Tables({
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
      type: "weaklist/changePage",
      payload: page
    });
  };

  // 分页数
  const onShowSizeChange = async (current, nextPageSize) => {
    let newPage = Math.floor(pageSize * current / nextPageSize);
    await dispatch({
      type: "weaklist/changePageSize",
      payload: nextPageSize
    });
    reloadData(newPage);
  };

  const reloadData = (newPage = 1) => {
    dispatch({
      type: "weaklist/changePage",
      payload: newPage
    });
  };

  const customFilter = async filters => {
    await dispatch({
      type: "weaklist/customFilter",
      payload: filters
    });
    reloadData(page);
  };

  const customSort = async sorter => {
    await dispatch({
      type: "weaklist/customSorter",
      payload: sorter
    });
    reloadData(page);
  };

  const handleChange = (pagination, filters, sorter) => {
    customFilter(filters);
    customSort(sorter);
  };

  const columnInfo = () => {
    return columns.map(item => {
      if (item.dataIndex === "col10") {
        item.render = text =>
          text.length < 10 ? null : (
            <img
              className={styles.fakeImg}
              src={`${axios.uploadHost}${text}`}
              alt={text}
            />
          );
      } else if (item.dataIndex === "col11") {
        item.render = text => (R.isNil(text) ? "" : text);
      }
      return item;
    });
  };

  return (
    <>
      <Table
        loading={loading}
        columns={columnInfo()}
        dataSource={dataSource}
        rowKey="key"
        pagination={false}
        size="medium"
        onChange={handleChange}
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
    </>
  );
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.weaklist,
    ...state.weaklist
  };
}

export default connect(mapStateToProps)(Tables);
