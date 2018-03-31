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
  Col
} from "antd";

import styles from "./Report.less";
import * as lib from "../../../utils/lib";

import * as db from "../services/Addcart";

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

      console.log(data);
      this.insertData(data);
    });
  };

  convertCart = e => {
    e.preventDefault();
    let val = e.target.value.toUpperCase().trim();
    e.target.value = val;

    let { setFieldsValue } = this.props.form;

    setFieldsValue({
      prod_id: val[2]
    });

    if (val.length === 8) {
      message.success("获取车号信息，冠字，机台");
      setFieldsValue({
        machine_name: "接线印码机"
      });
    }
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
                />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="问题分类">
              {getFieldDecorator("proc_name", {
                rules: [{ required: true, message: "请选择问题分类" }]
              })(
                <Select placeholder="请选择问题分类">
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
            <FormItem {...formItemLayout} label="机台">
              {getFieldDecorator("machine_name", {
                rules: [{ required: true, message: "请选择机台" }]
              })(
                <Select placeholder="请选择机台">
                  {this.props.machines.map(item => (
                    <Option value={item} key={item}>
                      {item}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}

const WrappedDynamicRule = Form.create()(DynamicRule);

function Addcart({ dispatch, loading, machines, productList, procList }) {
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
    loading: state.loading.models.addcart,
    ...state.addcart
  };
}

export default connect(mapStateToProps)(Addcart);
