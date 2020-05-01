import React, { useState, useEffect } from "react";
import { Card, Input, Button } from "antd";
import styles from "./index.less";
import * as lib from "@/utils/lib";
import * as db from "./db";
import * as R from "ramda";
import Heatmap from "./heatmap";
const prefix = "data:image/jpg;base64,";

const ImgList = ({ data }) =>
  data.map((_data, i) => (
    <div key={_data.name} style={{ marginBottom: 20 }}>
      <h4 style={{ fontSize: 22 }}>
        {i + 1}.{_data.name}
      </h4>
      <ul className={styles.imgs}>
        {_data.data.map((item, i) => (
          <li key={i}>
            <div className={styles.imgWrap}>
              <img className={styles.img} src={prefix + item.image} alt="" />
              <div className={styles.info}>
                <div className={styles.item}>
                  <span>号码：</span>
                  <span>{item.code}</span>
                </div>
                <div className={styles.item}>
                  <span>开位：</span>
                  <span>{item.pos}</span>
                </div>
                <div className={styles.item}>
                  <span>相机：</span>
                  <span>{item.camera}</span>
                </div>
                <div className={styles.item}>
                  <span>宏区：</span>
                  <span>{item.macro_id}</span>
                </div>
              </div>
            </div>
            <div className={styles.action}>
              <Button style={{ marginTop: 6 }} type="primary">
                标记
              </Button>
              <Button style={{ marginTop: 6 }} type="dashed">
                移除标记
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  ));

let groupByKilo = data => {
  let dist = R.groupBy(item => item.code[6])(data);
  return Object.entries(dist).map(([kilo, data]) => {
    let res = R.clone(data);
    res = res.sort((a, b) => a.code.substr(-4) - b.code.substr(-4));

    return {
      name: `第${kilo}千`,
      data: res
    };
  });
};

let groupByPiece = data => {
  let dist = R.groupBy(item => item.code.slice(-4))(data);
  return Object.entries(dist).map(([kilo, data]) => {
    let res = R.clone(data);
    res = res.sort((a, b) => a.code - b.code);

    return {
      name: `大张号：${kilo}(${res.length} 条)`,
      data: res
    };
  });
};
let groupByPMacro = data => {
  let dist = R.groupBy(item => item.macro_id)(data);
  return Object.entries(dist)
    .map(([kilo, data]) => {
      let res = R.clone(data);
      res = res.sort((a, b) => a.code - b.code);
      res = res.sort((a, b) => a.camera.slice(0, 2) - b.camera.slice(0, 2));
      return {
        name: `宏区：${kilo}(${res.length} 条)`,
        data: res
      };
    })
    .sort((a, b) => b.data.length - a.data.length);
};

export default () => {
  const [cart, setCart] = useState("1980A234");
  const [disabled, setDisabled] = useState(false);

  const [mahouData, setMahouData] = useState([]);

  const [silk, setSilk] = useState([{ data: [], name: "丝印缺陷" }]);
  const [mahou, setMahou] = useState([]);

  const [filterPos, setFilterPos] = useState(0);

  const refreshImg = async () => {
    setMahou([]);
    setSilk([]);
    db.getQfmWipJobs(cart).then(res => {
      setMahou(res.data);
      setMahouData(groupByPMacro(res.data));
    });
    db.getWipJobs(cart).then(res => {
      setSilk([
        {
          data: res.data,
          name: "丝印缺陷"
        }
      ]);
    });
  };

  // console.log(filterPos);

  return (
    <div className={styles.verify}>
      <div className={styles.config}>
        <Input
          className={styles.item}
          value={cart}
          onChange={e => {
            setCart(e.target.value.toLocaleUpperCase());
            setDisabled(!lib.isCart(e.target.value.toLocaleUpperCase()));
          }}
          placeholder="请在此输入需要审核的车号"
        />
        <Button disabled={disabled} type="primary" onClick={refreshImg}>
          查询缺陷图像
        </Button>
      </div>
      {cart.length == 8 && <Heatmap cart={cart} onFilter={setFilterPos} />}
      <Card title="丝印废" style={{ margin: "20px 0" }}>
        <ImgList data={silk} />
      </Card>

      <Card
        title="码后/涂后废"
        extra={
          <div>
            <Button type="default">按千位</Button>
            <Button type="default">按大张</Button>
            <Button type="default">按宏区</Button>
          </div>
        }
      >
        <ImgList data={mahouData} />
      </Card>
    </div>
  );
};
