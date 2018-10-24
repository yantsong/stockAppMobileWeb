<!-- 大盘异动 -->
<template>
 <div>
     <div id="eline"></div>
 </div>
</template>

<script>
import {getSSMin} from '@/service/stocksApi'
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/line')
require('echarts/lib/chart/bar')
require('echarts/lib/component/markLine')
let myChart
// var date = ['0930', '1030', '1130', '1400', '1500'];
const seriesLineColor = ['#3165c3', '#a5a5a5', '#38b6fc'];
const borderColor = '#eee';

export default {
  data () {
    return {
      minData: '',
      pre_px: '',
      dataLineX: [],
      dataLineY: [],
      dataBarX: [],
      dataBarY: [],
      datalinePre: [],
      max: '',
      min: ''
    }
  },

  created() {
    this.getData()
  },

  mounted() {
    myChart = echarts.init(document.getElementById('eline'))
    console.log(myChart);
    this.getData().then(
      // res => this.empdata(res)
    )
  },
  watch: {
    minData: function() {
      this.computeMaxMin()
      this.computedataLineXY()
      // this.
    },
    // eslint-disable-next-line
    dataLineY: function(){
      this.empdata()
    }
  },

  methods: {
    getData() {
      return getSSMin().then(
        res => {
          this.pre_px = res.data.real.pre_close_px
          this.minData = res.data.trend['000001.SS']
          return Promise.resolve(res.data.trend['000001.SS'])
        }
      )
    },
    computeMaxMin() {
      let min, max
      let sortarr = Array.from(this.minData)
      sortarr.sort(
        (a, b) => {
          return a[1] - b[1]
        }
      )
      this.min = sortarr[0][1]
      this.max = sortarr[sortarr.length - 1][1]

      let difference = Math.max(this.max - this.pre_px, this.pre_px - this.min
      )
      max = this.pre_px + difference
      min = this.pre_px - difference
      this.max = this.max < max ? max : this.max
      this.min = this.min > min ? min : this.min
      this.pre_px = this.pre_px.toFixed(2)
      this.max = this.max.toFixed(2)
      this.min = this.min.toFixed(2)
    },
    computedataLineXY() {
      let initnumber = 0
      let colorNumber = 0
      let minData = this.minData
      let dataLineX = []
      let dataLineY = []
      let dataBarY = []
      let datalinePre = []
      minData.forEach(
        (item, index) => {
          // let objx = item[0].toString().slice(-4)
          let objx = {value: item[0].toString().slice(-4),
            label: {
              show: true
            },
            splitLine: {
              show: true
            }}

          let objy = {value: item[1].toFixed(2),
            itemStyle: {
              normal: {show: false},
              emphasis: {show: false}
            }
          }
          let objbar = {value: item[3] - initnumber,
            color: item[1] - colorNumber,
            itemStyle: {
              color: item[1] > colorNumber ? '#f3564d' : '#1cbf7b'
            }
          }
          dataLineX.push(objx)
          dataLineY.push(objy)
          dataBarY.push(objbar)
          datalinePre.push(item[2].toFixed(2))
          initnumber = item[3]
          colorNumber = item[1]
        }
      )
      this.dataLineX = dataLineX
      this.dataLineY = dataLineY
      this.dataBarY = dataBarY
      this.datalinePre = datalinePre
    },
    empdata() {
      let {dataLineX, dataLineY, datalinePre, dataBarY, min, max, pre_px} = this

      let series = [
        {
          type: 'line',
          label: {
            normal: {
              show: false,
              position: 'inside'
            }
          },
          lineStyle: {
            normal: {
              width: 1,
              color: '#fec501'
            }
          },
          axisLabel: {
            inside: true,
            color: '#8c8f8c',
            margin: '0',
            formatter: (value) => {
              return value.toString() === max ? `\n\n\n${value}` : `${value}\n`
            }
          },
          symbol: 'none',
          data: datalinePre
        },
        {
          type: 'line',
          label: {
            normal: {
              show: false,
              position: 'inside'
            }
          },
          lineStyle: {
            normal: {
              width: 1,
              color: seriesLineColor[0]
            }
          },
          markLine: {
            silent: true,
            lineStyle: {
              normal: {color: '#558fe7'
              }
            },
            data: [{
              name: 'a',
              yAxis: pre_px
            }],
            symbol: 'none'
          },
          symbol: 'none',
          // symbolSize: 2,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: '#d5e2fb'
            }, {
              offset: 1,
              color: '#fafcff'
            }])
          },
          data: dataLineY
        },
        {
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: dataBarY
        }];
      console.log(`----`, dataLineX, dataLineY, dataBarY);

      // 分时图配置
      var tchartOptions = {
        color: ['red', 'green'],
        tooltip: {
          show: true,
          trigger: 'none',
          axisPointer: {
            type: 'line'
          },
          formatter: function(params) {
            var time = params[0].name;
            var val = params[0].value;

            var html = time + '<br/>' +
                        '价格: ' + val + '<br/>';
            return html;
          }
        },
        grid: [{
          left: '0px',
          right: '0px',
          height: '70%',
          top: '0px',
          containLabel: true
        },
        {
          left: '0px',
          right: '0px',
          top: '68%',
          bottom: '0px',
          containLabel: true
        }],
        xAxis: [
          {
            scale: true,
            boundaryGap: false,
            axisLabel: {
              show: true,
              // padding: [1, 0, 1, 0],
              align: 'center',
              textStyle: {
                color: '#c3c5c3'
              },
              interval: (index, val) => {
                if (val === '0930' || val === '1030' || val === '1130' || val === '1400' || val === '1500') {
                  return val
                } else {
                  return ''
                }
              },
              formatter: function(val) {
                if (val === '0930') return '000009:30'
                if (val === '1500') return '15:000000'
                return val === '1130' ? '11:30/13:00' : val.slice(0, 2) + ':' + val.slice(-2)
              }},
            axisTick: {
              show: false
            },
            axisLine: {
              show: true,
              onZero: true
              // lineStyle: {
              //   color: borderColor,
              //   width: 1
              // }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#eff0f2'
              },
              interval: (index, val) => {
                if (val === '1030' || val === '1130' || val === '1400' || val === '1500') {
                  return true
                } else {
                  return false
                }
              }
            },
            data: dataLineX
          },
          {
            type: 'category',
            gridIndex: 1,
            data: dataLineX,
            scale: true,
            boundaryGap: false,
            axisLine: {onZero: false},
            axisTick: {show: false},
            splitLine: {show: false},
            axisLabel: {show: false},
            splitNumber: 20,
            min: 'dataMin',
            max: 'dataMax'
          }
        ],
        yAxis: [
          {
            type: 'value',
            scale: true,
            min,
            max,
            splitArea: {
              show: false
            },
            nameTextStyle: {
              color: '#8c8f8c'
            },
            interval: function (index, value) {
              if (value === max || value === min || value === pre_px) {
                return true
              } else {
                return false
              }
            },
            z: 99,
            axisLabel: {
              inside: true,
              color: '#8c8f8c',
              margin: '0',
              formatter: (value) => {
                return value.toString() === max ? `\n${value}` : `${value}\n`
              }
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: borderColor
              }
            },
            symbol: 'none',
            // splitNumber: 2,
            splitLine: {
              show: false,
              lineStyle: {
                color: borderColor
              }
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
        dataZoom: [
          {
            type: 'inside',
            y: '100%'
            // startValue: data.time.length > 500 ?  data.time.length - 500 : 0,
            // endValue: data.time.length
          }
        ],
        series: series
      };
      myChart.setOption(tchartOptions)
    }
  },

  computed: {
  },

  components: {}

}
</script>
<style lang='scss' scoped>
#eline{
    width: 100vw;
    height: 72vw;
}
</style>
