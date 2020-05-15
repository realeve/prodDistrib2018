import React, { useState, useEffect } from "react";
import * as db from "./db";
import styles from "./index.less";
import qs from "qs";
import { now } from "@/utils/lib";
import * as R from "ramda";
import { Button } from "antd";

const handleData = data => {
  let dist = data.map(({ code, type, pos, kilo }) => ({
    code,
    type,
    pos,
    kilo
  }));

  let b = R.groupBy(R.prop("kilo"))(dist);
  R.keys(b).forEach(key => {
    let data = R.values(R.groupBy(R.prop("code"))(b[key]));
    data = data.map(item => {
      if (item.length > 1) {
        let desc = item[0];
        desc.type = item.map(i => i.type).join("、");

        return desc;
      }
      return item;
    });

    b[key] = R.flatten(data);
  });

  //   console.log(dist);
  //   console.log(b);

  return b;
};

const KiloItem = ({ kilo, data }) => (
  <div className={styles.kiloInfo}>
    <div className={styles.kilo}>千位：{kilo}</div>
    <ul className={styles.detail}>
      {data.map(item => (
        <li className={styles.item} key={item.code}>
          {item.code}({item.type}){/* <span>,第{item.pos}开</span> */}
        </li>
      ))}
    </ul>
  </div>
);

export default () => {
  let id = qs.parse(window.location.search.slice(1)).id || 0;

  let [state, setState] = useState({});
  let [info, setInfo] = useState({});

  useEffect(() => {
    db.getVerifyLog(id).then(res => {
      if (res.rows > 0) {
        let row = res.data[0];
        setInfo({
          cart: row.cart,
          operator: row.operator,
          remark: row.remark
        });
        document.title = `人工审核通知单(${row.cart})`;
        let data = handleData(res.data);
        setState(data);
      }
    });
  }, []);

  return (
    <div className={styles.main}>
      <div className={styles.print}>
        <div className={styles.title}>人工审核通知单({info.cart})</div>
        <div
          className={styles.row}
          style={{ justifyContent: "space-between", margin: "15px 0" }}
        >
          <div>车号:{info.cart}</div>
          <div>审核人员:{info.operator}</div>
          <div>打印时间:{now()}</div>
        </div>
        备注：{info.remark}
        <br />
        链接：{window.location.href}
        {Object.entries(state).map(([kilo, data]) => (
          <KiloItem kilo={kilo} data={data} key={kilo} />
        ))}
        <div className={styles.noprint}>
          <Button
            type="primary"
            onClick={() => {
              db.setVerifyCarts(id).then(res => {
                window.print();
              });
            }}
          >
            打印
          </Button>
        </div>
      </div>
    </div>
  );
};
