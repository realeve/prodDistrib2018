import React from 'react';
import { Card, Button, notification, Icon, Col, Modal, Input } from 'antd';
import styles from './style.less';

const R = require('ramda');

const confirm = Modal.confirm;

interface cartItem {
  carno: string;
  ex_opennum: string | number;
  gh: string;
  rec_id: string | number;
  status: string | number;
  tech: string;
}

interface Iindex {
  rec_id: string | number;
  idx: string | number;
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
  isAdmin: boolean;
  removeItem?: (i: Iindex) => {};
  [key: string]: any;
}

interface IState {
  visible: boolean;
  remark: string;
}

export default class ProdList extends React.Component<PropType, IState> {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      remark: ''
    };
  }

  notify(message) {
    notification.open({
      message,
      icon: <Icon type="info-circle-o" style={{ color: '#108ee9' }} />,
      description: message
    });
  }

  removeItem(item) {
    confirm({
      title: '移除任务',
      content: `是否在任务列表中移除本车产品？`,
      maskClosable: true,
      cancelText: '取消',
      okText: '确定',
      onOk: async () => {
        this.props.removeItem(item);
      }
    });
  }

  handleOk() {
    this.setState({
      visible: false,
      remark: ''
    });
  }

  async inputChange({ target: { value } }) {
    this.setState({ remark: value });
    value = value.trim();
    if (value.includes(',')) {
      value = value.split(',');
    } else if (value.includes(' ')) {
      value = value.split(' ');
    } else {
      value = value.split('\r\n');
    }
    value = value.map((item) => item.trim()).filter((i) => i.length);
    if (value.length === 0) {
      return;
    }

    let appendInfo = R.pick('task_id,expect_num,real_num'.split(','))(
      this.props
    );
    appendInfo.type = '手工追加车号';

    this.props.addCarts(value, appendInfo);
  }

  render() {
    let {
      machine_name,
      type,
      prod_name,
      real_num,
      expect_num,
      rec_date,
      data,
      isAdmin
    } = this.props;

    type = type
      .split('+')
      .map((item) => item + '万')
      .join(' + ');

    let cartList = R.clone(data);
    cartList = [
      {
        rec_id: 0,
        carno: '车号',
        gh: '冠号',
        ex_opennum: '开包量',
        tech: '工艺',
        status_name: '状态',
        worktype_name: '班次'
      },
      ...cartList
    ];

    const CartsComponent = () => (
      <ul className={styles.preview} style={{ minHeight: 525 }}>
        {cartList.map(
          (
            { rec_id, carno, gh, ex_opennum, tech, worktype_name, status_name },
            idx
          ) => (
            <li key={rec_id}>
              <span>{idx || '#'}</span>
              <span>{carno}</span>
              <span className={styles.gz}>{gh}</span>
              <span>{ex_opennum}</span>
              <span>{tech}</span>
              <span>{status_name}</span>
              <span>{worktype_name}</span>
              {isAdmin && (
                <Button
                  size="small"
                  icon="delete"
                  title="删除"
                  className={styles.delBtn}
                  type="danger"
                  onClick={() => this.removeItem({ rec_id, idx: idx - 1 })}
                />
              )}
            </li>
          )
        )}
      </ul>
    );

    return (
      <Col
        className={styles.taskPreview}
        span={8}
        xl={8}
        lg={12}
        md={12}
        sm={12}
        xs={12}>
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
            <label>实际开包量/预计开包量</label>
            <span>
              {real_num}/{expect_num}
            </span>
          </div>
          {/* <div className={styles.inlineForm}>
            <label>实际开包量</label>
            <span>{real_num}</span>
          </div> */}
          <div className={styles.inlineForm}>
            <label>排产时间</label>
            <span>{rec_date}</span>
          </div>
          <div className={styles.cartList}>
            <h3>排产结果</h3>
            <CartsComponent />
          </div>

          {isAdmin && (
            <div className={styles.action}>
              <Button
                type="primary"
                onClick={() => this.setState({ visible: true })}>
                添加车号
              </Button>
            </div>
          )}
        </Card>

        <Modal
          title="添加车号"
          visible={this.state.visible}
          onOk={() => this.handleOk()}
          onCancel={() => {
            this.setState({ visible: false });
          }}>
          <Input.TextArea
            rows={3}
            onChange={(e) => this.inputChange(e)}
            value={this.state.remark}
            placeholder="车号列表"
          />
        </Modal>
      </Col>
    );
  }
}
