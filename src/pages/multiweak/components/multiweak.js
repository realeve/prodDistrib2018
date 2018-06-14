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

import moment from "moment";
import "moment/locale/zh-cn";
import * as db from "../services/multiweak";

import VTable from "../../../components/Table";

import styles from "./Report.less";
import * as lib from "../../../utils/lib";
import fakeTypes from "../../../utils/fakeTypes";

const R = require("ramda");

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
    procList: [],
    machineList: [],
    captainList: [],
    prodInfo: [],
    fakeTypeList: [],
    fakeTypes,
    kInfoList: []
  };

  componentDidMount() {
    let kInfoList = [];
    for (let i = 1; i < 41; i++) {
      kInfoList.push(i);
    }
    this.setState({ kInfoList });
  }

  insertData = async () => {
    let data = this.getInsertedData();
    if (typeof data.remark === "undefined") {
      data.remark = "";
    }

    let insertRes = await db.addPrintMachinecheckMultiweak(data);

    if (!insertRes.rows) {
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

    this.clearData();

    // 重载报表数据
    this.props.dispatch({
      type: "multiweak/getData"
    });
  };

  // 重置所有数据
  reset = () => {
    this.clearData();
    // this.props.form.resetFields();
  };

  // 号码信息更改时清空数据
  clearData = () => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({
      cart_number: "",
      fake_type: "",
      kilo_num: [],
      pos_info: [],
      remark: "",
      fake_num: ""
    });
  };

  getInsertedData = () => {
    let data = this.props.form.getFieldsValue();
    let kilo_num =
      typeof data.kilo_num === "string"
        ? data.kilo_num
        : data.kilo_num.sort((a, b) => a - b).join(",");
    let pos_info =
      typeof data.pos_info === "string"
        ? data.pos_info
        : data.pos_info.sort((a, b) => a - b).join(",");
    let captain_name =
      typeof data.captain_name === "string"
        ? data.captain_name
        : data.captain_name.join(",");

    let prod_id = R.compose(
      R.prop("value"),
      R.find(R.propEq("name", data.prod_id))
    )(this.props.productList);

    data = Object.assign(data, {
      rec_time: lib.now(),
      kilo_num,
      pos_info,
      captain_name,
      prod_id
    });
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

  searchCart = async cart => {
    // this.clearData();
    let params = { cart };
    let { data } = await db.getVIEWCARTFINDER(params);

    if (R.isNil(data) || !data.length) {
      notification.error({
        message: "提示",
        description: "当前车号未搜索到生产信息",
        icon: <Icon type="info-circle-o" style={{ color: "#108ee9" }} />
      });
      return;
    }

    data = data.filter(item => item.PROCNAME.includes("印"));
    let procList = R.uniq(R.map(R.prop("PROCNAME"), data));
    this.setState({ procList, prodInfo: data });
  };

  searchCode = e => {
    let { value } = e.target;
    let cart_number = value.toUpperCase().trim();
    e.target.value = cart_number;

    if (R.isNil(cart_number) || cart_number.length < 8) {
      return;
    }

    const { setFieldsValue } = this.props.form;

    setFieldsValue({
      prod_id: R.compose(
        R.prop("name"),
        R.find(R.propEq("value", cart_number[2]))
      )(this.props.productList)
    });

    this.searchCart(cart_number);
  };

  changeProc = v => {
    let { prodInfo, fakeTypes } = this.state;
    let proc = v.target.value;
    let machineList = R.compose(
      R.uniq,
      R.map(R.prop("MACHINENAME")),
      R.filter(R.propEq("PROCNAME", proc))
    )(prodInfo);
    this.setState({ machineList });

    const { setFieldsValue } = this.props.form;

    if (machineList.length === 1) {
      setFieldsValue({
        machine_name: machineList[0]
      });
      this.changeMachine(machineList[0]);
    }

    this.setState({ fakeTypeList: fakeTypes[proc[0]] });
  };

  changeMachine = v => {
    let { prodInfo } = this.state;
    let captainList = R.compose(
      R.uniq,
      R.map(R.prop("CAPTAINNAME")),
      R.filter(R.propEq("MACHINENAME", v))
    )(prodInfo);
    this.setState({ captainList });

    const { setFieldsValue } = this.props.form;

    if (captainList.length === 1) {
      setFieldsValue({
        captain_name: captainList[0]
      });
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      procTipInfo,
      procList,
      machineList,
      captainList,
      fakeTypeList,
      kInfoList
    } = this.state;

    let { prod_id } = this.props.form.getFieldsValue();
    let kList = kInfoList.slice(
      0,
      R.isNil(prod_id) || prod_id.includes("9602") || prod_id.includes("9603")
        ? 40
        : 35
    );

    return (
      <Form>
        <Row>
          <Col span={8}>
            <FormItem {...formItemLayout} label="车号">
              {getFieldDecorator("cart_number", {
                rules: [
                  {
                    required: true,
                    message: "车号信息必须输入",
                    pattern: /^\d{4}[A-Z]\d{3}$/
                  }
                ]
              })(<Input onChange={this.searchCode} maxLength="8" />)}
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

            <FormItem
              {...formItemLayout}
              label="工序"
              className={styles.radioButton}
            >
              {getFieldDecorator("proc_name", {
                rules: [{ required: true, message: "请选择工序" }]
              })(
                <Radio.Group onChange={this.changeProc}>
                  {procList.map(name => (
                    <Radio.Button value={name} key={name}>
                      {name}
                    </Radio.Button>
                  ))}
                </Radio.Group>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="设备">
              {getFieldDecorator("machine_name", {
                rules: [{ required: true, message: "请选择机台" }]
              })(
                <Select placeholder="请选择机台" onChange={this.changeMachine}>
                  {machineList.map(name => (
                    <Option value={name} key={name}>
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
                  {captainList.map(name => (
                    <Option value={name} key={name}>
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
                  {fakeTypeList.map(name => (
                    <Option value={name} key={name}>
                      {name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem {...formItemLayout} label="千位数">
              {getFieldDecorator("kilo_num", {
                rules: [
                  {
                    required: true,
                    message: "请选择千位数"
                  }
                ]
              })(
                <Select mode="multiple" placeholder="请输入千位数">
                  {"0123456789".split("").map(name => (
                    <Option value={name} key={name}>
                      {name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="产品开位">
              {getFieldDecorator("pos_info", {
                rules: [
                  {
                    required: true,
                    message: "请输入产品开位"
                  }
                ]
              })(
                <Select mode="multiple" placeholder="请选择产品开位">
                  {kList.map(name => (
                    <Option value={name} key={name}>
                      {name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="预计作废张数"
              extra="请填写此信息，系统将根据情况通知产品后续工艺。"
            >
              {getFieldDecorator("fake_num", {
                rules: [
                  {
                    pattern: /^\d+$/
                  }
                ]
              })(<Input placeholder="预计作废张数" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="备注">
              {getFieldDecorator("remark")(
                <Input.TextArea rows={3} placeholder="请输入备注信息" />
              )}
            </FormItem>

            <FormItem {...formTailLayout}>
              <Button type="primary" onClick={this.submit}>
                提交
              </Button>
              <Button style={{ marginLeft: 20 }} onClick={this.reset}>
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

const multiweak = props => (
  <>
    <Card
      title={<h3 className={styles.header}>连续废信息通知</h3>}
      loading={props.loading}
      style={{ width: "100%" }}
    >
      <WrappedDynamicRule {...props} />
    </Card>
    <VTable dataSrc={props.dataWeakList} />
  </>
);

function mapStateToProps(state) {
  return {
    loading: state.loading.models.multiweak,
    ...state.multiweak,
    productList: state.common.productList
  };
}

export default connect(mapStateToProps)(multiweak);
