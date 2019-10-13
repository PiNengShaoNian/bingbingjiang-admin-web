import { BASE_URL as baseURL } from './config'
import axios from 'axios'

export const removeUploadedImage = (file) => {
    return axios
        .get('/dish/upload/remove', {
            params: {
                fileUid: file.uid,
                fileExtension: file.name.match(/.+(\.\w+)$/)[1]
            },
            baseURL
        })
        .then(res => {
            return res.data
        })
}

export const uploadDish = (price, name, desc, timestamp, category) => {
    return axios
        .post('/dish/upload/dish', {
            price, name, desc, timestamp, category
        }, {
            baseURL
        })
        .then(res => {
            return res.data
        })
}

export const getDishes = () => {
    return axios
        .get('/dish/list', {
            baseURL
        })
        .then(res => {
            return res.data
        })
}

export const deleteDish = (name, category, imgUrls) => {
    return axios
        .post('/dish/deleteone', {
            name, category, imgUrls
        }, {
            baseURL
        })
        .then(res => {
            return res.data
        })
}

export const updateDish = ({
    name,
    category,
    price,
    imgUrls,
    desc,
    desertedImages,
    _id
}) => {
    return axios.post('/dish/update', {
        name,
        category,
        imgUrls,
        desertedImages,
        price,
        desc,
        _id
    }, {
        baseURL
    })
        .then(res => {
            return res.data
        })
}