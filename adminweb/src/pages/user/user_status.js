const STATUS = { 'Not': '未认证', 'Wait': '待认证', 'Yes': '已认证', 'Fail': '认证失败' }
const RELATION = { 'children': '子女', 'parent': '父母', 'mate': '夫妻', 'friend': '朋友' }

function statusOpts(status) {
    const keys = Object.keys(status);
    let opts = [];
    for (const key of keys) {
        opts.push({ label: status[key], value: key });
    }
    return opts;
}

function realStatusOpts() {
    let sts = Object.assign({}, STATUS);
    delete sts.Not;
    return statusOpts(sts);
}

const statusName = function getStatusName(key) {
    return STATUS[key];
}
const relationName = function getName(key) {
    return RELATION[key];
}
const waitIdentify = function isWaitIdentify(key) {
    // return key === STATUS.Wait
    return key === 'Wait'
}

export default {
    STATUS,
    RELATION,
    STATUS_OPTION: statusOpts(STATUS),
    REAL_STATUS: realStatusOpts(),
    statusName,
    relationName,
    waitIdentify
}