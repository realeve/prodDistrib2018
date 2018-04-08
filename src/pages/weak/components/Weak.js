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
  Radio
} from "antd";
import ErrImage from "./ErrImage";

import moment from "moment";
import "moment/locale/zh-cn";
import * as db from "../services/Weak";

import styles from "./Report.less";
import * as lib from "../../../utils/lib";

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
    level_type: 0
  };

  insertData = async () => {
    this.getInsertedData();
    // let insertRes;
    // insertRes = await db.addPrintweakPlan1(data);
    // if (!insertRes.rows) {
    //   notification.error({
    //     message: "系统错误",
    //     description: "数据插入失败，请联系管理员",
    //     icon: <Icon type="info-circle-o" style={{ color: "#108ee9" }} />
    //   });
    //   return;
    // }

    // notification.open({
    //   message: "系统提示",
    //   description: "数据插入成功",
    //   icon: <Icon type="info-circle-o" style={{ color: "#108ee9" }} />
    // });

    // this.props.form.resetFields();

    // // 重载报表数据
    // this.props.dispatch({
    //   type: "weak/handleReportData"
    // });
  };

  getInsertedData = () => {
    let data = this.props.form.getFieldsValue();
    console.log(data);
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

  handleLevelType = e => {
    const level_type = e.target.value;
    this.setState({ level_type });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { procTipInfo, level_type } = this.state;
    let extraInfo;
    switch (level_type) {
      case 0:
        extraInfo = `连续非精品不记废`;
        break;
      case 1:
        extraInfo = `机台提前通知的产品降低记废等级`;
        break;
      default:
        extraInfo = `本开产品记废${level_type}张`;
        break;
    }
    return (
      <Form>
        <Row>
          <Col span={8}>
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
            <FormItem {...formItemLayout} label="印码号">
              {getFieldDecorator("code_num", {
                rules: [{ required: true, message: "请输入印码号前6位" }]
              })(<Input placeholder="请输入印码号前6位" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="车号">
              {getFieldDecorator("cart_number", {
                rules: [{ required: false }]
              })(<Input disabled />)}
            </FormItem>
            <FormItem {...formItemLayout} label="工序">
              {getFieldDecorator("proc_name", {
                rules: [{ required: true, message: "请选择工序" }]
              })(
                <Select placeholder="请选择工序">
                  {this.props.productList.map(({ name, value }) => (
                    <Option value={name} key={value}>
                      {name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="设备">
              {getFieldDecorator("machine_name", {
                rules: [{ required: true, message: "请选择机台" }]
              })(
                <Select placeholder="请选择机台">
                  {this.props.productList.map(({ name, value }) => (
                    <Option value={name} key={value}>
                      {name}
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
                  {this.props.productList.map(({ name, value }) => (
                    <Option value={name} key={value}>
                      {name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="分类" extra={procTipInfo}>
              {getFieldDecorator("fake_type", {
                rules: [{ required: true, message: "请选择分类" }]
              })(
                <Select placeholder="请选择分类">
                  {this.props.productList.map(({ name, value }) => (
                    <Option value={value} key={value}>
                      {name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem {...formItemLayout} label="产品张数">
              {getFieldDecorator("paper_num", {
                rules: [{ required: true, message: "请输入产品张数" }]
              })(<Input placeholder="请输入产品张数" />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="记废等级"
              className={styles.radioButton}
              extra={extraInfo}
            >
              <Radio.Group value={level_type} onChange={this.handleLevelType}>
                <Radio.Button value={0}>0</Radio.Button>
                <Radio.Button value={1}>1</Radio.Button>
                <Radio.Button value={9}>10</Radio.Button>
                <Radio.Button value={99}>100</Radio.Button>
                <Radio.Button value={999}>1000</Radio.Button>
              </Radio.Group>
            </FormItem>

            <FormItem {...formItemLayout} label="缺陷图像">
              <ErrImage />
            </FormItem>

            <FormItem {...formItemLayout} label="备注">
              {getFieldDecorator("reason", {
                rules: [
                  {
                    required: false,
                    message: "请输入备注信息"
                  }
                ]
              })(<Input.TextArea rows={3} placeholder="请输入备注信息" />)}
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

function weak({ dispatch, loading, machines, productList, procList }) {
  return (
    <div className={styles.container}>
      <Card
        title={<h3 className={styles.header}>机检弱项记废信息</h3>}
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
    loading: state.loading.models.weak,
    ...state.weak
  };
}

export default connect(mapStateToProps)(weak);
