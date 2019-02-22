import React from 'react';
import { Row, Col, Card, Empty } from 'antd';
import styles from './Report.less';
import { connect } from 'dva';
const R = require('ramda');

function UnhandleInfo({ unhandle_carts, unupload_carts }) {
  return (
    <Row gutter={10}>
      <Col span={12} style={{ marginTop: 10 }}>
        <Card hoverable>
          <div className={styles.styles}>
            <div className={styles.cartListTitle}>
              <span>不参与排活车号列表</span>
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
              {unhandle_carts.length == 0 ? (
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
              )}
            </ul>
          </div>
        </Card>
      </Col>
      <Col span={12} style={{ marginTop: 10 }}>
        <Card hoverable>
          <div className={styles.styles}>
            <div className={styles.cartListTitle}>
              <span>未上传车号列表</span>
            </div>
            <ul className={styles.cartList}>
              <li>
                <span>序号</span>
                <span>车号</span>
                <span>品种</span>
                <span>机台</span>
                <span>工艺</span>
              </li>
              {unupload_carts.length == 0 ? (
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
              )}
            </ul>
          </div>
        </Card>
      </Col>
    </Row>
  );
}

const mapStateToProps = (state) => ({
  ...R.pick(['unhandle_carts', 'unupload_carts'], state.addcart.hechaTask)
});

export default connect(mapStateToProps)(UnhandleInfo);
