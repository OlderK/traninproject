<template>
  <div>
    this is customer's from.
    <vue-xlsx-table ref="xls2JSON" @on-select-file="handleSelectedFile">xls2JSON</vue-xlsx-table>
    <el-button @click="submit">提交</el-button>
  </div>
</template>

<script>
// import vueXlsxTable from "vue-xlsx-table";
export default {
  data() {
    return {
      form: {
        file: ""
      }
    };
  },
  created() {},
  methods: {
    handleSelectedFile(convertedData) {
      console.log(convertedData);
    },

    submit() {}
  }
};
</script>

<style>
</style>