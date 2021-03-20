import React, { useState, useEffect } from "react";
import { connect } from "dva";
import {
  Card,
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  notification,
  Icon,
  Row,
  Col,
  DatePicker,
  Skeleton,
  Modal
} from "antd";

import styles from "./base.less";
import dateRanges from "@/utils/ranges";
import * as lib from "@/utils/lib";
import moment from "moment";
import * as db from "./db";
import { formItemLayout, formTailLayout } from "./components/Addcart";
import "moment/locale/zh-cn";
const RangePicker = DatePicker.RangePicker;
moment.locale("zh-cn");

import { useSetState } from "react-use";

const FormItem = Form.Item;
const Option = Select.Option;
const R = require("ramda");

const MachineItem = ({ label, machines, value, onChange }) => (
  <Col span={8}>
    <FormItem {...formItemLayout} label={label}>
      <Select
        placeholder="请选择机台"
        mode="multiple"
        onChange={onChange}
        value={value}
        style={{ width: 300 }}
      >
        {machines.map(item => (
          <Option value={item[3]} key={item[3]}>
            {item[2]} {item[3]} ({item[0]})
          </Option>
        ))}
      </Select>
    </FormItem>
  </Col>
);

export default () => {
  const [dates, setDates] = useState(dateRanges["昨天"]);
  const [carts, setCarts] = useState([]);
  const [machineList, setMachineList] = useState([]);
  const init = () => {
    let tstart = moment(dates[0]).format("YYYYMMDD");
    let tend = moment(dates[1]).format("YYYYMMDD");
    setCarts([]);
    setMachineList([]);

    db.getCompleteCarts({ tstart, tend }).then(res => {
      setCarts(res);

      // 机台列表
      let machine = R.uniq(R.map(R.pick([0, 2, 3]), res));
      machine = machine.sort((a, b) => a[2].localeCompare(b[2]));
      setMachineList(machine);
    });
  };

  const [machineConfig, setMachineConfig] = useSetState({
    siyin: [],
    mahou: [],
    tubu: []
  });

  const submit = () => {
    console.log(machineConfig);
  };

  return (
    <div className={styles.base}>
      <h2>1.任务起始时间</h2>
      <Row gutter={16}>
        <Col span={12}>
          <FormItem {...formItemLayout} label="生产日期">
            <RangePicker
              value={dates}
              ranges={dateRanges}
              format="YYYYMMDD"
              onChange={setDates}
              locale={{
                rangePlaceholder: ["开始日期", "结束日期"]
              }}
            />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formTailLayout}>
            <Button type="primary" onClick={init}>
              查询生产信息
            </Button>
          </FormItem>
        </Col>
      </Row>
      {!!machineList.length && (
        <>
          <h2 style={{ marginTop: 20 }}>2.任务配置</h2>
          <Row gutter={16}>
            <MachineItem
              machines={machineList}
              label="丝印"
              value={machineConfig.siyin}
              onChange={siyin => {
                setMachineConfig({ siyin });
              }}
            />
            <MachineItem
              machines={machineList}
              label="码后核查"
              value={machineConfig.mahou}
              onChange={mahou => {
                setMachineConfig({ mahou });
              }}
            />
            <MachineItem
              machines={machineList}
              label="涂后核查"
              value={machineConfig.tubu}
              onChange={tubu => {
                setMachineConfig({ tubu });
              }}
            />
            <Col span={12}>
              <FormItem {...formTailLayout}>
                <Button type="primary" onClick={submit}>
                  排产
                </Button>
              </FormItem>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};
