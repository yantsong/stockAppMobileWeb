<!-- 大盘异动列表 -->
<template>
 <div class="tansactionList">
     <MsgListItem v-for="item in msgArr" :key="item.Id" :msg = "item"></MsgListItem>
 </div>
</template>

<script>
import {getTransactionList} from '@/service/newsApi'
import MsgListItem from './msgListItem'
export default {
  data () {
    return {
      msgArr: [],
      parmas: {},
      headMark: '',
      tailMark: ''
    };
  },

  created() {
    this.getlist()
  },

  mounted() {},

  methods: {
    getlist() {
      getTransactionList().then(
        res => {
          this.msgArr = res.NewMsgs
          this.headMark = res.HeadMark
          this.tailMark = res.TailMark
        }
      )
    }
  },

  computed: {},

  components: {MsgListItem}

}
</script>
<style lang='scss' scoped>
.tansactionList{
    margin: 0 20px;
    border-left: 1px dashed #e5e5e6;
}
</style>
