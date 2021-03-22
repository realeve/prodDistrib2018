import React from "react";
import { connect } from "dva";
import { Row, Col, Card, Empty, Skeleton } from "antd";
import VTable from "@/components/Table";
import styles from "./Report.less";

const taskList = ({
  task_list,
  loading,
  allCheckList,
  remarkData,
  printCartList
}) => {
  const result = (
    <Row gutter={10}>
      <Col span={24} lg={24} md={24} sm={24} style={{ margin: "10px 0" }}>
        <span>期望条数：{task_list[0]?.expect_num}</span>
        <span style={{ marginLeft: 10 }}>
          期望万数：{task_list[0]?.expect_carts}
        </span>
        <span style={{ marginLeft: 10 }}>
          总条数：{task_list[0]?.validTotal}
        </span>
        <span style={{ marginLeft: 10 }}>
          最少判废人数：{task_list[0]?.needUsers}(实际{task_list.length})
        </span>
        <span style={{ marginLeft: 10 }}>
          预计人均判废数：
          {!task_list[0]
            ? 0
            : task_list[0]?.validTotal / task_list[0]?.needUsers}
        </span>
      </Col>
      {task_list.map(
        ({
          user_name,
          expect_carts,
          carts_num,
          expect_num,
          real_num,
          // month,
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
                minHeight: 700,
                fontSize: 15
              }}
            >
              <ul className={styles.detailInfo}>
                {/* <li>
                  <span>本月判废数:</span>
                  <span>
                    {month.pf_num}条/{month.cart_nums}万
                  </span>
                </li> */}
                {/* <li>
                  <span>期望万数:</span>
                  <span>{expect_carts}</span>
                </li> */}
                <li>
                  <span>实际万数:</span>
                  <span>{carts_num}</span>
                </li>
                {/* <li>
                  <span>期望条数:</span>
                  <span>{expect_num}</span>
                </li> */}
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
                    <li key={item.cart_number + i}>
                      <span>{i + 1}</span>
                      <span
                        style={
                          item.is_check
                            ? { background: "#93f29b" }
                            : item.product_name === "9607T" && item.type == 0
                            ? { background: "#f2939b" }
                            : null
                        }
                      >
                        {item.cart_number}
                        {item.is_check && "(抽检品)"}
                      </span>
                      <span>{item.pf_num}</span>
                      <span>{item.product_name}</span>
                      <span>{["码后", "丝印", "涂布"][item.type]}</span>
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
    <div>
      <Card
        title="排产结果"
        style={{ marginTop: 10 }}
        bordered={false}
        bodyStyle={{
          padding: 0
        }}
      >
        {loading ? (
          <Skeleton active />
        ) : task_list.length == 0 ? (
          <Empty />
        ) : (
          result
        )}
      </Card>
      <VTable dataSrc={remarkData} />
      <VTable dataSrc={printCartList} />
      <VTable dataSrc={allCheckList} loading={loading} />
    </div>
  );
};

const mapStateToProps = state => ({
  task_list: state.addcart.hechaTask.task_list,
  loading: state.addcart.hechaLoading,
  allCheckList: state.addcart.allCheckList,
  remarkData: state.addcart.remarkData,
  printCartList: state.addcart.printCartList
});

export default connect(mapStateToProps)(taskList);
