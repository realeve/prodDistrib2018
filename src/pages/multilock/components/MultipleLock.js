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
  Col
} from "antd";

import styles from "./Report.less";
import * as lib from "../../../utils/lib";

import * as db from "../services/MultipleLock";

const FormItem = Form.Item;
const Option = Select.Option;
const R = require("ramda");

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
    processInfo: [],
    procList: [],
    machineList: [],
    captainList: []
  };

  insertData = async data => {
    let res = await db.addPrintAbnormalProd(data);
    if (!res.rows) {
      notification.error({
        message: "系统错误",
        description: "数据插入失败，请联系管理员",
        icon: <Icon type="info-circle-o" style={{ color: "#108ee9" }} />
      });
      return;
    }
    notification.open({
      message: "系统提示",
      description: "数据插入成功",
      icon: <Icon type="info-circle-o" style={{ color: "#108ee9" }} />
    });

    this.props.form.resetFields();

    // 重载报表数据
    this.props.dispatch({
      type: "addcart/handleReportData"
    });
  };

  submit = () => {
    this.props.form.validateFields(err => {
      if (err) {
        return;
      }
      let data = this.props.form.getFieldsValue();
      data.rec_date = lib.ymd();
      data.captain_name =
        typeof data.captain_name === "string"
          ? data.captain_name
          : data.captain_name.join(",");

      this.insertData(data);
    });
  };

  convertCart = async e => {
    e.preventDefault();
    let val = e.target.value.toUpperCase().trim();
    e.target.value = val;
    if (val.length < 8) {
      return;
    }

    let { setFieldsValue } = this.props.form;
    setFieldsValue({
      prod_id: val[2]
    });

    if (val.length === 8) {
      const { data } = await db.getViewCartfinder({ cart: val });
      if (data.length === 0) {
        notification.error({
          message: "系统错误",
          description: "当前车号未搜到生产信息",
          icon: <Icon type="info-circle-o" style={{ color: "#108ee9" }} />
        });
        return;
      }

      this.setState({ processInfo: data });
      this.handleProcessInfo(data);
    }
  };

  handleProcessInfo = data => {
    let { setFieldsValue } = this.props.form;
    const procList = R.compose(R.uniq, R.map(R.prop("proc_name")))(data);
    this.setState({
      procList
    });
    console.log(data);
    const { proc_name } = data[0];

    setFieldsValue({
      proc_name: proc_name
    });
    this.handleProc(proc_name);
  };

  updateMachineList = data => {
    let { setFieldsValue } = this.props.form;
    const machineList = R.compose(R.uniq, R.map(R.prop("machine_name")))(data);
    const captainList = R.compose(R.uniq, R.map(R.prop("captain_name")))(data);
    this.setState({
      machineList,
      captainList
    });
    if (machineList.length) {
      setFieldsValue({
        machine_name: machineList[0]
      });
    }

    if (captainList.length) {
      setFieldsValue({
        captain_name: captainList[0]
      });
    }

    setFieldsValue({
      prod_date: data[0].start_time
    });
  };

  handleProc = proc_name => {
    const data = R.filter(R.propEq("proc_name", proc_name))(
      this.state.processInfo
    );
    this.updateMachineList(data);
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form>
        <Row>
          <Col span={12}>
            <FormItem {...formItemLayout} label="车号">
              {getFieldDecorator("cart_number", {
                rules: [
                  {
                    required: true,
                    message: "车号信息必须填写",
                    pattern: /^\d{4}[A-Z]\d{3}$/
                  }
                ]
              })(
                <Input
                  placeholder="请输入异常品车号"
                  onChange={this.convertCart}
                  maxLength="8"
                />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="问题分类">
              {getFieldDecorator("abnormal_type", {
                rules: [{ required: true, message: "请选择问题分类" }]
              })(
                <Select placeholder="请选择问题分类">
                  {this.props.abnormalTypeList.map(({ proc_name }) => (
                    <Option value={proc_name} key={proc_name}>
                      {proc_name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="原因说明">
              {getFieldDecorator("reason", {
                rules: [
                  {
                    required: true,
                    message: "请输入异常原因说明"
                  }
                ]
              })(<Input.TextArea rows={3} placeholder="请输入异常原因说明" />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="工艺流程"
              extra={
                <label>
                  推荐选择 <span className={styles.bold}>8位清分机全检</span>，当选择自动分配时，<span
                    className={styles.bold}
                  >
                    系统将自动根据拉号情况自动分配
                  </span>.
                </label>
              }
            >
              {getFieldDecorator("proc_stream", {
                rules: [{ required: false, message: "请选择产品工艺流程" }]
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

            <FormItem {...formTailLayout}>
              <Button type="primary" onClick={this.submit}>
                提交
              </Button>
              <Button
                style={{ marginLeft: 20 }}
                onClick={e => this.props.form.resetFields()}
              >
                重置
              </Button>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="品种">
              {getFieldDecorator("prod_id", {
                rules: [{ required: true, message: "请选择品种" }]
              })(
                <Select placeholder="请选择品种">
                  {this.props.productList.map(({ name, value }) => (
                    <Option value={value} key={value}>
                      {name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="工序">
              {getFieldDecorator("proc_name", {
                rules: [{ required: true, message: "请选择工序" }]
              })(
                <Select placeholder="请选择工序" onChange={this.handleProc}>
                  {this.state.procList.map(item => (
                    <Option value={item} key={item}>
                      {item}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="机台">
              {getFieldDecorator("machine_name", {
                rules: [{ required: true, message: "请选择机台" }]
              })(
                <Select placeholder="请选择机台">
                  {this.state.machineList.map(item => (
                    <Option value={item} key={item}>
                      {item}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="机长">
              {getFieldDecorator("captain_name", {
                rules: [{ required: true, message: "请选择机长" }]
              })(
                <Select mode="multiple" placeholder="请选择机长">
                  {this.state.captainList.map(item => (
                    <Option value={item} key={item}>
                      {item}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="生产日期">
              {getFieldDecorator("prod_date", {
                rules: [
                  {
                    required: true,
                    message: "请输入生产日期"
                  }
                ]
              })(<Input disabled />)}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}

const WrappedDynamicRule = Form.create()(DynamicRule);

function MultipleLock(props) {
  let { checkByWeek, abnormal } = props.lockInfo;
  return (
    <div className={styles.container}>
      <Card
        title={
          <div className={styles.header}>
            <h2>添加异常品车号</h2>
            <p className={styles.desc}>
              本周人工拉号已添加{parseInt(checkByWeek, 10) +
                parseInt(abnormal, 10)}车(日常抽检:{checkByWeek}，异常品及四新:{
                abnormal
              })
            </p>
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
