import Fetch, { pageInfo } from './fetch';
const nounsRequests = {
    /**
     * 获取志愿者列表
     */
    getVolunteerList(str, page, size) {
        return Fetch({
            url: '/volunteer/volunteers?search=' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    /**
     * 申请成为志愿者
     * @param form
     */
    applyVolunteer(form) {
        return Fetch({
            url: '/volunteer/volunteers',
            data: form,
            method: 'post'
        })
    },
    /**
     * 查询志愿者详情
     * @param id
     */
    getVolunteer(id) {
        return Fetch({
            url: '/volunteer/volunteers/' + id,
            method: 'get'
        })
    },
    /**
     * 获取志愿者团队列表
     */
    getNounsList(str, page, size) {
        return Fetch({
            url: '/volunteer/volunteams?search=' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    /**
     * 新增团队
     */
    addNouns(formData) {
        return Fetch({
            url: '/volunteer/volunteams',
            method: 'post',
            data: formData
        });
    },
    /**
     * 修改团队
     */
    editNouns(id, formData) {
        return Fetch({
            url: '/volunteer/volunteams/' + id,
            method: 'put',
            data: formData
        });
    },
    /**
     * 删除团队
     */
    delNouns(id) {
        return Fetch({
            url: '/volunteer/volunteams/' + id,
            method: 'delete'
        });
    },
    /**
     * 查看团队
     */
    getNouns(id) {
        return Fetch({
            url: '/volunteer/volunteams/' + id,
            method: 'get'
        });
    },
    /**
     * 发布团队
     */
    publishNouns(id, isPublish) {
        return Fetch({
            url: '/volunteer/volunteams/' + id + '/publish/' + isPublish,
            method: 'put'
        });
    },
    /**
     * 查看团队成员列表
     */
    getTeamMembers(id) {
        return Fetch({
            url: '/volunteer/volunteams/' + id + '/members',
            method: 'get'
        });
    },
    /**
     * 删除招募成员
     */
    delTeamMember(id, volunteerid) {
        return Fetch({
            url: '/volunteer/volunteams/' + id + '/members/' + volunteerid,
            method: 'delete'
        });
    },
    /**
     * 查询申请列表
     */
    getAllApplys(str, page, size) {
        return Fetch({
            url: '/volunteer/regapplys?search=' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    /**
     * 加入志愿者申请审核
     */
    auditApply(applyId, dataForm) {
        return Fetch({
            url: '/volunteer/regapplys/' + applyId + '/audit/',
            method: 'put',
            data: dataForm
        });
    },
    /**
     * 查看申请详情
     */
    getApply(applyId) {
        return Fetch({
            url: '/volunteer/regapplys/' + applyId,
            method: 'get'
        });
    },
    /**
     * 获取志愿者活动列表
     */
    getCooperationList(str, page, size) {
        return Fetch({
            url: '/volunteer/volunrecruit?search=' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    /**
     * 编辑志愿者活动
     */
    editCooperation(id, formData) {
        return Fetch({
            url: '/volunteer/volunrecruit/' + id,
            method: 'put',
            data: formData
        });
    },
    /**
     * 删除志愿者活动
     */
    delCooperation(id) {
        return Fetch({
            url: '/volunteer/volunrecruit/' + id,
            method: 'delete'
        });
    },
    /**
     * 新增志愿者活动
     */
    addCooperation(formData) {
        return Fetch({
            url: '/volunteer/volunrecruit',
            method: 'post',
            data: formData
        });
    },
    /**
     * 获取志愿者活动
     */
    getCooperation(id) {
        return Fetch({
            url: '/volunteer/volunrecruit/' + id,
            method: 'get'
        });
    },
    /**
     * 发布招募活动
     */
    publishCooperation(id, isPublish) {
        return Fetch({
            url: '/volunteer/volunrecruit/' + id + '/publish/' + isPublish,
            method: 'put'
        });
    },
    /**
     * 启用取消招募活动
     */
    recruitCooperation(id, isRecruit) {
        return Fetch({
            url: '/volunteer/volunrecruit/' + id + '/stop/' + isRecruit,
            method: 'put'
        });
    },
    /**
     * 加入志愿者活动申请审核
     */
    auditRecruitApply(applyId, dataForm) {
        return Fetch({
            url: '/volunteer/recruitjoinapplys/' + applyId + '/audit/',
            method: 'put',
            data: dataForm
        });
    },
    /**
     * 获取招募活动志愿者详情
     */
    getRecruitApplyID(id) {
        return Fetch({
            url: '/volunteer/recruitjoinapplys/' + id,
            method: 'get'
        });
    },
    /**
     * 获取招募活动订单申请列表
     */
    getRecruitApply(str, page, size) {
        return Fetch({
            url: '/volunteer/recruitjoinapplys/?search=' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    /**
     * 获取招募活动列表成员列表
     */
    getRecruitMembers(id) {
        return Fetch({
            url: '/volunteer/volunrecruit/' + id + '/members',
            method: 'get'
        });
    },
     /**
     * 获取招募活动列表成员列表
     */
    getRecruitMember(id) {
        return Fetch({
            url: '/volunteer/recruitjoinapplys/' + id,
            method: 'get'
        })
    },
    /**
     * 删除招募成员
     */
    delRecruitMember(id, idNumber) {
        return Fetch({
            url: '/volunteer/volunrecruit/' + id + '/members/' + idNumber,
            method: 'delete'
        });
    },
    /**
     * 获取志愿者活动数字资源列表
     */
    getVolunrecruitDigitinfos(id) {
        return Fetch({
            url: '/volunteer/volunrecruit/' + id + '/digitinfos',
            method: 'get'
        });
    },
    /**
     * 新增志愿者活动数字资源列表
     */
    addVolunrecruitDigitinfos(id, formData) {
        return Fetch({
            url: '/volunteer/volunrecruit/' + id + '/digitinfos',
            method: 'post',
            data: formData
        });
    },
    /**
     * 编辑志愿者活动数字资源列表
     */
    editVolunrecruitDigitinfos(id, did, formData) {
        return Fetch({
            url: '/volunteer/volunrecruit/' + id + '/digitinfos/' + did,
            method: 'put',
            data: formData
        });
    },
    /**
     * 删除志愿者活动数字资源列表
     */
    delVolunrecruitDigitinfos(id, did) {
        return Fetch({
            url: '/volunteer/volunrecruit/' + id + '/digitinfos/' + did,
            method: 'delete'
        });
    },
    /**
     * 获取志愿者活动数字资源详情
     */
    getVolunrecruitDigitinfosde(id, did) {
        return Fetch({
            url: '/volunteer/volunrecruit/' + id + '/digitinfos/' + did,
            method: 'get'
        });
    }
}
export default nounsRequests;
