import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/fonts/iconfont.css'
import './assets/css/index.css'
import TreeTable from 'vue-table-with-tree-grid'
// import axios from 'axios'

// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// Vue.prototype.$http = axios
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor, /* { default global options } */)

Vue.use(Element)
Vue.component('tree-table', TreeTable)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
