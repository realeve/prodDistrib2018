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
  Radio,
  Tabs
} from 'antd';

import moment from 'moment';
import 'moment/locale/zh-cn';
import * as db from '../services/package';

import styles from './style.less';
import * as lib from '@/utils/lib';
import setting from './package_machine_setting';
import MachineItem from './MachineItem';

const R = require('ramda');
const TabPane = Tabs.TabPane;

class PackageComponent extends React.Component {
  // state = {
  //   machineList: []
  // };

  componentDidMount() {
    // this.initData();
  }

  // async initData() {
  //   let { data: machineList } = await db.getPrintCutMachine();
  //   this.setState({ machineList });
  // }

  render() {
    let { machineList } = this.props;

    return (
      <Row>
        <Col span={16} style={{ paddingRight: 10 }}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="机台设置" key="1">
              <Row>
                {machineList.map((machine) => (
                  <MachineItem
                    machine={machine}
                    key={machine.machine_id + 'm' + machine.worktype_id}
                  />
                ))}
              </Row>
            </TabPane>
          </Tabs>
        </Col>
        <Col span={8} style={{ paddingLeft: 10 }}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="锁车产品" key="1">
              1
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
