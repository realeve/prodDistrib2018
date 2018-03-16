import React from "react";
import { connect } from "dva";
import { Table, Pagination, Card, Button } from "antd";
import { TweenOneGroup } from "rc-tween-one";
import styles from "./Tasks.less";
const R = require("ramda");
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
  sampling
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

  const Title = () => {
    const { classDis, taskInfo, weekDay } = sampling;
    if (typeof classDis === "undefined") {
      return null;
    }

    // 白中班情况
    const classDesc = classDis.map((item, i) => (
      <span key={item.name}>
        {item.name} {item.value} 次{i ? "" : ","}
      </span>
    ));

    // 周一至周五各工作日抽检数描述
    const weekDesc = ["周一", "周二", "周三", "周四", "周五"];
    const weekInfo = weekDay.map((item, i) => (
      <span key={item.name}>
        {weekDesc[parseInt(item.name, 10) - 1]}
        {item.value} 次{i === weekDay.length - 1 ? "" : ", "}
      </span>
    ));

    return (
      <div className={styles.sampling}>
        <h2>自动分配抽样结果</h2>
        <div className={styles.desc}>
          <h5>
            码后核查共生产<strong>{taskInfo.total}</strong>车产品，按<strong>
              {taskInfo.percent}
            </strong>%抽样将抽取<strong>{taskInfo.checks}</strong>车产品
          </h5>
          <h5>
            实际抽取<strong>{dataSource.length}</strong>车，共涉及<strong>
              {taskInfo.machines}
            </strong>台胶、凹、码设备。其中{classDesc}
          </h5>
          <h5>各工作日抽检次数如下：{weekInfo}</h5>
        </div>
      </div>
    );
  };

  const enterAnim = [
    {
      opacity: 0,
      x: 30,
      backgroundColor: "#fffeee",
      duration: 0
    },
    {
      height: 0,
      duration: 200,
      type: "from",
      delay: 250,
      ease: "easeOutQuad",
      onComplete: onEnd
    },
    {
      opacity: 1,
      x: 0,
      duration: 250,
      ease: "easeOutQuad"
    },
    { delay: 1000, backgroundColor: "#fff" }
  ];

  const onEnd = e => {
    const dom = e.target;
    dom.style.height = "auto";
  };

  const leaveAnim = [
    { duration: 250, opacity: 0 },
    { height: 0, duration: 200, ease: "easeOutQuad" }
  ];

  const getBodyWrapper = body => {
    return (
      <TweenOneGroup
        component="tbody"
        className={body.props.className}
        enter={enterAnim}
        leave={leaveAnim}
        appear={false}
      >
        {body.props.children}
      </TweenOneGroup>
    );
  };

  const removeTask = keyId => {
    let data = R.reject(R.propEq("key", keyId))(dataSource);
    dispatch({
      type: "tasks/refreshTable",
      payload: data
    });
  };

  const addTask = e => {
    console.log(e);
    const cartNumber = e.col0;
    let insertingData = R.compose(
      R.map(item => [
        ...R.slice(0, 7, item),
        item[7] + " " + item[8],
        item[9],
        item[11]
      ]),
      R.map(R.compose(R.slice(1, Infinity), R.values)),
      R.filter(R.propEq("col0", cartNumber))
    )(dataSrc.data);
    console.log(insertingData);
    console.log("添加该信息至数据库,成功后清除信息");
    removeTask(e.key);
  };

  const distColumn = () => {
    let data = columns.slice(0, 10);
    if (columns.length) {
      data.push({
        title: "添加任务",
        dataIndex: "column10",
        render: (text, record) => {
          return (
            <Button
              type={record.col3 === "印码" ? "primary" : "default"}
              onClick={addTask.bind(null, record)}
            >
              添加任务
            </Button>
          );
        }
      });
    }
    return data;
  };

  return (
    <div className={styles.container}>
      <Card
        loading={loading}
        title={<Title />}
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
          className={styles["table-enter-leave-demo-table"]}
          getBodyWrapper={getBodyWrapper}
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
    loading: state.loading.models.tasks,
    ...state.tasks
  };
}

export default connect(mapStateToProps)(Tasks);
