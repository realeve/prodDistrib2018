import React from 'react';
import { connect } from 'dva';
import { Table, Pagination, Card, Button, Badge } from 'antd';
import * as lib from '@/utils/lib';
import * as db from '../services/table';
import wms from '../services/wms';
import { notification, Icon, Modal } from 'antd';

import styles from './Tasks.less';
const R = require('ramda');

const confirm = Modal.confirm;

function Tasks({
  dispatch,
  dataSource,
  dataSrc,
  total,
  page,
  pageSize,
  loading,
  // filteredInfo,
  columns,
  sampling,
  sampleStatus,
  // sampledCarts,
  userSetting
}) {
  // 页码更新
  const pageChangeHandler = (page) => {
    dispatch({
      type: 'tasks/changePage',
      payload: page
    });
  };

  // 分页数
  const onShowSizeChange = async (current, nextPageSize) => {
    let newPage = Math.floor((pageSize * current) / nextPageSize);
    await dispatch({
      type: 'tasks/changePageSize',
      payload: nextPageSize
    });
    reloadData(newPage);
  };

  const reloadData = (newPage = 1) => {
    dispatch({
      type: 'tasks/changePage',
      payload: newPage
    });
  };

  const Title = () => {
    const { classDis, taskInfo, weekDay } = sampling;
    if (typeof classDis === 'undefined') {
      return null;
    }

    // 白中班情况
    const classDesc = classDis.map((item, i) => (
      <span key={item.name}>
        {item.name} {item.value} 次{i ? '' : ','}
      </span>
    ));

    // 周一至周五各工作日抽检数描述
    const weekDesc = ['周一', '周二', '周三', '周四', '周五'];
    const weekInfo = weekDay.map((item, i) => (
      <span key={item.name}>
        {weekDesc[parseInt(item.name, 10) - 1]}
        {item.value} 次{i === weekDay.length - 1 ? '' : ', '}
      </span>
    ));

    return (
      <div className={styles.sampling}>
        <div>
          <h2>自动分配抽样结果</h2>
          <p>(本周已领取 {sampleStatus} 车人工校验产品)</p>
        </div>
        <div className={styles.desc}>
          <h5>
            码后核查共生产<strong>{taskInfo.total}</strong>车产品,在库
            <strong>{taskInfo.stockCount}</strong>车,按
            <strong>{taskInfo.percent}</strong>%抽样将抽取
            <strong>{taskInfo.checks}</strong>车产品
          </h5>
          <h5>
            实际抽取<strong>{total}</strong>车(已抽取
            <strong>{taskInfo.sampled}</strong>,其中异常品
            <strong>{taskInfo.abnormalCarts}</strong>)，共涉及
            <strong>{taskInfo.machines}</strong>台胶、凹、码设备。其中
            {classDesc}
          </h5>
          <h5>各工作日抽检次数如下：{weekInfo}</h5>
        </div>
      </div>
    );
  };

  const openNotification = (description) => {
    notification.open({
      message: '系统提示',
      description,
      icon: <Icon type="info-circle-o" style={{ color: '#108ee9' }} />
    });
  };

  const addTasks = (e) => {
    let exInfo = {
      week_num: lib.weeks(),
      rec_time: lib.now()
    };

    let insertingData = R.map((item) => [
      ...R.slice(0, 7, item),
      item[7] + ' ' + item[8],
      item[9],
      item[11],
      exInfo.week_num,
      exInfo.rec_time
    ])(sampling.save2db.cartLog);

    const keys = 'cart_number,gz_no,code_no,proc_name,class_name,machine_name,captain_name,print_date,week_name,prod_name,week_num,rec_time'.split(
      ','
    );

    insertingData = insertingData.map((carts) => {
      let obj = {};
      carts.forEach((item, i) => {
        obj[keys[i]] = item;
      });
      return obj;
    });

    // 将已抽取的车号列表添加至人工拉号列表
    // if (sampledCarts.length) {
    //   insertingData = insertingData.filter(
    //     item => !sampledCarts.includes(item.cart_number)
    //   );
    // }
    // if (insertingData.length === 0) {
    //   openNotification("车号列表已经领取，不再重复领取");
    //   return;
    // }

    let insertData = async () => {
      let carnos = R.compose(
        R.uniq,
        R.map(R.prop('cart_number'))
      )(insertingData);

      // 20180515调整日志添加接口
      let logInfo = await db.addPrintWmsLog([
        {
          remark: JSON.stringify({ carnos, proc_stream: '人工拉号每周抽检' }),
          rec_time: lib.now()
        }
      ]);

      // 添加日志正常？
      if (logInfo.rows < 1 || logInfo.data[0].affected_rows < 1) {
        console.log(logInfo);
        openNotification('锁车失败，日志信息添加异常');
        return false;
      }
      let log_id = logInfo.data[0].id;

      let lockData = await wms.setBlackList({
        reason_code: '0576', // 'q_handCheck',
        carnos,
        log_id
      });

      // 更新日志返回信息
      await db.setPrintWmsLog({
        return_info: JSON.stringify(lockData),
        _id: log_id
      });

      let { unhandledList, handledList } = lockData.result;
      // 接口在2018.05.01之前做调整
      // unhandledList = R.map(R.prop("carno"))(unhandledList);
      // handledList = R.map(R.prop("carno"))(handledList);
      if (!lockData.status) {
        openNotification('立体库锁车异常，请联系管理员6129/7036');
        return;
      }

      if (unhandledList.length) {
        openNotification(
          '锁车完毕,以下车号锁车失败:' + unhandledList.join('、')
        );
      }

      insertingData = R.filter((item) =>
        handledList.includes(item.cart_number)
      )(insertingData);

      if (insertingData.length) {
        insertingData = insertingData.map((item) => {
          item.user_name = userSetting.name;
          return item;
        });
        let data = await db.addPrintSampleCartlist(insertingData);
        if (data.rows) {
          openNotification('车号列表领取成功');
        }
      }

      let machines = sampling.save2db.machine.map(({ name, value }) => ({
        machine_name: name,
        check_num: value,
        ...exInfo
      }));

      let data = await db.addPrintSampleMachine(machines);
      if (data.rows) {
        openNotification('机台信息添加成功');
      }

      dispatch({
        type: 'tasks/setSampleStatus',
        payload: total
      });
    };

    if (!sampleStatus) {
      insertData();
      return;
    }

    confirm({
      title: '系统提示',
      content: `本周你已经添加了 ${sampleStatus} 车产品，建议不要重复领取，是否继续？`,
      maskClosable: true,
      onOk: async () => {
        insertData();
      }
    });
  };

  const distColumn = () => {
    // let data = columns.slice(0, 10);
    // if (columns.length) {
    //   data.push({
    //     title: "添加任务",
    //     dataIndex: "column10",
    //     render: (text, record) => {
    //       return (
    //         <Button
    //           type={record.col3 === "印码" ? "primary" : "default"}
    //           onClick={addTask.bind(null, record)}
    //         >
    //           添加任务
    //         </Button>
    //       );
    //     }
    //   });
    // }
    // return data;
    if (columns.length) {
      columns[9].render = (text, record) =>
        text === '星期一' ? <Badge status="success" text={text} /> : text;
    }
    return columns;
  };

  return (
    <div className={styles.container}>
      <Card
        loading={loading}
        title={<Title />}
        style={{ width: '100%', marginTop: '30px' }}
        bodyStyle={{ padding: '0px 0px 12px 0px' }}>
        <Table
          loading={loading}
          columns={distColumn()}
          dataSource={dataSource}
          rowKey="key"
          pagination={false}
          size="medium"
          footer={() =>
            dataSrc.source ? `${dataSrc.source} (共耗时${dataSrc.timing})` : ''
          }
        />
        <Pagination
          className="ant-table-pagination"
          showTotal={(total, range) =>
            total ? `${range[0]}-${range[1]} 共 ${total} 条数据` : ''
          }
          showSizeChanger
          onShowSizeChange={onShowSizeChange}
          total={total}
          current={page}
          pageSize={pageSize}
          onChange={pageChangeHandler}
          pageSizeOptions={['5', '10', '15', '20', '30', '40', '50', '100']}
        />
        {
          <div
            style={{
              marginTop: 20,
              marginLeft: 20
            }}>
            {sampleStatus > 10 ? (
              <p>本周已领取{sampleStatus}车产品，禁止重复领取</p>
            ) : (
              <Button type="primary" onClick={addTasks}>
                批量添加任务
              </Button>
            )}
          </div>
        }
      </Card>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.tasks,
    ...state.tasks,
    ...state.common
  };
}

export default connect(mapStateToProps)(Tasks);
