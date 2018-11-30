import { Menu, Icon, Layout } from 'antd';
import Link from 'umi/link';

import styles from './header.less';
import LoginAvatar from './LoginAvatar';

const { Header } = Layout;
const SubMenu = Menu.SubMenu;

function HeaderMenu({ location, avatar }) {
  return (
    <Header className={styles.header}>
      <div className={styles.logo}>ProdDist</div>
      <Menu
        selectedKeys={[location.pathname]}
        mode="horizontal"
        theme="dark"
        className={styles.menu}>
        <SubMenu
          title={
            <span>
              <Icon type="calculator" />
              自动排活 <Icon type="down" />
            </span>
          }>
          <Menu.Item key="/">
            <Link to="/">
              <Icon type="home" />
              添加任务
            </Link>
          </Menu.Item>
          <Menu.Item key="/task">
            <Link to="/task">
              <Icon type="bars" />
              领取抽检任务
            </Link>
          </Menu.Item>
          <Menu.Item key="/report">
            <Link to="/report">
              <Icon type="area-chart" />
              数据报表
            </Link>
          </Menu.Item>
        </SubMenu>

        <SubMenu
          title={
            <span>
              <Icon type="unlock" />
              异常品处理 <Icon type="down" />
            </span>
          }>
          <Menu.Item key="/addcart">
            <Link to="/addcart">
              <Icon type="exclamation-circle-o" />
              图像核查异常品
            </Link>
          </Menu.Item>
          <Menu.Item key="/multilock">
            <Link to="/multilock">
              <Icon type="lock" />
              批量锁车/解锁/工艺调整
            </Link>
          </Menu.Item>
          <Menu.Item key="/locklist">
            <Link to="/locklist">
              <Icon type="lock" />
              在库产品锁车列表
            </Link>
          </Menu.Item>
        </SubMenu>
        <Menu.Item key="/newproc">
          <Link to="/newproc">
            <Icon type="clock-circle-o" />
            批量产品计划
          </Link>
        </Menu.Item>
        <SubMenu
          title={
            <span>
              <Icon type="eye-o" />
              机检弱项 <Icon type="down" />
            </span>
          }>
          <Menu.Item key="/multiweak">
            <Link to="/multiweak">
              <Icon type="close-circle-o" />
              机台连续废通知
            </Link>
          </Menu.Item>
          <Menu.Item key="/weak">
            <Link to="/weak">
              <Icon type="eye-o" />
              机检弱项录入
            </Link>
          </Menu.Item>
          <Menu.Item key="/weaklist">
            <Link to="/weaklist">
              <Icon type="eye-o" />
              机检弱项报告
            </Link>
          </Menu.Item>
        </SubMenu>
        <Menu.Item key="/seriousimg">
          <Link to="/seriousimg">
            <Icon type="home" />
            严重废锁图
          </Link>
        </Menu.Item>
        <SubMenu
          title={
            <span>
              <Icon type="eye-o" />
              裁封线排产 <Icon type="down" />
            </span>
          }>
          <Menu.Item key="/package">
            <Link to="/package">
              <Icon type="setting" />
              自动排产设置
            </Link>
          </Menu.Item>
          <Menu.Item key="/package_report">
            <Link to="/package_report">
              <Icon type="setting" />
              排产报告
            </Link>
          </Menu.Item>
        </SubMenu>
          <Menu.Item key="/auto_proc">
            <Link to="/auto_proc">
              <Icon type="eye-o" />
              码前自动工艺
            </Link>
          </Menu.Item>
      </Menu>
      <LoginAvatar avatar={avatar} />
    </Header>
  );
}

export default HeaderMenu;
