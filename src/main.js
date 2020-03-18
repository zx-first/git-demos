import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
import treetable from 'vue-table-with-tree-grid'
import axios from 'axios'
// 配置请求的跟路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
    console.log(config);
    //在请求头中挂载 authoriazation 字段 获取偷看
    config.headers.Authorization = window.sessionStorage.getItem('token');
    return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false
    //注册为全局可用的组件
Vue.component('tree-table', treetable)
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')