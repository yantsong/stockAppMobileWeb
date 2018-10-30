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
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/line')
require('echarts/lib/component/title');
require('echarts/lib/chart/candlestick')
require('echarts/lib/chart/bar')
require('echarts/lib/component/markLine')
require("echarts/lib/component/markPoint")
require('echarts/lib/component/dataZoom')
let myChart

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
  props: {
    // klineapi 当前获取数据的api 日线 周线 或者K线
    klineapi: {},
    // count 当前坐标轴一段的数据量,即从当前屏幕 坐标轴开始 到 结束中间数据数量 ,interval 是总的分割线数量 interval / 总数据量 = 当前屏幕线数/当前屏幕数据量count
    count: {default: 69}
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
    klineapi: function() {
      this.getData()
    },
    // eslint-disable-next-line
    dataKLineY: function(){
      this.empdata()
    }
  },
  methods: {
    getData() {
      return this.klineapi().then(
        res => {
          console.log(res.data.candle['000001.SS']);
          let minData = res.data.candle['000001.SS']
          if (minData.length < 200) {
            this.minData = minData.splice(-128)
          } else {
            this.minData = minData
          }
          this.computedataLineXY()
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
      let rawData = this.minData
      const dataCount = this.count
      const total = this.minData.length
      const startValue = total - dataCount
      const endValue = total - 1
      console.log(startValue, endValue);
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
      var option = {
        title: [
          {
            text: `●MA5 ${rawData[total - 1][8]}`,
            textStyle: {
              color: '#ffb041',
              fontSize: 12,
              fontWeight: 400
            },
            padding: [0, 0, 0, 0]
          },
          {
            text: `●MA10 ${rawData[total - 1][8]}`,
            textStyle: {
              color: '#26a5ff',
              fontSize: 12,
              fontWeight: 400
            },
            padding: [0, 0, 0, 100]
          },
          {
            text: `●MA20 ${rawData[total - 1][8]}`,
            textStyle: {
              color: '#ff40bf',
              fontWeight: 400,
              fontSize: 12
            },
            padding: [0, 0, 0, 202]
          }
        ],
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
          // splitNumber: 3,
          boundaryGap: false,
          splitLine: {
            show: true,
            lineStyle: {
              color: '#eff0f2'
            },
            interval: 16
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 16,
            formatter: (value, index) => {
              // return value
              // if (index === 0) return '0000000000'
              // else {
              //   return value
              // }
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
          // padding: [100, 0, 100, 0],
          axisLine: { lineStyle: { color: '#8392A5' } },
          boundaryGap: ['1.5%', '1.5%'],
          axisLabel: {
            inside: true
            // show: false
          }
          // splitNumber: 4,
          // splitLine: {
          //   show: true,
          //   lineStyle: {
          //     color: '#eff0f2'
          //   }
          // }
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
          padding: [20, 0, 0, 0],
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
            },
            markPoint: {
              data: [
                {
                  name: 'max',
                  type: 'max',
                  symbol: 'circle',
                  symbolOffset: [25, '-200%'],
                  symbolSize: 1,
                  valueDim: 'highest',
                  label: {
                    show: true,
                    color: '#333',
                    fontSize: 10,
                    formatter: (p) => {
                      console.log(p);
                      return `...${p.data.value.toFixed(2)}`
                    }
                  },
                  itemStyle: {
                    normal: {color: 'rgb(41,60,85)'}
                  }
                },
                {
                  name: 'min',
                  type: 'min',
                  symbol: 'circle',
                  symbolOffset: [-25, '-200%'],
                  symbolSize: 1,
                  valueDim: 'lowest',
                  label: {
                    show: true,
                    color: '#333',
                    fontSize: 10,
                    formatter: (p) => {
                      console.log(p);
                      return `${p.data.value.toFixed(2)}...`
                    }
                  },
                  itemStyle: {
                    normal: {color: 'rgb(41,60,85)'}
                  }
                }
              ]
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
            startValue,
            endValue,
            minValueSpan: 69,
            maxValueSpan: 69,
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
