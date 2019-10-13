import React from 'react'
import {
  Icon,
  Upload,
  Modal,
  Card,
  Input,
  InputNumber,
  Button,
  Select,
  message
} from 'antd'
import { BASE_URL } from '../../../../api/config'
import { removeUploadedImage, uploadDish } from '../../../../api/dish'
import { getCategories, deleteCategory, addCategory } from '../../../../api/category'
import './index.less'

const { Option } = Select
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class AddDish extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
    price: 0,
    timestamp: Date.now(),
    currentUploadFileUid: '',
    fileExtension: '',
    name: '',
    desc: '',
    category: '',
    categories: [],
    isEditing: false
  };

  showOrHide = {
    show: {
      display: 'block'
    },
    hide: {
      display: 'none'
    }
  }

  handleCancel = () => this.setState({ previewVisible: false });

  componentDidMount() {
    getCategories()
      .then(res => {
        if (res.data.list) {
          this.setState({
            categories: res.data.list,
            category: res.data.list[0].title || ''
          })
        }
      })
  }

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      editCategoriesModalVisible: false
    });
  };

  handlePriceChange = (price) => {
    this.setState({
      price
    })
  }

  handleChange = ({ fileList }) => this.setState({ fileList });

  handleUploadRemove = (file) => {
    removeUploadedImage(file).then(res => {

    })
  }

  handleEditCategoriesClick = () => {
    this.setState({
      editCategoriesModalVisible: true
    })
  }

  resetState = () => {
    this.setState({
      fileList: [],
      price: 0,
      timestamp: Date.now(),
      currentUploadFileUid: '',
      fileExtension: '',
      name: '',
      desc: '',
    })
  }

  handleBeforeUpload = (file) => {
    const { timestamp } = this.state
    const uid = timestamp + '-' + Math.random().toString(36).slice(2)
    file.uid = uid
    this.setState({
      currentUploadFileUid: uid,
    })
  }

  handleUploadDishClick = () => {
    const { price, name, desc, timestamp, category } = this.state

    uploadDish(price, name, desc, timestamp, category)
      .then(res => {
        if (res.code === 0) {
          message.success('上传成功')
          this.resetState()
        }
      })
  }

  handleEditCategoriesCancel = () => {
    this.setState({
      editCategoriesModalVisible: false
    })
  }

  handleInputChange = (e, type) => {
    const { target } = e

    if (type === 'category') {
      this.setState({
        [type]: e
      })
      return
    }

    this.setState({
      [type]: target.value //select组件不传入event
    })
  }

  handleDeleteCategoryClick = (category) => {
    deleteCategory(category)
      .then(res => {
        if (res.code === 0) {
          const nextCategories = this.state.categories.filter(v => v.title !== category.title)
          this.setState({
            categories: nextCategories,
            category: nextCategories[0].title
          })
        }
      })
  }

  handleAddCategoryInputBlur = (e) => {
    const category = e.target.value
    this.setState({
      isEditing: false
    })

    const isExist = this.state.categories.some(v => {
      return v.title === category
    })
    if(isExist || !category) return

    addCategory({ title: category })
      .then(res => {
        if (res.code === 0) {
          
          const nextCategories = this.state.categories.concat()
          nextCategories.push({
            title: category
          })

          this.setState({
            categories: nextCategories
          })
        }
      })
  }

  handleAddCategoryKeyDown = (e) => {
    if (e.keyCode === 13) {
      // display none自带 blur效果
      this.setState({
        isEditing: false
      })
    }
  }

  render() {
    const {
      previewVisible,
      previewImage,
      fileList,
      price,
      currentUploadFileUid,
      fileExtension,
      categories,
      category,
      desc,
      name,
      editCategoriesModalVisible,
      isEditing
    } = this.state;

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="add-dish">
        <Card title="上传图片" bordered={true} >
          <Upload
            action={`${BASE_URL}/dish/upload/image`}
            listType="picture-card"
            fileList={fileList}
            onPreview={this.handlePreview}
            onChange={this.handleChange}
            onRemove={this.handleUploadRemove}
            data={{ currentUploadFileUid, fileExtension }}
            beforeUpload={this.handleBeforeUpload}
          >
            {fileList.length >= 8 ? null : uploadButton}
          </Upload>
          <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </Card>
        <div className='name-price-wrapper'>
          <span>名称: </span>
          <Input
            size='large'
            placeholder='请输入名称'
            onChange={(e) => this.handleInputChange(e, 'name')}
            style={{ width: 300 }}
            value={name}
          />
          <span>价格: </span>
          <InputNumber
            size="large"
            min={1}
            max={100000}
            value={price}
            defaultValue={3}
            onChange={this.handlePriceChange}
          />
        </div>
        <div className='desc-wrapper'>
          <span>分类: </span>
          <Select
            value={category}
            style={{ width: 180 }}
            onChange={(e) => this.handleInputChange(e, 'category')}
            size='large'
          >
            {categories.map(category => (
              <Option key={category.title} value={category.title}>
                {category.title}
              </Option>
            ))}
          </Select>
          <span style={{ marginLeft: 10 }} onClick={this.handleEditCategoriesClick}><a >分类编辑</a></span>
          <Modal
            visible={editCategoriesModalVisible} footer={null} onCancel={this.handleEditCategoriesCancel}
          >
            <div className='edit-categories-modal'>
              <div className='categories'>
                {categories.map(v => (
                  <div className='category-item' key={v.title}>
                    {v.title}
                    <div className='delete-arrow' onClick={() => this.handleDeleteCategoryClick(v)}>
                      <Icon type="close" />
                    </div>
                  </div>
                ))}
                <div
                  className='add-category'
                  style={isEditing ? this.showOrHide['hide'] : this.showOrHide['show']}
                  onClick={() => {
                    this.addCategoryInputRef.value = ''
                    this.setState({
                      isEditing: true
                    })
                    setTimeout(() => {
                      this.addCategoryInputRef.focus()
                    })
                  }}>+</div>
                <input
                  type='text'
                  className='add-category-input'
                  ref={(ref) => { this.addCategoryInputRef = ref }}
                  style={isEditing ? this.showOrHide['show'] : this.showOrHide['hide']}
                  onBlur={this.handleAddCategoryInputBlur}
                  onKeyDown={this.handleAddCategoryKeyDown}
                />
              </div>
            </div>
          </Modal>
        </div>
        <div className='desc-wrapper'>
          <span>描述: </span>
          <Input.TextArea
            rows={4}
            size='large'
            placeholder='请输入描述'
            style={{ width: 400 }}
            value={desc}
            onChange={(e) => this.handleInputChange(e, 'desc')}
          />
        </div>
        <Button type='primary' onClick={this.handleUploadDishClick} size='large'>提交</Button>
      </div>
    );
  }
}