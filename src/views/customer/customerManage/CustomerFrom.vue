<template>
  <div>
    <el-table
      :data="custOriginList"
      style="width: 400px"
      :header-cell-style="{ background: '#f0f2f5', color: '#000' }"
      :row-style="{ height: 0 + 'px' }"
      :cell-style="{ padding: '5px' }"
      tooltip-effect="light"
      border
    >
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column
        property="custOrigin"
        label="客户来源"
        min-width="120"
        align="center"
      >
      </el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <!-- <template slot-scope="scope"> -->
        <el-button type="text" @click="addNewOrigin">添加</el-button>
        <el-button type="text" @click="editorOrigin">编辑</el-button>
        <el-button type="text" @click="removeOrigin">移除</el-button>
        <!-- </template> -->
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      custOriginList: [
        {
          custOrigin: "来源A"
        },
        {
          custOrigin: "来源B"
        }
      ],
      fileList: []
    };
  },
  created() {},
  methods: {
    addNewOrigin() {},
    editorOrigin() {},
    removeOrigin() {}
  }
};
</script>

<style scoped lang="less">
/deep/ .upload-demo {
  width: 500px;
}
</style>