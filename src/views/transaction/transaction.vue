<!-- 大盘异动 -->
<template>
 <div class="transaction">
   <ul class="tab">
     <li :class="active === index ? 'active' : ''" @click="active = index" v-for="(item,index) in  tabList" :key="index">{{item}}</li>
   </ul>
   <MinLine v-if="active == 0"></MinLine>
   <KLineDay v-if="active == 2"></KLineDay>
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
export default {
  data () {
    return {
      tabList: ['分时', '五日', '日K', '周K', '月K', '5分', '15分', '30分'],
      active: 2
    };
  },

  created() {},

  mounted() {},

  methods: {},

  computed: {},

  components: {MinLine, KLineDay}

}
</script>
