import React from 'react';
import { connect } from 'dva';
import { Row, Col, Tabs, Spin } from 'antd';
import MachineItem from './MachineItem';
import LockList from './LockList';
import Loading from './Loading';

const TabPane = Tabs.TabPane;
const R = require('ramda');

class PackageComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      machineList: props.machineList
    };
  }

  // 移除设置项
  async removeItem(idx) {
    let { machineList } = this.state;
    machineList = R.remove(idx, 1, machineList);
    this.setState({
      machineList
    });
    // 服务端移除一项
    // await db.xxx
  }

  async addItem(idx) {
    let { machineList } = this.state;
    let newItem = R.nth(idx)(machineList);
    machineList = R.add(idx, newItem, machineList);
    this.setState({
      machineList
    });
    // 服务端新增一项
    // await db.xxx
  }

  render() {
    let { lockList, loading } = this.props;
    let { machineList } = this.state;
    return (
      <Row>
        <Col span={16} style={{ paddingRight: 10 }}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="机台设置" key="1">
              {loading ? (
                <Loading />
              ) : (
                <Row>
                  {machineList.map((machine, idx) => (
                    <MachineItem
                      machine={machine}
                      onDelete={() => this.removeItem(idx)}
                      onAdd={() => this.addItem(idx)}
                      key={machine.machine_id + 'm' + machine.worktype_id}
                    />
                  ))}
                </Row>
              )}
            </TabPane>
          </Tabs>
        </Col>
        <Col span={8} style={{ paddingLeft: 10 }}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="锁车产品" key="1">
              <LockList loading={loading} lockList={lockList} />
            </TabPane>
            <TabPane tab="未判废" key="2">
              2
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
