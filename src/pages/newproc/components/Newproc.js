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
  message,
  Row,
  Col,
  DatePicker,
  Radio
} from "antd";

import moment from "moment";
import "moment/locale/zh-cn";
import * as db from "../services/Newproc";

import styles from "./Report.less";
import * as lib from "../../../utils/lib";

const { RangePicker } = DatePicker;
moment.locale("zh-cn");

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
    date_type: 0,
    procTipInfo: ""
  };

  insertData = async () => {
    let data = this.getInsertedData();

    let insertRes;
    if (data.date_type === 0) {
      insertRes = await db.addPrintNewprocPlan1(data);
    } else if (data.date_type === 1) {
      insertRes = await db.addPrintNewprocPlan2(data);
    }

    console.log(insertRes);

    if (R.isNil(insertRes) || !insertRes.rows) {
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
      type: "newproc/handleReportData"
    });
  };

  getInsertedData = () => {
    let data = this.props.form.getFieldsValue();
    const { date_type } = this.state;
    data.date_type = date_type;

    if (data.date_type < 2) {
      data.date_type = this.state.date_type;
      if (data.date_type === 0) {
        data.rec_date1 = moment(data.rec_date).format("YYYY-MM-DD");
      } else {
        data.rec_date1 = moment(data.rec_date[0]).format("YYYY-MM-DD");
        data.rec_date2 = moment(data.rec_date[1]).format("YYYY-MM-DD");
      }
      data.rec_time = lib.now();
      Reflect.deleteProperty(data, "rec_date");
      Reflect.deleteProperty(data, "alphaNum");
    }

    return data;
  };

  submit = () => {
    this.props.form.validateFields(err => {
      if (err) {
        return;
      }
      this.insertData();
    });
  };

  componentDidMount() {
    const { setFieldsValue } = this.props.form;
    const rec_date = moment();
    setFieldsValue({
      rec_date
    });
  }

  machineChange = v => {
    console.log(v);
    message.success("机台改变时读取近期印刷的品种");

    let { setFieldsValue } = this.props.form;

    setFieldsValue({
      prod_id: "4"
    });
  };

  handleDateType = e => {
    const date_type = e.target.value;
    this.setState({ date_type });
    let { setFieldsValue } = this.props.form;

    if (date_type !== 2) {
      let today = moment();
      let nextHalfMonth = moment().add(15, "days");
      setFieldsValue({
        rec_date: date_type === 0 ? today : [today, nextHalfMonth]
      });
    }
  };

  handleProcName = v => {
    if (this.state.date_type === 2) {
      return;
    }
    let { setFieldsValue } = this.props.form;
    let procTipInfo = "";
    switch (v) {
      case "新设备":
        procTipInfo = "根据工艺规定" + v;
        setFieldsValue({
          num1: 24,
          proc_stream1: "0",
          num2: 0,
          proc_stream2: "2"
        });
        break;
      default:
        break;
    }
    this.setState({ procTipInfo });
  };

  ProcList = (
    <Select placeholder="请选择产品工艺流程">
      <Option value="0">8位清分机全检</Option>
      <Option value="1">人工拉号</Option>
      <Option value="2">系统自动分配</Option>
    </Select>
  );

  Procprocess = () => {
    const { date_type } = this.state;
    const { getFieldDecorator } = this.props.form;

    if (date_type === 1) {
      return (
        <FormItem
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 8 }}
          label="工艺流程"
          extra={
            <label>
              推荐选择 <span className={styles.bold}>8位清分机全检</span>，当不能确定最终流程时选择<span
                className={styles.bold}
              >
                系统自动分配.
              </span>
            </label>
          }
        >
          {this.props.form.getFieldDecorator("proc_stream1", {
            rules: [{ required: true, message: "请选择产品工艺流程" }]
          })(this.ProcList)}
        </FormItem>
      );
    }

    if (date_type === 0) {
      const formStyle1 = {
        className: styles.item,
        labelCol: { span: 4 },
        wrapperCol: { span: 12 },
        label: "万产品"
      };
      const formStyle2 = {
        className: styles.item,
        labelCol: { span: 12 },
        wrapperCol: { span: 11 }
      };

      return (
        <>
          <div className={styles.inlineForm}>
            <FormItem {...formStyle2} label="前">
              {getFieldDecorator("num1", {
                rules: [{ required: date_type < 2, message: "请输入产品数量" }]
              })(<Input />)}
            </FormItem>
            <FormItem {...formStyle1} extra="推荐选择8位清分机全检">
              {getFieldDecorator("proc_stream1", {
                rules: [
                  { required: date_type < 2, message: "请选择产品工艺流程" }
                ]
              })(this.ProcList)}
            </FormItem>
          </div>
          <div className={styles.inlineForm}>
            <FormItem {...formStyle2} label="后">
              {getFieldDecorator("num2", {
                rules: [{ required: date_type < 2, message: "请输入产品数量" }]
              })(<Input />)}
            </FormItem>
            <FormItem {...formStyle1} extra="推荐选择系统自动分配">
              {getFieldDecorator("proc_stream2", {
                rules: [
                  { required: date_type < 2, message: "请选择产品工艺流程" }
                ]
              })(this.ProcList)}
            </FormItem>
          </div>
        </>
      );
    }

    // return this.GZInfo();
    const formStyle1 = {
      className: styles.item,
      labelCol: { span: 4 },
      wrapperCol: { span: 12 },
      label: "至"
    };
    const formStyle2 = {
      className: styles.item,
      labelCol: { span: 12 },
      wrapperCol: { span: 11 }
    };

    let gzClass = date_type === 2 ? styles.show : styles.hide;

    return (
      <div className={gzClass}>
        <FormItem
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
          label="字母信息"
          extra="请输入冠字号段的字母部分，如AA、A*A、A**A、A***A"
        >
          {getFieldDecorator("alphaNum", {
            rules: [{ required: date_type > 1, message: "冠字号段必须输入" }]
          })(<Input placeholder="请输入冠字字母" />)}
        </FormItem>
        <div className={styles.inlineForm}>
          <FormItem {...formStyle2} label="开始号段">
            {getFieldDecorator("num1", {
              rules: [
                {
                  required: date_type > 1,
                  message: "冠字号必须输入",
                  pattern: /^\d{4}$/
                }
              ]
            })(<Input />)}
          </FormItem>
          <FormItem {...formStyle1} label="结束号段">
            {getFieldDecorator("num2", {
              rules: [
                {
                  required: date_type > 1,
                  message: "冠字号必须输入",
                  pattern: /^\d{4}$/
                }
              ]
            })(<Input />)}
          </FormItem>
        </div>
        <FormItem
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 8 }}
          label="工艺流程"
          extra={
            <label>
              推荐选择 <span className={styles.bold}>8位清分机全检</span>，当不能确定最终流程时选择<span
                className={styles.bold}
              >
                系统自动分配.
              </span>
            </label>
          }
        >
          {this.props.form.getFieldDecorator("proc_stream1", {
            rules: [{ required: true, message: "请选择产品工艺流程" }]
          })(this.ProcList)}
        </FormItem>
      </div>
    );
  };

  // GZInfo = () => {
  //   const { getFieldDecorator } = this.props.form;
  //   const { date_type } = this.state;

  // };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { procTipInfo, date_type } = this.state;

    let extraInfo = "";
    switch (date_type) {
      case 0:
        extraInfo = "从某天起的产品";
        break;
      case 1:
        extraInfo = "某段时间内所有产品";
        break;
      default:
        extraInfo = "某品种冠字号段，跨冠字请按两条信息添加。";
        break;
    }

    let dateClass = date_type < 2 ? styles.show : styles.hide;

    const DateInfo = (
      <FormItem className={dateClass} {...formItemLayout} label="时间选择">
        {getFieldDecorator("rec_date", {
          rules: [{ required: date_type < 2, message: "请选择产品处理时间" }]
        })(
          date_type === 0 ? (
            <DatePicker placeholder="开始时间" />
          ) : (
            <RangePicker placeholder="时间范围" />
          )
        )}
      </FormItem>
    );

    return (
      <Form>
        <Row>
          <Col span={8}>
            {date_type < 2 ? (
              <FormItem {...formItemLayout} label="机台">
                {getFieldDecorator("machine_name", {
                  rules: [{ required: date_type < 2, message: "请选择机台" }]
                })(
                  <Select
                    placeholder="请选择机台"
                    onChange={this.machineChange}
                  >
                    {this.props.machines.map(item => (
                      <Option value={item} key={item}>
                        {item}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            ) : null}
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
            <FormItem {...formItemLayout} label="分类" extra={procTipInfo}>
              {getFieldDecorator("proc_name", {
                rules: [{ required: true, message: "请选择分类" }]
              })(
                <Select placeholder="请选择分类" onChange={this.handleProcName}>
                  {this.props.procList.map(({ proc_name }) => (
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
                    required: false,
                    message: "请输入原因说明"
                  }
                ]
              })(<Input.TextArea rows={3} placeholder="请输入异常原因说明" />)}
            </FormItem>
          </Col>

          <Col span={16}>
            <FormItem
              {...formItemLayout}
              label="产品范围"
              className={styles.radioButton}
              extra={extraInfo}
            >
              <Radio.Group value={date_type} onChange={this.handleDateType}>
                <Radio.Button value={0}>从某天起</Radio.Button>
                <Radio.Button value={1}>时间段</Radio.Button>
                <Radio.Button value={2}>冠字号段</Radio.Button>
              </Radio.Group>
            </FormItem>

            {DateInfo}

            {this.Procprocess()}

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
        </Row>
      </Form>
    );
  }
}

const WrappedDynamicRule = Form.create()(DynamicRule);

function newproc({ dispatch, loading, machines, productList, procList }) {
  return (
    <div className={styles.container}>
      <Card
        title={<div className={styles.header}>添加四新计划</div>}
        loading={loading}
        style={{ width: "100%" }}
      >
        <WrappedDynamicRule
          machines={machines}
          productList={productList}
          procList={procList}
          dispatch={dispatch}
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
