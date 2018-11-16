import React from 'react';
import { Card, Input, Button, notification, Icon, Col } from 'antd';
import styles from './style.less';
import classNames from 'classnames/bind';
import * as db from '../services/package';

const cx = classNames.bind(styles);
const R = require('ramda');
interface cartItem {
  carno: string;
  ex_opennum: string | number;
  gh: string;
  rec_id: string | number;
  status: string | number;
  tech: string;
}
interface PropType {
  machine_id: string | number;
  machine_name: string;
  type: string;
  prod_name: string;
  real_num: string | number;
  expect_num: string | number;
  rec_date: string;
  data: Array<cartItem>;
  [key: string]: any;
}

export default class ProdList extends React.Component<PropType> {
  constructor(props) {
    super(props);
    this.state = {
      ...props
    };
  }

  notify(message) {
    notification.open({
      message,
      icon: <Icon type="info-circle-o" style={{ color: '#108ee9' }} />,
      description: message
    });
  }

  render() {
    let {
      machine_name,
      type,
      prod_name,
      real_num,
      expect_num,
      rec_date,
      data
    } = this.props;

    let cartList = R.clone(data);
    cartList = [
      {
        rec_id: '0',
        car_no: '车号',
        gh: '冠号',
        ex_opennum: '开包量',
        tech: '工艺',
        status: '状态'
      },
      ...cartList
    ];

    // const CartsComponent = cartList=>

    return (
      <Col className={styles.machine} span={8}>
        <Card>
          <div className={styles.inlineForm}>
            <label>机台</label>
            <span>{machine_name}</span>
          </div>
          <div className={styles.inlineForm}>
            <label>工艺</label>
            <span>{type}</span>
          </div>
          <div className={styles.inlineForm}>
            <label>品种</label>
            <span>{prod_name}</span>
          </div>
          <div className={styles.inlineForm}>
            <label>预计开包量</label>
            <span>{expect_num}</span>
          </div>
          <div className={styles.inlineForm}>
            <label>实际开包量</label>
            <span>{real_num}</span>
          </div>
          <div className={styles.inlineForm}>
            <label>系统排产时间</label>
            <span>{rec_date}</span>
          </div>
          <div className={styles.cartList}>
            <h3>排产结果</h3>
            {data.map(({ carno, rec_id, ex_opennum, gh, status, tech }) => (
              <div key={rec_id}>
                <div className={styles.inlineForm}>
                  <label>车号</label>
                  <span>{carno}</span>
                </div>
                <div className={styles.inlineForm}>
                  <label>冠号</label>
                  <span>{gh}</span>
                </div>
                <div className={styles.inlineForm}>
                  <label>开包量</label>
                  <span>{ex_opennum}</span>
                </div>
                <div className={styles.inlineForm}>
                  <label>工艺</label>
                  <span>{tech}</span>
                </div>
                <div className={styles.inlineForm}>
                  <label>领用状态</label>
                  <span>{status == '0' ? '未生产' : '已生产'}</span>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.action}>
            <Button type="primary">保存</Button>
          </div>
        </Card>
      </Col>
    );
  }
}
