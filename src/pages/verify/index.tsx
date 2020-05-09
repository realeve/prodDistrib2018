import React, { useState, useEffect } from "react";
import { Card, Input, Button, Radio } from "antd";
import styles from "./index.less";
import * as lib from "@/utils/lib";
import * as db from "./db";
import * as R from "ramda";
import Heatmap from "./heatmap";
// import { useSetState } from "react-use";

// import classnames from "classname";

const prefix = "data:image/jpg;base64,";

const ImgList = ({ data, onAdd, onRemove, marked }) =>
  data.map((_data, i) => (
    <div key={_data.name} style={{ marginBottom: 20 }}>
      <h4 style={{ fontSize: 22 }}>
        {i + 1}.{_data.name}
      </h4>
      <ul className={styles.imgs}>
        {_data.data.map((item, i) => (
          <li
            key={i}
            className={marked.includes(item.code) ? styles.marked : null}
          >
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
              <Button
                style={{ marginTop: 6 }}
                type="primary"
                onClick={e => {
                  onAdd(item.code);
                }}
                disabled={marked.includes(item.code)}
              >
                标记
              </Button>
              <Button
                style={{ marginTop: 6 }}
                type="dashed"
                onClick={e => {
                  onRemove(item.code);
                }}
              >
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
    res = res.sort((a, b) => a.camera.slice(0, 2) - b.camera.slice(0, 2));

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
    res = res.sort((a, b) => a.camera.slice(0, 2) - b.camera.slice(0, 2));

    return {
      name: `大张号：${kilo}(${res.length} 条)`,
      data: res
    };
  });
};
let groupByMacro = data => {
  let dist = R.groupBy(item => item.macro_id)(data);
  return Object.entries(dist)
    .map(([kilo, data]) => {
      let res = R.clone(data);
      res = res.sort((a, b) => a.code.substr(-4) - b.code.substr(-4));
      res = res.sort((a, b) => a.camera.slice(0, 2) - b.camera.slice(0, 2));
      return {
        name: `宏区：${kilo}(${res.length} 条)`,
        data: res
      };
    })
    .sort((a, b) => b.data.length - a.data.length);
};

let groupByPos = data => {
  let dist = R.groupBy(item => item.pos)(data);
  return Object.entries(dist)
    .map(([kilo, data]) => {
      let res = R.clone(data);
      res = res.sort((a, b) => a.camera.slice(0, 2) - b.camera.slice(0, 2));
      res = res.sort((a, b) => a.code.substr(-4) - b.code.substr(-4));
      res = res.sort((a, b) => a.macro_id - b.macro_id);
      return {
        name: `开位：${kilo}(${res.length} 条)`,
        data: res
      };
    })
    .sort((a, b) => b.data.length - a.data.length);
};

let methods = {
  macro: {
    name: "宏区",
    method: groupByMacro
  },
  pos: {
    name: "开位",
    method: groupByPos
  },
  piece: {
    name: "大张",
    method: groupByPiece
  },
  kilo: {
    name: "千位",
    method: groupByKilo
  }
};

export default () => {
  const [cart, setCart] = useState("1980A234");
  const [disabled, setDisabled] = useState(false);

  const [mahouData, setMahouData] = useState([]);

  const [silk, setSilk] = useState([{ data: [], name: "丝印缺陷" }]);
  const [mahou, setMahou] = useState({});

  const [filterPos, setFilterPos] = useState(0);

  const refreshImg = async () => {
    setMahou([]);
    setSilk([]);
    db.getQfmWipJobs(cart).then(res => {
      setMahou(res);
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

  const [loading, setLoading] = useState(false);

  const [filterMethod, setFilterMethod] = useState("macro");

  useEffect(() => {
    if (!mahou.hash) {
      return;
    }
    setLoading(true);
    let dist = methods[filterMethod].method(mahou.data);
    setMahouData(dist);
    setLoading(false);
  }, [filterMethod, mahou.hash]);

  const [markedSilk, setMarkedSilk] = useState([]);
  const [markedMahou, setMarkedMahou] = useState([]);

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
        <ImgList
          data={silk}
          onAdd={code => {
            let nextState = R.clone(markedSilk);
            nextState.push(code);
            setMarkedSilk(nextState);
          }}
          onRemove={code => {
            let nextState = R.reject(item => item == code)(markedSilk);
            setMarkedSilk(nextState);
          }}
          marked={markedSilk}
        />
      </Card>

      <Card
        title="码后/涂后废"
        loading={loading}
        extra={
          <div>
            <Radio.Group
              defaultValue="macro"
              onChange={e => {
                setFilterMethod(e.target.value);
              }}
              buttonStyle="solid"
            >
              {Object.entries(methods).map(([key, item]) => (
                <Radio.Button value={key} key={key}>
                  {item.name}
                </Radio.Button>
              ))}
            </Radio.Group>
          </div>
        }
      >
        <ImgList
          data={mahouData}
          onAdd={code => {
            let nextState = R.clone(markedMahou);
            nextState.push(code);
            setMarkedMahou(nextState);
          }}
          onRemove={code => {
            let nextState = R.reject(item => item == code)(markedMahou);
            setMarkedMahou(nextState);
          }}
          marked={markedMahou}
        />
      </Card>
    </div>
  );
};
