import React from 'react';
import { Spin } from 'antd';
import styles from './style.less';

export default function Loading() {
  return (
    <div className={styles.center}>
      <Spin />
    </div>
  );
}
