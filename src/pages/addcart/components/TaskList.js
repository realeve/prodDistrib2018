import React from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Empty } from 'antd';
import styles from './Report.less';

const taskList = ({ task_list }) => {
  const result = (
    <Row gutter={10}>
      {task_list.map(
        ({
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
        }) => (
          <Col span={8} key={user_name}>
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
                      <span>{item.start_date.substr(5, 5)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </Col>
        )
      )}
    </Row>
  );

  return (
    <Card
      title="排产结果"
      style={{ marginTop: 10 }}
      bordered={false}
      bodyStyle={{
        padding: 0
      }}>
      {task_list.length == 0 ? <Empty /> : result}
    </Card>
  );
};

const mapStateToProps = (state) => ({
  task_list: state.addcart.hechaTask.task_list
});

export default connect(mapStateToProps)(taskList);
