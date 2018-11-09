import React from 'react';
import { connect } from 'dva';
import { Row, Col, Tabs, Spin } from 'antd';
import MachineItem from './MachineItem';
import LockList from './LockList';
import Loading from './Loading';

const TabPane = Tabs.TabPane;

class PackageComponent extends React.PureComponent {
  render() {
    let { machineList, lockList, loading } = this.props;
    return (
      <Row>
        <Col span={16} style={{ paddingRight: 10 }}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="机台设置" key="1">
              {loading ? (
                <Loading />
              ) : (
                <Row>
                  {machineList.map((machine) => (
                    <MachineItem
                      machine={machine}
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
