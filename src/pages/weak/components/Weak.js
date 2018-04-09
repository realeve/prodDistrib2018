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
import ErrImage from "./ErrImage";

import moment from "moment";
import "moment/locale/zh-cn";
import * as db from "../services/Weak";

import styles from "./Report.less";
import * as lib from "../../../utils/lib";

moment.locale("zh-cn");

const R = require("ramda");

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
    level_type: 0,
    procList: [],
    machineList: [],
    captainList: [],
    prodInfo: [],
    fakeTypeList: [],
    fakeTypes: {
      胶: [
        "道子(细道、同色系墨道、褶纸)",
        "缺印(底纹线条、防复印)",
        "底纹串色",
        "套印不准",
        "其它"
      ],
      凹: [
        "道子",
        "脏污(返脏、液脏)",
        "团花串色",
        "浅缺(文字、人像)",
        "纸张褶子",
        "安全线处缺陷",
        "其它"
      ],
      丝: ["滚动效果", "空花、浅", "滋墨", "其它"]
    }
  };

  insertData = async () => {
    let data = this.getInsertedData();
    if (typeof data.remark === "undefined") {
      data.remark = "";
    }

    if (data.img_url.trim() === "") {
      notification.error({
        message: "提示",
        description: "请先上传缺陷图像",
        icon: <Icon type="info-circle-o" style={{ color: "#108ee9" }} />
      });
      // return;
    }

    let insertRes = await db.addPrintMachinecheckWeak(data);

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

    this.resetData();
  };

  // 设置右侧数据，方便输入下一条；
  resetData = () => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({
      paper_num: 0,
      remark: "",
      fake_type: ""
    });
    this.setState({ level_type: 0 });
    this.props.dispatch({
      type: "weak/setImgUrl",
      payload: ""
    });
    this.props.dispatch({
      type: "weak/setFileList",
      payload: []
    });
  };

  // 重置所有数据
  reset = () => {
    this.chearData();
    this.props.form.resetFields();
  };

  // 号码信息更改时清空数据
  clearData = () => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({
      cart_number: "",
      proc_name: "",
      captain_name: [],
      machine_name: "",
      fake_type: ""
    });
    this.setState({
      procList: [],
      machineList: [],
      captainList: [],
      prodInfo: [],
      fakeTypeList: []
    });
  };

  getInsertedData = () => {
    let data = this.props.form.getFieldsValue();
    data = Object.assign(data, {
      level_type: this.state.level_type,
      img_url: this.props.imgUrl,
      rec_time: lib.now()
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

  handleLevelType = e => {
    const level_type = e.target.value;
    this.setState({ level_type });
  };

  searchCart = async (value, prod_id) => {
    this.clearData();
    if (R.isNil(value) || value.length < 6) {
      return;
    } else if (!lib.isGZ(value)) {
      notification.error({
        message: "冠字错误",
        description: "冠字信息校验失败，请重新输入",
        icon: <Icon type="info-circle-o" style={{ color: "#108ee9" }} />
      });
      return;
    }
    let prodInfo = this.props.productList.find(item => item.value === prod_id);

    let params = lib.handleGZInfo({ code: value, prod: prodInfo.name });
    params.prod = prodInfo.name;

    // props状态更新时会引起 vdom重载：
    // await this.props.dispatch({
    //   type: "weak/getProdInfo",
    //   payload: params
    // });

    let { data } = await db.getVIEWCARTFINDER(params);
    data = data.filter(
      item =>
        item.PROCNAME.includes("胶") ||
        item.PROCNAME.includes("凹") ||
        item.PROCNAME.includes("丝")
    );
    let procList = R.uniq(R.map(R.prop("PROCNAME"), data));
    this.setState({ procList, prodInfo: data });

    const { setFieldsValue } = this.props.form;
    setFieldsValue({
      cart_number: data.length ? data[0].CARTNUMBER : ""
    });
  };

  handleProduct = e => {
    let { code_num } = this.props.form.getFieldsValue();
    this.searchCart(code_num, e);
  };

  searchCode = e => {
    let { value } = e.target;
    value = value
      .toUpperCase()
      .trim()
      .slice(0, 6);
    e.target.value = value;
    let { prod_id } = this.props.form.getFieldsValue();
    if (R.isNil(prod_id)) {
      return;
    }
    this.searchCart(value, prod_id);
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
      level_type,
      procList,
      machineList,
      captainList,
      fakeTypeList
    } = this.state;
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
                <Select placeholder="请选择品种" onChange={this.handleProduct}>
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
              })(
                <Input
                  placeholder="请输入印码号前6位"
                  onChange={this.searchCode}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="车号">
              {getFieldDecorator("cart_number", {
                rules: [{ required: false }]
              })(<Input disabled />)}
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
            <FormItem {...formItemLayout} label="产品张数">
              {getFieldDecorator("paper_num", {
                rules: [
                  {
                    required: true,
                    message: "请输入产品张数",
                    pattern: /^\d+$/
                  }
                ]
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
              {getFieldDecorator("remark", {
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

function weak({ dispatch, loading, productList, imgUrl }) {
  return (
    <div className={styles.container}>
      <Card
        title={<h3 className={styles.header}>机检弱项记废信息</h3>}
        loading={loading}
        style={{ width: "100%" }}
      >
        <WrappedDynamicRule
          productList={productList}
          imgUrl={imgUrl}
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
