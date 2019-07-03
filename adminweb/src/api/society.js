import Fetch, { pageInfo } from './fetch';
const SupplyRequests = {
    /**
     * 获取群文学会列表
     */
    getSocietyList(str, page, size) {
        return Fetch({
            url: '/cooperation/cultruesocitys?search=' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    /**
     * 新增群文学会
     */
    addSociety(formData) {
        return Fetch({
            url: '/cooperation/cultruesocitys',
            method: 'post',
            data: formData
        });
    },
    /**
     * 编辑学会
     */
    editSociety(id, formData) {
        return Fetch({
            url: '/cooperation/cultruesocitys/' + id,
            method: 'put',
            data: formData
        });
    },
    /**
     * 删除学会
     */
    delSociety(id) {
        return Fetch({
            url: '/cooperation/cultruesocitys/' + id,
            method: 'delete'
        });
    },
    /**
     * 查看详情
     */
    getSociety(id) {
        return Fetch({
            url: '/cooperation/cultruesocitys/' + id,
            method: 'get'
        });
    },

    /**
     * 发布/取消发布
     */
    publishDigital(id, isPublish) {
        return Fetch({
            url: '/cooperation/cultruesocitys/' + id + '/publish/' + isPublish,
            method: 'put'
        });
    },

  /**
   * 获取专业委员会列表
   */
    getDivisionsList(mid, str, page, size) {
        return Fetch({
            url: '/cooperation/cultruesocitys/' + mid + '/divisions?search=' + str + pageInfo(page, size),
            method: 'get'
        });
    },

    /**
     * 新增专业委员会
     */
    addDivisions(mid,formData) {
        return Fetch({
          url: '/cooperation/cultruesocitys/'+ mid + '/divisions',
          method: 'post',
          data: formData
        });
    },

    /**
     * 编辑专业委员会
     */
    editDivisions(mid, id, formData) {
        return Fetch({
          url: '/cooperation/cultruesocitys/' + mid + '/divisions/' + id,
          method: 'put',
          data: formData
        });
    },

    /**
     * 删除专业委员会
     */
    delDivisions(mid,id) {
        return Fetch({
          url: '/cooperation/cultruesocitys/' + mid + '/divisions/' + id,
            method: 'delete'
        });
    },

    /**
     * 查看委员会详情
     */
    getDivisions(mid,id) {
        return Fetch({
            url: '/cooperation/cultruesocitys/' + mid + '/divisions/' + id,
            method: 'get'
        });
    },

    /**
     * 审核通过/不通过
     */
    doMember(mid,id, isPublish) {
        return Fetch({
            url: '/cooperation/cultruesocitys/' + mid+'/applys/' +id+ '/audit/' + isPublish,
            method: 'put'
        });
    },

    /**
     * 查询学会成员（审核列表）
     */
    getMemberCheckList(id, str, page, size) {
        return Fetch({
          url: '/cooperation/cultruesocitys/' + id +'/applys?search=' + str + pageInfo(page, size),
          method: 'get'
        });
    },

    /**
     * 查询学会成员（已通过审核）
     */
    getMemberList(id, str, page, size) {
        return Fetch({
            url: '/cooperation/cultruesocitys/' + id +'/members?search=' + str + pageInfo(page, size),
            method: 'get'
        });
    },

    /**
     * 查看申请订单详情
     */
    getApplyMemberDetail(mid,id) {
      return Fetch({
        url: '/cooperation/cultruesocitys/' + mid + '/applys/' + id,
        method: 'get'
      });
    },


  /**
   * 查看成员详情
   */
    getMemberDetail(mid,id) {
        return Fetch({
            url: '/cooperation/cultruesocitys/' + mid + '/members/' + id,
            method: 'get'
        });
    },

    /**
     * 删除成员
     */
    delMember(mid, id) {
        return Fetch({
          url: '/cooperation/cultruesocitys/' + mid + '/members/' + id,
          method: 'delete'
        });
    },

}
export default SupplyRequests;
