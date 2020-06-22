import React, { Component } from "react";
import { Pagination } from "antd";
import style from "./index.less";

const R = require("ramda");

export default class ImgList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.dataSrc.title,
      data: props.dataSrc.data,
      current: 1,
      pageSize: 60,
      curData: []
    };
  }

  componentWillReceiveProps = async nextProps => {
    if (R.equals(nextProps.dataSrc.data, this.state.data)) {
      return;
    }
    await this.setState({
      data: nextProps.dataSrc.data,
      title: nextProps.dataSrc.title
    });
    this.changeCurData();
  };

  changeCurData = () => {
    let { data, current, pageSize } = this.state;
    let curData = data.slice((current - 1) * pageSize, current * pageSize);
    this.setState({ curData });
  };

  onShowSizeChange = (currentPage, pageSize) => {
    let current = Math.max(
      Math.floor((this.state.pageSize * currentPage) / pageSize),
      1
    );
    this.setState({
      current,
      pageSize
    });
    this.changeCurData();
  };

  refreshByPage = current => {
    this.setState({ current });
    this.changeCurData();
  };

  render() {
    let { curData, data, title, current, pageSize } = this.state;
    let total = data ? data.length : 0;
    const SeriousItem = curData.map(
      ({
        cart_number,
        client_no,
        format_pos,
        id,
        img_data,
        img_id,
        macro_id,
        status
      }) => (
        <div className={style["img-item"]} key={id}>
          <img className={style["img-data"]} src={img_data} alt="" />
          <ul className={style["img-desc"]}>
            <li>
              <span>
                车号:
                <a
                  target="_blank"
                  href={"http://10.8.2.133:8000/search/image/#" + cart_number}
                >
                  {cart_number}
                </a>
              </span>
              <span>
                检测站:
                {client_no}
              </span>
            </li>
            <li>
              <span>
                开位:
                {format_pos}
              </span>
              <span className={status == 1 ? style.realfake : ""}>
                {status == 1 ? "实废" : "误废"}
              </span>
              <span>
                宏区:
                {macro_id}
              </span>
            </li>
          </ul>
        </div>
      )
    );

    return (
      <div style={{ marginTop: 30 }}>
        <h2>{title}</h2>
        <div className={style.container}>{SeriousItem}</div>
        <Pagination
          className="ant-table-pagination"
          showTotal={(total, range) => (total ? `共 ${total} 条数据` : "")}
          showSizeChanger
          onShowSizeChange={this.onShowSizeChange}
          total={total}
          current={current}
          pageSize={pageSize}
          onChange={this.refreshByPage}
          pageSizeOptions={["30", "60", "90", "150", "200", "300"]}
        />
      </div>
    );
  }
}
