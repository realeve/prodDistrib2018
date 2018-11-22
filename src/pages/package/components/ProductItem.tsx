import React from 'react';
import { Card, Input, Button, notification, Icon, Col } from 'antd';
import styles from './style.less';

import * as db from '../services/package';
const R = require('ramda');

interface PropType {
  prod_name: string;
  limit: string | number;
  onChange: Function;
  [key: string]: any;
}

export default class ProductItem extends React.Component<PropType, PropType> {
  static defaultProps = {
    prod_name: '',
    limit: 150,
    onChange: () => {}
  };

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

  async submit() {
    let params = {
      limit: this.state.limit,
      prod_name: this.props.prod_name
    };

    let {
      data: [{ affected_rows }]
    } = await db.setProductdata(params);

    if (affected_rows == 0) {
      this.notify('任务添加失败');
      return;
    }
    this.notify('保存成功');
  }

  getCurParams() {
    let params = R.pick(
      'prod_id,machine_id,worktype_id,num,proc_type_id,status,remark'.split(',')
    )(this.state);
    params.status = params.status ? 1 : 0;
    return params;
  }

  render() {
    let inputProps = {
      className: styles.item,
      type: 'number'
    };
    return (
      <Col className={styles.machine} span={8}>
        <Card>
          <div className={styles.inlineForm}>
            <label>产品品种：</label>
            <span>{this.props.prod_name}</span>
          </div>
          <div className={styles.inlineForm}>
            <label>开包量阈值：</label>
            <Input
              {...inputProps}
              value={this.state.limit}
              onChange={({ target: { value: limit } }) => {
                this.setState({
                  limit
                });
              }}
              placeholder="低于该值时判废"
            />
          </div>
          <div className={styles.action}>
            <Button type="primary" onClick={() => this.submit()}>
              保存
            </Button>
          </div>
        </Card>
      </Col>
    );
  }
}
