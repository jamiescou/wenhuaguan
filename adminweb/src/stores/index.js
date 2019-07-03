import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import user from './user'
import permission from './permission'
import dicts from './dictionaries'
import regions from './regions'
const store = new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production', // 使用严格模式
    modules: {
        user,
        permission,
        dicts,
        regions
    }
})

export default store
