<!-- 5日 -->
<template>
 <div>
     <div id="klineday1"></div>
 </div>
</template>
<style lang='scss' scoped>
#klineday1{
    width: 100vw;
    height: 72vw;
}
</style>

<script>
import {getSSKlineDay} from '@/service/stocksApi'
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/line')
require('echarts/lib/chart/candlestick')
require('echarts/lib/chart/bar')
require('echarts/lib/component/markLine')
require('echarts/lib/component/dataZoom')
let myChart
const dataCount = 69
const total = 256

// const seriesLineColor = ['#3165c3', '#a5a5a5', '#38b6fc'];

export default {
  data () {
    return {
      minData: '',
      pre_px: 0,
      dataKLineX: [],
      dataKLineY: [],
      dataBarX: [],
      dataBarY: [],
      datalinePre: [],
      difference: 0,
      rate: '',
      max: '',
      min: ''
    }
  },

  created() {
    this.getData()
  },

  mounted() {
    myChart = echarts.init(document.getElementById('klineday1'))
    // console.log(myChart);
    // this.getData().then()
  },
  watch: {
    minData: function() {
    //   this.computeMaxMin()
      this.computedataLineXY()
    },
    // eslint-disable-next-line
    dataKLineY: function(){
      this.empdata()
    }
  },

  methods: {
    getData() {
      return getSSKlineDay().then(
        res => {
          console.log(res.data.candle['000001.SS']);
          //   this.pre_px = Number(res.data.real.pre_close_px.toFixed(2))
          // this.minData = res.data.candle['000001.SS'].splice(-dataCount)
          this.minData = res.data.candle['000001.SS']
          return Promise.resolve(res.data.candle['000001.SS'])
        }
      )
    },
    computeMaxMin() {
      let min, max, difference
      let sortarr = Array.from(this.minData)
      sortarr.sort(
        (a, b) => {
          return a[1] - b[1]
        }
      )
      min = sortarr[0][1]
      max = sortarr[sortarr.length - 1][1]

      difference = Math.max(max - this.pre_px, this.pre_px - min
      )
      if (difference >= this.difference) {
        this.max = (this.pre_px + difference).toFixed(2)
        this.min = this.pre_px - difference
        this.rate = (((this.max / this.pre_px) - 1) * 100).toFixed(2) + '%'
        this.difference = difference
      }
    },
    computedataLineXY() {
    //   let initnumber = 0
    //   let colorNumber = 0
      let minData = this.minData
      let dataKLineX = []
      let dataKLineY = []
      //   let dataBarY = []
      //   let datalinePre = []
      minData.forEach(
        (item, index) => {
          // let objx = item[0].toString().slice(-4)
          let objx = {value: item[0],
            label: {
              show: true
            },
            splitLine: {
              show: true
            }}

          let objy = {value: [item[1], item[2], item[4], item[3]],
            itemStyle: {
              normal: {show: false},
              emphasis: {show: false}
            }
          }
          //   let objbar = {value: item[3] - initnumber,
          //     color: item[1] - colorNumber,
          //     itemStyle: {
          //       color: item[1] > colorNumber ? '#f3564d' : '#1cbf7b'
          //     }
          //   }
          dataKLineX.push(objx)
          dataKLineY.push(objy)
        //   dataBarY.push(objbar)
        //   datalinePre.push(item[2].toFixed(2))
        //   initnumber = item[3]
        //   colorNumber = item[1]
        }
      )
      console.log(dataKLineY);
      this.dataKLineX = dataKLineX
      this.dataKLineY = dataKLineY
    //   this.dataBarY = dataBarY
    //   this.datalinePre = datalinePre
    },
    empdata() {
      //   app.title = '2015 年上证指数';
      let rawData = this.minData
      console.log(this.minData);
      function calculateMA(dayCount, data) {
        return data.map(
          i => i[dayCount]
        );
      }

      var dates = rawData.map(function (item) {
        return item[0];
      });
      function dataBarY (data) {
        return data.map(
          i => {
            return {
              "value": i[5],
              itemStyle: {
                color: i[2] - i[1] < 0 ? '#1cbf7b' : '#ffffff',
                borderColor: i[2] - i[1] < 0 ? '#fff' : '#f3564d',
                borderWidth: 1
              }}
          }
        )
      }

      var data = rawData.map(function (item) {
        return [+item[1], +item[2], +item[4], +item[3]];
      });
      console.log(total - dataCount);
      var option = {

        // backgroundColor: '#21202D',
        legend: {
          data: ['日K', 'MA5', 'MA10', 'MA20', 'MA30'],
          inactiveColor: '#777',
          textStyle: {
            color: '#fff'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            animation: false,
            type: 'cross',
            lineStyle: {
              color: '#376df4',
              width: 2,
              opacity: 1
            }
          }
        },
        xAxis: [{
          type: 'category',
          data: dates,
          axisLine: { lineStyle: { color: '#8392A5' } },
          splitNumber: 3,
          boundaryGap: false,
          splitLine: {
            show: true,
            lineStyle: {
              color: '#eff0f2'
            }
            // interval: (index, val) => {
            //   if (index === 68) return false
            // }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 16,
            formatter: (value, index) => {
              if (index === dataCount - 1) {
                return `${value} 2018083`
              } else if (index === 0) {
                return value + value
              } else {
                return value
              }
            }
          }
        },
        {
          type: 'category',
          // 图标序号
          gridIndex: 1,
          // 数据指定
          data: dates,
          scale: true,
          boundaryGap: true,
          axisLine: {onZero: false},
          axisTick: {show: false},
          splitLine: {show: false},
          axisLabel: {show: false}
          // splitNumber: 20
        }
        ],
        yAxis: [{
          scale: true,
          show: false,
          axisLine: { lineStyle: { color: '#8392A5' } },
          splitLine: { show: false },
          boundaryGap: true,
          axisLabel: {
            inside: true
            // show: false
          }
        },
        {
          scale: true,
          gridIndex: 1,
          splitNumber: 2,
          axisLabel: {show: false},
          axisLine: {show: false},
          axisTick: {show: false},
          splitLine: {show: false}
        }
        ],
        grid: [{
          left: '0px',
          right: '2px',
          height: '72%',
          // width: '99%',
          top: '0px',
          // padding: [0, 1, 0, 0],
          containLabel: true
        }, {
          height: '30%',
          left: '0px',
          right: '0px',
          // top: '60%',
          bottom: '0px',
          containLabel: true
        }],
        animation: false,
        series: [
          {
            type: 'candlestick',
            name: '日K',
            data: data,
            itemStyle: {
              normal: {
                color: '#ffffff',
                color0: '#1cbf7b',
                borderColor: '#f3564d',
                borderColor0: '#1cbf7b'
              }
            }
          },
          {
            name: 'MA5',
            type: 'line',
            data: calculateMA(8, rawData),
            smooth: true,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1,
                color: '#ffb041'
              }
            }
          },
          {
            name: 'MA10',
            type: 'line',
            data: calculateMA(9, rawData),
            smooth: true,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1,
                color: '#26a5ff'
              }
            }
          },
          {
            name: 'MA20',
            type: 'line',
            data: calculateMA(10, rawData),
            smooth: true,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1,
                color: '#ff40bf'
              }
            }
          },
          {
            name: 'MA30',
            type: 'line',
            data: calculateMA(30, data),
            smooth: true,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            }
          },
          {
            type: 'bar',
            xAxisIndex: 1,
            yAxisIndex: 1,
            barCategoryGap: 1.5,
            data: dataBarY(rawData),
            max: 'dataMax',
            min: 'dataMin'
          }
        ],
        dataZoom: [
          {
            type: 'inside',
            xAxisIndex: [0, 1],
            // yAxisIndex: [0, 6],
            startValue: total - dataCount,
            endValue: total - 1,
            filterMode: 'filter'
          }
        ]
      };
      myChart.setOption(option)
    }
  },

  computed: {
  },

  components: {}

}
</script>
