import React from 'react';
import { connect } from 'dva';
import { Row, Col, notification, Tabs, Icon } from 'antd';
import MachineItem from './MachineItem';

import LockList from './LockList';
import Loading from './Loading';

import { LocklistProps } from './LockList';
import { machineType } from './MachineItem';
import * as db from '../services/package';

const TabPane = Tabs.TabPane;
const R = require('ramda');

interface PropType extends LocklistProps {
  [key: string]: any;
}

interface StateType {
  machineList: Array<machineType>;
  previewList?: Array<machineType>;
}

const getPreviewList = R.filter((item) => item.status != '0');

class PackageComponent extends React.PureComponent<PropType, StateType> {
  constructor(props: PropType) {
    super(props);
    this.state = {
      machineList: props.machineList,
      previewList: []
    };
  }

  static getDerivedStateFromProps({ machineList }, prevState) {
    // 未改变
    if (R.equals(machineList, prevState.machineList)) {
      return null;
    } else if (prevState.machineList.length) {
      // 增删数据
      return {
        machineList: prevState.machineList,
        previewList: getPreviewList(prevState.machineList)
      };
    }
    // 初始化
    return { machineList, previewList: getPreviewList(machineList) };
  }

  // 移除设置项
  async removeItem(idx: number) {
    let { machineList } = this.state;
    let { task_id, machine_id } = machineList[idx];

    // 是否允许删除
    let result = R.filter(R.propEq('machine_id', machine_id))(machineList);
    if (result.length <= 1) {
      this.notify('机台仅有一条任务时禁止删除');
      return;
    }
    // 服务端移除一项
    let {
      data: [{ affected_rows }]
    } = await db.delPrintCutTask(task_id);
    if (affected_rows == 0) {
      this.notify('任务添加失败');
      return;
    }
    machineList = R.remove(idx, 1, machineList);
    this.setState({
      machineList,
      previewList: getPreviewList(machineList)
    });
    this.notify('任务添加成功');
  }

  notify(message) {
    notification.open({
      message,
      icon: <Icon type="info-circle-o" style={{ color: '#108ee9' }} />,
      description: message
    });
  }

  async addItem(param: any, idx: number) {
    let { machineList } = this.state;
    let newItem = R.nth(idx)(machineList);
    let {
      data: [{ id, affected_rows }]
    } = await db.addPrintCutTask(param);
    if (affected_rows == 0) {
      this.notify('任务添加失败');
      return;
    }
    newItem = Object.assign(newItem, param, {
      task_id: id
    });
    machineList = R.insert(idx, newItem, machineList);
    this.setState({
      machineList,
      previewList: getPreviewList(machineList)
    });
    this.notify('任务添加成功');
  }

  async taskPreview(key) {
    // 任务预览
    if (key !== '2') {
      return;
    }
    let { data: machineList } = await db.getPrintCutMachine();
    const previewList = getPreviewList(machineList);

    this.setState({
      machineList,
      previewList
    });
  }

  render() {
    let { lockList, loading, unCompleteList } = this.props;
    let { machineList, previewList } = this.state;
    return (
      <Row>
        <Col span={16} style={{ paddingRight: 10 }}>
          <Tabs defaultActiveKey="1" onChange={(key) => this.taskPreview(key)}>
            <TabPane tab="机台设置" key="1">
              {loading ? (
                <Loading />
              ) : (
                <Row>
                  {machineList.map((machine, idx) => (
                    <MachineItem
                      machine={machine}
                      onDelete={() => this.removeItem(idx)}
                      onAdd={(param) => this.addItem(param, idx)}
                      key={idx}
                    />
                  ))}
                </Row>
              )}
            </TabPane>
            <TabPane tab="排产计划预览" key="2">
              <Row>
                {previewList.map((machine, idx) => (
                  <MachineItem
                    machine={machine}
                    onDelete={() => this.removeItem(idx)}
                    onAdd={(param) => this.addItem(param, idx)}
                    key={idx}
                  />
                ))}
              </Row>
            </TabPane>
          </Tabs>
        </Col>
        <Col span={8} style={{ paddingLeft: 10 }}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="锁车产品" key="1">
              <LockList loading={loading} lockList={lockList} />
            </TabPane>
            <TabPane tab="未判废" key="2">
              <LockList loading={loading} lockList={unCompleteList} />
            </TabPane>
            <TabPane tab="开包量超阈值产品" key="3">
              3
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    );
  }
}
function mapStateToProps(state) {
  return {
    loading: state.loading.models.package,
    ...state.package,
    ...state.common
  };
}

export default connect(mapStateToProps)(PackageComponent);
