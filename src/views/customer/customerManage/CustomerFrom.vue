<template>
  <div>
    <el-table :data="custOriginList" style="width: 400px" :header-cell-style="{ background:'#f0f2f5',color:'#000' }" :row-style="{ height: 0 + 'px' }" :cell-style="{padding: '5px'}" tooltip-effect="light" border>
      <el-table-column type="index" width="50">
      </el-table-column>
      <el-table-column property="custOrigin" label="客户来源" min-width="120" align="center">
      </el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button type="text">添加{{scope.row}}</el-button>
          <el-button type="text">编辑</el-button>
          <el-button type="text">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-col :span="4">
        <el-upload ref="uploadExcel" action="" :auto-upload="false" multiple :limit="1" :file-list="fileList" accept=".pdf, .doc, .docx, .xls, .xlsx" :before-upload="beforeUpload" :on-change="onchange" :on-remove="removeFile">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import vueXlsxTable from "vue-xlsx-table";
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
    handleSelectedFile(convertedData) {
      console.log(convertedData);
    },

    add() {},
    editor() {},
    delete() {},
    submit() {},

    beforeUpload(file) {
      console.log(file);
      // return false
    },

    onchange(file, filelist) {
      let form = new FormData();
      form.append("file", file.raw);
      let url = `http://192.168.122.93:9001/api/customerdto/fileUpload`;
      this.$http.post(url, form).then(res => {
        console.log(res);
      });
      // console.log(file);

      if (0) {
        this.$refs.uploadExcel.submit();
      }
    },

    removeFile(file, filelist) {
      console.log(file);
    }
  }
};
</script>

<style scoped lang="less">
/deep/ .upload-demo {
  width: 500px;
}
</style>