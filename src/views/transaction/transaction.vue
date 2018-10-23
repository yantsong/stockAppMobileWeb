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
require('echarts/lib/component/markLine')
let myChart
var date = ['09:30', '10:30', '11:30/13:30', '14:00', '15:00'];
const seriesLineColor = ['#3165c3', '#a5a5a5', '#38b6fc'];
const borderColor = '#eee';

export default {
  data () {
    return {
      minData: '',
      pre_px: '',
      dataX: [],
      dataY: [],
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
      this.computeDataXY()
      // this.
    },
    // eslint-disable-next-line
    dataY: function(){
      this.empdata()
    }
  },

  methods: {
    abs(valarr) {
      let arr = valarr.sort((a, b) => a - b)
      this.max = arr[0]
      this.min = arr[arr.length - 1]
      return Math.max(Math.abs(arr[0]), Math.abs(arr[arr.length - 1]))
    },
    fmttime(time) {
      let newarr = [ ]
      let arr = time.toString().split('')
      arr.forEach(
        (item, index) => {
          if (index === 4 || index === 6) { newarr.push('/') }
          if (index === 8) { newarr.push(' ') }
          if (index === 10) { newarr.push(':') }
          newarr.push(item)
        }
      )
      return newarr.join('')
    },
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
    computeDataXY() {
      let minData = this.minData
      let dataX = []
      let dataY = []
      minData.forEach(
        (item, index) => {
          let objx = item[0].toString().slice(-4)
          let objy = {value: item[1].toFixed(2),
            label: {
              normal: {show: false},
              emphasis: {show: false}
            }}
          dataX.push(objx)
          dataY.push(objy)
        }
      )
      this.dataX = dataX
      this.dataY = dataY
    },
    empdata() {
      let {dataX, dataY, min, max, pre_px} = this

      let series = {
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
        }
      };
      series.data = dataY
      console.log(`----`, dataX, dataY);

      // 分时图配置
      var tchartOptions = {
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
        grid: {
          left: '0px',
          right: '0px',
          top: '10px',
          bottom: '0px',
          containLabel: true
        },
        xAxis: [
          {
            // type: 'time',
            // name: '1111111111111111111',
            // nameLocation: 'start',
            // nameTextStyle: {
            //   color: '#ffffff',
            //   fontSize: 24,
            //   padding: [4]
            // },
            scale: true,
            boundaryGap: true,
            axisLabel: {
              show: true,
              // padding: [1, 0, 1, 0],
              align: 'center',
              textStyle: {
                color: '#c3c5c3'
              },
              interval: (index, val) => {
                // if()
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
              // show: true,
              lineStyle: {
                color: ['#aaa', '#ddd']
              }
              // interval: (index, val) => {
              //   // if()
              //   if (val === '000009:30' || val === '1030' || val === '1130' || val === '1400' || val === '1500') {
              //     return true
              //   } else {
              //     return false
              //   }
              // }
              // interval: 60
            },
            // splitNumber: 2
            data: dataX
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
              // return false
            },
            z: 99,
            // splitNumber: 2,
            axisLabel: {
              inside: true,
              color: '#8c8f8c',
              margin: '0',
              padding: [0, 0, 10, 0]
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
    },
    setData(minData) {
      let dataX = []
      let dataY = []
      minData.forEach(
        (item, index) => {
          dataX.push(item[0])
          dataY.push(item[1])
        }
      )
      this.abs(dataY)
      let max = this.min
      let min = this.max
      console.log(this.max, this.min);
      dataX = dataX.map(
        i => this.fmttime(i)
      )
      myChart.setOption({
        tooltip: {
          trigger: 'axis',
          position: function (pt) {
            return [pt[0], '10%'];
          }
        },
        title: {
          left: 'center',
          text: '大数据量面积图'
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          // data: dataX,
          // min: 'dataMin',
          // max: 'dataMax',
          data: date
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%'],
          min: min,
          max: max
          // data: this.minData
        },
        dataZoom: [{
          type: 'inside'
          // start: 0,
          // end: 10
        // }, {
        //   // start: 0,
        //   // end: 10,
        //   handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        //   handleSize: '80%',
        //   handleStyle: {
        //     color: '#fff',
        //     shadowBlur: 3,
        //     shadowColor: 'rgba(0, 0, 0, 0.6)',
        //     shadowOffsetX: 2,
        //     shadowOffsetY: 2
        //   }
        }],
        series: [
          {
            name: '模拟数据',
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            itemStyle: {
              color: 'rgb(255, 70, 131)'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgb(255, 158, 68)'
              }, {
                offset: 1,
                color: 'rgb(255, 70, 131)'
              }])
            },
            data: dataY
          }
        ]
      })
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
    height: 60vw;
}
</style>
