import { BASE_URL as baseURL } from './config'
import axios from 'axios'

export const getOrders = (query) => {
    return axios
        .get('/order/list', {
            params: {
                ...query
            },
            baseURL
        })
        .then(res => {
            return res.data
        })
}

export const confirmOrder = ({ _id }) => {
    return axios
        .get('/order/confirm', {
            params: { id: _id },
            baseURL
        })
        .then(res => {
            return res.data
        })
}