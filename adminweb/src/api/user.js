// =========================  会员管理  ============================

import Fetch, { pageInfo } from './fetch';
const memberRequest = {
    /**
     * 查询认证列表
     * @param {String} str 查询条件
     * @param {Number} page 页码
     * @param {Number} size 每页显示数量
     */
    getUserIdentifys(str, page, size) {
        return Fetch({
            url: '/user/identifys?search=' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    /**
     *  申请认证
     * @param {Object} data 认证信息
     */
    applyCertification(data) {
        return Fetch({
            url: '/user/identifys',
            method: 'post',
            data: data
        });
    },
    /**
     * 通过认证
     * @param {any} id 申请认证id
     * @returns
     */
    passCertification(id) {
        return Fetch({
            url: '/user/identifys/' + id + '/pass',
            method: 'put'
        });
    },
    /**
     * 拒绝认证
     * @param {any} id 申请认证id
     * @param {any} remark 备注
     * @returns
     */
    rejectCertification(id, remark) {
        return Fetch({
            url: '/user/identifys/' + id + '/reject',
            method: 'put',
            data: remark
        });
    },
    /**
     * 查询用户列表
     * @param {String} str 查询条件
     * @param {Number} page 页码
     * @param {Number} size 每页显示数量
     */
    getUserList(str, page, size) {
        return Fetch({
            url: '/user/users?search=' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    /**
     *  获取用户信息
     * @param {String} userid 用户id
     */
    getUserInfo(userid) {
        return Fetch({
            url: '/user/users/' + userid,
            method: 'get'
        });
    },
    /**
     *  删除会员
     * @param {String} userid 用户id
     */
    delUser(userid) {
        return Fetch({
            url: '/user/users/' + userid,
            method: 'delete'
        });
    },
    /**
     *  修改会员信息
     * @param {String} userid 用户id
     * @param {Object} data 会员信息
     */
    modifyUser(userid, data) {
        return Fetch({
            url: '/user/users/' + userid,
            method: 'put',
            data: data
        });
    },
    /**
     * 锁定会员
     * @param {String} userid 用户id
     */
    lockAccount(userid) {
        return Fetch({
            url: '/user/users/' + userid + '/lock',
            method: 'put'
        });
    },
    /**
     * 解锁会员
     * @param {String} userid 用户id
     */
    unlockAccount(userid) {
        return Fetch({
            url: '/user/users/' + userid + '/unlock',
            method: 'put'
        });
    },

    /**
     *  查询会员家庭成员
     * @param {String} userid 用户id
     */
    getUserMembers(userid) {
        return Fetch({
            url: '/user/users/' + userid + '/members',
            method: 'get'
        });
    },

    /**
     * 查询所有黑名单日志
     *
     * @returns
     */
    getBlockLogs(searchStr, page, size) {
        return Fetch({
            url: '/user/blacklogs?search=' + searchStr + pageInfo(page, size),
            method: 'get'
        });
    },

    /**
     *  发送验证码
     * @param mobile
     */
    sendCode(username) {
        return Fetch({
            url: '/base/manager/vcodes?username=' + username,
            method: 'post'
        });
    },

    /**
     *  校验验证码
     * @param mobile
     * @param code
     */
    validateCode(username, code) {
        return Fetch({
            url: '/base/manager/verify?username=' + username + '&code=' + code,
            method: 'get'
        });
    },

    /**
     *  忘记密码
     * @param mobile
     * @param code
     */
    resetPwd(username) {
        return Fetch({
            url: '/base/manager/' + username + '/forgetpwd',
            method: 'put'
        });
    },

      /**
     *  黑名单取消
     */
    cancel(id) {
        return Fetch({
            url: '/user/blacklogs/' + id + '/cancel',
            method: 'put'
        });
    }
}
export default memberRequest;
