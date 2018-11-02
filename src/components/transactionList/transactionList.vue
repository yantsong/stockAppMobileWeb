<!-- 大盘异动列表 -->
<template>
 <div class="tansactionList">
     <MsgListItem v-for="item in msgArr" :key="item.Id" :msg = "item"></MsgListItem>
 </div>
</template>

<script>
import {
  getScrollTop,
  getScrollHeight,
  getWindowHeight
} from '@/utils/domHeight'
import {getTransactionList} from '@/service/newsApi'
import MsgListItem from './msgListItem'
export default {
  data () {
    return {
      msgArr: [],
      headMark: null,
      tailMark: null,
      msgIdMark: null,
      parmasDefault: {
        limit: 30,
        subjids: 35
      },
      timer: null,
      loading: false
    };
  },

  created() {
    this.getlist()
    // 定时任务 S
    this.setTaskInterval(30)
  },

  mounted() {
    setTimeout(() => {
      window.addEventListener('scroll', this.handleScroll)
    }, 200)
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll)
  },

  methods: {
    // 定时任务
    setTaskInterval(n) {
      clearInterval(this.timer)
      this.timer = setInterval(
        this.refreshData, n * 1000
      )
    },
    // 获取数据
    getlist() {
      this.loading = true
      let parmas = {
        tailMark: this.tailMark,
        msgIdMark: this.msgIdMark
      }
      getTransactionList(parmas).then(
        res => {
          this.msgArr = [...this.msgArr, ...res.NewMsgs]
          !this.headMark && (this.headMark = res.HeadMark)
          this.tailMark = res.TailMark
          this.msgIdMark = res.TailMsgId
          this.loading = false
        }
      )
    },
    refreshData() {
      let parmas = {
        headMark: this.headMark
      }
      getTransactionList(parmas).then(
        res => {
          let temp = [];
          if (res.NewMsgs && res.NewMsgs.length) {
          // 避免重复
            res.NewMsgs.map(n => {
              if (
                !this.msgArr.some(m => {
                  return m.Id === n.Id;
                })
              ) {
                temp.push(n);
              }
            });
            // 加在之前
            this.msgArr = [...temp, ...this.msgArr];
          }
          // 替换headMark
          if (res.HeadMark !== "0") {
            this.headMark = res.HeadMark;
          }
        }
      )
    },
    // 滚动事件
    handleScroll () {
      if (getScrollTop() + getWindowHeight() >= getScrollHeight() - 10) {
        this.getlist()
      }
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
