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

import styles from "./Report.less";
import * as lib from "../../../utils/lib";
const { RangePicker } = DatePicker;
moment.locale("zh-cn");

const FormItem = Form.Item;
const Option = Select.Option;

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
    dateType: "0"
  };

  submit = () => {
    this.props.form.validateFields(err => {
      if (err) {
        return;
      }
      let data = this.props.form.getFieldsValue();
      data.rec_date = lib.ymd();

      console.log(data);
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
    });
  };

  machineChange = v => {
    console.log(v);
    message.success("机台改变时读取近期印刷的品种");

    let { setFieldsValue } = this.props.form;

    setFieldsValue({
      prod_id: "4"
    });
  };

  handleDateType = e => {
    const dateType = e.target.value;
    this.setState({ dateType });
    let { setFieldsValue } = this.props.form;
    let today = moment();
    let nextHalfMonth = moment().add(15, "days");
    setFieldsValue({
      rec_date: dateType === "0" ? today : [today, nextHalfMonth]
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { dateType } = this.state;

    return (
      // onSubmit={this.handleSubmit}
      <Form>
        <Row>
          <Col span={12}>
            <FormItem {...formItemLayout} label="机台">
              {getFieldDecorator("machine_name", {
                rules: [{ required: true, message: "请选择机台" }]
              })(
                <Select placeholder="请选择机台" onChange={this.machineChange}>
                  {this.props.machines.map(item => (
                    <Option value={item} key={item}>
                      {item}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
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
            <FormItem {...formItemLayout} label="分类">
              {getFieldDecorator("proc_name", {
                rules: [{ required: true, message: "请选择分类" }]
              })(
                <Select placeholder="请选择分类">
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
                    required: true,
                    message: "请输入原因说明"
                  }
                ]
              })(<Input.TextArea rows={3} placeholder="请输入异常原因说明" />)}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem {...formItemLayout} label="产品范围">
              <Radio.Group value={dateType} onChange={this.handleDateType}>
                <Radio.Button value="0">从某天起</Radio.Button>
                <Radio.Button value="1">时间段</Radio.Button>
              </Radio.Group>
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="时间选择"
              extra={dateType === "0" ? "从某天起的产品" : "某段时间内所有产品"}
            >
              {getFieldDecorator("rec_date", {
                rules: [{ required: true, message: "请选择产品处理时间" }]
              })(
                dateType === "0" ? (
                  <DatePicker placeholder="开始时间" />
                ) : (
                  <RangePicker placeholder="时间范围" />
                )
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="工艺流程"
              extra={
                <label>
                  推荐选择 <span className={styles.bold}>8位清分机全检</span>，当不能确定最终流程时选择<span
                    className={styles.bold}
                  >
                    系统自动分配
                  </span>.
                </label>
              }
            >
              {getFieldDecorator("proc_stream", {
                rules: [{ required: true, message: "请选择产品工艺流程" }]
              })(
                <Select placeholder="请选择产品工艺流程">
                  <Option value="0">8位清分机全检</Option>
                  <Option value="1">人工拉号</Option>
                  <Option value="2">系统自动分配</Option>
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
        title={<div className={styles.header}>添加异常品车号</div>}
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
