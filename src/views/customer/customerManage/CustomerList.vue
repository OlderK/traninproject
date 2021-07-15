<template>
  <div class="customer-list">
    <!-- <h3 class="title">客户管理</h3> -->
    <!-- 头部操作区 -->
    <el-row :gutter="10" class="nav-option" type="flex" justify="space-between">
      <el-col :span="4" class="search-input">
        <el-input v-model="searchCustName" placeholder="请输入客户姓名" size="small" clearable>
        </el-input>
      </el-col>
      <el-col :span="4" class="search-input">
        <el-input v-model="searchCustMobile" placeholder="请输入客户电话" size="small" clearable>
        </el-input>
      </el-col>
      <el-col :span="3" class="cust-select">
        <label for="">客户来源</label>
        <el-select v-model="searchCustFrom" placeholder="请选择" size="small" clearable>
          <el-option v-for="item in custFromList" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="3" class="cust-select">
        <label for="">客户级别</label>
        <el-select v-model="searchCustLevel" placeholder="请选择" size="small" clearable>
          <el-option v-for="item in custLevelList" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" @click="searchForCust" size="small">查询</el-button>
        <el-button plain size="small" @click="resetSearch">重置</el-button>
      </el-col>
      <el-col :span="3" class="nav-right">
        <el-button type="primary" @click="handlerClickCreateCust" size="small">新建用户</el-button>
        <el-select v-model="selectMoreOption" @change="handlerSelectMore" placeholder="更多" size="small">
          <el-option v-for="item in selectMore" :key="item.value" :label="item.name" :value="item.value">
          </el-option>
        </el-select>
      </el-col>
    </el-row>

    <!-- 客户表格展示区 -->
    <el-table :data="showCustList" style="width: 100%" :header-cell-style="{ background:'#f0f2f5',color:'#000' }" :row-style="{ height: 0 + 'px' }" :cell-style="{padding: '5px'}" tooltip-effect="light" border height="500px">
      <template slot="empty">
        <el-empty :image-size="200" description="啥也没有。"></el-empty>
      </template>
      <el-table-column prop="custName" label="客户姓名" width="100" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="getCustInfo(scope.row)">{{scope.row.custName}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="custTel" label="电话" width="120" align="center">
      </el-table-column>
      <el-table-column prop="custUpdateTime" min-width="130" sortable label="更新时间" align="center">
      </el-table-column>
      <el-table-column prop="custCardType" width="110" label="证件类型" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="custCardNum" width="110" label="证件号码" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="custOrigin" width="110" label="客户来源" align="center" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="custLevel" label="客户级别" align="center">
      </el-table-column>
      <el-table-column prop="custAddress" label="省、市、区/县" min-width="100" align="center" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="custDetailAddress" label="详细地址" align="center" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="custCreatFounder" label="创建人" width="80" align="center">
      </el-table-column>
      <el-table-column prop="" label="操作" width="120" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="handlerClickEditor(scope.row)">编辑</el-button>
          <el-button type="text" @click="handlerClickDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <!-- <Page :total="100" show-total show-elevator show-sizer></Page> -->

    <!-- 客户详情弹窗 -->
    <el-dialog class="new-cust-dialog" :visible.sync="openCustDetailPanel">

      <!-- 标题插槽 -->
      <template slot="title">
        <div class="cust-detail-title">
          <i class="el-icon-user-solid"></i>
          <span>{{ this.custDetaiPanelData.custName }}</span>
        </div>
      </template>

      <!-- 客户信息 -->
      <el-row :gutter="20" class="cust-info">
        <el-col :span="5">
          <span>客户级别</span>
          <span>{{ this.custDetaiPanelData.custLevel }}</span>
        </el-col>
        <el-col :span="5" :offset="1">
          <span>电话</span>
          <span>{{ this.custDetaiPanelData.custTel }}</span>
        </el-col>
        <el-col :span="5" :offset="1">
          <span>负责人</span>
          <span>{{this.custDetaiPanelData.custCreatFounder }}</span>
        </el-col>
        <el-col :span="6" :offset="1">
          <span>更新时间</span>
          <span>{{ this.custDetaiPanelData.custUpdateTime }}</span>
        </el-col>
      </el-row>

      <!-- 添加记录按钮 -->
      <el-row class="add-record-btn">
        <el-col :span="1" :offset="22">
          <el-button type="text" @click="handlerClickEditor(scope.row)">添加记录</el-button>
        </el-col>
      </el-row>

      <!-- 标签页切换 -->
      <el-tabs v-model="custDetaiPanelData.activeTabName" class="tab">

        <!-- 客户跟进记录表格展示 -->
        <el-tab-pane label="跟进记录" name="followRecord">
          <el-table :data="currentShowCustRecordList" style="width: 100%" :header-cell-style="{ background:'rgba(238, 238, 238, 0.2)',color:'#000', padding: '4px 0' }" :row-style="{ height: 0 + 'px' }" :cell-style="{ padding: '0px' }" tooltip-effect="light" height="260px">
            <template slot="empty">
              <el-empty :image-size="100" description="啥也没有。"></el-empty>
            </template>
            <el-table-column prop="trackTime" label="时间" sortable min-width="100" align="center">
            </el-table-column>
            <el-table-column prop="trackMethod" label="跟进方式" width="120" align="center">
            </el-table-column>
            <el-table-column prop="trackContent" min-width="160" :show-overflow-tooltip="true" label="跟进内容" align="center">
            </el-table-column>
            <el-table-column prop="" label="操作" width="80" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="handlerClickDeleteRecord(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 附件上传 -->
        <el-tab-pane label="附件" name="attachment" class="attachment">
          <el-upload ref="uploadAttachment" class="upload" :auto-upload="false" action="" multiple :limit="1" accept=".txt, .doc, .xlsx, .xls, .ppt" :on-change="uploadCustRecordFile">
            <el-button size="small" plain type="primary">点击上传</el-button>
            <span slot="tip" class="el-upload__tip">支持扩展名：.txt/.doc/.exel/.ppt，且不超过500kb</span>
          </el-upload>

          <el-table :data="currentShowCustAttachmentList" style="width: 100%" :header-cell-style="{ background:'rgba(238, 238, 238, 0.2)',color:'#000', padding: '4px 0' }" :row-style="{ height: 0 + 'px' }" :cell-style="{ padding: '0px' }" tooltip-effect="light" height="208px">
            <template slot="empty">
              <el-empty :image-size="100" description="啥也没有。"></el-empty>
            </template>
            <el-table-column prop="fileName" label="附件名称" min-width="80" align="center">
            </el-table-column>
            <el-table-column prop="fileSize" label="附件大小" width="80" align="center">
            </el-table-column>
            <!-- //! 上传人？？ -->
            <!-- <el-table-column prop="attachUploader" width="100" :show-overflow-tooltip="true" label="上传人" align="center">
            </el-table-column> -->
            <el-table-column prop="fileUploadTime" min-width="160" :show-overflow-tooltip="true" label="上传时间" sortable align="center">
            </el-table-column>
            <el-table-column prop="" label="操作" width="120" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="handlerClickDeleteRecord(scope.row)">下载</el-button>
                <el-button type="text" @click="handlerClickDeleteRecord(scope.row)">删除

                </el-button>
              </template>
            </el-table-column>
          </el-table>

        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <!-- 新增/编辑用户对话框 -->
    <el-dialog class="new-cust-dialog" :title="custPanelTitle" :visible.sync="openCreateNewCustPanel">
      <el-row :gutter="20">
        <el-form :model="newCustForm" :rules="newCustFormRules" label-position="top" ref="newCustDialog">
          <el-col :span="8">
            <el-form-item label="姓名" label-width="80px" prop="custName">
              <el-input v-model="newCustForm.custName" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="证件类型" label-width="80px" prop="custCardType">
              <el-select v-model="newCustForm.custCardType" placeholder="请选择">
                <el-option v-for="(item, i) in custDocumentTypeList" :key="i" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="证件号" label-width="80px" prop="custCardNum">
              <el-input v-model="newCustForm.custCardNum" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="*客户级别" label-width="80px" prop="custLevel">
              <el-select v-model="newCustForm.custLevel" placeholder="请选择">
                <el-option v-for="(item, i) in custLevelList" :key="i" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="*手机" label-width="80px" prop="custTel">
              <el-input v-model.number="newCustForm.custTel" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="*客户来源" label-width="80px" prop="custOrigin">
              <el-select v-model="newCustForm.custOrigin" placeholder="请选择">
                <el-option v-for="(item, i) in custFromList" :key="i" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="地区级连选择" label-width="80px" prop="custAddress">
              <el-cascader v-model="newCustForm.custAddress" placeholder="请选择" :options="options" filterable clearable></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="详细地址" label-width="80px" prop="custDetailAddress">
              <el-input v-model="newCustForm.custDetailAddress" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="备注" label-width="80px" prop="custRemark">
              <el-input v-model="newCustForm.custRemark" type="textarea" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openCreateNewCustPanel = false">取消</el-button>
        <el-button type="primary" @click="createNewCust">提交</el-button>
      </div>
    </el-dialog>

    <!-- 删除用户对话框 -->
    <el-dialog class="delete-dialog" :visible.sync="openDeleteCustPanel" width="20%" :show-close="false">
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

    <!-- 导入客户数据对话框 -->
    <el-dialog class="import-cust-dialog" title="导入客户" :visible.sync="openImportCustPanel" @close="handlerCloseImportCustPanel">
      <el-row>
        <el-col :offset="1" class="attention-1">
          <p>一、请按照数据模板的格式准备要导入的数据，<el-button type="text" @click="downloadCustModel">点击下载</el-button>《客户导入模板》，注意事项如下：</p>
          <div>
            <div>1. 模板中的表头名称不能更改，表头行不能删除；</div>
            <div>2. 其中标<b>&nbsp;*&nbsp;</b>为必填项，必须填写；</div>
            <div>3. 导入文件请勿超过<b>20MB</b>。</div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :offset="1" class="attention-2">
          <p>二、请选择数量重复时的处理方式</p>
          <p>
            <el-select v-model="excelDataRepeatProcessMethod" placeholder="请选择" size="small">
              <el-option v-for="item in excelDataRepeatProcessMethodList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </p>
        </el-col>
      </el-row>
      <el-row>
        <el-col :offset="1" class="attention-3">
          <p>三、请选择要导入的文件</p>
          <p>
            <el-upload ref="uploadExcel" action="" :auto-upload="false" :limit="1" accept=".xls, .xlsx" :on-change="uploadExcelFileChange" :on-remove="removeExcelFile">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">支持扩展名：.xlsx/.xls，且不超过<b>20MB</b></div>
            </el-upload>
            <!-- <vue-xlsx-table @on-select-file="handleSelectedFile">上传文件</vue-xlsx-table> -->
          </p>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openImportCustPanel = false">取消</el-button>
        <el-button type="primary" @click="importCustData">导入</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { regionData, CodeToText, TextToCode } from "element-china-area-data";
import CUST_API from "../../../api/customer";
import moment from "moment";
export default {
  data() {
    // 客户名校验
    var validateName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.newCustForm.custName !== "") {
          this.$refs.newCustDialog.validateField("custName");
        }
        callback();
      }
    };
    return {
      searchCustName: "",
      searchCustMobile: "",
      searchCustLevel: "",
      searchCustFrom: "",
      custDocumentTypeList: ["居民身份证", "港澳通行证", "护照"],
      custLevelList: ["A", "B", "C", "D", "E"],
      custFromList: ["拜访", "电话", "广告"],
      selectMore: [
        {
          value: 0,
          name: "导入"
        },
        {
          value: 1,
          name: "导出"
        }
      ],
      selectMoreOption: "",
      selectMoreExportLoading: false,
      custList: [],
      showCustList: [],
      deleteId: "",
      openCustDetailPanel: false,
      openCreateNewCustPanel: false,
      openDeleteCustPanel: false,
      openImportCustPanel: false,
      openExportCustPanel: false,
      custPanelTitle: "新建客户",
      currentEditorCustId: 0,
      newCustForm: {
        custName: "",
        custTel: 0,
        custCardType: "",
        custCardNum: "",
        custAddress: "",
        custDetailAddress: "",
        custLevel: "",
        custOrigin: "",
        custCreatFounder: "",
        custRemark: ""
      },
      newCustFormRules: {
        custName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {}
        ]
        // custTel: [{ validator: validateName, trigger: "blur" }],
        // custCardNum: [{ validator: validateName, trigger: "blur" }]
      },
      currentPage: 1,
      options: regionData,
      custDetaiPanelData: {
        custName: "",
        custLevel: "",
        custTel: "",
        custCreatFounder: "",
        custUpdateTime: "",
        activeTabName: "followRecord" // attachment
      },
      currentShowCustRecordList: [],
      currentShowRecordListCustId: "",
      currentShowCustAttachmentList: [],
      excelDataRepeatProcessMethod: "",
      excelDataRepeatProcessMethodList: [
        {
          label: "覆盖原有数据",
          value: 0
        },
        {
          label: "不覆盖原有数据",
          value: 1
        },
        {
          label: "保留原有数据",
          value: 2
        }
      ],
      importCustList: [],
      file: ""
    };
  },
  created() {
    // 页面首次加载获取数据
    CUST_API.getCustList().then(res => {
      const { status, data } = res;
      if (status === 200) {
        // window.localStorage.setItem("custList", JSON.stringify(data));
        //? 新建一个数组存储所有用户数据
        // this.custList = res.data.data;
        this.showCustList = data;
        console.log(data.length);
      }
    });

    // console.log(moment().format("YYYY-MM-DD HH:mm:ss"));
  },
  methods: {
    // 搜索客户
    searchForCust() {
      CUST_API.searchCustFromKey(
        this.searchCustName,
        this.searchCustMobile,
        this.searchCustLevel,
        this.searchCustFrom
      ).then(res => {
        if (res.status === 200) {
          this.showCustList = res.data;
        }
      });
    },

    // 重置搜索
    resetSearch() {
      // 清空所有搜索框
      this.searchCustName = "";
      this.searchCustMobile = "";
      this.searchCustLevel = "";
      this.searchCustFrom = "";

      // 判断缓存中是否存在客户数据
      //? 需求不需要重新渲染客户数据列表
      /* if (!window.localStorage.getItem("custList")) {
        this.searchForCust();
      } else {
        this.showCustList = JSON.parse(window.localStorage.getItem("custList"));
      } */
    },

    // 打开新建用户信息面板
    handlerClickCreateCust() {
      this.openCreateNewCustPanel = true;
      this.custPanelTitle = "新建客户";
      this.clearCustPanel();
    },

    // 新建/编辑客户
    createNewCust() {
      let cscpCust = this.newCustForm;

      // 三级地址转换区号转汉字，需保证地址下拉栏不能为空
      if (this.newCustForm.custAddress.length) {
        cscpCust.custAddress = this.newCustForm.custAddress.reduce(
          (prev, curr) => {
            return prev + " " + CodeToText[curr];
          },
          ""
        );
      }
      if (this.custPanelTitle === "新建客户") {
        cscpCust.custTel = Number(cscpCust.custTel);
        // cscpCust.custId = Math.floor(Math.random() * 10000 + 200);
        cscpCust.custUpdateTime = moment().format("YYYY-MM-DD HH:mm:ss");
        console.log(cscpCust);
        CUST_API.addNewCust(cscpCust).then(res => {
          if (res.status >= 200 && res.status < 300) {
            this.$message({
              message: "新增成功。",
              type: "success"
            });
            this.openCreateNewCustPanel = false;

            // 更新客户列表
            this.searchForCust();
            // this.$refs["newCustDialog"].resetField();
          } else {
            this.$message.error("新增失败");
          }
        });
      } else {
        // 编辑客户
        cscpCust.custId = this.currentEditorCustId;
        // cscpCust.custId =
        CUST_API.editorCust(cscpCust).then(res => {
          if (res.status >= 200 && res.status < 300) {
            this.$message({
              message: "修改成功。",
              type: "success"
            });
            this.openCreateNewCustPanel = false;

            // 更新客户列表
            this.searchForCust();
            // this.$refs["newCustDialog"].resetField();
          } else {
            this.$message.error("修改失败");
          }
          this.searchForCust();
        });
      }
    },

    // 清空客户信息面板
    clearCustPanel() {
      for (let item of Object.keys(this.newCustForm)) {
        this.newCustForm[item] = "";
      }
    },

    // 编辑按钮点击
    handlerClickEditor(row) {
      this.clearCustPanel();
      this.custPanelTitle = "编辑客户";
      this.openCreateNewCustPanel = true;
      this.currentEditorCustId = row.custId;

      // 将该列数据同步给展示的面板表单
      for (let key of Object.keys(row)) {
        if (key !== "custAddress") {
          this.newCustForm[key] = row[key];
        }
      }

      // 将地址转换为区号，映射到下拉框中显示
      let areaCode = [];
      if (row.custAddress.length) {
        let arr = row.custAddress.trim().split(" ");
        for (let i = 0, len = arr.length; i < len; ++i) {
          if (i === 0) {
            areaCode.push(TextToCode[arr[0]].code);
          } else if (i === 1) {
            areaCode.push(TextToCode[arr[0]][arr[1]].code);
          } else {
            areaCode.push(TextToCode[arr[0]][arr[1]][arr[2]].code);
          }
          2;
        }
      }
      this.newCustForm.custAddress = areaCode;
    },

    // 删除按钮点击
    handlerClickDelete(row) {
      this.openDeleteCustPanel = true;
      this.deleteId = row.custId;
      console.log(row.custId);
    },

    // 删除客户
    deleteCust() {
      CUST_API.deleteCust(this.deleteId).then(res => {
        if (res.status === 200) {
          this.$message({
            message: "删除成功。",
            type: "success"
          });
          this.openDeleteCustPanel = false;
          // 更新客户列表
          this.searchForCust();
        } else {
          this.$message.error("删除失败");
        }
      });
    },

    // 打开客户详情面板，获取用户信息
    getCustInfo(row) {
      this.openCustDetailPanel = true;
      for (let key of Object.keys(this.custDetaiPanelData)) {
        if (key !== "activeTabName") {
          this.custDetaiPanelData[key] = row[key];
        }
      }

      this.currentShowRecordListCustId = row.custId;

      // 获取跟进记录
      CUST_API.getCustRecords(row.custId).then(res => {
        if (res.status === 200) {
          this.currentShowCustRecordList = res.data.trackLists;
        }
      });

      //! 获取附件信息
      // this.$http.get('')
      // this.$http.post('')
    },

    // 上传客户跟进记录附件
    uploadCustRecordFile(file, filelist) {
      let form = new FormData();
      form.append("file", file.raw);
      CUST_API.uploadCustAttachment(
        this.currentShowRecordListCustId,
        form
      ).then(res => {
        if (res.status === 200) {
          this.$message({
            type: "success",
            message: "附件上传成功。"
          });
          this.$refs["uploadAttachment"].clearFiles();
        }
      });
    },

    //! 删除跟进记录
    handlerClickDeleteRecord(row) {
      /* CUST_API.deleteCustRecord(
        this.currentShowCustRecordList.custId,
        row.followId
      ).then(res => {
        if (res.data.status === 200) {
          this.$message({
            message: "记录删除成功。",
            type: "success"
          });
          // 重新获取客户记录
          console.log(this.currentShowCustRecordList.custId);

          CUST_API.getCustRecords(this.currentShowCustRecordList.custId).then(
            res => {
              if (res.data.status === 200) {
                this.currentShowCustRecordList.recordList =
                  res.data.data.recordList;
              }
            }
          );
        }
        // console.log();
      }); */
    },

    // 更多下拉框选择
    handlerSelectMore(option) {
      switch (option) {
        case 0:
          this.openImportCustPanel = true;
          break;
        case 1:
          // 导出当前客户列表
          // 导出loading动画面板
          const loading = this.$loading({
            lock: true,
            text: "正在导出中...",
            spinner: "el-icon-loading",
            background: "rgba(255, 255, 255, 1)"
          });

          // 表头
          const tHeader = [
            "客户姓名",
            "电话",
            "更新时间",
            "证件类型",
            "证件号码",
            "客户来源",
            "客户级别",
            "省、市、区/县",
            "详细地址",
            "创建人"
          ];

          // 数据格式化处理
          const data = this.showCustList.map(v => {
            return [
              v.custName,
              v.custTel,
              v.custUpdateTime,
              v.custCardType,
              v.custCardNum,
              v.custOrigin,
              v.custLevel,
              v.custAddress,
              v.custDetailAddress,
              v.custCreatFounder
            ];
          });

          // console.log(data);

          import("../../../excel/Export2Excel").then(excel => {
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename:
                "客户信息表" +
                new Date(new Date().getTime() + 28800000)
                  .toJSON()
                  .substr(0, 19)
                  .replace("T", "_")
            });
            this.selectMoreOption = "";
            loading.close();
          });
          break;
      }
    },

    // 客户导入模板下载
    downloadCustModel() {
      let fileName = "客户导入模板";
      let obj = "hello";
      const temp = document.createElement("a");
      temp.download = fileName || "download";
      temp.href = URL.createObjectURL(obj);
      temp.click();
      setTimeout(() => {
        URL.revokeObjectURL(temp.href);
      }, 100);
    },

    // 将用户选中excel的文件转为JSON进行数据校验
    handleSelectedFile(convertedData) {
      const TITLE = [
        { cnTitle: "客户姓名", enTitle: "custName" },
        { cnTitle: "电话", enTitle: "custTel" },
        { cnTitle: "更新时间", enTitle: "custUpdateTime" },
        { cnTitle: "证件类型", enTitle: "custCardType" },
        { cnTitle: "证件号码", enTitle: "custCardNum" },
        { cnTitle: "客户来源", enTitle: "custOrigin" },
        { cnTitle: "客户级别", enTitle: "custLevel" },
        { cnTitle: "省、市、区/县", enTitle: "custAddress" },
        { cnTitle: "详细地址", enTitle: "custDetailAddress" },
        { cnTitle: "创建人", enTitle: "custCreatFounder" }
      ];

      let check = true;
      let headerList = convertedData.header;

      // 表头校验
      for (let i = 0, len = headerList.length; i < len; ++i) {
        if (headerList[i] !== TITLE[i].cnTitle) {
          check = false;
          break;
        }
      }

      // 表中数据格式化
      let custList = convertedData.body.map(v => {
        let cnKeys = Object.keys(v);
        let res = {};
        for (let key of cnKeys) {
          let enKey = TITLE.find(item => item.cnTitle === key).enTitle;
          res[enKey] = v[key];
        }
        return res;
      });

      // console.log(custList);

      // 对导入数据进行校验
      //? 暂时只对表头进行校验
      if (check) {
        this.$message({
          type: "success",
          message: "文件校验成功。"
        });
        this.importCustList = custList;
      } else {
        this.$message({
          type: "error",
          message: "校验不合格，请按照模板要求，编辑后再重新上传。"
        });
      }
      // console.log(convertedData);
    },

    // 客户选中excel文件
    uploadExcelFileChange(file, filelist) {
      let form = new FormData();
      form.append("file", file.raw);
      this.file = form;
      this.$message({
        type: "success",
        message: "上传成功。"
      });
    },

    removeExcelFile() {},

    // 上传客户选中的文件到后端
    importCustData() {
      CUST_API.importExcel(this.file).then(res => {
        if (res.status === 200) {
          this.$message({
            type: "success",
            message: "导入成功。"
          });
          this.openImportCustPanel = false;
          this.$refs["uploadExcel"].clearFiles();
          this.searchForCust();
        }
      });
    },

    // 导入客户数据面板关闭回调
    handlerCloseImportCustPanel() {
      this.selectMoreOption = "";
      this.$refs["uploadExcel"].clearFiles();
    },

    handleSizeChange() {},

    handleCurrentChange() {}
  }
};
</script>

<style lang="less" scoped>
.customer-list {
  .title {
    font-size: 18px;
    font-weight: bold;
    margin: 15px 0;
    color: #000;
  }

  .nav-option {
    height: 32px;
    margin-top: 10px;
    margin-bottom: 20px;

    // 客户搜索框样式调整
    .search-input /deep/ .el-input {
      width: 200px;

      .el-input__inner {
        padding-right: 0;
      }
    }

    // 客户级别/来源下拉框样式调整
    .cust-select {
      // 设置最小宽度，防止展开导航栏时，文本换行
      min-width: 180px;
      label {
        font-size: 13px;
      }

      /deep/ .el-select {
        width: 90px;
        margin-left: 10px;
      }
    }

    // 更多下拉框样式调整
    .nav-right {
      width: 200px;

      /deep/ .el-select {
        width: 90px;
        margin-left: 20px;
      }
    }
  }

  // 所有对话框样式
  /deep/ .el-dialog__header {
    padding: 20px;
    border-bottom: 1px solid #ccc;
  }

  .new-cust-dialog {
    /deep/ .el-dialog {
      margin-top: 15vh !important;
    }

    // 客户详情面板标题
    .cust-detail-title {
      display: flex;
      align-items: center;
      font-size: 18px;
      i {
        font-size: 25px;
        margin-right: 5px;
      }
    }

    // 客户信息展示样式
    .cust-info {
      margin-bottom: 40px;

      .el-col {
        height: 60px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: left;
        font-size: 15px;
      }
    }

    // 调整添加记录按钮位置
    .add-record-btn {
      .el-button {
        position: relative;
        top: 40px;
        z-index: 1;
      }
    }

    // 客户跟进记录
    .tab {
      /deep/ .el-tabs__header {
        margin-bottom: 0;
      }

      .attachment {
        padding: 10px 0;

        .el-upload {
          .el-button {
            margin-right: 10px;
          }
        }

        // 调整上传文件可视区域宽度
        /deep/ .el-upload-list {
          width: 200px;
        }
      }
    }
  }

  // 调整客户删除确认对话框样式
  .el-dialog__wrapper.delete-dialog {
    margin-top: 20vh;
    /deep/ .el-dialog {
      display: flex;
      flex-direction: column;
      justify-content: center;

      .el-dialog__body {
        padding: 15px 20px 8px;
      }
    }
  }

  // 调整导入客户对话框样式
  .el-dialog__wrapper.import-cust-dialog {
    /deep/ .el-dialog__body {
      .attention-1 {
        div {
          text-indent: 2em;
          b {
            color: red;
          }

          &:last-child {
            margin-bottom: 10px;
          }
        }
      }

      .attention-2,
      .attention-3 {
        p {
          height: 40px;
          line-height: 40px;

          &:last-child {
            margin-left: 2em;
          }
        }
      }

      .attention-3 {
        .el-upload__tip {
          margin-top: -10px;

          b {
            color: red;
          }
        }

        & > p:last-child {
          display: flex;
          flex-direction: column;
          justify-content: start;

          // 调整上传区域包裹容器大小，防止按钮无法点击
          div {
            width: 400px;
            text-align: left;
          }
        }

        // 调整上传文件可视区域宽度
        .el-upload-list {
          width: 200px;
        }
      }
    }
  }

  /*  /deep/.el-table--scrollable-y ::-webkit-scrollbar {
    display: none;
  } */

  /deep/ .el-table .el-table__body-wrapper {
    padding: 0 !important;
  }
}
</style>
