import axios from 'axios'
import { BASE_URL as baseURL } from './config'

export const login = (user, password) => {
    return axios.post('/login', {
        user,
        password
    }, {
        baseURL
    })
        .then(res => {
            return res.data
        })
}