import { Menu, Icon, Spin, Dropdown, Avatar } from "antd";
import Link from "umi/link";
import router from "umi/router";

import { Layout } from "antd";
import styles from "./header.less";

const { Header } = Layout;
const SubMenu = Menu.SubMenu;

function HeaderMenu({ location }) {
  const handleMenuClick = ({ key }) => {
    if (key === "login") {
      router.push("/login");
      return;
    }
    if (key === "user") {
      window.location.href = "http://10.8.2.133/setting/user";
    }
  };

  const menu = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={handleMenuClick}>
      <Menu.Item key="user">
        <Icon type="user" />个人中心
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="login">
        <Icon type="login" />退出登录
      </Menu.Item>
    </Menu>
  );

  const currentUser = {
    name: "张三",
    avatar:
      "https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"
  };

  return (
    <Header className={styles.header}>
      <div className={styles.logo}>ProdDist</div>
      <Menu
        selectedKeys={[location.pathname]}
        mode="horizontal"
        theme="dark"
        className={styles.menu}
      >
        <SubMenu
          title={
            <span>
              <Icon type="calculator" />自动排活 <Icon type="down" />
            </span>
          }
        >
          <Menu.Item key="/">
            <Link to="/">
              <Icon type="home" />添加任务
            </Link>
          </Menu.Item>
          <Menu.Item key="/task">
            <Link to="/task">
              <Icon type="bars" />领取抽检任务
            </Link>
          </Menu.Item>
          <Menu.Item key="/report">
            <Link to="/report">
              <Icon type="area-chart" />数据报表
            </Link>
          </Menu.Item>
        </SubMenu>

        <SubMenu
          title={
            <span>
              <Icon type="unlock" />异常品处理 <Icon type="down" />
            </span>
          }
        >
          <Menu.Item key="/addcart">
            <Link to="/addcart">
              <Icon type="exclamation-circle-o" />图像核查异常品
            </Link>
          </Menu.Item>
          <Menu.Item key="/multilock">
            <Link to="/multilock">
              <Icon type="lock" />批量锁车/解锁/工艺调整
            </Link>
          </Menu.Item>
        </SubMenu>
        <Menu.Item key="/newproc">
          <Link to="/newproc">
            <Icon type="clock-circle-o" />批量产品计划
          </Link>
        </Menu.Item>
        <SubMenu
          title={
            <span>
              <Icon type="eye-o" />机检弱项通知 <Icon type="down" />
            </span>
          }
        >
          <Menu.Item key="/multiweak">
            <Link to="/multiweak">
              <Icon type="close-circle-o" />机台连续废通知
            </Link>
          </Menu.Item>
          <Menu.Item key="/weak">
            <Link to="/weak">
              <Icon type="eye-o" />机检弱项录入
            </Link>
          </Menu.Item>
          <Menu.Item key="/weaklist">
            <Link to="/weaklist">
              <Icon type="eye-o" />机检弱项报告
            </Link>
          </Menu.Item>
        </SubMenu>
      </Menu>
      {currentUser.name ? (
        <div className={styles.right}>
          <Dropdown overlay={menu}>
            <span className={`${styles.action} ${styles.account}`}>
              <Avatar
                size="large"
                className={styles.avatar}
                src={currentUser.avatar}
              />
              <span className={styles.name}>{currentUser.name}</span>
            </span>
          </Dropdown>
        </div>
      ) : (
        <Spin size="default" className={styles.spin} />
      )}
    </Header>
  );
}

export default HeaderMenu;
