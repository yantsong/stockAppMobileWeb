<template>
<div >
    <div class="plate-item" @click="_redirect">
        <dl>
            <dt>
                <div class="title">
                    <span :class="index>2?'gray':''">{{index + 1}}</span>
                    <h3>{{info.title}}</h3>
                </div>
                <div class="time">
                    {{info.featured_msg_created_at * 1000 | formatTime}}
                </div>
            </dt>
            <dd v-if="info && info.featured_msg_title" class="plate-item-desc" v-html="info.featured_msg_title"></dd>
        </dl>
        <div class="plate-item-stocks" v-if="info && info.featured_msg_stocks">
            <stock-trend
                :stocks="info.featured_msg_stocks"
                :stocks-pool="stocksPool"
                :fields="fields">
            </stock-trend>
        </div>
    </div>
        <div class="plate-item-line"></div>
    </div>
</template>

<script>
import StockTrend from "@/components/stockTrend/StockTrend";
import api from "@/service/stocksApi";
export default {
  props: {
    info: {
      type: Object,
      default: () => {
        return {
          name: "钛白粉",
          time: 1524532976,
          summary: "海内外海内外海内外海内外海内外海内外海内外海内外海内外"
        };
      }
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      fields: [],
      stocksPool: {}
    };
  },
  created() {
    this._getRate();
  },
  methods: {
    _redirect() {
      this.$router.push(`/subjectDetail/${this.info.bkj_id}`);
    },
    //获取涨跌详情
    _getRate() {
      api
        .getStocksReal(this._filterStocks(this.info.featured_msg_stocks))
        .then(res => {
          this.fields = res.data.snapshot.fields;
          this.stocksPool = res.data.snapshot;
        });
    },
    _filterStocks(stocks) {
      let str = stocks.reduce((sum, current) => sum + `${current.symbol},`, "");
      return str.slice(0, -1);
    }
  },
  components: {
    StockTrend
  }
};
</script>
<style lang="scss" scoped>
.plate-item {
  padding: 30px 28px 24px;
  &-line {
    height: 1px;
    background-color: #efefef;
  }
  dt {
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 38px;
    margin-bottom: 16px;
    .title {
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }
    span {
      background-color: #ff4a48;
      text-align: center;
      font-size: 30px;
      margin-right: 5px;
      border-radius: 50%;
      width: 38px;
      display: inline-block;
      color: white;
    }
    span.gray {
      background-color: #7a8399;
    }
    h3 {
      font-size: 38px;
      color: #333333;
    }
    .time {
      color: #c0c0c0c0;
      font-size: 30px;
    }
  }
  &-desc {
    color: #666666;
    font-size: 28px;
    font-family: PingFangSC-Regular;
    line-height: 46px;
    padding-bottom: 16px;
    & > span {
      color: #f34a55;
    }
  }
}
</style>
