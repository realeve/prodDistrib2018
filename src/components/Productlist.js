import React from "react";
import { connect } from "dva";

import { Select } from "antd";
const { Option } = Select;

function Productlist({ productList }) {
  return (
    <Select placeholder="请选择产品品种">
      {productList.map(({ value, name }) => (
        <Option value={value} key={value}>
          {name}
        </Option>
      ))}
    </Select>
  );
}

function mapStateToProps(state) {
  return {
    ...state.common
  };
}

export default connect(mapStateToProps)(Productlist);
