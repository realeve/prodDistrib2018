import React from 'react';
import { connect } from 'dva';
import { Row, Col, notification, Tabs, Icon } from 'antd';
import MachineItem from './MachineItem';
import ProductItem from './ProductItem';
import ProductList from './ProdList';

import LockList from './LockList';
import Loading from './Loading';

import { LocklistProps } from './LockList';
import { machineType } from './MachineItem';
import * as db from '../services/package';
import * as libs from '@/utils/lib';

const TabPane = Tabs.TabPane;
const R = require('ramda');

interface PropType extends LocklistProps {
  [key: string]: any;
}

interface StateType {
  machineList: Array<machineType>;
  previewList?: Array<machineType>;
}

/**
 * todo:20181115
 * 1.品种列表对应的开包量上限设置   (20181115 16：40 完成)
 * 2.编辑信息时，会影响到复制的任务 (20181119 21:28 fixed )
 * 3.手工编辑排活任务 (20181119 21:16完成)
 * 4.增加产品领用状态信息以及查询接口。(20181116 16：40 完成)
 * 5.不同阈值下品种的未排活情况   (20181115 16：40 完成)
 */

const getPreviewList = R.filter((item) => item.status != '0');

class PackageComponent extends React.PureComponent<PropType, StateType> {
  constructor(props: PropType) {
    super(props);
    this.state = {
      machineList: props.machineList,
      previewList: []
    };
  }

  static getDerivedStateFromProps({ machineList, previewList }, prevState) {
    // 未改变
    if (
      R.equals(machineList, prevState.machineList) &&
      R.equals(previewList, prevState.previewList)
    ) {
      return null;
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
      this.notify('任务删除失败');
      return;
    }
    machineList = R.remove(idx, 1, machineList);
    this.updateState(machineList);
  }

  async updateState(machineList) {
    await this.props.dispatch({
      type: 'package/setStore',
      payload: {
        machineList
      }
    });
    this.setState({
      machineList,
      previewList: getPreviewList(machineList)
    });
    this.notify('任务更新成功');
  }

  notify(message) {
    notification.open({
      message,
      icon: <Icon type="info-circle-o" style={{ color: '#108ee9' }} />,
      description: message
    });
  }

  updateItem(param: any, idx: number) {
    let { machineList } = this.state;
    param = Object.assign(R.nth(idx)(machineList), param);
    machineList = R.update(idx, param, machineList);
    this.updateState(machineList);
  }

  async addItem(param: any, idx: number) {
    let {
      data: [{ id, affected_rows }]
    } = await db.addPrintCutTask(param);
    if (affected_rows == 0) {
      this.notify('任务添加失败');
      return;
    }
    // 全新刷新任务列表
    this.props.dispatch({
      type: 'package/refreshMachineList'
    });

    // 防止修改影响到被复制的任务
    // let item = R.clone(param);

    // let { machineList } = this.state;
    // let newItem = R.nth(idx)(machineList);
    // newItem = Object.assign(newItem, item, {
    //   task_id: id
    // });
    // machineList = R.insert(idx, newItem, machineList);
    // this.updateState(machineList);
  }

  changeProd(limit: number | string, idx: number) {
    let { prodList, dispatch } = this.props;
    let item = R.nth(idx)(prodList);
    item.limit = limit;
    prodList = R.update(idx, item, prodList);
    dispatch({
      type: 'package/setStore',
      payload: {
        prodList
      }
    });
  }

  async removeProdResult(idx: number, item) {
    let { prodResult, dispatch } = this.props;

    let {
      data: [{ affected_rows }]
    } = await db.setPrintCutProdLog(item.rec_id);

    if (affected_rows == 0) {
      this.notify('删除失败');
      return;
    }

    this.notify('删除成功');

    let prodItem = R.nth(idx)(prodResult);
    prodItem.data = R.remove(item.idx, 1)(prodItem.data);
    prodResult = R.update(idx, prodItem)(prodResult);
    dispatch({
      type: 'package/setStore',
      payload: {
        prodResult
      }
    });
  }

  async addCarts(carts: Array<string>, appendInfo) {
    let { data } = await db.getVwWimWhitelistStatus(carts);
    data = R.map(R.pick('gh,prodname,tech,carno,ex_opennum'.split(',')))(data);

    let params = data.map((item) =>
      Object.assign(item, {
        status: 0,
        rec_date: libs.now(),
        ...appendInfo
      })
    );
    // console.log(params);
    // return;

    // 从其它机台取消领用。
    await db.setPrintCutProdLogByCarts(carts);

    // 车号列表增加至当前机台
    let {
      data: [{ affected_rows }]
    } = await db.addPrintCutProdLog(params);
    if (affected_rows == 0) {
      this.notify('添加失败');
      return;
    }
    this.notify(params.length + '车产品添加成功');

    // 刷新车号列表;
    this.props.dispatch({
      type: 'package/refreshPreview'
    });
  }

  render() {
    let {
      lockList,
      loading,
      unCompleteList,
      abnormalList,
      prodList,
      prodResult
    } = this.props;
    let { machineList, previewList } = this.state;
    return (
      <Row>
        <Col span={18} style={{ paddingRight: 10 }}>
          <Tabs defaultActiveKey="0">
            <TabPane tab="今日排产结果" key="0">
              <Row>
                {prodResult.map((item, idx) => (
                  <ProductList
                    {...item}
                    key={item.machine_id}
                    removeItem={(rec_id) => this.removeProdResult(idx, rec_id)}
                    addCarts={(carts, baseInfo) =>
                      this.addCarts(carts, baseInfo)
                    }
                  />
                ))}
              </Row>
            </TabPane>
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
                      onChange={(param) => this.updateItem(param, idx)}
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
                    editable={false}
                    onDelete={() => this.removeItem(idx)}
                    onAdd={(param) => this.addItem(param, idx)}
                    key={idx}
                  />
                ))}
              </Row>
            </TabPane>
            <TabPane tab="品种开包量阈值设置" key="3">
              <Row>
                {prodList.map((item, idx) => (
                  <ProductItem
                    {...item}
                    key={item.prod_name}
                    onChange={(limit) => this.changeProd(limit, idx)}
                  />
                ))}
              </Row>
            </TabPane>
          </Tabs>
        </Col>
        <Col span={6} style={{ paddingLeft: 10 }}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="锁车产品" key="1">
              <LockList loading={loading} lockList={lockList} />
            </TabPane>
            <TabPane tab="未判废" key="2">
              <LockList loading={loading} lockList={unCompleteList} />
            </TabPane>
            <TabPane tab="开包量超阈值产品" key="3">
              <LockList loading={loading} lockList={abnormalList} />
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
