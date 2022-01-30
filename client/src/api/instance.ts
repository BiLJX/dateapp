import axios from "axios"

export const URI = "http://localhost:5000"

const instance = axios.create({
    baseURL: URI,
    withCredentials: true,
    headers: {'Access-Control-Allow-Origin': '*'}
})

export default instance
