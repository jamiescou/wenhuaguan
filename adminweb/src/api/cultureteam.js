import Fetch, { pageInfo } from './fetch';
const cultureteamRequests = {
    getCultureTeamList(str, page, size) {
        return Fetch({
            url: '/cooperation/artteams?search=' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    addCultureTeam(formData) {
        return Fetch({
            url: '/cooperation/artteams',
            method: 'post',
            data: formData
        });
    },
    modifyCultureTeam(id, formData) {
        return Fetch({
            url: '/cooperation/artteams/' + id,
            method: 'put',
            data: formData
        });
    },
    delCultureTeam(id) {
        return Fetch({
            url: '/cooperation/artteams/' + id,
            method: 'delete'
        });
    },
    getCultureTeamDetail(id) {
        return Fetch({
            url: '/cooperation/artteams/' + id,
            method: 'get'
        });
    },
    /**
     * 管理团队风采
     */
    getCultureTeamMien(id, str, page, size) {
        return Fetch({
            url: '/cooperation/artteams/' + id + '/styles?search=' + str,
            method: 'get'
        });
    },
    /**
     * 新增风采
     */
    addMien(id, formData) {
        return Fetch({
            url: '/cooperation/artteams/' + id + '/style',
            method: 'post',
            data: formData
        });
    },
    /**
     * 修改风采
     */
    editMien(id, sid, formData) {
        return Fetch({
            url: '/cooperation/artteams/' + id + '/style/' + sid,
            method: 'put',
            data: formData
        });
    },
    /**
     * 风采详情
     */
    detailMien(id, sid) {
        return Fetch({
            url: '/cooperation/artteams/' + id + '/style/' + sid,
            method: 'get'
        });
    },
    /**
     * 删除风采
     */
    dellMien(id, sid) {
        return Fetch({
            url: '/cooperation/artteams/' + id + '/style/' + sid,
            method: 'delete'
        });
    },
    /**
     * 新增团队人员
     */
    addTeamPerson(id, formData) {
        return Fetch({
            url: '/cooperation/artteams/' + id + '/member',
            method: 'post',
            data: formData
        });
    },
    /**
     * 修改团队人员
     */
    editTeamPerson(id, mid, formData) {
        return Fetch({
            url: '/cooperation/artteams/' + id + '/member/' + mid,
            method: 'put',
            data: formData
        });
    },
    /**
     * 查看团队人员
     */
    getTeamPerson(id, mid) {
        return Fetch({
            url: '/cooperation/artteams/' + id + '/member/' + mid,
            method: 'get'
        });
    },
    /**
     * 删除团队人员
     */
    delTeamPerson(id, mid) {
        return Fetch({
            url: '/cooperation/artteams/' + id + '/member/' + mid,
            method: 'delete'
        });
    },
    /**
     * 获取团队列表
     */
    getTeamPersonList(id) {
      console.log("id-------",id)
        return Fetch({
            url: '/cooperation/artteams/' + id + '/members',
            method: 'get'
        });
    },
    /**
     * 搜索团队列表（刘晶的馊主意）
     */
    searchTeamPersonList(id,name) {
      return Fetch({
        url: '/cooperation/artteams/' + id + '/find/' + name,
        method: 'get'
      });
    },
    /**
     * 发布团队
     */
    publishCultureTeam(id, isPublish) {
        return Fetch({
            url: '/cooperation/artteams/' + id + '/publish/' + isPublish,
            method: 'put'
        });
    },
    /**
     * 是否置顶
     */
    topCultureTeam(id, status) {
        return Fetch({
            url: '/cooperation/artteams/' + id + '/top/' + status,
            method: 'put'
        });
    }

}
export default cultureteamRequests;
