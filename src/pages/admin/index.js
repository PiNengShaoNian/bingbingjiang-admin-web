import React from 'react'
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import { connect } from 'react-redux'
import { Redirect, Link, Switch, Route } from 'react-router-dom'

import { MENU_CONFIG } from '../../common/js/config'
import AddDish from './components/AddDish'
import EditDish from './components/EditDish'
import Order from './components/Order'
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

class Admin extends React.Component {
  state = {
    collapsed: false,
  };

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  renderMenu = (menuData) => {
    return menuData.map(data => {
      if (data.children) {
        return (
          <SubMenu
            key={data.key}
            title={data.title}
          >
            {this.renderMenu(data.children)}
          </SubMenu>
        )
      }
      else {
        return (
          <Menu.Item key={data.key}>
            <Link to={data.key}>{data.title}</Link>
          </Menu.Item>
        )
      }
    })
  }

  render() {
    const { loginStatus } = this.props

    if (!loginStatus) {
      return <Redirect to='/login' />
    }

    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            {this.renderMenu(MENU_CONFIG)}
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Bill</Breadcrumb.Item>
            </Breadcrumb>
            <Switch>
              <Route path='/dishes/add' component={AddDish} />
              <Route path='/dishes/edit' component={EditDish} />
              <Route path='/order' component={Order} />
            </Switch>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
      </Layout>
    );
  }
}

export default connect(
  (({ loginStatus }) => ({
    loginStatus
  })),
  null
)(Admin)