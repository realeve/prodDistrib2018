import React from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Empty, Skeleton } from 'antd';
import VTable from '@/components/Table';
import styles from './Report.less';

const taskList = ({ task_list, loading, allCheckList }) => {
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
          delta_num,
          prod7
        }) => (
          <Col span={8} lg={12} md={12} sm={24} key={user_name}>
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
                minHeight: 660,
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
                  <span>码后7T大万数:</span>
                  <span>{prod7}</span>
                </li>
                <li>
                  <span>工作时长(小时):</span>
                  <span>{work_long_time * 8}</span>
                </li>
              </ul>
              <div className={styles.styles}>
                <div className={styles.cartListTitle}>
                  <span className={styles.title}>车号列表</span>
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
                      <span
                        style={
                          item.product_name === '9607T' && item.type == 0
                            ? { background: '#f2939b' }
                            : null
                        }>
                        {item.cart_number}
                      </span>
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

  const printCartList = {
    data: [],
    rows: 0,
    time: '',
    title: '图核判废确认单',
    header: ['序号', '车号', '类型', '品种', '判废量', '判废人员', '确认签字']
  };

  let idx = 1;
  task_list.forEach(({ user_name, data }) => {
    let res = data.map(({ type, cart_number, product_name, pf_num }) => [
      idx++,
      cart_number,
      type == 0 ? '码后' : '丝印',
      product_name,
      pf_num,
      user_name,
      '  '
    ]);
    printCartList.data = [...printCartList.data, ...res];
  });
  printCartList.rows = printCartList.data.length;

  return (
    <div>
      <Card
        title="排产结果"
        style={{ marginTop: 10 }}
        bordered={false}
        bodyStyle={{
          padding: 0
        }}>
        {loading ? (
          <Skeleton active />
        ) : task_list.length == 0 ? (
          <Empty />
        ) : (
          result
        )}
      </Card>
      <VTable dataSrc={printCartList} />
      <VTable dataSrc={allCheckList} loading={loading} />
    </div>
  );
};

const mapStateToProps = (state) => ({
  task_list: state.addcart.hechaTask.task_list,
  loading: state.addcart.hechaLoading,
  allCheckList: state.addcart.allCheckList
});

export default connect(mapStateToProps)(taskList);
