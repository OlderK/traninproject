<template>
  <!-- 客户信息统计 -->
  <div class="cust-info-statist">
    <Row type="flex" align="middle" class="nav">
      <Col :span="2">
      <span>选择时间维度：</span>
      </Col>

      <Col :span="2">
      <Select v-model="chooseTimeDimension" style="width: 100px">
        <Option v-for="item in timeDimensionList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      </Col>

      <Col :span="2" :offset="1">
      <span>选择时间区间：</span>
      </Col>

      <Row v-show="chooseTimeDimension === 0" type="flex" justify="start" :gutter="10">
        <Col :span="12">
        <Date-picker v-model="yearRange[0]" format="yyyy-MM-dd" type="year" placement="bottom-end" placeholder="选择开始年份" style="width: 200px"></Date-picker>
        </Col>
        <Col :span="12">
        <Date-picker v-model="yearRange[1]" format="yyyy-MM-dd" type="year" placement="bottom-end" placeholder="选择结束年份" style="width: 200px"></Date-picker>
        </Col>
      </Row>

      <Row v-show="chooseTimeDimension === 1" type="flex" justify="space-between" :gutter="10">
        <Col :span="12">
        <Date-picker v-model="monthRange[0]" format="yyyy-MM" type="month" placement="bottom-end" placeholder="选择开始月份" style="width: 200px"></Date-picker>
        </Col>
        <Col :span="12">
        <Date-picker v-model="monthRange[1]" format="yyyy-MM" type="month" placement="bottom-end" placeholder="选择结束月份" style="width: 200px"></Date-picker>
        </Col>
      </Row>

      <div v-show="chooseTimeDimension === 2">
        <Date-picker v-model="dateRange" format="yyyy-MM-dd" type="daterange" placement="bottom-end" placeholder="选择日期" style="width: 200px"></Date-picker>
      </div>

      <Col :offset="1">
      <Button type="primary" @click="getCustList">查询</Button>
      </Col>
    </Row>
    <div v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.8)">

      <!-- 客户级别 -->
      <div class="cust-level">
        <!-- 柱状图 -->
        <barChart ref="levelBarChart" :width="600" :height="250" :options="{ title: '客户级别统计' }" :x-axis="xAxis" :bar-data="custLevelBarData" :bar-lengend="custLevelList"></barChart>

        <!-- 饼图 -->
        <pieChart ref="levelPieChart" :width="500" :height="250" :options="{ title: '客户级别分布' }" :pie-data="custLevelPieData"></pieChart>
      </div>

      <!-- 客户来源 -->
      <div class="cust-origin">
        <!-- 柱状图 -->
        <barChart ref="originBarChart" :width="600" :height="250" :options="{ title: '客户来源统计' }" :x-axis="xAxis" :bar-data="custOriginBarData" :bar-lengend="custOriginList"></barChart>

        <!-- 饼图 -->
        <pieChart ref="originPieChart" :width="500" :height="250" :options="{ title: '客户来源分布' }" :pie-data="custOriginPieData"></pieChart>
      </div>

    </div>

  </div>
</template>

<script>
import barChart from "./BarChart";
import pieChart from "./PieChart";
import moment from "moment";
import CUST_API from "../../../api/customer";
export default {
  components: {
    barChart,
    pieChart
  },
  data() {
    return {
      chooseTimeDimension: 2,
      timeDimensionList: [
        {
          label: "年",
          value: 0
        },
        {
          label: "月",
          value: 1
        },
        {
          label: "日",
          value: 2
        }
      ],
      yearRange: ["", ""],
      monthRange: ["", ""],
      dateRange: [],
      custLevelList: [],
      custOriginList: [],
      xAxis: [],
      custLevelBarData: [],
      custLevelPieData: [],
      custOriginBarData: [],
      custOriginPieData: [],
      custList: [],
      loading: false
    };
  },
  mounted() {
    this.initChart();
    // this.getClassifyDataByAPI();
  },
  created() {},
  methods: {
    // 初始化图表，默认显示最近一个月新建的用户
    async initChart() {
      this.loading = true;
      await this.getOriginAndLevelList();

      let currentTime = new Date().getTime();
      let endTime = moment(currentTime + 86400000).format("YYYY-MM-DD");
      let startTime = moment(currentTime - 2626560000).format("YYYY-MM-DD");
      this.dateRange = [startTime, endTime];

      this.getCustList();
    },

    // 获取分类列表
    async getOriginAndLevelList() {
      let levellist = await CUST_API.getCustOriginOrLevelList(14);
      let originlist = await CUST_API.getCustOriginOrLevelList(15);
      this.custLevelList = levellist.data.map(v => v.dicDisplay);
      this.custOriginList = originlist.data.map(v => v.dicDisplay);
    },

    // 更新图表
    async updateChart(startTime, endTime) {
      this.loading = true;

      let data = await CUST_API.getCustInfoByTimeRange(startTime, endTime);
      this.custList = data.data;

      // 按客户级别分类
      let dSplitFromLevel = this.classifyDataByKey(
        this.custList,
        "custLevel",
        this.custLevelList
      );

      // 将数据格式化传递给饼图
      this.custLevelPieData = this.formatData2PieData(dSplitFromLevel);

      // 按客户等级统计
      this.custLevelBarData = this.formatData2BarData(
        dSplitFromLevel,
        this.custLevelList,
        this.xAxis,
        "custCreateTime"
      );

      // 按客户来源分类
      let dSplitFromOrigin = this.classifyDataByKey(
        this.custList,
        "custOrigin",
        this.custOriginList
      );

      this.custOriginPieData = this.formatData2PieData(dSplitFromOrigin);
      this.custOriginBarData = this.formatData2BarData(
        dSplitFromOrigin,
        this.custOriginList,
        this.xAxis,
        "custCreateTime"
      );

      // 将用户来源列表按照来源文字长度排序，防止图例与引导线重叠
      this.custOriginPieData = this.custOriginPieData.sort(
        (a, b) => a.name.length - b.name.length
      );

      // 触发子组件表格更新数据
      this.$nextTick(() => {
        this.$refs.levelBarChart.init();
        this.$refs.levelPieChart.init();
        this.$refs.originBarChart.init();
        this.$refs.originPieChart.init();
      });

      this.loading = false;
    },

    // 按照某个属性值对数据进行分类
    classifyDataByKey(data, key, keylist) {
      let res = {};
      for (let key of keylist) {
        res[key] = [];
      }

      for (let i = 0, len = data.length; i < len; ++i) {
        let targetKey = data[i][key];
        res[targetKey].push(data[i]);
      }
      return res;
    },

    // 格式化分类后的数据为饼图所需数据格式
    // [ { name: 'A', value: 20 } ]
    formatData2PieData(data) {
      let pieData = {};
      let keyList = [];
      for (let key of Object.keys(data)) {
        keyList.push(key);
        pieData[key] = data[key].length;
      }

      // 对键名排序
      keyList = keyList.sort();

      // 将数据按name属性值排序
      let pie = [];
      for (let i = 0; i < keyList.length; ++i) {
        pie.push({
          name: keyList[i],
          value: pieData[keyList[i]]
        });
      }
      return pie;
    },

    // 对数据进行细分，并格式化为柱状图所需数据格式
    // [ { name: 'xAxis', data: [], type: 'bar' }]
    formatData2BarData(data, classlist, xAxis, targetKey) {
      let series = {};
      for (let key of classlist) {
        for (let x of xAxis) {
          let count = data[key].reduce((prev, curr) => {
            return curr[targetKey].indexOf(x) > -1 ? prev + 1 : prev;
          }, 0);
          if (series[key]) {
            series[key].push(count);
          } else {
            series[key] = [count];
          }
        }
      }

      // 将数据格式化传给柱状图
      let bar = [];
      for (let key of Object.keys(series)) {
        bar.push({
          name: key,
          data: series[key],
          type: "bar"
        });
      }
      return bar;
    },

    // 查询用户列表
    getCustList() {
      let startTime = "";
      let endTime = "";
      switch (this.chooseTimeDimension) {
        case 0:
          startTime = moment(this.yearRange[0]).format("YYYY-MM-DD");
          endTime = moment(this.yearRange[1]).format("YYYY-MM-DD");
          this.xAxis = this.getYearBetween(startTime, endTime);
          break;
        case 1:
          startTime = moment(this.monthRange[0]).format("YYYY-MM-DD");
          endTime = moment(this.monthRange[1]).format("YYYY-MM-DD");
          this.xAxis = this.getMonthBetween(startTime, endTime);
          break;
        case 2:
          startTime = moment(this.dateRange[0]).format("YYYY-MM-DD");
          endTime = moment(this.dateRange[1]).format("YYYY-MM-DD");
          this.xAxis = this.getDateBetween(startTime, endTime);
          break;
      }
      this.updateChart(startTime, endTime);
    },

    // 获取两个日期间的所有年
    getYearBetween(start, end) {
      //传入的格式YYYY
      var res = [];
      if (start > end) return res;
      for (let i = parseInt(start); i <= parseInt(end); ++i) {
        res.push(i + "");
      }
      return res;
    },

    // 获取两个日期间的所有月
    getMonthBetween(start, end) {
      //传入的格式YYYY-MM
      var result = {};
      var s = start.split("-");
      var e = end.split("-");
      var minyear = new Date();
      var maxyear = new Date();
      minyear.setFullYear(s[0]); //开始年
      maxyear.setFullYear(e[0]); //结束年
      var curryear = minyear;
      var yeararr = [];
      while (curryear <= maxyear) {
        var year = curryear.getFullYear();
        result[year] = [];
        curryear.setFullYear(year + 1);
      }
      var min = new Date();
      var max = new Date();
      min.setFullYear(s[0], s[1] * 1 - 1); //开始月
      max.setFullYear(e[0], e[1] * 1 - 1); //结束月
      var curr = min;
      while (curr <= max) {
        var month = curr.getMonth();
        if (month + 1 < 10) {
          var temmonth = "0" + (month + 1);
        } else {
          var temmonth = month + 1;
        }
        result[moment(curr).format("YYYY")].push(temmonth);
        // result.push(moment(curr).format("YYYY") + "-" + temmonth);
        curr.setMonth(month + 1);
      }

      let res = [];
      for (let key of Object.keys(result)) {
        let arr = result[key];
        for (let item of arr) {
          res.push(key + "-" + item);
        }
      }
      return res;
    },

    // 获取两个日期间的所有天
    getDateBetween(start, end) {
      //传入的格式YYYY-MM-dd
      var result = [];
      var beginDay = start.split("-");
      var endDay = end.split("-");
      var diffDay = new Date();
      var dateList = new Array();
      var i = 0;
      diffDay.setDate(beginDay[2]);
      diffDay.setMonth(beginDay[1] - 1);
      diffDay.setFullYear(beginDay[0]);
      result.push(start);
      while (i == 0) {
        var countDay = diffDay.getTime() + 24 * 60 * 60 * 1000;
        diffDay.setTime(countDay);
        dateList[2] = diffDay.getDate();
        dateList[1] = diffDay.getMonth() + 1;
        dateList[0] = diffDay.getFullYear();
        if (String(dateList[1]).length == 1) {
          dateList[1] = "0" + dateList[1];
        }
        if (String(dateList[2]).length == 1) {
          dateList[2] = "0" + dateList[2];
        }
        result.push(dateList[0] + "-" + dateList[1] + "-" + dateList[2]);
        if (
          dateList[0] == endDay[0] &&
          dateList[1] == endDay[1] &&
          dateList[2] == endDay[2]
        ) {
          i = 1;
        }
      }
      return result;
    },

    // 通过后端接口发起分类检索
    async getClassifyDataByAPI() {
      await this.getOriginAndLevelList();
      let type = ["cust_origin"]; //, "cust_level"];
      for (let key of type) {
        let res = await CUST_API.getCustClassifyData(
          "2021-06-14",
          "2021-07-15",
          "day",
          key
        );

        // x轴
        this.xAxis = Object.keys(res.data);

        // 定义一个map类型统计数量
        let pieDataMap = new Map();
        // 格式转换
        for (let key of this.xAxis) {
          res.data[key] = res.data[key].map(v => {
            let k = v.match(/.*(?=:)/)[0];
            let c = +v.match(/(?<=:).*/)[0];
            if (pieDataMap.has(k)) {
              pieDataMap.set(k, pieDataMap.get(k) + c);
            } else {
              pieDataMap.set(k, c);
            }
            return { [k]: c };
          });
        }

        // 将map转为饼图数据格式
        let pieData = [];
        for (let key of this.custOriginList) {
          pieData.push({ name: key, value: pieDataMap.get(key) });
        }

        // 将数据格式为柱状图格式

        // 统计柱状图数据
        let barData = {};
        for (let type of this.custOriginList) {
          barData[type] = [];
        }

        console.log(barData);

        for (let xAxis of this.xAxis) {
          let typeLen = this.custOriginList.length;
          let list = res.data[xAxis];
          for (let item of list) {
            let key = Object.keys(item)[0];

            if (barData) {
              pieData[type] = [];
            }

            // if(res.data[xAxis])
          }

          if (data.data[key].length) {
            // if(pieData[])
          }
        }

        // console.log(res.data);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.nav {
  margin-top: 10px;
  font-size: 13px;

  // 调整下拉框placeholder字体大小
  /deep/ .ivu-select-placeholder,
  /deep/ .ivu-input,
  /deep/ .ivu-select-selected-value {
    font-size: 13px;
  }

  /deep/ .ivu-select-dropdown ul {
    max-width: 100px;
    font-size: 13px;
  }

  /deep/ .ivu-btn {
    font-size: 13px;
  }
}

.cust-level,
.cust-origin {
  display: flex;
  justify-content: space-between;
}

.cust-level {
  margin-top: 20px;
}

.cust-origin {
  margin-top: 30px;
}
</style>