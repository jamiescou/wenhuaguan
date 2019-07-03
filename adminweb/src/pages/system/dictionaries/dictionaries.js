import Api from '@/api'
import store from '@/stores' // 状态管理

function getDic(name, callback) {
    Api.system.getDicItem(name).then((res) => {
        if (typeof callback === 'function') {
            callback(res);
        }
    }).catch((e) => console.log(e));
}
// 获取状态名称
let getCodeValue = function(codes, code) {
    let status = codes.find(item => item.code === code);
    if (status) {
        return status.value;
    }
}
const dicts = function(name, code) {
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

export default {
    getDic,
    getCodeValue,
    dicts,
    dictInit
}
