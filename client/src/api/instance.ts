import axios from "axios"

export const URI = ""

const instance = axios.create({
    baseURL: URI,
    withCredentials: true,
    headers: {'Access-Control-Allow-Origin': '*'}
})

export default instance
