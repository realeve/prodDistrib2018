import React from "react";
import { Select } from "antd";
const { Option } = Select;

class Productlist extends React.Component {
  render() {
    return (
      <Select placeholder="请选择产品品种">
        {this.props.productList.map(({ value, name }) => (
          <Option value={value} key={value}>
            {name}
          </Option>
        ))}
      </Select>
    );
  }
}

export default Productlist;
