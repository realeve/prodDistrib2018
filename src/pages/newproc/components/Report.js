import React from "react";
import { connect } from "dva";
import { Table, Pagination, Card, DatePicker } from "antd";
import moment from "moment";
import "moment/locale/zh-cn";
import styles from "./Report.less";
import dateRanges from "../../../utils/ranges";
// import * as lib from "../../../utils/lib";
const RangePicker = DatePicker.RangePicker;
moment.locale("zh-cn");

function newproc({
  dispatch,
  dataSource,
  dataSrc,
  total,
  page,
  pageSize,
  loading,
  filteredInfo,
  columns,
  dateRange
}) {
  const onDateChange = async (dates, dateStrings) => {
    await dispatch({
      type: "newproc/setDateRange",
      payload: dateStrings
    });
    dispatch({
      type: "newproc/handleReportData"
    });
  };
  // 页码更新
  const pageChangeHandler = page => {
    dispatch({
      type: "newproc/changePage",
      payload: page
    });
  };

  // 分页数
  const onShowSizeChange = async (current, nextPageSize) => {
    let newPage = Math.floor(pageSize * current / nextPageSize);
    await dispatch({
      type: "newproc/changePageSize",
      payload: nextPageSize
    });
    reloadData(newPage);
  };

  const reloadData = (newPage = 1) => {
    dispatch({
      type: "newproc/changePage",
      payload: newPage
    });
  };

  return (
    <div className={styles.container}>
      <Card
        title={
          <div className={styles.header}>
            <div className={styles.title}>
              {dataSrc.title}({dateRange[0]} 至 {dateRange[1]})
            </div>
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
        }
        style={{ width: "100%", marginTop: "30px" }}
        bodyStyle={{ padding: "0px 0px 12px 0px" }}
      >
        <Table
          loading={loading}
          columns={columns}
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
    loading: state.loading.models.newproc,
    ...state.newproc
  };
}

export default connect(mapStateToProps)(newproc);
