export function sexFormatter(sex) {
    return sex === 'male' ? '男' : (sex === 'female') ? '女' : '未知'
}

export function publishFormatter(status) {
    return status === true ? '已上架' : (status === false) ? '未上架' : '未上架'
}

export function topFormatter(status) {
    return status === 1 ? '已置顶' : (status === 0) ? '未置顶' : '未置顶'
}

export function onlineStatusFormatter(status) {
    switch (status) {
        case 'WaitCommit':
            return '待提交'
        case 'WaitAudit':
            return '待审核'
        case 'Audited':
            return '已审核'
        case 'Published':
            return '已上架'
        case 'Offline':
            return '已下架'
        case 'Recycled':
            return '已回收'
        default:
            return '待提交'
    }
}
