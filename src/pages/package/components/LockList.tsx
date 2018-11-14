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

  if (lockList.length === 1) {
    return <h3>无满足条件的产品</h3>;
  }

  return (
    <ul className={styles.locklist}>
      {lockList.map(
        ({ gh, prodname, tech, carno, lock_reason, open_num }, key) => (
          <li key={key}>
            {gh && <span>{gh}</span>}
            <span>{prodname}</span>
            <span>{carno}</span>
            <span>{open_num}</span>
            {tech && <span>{tech}</span>}
            {lock_reason && <span>{lock_reason}</span>}
          </li>
        )
      )}
    </ul>
  );
}
