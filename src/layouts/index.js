import React, { Component } from "react";

import "ant-design-pro/dist/ant-design-pro.css"; // 统一引入样式

import styles from "./index.less";
import Header from "./Header";
import withRouter from "umi/withRouter";
import { TransitionGroup, CSSTransition } from "react-transition-group";

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
        curPageName = "图像核查异常品";
        break;
      case "multilock":
        curPageName = "批量锁车/解锁/工艺调整";
        break;
      case "newproc":
        curPageName = "批量产品计划";
        break;
      case "login":
        curPageName = "登录";
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

    if (location.pathname === "/login") {
      return children;
    }

    // timeout={500}
    return (
      <Layout className={styles.main}>
        <Header location={location} />
        <TransitionGroup>
          <CSSTransition
            key={location.key}
            classNames="ani-left"
            timeout={{ enter: 800, exit: 800 }}
          >
            <Content className={styles.container}>
              <Breadcrumb className={styles.breadCrumb}>
                <Breadcrumb.Item>主页</Breadcrumb.Item>
                <Breadcrumb.Item>{this.state.curPageName}</Breadcrumb.Item>
              </Breadcrumb>
              <div className={styles.content}>{children}</div>
            </Content>
          </CSSTransition>
        </TransitionGroup>
        <BackTop />
        <Footer className={styles.footer}>
          cbpc ©2018 All rights reserved.
        </Footer>
      </Layout>
    );
  }
}

export default withRouter(Index);

// export default withRouter(({ location }) => (
//   <TransitionGroup>
//     <CSSTransition key={location.key} classNames="fade" timeout={300}>
//       {Index}
//     </CSSTransition>
//   </TransitionGroup>
// ));
