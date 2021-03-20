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
import { ICartItem } from "./db";
import { formItemLayout, formTailLayout } from "./components/Addcart";
import "moment/locale/zh-cn";
const RangePicker = DatePicker.RangePicker;
moment.locale("zh-cn");

import { useSetState } from "react-use";

const FormItem = Form.Item;
const Option = Select.Option;
const R = require("ramda");

const MachineItem = ({ label, machines, value, onChange, cartsNum }) => (
  <Col span={8}>
    <FormItem {...formItemLayout} label={label} help={`共 ${cartsNum} 车`}>
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

interface IMachineProp {
  siyin: string[];
  mahou: string[];
  tubu: string[];
}
const getCartsByMachine = (carts: string[], machine: IMachineProp) => {
  const getCarts = (key: keyof IMachineProp) =>
    carts.filter(item => machine[key].includes(item[3])).map(item => item[1]);
  let siyin = getCarts("siyin");
  let mahou = getCarts("mahou");
  let tubu = getCarts("tubu");
  return { siyin, mahou, tubu };
};

const BaseSetting = props => {
  const [dates, setDates] = useState(dateRanges["昨天"]);
  const [carts, setCarts] = useState<string[]>([]);
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

  const [machineConfig, setMachineConfig] = useSetState<IMachineProp>({
    siyin: [],
    mahou: [],
    tubu: []
  });

  const [cartsConfig, setCartsConfig] = useSetState<IMachineProp>({
    siyin: [],
    mahou: [],
    tubu: []
  });

  const [userList, setUserList] = useState([]);
  const [userIgnore, setUserIgnore] = useState([]);
  const [operatorDetail, setOperatorDetail] = useState([]);

  const submit = () => {
    console.log(cartsConfig);
  };

  useEffect(() => {
    let cart = getCartsByMachine(carts, machineConfig);
    setCartsConfig(cart);
    console.log(cart);
  }, [machineConfig]);

  const getUserInfoByName = user =>
    props.operatorList.find(item => item.user_name == user);

  const removeUserIgnore = user => {
    const user_list = R.clone(userList),
      user_ignore = R.clone(userIgnore),
      operator_detail = R.clone(operatorDetail);

    let newIgnore = R.reject(R.equals(user))(user_ignore);

    let newUser = getUserInfoByName(user);
    newUser.work_long_time = 1;
    operator_detail.push(newUser);

    user_list.push(user);
    db.saveOperatorList(user_list);

    setUserList(user_list);
    setUserIgnore(newIgnore);
    setOperatorDetail(operator_detail);
  };

  // 计算参与判废人员，不参与判废人员
  const refreshUsers = (user_list = []) => {
    let operators = props.operatorList.map(({ user_name }) => user_name);
    let user_ignore = R.difference(operators, user_list);

    let operator_detail = R.clone(operatorDetail);
    let operatorDetailList = operator_detail.map(({ user_name }) => user_name);

    let removeUser = R.difference(operatorDetailList, user_list);
    let newUser = R.difference(user_list, operatorDetailList);

    operator_detail = R.reject(({ user_name }) =>
      removeUser.includes(user_name)
    )(operator_detail);

    let newUserDetail = newUser.map(getUserInfoByName);
    operator_detail = [...operator_detail, ...newUserDetail];

    setUserList(user_list);
    setUserIgnore(user_ignore);
    setOperatorDetail(operator_detail);
  };

  // 动态存储用户信息
  const operatorsChange = user_list => {
    db.saveOperatorList(user_list);
    refreshUsers(user_list);
  };

  const [operator, setOperator] = useSetState({
    visible: false,
    curUserIdx: 0,
    curUserInfo: {
      user_name: "",
      user_no: "",
      work_long_time: 1
    },
    curWorkLongTime: 1
  });

  const [totalnum, setTotalnum] = useState(20000);
  const [limit, setLimit] = useState(20000);
  const [precision, setPrecision] = useState(100);

  const editOperator = idx => {
    const { curUserIdx } = operator;
    let user = operatorDetail[curUserIdx];
    setOperator({
      visible: true,
      curUserIdx: idx,
      curUserInfo: R.clone(user)
    });
  };

  const getOperatorDetail = curWorkLongTime => {
    const { curUserIdx } = operator;
    let operator_detail = R.clone(operatorDetail);
    let user = R.nth(curUserIdx)(operatorDetail);

    user.work_long_time = curWorkLongTime;
    operator_detail[curUserIdx] = user;
    return operator_detail;
  };

  const onWorkLongTimeChange = curWorkLongTime => {
    let operator_detail = getOperatorDetail(curWorkLongTime);

    setOperator({
      curWorkLongTime
    });
    setOperatorDetail(operator_detail);
  };

  let curUser = operatorDetail.length
    ? operatorDetail[operator.curUserIdx]
    : operator.curUserInfo;

  // 编辑工作时长
  const handleOk = () => {
    setOperator({
      visible: false
    });
  };

  const handleCancel = () => {
    setOperator({
      visible: false
    });
  };

  return (
    <div className={styles.base}>
      <Modal
        title={`${curUser.user_name}(${curUser.user_no})工作时长调整`}
        visible={operator.visible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="submit" type="primary" onClick={handleOk}>
            确定
          </Button>
        ]}
      >
        <div>
          工作时长:
          <InputNumber
            defaultValue={1}
            value={curUser.work_long_time}
            min={0}
            max={1}
            step={0.0625}
            formatter={value => value * 8}
            onChange={onWorkLongTimeChange}
          />
          小时
        </div>
      </Modal>
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
              cartsNum={cartsConfig.siyin.length}
            />
            <MachineItem
              machines={machineList}
              label="码后核查"
              value={machineConfig.mahou}
              onChange={mahou => {
                setMachineConfig({ mahou });
              }}
              cartsNum={cartsConfig.mahou.length}
            />
            <MachineItem
              machines={machineList}
              label="涂后核查"
              value={machineConfig.tubu}
              onChange={tubu => {
                setMachineConfig({ tubu });
              }}
              cartsNum={cartsConfig.tubu.length}
            />

            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label="判废人员"
                extra={
                  <div>
                    <p>
                      今日共
                      <span className={styles["user-tips"]}>
                        {userList.length}
                      </span>
                      人判废
                    </p>
                    {userIgnore && (
                      <>
                        <p>以下人员不参与判废(点击姓名加入判废人员列表)：</p>
                        {userIgnore.map(user => (
                          <Button
                            type="danger"
                            key={user}
                            style={{ marginRight: 5 }}
                            onClick={() => removeUserIgnore(user)}
                          >
                            {user}
                          </Button>
                        ))}
                      </>
                    )}
                  </div>
                }
              >
                <Select
                  placeholder="请选择判废人员"
                  mode="multiple"
                  onChange={operatorsChange}
                  style={{ width: "100%" }}
                  value={userList}
                >
                  {props.operatorList.map(({ user_name, user_no }) => (
                    <Option value={user_name} key={user_no}>
                      {user_name}
                    </Option>
                  ))}
                </Select>
              </FormItem>
            </Col>

            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label="工作时长(小时)"
                extra="点击单独编辑请假人员信息"
              >
                {operatorDetail.map(({ user_name, work_long_time }, idx) => (
                  <Button
                    type={work_long_time < 1 ? "danger" : "default"}
                    key={user_name}
                    style={{ marginRight: 5 }}
                    onClick={() => editOperator(idx)}
                  >
                    {user_name}({work_long_time * 8})
                  </Button>
                ))}
              </FormItem>
            </Col>

            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label="有效缺陷数"
                extra="超过此数值时不判废"
              >
                <Input
                  placeholder="请输入有效缺陷条数"
                  value={limit}
                  onChange={e => {
                    setLimit(e.target.value);
                  }}
                />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label="平均每人判废数"
                extra="系统按此信息排产"
              >
                <Input
                  placeholder="请输入平均每人判废数"
                  value={totalnum}
                  onChange={e => {
                    setTotalnum(e.target.value);
                  }}
                />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label="排产精度"
                extra="排产任务间缺陷条数不超过此值"
              >
                <Input
                  placeholder="请输入排产精度"
                  value={precision}
                  onChange={e => {
                    setPrecision(e.target.value);
                  }}
                />
              </FormItem>
            </Col>

            <Col span={24}>
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

function mapStateToProps(state) {
  return {
    loading: state.loading.models.addcart,
    ...state.addcart,
    ...state.common
  };
}

export default connect(mapStateToProps)(BaseSetting);
