import React, { useState, useEffect } from "react";
import { Row, Col, Card, Empty, Skeleton, DatePicker } from "antd";
import styles from "./Report.less";
import { connect } from "dva";

import moment from "moment";
import "moment/locale/zh-cn";
import dateRanges from "@/utils/ranges";

import VTable from "@/components/Table";

const R = require("ramda");

const RangePicker = DatePicker.RangePicker;
moment.locale("zh-cn");

function UnhandleInfo({
  unhandle_carts,
  unupload_carts,
  loading,
  rec_time,
  pfNums,
  dateRange,
  pfList,
  dispatch,
  uncomplete,
  task_list
}) {
  let [state, setState] = useState({
    rows: 0,
    title: "已领取车号列表",
    data: [],
    header: ["车号", "判废状态", "判废量", "开始时间", "品种", "工序"]
  });
  useEffect(() => {
    let nextState = {
      rows: uncomplete.length,
      title: "已领取车号列表",
      data: uncomplete.map(item => [
        item.cart_number,
        item.item_flag == 2
          ? "判废中"
          : item.item_flag == 3
          ? "已完成"
          : "未判废",
        item.pf_num,
        item.start_date,
        item.product_name,
        ["码后", "丝印", "涂后"][item.type]
      ]),
      header: ["车号", "判废状态", "判废量", "开始时间", "品种", "工序"]
    };
    setState(nextState);
  }, [uncomplete]);
  const unhandle = loading ? (
    <Skeleton />
  ) : unhandle_carts.length == 0 ? (
    <Empty />
  ) : (
    unhandle_carts.map((item, i) => (
      <li key={item.cart_number}>
        <span>{i + 1}</span>
        <span>{item.cart_number}</span>
        <span>{item.pf_num}</span>
        <span>{item.prod_name}</span>
        <span>{item.machine_name}</span>
        <span>{item.proc_name}</span>
      </li>
    ))
  );

  const unupload = loading ? (
    <Skeleton />
  ) : unupload_carts.length == 0 ? (
    <Empty />
  ) : (
    unupload_carts.map((item, i) => (
      <li key={item.cart_number}>
        <span>{i + 1}</span>
        <span>{item.cart_number}</span>
        <span>{item.prod_name}</span>
        <span>{item.机台}</span>
        <span>{moment(item.完成时间).format("MM-DD HH:mm")}</span>
        <span>{item.零头产品 == 0 ? "否" : "是"}</span>
      </li>
    ))
  );

  const pfnumList = loading ? (
    <Skeleton />
  ) : pfNums.length == 0 ? (
    <Empty />
  ) : (
    pfNums.map((item, i) => (
      <li key={item.operator_name}>
        <span>{i + 1}</span>
        <span>{item.operator_name}</span>
        <span>{item.cart_nums}</span>
        <span>{item.pf_num == 0 ? "" : item.pf_num}</span>
        <span>{item.check_num == 0 ? "" : item.check_num}</span>
        <span>{item.code_num == 0 ? "" : item.code_num}</span>
        <span>{item.total_num}</span>
      </li>
    ))
  );

  const onDateChange = async (_, dateRange) => {
    await dispatch({
      type: "addcart/setStore",
      payload: {
        dateRange
      }
    });
    dispatch({
      type: "addcart/loadPfNums"
    });

    dispatch({
      type: "addcart/getRemarkData"
    });
  };

  const [taskData, setTaskData] = useState({
    title: "当前任务所有车号详情",
    data: [],
    rows: 0,
    header: ["车号", "品种", "工序", "判废量", "生产时间"]
  });

  useEffect(() => {
    let data = task_list.map(item => item.data);
    data = R.flatten(data);
    let nextData = data.map(item => [
      item.cart_number,
      item.product_name,
      ["码后", "丝印", "涂布"][item.type],
      item.pf_num,
      item.start_date
    ]);
    setTaskData({
      ...taskData,
      data: nextData,
      rows: nextData.length
    });
  }, [task_list]);

  return (
    <div>
      <Row gutter={10}>
        <Col span={24} md={24} sm={24}>
          <p className={styles.recTime}>
            最近排产任务：<span>{rec_time}</span>
          </p>
          <Col span={12} md={12} sm={24} style={{ marginTop: 10 }}>
            <Card hoverable>
              <div>
                <div className={styles.cartListTitle}>
                  <span className={styles.title}>不参与排活车号列表</span>
                </div>
                <ul className={styles.cartList}>
                  <li>
                    <span>序号</span>
                    <span>车号</span>
                    <span>判废数</span>
                    <span>品种</span>
                    <span>机台</span>
                    <span>工艺</span>
                  </li>
                  {unhandle}
                </ul>
              </div>
            </Card>
            <Card hoverable style={{ marginTop: 20 }}>
              <div>
                <div className={styles.cartListTitle}>
                  <span className={styles.title}>未上传车号列表</span>
                </div>
                <ul className={styles.cartList}>
                  <li>
                    <span>序号</span>
                    <span>车号</span>
                    <span>品种</span>
                    <span>机台</span>
                    <span>完工时间</span>
                    <span>零头产品</span>
                  </li>
                  {unupload}
                </ul>
              </div>
            </Card>
          </Col>
          <Col span={12} md={12} sm={24} style={{ marginTop: 10 }}>
            <Card hoverable>
              <div>
                <div className={styles.cartListTitle}>
                  <span className={styles.title}>已领取车号</span>
                </div>
                <VTable pageSize={5} dataSrc={state} loading={loading} />
              </div>
            </Card>
          </Col>
        </Col>
        <Col span={24} md={24} sm={24} style={{ marginTop: 10 }}>
          <Card hoverable>
            <VTable pageSize={5} dataSrc={taskData} loading={loading} />
          </Card>
        </Col>
        <Col span={12} md={12} sm={24} style={{ marginTop: 10 }}>
          <Card hoverable>
            <div>
              <div className={styles["pf-board"]}>
                <span className={styles.title}>图核月度判废</span>
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
              <ul className={styles.cartList}>
                <li>
                  <span>序号</span>
                  <span>姓名</span>
                  <span>大万数</span>
                  <span>票面判废</span>
                  <span>票面审核</span>
                  <span>号码审核</span>
                  <span>总产量</span>
                </li>
                {pfnumList}
              </ul>
            </div>
          </Card>
        </Col>
        <Col span={12} md={12} sm={24} style={{ marginTop: 10 }}>
          <VTable dataSrc={pfList} loading={loading} />
        </Col>
      </Row>
    </div>
  );
}

const mapStateToProps = state => ({
  ...R.pick(
    ["unhandle_carts", "unupload_carts", "uncomplete"],
    state.addcart.hechaTask
  ),
  rec_time: state.addcart.rec_time,
  pfNums: state.addcart.pfNums,
  loading: state.addcart.hechaLoading,
  dateRange: state.addcart.dateRange,
  pfList: state.addcart.pfList,
  task_list: state.addcart.hechaTask.task_list
});

export default connect(mapStateToProps)(UnhandleInfo);
