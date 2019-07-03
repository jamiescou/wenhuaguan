import Vue from 'vue'
// import VueAwesomeSwiper from 'vue-awesome-swiper'
// Vue.use(VueAwesomeSwiper)

if (process.browser) {
    const VueAwesomeSwiper = require('vue-awesome-swiper/dist/ssr')
    Vue.use(VueAwesomeSwiper)

  
    // const FastClick = require('fastclick');
    // FastClick.attach(document.body);

    // // ios 由其它事件外连 click事件需要触发两次
    // const notNeed = FastClick.notNeeded(document.body)
    // Vue.prototype.iosClick = function(dom) {
    //     dom.click()
    //     if (!notNeed) {
    //         dom.click()
    //     }
    // }
}
