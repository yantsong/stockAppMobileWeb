import Vue from 'vue'
import Router from 'vue-router'

const SubjectDetail = () => import('@/views/subject/SubjectDetail')
const Attention = () => import('@/views/attention/attention')
const StockListView = () => import('@/views/stockListView/StockListView')
const InfoDetail = () => import('@/views/infoDetail/InfoDetail')
const RelatedFunds = () => import('@/views/relatedFunds/relatedFunds')

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/',
  routes: [
    {
      path: '/subjectDetail/:id',
      name: 'SubjectDetail',
      component: SubjectDetail
    },
    {
      path: '/attention',
      name: 'Attention',
      component: Attention
    },
    {
      path: '/relatedFunds/:id',
      name: 'RelatedFunds',
      component: RelatedFunds
    },
    {
      path: '/stockList/:id',
      name: 'StockListView',
      component: StockListView
    },
    {
      path: '/infoDetail/:id',
      name: 'InfoDetail',
      component: InfoDetail
    }
  ]
})
