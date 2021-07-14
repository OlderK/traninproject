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

    <!-- 客户级别 -->
    <div class="cust-level">
      <!-- 柱状图 -->
      <barChart :width="600" :height="250" :data="custLevelStatistList" :options="{ title: '客户级别统计', xAxis }"></barChart>

      <!-- 饼图 -->
      <pieChart :width="500" :height="250" :data="custLevelStatistList" :options="{ title: '客户级别分布', custLevelPieData }"></pieChart>
    </div>

    <!-- 客户来源 -->
    <div class="cust-origin">
      <!-- 柱状图 -->
      <barChart :width="600" :height="250" :data="custOriginStatistList" :options="{ title: '客户来源统计', xAxis }"></barChart>

      <!-- 饼图 -->
      <pieChart :width="500" :height="250" :data="custOriginStatistList" :options="{ title: '客户来源分布', custLevelPieData }"></pieChart>
    </div>
  </div>
</template>

<script>
import barChart from "./BarChart";
import pieChart from "./PieChart";
import moment from "moment";
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
      custLevelStatistList: [],
      custOriginStatistList: [],
      custLevelPieData: [],
      custLevelList: ["A", "B", "C"],
      custOriginList: ["拜访", "电话", "广告"],
      xAxis: ["2021-05", "2021-06", "2021-07", "2021-08", "2021-09"],
      testAxis: [],
      testD: [
        {
          custId: 1,
          custCreateTime: "2021-07-14 17:50:03",
          custLevel: "A",
          custOrigin: "拜访"
        },
        {
          custId: 156,
          custCreateTime: "2021-07-13 18:16:59",
          custLevel: "A",
          custOrigin: "天上aa"
        },
        {
          custId: 89,
          custCreateTime: "2021-07-31 18:48:57",
          custLevel: "C",
          custOrigin: null
        },
        {
          custId: 90,
          custCreateTime: "2021-07-23 18:49:03",
          custLevel: "C",
          custOrigin: null
        },
        {
          custId: 92,
          custCreateTime: "2021-07-31 18:49:18",
          custLevel: "C",
          custOrigin: null
        },
        {
          custId: 93,
          custCreateTime: "2021-08-08 18:49:25",
          custLevel: "B",
          custOrigin: null
        },
        {
          custId: 114,
          custCreateTime: "2021-07-23 18:49:35",
          custLevel: "C",
          custOrigin: null
        },
        {
          custId: 115,
          custCreateTime: "2021-07-31 06:49:45",
          custLevel: "C",
          custOrigin: null
        },
        {
          custId: 116,
          custCreateTime: "2021-08-20 18:49:54",
          custLevel: "C",
          custOrigin: null
        },
        {
          custId: 118,
          custCreateTime: "2021-08-01 18:50:14",
          custLevel: "A",
          custOrigin: null
        },
        {
          custId: 119,
          custCreateTime: "2021-07-24 18:50:44",
          custLevel: "A",
          custOrigin: null
        },
        {
          custId: 120,
          custCreateTime: "2021-07-23 18:50:50",
          custLevel: "B",
          custOrigin: null
        },
        {
          custId: 125,
          custCreateTime: "2021-07-13 18:51:34",
          custLevel: "B",
          custOrigin: null
        },
        {
          custId: 126,
          custCreateTime: "2021-07-30 18:51:41",
          custLevel: "B",
          custOrigin: null
        },
        {
          custId: 127,
          custCreateTime: "2021-08-07 18:51:28",
          custLevel: "A",
          custOrigin: null
        },
        {
          custId: 128,
          custCreateTime: "2021-08-07 18:51:57",
          custLevel: "C",
          custOrigin: null
        },
        {
          custId: 129,
          custCreateTime: "2021-07-30 18:52:03",
          custLevel: "C",
          custOrigin: null
        },
        {
          custId: 130,
          custCreateTime: "2021-08-08 18:52:10",
          custLevel: "C",
          custOrigin: null
        }
      ]
    };
  },
  created() {
    this.initChart();
    let startDay = "2021-07-13";
    let endDay = "2021-07-31";
    // this.$http
    //   .get(`http://192.168.122.93:9001/api/customerdto/${startDay}/${endDay}`)
    //   .then(res => {
    //     console.log(res.data);
    //   });

    // 按客户级别分类
    let dSplitFromLevel = {};
    for (let i = 0, len = this.testD.length; i < len; ++i) {
      let level = this.testD[i].custLevel;
      if (dSplitFromLevel[level]) {
        dSplitFromLevel[level].push(this.testD[i]);
      } else {
        dSplitFromLevel[level] = [this.testD[i]];
      }
    }

    // 将数据格式化传递给饼图
    let pieData = {};
    for (let key of Object.keys(dSplitFromLevel)) {
      pieData[key] = dSplitFromLevel[key].length;
    }

    //
    let pie = [];
    for (let i = 0; i < this.custLevelList.length; ++i) {
      pie.push({
        name: this.custLevelList[i],
        value: pieData[this.custLevelList[i]]
      });
    }

    this.custLevelPieData = pie;

    console.log(dSplitFromLevel);
  },
  methods: {
    initChart() {},
    chooseDate(date) {
      console.log(date);
    },

    // 查询用户列表
    getCustList() {
      switch (this.chooseTimeDimension) {
        case 0:
          let startYear = moment(this.yearRange[0]).format("YYYY-MM-DD");
          let endYear = moment(this.yearRange[1]).format("YYYY-MM-DD");
          this.getYearBetween(startYear, endYear);
          break;
        case 1:
          let startMonth = moment(this.monthRange[0]).format("YYYY-MM-DD");
          let endMonth = moment(this.monthRange[1]).format("YYYY-MM-DD");
          this.getMonthBetween(startMonth, endMonth);
          break;
        case 2:
          let startDay = moment(this.dateRange[0]).format("YYYY-MM-DD");
          let endDay = moment(this.dateRange[1]).format("YYYY-MM-DD");

          this.getDateBetween(startDay, endDay);
          // console.log(startTime, endTime);
          break;
      }
    },

    // 获取两个日期间的所有年
    getYearBetween(start, end) {
      //传入的格式YYYY
      var res = [];
      if (start > end) return res;
      for (let i = parseInt(start); i <= parseInt(end); ++i) {
        res.push(i + "");
      }
      console.log(res);
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
      console.log(res);
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
      console.log(result);
      return result;
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