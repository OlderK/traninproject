import util from '../libs/util';
const http = util.http;

export default {
  // 获取客户列表
  getCustList() {
    return http.get('/api/customersdtoall')
  },

  // 根据关键字搜索客户
  searchCustFromKey(searchCustName, searchCustMobile, searchCustLevel, searchCustFrom) {
    return http.get(`/api/customersdtoall?custName=${searchCustName}&custTel=${searchCustMobile}&custLevel=${searchCustLevel}&custOrigin=${searchCustFrom}`)
    // return http.get(`/api/customersdto?name=${searchCustName}&phone=${searchCustMobile}`)
  },

  // 新建客户
  addNewCust(cscpCust) {
    return http.post('/api/cscpCusts', cscpCust)
    // return http.post('/api/customers', customer)
  },

  // 编辑客户
  editorCust(cscpCust) {
    return http.put('/api/cscpCusts', cscpCust)
  },

  // 删除客户
  deleteCust(custId) {
    return http.delete(`/api/cscpCusts/${custId}`)
  },

  // 根据客户id获取客户跟进记录
  getCustRecords(custId) {
    return http.get(`/api/customerexts/${custId}`)
  },

  // 根据客户id+记录id删除记录
  deleteCustRecord(custId, followId) {
    return http.delete(`/api/deleteRecord?custId=${custId}&followId=${followId}`)
  },

  // 根据创建时间段获取用户
  getCustInfoByTimeRange(startTime, endTime) {
    return http.get(`/api/customerdto/${startTime}/${endTime}`)
  },

  // 导入excel文件
  importExcel(file) {
    return http.post('/api/customerdto/fileUpload', file)
  },

  // 上传客户附件
  uploadCustAttachment(custId, file) {
    return http.post(`/api/upload/${custId}`, file)
  },

  // 获取客户来源/等级列表
  getCustOriginOrLevelList(type) {
    return http.get(`/api/cscpDicsByCriteria?dicType=${type}`)
  }


}
