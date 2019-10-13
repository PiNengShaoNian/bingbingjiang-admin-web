import React from 'react'
import { getDishes, deleteDish, updateDish } from '../../../../api/dish'
import { getCategories } from '../../../../api/category'
import { BASE_URL } from '../../../../api/config'
import { Carousel, Icon, Tree, Tooltip, Modal } from 'antd'
import './index.less'

const { TreeNode } = Tree
const processDataForTreeComponent = (data) => {
  const treeData = [{ title: '所有菜品', children: [] }]
  data.reduce((accumulator, dish) => {
    let category = accumulator.find(
      category => category.title === dish.category
    )
    if (!category) {
      category = {
        title: dish.category,
        children: []
      }
      accumulator.push(category)
    }
    category.children.push({
      ...dish,
      title: dish.name
    })

    return accumulator

  }, treeData[0].children)
  return treeData
}

const findDishesByTitle = (title, treeData) => {
  if (treeData.title === title) {
    return treeData
  }
  else {
    if (!treeData.children) {
      return
    }
    for (let i = 0; i < treeData.children.length; i++) {
      const result = findDishesByTitle(title, treeData.children[i])
      if (result) return result
    }
  }
}

const getLeafNodes = (treeData, result) => {
  if (treeData.children) {
    for (let i = 0; i < treeData.children.length; i++) {
      getLeafNodes(treeData.children[i], result)
    }
  }
  else {
    result.push(treeData)
  }
}

export default class EditDish extends React.Component {

  state = {
    dishes: [],
    treeData: [],
    editModalVisible: false,
    currentEditDish: {},
    categories: [],
    currentEditDishCategory: ''
  }

  _getDishes = () => {
    const openKeys = new Set()
    getDishes()
      .then(res => {
        if (res.code === 0) {
          const dishes = res.data.list;
          this.originDishes = dishes
          const treeData = processDataForTreeComponent(dishes)
          dishes.map(dish => {
            openKeys.add(dish.category)
          })
          this.setState({
            dishes: dishes,
            treeData: treeData,
            expandedKeys: [...openKeys, '所有菜品']
          })
        }
      })
  }

  componentDidMount() {
    this._getDishes()
    getCategories()
      .then(res => {
        if (res.data.list) {
          this.setState({
            categories: res.data.list
          })
        }
      })
  }

  deletedDishes = []



  handleDeleteDishClick = ({ name, category, imgUrls }) => {
    deleteDish(name, category, imgUrls)
      .then(res => {
        if (res.code === 0) {
          this.deletedDishes.push({
            name,
            category
          })
          const nextDishes = this.originDishes.filter(dish => {
            return this.deletedDishes.every(v => {
              return v.name !== dish.name && v.category !== dish
            })
          })
          
          const treeData = processDataForTreeComponent(nextDishes)

          this.setState({
            dishes: nextDishes,
            treeData
          })
        }
      })
  }

  handleEditDishClick = (dish) => {

    this.setState({
      editModalVisible: true,
      currentEditDish: {
        ...dish
      },
      currentEditDishCategory: dish.category
    })
  }

  handleDeleteDishImageClick = (url) => {
    const { desertedImages = [], imgUrls } = this.state.currentEditDish

    desertedImages.push(url)
    this.setState({
      currentEditDish: {
        ...this.state.currentEditDish,
        imgUrls: imgUrls.filter(v => v !== url),
        desertedImages
      }
    })
  }

  handleEditModalCancelClick = () => {
    this.setState({
      editModalVisible: false
    })
  }

  handleEditModalOkClick = () => {
    const {
      newDescRef: { value: desc },
      newNumRef: { value: price },
      newNameRef: { value: name }
    } = this
    const { desertedImages } = this.state.currentEditDish

    updateDish({
      ...this.state.currentEditDish,
      desc,
      price,
      name,
      desertedImages,
      category: this.state.currentEditDishCategory
    })
      .then(res => {
        if (res.code === 0) {
          this._getDishes()
        }
        this.setState({
          editModalVisible: false
        })
      })
  }

  handleDishSelect = (selectedKeys, info) => {
    console.log(selectedKeys)
    if (!selectedKeys.length) {
      this.setState({
        dishes: this.originDishes
      })
      return
    }
    const result = findDishesByTitle(selectedKeys[0], this.state.treeData[0])
    const nextDishes = []

    getLeafNodes(result, nextDishes)
    this.setState({
      dishes: nextDishes
    })
  };

  renderTreeNodes = (data) => {
    return data.map(node => {
      if (node.children) {
        return (
          <TreeNode title={node.title} key={node.title}>
            {this.renderTreeNodes(node.children)}
          </TreeNode>
        )
      }
      else return (
        <TreeNode title={node.title} key={node.title} />
      )
    })
  }

  render() {
    const {
      dishes,
      treeData,
      expandedKeys,
      currentEditDish,
      categories,
      currentEditDishCategory
    } = this.state

    return (
      <div className='edit-dish'>
        <div className='dishes-overview'>
          <Tree
            showLine
            expandedKeys={expandedKeys}
            onSelect={this.handleDishSelect}
          >
            {this.renderTreeNodes(treeData)}
          </Tree>
        </div>
        <div className='dishes'>
          {dishes.map(dish => (
            <div className='dish' key={dish.name}>
              <Carousel autoplay>
                {dish.imgUrls.map(url => (
                  <div className='image-wrapper' key={url}>
                    <img src={`${BASE_URL}/${url}`} alt='' />
                  </div>
                ))}
              </Carousel>
              <div className='text-area'>
                <div className='dish-name'>
                  <Icon type="tag" style={{ fontSize: 20, color: 'skyblue' }} /> {dish.name}
                </div>
                <div className='fields'>
                  <div><span>分类: </span><span>{dish.category}</span></div>
                  <div><span>价格: </span><span>￥{dish.price}</span></div>
                </div>
                <div className='desc'>
                  <Tooltip placement="topLeft" title={dish.desc} >
                    {dish.desc}
                  </Tooltip>
                </div>
                <div className='icons'>
                  <Tooltip placement="topLeft" title='删除' >
                    <Icon type="delete" onClick={() => this.handleDeleteDishClick(dish)} />
                  </Tooltip>
                  <Tooltip placement="topLeft" title='编辑' >
                    <Icon type="edit" onClick={() => this.handleEditDishClick(dish)} />
                  </Tooltip>
                  <Tooltip placement="topLeft" title='更多' >
                    <Icon type="ellipsis" />
                  </Tooltip>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Modal
          title="修改"
          visible={this.state.editModalVisible}
          onOk={this.handleEditModalOkClick}
          onCancel={this.handleEditModalCancelClick}
          okText="确认"
          cancelText="取消"
        >
          <div className='edit-modal'>
            <div className='images'>
              {(currentEditDish.imgUrls || []).map(url => (
                <div className='image-wrapper' key={url}>
                  <img alt='' src={`${BASE_URL}/${url}`} />
                  <div className='delete-img'>
                    <Icon type="delete" onClick={() => this.handleDeleteDishImageClick(url)} />
                  </div>
                </div>
              ))}
            </div>
            <div className='input-wrapper'>
              <span>新名称: </span><input type='text' ref={(ref) => this.newNameRef = ref} defaultValue={currentEditDish.name} />
            </div>
            <div className='input-wrapper'>
              <span>新描述: </span><textarea type='text' ref={(ref) => this.newDescRef = ref} defaultValue={currentEditDish.desc} />
            </div>
            <div className='input-wrapper'>
              <span>新价格: </span><input type='number' ref={(ref) => this.newNumRef = ref} defaultValue={currentEditDish.price} />
            </div>
            <div className='input-wrapper'>
              <span>新分类: </span>
              <select
                value={currentEditDishCategory}
                onChange={(e) => {
                  const { target } = e
                  this.setState({
                    currentEditDishCategory: target.value
                  })
                }}>
                {categories.map(category => (
                  <option key={category.title} value={category.title}>
                    {category.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}