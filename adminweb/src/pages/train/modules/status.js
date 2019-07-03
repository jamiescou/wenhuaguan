const STATUS_LABEL = {
    'WaitCommit': '待提交',
    'WaitAudit': '待审核',
    'Audited': '已审核',
    'Published': '已上架',
    'Offline': '已下架',
    'Recycled': '已回收'
}
export const STATUS = {
    WaitCommit: 'WaitCommit',
    WaitAudit: 'WaitAudit',
    Audited: 'Audited',
    Published: 'Published',
    Offline: 'Offline',
    Recycled: 'Recycled'
}

export function statusOpts() {
    const keys = Object.keys(STATUS_LABEL);
    let opts = [];
    for (const key of keys) {
        opts.push({ label: STATUS_LABEL[key], value: key });
    }
    return opts;
}

const statusName = function getStatusName(key) {
    return STATUS_LABEL[key];
}
export const PARENT_NAME = {
    '1': { name: '培训编辑', path: 'index' },
    '2': { name: '培训审核', path: 'trainaudit' },
    '3': { name: '培训管理', path: 'trainpublish' },
    '4': { name: '回收站', path: 'trainrecycle' }
};

/**
 * 是否有回收权限
 * @param {String} key 状态值
 */
const hasRecycledPermission = function(key) {
    let hasPermission = [STATUS.WaitCommit, STATUS.WaitAudit, STATUS.Audited, STATUS.Offline];
    return hasPermission.some(item => item === key);
}

/**
 * 是否有提交审核权限
 * @param {String} key 状态值
 */
const hasCommitAuditPermission = function(key) {
    return key === STATUS.WaitCommit;
}

// 是否有删除权限
const hasDelPermission = function(key) {
    let hasPermission = [STATUS.WaitCommit, STATUS.Recycled];
    return hasPermission.some(item => item === key)
}

/**
 * 是否有编辑权
 * @param {String} key 状态值
 */
const hasEditPermission = function(key) {
    let hasPermission = [STATUS.WaitCommit, STATUS.WaitAudit, STATUS.Audited, STATUS.Offline];
    return hasPermission.some(item => item === key)
}
/**
 * 是否有发布权
 * @param {String} key 状态值
 */
const hasPublishPermission = function(key) {
    let hasPermission = [STATUS.Audited, STATUS.Offline];
    return hasPermission.some(item => item === key)
}
/**
 * 是否有下架权
 * @param {String} key 状态值
 */
const hasOfflinePermission = function(key) {
    return key === STATUS.Published;
}

export default {
    STATUS,
    STATUS_OPTION: statusOpts(),
    statusName,
    hasRecycledPermission,
    hasCommitAuditPermission,
    hasEditPermission,
    hasPublishPermission,
    hasOfflinePermission,
    hasDelPermission,
    PARENT_NAME
}
