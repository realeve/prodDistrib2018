import React from "react";
import { connect } from "dva";

import { Select } from "antd";
const { Option } = Select;

function Proclist({ procList }) {
  return (
    <Select placeholder="请选择产品工艺流程">
      {procList.map(({ value, name }) => (
        <Option value={value} key={value}>
          {name}
        </Option>
      ))}
    </Select>
  );
}

function mapStateToProps(state) {
  return {
    ...state.proclist
  };
}

export default connect(mapStateToProps)(Proclist);
