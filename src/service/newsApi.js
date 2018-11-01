import axios from 'axios'

// const baseURL = process.env.BASE_URL

/**
   * 获取大盘异动
   */
export const getTransactionList = (params = {}) => {
  let defaultParams = {limit: 30, subjids: 35}
  params = Object.assign(params, defaultParams)
  return axios.get(
    `https://api.xuangubao.cn/api/pc/msgs`, {params}
  ).then(res => Promise.resolve(res.data))
}
