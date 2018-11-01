<!-- transaction msg list item -->
<template>
 <div class="msg-list-item">
    <div class="msg-list-item-time">
        <span class="msg-list-item-time-dot">
            <i></i>
            <em></em>
            <b></b>
        </span>
        <span class="msg-list-item-time-text">{{createdTime}}</span>
        <span v-if="bkjInfo.length" class="msg-list-item-time-bkjif">{{bkjInfo[0].Name}}</span>
        <span v-if="bkjInfo.length" class="msg-list-item-time-bkjrt" :class="colorName(bkjInfo[0].Rate)">{{bkjInfo[0].Rate&&(bkjInfo[0].Rate>0?`+${bkjInfo[0].Rate}`:bkjInfo[0].Rate)}}%</span>
    </div>
    <div class="msg-list-item-title">
        {{msg.Title}}
    </div>
    <div class="msg-list-item-summary" v-if="msg.Summary">
        {{msg.Summary}}
    </div>
    <img @click="showImage(msg.Image)" :data-src="msg.Image" :ref="`image`" class="msg-list-item-summary-img " v-if="msg && msg.Image" :src="msg.Image" alt="" />
    <StockTrend v-if="stocks" :stocks = "stocks" :stocksPool = "stocksPool" :fields="fields" class="msg-list-item-stock"></StockTrend>

 </div>
</template>
<style lang='scss' scoped>
$red:#e22e42;
$green:#4da370;
.msg-list-item{
    padding: 0 16px;
    &-time{
        display: flex;
        height: 92px;
        align-items: center;
        justify-content: flex-start;
        &-dot{
            margin-left: -24px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            height: 20px;
            line-height: 20px;
            vertical-align: middle;;
            i{
                display: inline-block;
                width: 16px;
                height: 16px;
                background-color: #fff;
                border: 4px solid $red;
                border-radius: 50%;
            }
            em{
                width: 20px;
                height: 2px;
                background-color: $red;
            }
            b{
                width: 14px;
                height: 14px;
                border-radius: 50%;
                background-color: $red;
            }
        }
        &-text{
            font-weight: 500;
            margin-left: 24px;
            font-size: 22px;
            color:#808080;
        }
        &-bkjif{
            margin: 0 26px 0 16px;
            font-size: 36px;
            font-weight: 500;
            color: #333;
        }
        &-bkjrt{
            padding: 6px 6px;
            color:#fff;
            font-weight: 500;
            font-size: 30px;
            border-radius: 8px;
            &.color-red{
                background-color:$red;
            }
            &.color-green{
                background-color:$green;
            }
        }
    }
    &-title{
        line-height: 40px;
        font-size: 28px;
        color:#333
    }
    &-summary{
        padding: 36px 0 30px;
        font-size: 26px;
        color:#828282;
        &-img{
            // margin-left: 10%;
            max-width: 80%;
        }
    }
    &-stock{
        padding: 24px 0 10px;
    }
}
</style>
<script>
// import {
//   extractSymbolToParams
//   formatDataByFields,
//   versions
// } from '@/utils/index'
import format from "date-fns/format";
import stockApi from '@/service/stocksApi'
import StockTrend from '@/components/stockTrend/StockTrend'

export default {
  data () {
    return {
      bkjInfo: this.msg.BkjInfoArr,
      stocksPool: {},
      fields: []
    };
  },
  props: {
    msg: {
      type: Object
    }
  },

  created() {
    this.bkjInfo.length && this.getbkjrate()
    this.stocks && this.getStockRate(this.stocks)
  },

  mounted() {

  },

  methods: {
    getbkjrate() {
      let bkjId = this.bkjInfo[0].Id
      stockApi.getPlatNormalInfo(bkjId).then(
        res => {
          if (res.code === 20000) {
            this.bkjInfo[0].Rate = res.data.core_pcp
            console.log(this.stocks);
          }
        }
      )
    },
    getStockRate(stocks) {
      let parmas = stocks.reduce(
        (s, i) => {
          return (s += `,${i.symbol}`)
        }, ''
      )
      parmas = parmas.slice(1)
      stockApi.getStocksReal(parmas).then(
        res => {
          this.stocksPool = res.data.snapshot
          this.fields = res.data.snapshot.fields
        }
      )
    },
    colorName (rate) {
      if (rate > 0) {
        return 'color-red'
      } else {
        return 'color-green'
      }
    }
  },

  computed: {
    createdTime() {
      return format(new Date(this.msg.CreatedAt), "HH:mm");
    },
    stocks() {
      return this.msg.Stocks && this.msg.Stocks.map(
        i => {
          i.name = i.Name
          i.symbol = i.Symbol
          delete i.Name
          delete i.Symbol
          return i
        }
      )
    }
  },

  components: {StockTrend},
  watch: {
  }

}
</script>
