import React from 'react';
import styles from './style.less';
import Loading from './Loading';

interface LockListType {
  gh: string;
  prodname: string;
  tech: string;
  carno: string;
  lock_reason: string;
  [key: string]: any;
}

export interface LocklistProps {
  lockList: Array<LockListType>;
  loading: boolean;
}

export default function LockList({
  lockList,
  loading
}: LocklistProps): JSX.Element {
  if (loading) {
    return <Loading />;
  }

  if (!lockList.length) {
    return <h3>当前在库产品均未锁车</h3>;
  }

  lockList = [
    {
      prodname: '品种',
      tech: '工艺',
      gh: '冠号',
      carno: '大万号',
      lock_reason: '锁车原因'
    },
    ...lockList
  ];
  return (
    <ul className={styles.locklist}>
      {lockList.map(({ gh, prodname, tech, carno, lock_reason }) => (
        <li key={carno + lock_reason}>
          <span>{gh}</span>
          <span>{prodname}</span>
          <span>{tech}</span>
          <span>{carno}</span>
          <span>{lock_reason}</span>
        </li>
      ))}
    </ul>
  );
}
