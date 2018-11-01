<!-- 大盘异动 -->
<template>
 <div class="transaction">
   <SSInfoTitle :ssdata = 'sstoday' v-if="sstoday.length"></SSInfoTitle>
   <ul class="transaction-chart-tab">
     <li :class="active === index ? 'active' : ''" @click="switchTab(item.keyword,index)" v-for="(item,index) in  tabList" :key="index">{{item.name}}</li>
   </ul>
   <MinLine v-if="active == 0"></MinLine>
   <KLineDay v-if="isklineactive()" :klineapi = "klineapi" :type ="keyword"></KLineDay>
   <div class="transaction-bgline"></div>
    <ul class="transaction-option-tab">
      <li :class="optionActive === index ? 'active' : ''"  @click="optionActive = index" v-for="(item,index) in  optionTabList" :key="index">{{item}}</li>
    </ul>
    <TransactionList v-if="optionActive == 0"></TransactionList>
 </div>
</template>
<style lang='scss' scoped>
.transaction{
  &-chart-tab{
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 10px 0;
    li{
      font-size: 28px;
      line-height: 50px;
      color:#808080;
      border-bottom: 2px solid transparent;
      &.active{
        color:#333333;
        border-bottom-color: #e6394d;
      }
    }
  }
  &-bgline{
    margin-top: 2px;
    height: 8px;
    background-color: #fafaf7;
  }
  &-option-tab{
    display: flex;
    align-items: center;
    justify-content: flex-start;
    box-shadow: 1px 0 1px #f1f1f1;
    // padding: 10px 0;
    li{
      margin: 0 38px;
      font-size: 28px;
      line-height: 68px;
      color:#808080;
      border-bottom: 2px solid transparent;
      &.active{
        color:#333333;
        border-bottom-color: #e6394d;
      }
    }
  }
}
</style>

<script>
import MinLine from '@/components/line/MinLine'
import KLineDay from '@/components/line/KLineDay'
import SSInfoTitle from './SSInfoTitle'
import TransactionList from '@/components/transactionList/transactionList'
import {getSSToday, getSSKlineDay, getSSKlineWeek, getSSKlineMonth, getSSKline5Min, getSSKline15Min, getSSKline30Min, getSSKline60Min} from '@/service/stocksApi'
export default {
  data () {
    return {
      tabList: [
        {name: '分时', keyword: 'min'},
        // {name: '五日', keyword: '5day'},
        {name: '日K', keyword: 'day'},
        {name: '周K', keyword: 'week'},
        {name: '月K', keyword: 'month'},
        {name: '5分', keyword: '5min'},
        {name: '15分', keyword: '15min'},
        {name: '30分', keyword: '30min'},
        {name: '60分', keyword: '60min'}
      ],
      optionTabList: [
        '大盘异动', '个股异动'
      ],
      klinemap: {
        'day': getSSKlineDay,
        'week': getSSKlineWeek,
        'month': getSSKlineMonth,
        '5min': getSSKline5Min,
        '15min': getSSKline15Min,
        '30min': getSSKline30Min,
        '60min': getSSKline60Min
      },
      active: 0,
      optionActive: 0,
      keyword: '',
      klineapi: '',
      sstoday: []
    };
  },

  created() {
    getSSToday().then(
      res => {
        this.sstoday = res.data.snapshot['000001.SS']
      }
    )
  },

  mounted() {},

  methods: {
    switchTab(keyword, index) {
      this.active = index
      this.keyword = keyword
      if (this.isklineactive()) {
        this.klineapi = this.klinemap[keyword]
      }
    },
    isklineactive() {
      return this.klinemap.hasOwnProperty(this.keyword)
    }
  },

  computed: {},

  components: {MinLine, KLineDay, SSInfoTitle, TransactionList}

}
</script>
