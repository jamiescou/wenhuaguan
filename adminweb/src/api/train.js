import Fetch, { pageInfo } from './fetch';

const trainRequests = {
    /**
     * 查询培训列表
     * @param {String} str 查询条件
     * @param {Number} page 页码
     * @param {Number} size 每页显示数量
     */
    getTrainList(str, page, size) {
        return Fetch({
            url: '/train/trains?search=' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    /**
     * 创建培训
     * @param {Object} formData 培训信息
     */
    addTrain(formData) {
        return Fetch({
            url: '/train/trains',
            method: 'post',
            data: formData
        });
    },
    /**
     * 获取单个培训信息
     * @param {String} id
     */
    getTrain(id) {
        return Fetch({
            url: '/train/trains/' + id,
            method: 'get'
        });
    },
    /**
     * 获取封面图片
     */
    getTrainPic(id) {
        return Fetch({
            url: '/train/trains/' + id + '/picture',
            method: 'get',
            responseType: 'blob'
        });
    },
  /**
   * 获取标签
   * @returns {*}
   */
    getLabels(type) {
      return Fetch({
        url: '/base/labels/'+type,
        method: 'get'
      });
    },
    /**
     * 获取附件
     */
    getTrainAttach(id) {
        return Fetch({
            url: '/train/trains/' + id + '/attachment',
            method: 'get',
            responseType: 'blob'
        });
    },
    /**
     * 编辑
     * @param {String} id
     * @param {String} dataForm
     */
    modifyTrain(id, dataForm) {
        return Fetch({
            url: '/train/trains/' + id,
            method: 'put',
            data: dataForm
        });
    },
    /**
     * 删除
     * @param {String} id
     * @param {String} dataForm
     */
    delTrain(id) {
        return Fetch({
            url: '/train/trains/' + id,
            method: 'delete'
        });
    },
    /**
     * 删除附件
     * @param {String} id
     * @param {String} dataForm
     */
    delTrainAttach(id) {
        return Fetch({
            url: '/train/trains/' + id + '/attach',
            method: 'delete'
        });
    },
    /**
     * 删除图片
     * @param {String} id
     * @param {String} dataForm
     */
    delTrainImg(id) {
        return Fetch({
            url: '/train/trains/' + id + '/picture',
            method: 'delete'
        });
    },
    /**
     * 变更状态
     * @param {String} id
     * @param {String} dataForm
     */
    changeTrainOnline(id, dataForm) {
        return Fetch({
            url: '/train/trains/' + id + '/onlineStatus',
            method: 'put',
            data: dataForm
        });
    },
    /**
     * 推荐
     * @param {String} id
     */
    trainRecommandTrue(id) {
        return Fetch({
            url: '/train/trains/' + id + '/top/true',
            method: 'put'
        });
    },
    /**
     * 推荐/取消推荐 培训
     * @param {String} id 培训id
     * @param {Boolean} isRecommend 是否推荐
     */
    trainRecommand(id, isRecommend) {
        return Fetch({
            url: '/train/trains/' + id + '/top/' + isRecommend,
            method: 'put'
        });
    },
    /**
     * 获得报名信息
     * @param {String} id
     */
    getTrainOrders(str, page, size) {
        return Fetch({
            url: '/train/orders?search=' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    /**
     * 审核成功
     * @param {String} orderId
     */
    trainCheckOn(orderId) {
        return Fetch({
            url: '/train/orders/' + orderId + '/pass',
            method: 'put'
        });
    },
    /**
     * 审核拒绝
     * @param {String} id
     * @param {String} orderId
     */
    trainCheckOff(orderId) {
        return Fetch({
            url: '/train/orders/' + orderId + '/reject',
            method: 'put'
        });
    },

    /**
     * 发送面试邀请
     * @param {String} id
     * @param {String} orderId
     */
    inviteInterview(orderId,interview) {
        return Fetch({
            url: '/train/orders/' + orderId + '/interview',
            method: 'put',
            data: interview
        });
    },

     /**
   * 获得单条报名信息
   * @param {String} id
   */
  exportTrainOrdersById(id) {
    return Fetch({
      url: '/train/orders/' + id+'/exportexcel',
      method: 'get',
      responseType: 'blob',
      timeout: 0
    });
  },
    /**
     * 获得单条报名信息
     * @param {String} id
     */
    getTrainOrdersById(id, orderId) {
        return Fetch({
            url: '/train/orders/' + orderId,
            method: 'get'
        });
    },

    /**
     * 取消报名短信
     * @param {String} id
     */
    cancelTrainSMS(id,flag) {
        return Fetch({
            url: '/train/orders/'+id+'/cancelSMS/'+flag,
            method: 'put'
        });
    }
}

export default trainRequests;
