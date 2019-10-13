import React from 'react'
import { Input, Button, Checkbox, Icon } from 'antd'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { setLoginStatus as _setLoginStatus } from '../../action/index'
import { login } from '../../api/login'
import { storage } from '../../common/js/utils'
import './index.less'

class Login extends React.Component {
  handleLoginBtnClick = () => {
    const { user, password } = this.state
    login(user, password)
      .then(({ code, data }) => {
        if (code === 0) {
          storage.set('user', data.user)
          this.props.setLoginStatus(true)
        }
      })
  }

  state = {
    user: '',
    password: ''
  }

  handleInputChange = (e, type) => {
    const { target } = e
    if (type === 'user') {
      this.setState({
        user: target.value
      })
    }
    else {
      this.setState({
        password: target.value
      })
    }
  }

  render() {
    const { user, password } = this.state
    const { loginStatus } = this.props

    if (loginStatus) {
      return <Redirect to='/' />
    }

    return (
      <div className='login'>
        <div className='form-wrapper'>
          <Input
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Username"
            onChange={(e) => this.handleInputChange(e, 'user')}
            size='large'
            value={user}
          />
          <Input
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            type="password"
            placeholder="Password"
            size='large'
            onChange={(e) => this.handleInputChange(e, 'password')}
            style={{
              margin: '10px 0'
            }}
            value={password}
          />
          <Checkbox style={{
            margin: '10px 0'
          }}>记住密码</Checkbox>
          <Button type='primary' size='large' onClick={this.handleLoginBtnClick}>登录</Button>
        </div>
      </div>
    )
  }
}

export default connect(
  ({ loginStatus }) => ({
    loginStatus
  }),
  (dispatch) => ({
    setLoginStatus(status) {
      dispatch(_setLoginStatus(status))
    }
  })
)(Login)