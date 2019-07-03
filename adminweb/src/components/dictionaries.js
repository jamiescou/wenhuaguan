import Vue from 'vue';
import store from '@/stores' // 状态管理

// 获取状态名称
let getCodeValue = function(codes, code) {
    let status = codes.find(item => item.code === code);
    if (status) {
        return status.value;
    }
}
const regionFullName = function(code) {
    let regions = store.getters.regions;
    let result = regions.find(x => x.code === code);
    if (result) {
        return result.fullName;
    }
    return '';
}
const regionName = function(code) {
    let regions = store.getters.regions;
    let result = regions.find(x => x.code === code);
    if (result) {
        return result.name;
    }
    return '';
}
const getValueByCode = function(name, code) {
    let result = store.getters.dicts[name];
    if (result) {
        return getCodeValue(result, code);
    }
}
const dictInit = function(name) {
    let result = store.getters.dicts[name];
    if (!result) {
        store.dispatch('ADD_DICT', name);
    }
}

const dicts = {
    dictInit,
    getValueByCode,
    regionFullName,
    regionName
}

Vue.prototype.dicts = dicts;
