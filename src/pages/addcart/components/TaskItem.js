import React from 'react';
import { Card, Col } from 'antd';
import styles from './Report.less';
export default function taskItem(props) {
  let {
    user_name,
    expect_carts,
    carts_num,
    expect_num,
    real_num,
    month,
    user_no,
    work_long_time,
    data,
    delta_num
  } = props;
  return (
    <Col span={8}>
      <Card
        title={
          <div>
            {user_name}(<small>{user_no}</small>)
          </div>
        }
        hoverable
        bodyStyle={{
          padding: 15
        }}
        style={{
          marginTop: 10,
          marginRight: 5,
          marginLeft: 5,
          minHeight: 500,
          fontSize: 15
        }}>
        <ul className={styles.detailInfo}>
          <li>
            <span>本月判废数:</span>
            <span>
              {month.pf_num}条/{month.cart_nums}万
            </span>
          </li>
          <li>
            <span>期望万数:</span>
            <span>{expect_carts}</span>
          </li>
          <li>
            <span>实际万数:</span>
            <span>{carts_num}</span>
          </li>
          <li>
            <span>期望条数:</span>
            <span>{expect_num}</span>
          </li>
          <li>
            <span>实际条数:</span>
            <span>{real_num}</span>
          </li>
          <li>
            <span>误差条数:</span>
            <span>{delta_num}</span>
          </li>
          <li>
            <span>工作时长:</span>
            <span>{work_long_time}</span>
          </li>
        </ul>
        <div className={styles.styles}>
          <div className={styles.cartListTitle}>
            <span>车号列表</span>
          </div>
          <ul className={styles.cartList}>
            <li>
              <span>序号</span>
              <span>车号</span>
              <span>判废数</span>
              <span>品种</span>
              <span>类型</span>
              <span>生产日期</span>
            </li>
            {data.map((item, i) => (
              <li key={item.cart_number}>
                <span>{i + 1}</span>
                <span>{item.cart_number}</span>
                <span>{item.pf_num}</span>
                <span>{item.product_name}</span>
                <span>{item.type == 0 ? '码后' : '丝印'}</span>
                <span>{item.start_date.split(' ')[0]}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </Col>
  );
}
