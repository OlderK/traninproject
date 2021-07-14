<template>
  <div>
    <Table highlight-row :columns="custColumns" :data="custOriginList"></Table>
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
      custColumns: [
        {
          title: "序号",
          type: "index",
          width: 80,
          align: "center"
          // renderHeader: () => ``
        },
        {
          title: "客户来源",
          key: "custOrigin"
        },
        {
          title: "操作",
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render(row, column, index) {
            return `<i-button type="primary" size="small" @click="add(${index})">添加</i-button>
                                    <i-button type="error" size="small" @click="editor(${index})">删除</i-button>
                                    <i-button type="error" size="small" @click="delete(${index})">删除</i-button>
                                    `;
          }
        }
      ],
      custOriginList: [
        {
          custOrigin: "来源A"
        }
      ],
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

    add() {},
    editor() {},
    delete() {}
  }
};
</script>

<style>
</style>