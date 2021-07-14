<template>
  <div ref="barChart" :style="{width: width + 'px', height: height + 'px'}"></div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "BarChart",
  props: {
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    xAxis: {
      type: Array,
      required: true
    },
    barData: {
      type: Array,
      required: true
    },
    barLengend: {
      type: Array,
      required: true
    },
    options: {
      type: Object
    }
  },

  created() {
    // this.init();
  },

  data() {
    return {};
  },

  methods: {
    init() {
      let option = {
        title: {
          text: this.options.title
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        grid: {
          top: "50",
          bottom: "20"
        },
        legend: {
          data: this.barLegend
        },
        toolbox: {
          show: false
        },
        xAxis: [
          {
            name: "",
            type: "category",
            axisTick: { show: false },
            data: this.xAxis,
            barGap: "5%",
            barCategoryGap: "10%"
          }
        ],
        yAxis: [
          {
            type: "value",
            minInterval: 1,
            axisTick: {
              show: false
            },
            axisLabel: {
              show: true
            }
          }
        ],
        dataZoom: {
          type: "inside",
          start: 0,
          end: 100
        },
        series: this.barData
      };

      let chart = this.$echarts.init(this.$refs["barChart"]);
      chart.setOption(option, true);
    }
  }
};
</script>

<style>
</style>