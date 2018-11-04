<!-- 大盘异动列表 -->
<template>
 <div class="tansactionList">
   <p class="test-line-clamp" test1> 1、2日，受消息刺激，两市大幅高开，创业板大涨3%重新站上三十日线，随即两市高位盘整，短线获利资金小幅出逃，但大盘承接力度较好，总体题材概念活跃，个股普涨，午后市场持续走高，银行、保险再度发力，题材概念也持续拉升，5G、半导体走强，创业板大涨4%，两市做多氛围高涨，市场涨停家数超50只，临近尾盘，多头持续发力，创业板暴涨近5%。截止收盘沪指涨2.70%，深成指涨3.96%，创业板指涨4.82%。
2、板块概念方面，民航、有色钴板块领涨，暂无板块领跌。
3、两市共3388只个股上涨，84只个股涨停，除新股外涨停82只，78只个股下跌，7只个股跌停，27只股票炸板，炸板率25%。
4、沪股通今日流入113亿，深股通流入66亿。
图来自选股宝打板神器（http://xuangubao.cn/ban/1）</p>
   <p class="test-line-clamp2" test2> 1、2日，受消息刺激，两市大幅高开，创业板大涨3%重新站上三十日线，随即两市高位盘整，短线获利资金小幅出逃，但大盘承接力度较好，总体题材概念活跃，个股普涨，午后市场持续走高，银行、保险再度发力，题材概念也持续拉升，5G、半导体走强，创业板大涨4%，两市做多氛围高涨，市场涨停家数超50只，临近尾盘，多头持续发力，创业板暴涨近5%。截止收盘沪指涨2.70%，深成指涨3.96%，创业板指涨4.82%。
2、板块概念方面，民航、有色钴板块领涨，暂无板块领跌。
3、两市共3388只个股上涨，84只个股涨停，除新股外涨停82只，78只个股下跌，7只个股跌停，27只股票炸板，炸板率25%。
4、沪股通今日流入113亿，深股通流入66亿。
图来自选股宝打板神器（http://xuangubao.cn/ban/1）</p>

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
.test-line-clamp2{
  max-height: 120px;
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 24px;
    font-size: 15px;
    position: relative;
    top: 0;
    border: none;
    word-break: break-word;
}
.test-line-clamp {
   min-width: 1;
    overflow : hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    word-break: break-all; /* 追加这一行代码 */
      }
.tansactionList{
    margin: 0 20px;
    border-left: 1px dashed #e5e5e6;
}
</style>
