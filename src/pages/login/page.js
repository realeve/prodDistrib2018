import React, { Component } from "react";
import Login from "ant-design-pro/lib/Login";
import { Alert, Checkbox, Layout } from "antd";
import styles from "./index.less";

import router from "umi/router";

const { Footer } = Layout;

const { Tab, UserName, Password, Submit } = Login;
const _lsKey = "_userSetting";

class LoginDemo extends Component {
  state = {
    notice: "",
    type: "tab1",
    autoLogin: true
  };

  onSubmit = async (err, values) => {
    console.log("value collected ->", {
      ...values,
      autoLogin: this.state.autoLogin
    });

    if (values.username === "admin") {
      this.handleAutoLogin(values);
      this.login();
      return;
    }

    this.setState({
      notice: "账号或密码错误！"
    });
  };

  encodeStr = values => {
    values.token =
      new Date().getTime() +
      encodeURI("印钞产品工艺流转计划跟踪系统").replace(/\%/g, "");
    return btoa(encodeURI(JSON.stringify(values)));
  };

  decodeStr = str => JSON.parse(decodeURI(atob(str)));

  saveUserSetting = values => {
    window.localStorage.setItem(_lsKey, this.encodeStr(values));
  };

  getUserSetting = () => {
    let _userSetting = window.localStorage.getItem(_lsKey);
    if (_userSetting == null) {
      return { success: false };
    }
    return {
      data: this.decodeStr(_userSetting),
      success: true
    };
  };

  clearUserSetting = () => {
    window.localStorage.removeItem(_lsKey);
  };

  changeAutoLogin = e => {
    let { checked } = e.target;
    this.setState({
      autoLogin: checked
    });
    if (!checked) {
      this.clearUserSetting();
    }
  };

  handleAutoLogin = values => {
    if (this.state.autoLogin) {
      this.saveUserSetting(values);
    } else {
      this.clearUserSetting();
    }
  };

  login() {
    setTimeout(() => {
      router.push("/");
    }, 1000);
  }

  componentWillMount() {
    // if (this.state.autoLogin) {
    //   this.login();
    // }
    // let { setFieldsValue } = this.props.form;
    // setFieldsValue({
    //   username: "zhangsan"
    // });
  }

  render() {
    const loginStyle = {
      style: { float: "right" },
      href: "http://10.8.2.133/login",
      rel: "noopener noreferrer",
      target: "_blank"
    };
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <a href="#/">
                <img
                  alt="logo"
                  className={styles.logo}
                  src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMzI2Ij48ZGVmcz48c3R5bGU+LmNscy03e2ZpbGw6I2Q2M2YzYn08L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNMjk4Ljg3IDMzMi4yMmMwLTI2LjQzIDktNDkuNDEgMjYuNzYtNjguODlhMTUuMzQgMTUuMzQgMCAwIDAgNC4zOC04LjVjMi4wNy0xMy41MiA3LjY3LTI1LjY3IDE1LjI5LTM2Ljk0YTEyMi44MiAxMjIuODIgMCAwIDEgMTcuMjUtMTcuNzJsLTktLjQ3Yy01LjMzLTMuNDgtMTAuMjItNy4yMy0xMS40OC0xNC4xMi0uNDgtMi42My0uMDctMy42IDIuNzctMy41OSAyMy45Mi4xMyA0Ny44NC4xNiA3MS43Ni4yMnYxNy44NWE1NyA1NyAwIDAgMC01Ny42IDU3LjZjLjA3IDMxLjc5IDI2IDU3LjYxIDU3LjU0IDU3LjE5bC4xLjQ4QTExNi42NyAxMTYuNjcgMCAwIDEgNDA2LjA5IDM2MWMtMTEuNzcgMjUuNTQtMzAuNDcgNDQuMzgtNTUuNDYgNTcuMWExLjExIDEuMTEgMCAwIDEtLjU4LS4xOWMtMS4xLS43NC0yLjE4LTEuNTEtMy4zMS0yLjIxLTIyLjA3LTEzLjc2LTM2LjgxLTMzLTQ0LjE5LTU4LTIuNDYtOC4zNy0yLjY4LTE2Ljk2LTMuNjgtMjUuNDh6IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjk4LjY3IC0xODIpIiBmaWxsPSIjZDYzYjM5Ii8+PHBhdGggZD0iTTM1MC42MyA0MTguMTNjMjUtMTIuNzIgNDMuNy0zMS41NyA1NS40Ni01Ny4xYTExNi42NyAxMTYuNjcgMCAwIDAgMTAuNTctNDUuN2MyMi41NS0xLjQxIDM4Ljk0LTEyLjA5IDQ4LjkxLTMyLjQ2IDI3LjM3IDM1IDI0LjMgODkuNDEtNi45IDEyMy40Mi0xLjIyIDEuMzMtMy40NiAyLjEzLTMuMTQgNC41Ny0xLjMxLS42Mi0xLjY1LjI0LTEuOSAxLjI1bC4wOC0uMDhhMSAxIDAgMCAwLTEuMTUgMWwuMDYtLjA1LTEuNSAxLjAyYy0xMC41NSA4LjMzLTIyLjkzIDEyLjMzLTM1Ljg2IDE0LjczYTEwMy4yMyAxMDMuMjMgMCAwIDEtNDItMS4yN2MtNy43My0yLjYzLTE1LjY5LTQuNzYtMjIuNjMtOS4zM3oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yOTguNjcgLTE4MikiIGZpbGw9IiMwNzAxMDEiLz48cGF0aCBkPSJNNDE2LjU5IDIwMC4wN3YtMTcuODVjMjguMTguMTMgNTAuMzYgMTIuMDYgNjYuODEgMzQuNiAxMi4xOCAxNi42OCAxNS45MyAzNS44MSAxNC44NSA1Ni44OC04Ljc4LTYuMzItMTcuODctMTAuNC0yOC40Ni05Ljc3aC01Mi44NWMtLjA4LTItLjI0LTQtLjI0LTZxLS4wOC0yOC45My0uMTEtNTcuODZ6IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjk4LjY3IC0xODIpIiBmaWxsPSIjZWVjNzVjIi8+PHBhdGggZD0iTTM1MC42MyA0MTguMTNjNi45NCA0LjU4IDE0LjkgNi43MSAyMi42MyA5LjM2LTEuNiAxMC42My0yLjUgMjEuMzktNS43MiAzMS43My00LjQgMTQuMTMtMTAuNTEgMjcuMjctMjEuNDEgMzcuNzFhNDAuNTIgNDAuNTIgMCAwIDEtMTkuOTMgMTAuNzFjLTMuNjguNzgtNiAuNi01LjktNC42Mi4yOC0yNC45NC4wOC00OS44OC4wNS03NC44MyAxMC4yMi0yLjQ4IDIwLjU1LTQuNjcgMjkuNy0xMC4yNmExLjExIDEuMTEgMCAwIDAgLjU4LjJ6IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjk4LjY3IC0xODIpIiBmaWxsPSIjMjY5NGMxIi8+PHBhdGggZD0iTTQxNi45NCAyNjMuOTJoNTIuODlhMy41IDMuNSAwIDAgMS0uMjEuNzQgOTcuNDcgOTcuNDcgMCAwIDEtNC4wNiAxOC4yYy0xMCAyMC4zNy0yNi4zNiAzMS00OC45MSAzMi40NmwtLjEtLjQ4eiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI5OC42NyAtMTgyKSIgZmlsbD0iI2RkOTk0YiIvPjxwYXRoIGQ9Ik0zNTAuMDUgNDE3LjkzYy05LjE1IDUuNTktMTkuNDcgNy43OC0yOS43IDEwLjI2LTYuMDkuNzUtMTIuMTMgMS44OS0xOC4zMSAxLjczLTIuMTUtLjA2LTMuMzgtLjQxLTMuMzctM3EuMTctNDcuMzYuMi05NC43MWMxIDguNTIgMS4yMiAxNy4xMSAzLjY5IDI1LjQ2IDcuMzggMjUgMjIuMTIgNDQuMjggNDQuMTkgNTggMS4xMi43NSAyLjIgMS41MiAzLjMgMi4yNnoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yOTguNjcgLTE4MikiIGZpbGw9IiNlZWM3NWQiLz48cGF0aCBjbGFzcz0iY2xzLTciIGQ9Ik00NjUuNTcgMjgyLjg3YTk3LjQ3IDk3LjQ3IDAgMCAwIDQuMDYtMTguMmMxNy4xNiAxOCAyNS44OSAzOS41NyAyNi40NSA2NC4yNS43NCAzMi44Ni0xMi4xMyA1OS42My0zNy41NyA4MC4zOC0uODcuNzEtMS42MyAxLjcxLTMgMS41Ny0uMzItMi40NCAxLjkyLTMuMjQgMy4xNC00LjU3IDMxLjIyLTM0LjAzIDM0LjI5LTg4LjQxIDYuOTItMTIzLjQzeiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI5OC42NyAtMTgyKSIvPjxwYXRoIGQ9Ik0zNTMuNTggMTk5LjcxbDkgLjQ3YTEyMi44MiAxMjIuODIgMCAwIDAtMTcuMjUgMTcuNzJjLTguMjItMS4zOS0xMy45NC01LjYtMTYuMTQtMTQtLjc4LTMtLjMyLTQuMTYgMy4wOS00LjA4IDcuMDguMTggMTQuMTktLjA2IDIxLjMtLjExeiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI5OC42NyAtMTgyKSIgZmlsbD0iIzU3YjE0YiIvPjxwYXRoIGNsYXNzPSJjbHMtNyIgZD0iTTQ1My42NyA0MTIuMDdjLjI1LTEgLjU4LTEuODcgMS45LTEuMjVhMS4zNyAxLjM3IDAgMCAxLTEuOSAxLjI1eiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI5OC42NyAtMTgyKSIvPjxwYXRoIGNsYXNzPSJjbHMtNyIgZD0iTTQ1Mi42IDQxM2ExIDEgMCAwIDEgMS4xNS0xYy4xLjg5LS40NSAxLTEuMTUgMXoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yOTguNjcgLTE4MikiLz48cGF0aCBjbGFzcz0iY2xzLTciIGQ9Ik00NTEuMTIgNDE0bDEuNTMtMS4xMmExLjMgMS4zIDAgMCAxLTEuNTMgMS4xMnoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yOTguNjcgLTE4MikiLz48cGF0aCBkPSJNNDE2Ljk0IDI2My45MmwtLjM5IDUwLjkzYy0zMS40OS40Mi01Ny40Ny0yNS40LTU3LjU0LTU3LjE5YTU3IDU3IDAgMCAxIDU3LjU3LTU3LjU5cS4wNSAyOC45NC4xMSA1Ny44OWMuMDEgMS45OC4xNyAzLjk3LjI1IDUuOTZ6bS0yMC43OC0yMmExMC42NSAxMC42NSAwIDAgMCAxMS0xMC40OCAxMC43MyAxMC43MyAwIDEgMC0yMS40Ni0uNTEgMTAuNzEgMTAuNzEgMCAwIDAgMTAuNDYgMTAuOTZ6IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjk4LjY3IC0xODIpIiBmaWxsPSIjZmZmZWZlIi8+PHBhdGggZD0iTTM5Ni4xNiAyNDEuODlhMTAuNzEgMTAuNzEgMCAwIDEtMTAuNDktMTEgMTAuNzMgMTAuNzMgMCAxIDEgMjEuNDYuNTEgMTAuNjUgMTAuNjUgMCAwIDEtMTAuOTcgMTAuNDl6bS4xNi0xNy41NmMtMi4yOS4yMi00IDEuMTktNC4yMSAzLjU0LS4xNyAyIC45NCAzLjA2IDMgMy4wNmEzLjkyIDMuOTIgMCAwIDAgNC4xOC0zLjQ4Yy4zNS0xLjk2LTEuMTctMi45LTIuOTctMy4xMnoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yOTguNjcgLTE4MikiIGZpbGw9IiMxMTEyMTIiLz48cGF0aCBkPSJNMzk2LjMyIDIyNC4zM2MxLjguMjIgMy4zMiAxLjE2IDMgMy4xMmEzLjkyIDMuOTIgMCAwIDEtNC4xOCAzLjQ4Yy0yLjA5IDAtMy4yLTEuMDktMy0zLjA2LjE4LTIuMzUgMS44Ni0zLjMyIDQuMTgtMy41NHoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yOTguNjcgLTE4MikiIGZpbGw9IiNlNWUzZTMiLz48L3N2Zz4="
                />
                <span className={styles.title}>
                  印钞产品工艺流转计划跟踪系统
                </span>
              </a>
            </div>
            <div className={styles.desc}>
              人工拉号、工艺调整跟踪、四新管理、机检弱项、连续废通知
            </div>
          </div>
          <div className={styles.main}>
            <Login defaultActiveKey={this.state.type} onSubmit={this.onSubmit}>
              <Tab key="tab1" tab="系统登录">
                {this.state.notice && (
                  <Alert
                    style={{ marginBottom: 24 }}
                    message={this.state.notice}
                    type="error"
                    showIcon
                    closable
                  />
                )}
                <UserName name="username" placeholder="用户名" />
                <Password name="password" placeholder="密码" />
              </Tab>
              <div>
                <Checkbox
                  checked={this.state.autoLogin}
                  onChange={this.changeAutoLogin}
                >
                  自动登录
                </Checkbox>
                <a {...loginStyle}>忘记密码</a>
              </div>
              <Submit>登录</Submit>
              <div>
                <span style={{ float: "left" }}>若有疑问请致电6129</span>
                <a {...loginStyle}>注册账户</a>
              </div>
            </Login>
          </div>
          <Footer className={styles.footer}>
            cbpc ©2018 All rights reserved.
          </Footer>
        </div>
      </div>
    );
  }
}

export default LoginDemo;
