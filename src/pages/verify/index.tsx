import React, { useState, useEffect } from "react";
import { Card, Input, Button, Radio, notification } from "antd";
import styles from "./index.less";
import * as lib from "@/utils/lib";
import * as db from "./db";
import * as R from "ramda";
import Heatmap from "./heatmap";
import { connect } from "dva";
// import { useSetState } from "react-use";

// import classnames from "classname";

const prefix = "data:image/jpg;base64,";

const ImgList = ({ data, onAdd, onRemove, marked, isMahou = false }) =>
  data.map((_data, i) => (
    <div key={_data.name} style={{ marginBottom: 20 }}>
      <h4 style={{ fontSize: 22 }}>
        {i + 1}.{_data.name}
      </h4>
      <ul className={styles.imgs}>
        {_data.data.map((item, i) => {
          const isMarked = R.find(R.propEq("code", item.code))(marked);
          return (
            <li key={i} className={isMarked ? styles.marked : null}>
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
                {!isMahou && !isMarked && (
                  <Button
                    style={{ marginTop: 6 }}
                    type="primary"
                    onClick={e => {
                      onAdd({ code: item.code, type: "丝印", pos: item.pos });
                    }}
                    disabled={isMarked}
                  >
                    标记
                  </Button>
                )}
                {isMahou && !isMarked && (
                  <>
                    <Button
                      style={{ marginTop: 6 }}
                      type="primary"
                      onClick={e => {
                        onAdd({
                          code: item.code,
                          type: "道子",
                          pos: item.pos
                        });
                      }}
                      disabled={isMarked}
                    >
                      道子
                    </Button>
                    <Button
                      style={{ marginTop: 6 }}
                      onClick={e => {
                        onAdd({
                          code: item.code,
                          type: "胶印对印",
                          pos: item.pos
                        });
                      }}
                      disabled={isMarked}
                    >
                      对印
                    </Button>
                  </>
                )}
                {isMarked && (
                  <Button
                    style={{ marginTop: 6 }}
                    type="dashed"
                    onClick={e => {
                      onRemove(item.code);
                    }}
                  >
                    移除标记
                  </Button>
                )}
              </div>
            </li>
          );
        })}
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

const Index = ({ user }) => {
  const [cart, setCart] = useState("1980K382");
  const [disabled, setDisabled] = useState(false);

  const [mahouData, setMahouData] = useState([]);

  const [silk, setSilk] = useState([{ data: [], name: "丝印缺陷" }]);
  const [mahou, setMahou] = useState({});

  const [filterPos, setFilterPos] = useState(0);

  const [list, setList] = useState([]);

  const refreshImg = async () => {
    setMahou({});
    setSilk([]);
    setList([]);
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
    db.getVerifyCartsList(cart).then(res => {
      setList(res.data);
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

  const onSubmit = async () => {
    let res = await db.addVerifyCarts({
      cart: cart,
      operator: user
    });
    if (res.rows === 0) {
      notification.error({
        message: "系统提示",
        description: "数据写入失败"
      });
      return;
    }
    let cartid = res.data[0].id;

    const carts = [...markedSilk, ...markedMahou];

    let params = carts.map(item => ({ ...item, cartid }));
    db.addVerifyLog(params).then(res => {
      notification.success({
        message: "系统提示",
        description: "数据写入成功"
      });
      window.open("/verifyprint?id=" + cartid, "_blank");
      onReset();
    });
  };

  const onReset = () => {
    setMarkedSilk([]);
    setMarkedMahou([]);
    setMahou({});
    setSilk([]);
    setMahouData([]);
    setCart("");
    setDisabled(true);
  };

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
      <div>
        <div className={styles.panel}>
          <div className={styles.summary}>
            <div className={styles.title}>标记结果</div>
            <div className={styles.content}>
              <div className={styles.row}>
                <div>丝印缺陷：</div>
                {markedSilk.length}
              </div>
              <div className={styles.row}>
                <div>票面道子：</div>
                {R.filter(R.propEq("type", "道子"))(markedMahou).length}
              </div>
              <div className={styles.row}>
                <div>胶印对印：</div>
                {R.filter(R.propEq("type", "胶印对印"))(markedMahou).length}
              </div>
            </div>
            <Button
              type="primary"
              style={{ marginTop: 20, width: 120 }}
              onClick={onSubmit}
              disabled={markedSilk.length + markedSilk.length === 0}
            >
              提交审核结果
            </Button>
          </div>
          {list.length > 0 && (
            <div className={styles.summary}>
              <div className={styles.title}>历史审核结果</div>
              {list.map(item => (
                <div className={styles.content} key={item.id}>
                  <div className={styles.row}>
                    <div>审核人: </div>
                    {item.operator}
                  </div>
                  <div className={styles.row}>
                    <div>审核时间: </div>
                    {item.rec_time}
                  </div>
                  <div className={styles.row}>
                    <div>打印时间: </div>
                    {item.print_time}
                  </div>
                  <Button
                    type="default"
                    onClick={() => {
                      window.open("/verifyprint?id=" + item.id, "_blank");
                    }}
                  >
                    查看通知单
                  </Button>
                </div>
              ))}
            </div>
          )}
          {cart.length == 8 && <Heatmap cart={cart} onFilter={setFilterPos} />}
        </div>
      </div>
      <Card title="丝印废" style={{ margin: "20px 0" }}>
        <ImgList
          data={silk}
          onAdd={code => {
            let nextState = R.clone(markedSilk);
            nextState.push(code);
            setMarkedSilk(nextState);
          }}
          onRemove={code => {
            let nextState = R.reject(item => item.code == code)(markedSilk);
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
          isMahou
          onAdd={code => {
            let nextState = R.clone(markedMahou);
            nextState.push(code);
            setMarkedMahou(nextState);
          }}
          onRemove={code => {
            let nextState = R.reject(item => item.code == code)(markedMahou);
            setMarkedMahou(nextState);
          }}
          marked={markedMahou}
        />
      </Card>
    </div>
  );
};

export default connect(state => ({
  user: state.common.userSetting.name
}))(Index);
