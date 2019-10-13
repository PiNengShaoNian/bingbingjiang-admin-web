import React from 'react'
import { getOrders, confirmOrder } from '../../../../api/order'
import { BASE_URL } from '../../../../api/config'
import './index.less'
import { Button } from 'antd'

export default class Order extends React.Component {

  state = {
    orders: []
  }

  componentDidMount() {
    this._getOrders(0)
  }

  _getOrders = (status) => {
    getOrders({ status })
      .then(res => {
        if (res.code === 0) {
          this.setState({
            orders: res.data.list
          })
        }
      })
  }

  handleConfirmOrderClick = (order) => {
    confirmOrder(order)
      .then(res => {
        if (res.code === 0) {
          const nextOrders = this.state.orders.filter(v => (v._id !== order))
          this.setState({
            orders: nextOrders
          })
        }
      })
  }

  render() {
    const { orders } = this.state
    return (<div className='order-page'>
      <div className='order-btns'>
        <Button type='primary' onClick={() => this._getOrders(1)} style={{ marginRight: 20 }}>已确认订单</Button>
        <Button onClick={() => { this._getOrders(0) }}>待确认订单</Button>
      </div>
      <div className='orders'>
        {orders.map(order => (
          <div className='order-item' key={order._id}>
            {order.dishes.map(dish => (
              <div className='order-dish' key={dish._id}>
                <div className='order-dish-img-wrapper'>
                  <img src={`${BASE_URL}/${dish.imgUrls[0]}`} alt='' />
                </div>
                <div className='dish-overview'>
                  <div className='name'><span>名称: </span><span>{dish.name}</span></div>
                  <div className='name'><span>价格: </span><span>{dish.price}</span></div>
                  <div className='name'><span>数量: </span><span>{dish.count}</span></div>
                  <div className='name'><span>分类: </span><span>{dish.category}</span></div>
                </div>
              </div>
            ))}
            <div className='order-overview'>
              <div><span>菜品数量：</span><span>共{order.count}件菜品</span></div>
              <div><span>下单时间：</span><span>{new Date(order.date).toLocaleString()}</span></div>
              <div><span>总计：</span><span>￥{order.sum}</span></div>
              <Button style={{
                display: order.status === 0 ? 'block' : 'none'
              }} type='primary' onClick={() => this.handleConfirmOrderClick(order)}>确认</Button>
            </div>
          </div>
        ))}
      </div>
    </div>)
  }
}