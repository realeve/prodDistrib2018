import React, { Component } from "react";

import "ant-design-pro/dist/ant-design-pro.css"; // 统一引入样式

import styles from "./index.less";
import Header from "./Header";
import withRouter from "umi/withRouter";

import { Layout, Breadcrumb, BackTop } from "antd";
const { Content, Footer } = Layout;

class Index extends Component {
  state = {
    curPageName: ""
  };

  // 组件加载前更新菜单ID
  handleBreadName(newProps) {
    const { pathname } = newProps.location;
    let curPageName;
    switch (pathname.slice(1)) {
      case "task":
        curPageName = "领取抽检任务";
        break;
      case "report":
        curPageName = "数据报表";
        break;
      case "addcart":
        curPageName = "异常品";
        break;
      case "newproc":
        curPageName = "四新计划";
        break;
      case "":
      default:
        curPageName = "添加任务";
        break;
    }
    this.setState({
      curPageName
    });
  }

  componentWillReceiveProps(newProps) {
    this.handleBreadName(newProps);
  }

  componentWillMount() {
    this.handleBreadName(this.props);
    document.title = "印钞产品工艺流转计划跟踪系统";
  }

  render() {
    const { location, children } = this.props;

    return (
      <Layout className={styles.main}>
        <Header location={location} />
        <Content className={styles.container}>
          <Breadcrumb className={styles.breadCrumb}>
            <Breadcrumb.Item>主页</Breadcrumb.Item>
            <Breadcrumb.Item>{this.state.curPageName}</Breadcrumb.Item>
          </Breadcrumb>
          <div className={styles.content}>{children}</div>
        </Content>
        <BackTop />
        <Footer className={styles.footer}>
          cbpc ©2018 All rights reserved.
        </Footer>
      </Layout>
    );
  }
}

export default withRouter(Index);
