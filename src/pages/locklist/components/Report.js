import React from 'react';
import { connect } from 'dva';
import { Button, Modal, Input, notification, Icon } from 'antd';
import VTable from '../../../components/Table';
import * as db from '../services/report';

import userLib from '../../../utils/users';
import wms from '../../index/services/wms';
import prodNode from '../../task/services/tasks';

let userSetting = userLib.getUserSetting();
let { success } = userSetting;
let userName = success ? userSetting.data.setting.name : '';

function Tasks({
  dispatch,
  dataSrc,
  dateRange,
  loading,
  visible,
  remark,
  confirmLoading,
  cart_number,
  lock_type
}) {
  const handleCancel = () => {
    dispatch({
      type: 'locklist/setStore',
      payload: {
        visible: false
      }
    });
  };

  const showModal = cart => {
    dispatch({
      type: 'locklist/setStore',
      payload: {
        visible: true,
        cart_number: cart
      }
    });
  };

  const callback = record => {
    let cart = record.col0;
    let lockType = 0;
    if (
      record.col7.includes('批量锁车.不拉号') ||
      record.col7.includes('四新验证')
    ) {
      lockType = 1;
      showModal(cart);
    } else if (record.col7.includes('人工大张日常抽检')) {
      lockType = 2;
      Modal.confirm({
        title: '系统提示',
        content: `本万产品属于每周大张抽检产品，解锁会导致无法完成抽检工艺，是否继续？`,
        maskClosable: true,
        onOk: () => {
          showModal(cart);
        }
      });
    } else if (record.col7.includes('异常品')) {
      Modal.error({
        title: '系统提示',
        content: '异常品禁止解锁...'
      });
    }

    // 更新锁车类型
    dispatch({
      type: 'locklist/setStore',
      payload: {
        lock_type: lockType
      }
    });
  };

  const handleOk = async () => {
    dispatch({
      type: 'locklist/setStore',
      payload: {
        confirmLoading: true
      }
    });

    // 非法进入
    if (lock_type == 0) {
      return;
    }

    console.log({ remark, cart_number, lock_type });
    // 仅解锁
    if (lock_type == 1) {
      // 解锁添加原因
      db.setPrintAbnormalProd({
        carts: cart_number,
        remark
      }).then(res => {
        unLoading();
      });
      let { result } = await wms.setWhiteList([cart_number]);
      showUnlockResult(result);
    }

    // 取消人工验证，解锁.不增加机台领用记录
    if (lock_type == 2) {
      prodNode.unlockCart(cart_number, 0).then(res => {
        unLoading();
      });
    }
  };

  const showUnlockResult = result => {
    if (result.unhandledList.length) {
      notification.open({
        message: '系统提示',
        description: `解锁失败`,
        icon: <Icon type="info-circle-o" style={{ color: '#108ee9' }} />
      });
    }
    notification.open({
      message: '系统提示',
      description: '解锁成功',
      icon: <Icon type="info-circle-o" style={{ color: '#108ee9' }} />
    });
  };

  const unLoading = () => {
    dispatch({
      type: 'locklist/setStore',
      payload: {
        confirmLoading: false,
        visible: false
      }
    });
    reload();
  };

  const reload = () => {
    dispatch({
      type: 'locklist/handleReportData'
    });
  };

  // 在行末添加操作列
  const actions = [
    {
      title: '解锁', //标题
      render: record =>
        record.col8 === userName && (
          <Button type="primary" onClick={() => callback(record)}>
            {record.col0}
          </Button>
        )
    }
  ];

  const inputChange = ({ target }) => {
    dispatch({
      type: 'locklist/setStore',
      payload: {
        remark: target.value
      }
    });
  };

  return (
    <div>
      <Modal
        title="产品解锁"
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}>
        <p>
          <Input.TextArea
            rows={3}
            onChange={inputChange}
            defaultValue={remark}
            placeholder="请输入解锁原因"
          />
        </p>
      </Modal>
      <VTable dataSrc={dataSrc} actions={actions} loading={loading} />
    </div>
  );
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.locklist,
    ...state.locklist
  };
}

export default connect(mapStateToProps)(Tasks);
