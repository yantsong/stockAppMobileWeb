import axios from 'axios'

const baseURL = process.env.BASE_URL

export default {
  /**
   * 获取板块及龙头
   */
  getLongtou: bkjId => {
    return axios.get(
      `https://baoer-api-prod.xuangubao.cn/api/v2/plate/${bkjId}/longtou`
    ).then(res => Promise.resolve(res.data))
  },

  /**
   * 获取板块股票
   */
  getBanKuaiStocksPool: bkjId => {
    return axios.get(
      `https://baoer-api-prod.xuangubao.cn/api/v2/plate/${bkjId}/stocks`
    ).then(res => Promise.resolve(res.data))
  },
  // 获取基金池
  getFundList: (id) => {
    return axios.get(
      `https://wows-api-sit.wallstreetcn.com/v3/aioria/sset/funds?id=${id}&minstar=1`
    ).then(
      res => Promise.resolve(res.data)
    )
  },
  /**
   * 返回实时股价
   */
  getStocksReal: stocks => {
    return axios.get(
      `https://wows-api.wallstreetcn.com/real?fields=prod_name,px_change,last_px,px_change_rate,trade_status,circulation_value,pe_rate,market_value,turnover_ratio&en_prod_code=${stocks}`
    ).then(res => Promise.resolve(res.data))
  },

  /**
   * 返回当天资金流向
   */
  getFundFlow: stocks => {
    return axios.get(
      `https://wows-api.wallstreetcn.com/v3/gildata/stock/live/fund/flow/days?codes=${stocks}&day_count=1`
    ).then(res => Promise.resolve(res.data))
  },

  /**
  * 获取板块涨跌幅
  */
  getPlatNormalInfo: id => {
    return axios.get(
      `https://wows-api.wallstreetcn.com/v3/aioria/plates/detail?id=${id}`
    ).then(res => Promise.resolve(res.data))
  },

  /**
   * 返回主题详情
   */
  getSubjectInfo: (id, flag = false) => {
    return axios.get(
      `${baseURL}/guoyuan/subjects/${id}?nomsg=${flag}`
    ).then(res => Promise.resolve(res.data))
  },

  /**
   * 资讯详情
   */
  getMsgDetail: id => {
    return axios.get(
      `${baseURL}/guoyuan/messages/${id}`
    ).then(res => Promise.resolve(res.data))
  },

  /**
   * 加载更多资讯
   */
  getMoreMsgs: (bkjId, page, limit) => {
    return axios.get(
      `${baseURL}/guoyuan/subjects/${bkjId}/messages?page=${page}&limit=${limit}`
    ).then(res => Promise.resolve(res.data))
  }
}
