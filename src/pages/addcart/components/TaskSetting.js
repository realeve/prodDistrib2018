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
  DatePicker
} from 'antd';

import styles from './Report.less';
import dateRanges from '@/utils/ranges';
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
  state = { user_list: [], user_ignore: [] };

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
      user_list,
      limit,
      prod,
      precision
    } = form.getFieldsValue();

    return {
      need_convert: 0,
      tstart: moment(tstart).format('YYYYMMDD'),
      tend: moment(tend).format('YYYYMMDD'),
      user_list: R.filter(({ user_name }) => user_list.includes(user_name))(
        this.props.operatorList
      ),
      limit,
      prod,
      precision
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

  // 计算参与判废人员，不参与判废人员
  refreshUsers = (user_list = []) => {
    let operators = this.props.operatorList.map(({ user_name }) => user_name);
    let user_ignore = R.difference(operators, user_list);
    this.setState({
      user_list,
      user_ignore
    });
  };

  removeUserIgnore = (user) => {
    const { user_list, user_ignore } = this.state;

    let newIgnore = R.reject(R.equals(user))(user_ignore);

    user_list.push(user);
    db.saveOperatorList(user_list);

    this.setState({
      user_list,
      user_ignore: newIgnore
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { user_list, user_ignore } = this.state;
    return (
      <Form>
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
                提交
              </Button>
              <Button
                style={{ marginLeft: 20 }}
                onClick={(e) => this.props.form.resetFields()}>
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

function task(props) {
  const loading =
    props.operatorList.length == 0 || props.productList.length == 0;
  return (
    <div className={styles.container}>
      <Card title="图核排产设置" loading={loading} style={{ width: '100%' }}>
        {!loading && <WrappedDynamicRule {...props} />}
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
