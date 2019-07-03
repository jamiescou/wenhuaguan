import Fetch, { pageInfo } from './fetch';
const memberWorksRequests = {
    getmemberWorksList(str, page, size) {
        return Fetch({
            url: '/photographyMember/works?search=' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    addmemberWorks(formData) {
        return Fetch({
            url: '/photographyMember/works',
            method: 'post',
            data: formData
        });
    },
    modifymemberWorks(id, formData) {
        return Fetch({
            url: '/photographyMember/works/' + id,
            method: 'put',
            data: formData
        });
    },
    delmemberWorks(id) {
        return Fetch({
            url: '/photographyMember/works/' + id,
            method: 'delete'
        });
    },
    getmemberWorksDetail(id) {
        return Fetch({
            url: '/photographyMember/works/' + id,
            method: 'get'
        });
    },
    /**
     * 管理团队风采
     */
    getmemberWorksMien(id, str, page, size) {
        return Fetch({
            url: '/photographyMember/works/' + id + '/memberWorks?search=' + str,
            method: 'get'
        });
    },
    /**
     * 新增风采
     */
    addMien(id, formData) {
        return Fetch({
            url: '/photographyMember/works/' + id + '/memberWorks',
            method: 'post',
            data: formData
        });
    },
    /**
     * 修改风采
     */
    editMien(id, sid, formData) {
        return Fetch({
            url: '/photographyMember/works/' + id + '/memberWorks/' + sid,
            method: 'put',
            data: formData
        });
    },
    /**
     * 风采详情
     */
    detailMien(id, sid) {
        return Fetch({
            url: '/photographyMember/works/' + id + '/memberWorks/' + sid,
            method: 'get'
        });
    },
    /**
     * 删除风采
     */
    dellMien(id, sid) {
        return Fetch({
            url: '/photographyMember/works/' + id + '/memberWorks/' + sid,
            method: 'delete'
        });
    },
    /**
     * 新增团队人员
     */
    addTeamPerson(id, formData) {
        return Fetch({
            url: '/photographyMember/works/' + id + '/member',
            method: 'post',
            data: formData
        });
    },
    /**
     * 修改团队人员
     */
    editTeamPerson(id, mid, formData) {
        return Fetch({
            url: '/photographyMember/works/' + id + '/member/' + mid,
            method: 'put',
            data: formData
        });
    },
    /**
     * 查看团队人员
     */
    getTeamPerson(id, mid) {
        return Fetch({
            url: '/photographyMember/works/' + id + '/member/' + mid,
            method: 'get'
        });
    },
    /**
     * 删除团队人员
     */
    delTeamPerson(id, mid) {
        return Fetch({
            url: '/photographyMember/works/' + id + '/member/' + mid,
            method: 'delete'
        });
    },
    /**
     * 获取团队列表
     */
    getTeamPersonList(id) {
      console.log("id-------",id)
        return Fetch({
            url: '/photographyMember/works/' + id + '/members',
            method: 'get'
        });
    },
    /**
     * 搜索团队列表（刘晶的馊主意）
     */
    searchTeamPersonList(id,name) {
      return Fetch({
        url: '/photographyMember/works/' + id + '/find/' + name,
        method: 'get'
      });
    },
    /**
     * 发布团队
     */
    publishmemberWorks(id, isPublish) {
        return Fetch({
            url: '/photographyMember/works/' + id + '/publish/' + isPublish,
            method: 'put'
        });
    },
    /**
     * 是否置顶
     */
    topmemberWorks(id, status) {
        return Fetch({
            url: '/photographyMember/works/' + id + '/top/' + status,
            method: 'put'
        });
    }

}
export default memberWorksRequests;
