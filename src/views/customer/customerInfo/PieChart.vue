<template>
  <div>
    <div ref="pieChart" :style="{width: width + 'px', height: height + 'px'}"></div>
  </div>
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
    pieData: {
      type: Array,
      required: true
    },
    options: {
      type: Object
    }
  },
  data() {
    return {};
  },

  created() {
    // this.init();
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
          data: this.pieData.map(v => v.name),
          align: "right",
          right: "0",
          bottom: "10%",
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
            data: this.pieData,
            label: {
              show: true,
              position: "inner", //标签的位置
              color: "#fff",
              fontWeight: 500,
              fontSize: 10,
              formatter: "{d}%" //设置百分比
            }
          },
          // 扇形外侧引导线
          {
            type: "pie",
            top: "10%",
            data: this.pieData,
            label: {
              show: true,
              position: "outside",
              fontWeight: 500,
              fontSize: 12,
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

      let chart = this.$echarts.init(this.$refs["pieChart"]);
      chart.setOption(option, true);
    }
  }
};
</script>

<style>
</style>