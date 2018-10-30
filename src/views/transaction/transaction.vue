<!-- 大盘异动 -->
<template>
 <div class="transaction">
   <SSInfoTitle :ssdata = 'sstoday' v-if="sstoday.length"></SSInfoTitle>
   <ul class="tab">
     <li :class="active === index ? 'active' : ''" @click="active = index" v-for="(item,index) in  tabList" :key="index">{{item}}</li>
   </ul>
   <MinLine v-if="active == 0"></MinLine>
   <KLineDay v-if="active == 2" :klineapi = "getSSKlineDay"></KLineDay>
   <KLineDay v-if="active == 3" :klineapi = "getSSKlineWeek"></KLineDay>
   <KLineDay v-if="active == 4" :klineapi = "getSSKlineMonth"></KLineDay>
 </div>
</template>
<style lang='scss' scoped>
.transaction{
  .tab{
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
}
</style>

<script>
import MinLine from '@/components/line/MinLine'
import KLineDay from '@/components/line/KLineDay'
import SSInfoTitle from './SSINfoTitle'
import {getSSToday, getSSKlineDay, getSSKlineWeek, getSSKlineMonth} from '@/service/stocksApi'
export default {
  data () {
    return {
      tabList: ['分时', '五日', '日K', '周K', '月K', '5分', '15分', '30分'],
      active: 4,
      sstoday: [],
      getSSKlineDay,
      getSSKlineWeek,
      getSSKlineMonth
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

  methods: {},

  computed: {},

  components: {MinLine, KLineDay, SSInfoTitle}

}
</script>
