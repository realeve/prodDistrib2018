import React from 'react';
import { Row, Col, Card, Empty, Skeleton, DatePicker } from 'antd';
import styles from './Report.less';
import { connect } from 'dva';

import moment from 'moment';
import 'moment/locale/zh-cn';
import dateRanges from '@/utils/ranges';

const R = require('ramda');

const RangePicker = DatePicker.RangePicker;
moment.locale('zh-cn');

function UnhandleInfo({
  unhandle_carts,
  unupload_carts,
  loading,
  rec_time,
  pfNums,
  dateRange,
  dispatch
}) {
  const unhandle = loading ? (
    <Skeleton />
  ) : unhandle_carts.length == 0 ? (
    <Empty />
  ) : (
    unhandle_carts.map((item, i) => (
      <li key={item.cart_number}>
        <span>{i + 1}</span>
        <span>{item.cart_number}</span>
        <span>{item.pf_num}</span>
        <span>{item.prod_name}</span>
        <span>{item.machine_name}</span>
        <span>{item.proc_name}</span>
      </li>
    ))
  );

  const unupload = loading ? (
    <Skeleton />
  ) : unupload_carts.length == 0 ? (
    <Empty />
  ) : (
    unupload_carts.map((item, i) => (
      <li key={item.cart_number}>
        <span>{i + 1}</span>
        <span>{item.cart_number}</span>
        <span>{item.prod_name}</span>
        <span>{item.machine_name}</span>
        <span>{item.proc_name}</span>
      </li>
    ))
  );

  const pfnumList = loading ? (
    <Skeleton />
  ) : pfNums.length == 0 ? (
    <Empty />
  ) : (
    pfNums.map((item, i) => (
      <li key={item.operator_name}>
        <span>{i + 1}</span>
        <span>{item.operator_name}</span>
        <span>{item.cart_nums}</span>
        <span>{item.pf_num}</span>
        <span>{item.check_num}</span>
        <span>{item.total_num}</span>
      </li>
    ))
  );

  const onDateChange = async (_, dateRange) => {
    await dispatch({
      type: 'addcart/setStore',
      payload: {
        dateRange
      }
    });
    dispatch({
      type: 'addcart/loadPfNums'
    });
  };

  return (
    <div>
      <Row gutter={20}>
        <Col span={17} md={24} sm={24}>
          <p className={styles.recTime}>
            最近排产任务：<span>{rec_time}</span>
          </p>
          <Row gutter={10}>
            <Col span={12} md={12} sm={24} style={{ marginTop: 10 }}>
              <Card hoverable>
                <div>
                  <div className={styles.cartListTitle}>
                    <span className={styles.title}>不参与排活车号列表</span>
                  </div>
                  <ul className={styles.cartList}>
                    <li>
                      <span>序号</span>
                      <span>车号</span>
                      <span>判废数</span>
                      <span>品种</span>
                      <span>机台</span>
                      <span>工艺</span>
                    </li>
                    {unhandle}
                  </ul>
                </div>
              </Card>
            </Col>
            <Col span={12} md={12} sm={24} style={{ marginTop: 10 }}>
              <Card hoverable>
                <div>
                  <div className={styles.cartListTitle}>
                    <span className={styles.title}>未上传车号列表</span>
                  </div>
                  <ul className={styles.cartList}>
                    <li>
                      <span>序号</span>
                      <span>车号</span>
                      <span>品种</span>
                      <span>机台</span>
                      <span>工艺</span>
                    </li>
                    {unupload}
                  </ul>
                </div>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={7} md={24} sm={24} style={{ marginTop: 10 }}>
          <Card hoverable>
            <div>
              <div className={styles['pf-board']}>
                <span className={styles.title}>图核月度判废</span>
                <RangePicker
                  ranges={dateRanges}
                  format="YYYYMMDD"
                  onChange={onDateChange}
                  defaultValue={[moment(dateRange[0]), moment(dateRange[1])]}
                  locale={{
                    rangePlaceholder: ['开始日期', '结束日期']
                  }}
                />
              </div>
              <ul className={styles.cartList}>
                <li>
                  <span>序号</span>
                  <span>姓名</span>
                  <span>大万数</span>
                  <span>判废</span>
                  <span>抽查</span>
                  <span>总产量</span>
                </li>
                {pfnumList}
              </ul>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

const mapStateToProps = (state) => ({
  ...R.pick(['unhandle_carts', 'unupload_carts'], state.addcart.hechaTask),
  rec_time: state.addcart.rec_time,
  pfNums: state.addcart.pfNums,
  loading: state.addcart.hechaLoading,
  dateRange: state.addcart.dateRange
});

export default connect(mapStateToProps)(UnhandleInfo);
