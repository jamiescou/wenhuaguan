import Vue from 'vue'
import ElementUI from 'element-ui'
import VueAMap from 'vue-amap'
// import NProgress from 'nprogress' // Progress 进度条

import 'element-ui/lib/theme-default/index.css';
import '@/styles/index.scss';
import 'nprogress/nprogress.css' // Progress 进度条样式

import App from './App'
import router from '@/routes' // 路由
import store from '@/stores' // 状态管理
// import { REFRESH, GENERATEROUTES, USERINFO, REGIONS } from '@/stores/types';
import PublicUtil from '@/util/publicUtil' // 公用Util
import components from '@/components' // 全局组件
import dicts from '@/components/dictionaries' // 共用字典
import * as filters from '@/filters' // 过滤

Vue.config.devtools = true
Vue.config.productionTip = false
Vue.config.debug = true // 开启错误提示
Vue.use(ElementUI)
Vue.use(VueAMap)
Vue.use(PublicUtil)
Vue.use(dicts);

// 富文本编辑器
import '../static/ueditor/ueditor.config.js'
import '../static/ueditor/ueditor.all.js'
import '../static/ueditor/lang/zh-cn/zh-cn.js'
import '../static/ueditor/ueditor.parse.min.js'
VueAMap.initAMapApiLoader({
    key: '39da37a97677fa883d5f0c5000176163',
    plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'Geocoder']
});


// ------------------------------  注册组件和过滤路由  -------------------------------
// 注册全局组件
Object.keys(components).forEach((key) => {
    var name = key.replace(/(\w)/, (v) => v.toUpperCase()) // 首字母大写
    Vue.component(`v${name}`, components[key])
})

// 注册全局过滤器
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

// ----------------------------  实例化 -----------------------------------------
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})
