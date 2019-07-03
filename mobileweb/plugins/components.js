import Vue from 'vue'
import nodata from '../components/nodata.vue'
import overlayer from '~/components/overlayer/overlayer.vue'

// 注册全局组件
const components = { nodata, overlayer }
Object.keys(components).forEach((key) => {
  var name = key.replace(/(\w)/, (v) => v.toUpperCase()) // 首字母大写
  Vue.component(`v${name}`, components[key])
})

// 手势库
import AlloyFinger from 'alloyfinger'
import AlloyFingerPlugin from 'alloyfinger/vue/alloy_finger_vue'

if (process.browser) {
  Vue.use(AlloyFingerPlugin, { AlloyFinger })
  require('alloyfinger/transformjs/transform.js')
}
