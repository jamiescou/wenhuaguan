const STATUS = {
    /**
     * 待提交
     */
    WAITCOMMIT: 'WaitCommit',
    /**
     * 待审核
     */
    WAITAUDIT: 'WaitAudit',
    /**
     * 已审核
     */
    AUDITED: 'Audited',
    /**
     * 已发布
     */
    PUBLISHED: 'Published',
    /**
     * 已下架
     */
    OFFLINE: 'Offline',
    /**
     * 已回收
     */
    RECYCLED: 'Recycled'
}
const STATUS_OPTION = [
    { label: '待提交', value: STATUS.WAITCOMMIT },
    { label: '待审核', value: STATUS.WAITAUDIT },
    { label: '已审核', value: STATUS.AUDITED },
    { label: '已上架', value: STATUS.PUBLISHED },
    { label: '已下架', value: STATUS.OFFLINE },
    { label: '已回收', value: STATUS.RECYCLED }
]
const STATUS_SEARCH = [
    { label: '已审核', value: STATUS.AUDITED },
    { label: '已上架', value: STATUS.PUBLISHED },
    { label: '已下架', value: STATUS.OFFLINE }
]

const statusName = function getStatusName(key) {
    let status = STATUS_OPTION.find(item => item.value === key);
    if (status) {
        return status.label;
    }
}

/**
 * 是否有回收权
 * @param {String} key 状态值
 */
const hasRecycledPermission = function(key) {
    let hasPermission = [STATUS.WAITCOMMIT, STATUS.WAITAUDIT, STATUS.AUDITED, STATUS.OFFLINE];
    return hasPermission.some(item => item === key);
    // return key === STATUS.RECYCLED;
}
/**
 * 是否有删除权
 * @param {String} key 状态值
 */
const hasDelPermission = function(key) {
    let hasPermission = [STATUS.WAITCOMMIT, STATUS.RECYCLED];
    return hasPermission.some(item => item === key);
    // return key === STATUS.RECYCLED;
}

/**
 * 是否有提交审核权
 * @param {String} key 状态值
 */
const hasCommitAuditPermission = function(key) {
    return key === STATUS.WAITCOMMIT;
}
/**
 * 是否有编辑权
 * @param {String} key 状态值
 */
const hasEditPermission = function(key) {
    let hasPermission = [STATUS.WAITCOMMIT, STATUS.WAITAUDIT, STATUS.AUDITED, STATUS.OFFLINE];
    return hasPermission.some(item => item === key)
}
/**
 * 是否有发布权
 * @param {String} key 状态值
 */
const hasPublishPermission = function(key) {
    let hasPermission = [STATUS.AUDITED, STATUS.OFFLINE];
    return hasPermission.some(item => item === key)
}
/**
 * 是否有下架权
 * @param {String} key 状态值
 */
const hasOfflinePermission = function(key) {
    let hasPermission = [STATUS.PUBLISHED];
    return hasPermission.some(item => item === key)
}

export default {
    STATUS_SEARCH,
    STATUS,
    STATUS_OPTION,
    statusName,
    hasCommitAuditPermission,
    hasRecycledPermission,
    hasEditPermission,
    hasPublishPermission,
    hasOfflinePermission,
    hasDelPermission
}

export const PARENT_NAME = {
    'index': { name: '非遗名录管理', path: 'index' },
    'verify': { name: '非遗名录审核', path: 'verify' },
    'publish': { name: '非遗名录发布', path: 'pulish' },
    'recycle': { name: '非遗名录回收', path: 'recycle' },
    'area': { name: '非遗保护区管理', path: 'index' }
};

export const AREA_NAME = {
    'index': { name: '非遗保护区管理', path: 'index' },
    'verify': { name: '非遗保护区审核', path: 'verify' },
    'publish': { name: '非遗保护区发布', path: 'pulish' },
    'recycle': { name: '非遗保护区回收', path: 'recycle' }
};
