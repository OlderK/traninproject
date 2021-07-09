<template>
  <div>
    <h3 class="title" title="">客户管理</h3>
    <div class="nav-option">
      <div class="nav-left">
        <!-- <Input v-model="custName" @click="searchByCustName" search enter-button="搜索" placeholder="请输入客户姓名" /> -->
        <el-input v-model="searchCustName" placeholder="请输入客户姓名" size="small">
          <el-button slot="append" @click="searchByCustName">搜索</el-button>
        </el-input>
        <el-input v-model="searchCustPhone" placeholder="请输入客户电话" size="small">
          <el-button slot="append" @click="searchByCustPhone">搜索</el-button>
        </el-input>
        <div class="customer-level">
          <label for="">客户级别</label>
          <el-select v-model="searchCustLevel" placeholder="请选择" size="small">
            <el-option v-for="item in custLevelList" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
          <!-- <Select v-model="searchCustFrom" style="width:200px">
            <Option v-for="(i, item) in custFromList" :value="item" :key="i">{{ item }}</Option>
          </Select> -->
        </div>
        <div class="customer-from">
          <label for="">客户来源</label>
          <el-select v-model="searchCustFrom" placeholder="请选择" size="small">
            <el-option v-for="item in custFromList" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
          <!-- <Select v-model="searchCustFrom" style="width:200px">
            <Option v-for="(i, item) in custFromList" :value="item" :key="i">{{ item }}</Option>
          </Select> -->
        </div>
        <Button type="primary" @click="searchByCustName">查询</Button>
        <Button type="primary" ghost>重置</Button>
      </div>
      <div class="nav-right">

        <Button type="primary" @click="openCreateNewCustPanel = true">新建用户</Button>
        <!-- <Select v-model="deleteId" placeholder="选择要删除的用户id">
          <Option v-for="item in custList" :value="item.custId" :key="item.custId">{{ item.custId }}</Option>
        </Select>
        <Button type="primary" @click="deleteCust">删除用户</Button>
        <Button type="primary" @click="updateCust">更新用户</Button> -->
        <Select v-model="model1" placeholder="更多">
          <Option v-for="item in selectMore" :value="item.value" :key="item.value">{{ item.name }}</Option>
        </Select>
      </div>
    </div>

    <!-- 客户表格展示区 -->
    <el-table :data="custList" style="width: 100%" :header-row-style="{ color: '#000', background: '#000000' }" empty-text="啥也没有。">
      <el-table-column prop="custName" label="客户姓名" width="100" align="right">
      </el-table-column>
      <el-table-column prop="custMobile" label="电话" min-width="180" align="right">
      </el-table-column>
      <el-table-column prop="custMobile" sortable label="更新时间" align="right">
      </el-table-column>
      <el-table-column prop="custDocumentType" label="证件类型" align="right">
      </el-table-column>
      <el-table-column prop="custLevel" label="客户级别" align="right">
      </el-table-column>
      <el-table-column prop="custAdress" label="省、市、区/县" align="right">
      </el-table-column>
      <el-table-column prop="custAdressDetail" label="详细地址" align="right">
      </el-table-column>
      <el-table-column prop="founder" label="创建人" align="right">
      </el-table-column>
      <el-table-column prop="" label="操作" min-width="180" align="right">
        <template slot-scope="scope">
          <el-button type="text" @click="openEditorCustPanel = true">编辑</el-button>
          <el-button type="text" @click="handlerClickEditor(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增用户对话框 -->
    <el-dialog class="new-cust-dialog" title="新建客户" :visible.sync="openCreateNewCustPanel">
      <h1>基本信息</h1>
      <el-row :gutter="20">
        <el-form :model="newCustForm" label-position="top" ref="newCustDialog">
          <el-col :span="8">
            <el-form-item label="*姓名" label-width="80px">
              <el-input v-model="newCustForm.custName" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="证件类型" label-width="80px">
              <el-select v-model="newCustForm.custDocumentType" placeholder="请选择">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="证件号" label-width="80px">
              <el-input v-model="newCustForm.founder" autocomplete="off"></el-input>
              <!-- <el-input value="" autocomplete="off"></el-input> -->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="*客户级别" label-width="80px">
              <el-select v-model="newCustForm.custLevel" placeholder="请选择">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="*手机" label-width="80px">
              <el-input v-model.number="newCustForm.custMobile" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="备注" label-width="80px">
              <el-input v-model="newCustForm.custDocumentType" type="textarea" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="地区级连选择" label-width="80px">
              <el-select v-model="newCustForm.custLevel" placeholder="请选择">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="详细地址" label-width="80px">
              <el-input v-model="newCustForm.custAdressDetail" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openCreateNewCustPanel = false">取消</el-button>
        <el-button type="primary" @click="createNewCust">新增</el-button>
      </div>
    </el-dialog>

    <!-- 删除用户对话框 -->
    <el-dialog :visible.sync="openDeleteCustPanel" width="20%" :show-close="false">
      <template slot="title">
        <div style="display: flex; align-items: center;font-size: 14px; font-weight: bold;">
          <i class="el-icon-error" style="color: red; margin-right: 10px; font-size: 22px"></i>
          <span>确认删除该客户信息吗？</span>
        </div>
      </template>
      <p style="margin-left: 33px;">删除后不可恢复</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="openDeleteCustPanel = false">取 消</el-button>
        <el-button type="primary" @click="deleteCust">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      searchCustName: "",
      searchCustPhone: "",
      searchCustLevel: "",
      searchCustFrom: "",
      custLevelList: [1, 2, 3],
      custFromList: ["A", "B", "C"],
      cityList: [1, 2, 3],
      model1: "",
      selectMore: [
        {
          value: "0",
          name: "导入"
        },
        {
          value: "1",
          name: "导出"
        }
      ],
      custList: [],
      deleteId: "",
      openCreateNewCustPanel: false,
      openDeleteCustPanel: false,
      openEditorCustPanel: false,
      newCustForm: {
        custAdress: "",
        custAdressDetail: "",
        custDocumentType: "",
        custLevel: "",
        custMobile: "4444",
        custName: "",
        founder: ""
      }
    };
  },
  created() {
    // this.$http.get("/api/cscpCusts?custName=${}").then(res => {
    //   console.log(res);
    // });
    this.searchByCustName();
  },
  mounted() {
    // this.$refs.newCustDialog.resetField();
  },
  methods: {
    // 搜索客户
    searchByCustName() {
      // console.log(this.custName);
      this.$http
        .get(`/api/cscpCusts?custName=${this.searchCustName}`)
        .then(res => {
          // console.log(res.data.data);
          this.custList = res.data.data;
        });
    },

    searchByCustPhone(phone) {
      console.log(this.searchCustPhone);
    },

    // 新建客户
    createNewCust() {
      // let cscpCust = {
      //   custAdress: "新用户的地址",
      //   custAdressDetail: "新用户的详细地址",
      //   custDocumentType: "新用户的角色类型",
      //   custLevel: "新用户的等级",
      //   custMobile: 0,
      //   custName: "新用户的名字",
      //   founder: "新用户的建立者"
      // };
      let cscpCust = this.newCustForm;
      this.$http.post("/api/cscpCusts", cscpCust).then(res => {
        if (res.status >= 200 && res.status < 300) {
          this.$message({
            message: "新增成功。",
            type: "success"
          });
          this.openCreateNewCustPanel = false;

          // 更新客户列表
          this.searchByCustName();
          // this.$refs["newCustDialog"].resetField();
          for (let item of Object.keys(this.newCustForm)) {
            this.newCustForm[item] = "";
          }
        } else {
          this.$message.error("新增失败");
        }
      });
      // console.log(this.newCustForm);
    },

    // 编辑删除按钮点击
    handlerClickEditor(row) {
      this.openDeleteCustPanel = true;
      this.deleteId = row.custId;
    },

    // 删除客户
    deleteCust() {
      this.$http.delete(`/api/cscpCusts/${this.deleteId}`).then(res => {
        if (res.status === 200) {
          this.$message({
            message: "删除成功。",
            type: "success"
          });
          this.openDeleteCustPanel = false;
          // 更新客户列表
          this.searchByCustName();
        } else {
          this.$message.error("删除失败");
        }
      });
    },

    // 修改客户
    updateCust() {
      let cscpCust = {
        custAdress: "更改后用户的地址",
        custAdressDetail: "更改后用户的详细地址",
        custDocumentType: "更改后用户的角色类型",
        custLevel: "更改后用户的等级",
        custMobile: 0,
        custId: this.deleteId,
        custName: "更改后用户的名字",
        founder: "更改后用户的建立者"
      };

      this.$http.put("/api/cscpCusts", cscpCust).then(res => {
        console.log(res);
      });
    }
  }
};
</script>

<style lang="less" scoped>
.title {
  font-size: 18px;
  font-weight: bold;
  margin: 15px 0;
}

.nav-option {
  height: 32px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;

  .nav-left {
    height: 32px !important;
    display: flex;
    justify-content: left;

    // 调整搜索框宽度
    & /deep/ .ivu-input-wrapper {
      width: 181px;
      margin-right: 20px;
      .ivu-input.ivu-input-default {
        width: 120px;
      }
      // 调整搜索按钮样式
      .ivu-input-group-append.ivu-input-search {
        // background: red !important;
      }
    }

    .customer-level,
    .customer-from {
      margin-right: 10px;
      width: 230px;
      display: flex;
      justify-content: space-around;
      align-items: center;

      label {
        display: inline-block;
        min-width: 60px;
        margin-right: 5px;
      }

      // 调整客户下拉选框样式
      & /deep/ .ivu-select {
        .ivu-select-selection {
          width: 153px;
        }

        // 调整下拉选框选项样式
        .ivu-select-dropdown {
          min-width: 153px !important;
        }
      }
    }

    .ivu-btn {
      margin-right: 10px;
    }
  }

  .nav-right {
    display: flex;
    justify-content: right;

    & /deep/ .ivu-select {
      margin-left: 20px;
      width: 100px !important;
    }
  }
}

.new-cust-dialog {
  h1 {
    font-size: 18px;
    font-weight: initial;
    color: #000;
  }
}
</style>
