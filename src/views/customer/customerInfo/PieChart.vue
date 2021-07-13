<template>
  <div ref="chart" :style="{width: width + 'px', height: height + 'px'}"></div>
</template>

<script>
export default {
  props: {
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    data: {
      type: Array,
      required: true
    },
    options: {
      type: Object
    }
  },
  mounted() {
    // console.log(this.options);
  },
  data() {
    return {
      chart: null
    };
  },

  mounted() {
    // chart.clear();
    this.chart = this.$echarts.init(this.$refs.chart);
    this.init();
  },
  beforeUpdate() {
    // this.chart.clear();
  },

  methods: {
    init() {
      let option = {
        title: {
          text: this.options.title,
          left: "center",
          top: "0%"
        },
        legend: {
          data: this.options.custLevelPieData.map(v => v.name),
          align: "right",
          right: "0",
          bottom: "20%",
          orient: "vertical"
        },
        tooltip: {
          show: true,
          trigger: "item",
          formatter: "{b} <br> 人数占比 {d}%",
          axisPointer: {
            type: "shadow"
          }
        },
        series: [
          // 扇形百分比显示
          {
            type: "pie",
            top: "10%",
            data: this.options.custLevelPieData,
            label: {
              normal: {
                show: true,
                position: "inner", //标签的位置
                color: "#fff",
                textStyle: {
                  fontWeight: 500,
                  fontSize: 10
                },
                formatter: "{d}%" //设置百分比
              }
            }
          },
          // 扇形外侧引导线
          {
            type: "pie",
            top: "10%",
            data: this.options.custLevelPieData,
            label: {
              show: true,
              position: "outside",
              textStyle: {
                fontWeight: 500,
                fontSize: 12
              },
              formatter: "{b}：{c}人"
            },
            labelLine: {
              show: true,
              length2: 20
            }
          }
        ],
        toolbox: {
          show: false
        }
      };

      // let chart = this.$echarts.init(this.$refs.chart);
      this.chart.setOption(option, true);
    }
  }
};
</script>

<style>
</style>