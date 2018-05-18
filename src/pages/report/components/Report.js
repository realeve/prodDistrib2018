import React from "react";
import {
  connect
} from "dva";
import {
  Table,
  Pagination,
  Card,
  DatePicker,
  Badge
} from "antd";
import moment from "moment";
import "moment/locale/zh-cn";
import styles from "./Report.less";
import dateRanges from "../../../utils/ranges";
import * as lib from "../../../utils/lib";
const RangePicker = DatePicker.RangePicker;
moment.locale("zh-cn");

function Tasks({
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
      type: "report/setDateRange",
      payload: dateStrings
    });
    dispatch({
      type: "report/handleReportData"
    });
  };
  // 页码更新
  const pageChangeHandler = page => {
    dispatch({
      type: "report/changePage",
      payload: page
    });
  };

  // 分页数
  const onShowSizeChange = async (current, nextPageSize) => {
    let newPage = Math.floor(pageSize * current / nextPageSize);
    await dispatch({
      type: "report/changePageSize",
      payload: nextPageSize
    });
    reloadData(newPage);
  };

  const reloadData = (newPage = 1) => {
    dispatch({
      type: "report/changePage",
      payload: newPage
    });
  };

  const distColumn = () => {
    if (columns.length) {
      columns[2].render = text => `第${text}周`;
      columns[3].render = text => ( <
        Badge showZero count = {
          parseInt(text, 10)
        }
        style = {
          {
            backgroundColor: text === "0" ? "#f5222d" : "#52c41a"
          }
        }
        />
      );
    }
    return columns;
  };

  return ( <
    div className = {
      styles.container
    } >
    <
    Card title = { <
      div className = {
        styles.header
      } >
      <
      div className = {
        styles.title
      } > {
        dataSrc.title
      }(第 {
          lib.weeks()
        }
        周) <
      /div> <
      div className = {
        styles.dateRange
      } >
      <
      RangePicker
      ranges = {
        dateRanges
      }
      format = "YYYYMMDD"
      onChange = {
        onDateChange
      }
      defaultValue = {
        [moment(dateRange[0]), moment(dateRange[1])]
      }
      locale = {
        {
          rangePlaceholder: ["开始日期", "结束日期"]
        }
      }
      /> <
      /div> <
      /div>
    }
    style = {
      {
        width: "100%",
        marginTop: "30px"
      }
    }
    bodyStyle = {
      {
        padding: "0px 0px 12px 0px"
      }
    } >
    <
    Table loading = {
      loading
    }
    columns = {
      distColumn()
    }
    dataSource = {
      dataSource
    }
    rowKey = "key"
    pagination = {
      false
    }
    size = "medium"
    footer = {
      () =>
      dataSrc.source ? `${dataSrc.source} (共耗时${dataSrc.timing})` : ""
    }
    /> <
    Pagination className = "ant-table-pagination"
    showTotal = {
      (total, range) =>
      total ? `${range[0]}-${range[1]} 共 ${total} 条数据` : ""
    }
    showSizeChanger onShowSizeChange = {
      onShowSizeChange
    }
    total = {
      total
    }
    current = {
      page
    }
    pageSize = {
      pageSize
    }
    onChange = {
      pageChangeHandler
    }
    pageSizeOptions = {
      ["5", "10", "15", "20", "30", "40", "50", "100"]
    }
    /> <
    /Card> <
    /div>
  );
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.report,
    ...state.report
  };
}

export default connect(mapStateToProps)(Tasks);
