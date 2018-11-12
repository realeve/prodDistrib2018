import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Card,
  Input,
  Button,
  Select,
  notification,
  Icon,
  Switch,
  Col
} from 'antd';
import styles from './style.less';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
const R = require('ramda');
const Option = Select.Option;

export interface machineType {
  machine_name: string;
  id: string | number;
  [key: string]: any;
}

interface OptionsType {
  value: string | number;
  name: string;
}

interface PropType {
  machine: machineType;
  onDelete: () => void;
  onAdd: () => void;
  produceProdList?: Array<OptionsType>;
  productList?: Array<OptionsType>;
  procTypeList?: Array<OptionsType>;
  workTypeList?: Array<OptionsType>;
}

interface StateType {
  status: boolean;
  proc_type_id: string | number;
  prod_id: string | number;
  worktype_id: string | number;
  last_produce_date: string;
  id: number;
  prod_name: string;
  machine_name: string;
  worktype_name: string;
  num: number;
  prod_date_name: string;
  limit: number;
  type: string;
  data: Array<any>;
}

// 读取设备近期生产品种
const mapStateToProps = (props: PropType) => {
  let res = R.clone(props.machine);
  res.status = Boolean(parseInt(res.status, 10));
  res.last_produce_date = false;
  if (R.isNil(res.prod_id)) {
    let data = R.find(R.propEq('machine_id', res.machine_id))(
      props.produceProdList
    );
    if (!R.isNil(data)) {
      res.last_produce_date = data.last_produce_date;
      data = R.find(R.propEq('name', data.prod_name))(props.productList);
      res.prod_id = data.value;
    }
  }
  if (R.isNil(res.prod_id)) {
    res.status = false;
  }
  if (R.isNil(res.proc_type_id)) {
    res.proc_type_id = '0';
  }
  return res;
};

@connect((state) => ({
  ...state.common,
  ...state.package
}))
class MachineItem extends Component<PropType, StateType> {
  static defaultProps = {
    machine: {
      machine_name: '载入中...'
    },
    produceProdList: [],
    productList: [],
    procTypeList: [],
    workTypeList: [],
    onDelete: () => {},
    onAdd: () => {}
  };

  constructor(props: PropType) {
    super(props);
    this.state = mapStateToProps(props);
  }

  static getDerivedStateFromProps(props, prevState) {
    if (R.equals(props.machine.machine_id, prevState.machine_id)) {
      return null;
    }
    return mapStateToProps(props);
  }

  submit() {
    console.log(this.state);
  }

  copySetting() {
    notification.open({
      message: '复制本设置项',
      icon: <Icon type="info-circle-o" style={{ color: '#108ee9' }} />,
      description: '复制本设置项'
    });
  }

  removeSetting() {
    notification.open({
      message: '移除本设置项',
      icon: <Icon type="info-circle-o" style={{ color: '#108ee9' }} />,
      description: '移除本设置项'
    });
  }

  render() {
    let {
      machine,
      productList,
      procTypeList,
      workTypeList,
      onDelete,
      onAdd
    } = this.props;
    let { last_produce_date, status } = this.state;

    const ActionTool = (
      <div className={styles.header}>
        <div>
          <h4 className={styles.header}>{machine.machine_name}</h4>
          <small>最近生产：{last_produce_date || '近一月未生产'}</small>
        </div>
        <div>
          <Button size="small" icon="plus" onClick={() => onAdd()} />
          <Button
            size="small"
            icon="close"
            type="danger"
            style={{ marginLeft: 10 }}
            onClick={() => onDelete()}
          />
        </div>
      </div>
    );

    const selectProps = {
      disabled: !status,
      className: styles.item
    };
    const inputProps = {
      ...selectProps,
      type: 'number'
    };

    return (
      <Col
        span={8}
        className={cx({ machine: true, disabled: !this.state.status })}>
        <Card title={ActionTool}>
          <div className={styles.inlineForm}>
            <label>产品品种：</label>
            <Select
              {...selectProps}
              value={this.state.prod_id}
              onChange={(prod_id: string) => this.setState({ prod_id })}
              placeholder="请选择产品品种">
              {productList.map(({ value, name }) => (
                <Option key={value} value={value}>
                  {name}
                </Option>
              ))}
            </Select>
          </div>
          <div className={styles.inlineForm}>
            <label>班次：</label>
            <Select
              {...selectProps}
              value={this.state.worktype_id}
              onChange={(worktype_id: string) => this.setState({ worktype_id })}
              placeholder="班次">
              {workTypeList.map(({ value, name }) => (
                <Option key={value} value={value}>
                  {name}
                </Option>
              ))}
            </Select>
          </div>
          <div className={styles.inlineForm}>
            <label>工艺：</label>
            <Select
              {...selectProps}
              value={this.state.proc_type_id}
              onChange={(proc_type_id: string) =>
                this.setState({ proc_type_id })
              }
              placeholder="工艺">
              {procTypeList.map(({ value, name }) => (
                <Option key={value} value={value}>
                  {name}
                </Option>
              ))}
            </Select>
          </div>
          <div className={styles.inlineForm}>
            <label>大万数：</label>
            <Input
              {...inputProps}
              value={this.state.num}
              onChange={({ target: { value: num } }: any) =>
                this.setState({ num })
              }
              placeholder="该工艺大万数"
            />
          </div>
          <div className={styles.inlineForm}>
            <label>开包量阈值：</label>
            <Input
              {...inputProps}
              value={this.state.limit}
              onChange={({ target: { value: limit } }: any) =>
                this.setState({ limit })
              }
              placeholder="低于该值时判废"
            />
          </div>
          <div className={styles.inlineForm}>
            <label>设备状态</label>
            <Switch
              checkedChildren="开机"
              unCheckedChildren="停机"
              defaultChecked
              checked={this.state.status}
              onChange={(status) => this.setState({ status })}
            />
          </div>
          <div className={styles.action}>
            <Button
              type="primary"
              disabled={!status}
              onClick={() => this.submit()}>
              保存
            </Button>
          </div>
        </Card>
      </Col>
    );
  }
}

export default MachineItem;
