<template>
  <div ref="chart" :style="{width: width + 'px', height: height + 'px'}"></div>
</template>

<script>
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
    data: {
      type: Array,
      required: true
    },
    options: {
      type: Object
    }
  },
  mounted() {},
  beforeCreate() {},
  created() {
    // console.log(this.options);
  },
  data() {
    return {
      chartSeries: [
        {
          name: "A",
          data: [100, 230, 100, 200, 300, 400, 385],
          type: "bar"
        },
        {
          name: "B",
          data: [100, 230, 900, 200, 500, 400, 385],
          type: "bar"
        },
        {
          name: "C",
          data: [120, 220, 190, 210, 350, 420, 395],
          type: "bar"
        }
      ],
      labelOption: {
        show: true,
        position: "insideBottom",
        distance: 15,
        align: "left",
        verticalAlign: "middle",
        rotate: 90,
        formatter: "{c}  {name|{a}}",
        fontSize: 16,
        rich: {
          name: {}
        }
      }
    };
  },

  mounted() {
    this.init();
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
          data: ["A", "B", "C"]
        },
        toolbox: {
          show: false
        },
        xAxis: [
          {
            name: "",
            type: "category",
            axisTick: { show: false },
            data: this.options.xAxis
          }
        ],
        yAxis: [
          {
            type: "value",
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
          start: 0
        },
        series: this.chartSeries
      };

      let chart = this.$echarts.init(this.$refs.chart);
      chart.setOption(option, true);
    }
  }
};
</script>

<style>
</style>