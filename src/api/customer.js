import util from '../libs/util';
const http = util.http;

export default {
  // 获取客户列表
  getCustList() {
    return http.get('/api/customersdtoall')
  },

  // 根据关键字搜索客户
  searchCustFromKey(obj) {
    let params = ''
    for (let key of Object.keys(obj)) {
      params += `&${key}=${obj[key]}`
    }
    return http.get(`/api/customersdtoall?${params.slice(1)}`)
  },

  // 新建客户
  addNewCust(cscpCust) {
    let params = ''
    for (let key of Object.keys(cscpCust)) {
      if (cscpCust[key]) {
        params += `&${key}=${cscpCust[key]}`
      }
    }
    return http.post(`/api/customerdto?${params.slice(1)}`)
  },

  // 编辑客户
  editorCust(cscpCust) {
    return http.put('/api/customers', cscpCust)
  },

  // 删除客户
  deleteCust(custId) {
    return http.delete(`/api/customers/${custId}`)
  },

  // 根据客户id获取客户跟进记录
  getCustRecords(custId) {
    return http.get(`/api/customerexts/${custId}`)
  },

  // 添加跟进记录
  addCustRecord(track) {
    return http.post(`/api/tracks`, track)
  },

  // 根据id删除记录
  deleteCustRecord(trackId) {
    return http.delete(`/api/tracks/${trackId}`)
  },

  // 根据用户id获取附件列表
  getCustAttachment(custId) {
    return http.get(`/api/getbycustid/${custId}`)
  },

  // 下载用户附件
  downloadCustAttachment(fileId) {
    return http.get(`/api/download/${fileId}`)
  },

  // 删除附件
  deleteCustAttachment(fileId) {
    return http.delete(`/api/delete/${fileId}`)
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
  },

  // 获取客户统计后的信息
  getCustClassifyData(startTime, endTime, timeDimension, type) {
    return http.get(`/api/customerdto/${startTime}/${endTime}/${timeDimension}/${type}`)
  },

  // 分页查询
  getCustListByPage(obj) {
    let params = ''
    for (let key of Object.keys(obj)) {
      if (obj[key]) {
        params += `&${key}=${obj[key]}`
      }
    }
    return http.get(`/api/findAllByPageAndParam?${params.slice(1)}`)
  },
}
