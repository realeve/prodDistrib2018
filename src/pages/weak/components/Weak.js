import React from 'react';
import { connect } from 'dva';
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
} from 'antd';
import ErrImage from './ErrImage';

import moment from 'moment';
import 'moment/locale/zh-cn';
import * as db from '../services/Weak';
// import * as dbTblHandler from "../../../services/table";

import styles from './Report.less';
import * as lib from '../../../utils/lib';
import { uploadHost } from '../../../utils/axios';

import fakeTypes from '../../../utils/fakeTypes';

import VTable from '../../../components/Table';

moment.locale('zh-cn');

const R = require('ramda');

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
  constructor(props) {
    super(props);
    this.state = {
      level_type: 0,
      procList: [],
      machineList: [],
      captainList: [],
      prodInfo: [],
      fakeTypeList: [],
      fakeTypes,
      isNotice: false,
      noticeInfo: '',
      dataCart: {
        rows: 0
      },
      print_time: '',
      loading: props.loading
    };

    // react 16.3中的用法，目前webpack报错
    // this.base64Input = React.createRef();
    this.base64URI = '';
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      loading: nextProps.loading
    });
  }

  setTextInputRef = (e) => {
    // antd 二次封装后需console查看结构得到refs
    if (R.isNil(e)) {
      return;
    }
    this.base64Input = e.input.input;
  };

  handleThumbUrl = (url) => uploadHost + url;

  uploadBase64 = async (e) => {
    let dataURI = typeof e === 'string' ? e : e.target.value;
    if (dataURI.slice(0, 11) !== 'data:image/') {
      notification.error({
        message: '提示',
        description: '目前仅支持base64图像上传',
        icon: <Icon type="info-circle-o" style={{ color: '#108ee9' }} />
      });
      return;
    }
    // let formData = lib.dataURI2FormData(dataURI);
    // console.log(formData);
    let response = await lib.uploadBase64(dataURI);

    // 将数据绑定至上传组件
    if (response && R.has('url')(response)) {
      response.url = response.url.slice(1);

      let fileName = response.url.split('/');

      this.props.dispatch({
        type: 'weak/setFileList',
        payload: [
          {
            uid: fileName[fileName.length - 1],
            thumbUrl: this.handleThumbUrl(response.url)
          }
        ]
      });

      this.props.dispatch({
        type: 'weak/setImgUrl',
        payload: response.url
      });
    }
  };

  insertData = async () => {
    let data = this.getInsertedData();
    if (typeof data.remark === 'undefined') {
      data.remark = '';
    }

    if (data.img_url.trim() === '') {
      notification.error({
        message: '提示',
        description: '请先上传缺陷图像',
        icon: <Icon type="info-circle-o" style={{ color: '#108ee9' }} />
      });
      // return;
    }

    let insertRes = await db.addPrintMachinecheckWeak(data);

    if (!insertRes.rows) {
      notification.error({
        message: '系统错误',
        description: '数据插入失败，请联系管理员',
        icon: <Icon type="info-circle-o" style={{ color: '#108ee9' }} />
      });
      return;
    }

    notification.open({
      message: '系统提示',
      description: '数据插入成功',
      icon: <Icon type="info-circle-o" style={{ color: '#108ee9' }} />
    });

    this.resetData();
  };

  // 设置右侧数据，方便输入下一条；
  resetData = () => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({
      paper_num: 0,
      remark: ''
      // fake_type: ""
    });
    this.setState({ level_type: 0 });
    this.props.dispatch({
      type: 'weak/setImgUrl',
      payload: ''
    });
    this.props.dispatch({
      type: 'weak/setFileList',
      payload: []
    });
  };

  // 重置所有数据
  reset = () => {
    this.clearData();
    this.props.form.resetFields();
  };

  // 号码信息更改时清空数据
  clearData = () => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({
      cart_number: '',
      proc_name: '',
      captain_name: [],
      machine_name: '',
      fake_type: ''
    });
    this.setState({
      procList: [],
      machineList: [],
      captainList: [],
      prodInfo: [],
      fakeTypeList: [],
      isNotice: false,
      noticeInfo: '',
      dataCart: {
        rows: 0
      },
      print_time: ''
    });
  };

  getInsertedData = () => {
    let data = this.props.form.getFieldsValue();
    let captain_name =
      typeof data.captain_name === 'string'
        ? data.captain_name
        : data.captain_name.join(',');
    data = Object.assign(data, {
      level_type: this.state.level_type,
      img_url: this.props.imgUrl,
      rec_time: lib.now(),
      captain_name,
      print_time: this.state.print_time,
      user_name: this.props.userSetting.name
    });
    return data;
  };

  submit = () => {
    this.props.form.validateFields((err) => {
      if (err) {
        return;
      }
      this.insertData();
    });
  };

  handleLevelType = (e) => {
    const level_type = e.target.value;
    this.setState({ level_type });
  };

  searchCart = async (value, prod_id) => {
    this.clearData();
    if (R.isNil(value) || value.length < 6) {
      return;
    }
    // console.log(value);
    // else if (!lib.isGZ(value)) {
    //   notification.error({
    //     message: "冠字错误",
    //     description: "冠字信息校验失败，请重新输入",
    //     icon: <Icon type="info-circle-o" style={{ color: "#108ee9" }} />
    //   });
    //   return;
    // }

    // let prodInfo = this.props.productList.find(item => item.value === prod_id);

    let prod = R.compose(
      R.prop('name'),
      R.find(R.propEq('value', prod_id))
    )(this.props.productList);

    let params = lib.handleGZInfo({ code: value, prod });
    params.prod = prod;

    // props状态更新时会引起 vdom重载：
    // await this.props.dispatch({
    //   type: "weak/getProdInfo",
    //   payload: params
    // });

    let { data } = await db.getVIEWCARTFINDER(params);

    if (R.isNil(data) || !data.length) {
      notification.error({
        message: '提示',
        description: '当前车号未搜索到生产信息',
        icon: <Icon type="info-circle-o" style={{ color: '#108ee9' }} />
      });
      return;
    }

    data = data.filter(
      (item) => item.procName.includes('印') || item.procName.includes('涂')
    );
    let procList = R.uniq(R.map(R.prop('procName'), data));
    this.setState({ procList, prodInfo: data });
    const { setFieldsValue } = this.props.form;
    let cart_number = data.length ? data[0].cartNumber : '';
    setFieldsValue({
      cart_number
    });

    this.handleCartNumber(cart_number);
  };

  handleCartNumber = async (cart_number) => {
    let dataCart = await db.getViewPrintMachinecheckWeak(cart_number);
    // dataCart = dbTblHandler.handleSrcData(dataCart);
    this.setState({ dataCart });
    if (dataCart.rows > 0) {
      notification.open({
        message: '系统提示',
        description: `当前车号搜索到${dataCart.rows}条生产信息`,
        icon: <Icon type="info-circle-o" style={{ color: '#108ee9' }} />
      });
      return;
    }
    notification.open({
      message: '系统提示',
      description: `当前车号信息首次输入`,
      icon: <Icon type="info-circle-o" style={{ color: '#108ee9' }} />
    });
  };

  isThisCartNotice = async (cart_number, machine_name) => {
    let { data } = await db.getPrintMachinecheckMultiweak({ cart_number });
    let isNotice = false;
    if (!R.isNil(data) && data.length) {
      let noticeInfo = data.find((item) => item.machine_name === machine_name);
      if (!R.isNil(noticeInfo)) {
        isNotice = true;
        let {
          machine_name,
          captain_name,
          kilo_num,
          pos_info,
          rec_time,
          fake_type,
          remark
        } = noticeInfo;
        this.setState({
          noticeInfo: `${rec_time}日，${machine_name} ${captain_name}通知第 ${kilo_num} 千位，${pos_info} 开产品有作废(${fake_type})，备注信息:${
            remark.trim().length === 0 ? '无' : remark
          }`,
          isNotice: true
        });
        notification.error({
          message: '提示',
          description: '当前车号机台有通知作废信息，建议降废处理',
          icon: <Icon type="info-circle-o" style={{ color: '#108ee9' }} />
        });
        return;
      }
    }
    this.setState({ isNotice, noticeInfo: '' });
    if (!isNotice) {
      notification.error({
        message: '提示',
        description: '当前车号机台未通知作废信息',
        icon: <Icon type="info-circle-o" style={{ color: '#108ee9' }} />
      });
    }
  };

  handleProduct = (e) => {
    let { code_num } = this.props.form.getFieldsValue();
    this.searchCart(code_num, e);
  };

  searchCode = (e) => {
    let { value } = e.target;
    value = value.toUpperCase().trim();
    e.target.value = value;
    let { prod_id } = this.props.form.getFieldsValue();
    if (R.isNil(prod_id)) {
      return;
    }
    this.searchCart(value, prod_id);
  };

  changeProc = (v) => {
    let { prodInfo, fakeTypes } = this.state;
    let proc = v.target.value;
    let cartInfos = R.compose(
      R.project(['machineName', 'startDate']),
      R.filter(R.propEq('procName', proc))
    )(prodInfo);
    let machineList = R.compose(
      R.uniq,
      R.map(R.prop('machineName'))
    )(cartInfos);

    let print_time = R.compose(
      R.head,
      R.uniq,
      R.map(R.prop('startDate'))
    )(cartInfos);

    this.setState({ machineList, print_time });

    const { setFieldsValue } = this.props.form;

    if (machineList.length === 1) {
      setFieldsValue({
        machine_name: machineList[0]
      });
      this.changeMachine(machineList[0]);
    }
    this.setState({ fakeTypeList: fakeTypes[proc[0]] });

    let { cart_number } = this.props.form.getFieldsValue();
    this.isThisCartNotice(cart_number, machineList[0]);
  };

  changeMachine = (v) => {
    let { prodInfo } = this.state;
    let captainList = R.compose(
      R.uniq,
      R.map(R.prop('captainName')),
      R.filter(R.propEq('machineName', v))
    )(prodInfo);
    this.setState({ captainList });

    const { setFieldsValue } = this.props.form;

    if (captainList.length === 1) {
      setFieldsValue({
        captain_name: captainList[0]
      });
    }
  };

  cartLink = () => {
    let { cart_number } = this.props.form.getFieldsValue();
    return (
      cart_number && (
        <a
          href={'http://10.8.2.133/search/image/#' + cart_number}
          className="ant-btn ant-btn-primary ant-btn-sm"
          target="_blank">
          缺陷图像
        </a>
      )
    );
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      procTipInfo,
      level_type,
      procList,
      machineList,
      captainList,
      fakeTypeList,
      noticeInfo,
      isNotice
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
      <>
        <Card
          title={<h3 className={styles.header}>机检弱项记废信息</h3>}
          loading={this.state.loading}
          style={{ width: '100%' }}>
          <Form>
            <Row>
              <Col span={8}>
                <FormItem {...formItemLayout} label="品种">
                  {getFieldDecorator('prod_id', {
                    rules: [{ required: true, message: '请选择品种' }]
                  })(
                    <Select
                      placeholder="请选择品种"
                      onChange={this.handleProduct}>
                      {this.props.productList.map(({ name, value }) => (
                        <Option value={value} key={value}>
                          {name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="印码号">
                  {getFieldDecorator('code_num', {
                    rules: [
                      {
                        required: true,
                        message: '请输入印码号前6位',
                        pattern: /^[A-Za-z]{2}\d{4}$|^[A-Za-z]\d[A-Za-z]\d{3}$|^[A-Za-z]\d{2}[A-Za-z]\d{2}$|^[A-Za-z]\d{3}[A-Za-z]\d$|^[A-Za-z]\d{4}[A-Za-z]$/
                      }
                    ]
                  })(
                    <Input
                      placeholder="请输入印码号前6位"
                      onChange={this.searchCode}
                      maxLength={6}
                    />
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="车号"
                  extra={this.cartLink()}>
                  {getFieldDecorator('cart_number')(<Input disabled />)}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="工序"
                  className={styles.radioButton}>
                  {getFieldDecorator('proc_name', {
                    rules: [{ required: true, message: '请选择工序' }]
                  })(
                    <Radio.Group onChange={this.changeProc}>
                      {procList.map((name) => (
                        <Radio.Button value={name} key={name}>
                          {name}
                        </Radio.Button>
                      ))}
                    </Radio.Group>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="设备">
                  {getFieldDecorator('machine_name', {
                    rules: [{ required: true, message: '请选择机台' }]
                  })(
                    <Select
                      placeholder="请选择机台"
                      onChange={this.changeMachine}>
                      {machineList.map((name) => (
                        <Option value={name} key={name}>
                          {name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="机长">
                  {getFieldDecorator('captain_name', {
                    rules: [{ required: true, message: '请选择机长' }]
                  })(
                    <Select mode="multiple" placeholder="请选择机长">
                      {captainList.map((name) => (
                        <Option value={name} key={name}>
                          {name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="分类" extra={procTipInfo}>
                  {getFieldDecorator('fake_type', {
                    rules: [{ required: true, message: '请选择分类' }]
                  })(
                    <Select placeholder="请选择分类">
                      {fakeTypeList.map((name) => (
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
                  {getFieldDecorator('paper_num', {
                    rules: [
                      {
                        required: true,
                        message: '请输入产品张数',
                        pattern: /^\d+$/
                      }
                    ]
                  })(<Input placeholder="请输入产品张数" />)}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="记废等级"
                  className={styles.radioButton}
                  extra={extraInfo}>
                  <Radio.Group
                    value={level_type}
                    onChange={this.handleLevelType}>
                    <Radio.Button value={0}>0</Radio.Button>
                    <Radio.Button value={1}>1</Radio.Button>
                    <Radio.Button value={9}>10</Radio.Button>
                    <Radio.Button value={99}>100</Radio.Button>
                    <Radio.Button value={999}>1000</Radio.Button>
                  </Radio.Group>
                </FormItem>

                {isNotice && (
                  <FormItem {...formItemLayout} label="机台通知信息">
                    <label>{noticeInfo}</label>
                  </FormItem>
                )}

                <FormItem {...formItemLayout} label="缺陷图像">
                  <ErrImage />
                  <div className="ant-col-24 ant-form-item-control-wrapper">
                    <div className="ant-form-item-control">
                      <Input.Search
                        ref={this.setTextInputRef}
                        placeholder="粘贴图像信息自动上传"
                        onSearch={this.uploadBase64}
                        enterButton={<Icon type="upload" />}
                        onFocus={(e) => this.base64Input.select()}
                        onChange={this.uploadBase64}
                        value={this.base64URI}
                      />
                    </div>
                  </div>
                </FormItem>

                <FormItem {...formItemLayout} label="备注">
                  {getFieldDecorator('remark')(
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
        </Card>
        {this.state.dataCart.rows > 0 && (
          <VTable loading={this.state.loading} dataSrc={this.state.dataCart} />
        )}
      </>
    );
  }
}

const WrappedDynamicRule = Form.create()(DynamicRule);

function weak(props) {
  return (
    <div className={styles.container}>
      <WrappedDynamicRule {...props} />
    </div>
  );
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.weak,
    ...state.weak,
    ...state.common
  };
}

export default connect(mapStateToProps)(weak);
