import React from "react";
import { connect } from "dva";
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  notification,
  Icon,
  Row,
  Col,
  Radio
} from "antd";

import styles from "./Report.less";
import * as lib from "../../../utils/lib";

import * as db from "../services/MultipleLock";
import handler from "../services/procHandler";

import wms from "../../index/services/wms";
const FormItem = Form.Item;
const Option = Select.Option;

const reason_code = "q_batchLock";

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
};
const formTailLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18, offset: 6 }
};

class DynamicRule extends React.Component {
  state = {
    procList: [],
    cartList: [],
    operationType: 0,
    submitting: false
  };

  submit = () => {
    this.setState({ submitting: true });

    this.props.form.validateFields(err => {
      if (err) {
        this.setState({ submitting: false });
        return;
      }
      let data = this.props.form.getFieldsValue();
      data.rec_date = lib.now();
      handler.handleProcStream({
        carnos: this.state.cartList,
        proc_stream: data.proc_stream,
        check_type: "批量车号工艺调整",
        reason_code,
        task_id: 0,
        remark_info: data.reason,
        user_name: this.props.userSetting.name
      });

      notification.open({
        message: "系统提示",
        description: "工艺批量设置完毕",
        icon: <Icon type="info-circle-o" style={{ color: "#108ee9" }} />
      });

      this.reload();
    });
  };

  getLockCarts = () => {
    let { reason, abnormal_type } = this.props.form.getFieldsValue();
    let { cartList } = this.state;
    let rec_date = lib.now();
    let complete_status = 1,
      proc_stream = 7; // 只锁车，不转异常品

    return cartList.map(cart_number => ({
      prod_id: cart_number[2],
      cart_number,
      reason,
      abnormal_type,
      rec_date,
      complete_status,
      proc_stream,
      only_lock_cart: 1,
      user_name: this.props.userSetting.name
    }));
  };

  lockCarts = () => {
    this.setState({ submitting: true });
    this.props.form.validateFields(async err => {
      if (err) {
        this.setState({ submitting: false });
        return;
      }
      let insertData = this.getLockCarts();
      let { data } = await db.addLockCartlist(insertData);
      if (data.length === 0 || data[0].affected_rows === 0) {
        notification.open({
          message: "系统提示",
          description: "批量锁车失败",
          icon: <Icon type="info-circle-o" style={{ color: "#108ee9" }} />
        });
        this.setState({ submitting: false });
        return;
      }
      const carnos = this.state.cartList;

      // 记录日志信息，wms提交及返回的数据全部入库
      // 20180515调整日志添加接口
      let logInfo = await db.addPrintWmsLog([
        {
          remark: JSON.stringify({ carnos, proc_stream: 7 }),
          rec_time: lib.now()
        }
      ]);

      // 添加日志正常？
      if (logInfo.rows < 1 || logInfo.data[0].affected_rows < 1) {
        console.log(logInfo);
        this.setState({ submitting: false });
        return {
          status: false
        };
      }

      let log_id = logInfo.data[0].id;

      // http://cognosdb.cdyc.cbpm:8080/wms/if/lockQ
      // 人工批量锁车，不拉号
      let { result } = await wms.setBlackList({
        carnos,
        reason_code,
        log_id
      });

      if (result.unhandledList.length) {
        notification.open({
          message: "系统提示",
          description:
            `以下车号锁车失败(共${result.unhandledList.length}车):` +
            result.unhandledList.join(","),
          icon: <Icon type="info-circle-o" style={{ color: "#108ee9" }} />
        });
      }

      await db.setPrintWmsLog({
        return_info: JSON.stringify(result),
        _id: log_id
      });

      notification.open({
        message: "系统提示",
        description: "批量锁车成功",
        icon: <Icon type="info-circle-o" style={{ color: "#108ee9" }} />
      });

      this.reload();
    });
  };

  unlockCarts = () => {
    this.setState({ submitting: true });
    this.props.form.validateFields(async err => {
      if (err) {
        this.setState({ submitting: false });
        return;
      }

      let { data } = await db.setPrintAbnormalProd(this.state.cartList);
      if (data.length === 0 || data[0].affected_rows === 0) {
        notification.open({
          message: "系统提示",
          description: "批量锁车失败",
          icon: <Icon type="info-circle-o" style={{ color: "#108ee9" }} />
        });
        this.setState({ submitting: false });
        return;
      }

      let { result } = await wms.setWhiteList(this.state.cartList);
      if (result.unhandledList.length) {
        notification.open({
          message: "系统提示",
          description:
            `以下车号解锁失败(共${result.unhandledList.length}车):` +
            result.unhandledList.join(","),
          icon: <Icon type="info-circle-o" style={{ color: "#108ee9" }} />
        });
      }

      notification.open({
        message: "系统提示",
        description: "批量解锁成功",
        icon: <Icon type="info-circle-o" style={{ color: "#108ee9" }} />
      });

      this.reload();
    });
  };

  reload = () => {
    // 重置数据
    this.props.form.resetFields();

    // 重载报表数据
    this.props.dispatch({
      type: "multilock/handleReportData"
    });
    this.setState({ submitting: false });
  };

  convertCart = async e => {
    e.preventDefault();
    let val = e.target.value.toUpperCase().trim();
    e.target.value = val;
    if (val.length < 8) {
      return;
    }
    const splitStr = val.includes("\n") ? "\n" : val.includes(",") ? "," : " ";

    // 过滤有效车号列表
    const validCart = cart => /^\d{4}[A-Z]\d{3}$/.test(cart);
    const cartList = val.split(splitStr).filter(validCart);
    console.log(val);

    console.log(cartList);
    this.setState({ cartList });
  };

  handleOperationType = e => {
    const operationType = e.target.value;
    this.setState({ operationType });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { operationType } = this.state;

    let extraInfo = "";
    switch (operationType) {
      case 0:
        extraInfo = "锁定一批车号，不做工艺调整。";
        break;
      case 1:
        extraInfo = "解锁某批车号";
        break;
      default:
        extraInfo = "将一组车号批量设定为指定工艺。";
        break;
    }

    return (
      <Form>
        <Row>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label="操作类型"
              className={styles.radioButton}
              extra={extraInfo}
            >
              <Radio.Group
                value={operationType}
                onChange={this.handleOperationType}
              >
                <Radio.Button value={0}>批量锁车</Radio.Button>
                <Radio.Button value={1}>批量解锁</Radio.Button>
                <Radio.Button value={2}>批量调整工艺</Radio.Button>
              </Radio.Group>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="车号列表"
              extra={
                this.state.cartList.length > 0 && (
                  <label>
                    共输入{" "}
                    <span className={styles.bold}>
                      {this.state.cartList.length}
                    </span>{" "}
                    车有效车号.
                  </label>
                )
              }
            >
              {getFieldDecorator("cart_number", {
                rules: [
                  {
                    required: true,
                    message: "车号列表信息必须填写"
                  }
                ]
              })(
                <Input.TextArea
                  rows={6}
                  placeholder="请输入车号列表,用逗号( , )、空格(  ) 或者回车换行符号( ↵ )分开"
                  onChange={this.convertCart}
                />
              )}
            </FormItem>
            {this.state.cartList.length && (
              <FormItem {...formTailLayout}>
                {operationType === 0 && (
                  <Button
                    type="danger"
                    disabled={this.state.submitting}
                    onClick={this.lockCarts}
                  >
                    <Icon type={this.state.submitting ? "loading" : "lock"} />批量锁车
                  </Button>
                )}
                {operationType === 1 && (
                  <Button
                    type="danger"
                    disabled={this.state.submitting}
                    onClick={this.unlockCarts}
                  >
                    <Icon type={this.state.submitting ? "loading" : "unlock"} />
                    批量解锁
                  </Button>
                )}
                {operationType === 2 && (
                  <Button type="danger" onClick={this.submit}>
                    {this.state.submitting === true && <Icon type="loading" />}
                    设置工艺
                  </Button>
                )}
                <Button
                  style={{ marginLeft: 20 }}
                  onClick={e => this.props.form.resetFields()}
                >
                  重置
                </Button>
              </FormItem>
            )}
          </Col>
          {operationType !== 1 && (
            <Col span={12}>
              {operationType === 2 && (
                <FormItem
                  {...formItemLayout}
                  label="工艺流程"
                  extra={
                    <label>
                      推荐选择{" "}
                      <span className={styles.bold}>8位清分机全检</span>，当选择自动分配时，<span
                        className={styles.bold}
                      >
                        系统将自动根据拉号情况自动分配
                      </span>.
                    </label>
                  }
                >
                  {getFieldDecorator("proc_stream", {
                    rules: [{ required: true, message: "请选择产品工艺流程" }]
                  })(
                    <Select placeholder="请选择产品工艺流程">
                      {this.props.procList.map(({ value, name }) => (
                        <Option value={value} key={value}>
                          {name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              )}
              {operationType === 0 && (
                <FormItem {...formItemLayout} label="原因">
                  {getFieldDecorator("abnormal_type", {
                    rules: [{ required: true, message: "请选择原因" }]
                  })(
                    <Select placeholder="请选择原因">
                      {this.props.abnormalTypeList.map(({ proc_name }) => (
                        <Option value={proc_name} key={proc_name}>
                          {proc_name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              )}
              <FormItem {...formItemLayout} label="备注">
                {getFieldDecorator("reason", {
                  rules: [
                    {
                      required: true,
                      message: "其它备注说明"
                    }
                  ]
                })(<Input.TextArea rows={3} placeholder="请输入备注说明" />)}
              </FormItem>
            </Col>
          )}
        </Row>
      </Form>
    );
  }
}

const WrappedDynamicRule = Form.create()(DynamicRule);

function MultipleLock(props) {
  return (
    <div className={styles.container}>
      <Card
        title={
          <div className={styles.header}>
            <h2>批量车号锁车/解锁/工艺调整</h2>
          </div>
        }
        loading={props.loading}
        style={{ width: "100%" }}
      >
        <WrappedDynamicRule {...props} />
      </Card>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.multilock,
    ...state.multilock,
    ...state.common
  };
}

export default connect(mapStateToProps)(MultipleLock);
