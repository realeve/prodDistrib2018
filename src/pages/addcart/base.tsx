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
  Modal,
  message
} from "antd";

import styles from "./base.less";
import dateRanges from "@/utils/ranges";
import * as lib from "@/utils/lib";
import moment from "moment";
import * as db from "./db";
import { Dispatch } from "react-redux";
import "moment/locale/zh-cn";
const RangePicker = DatePicker.RangePicker;
moment.locale("zh-cn");

import { useSetState } from "react-use";
import { handleTasklist } from "./models/addcart";

const FormItem = Form.Item;
const Option = Select.Option;
const R = require("ramda");

export const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
};

export const formTailLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 6, offset: 18 }
};

const MachineItem = ({ label, machines, value, onChange, cartsNum }) => (
  <Col span={8}>
    <FormItem {...formItemLayout} label={label} help={`共 ${cartsNum} 车`}>
      <Select
        placeholder="请选择机台"
        mode="multiple"
        onChange={onChange}
        value={value}
        style={{ width: "100%", minHeight: 60 }}
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

interface IBaseProps {
  operatorList: {
    user_name: string;
    user_no: string;
    work_long_time: number;
  }[];
  hechaTask: { task_list: string | any[] };
  dispatch: Dispatch;
}

const BaseSetting = ({ operatorList, hechaTask, dispatch }: IBaseProps) => {
  const [dates, setDates] = useState(dateRanges["昨天"]);
  const [carts, setCarts] = useState<string[]>([]);
  const [machineList, setMachineList] = useState([]);
  const [loading, setLoading] = useState(false);
  const init = () => {
    let tstart = moment(dates[0]).format("YYYYMMDD");
    let tend = moment(dates[1]).format("YYYYMMDD");
    setCarts([]);
    setMachineList([]);
    setLoading(true);

    db.getCompleteCarts({ tstart, tend })
      .then(res => {
        setCarts(res);

        // 机台列表
        let machine = R.uniq(R.map(R.pick([0, 2, 3]), res));
        machine = machine.sort((a, b) => a[2].localeCompare(b[2]));
        setMachineList(machine);
      })
      .finally(() => {
        setLoading(false);
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

  const [users, setUsers] = useSetState({
    user_list: [],
    user_ignore: [],
    operator_detail: []
  });

  // 初始数据载入
  useEffect(() => {
    // 用户设置
    let res = db.loadOperatorList();
    setUsers(res);

    // 设备设置
    let machine = db.loadMachineList();
    setMachineConfig(machine);
  }, []);

  useEffect(() => {
    db.saveOperatorList(users);
  }, [users]);

  useEffect(() => {
    /**
     * 根据所选择的设备过滤出车号列表，传到后端后以此列表作为生产记录；
     */
    let cart = getCartsByMachine(carts, machineConfig);
    setCartsConfig(cart);
    db.saveMachineList(machineConfig);
  }, [machineConfig, carts]);

  const getUserInfoByName = user =>
    operatorList.find(item => item.user_name == user);

  const removeUserIgnore = user => {
    const { user_list, user_ignore, operator_detail } = R.clone(users);

    let newIgnore = R.reject(R.equals(user))(user_ignore);

    let newUser = getUserInfoByName(user);
    newUser.work_long_time = 1;
    operator_detail.push(newUser);

    user_list.push(user);
    setUsers({
      user_list,
      user_ignore: newIgnore,
      operator_detail
    });
  };

  // 计算参与判废人员，不参与判废人员
  const refreshUsers = (user_list = []) => {
    let operators = operatorList.map(({ user_name }) => user_name);
    let user_ignore = R.difference(operators, user_list);

    let { operator_detail } = R.clone(users);
    let operatorDetailList = operator_detail.map(({ user_name }) => user_name);

    let removeUser = R.difference(operatorDetailList, user_list);
    let newUser = R.difference(user_list, operatorDetailList);

    operator_detail = R.reject(({ user_name }) =>
      removeUser.includes(user_name)
    )(operator_detail);

    let newUserDetail = newUser.map(getUserInfoByName);
    operator_detail = [...operator_detail, ...newUserDetail];

    setUsers({
      user_list,
      user_ignore,
      operator_detail
    });
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

  useEffect(() => {
    let num = Number(window.localStorage.getItem("total_num") || "20000");
    setTotalnum(num);

    num = Number(window.localStorage.getItem("limit_num") || "20000");
    setLimit(num);

    num = Number(window.localStorage.getItem("precision_num") || "100");
    setPrecision(num);
  }, []);

  const editOperator = idx => {
    const { curUserIdx } = operator;
    let user = users.operator_detail[curUserIdx];
    setOperator({
      visible: true,
      curUserIdx: idx,
      curUserInfo: R.clone(user)
    });
  };

  const getOperatorDetail = curWorkLongTime => {
    const { curUserIdx } = operator;
    let operator_detail = R.clone(users.operator_detail);
    let user = R.nth(curUserIdx)(users.operator_detail);

    user.work_long_time = curWorkLongTime;
    operator_detail[curUserIdx] = user;
    return operator_detail;
  };

  const onWorkLongTimeChange = curWorkLongTime => {
    let operator_detail = getOperatorDetail(curWorkLongTime);

    setOperator({
      curWorkLongTime
    });
    setUsers({ operator_detail });
  };

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

  const publishTask = () => {
    // 处理抽检任务
    let task_info = JSON.stringify(hechaTask);

    Modal.confirm({
      title: "提示",
      content: `是否要发布本次排产任务？`,
      maskClosable: true,
      cancelText: "取消",
      okText: "确定",
      onOk: async () => {
        let params = {
          task_info,
          rec_time: lib.now()
        };
        let { data } = await db.addPrintHechatask(params);
        let success = data[0].affected_rows > 0;
        if (success) {
          dispatch({
            type: "addcart/setStore",
            payload: {
              rec_time: params.rec_time
            }
          });
        }

        notification.open({
          message: "系统提示",
          description: "任务发布" + (success ? "成功" : "失败"),
          icon: <Icon type="info-circle-o" style={{ color: "#108ee9" }} />
        });
      }
    });
  };

  const onDateChange = (dates, daterange) => {
    setDates(dates);
  };

  // 排产
  const dispatchTasks = async params => {
    // 重置
    dispatch({
      type: "addcart/setStore",
      payload: {
        hechaLoading: true,
        hechaTask: { task_list: [], unhandle_carts: [], unupload_carts: [] }
      }
    });

    let hechaTask = await db.getHechaTasks(params).catch(e => {
      return null;
    });
    if (!hechaTask) {
      message.error("排产失败，请稍后重试");
      return;
    }
    try {
      hechaTask = handleTasklist(hechaTask);
    } catch (e) {
      message.error("排产失败，请稍后重试");
      return;
    }

    dispatch({
      type: "addcart/setStore",
      payload: {
        hechaTask,
        hechaLoading: false
      }
    });

    notification.open({
      message: "系统提示",
      description: "排产完毕",
      icon: <Icon type="info-circle-o" style={{ color: "#108ee9" }} />
    });
  };

  const getParams = () => {
    let tstart = moment(dates[0]).format("YYYYMMDD");
    let tend = moment(dates[1]).format("YYYYMMDD");

    return {
      need_convert: 0,
      tstart,
      tend,
      user_list: users.operator_detail,
      limit,
      precision,
      totalnum
    };
  };

  const submit = () => {
    let param = getParams();
    dispatchTasks({
      ...param,
      carts: cartsConfig
    });
  };

  let curUser = users.operator_detail.length
    ? users.operator_detail[operator.curUserIdx]
    : operator.curUserInfo;

  return (
    <Card
      className={styles.base}
      title="图核排产设置"
      style={{ width: "100%" }}
    >
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
            formatter={(value: number) => String(value * 8)}
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
              onChange={onDateChange}
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

      <Skeleton loading={loading} active>
        {!!machineList.length && (
          <h2>
            <h2>2.任务配置</h2>
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
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label="判废人员"
                  extra={
                    <div>
                      <p>
                        今日共
                        <span className={styles["user-tips"]}>
                          {users.user_list.length}
                        </span>
                        人判废
                      </p>
                      {users.user_ignore && (
                        <>
                          <p>以下人员不参与判废(点击姓名加入判废人员列表)：</p>
                          {users.user_ignore.map(user => (
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
                    onChange={refreshUsers}
                    style={{ width: "100%" }}
                    value={users.user_list}
                  >
                    {operatorList.map(({ user_name, user_no }) => (
                      <Option value={user_name} key={user_no}>
                        {user_name}
                      </Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>

              <Col span={12}>
                <Row gutter={16}>
                  <Col span={24}>
                    <FormItem
                      {...formItemLayout}
                      label="工作时长(小时)"
                      extra="点击单独编辑请假人员信息"
                    >
                      {users.operator_detail.map(
                        ({ user_name, work_long_time }, idx) => (
                          <Button
                            type={work_long_time < 1 ? "danger" : "default"}
                            key={user_name}
                            style={{ marginRight: 5 }}
                            onClick={() => editOperator(idx)}
                          >
                            {user_name}({work_long_time * 8})
                          </Button>
                        )
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      {...{ labelCol: { span: 12 }, wrapperCol: { span: 12 } }}
                      label="有效缺陷数"
                      extra="超过此数值时不判废"
                    >
                      <Input
                        placeholder="请输入有效缺陷条数"
                        value={limit}
                        onChange={e => {
                          setLimit(+e.target.value);
                          window.localStorage.setItem(
                            "limit_num",
                            e.target.value
                          );
                        }}
                      />
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      {...{ labelCol: { span: 12 }, wrapperCol: { span: 12 } }}
                      label="平均每人判废数"
                      extra="系统按此信息排产"
                    >
                      <Input
                        placeholder="请输入平均每人判废数"
                        value={totalnum}
                        onChange={e => {
                          setTotalnum(+e.target.value);
                          window.localStorage.setItem(
                            "total_num",
                            e.target.value
                          );
                        }}
                      />
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      {...{ labelCol: { span: 12 }, wrapperCol: { span: 12 } }}
                      label="排产精度"
                      extra="排产任务间缺陷条数不超过此值"
                    >
                      <Input
                        placeholder="请输入排产精度"
                        value={precision}
                        onChange={e => {
                          setPrecision(+e.target.value);
                          window.localStorage.setItem(
                            "precision_num",
                            e.target.value
                          );
                        }}
                      />
                    </FormItem>
                  </Col>
                </Row>
              </Col>

              <Col span={24}>
                <FormItem
                  {...{
                    labelCol: { span: 4 },
                    wrapperCol: { span: 4, offset: 20 }
                  }}
                >
                  <Button type="primary" onClick={submit}>
                    排产计算
                  </Button>
                  <Button
                    type="danger"
                    disabled={hechaTask.task_list.length == 0}
                    style={{ marginLeft: 20 }}
                    onClick={publishTask}
                  >
                    发布排产任务
                  </Button>
                </FormItem>
              </Col>
            </Row>
          </h2>
        )}
      </Skeleton>
    </Card>
  );
};

export default connect(({ addcart }) => {
  return {
    operatorList: addcart.operatorList,
    hechaTask: addcart.hechaTask
  };
})(BaseSetting);
