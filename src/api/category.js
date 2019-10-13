import { BASE_URL as baseURL } from './config'
import axios from 'axios'

export const getCategories = () => {
    return axios.get('/category/list', {
        baseURL
    })
    .then(res => {
        return res.data
    })
} 

export const deleteCategory = ({title}) => {
    return axios.get('/category/delete', {
        params: {
            title
        },
        baseURL
    })
    .then(res => {
        return res.data
    })
}

export const addCategory = ({title}) => {
    return axios.get('/category/add', {
        params: {
            title
        },
        baseURL
    })
    .then(res => {
        return res.data
    })
}