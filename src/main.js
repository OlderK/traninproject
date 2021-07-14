import Vue from 'vue'
import bySrore from 'biyi-store'
import iView from 'view-design'
import 'view-design/dist/styles/iview.css'
import App from './app.vue'
import util from './libs/util'
import axios from 'axios'
import router from './router/router'
import store from './store/store'
import VueI18n from 'vue-i18n'
import localeI18n from './i18n/index'
import {
  ButtonLimited
} from 'biyi-admin'
import ElementUI from 'element-ui'
// import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import vueXlsxTable from 'vue-xlsx-table'
Vue.use(vueXlsxTable, {
  rABS: false
})
import moment from 'moment'
import dataV from '@jiaminghi/data-view'

//! mock
import './mock/mock'

//* 解决控制台警告
// import 'default-passive-events'

Vue.prototype.$moment = moment
import * as echarts from 'echarts'
Vue.prototype.$echarts = echarts

Vue.use(dataV)
Vue.use(ElementUI)

Vue.config.productionTip = false
Vue.prototype.$util = util
Vue.prototype.$http = util.http
Vue.prototype.$axios = axios

Vue.use(bySrore)
Vue.use(VueI18n)
Vue.use(iView, {
  i18n: function (path, options) {
    let value = i18n.t(path, options)
    if (value !== null && value !== undefined) {
      return value
    }
    return ''
  }
})
Vue.use(iView)


Vue.component('Button', ButtonLimited)

Vue.locale = () => {}

const i18n = new VueI18n(localeI18n)

const vm = new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')

export default vm
