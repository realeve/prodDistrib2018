import React from 'react';
import { connect } from 'dva';
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
  Modal
} from 'antd';

import styles from './Report.less';
import dateRanges from '@/utils/ranges';
import * as lib from '@/utils/lib';
import moment from 'moment';
import * as db from '../services/Addcart';
import { formItemLayout, formTailLayout } from './Addcart';
import 'moment/locale/zh-cn';
const RangePicker = DatePicker.RangePicker;
moment.locale('zh-cn');

const FormItem = Form.Item;
const Option = Select.Option;
const R = require('ramda');

class DynamicRule extends React.Component {
  // 判废人员列表，未判废人员列表
  state = {
    user_list: [],
    user_ignore: [],
    operator_detail: [],
    visible: false,
    curUserIdx: 0,
    curUserInfo: {
      user_name: '',
      user_no: '',
      work_long_time: 1
    },
    curWorkLongTime: 1
  };

  componentDidMount() {
    // 用户列表载入完毕后才加载控件
    const { productList, operatorList, form } = this.props;
    if (operatorList.length && productList.length) {
      let { setFieldsValue } = form;
      let user_list = db.loadOperatorList();
      setFieldsValue({
        user_list,
        prod: productList.map(({ name }) => name)
      });
      this.refreshUsers(user_list);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      loading: nextProps.loading
    });
  }

  handleParams = (form) => {
    let {
      daterange: [tstart, tend],
      limit,
      prod,
      precision,
      totalnum
    } = form.getFieldsValue();
    return {
      need_convert: 0,
      tstart: moment(tstart).format('YYYYMMDD'),
      tend: moment(tend).format('YYYYMMDD'),
      user_list: this.state.operator_detail,
      limit,
      prod,
      precision,
      totalnum
    };
  };

  // 排产
  dispatchTasks = (params) => {
    this.props
      .dispatch({
        type: 'addcart/getHechaTask',
        payload: {
          params
        }
      })
      .then(() => {
        notification.open({
          message: '系统提示',
          description: '排产完毕',
          icon: <Icon type="info-circle-o" style={{ color: '#108ee9' }} />
        });
      });
    console.log('排产任务设置：', params);
  };

  onDateChange = (dates, daterange) => {
    this.props.dispatch({
      type: 'addcart/updateAllCheckList',
      payload: { daterange }
    });
  };

  submit = async () => {
    const form = this.props.form;
    const getParams = () =>
      new Promise((resolve) => {
        form.validateFields((err) => {
          if (err) {
            return resolve(false);
          }
          let params = this.handleParams(form);
          return resolve(params);
        });
      });
    let params = await getParams();
    if (!params) {
      return;
    }
    this.dispatchTasks(params);
  };

  // 动态存储用户信息
  operatorsChange = (user_list) => {
    db.saveOperatorList(user_list);
    this.refreshUsers(user_list);
  };

  getUserInfoByName = (user) =>
    this.props.operatorList.find((item) => item.user_name == user);

  // 计算参与判废人员，不参与判废人员
  refreshUsers = (user_list = []) => {
    let operators = this.props.operatorList.map(({ user_name }) => user_name);
    let user_ignore = R.difference(operators, user_list);

    let { operator_detail } = this.state;
    let operatorDetailList = operator_detail.map(({ user_name }) => user_name);

    let removeUser = R.difference(operatorDetailList, user_list);
    let newUser = R.difference(user_list, operatorDetailList);

    operator_detail = R.reject(({ user_name }) =>
      removeUser.includes(user_name)
    )(operator_detail);

    let newUserDetail = newUser.map(this.getUserInfoByName);
    operator_detail = [...operator_detail, ...newUserDetail];

    this.setState({
      user_list,
      user_ignore,
      operator_detail
    });
  };

  removeUserIgnore = (user) => {
    const { user_list, user_ignore, operator_detail } = this.state;

    let newIgnore = R.reject(R.equals(user))(user_ignore);

    let newUser = this.getUserInfoByName(user);
    newUser.work_long_time = 1;
    operator_detail.push(newUser);

    user_list.push(user);
    db.saveOperatorList(user_list);

    this.setState({
      user_list,
      operator_detail,
      user_ignore: newIgnore
    });
  };

  editOperator = (idx) => {
    const { operator_detail, curUserIdx } = this.state;
    let user = operator_detail[curUserIdx];
    this.setState({
      visible: true,
      curUserIdx: idx,
      curUserInfo: R.clone(user)
    });
  };

  // 编辑工作时长
  handleOk = () => {
    this.setState({
      visible: false
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  getOperatorDetail = (curWorkLongTime) => {
    const { operator_detail, curUserIdx } = this.state;
    let user = R.clone(operator_detail[curUserIdx]);
    user.work_long_time = curWorkLongTime;
    operator_detail[curUserIdx] = user;
    return operator_detail;
  };

  onWorkLongTimeChange = (curWorkLongTime) => {
    let operator_detail = this.getOperatorDetail(curWorkLongTime);

    this.setState({
      curWorkLongTime,
      operator_detail
    });
  };

  publishTask = () => {
    // 处理抽检任务
    let task_info = JSON.stringify(this.props.hechaTask);

    Modal.confirm({
      title: '提示',
      content: `是否要发布本次排产任务？`,
      maskClosable: true,
      cancelText: '取消',
      okText: '确定',
      onOk: async () => {
        let params = {
          task_info,
          rec_time: lib.now()
        };
        let { data } = await db.addPrintHechatask(params);
        let success = data[0].affected_rows > 0;
        if (success) {
          this.props.dispatch({
            type: 'addcart/setStore',
            payload: {
              rec_time: params.rec_time
            }
          });
        }

        notification.open({
          message: '系统提示',
          description: '任务发布' + (success ? '成功' : '失败'),
          icon: <Icon type="info-circle-o" style={{ color: '#108ee9' }} />
        });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      user_list,
      user_ignore,
      operator_detail,
      curUserIdx,
      curUserInfo
    } = this.state;
    let curUser = operator_detail.length
      ? operator_detail[curUserIdx]
      : curUserInfo;
    return (
      <Form>
        <Modal
          title={`${curUser.user_name}(${curUser.user_no})工作时长调整`}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="submit" type="primary" onClick={this.handleOk}>
              确定
            </Button>
          ]}>
          <div>
            工作时长:
            <InputNumber
              defaultValue={1}
              value={curUser.work_long_time}
              min={0}
              max={1}
              step={0.0625}
              formatter={(value) => value * 8}
              onChange={this.onWorkLongTimeChange}
            />
            小时
          </div>
        </Modal>
        <Row>
          <Col span={12}>
            <FormItem {...formItemLayout} label="生产日期">
              {getFieldDecorator('daterange', {
                rules: [{ required: true, message: '起始日期必须选择' }],
                initialValue: dateRanges['昨天']
              })(
                <RangePicker
                  ranges={dateRanges}
                  format="YYYYMMDD"
                  onChange={this.onDateChange}
                  locale={{
                    rangePlaceholder: ['开始日期', '结束日期']
                  }}
                />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="品种">
              {getFieldDecorator('prod', {
                rules: [{ required: true, message: '请选择品种' }]
              })(
                <Select placeholder="请选择品种" mode="multiple">
                  {this.props.productList.map(({ name, value }) => (
                    <Option value={name} key={value}>
                      {name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label="判废人员"
              extra={
                <div>
                  <p>
                    今日共
                    <span className={styles['user-tips']}>
                      {user_list.length}
                    </span>
                    人判废
                  </p>
                  {user_ignore && (
                    <>
                      <p>以下人员不参与判废(点击姓名加入判废人员列表)：</p>
                      {user_ignore.map((user) => (
                        <Button
                          type="danger"
                          key={user}
                          style={{ marginRight: 5 }}
                          onClick={() => this.removeUserIgnore(user)}>
                          {user}
                        </Button>
                      ))}
                    </>
                  )}
                </div>
              }>
              {getFieldDecorator('user_list', {
                rules: [{ required: true, message: '请选择判废人员' }]
              })(
                <Select
                  placeholder="请选择判废人员"
                  mode="multiple"
                  onChange={this.operatorsChange}>
                  {this.props.operatorList.map(({ user_name, user_no }) => (
                    <Option value={user_name} key={user_no}>
                      {user_name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label="工作时长(小时)"
              extra="点击单独编辑请假人员信息">
              {operator_detail.map(({ user_name, work_long_time }, idx) => (
                <Button
                  type={work_long_time < 1 ? 'danger' : 'default'}
                  key={user_name}
                  style={{ marginRight: 5 }}
                  onClick={() => this.editOperator(idx)}>
                  {user_name}({work_long_time * 8})
                </Button>
              ))}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label="有效缺陷数"
              extra="超过此数值时不判废">
              {getFieldDecorator('limit', {
                initialValue: 20000,
                rules: [{ required: true, message: '超过此数值不判废' }]
              })(<Input placeholder="请输入有效缺陷条数" />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label="平均每人判废数"
              extra="系统按此信息排产">
              {getFieldDecorator('totalnum', {
                initialValue: 20000,
                rules: [{ required: true, message: '系统按此信息排产' }]
              })(<Input placeholder="请输入平均每人判废数" />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label="排产精度"
              extra="排产任务间缺陷条数不超过此值">
              {getFieldDecorator('precision', {
                initialValue: 100,
                rules: [{ required: true, message: '任务间缺陷条数差值' }]
              })(<Input placeholder="请输入排产精度" />)}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem {...formTailLayout}>
              <Button type="primary" onClick={this.submit}>
                排产计算
              </Button>
              <Button
                style={{ marginLeft: 20 }}
                onClick={(e) => this.props.form.resetFields()}>
                重置
              </Button>

              <Button
                type="danger"
                disabled={this.props.hechaTask.task_list.length == 0}
                style={{ marginLeft: 20 }}
                onClick={this.publishTask}>
                发布排产任务
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}

const WrappedDynamicRule = Form.create()(DynamicRule);

function task(props) {
  const loading =
    props.operatorList.length == 0 || props.productList.length == 0;
  return (
    <div className={styles.container}>
      <Card title="图核排产设置" style={{ width: '100%' }}>
        <Skeleton loading={loading} active>
          <WrappedDynamicRule {...props} />
        </Skeleton>
      </Card>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.addcart,
    ...state.addcart,
    ...state.common
  };
}

export default connect(mapStateToProps)(task);
