// ==============================================================
// 【/sys/units/{id}/managers】 查询管理员列表
// 【/sys/units/{id}/managers】 创建管理员账号
// 【/sys/units/{id}/managers/{username}】 查询管理员账号
// 【/sys/units/{id}/managers/{username}】 修改管理员账号
// 【/sys/units/{id}/managers/{username}/roles】 修改管理员角色
// 【/sys/units/{id}/managers/{username}/menus】 查询管理员菜单
// 【/sys/units/{id}/managers/{username}/unlock】 解锁管理员账号
// 【/sys/units/{id}/managers/{username}/lock】 锁定管理员账号
// 【/sys/units/{id}/managers】 删除管理员
// =========================  管理员账号管理  ============================
import Fetch, { pageInfo } from '../fetch';
import FetchUpload from '../fetchUpload';
import Qs from 'qs'
import Vue from 'vue'
import store from '@/stores' // 状态管理

export const fileRequests = {
    /**
     * 上传文件
     * @param {*} data 上传的文件
     * @param {any} fileType 文件类型[pic、video、audio、attach]
     * @returns filePath
     */
    uploadFile(data, fileType, callBack, cancelToken) {
        return FetchUpload({
            url: '/base/files',
            method: 'post',
            data: data,
            isLocal: true,
            onUploadProgress: progressEvent => {
                if (callBack) {
                    callBack(progressEvent.loaded / progressEvent.total * 100 | 0);
                }
            },
            cancelToken: cancelToken
        });
    },
    /**
     * 删除文件
     * @param {*} data 文件地址
     * @returns true/false
     */
    delFile(url) {
        return Fetch({
            url: '/base/files?url=' + url,
            method: 'delete',
            isLocal: true
        });
    },
    /**
     * 获取文件的完整路径
     * @param {String} url 文件地址
     */
    getFileUrl(url) {
        let config = Vue.prototype.configs;
        if (url === null || url === undefined || url === '') return '';
        else if (url.indexOf('http') === 0) return url;
        return config.resource + url;
    }
}

const accountRequests = {
    requestToken(user) {
        let config = Vue.prototype.configs;
        return Fetch({
            url: '/oauth/token',
            method: 'post',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            auth: config.base_auth,
            data: Qs.stringify(user),
            isLogin: true
        });
    },
    /**
     * 获取登录用户信息
     */
    getLoginUserInfo() {
        return Fetch({
            url: '/sys/loginuser',
            method: 'get'
        });
    },
    /**
     * 获取标签列表
     *
     * @param {any} unitid 所属机构
     * @returns []
     */
    getLabels(unitid) {
        return Fetch({
            url: '/base/labels/',
            method: 'get'
        });
    },
    /**
     * 新增标签
     */
    addLabel(data) {
        return Fetch({
            url: '/base/labels',
            method: 'post',
            data: data
        });
    },
    /**
     * 修改标签详情
     */
    editLabelItems(typecode, data) {
        return Fetch({
            url: '/base/labels/' + typecode,
            method: 'put',
            data: data
        });
    },
    /**
     * 删除标签
     */
    delLabeItem(typecode) {
        return Fetch({
            url: '/base/labels/' + typecode,
            method: 'delete'
        });
    },
    /**
     * 查询标签详情
     */
    getLabelitem(labelType) {
        return Fetch({
            url: '/base/labels/' + labelType,
            method: 'get'
        });
    },

    /**
     * 获取字典列表
     */
    getDictionaries() {
        return Fetch({
            url: '/sys/codetypes',
            method: 'get'
        });
    },

    /**
     * 获取某个字典的项
     * @param {*} codetype
     */
    getDictofCodes(codetype) {
        return Fetch({
            url: '/sys/codetypes/' + codetype + '/codes',
            method: 'get'
        });
    },

    /**
     * 获取单个字典
     * @param {*} typecode
     */
    getDicItem(typecode) {
        return Fetch({
            url: '/sys/codetypes/' + typecode,
            method: 'get'
        });
    },
    /**
     * 修改字典item
     */
    editDicItem(data, typecode) {
        return Fetch({
            url: '/sys/codetypes/' + typecode + '/codes',
            method: 'put',
            data: data
        });
    },
    /**
     * 查询管理员列表
     * @param {String} id 组织机构id
     * @param {String} str 查询条件
     * @param {Number} page 页码
     * @param {Number} size 每页显示数量
     */
    getAccountList(id, str, page, size) {
        return Fetch({
            url: '/sys/units/' + id + '/managers?' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    /**
     * 查询管理员列表
     * @param {String} id 组织机构id
     * @param {String} str 查询条件
     * @param {Number} page 页码
     * @param {Number} size 每页显示数量
     */
    getAccountListall(id, str, page, size) {
        return Fetch({
            url: '/sys/units/' + id + '/managers/all?' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    /**
     * 锁定账号
     * @param {String} id 组织机构id
     * @param {String} userName 管理员帐号
     */
    lockAccount(id, userName) {
        return Fetch({
            // /sys/units/{id}/managers/{username}/lock
            url: '/sys/units/' + id + '/managers/' + userName + '/lock',
            method: 'put'
        });
    },
    /**
     * 解锁账号
     * @param {String} id 组织机构id
     * @param {String} userName 管理员帐号
     */
    unlockAccount(id, userName) {
        return Fetch({
            url: '/sys/units/' + id + '/managers/' + userName + '/unlock',
            method: 'put'
        });
    },
    /**
     * 修改管理员角色
     * @param {String} id 组织机构id
     * @param {String} userName 管理员帐号
     * @param {Array} roles 角色集合
     */
    changeAccountRole(id, userName, roles) {
        return Fetch({
            url: '/sys/units/' + id + '/managers/' + userName + '/roles',
            method: 'put',
            data: roles
        });
    },
    /**
     *  创建管理员账号
     * @param {String} id 组织机构id
     * @param {Object} accountData 管理员帐号信息
     */
    addAccount(id, accountData) {
        return Fetch({
            url: '/sys/units/' + id + '/managers',
            method: 'post',
            data: accountData
        });
    },
    /**
     * 查询管理员账号
     * @param {String} id 组织机构id
     * @param {String} userName 管理员帐号
     */
    getAccountInfo(id, userName) {
        return Fetch({
            url: '/sys/units/' + id + '/managers/' + userName,
            method: 'get'
        });
    },
    /**
     * 修改管理员账号
     * @param {String} id 组织机构id
     * @param {Object} accountData 管理员信息
     */
    modifyAccountInfo(id, accountData) {
        return Fetch({
            url: '/sys/units/' + id + '/managers/' + accountData.username,
            method: 'put',
            data: accountData
        });
    },
    /**
     * 修改人员信息
     * @param {String} id 组织机构id
     * @param {Object} accountData 管理员信息
     */
    modifyManageInfo(id, accountData) {
        return Fetch({
            url: '/sys/units/' + id + '/managers/' + accountData.id + '/info/',
            method: 'put',
            data: accountData
        });
    },
    /**
     * 查询管理员菜单
     * @param {String} id 组织机构id
     * @param {String} userName 管理员帐号
     */
    getMenuOfManager(id, userName) {
        return Fetch({
            url: '/sys/units/' + id + '/managers/' + userName + '/menus',
            method: 'get'
        });
    },
    /**
     * 删除管理员
     * @param {String} id 组织机构id
     * @param {String} manageid 管理员帐号id
     */
    delAccount(id, manageid) {
        return Fetch({
            url: '/sys/units/' + id + '/managers/' + manageid,
            method: 'delete'
        });
    },
    /**
     * 获取轮播图配置列表
     */
    getLoopPics() {
        return Fetch({
            url: '/base/looppics',
            method: 'get'
        });
    },
    /**
     * 修改密码
     */
    editPassword(id, username, formData) {
        return Fetch({
            url: '/sys/units/' + id + '/managers/' + username + '/pwd',
            method: 'put',
            data: formData
        });
    },
    /**
     * 获取轮播图内容列表
     * @param {String} type 类型
     */

    getLoopContents(type, unitId) {
        let user = store.getters.user;
        let searchunit = 'unitId=' + unitId;
        if (user.username === 'admin') {
            searchunit = '';
        }
        return Fetch({
            url: '/base/looppics/' + type + '/contents?' + searchunit,
            method: 'get'
        });
    },
    /**
     * 获取轮播图内容详情
     * @param {String} type 配置type
     */
    getLoopContentDetail(type, cid) {
        return Fetch({
            url: '/base/looppics/' + type + '/contents/' + cid,
            method: 'get'
        });
    },
    /**
     * 删除轮播图内容
     * @param {String} type 配置type
     */
    deleteLoopContent(type, cid) {
        return Fetch({
            url: '/base/looppics/' + type + '/contents/' + cid,
            method: 'delete'
        });
    },
    /**
     * 启用轮播图内容
     * @param {String} type 配置type
     * @param {String} data 轮播图内容id
     */
    loopContentTrue(type, cid) {
        return Fetch({
            url: '/base/looppics/' + type + '/contents/' + cid + '/true',
            method: 'put'
        });
    },
    /**
     * 停用轮播图内容
     * @param {String} type 配置type
     * @param {String} cid 轮播图内容id
     */
    loopContentFalse(type, cid) {
        return Fetch({
            url: '/base/looppics/' + type + '/contents/' + cid + '/false',
            method: 'put'
        });
    },
    /**
     * 保存轮播图内容
     * @param {String} type 配置type
     * @param {String} data 轮播图内容
     */
    saveLoopContents(type, data) {
        return Fetch({
            url: '/base/looppics/' + type + '/contents',
            method: 'post',
            data: data
        });
    },
    /**
     * 编辑轮播图内容
     * @param {String} type 配置type
     * @param {String} cid 轮播图内容id
     */
    updateLoopContent(type, cid, data) {
        return Fetch({
            url: '/base/looppics/' + type + '/contents/' + cid,
            method: 'put',
            data: data
        });
    },
    /**
     * 创建文化品牌
     */
    createBrand(data) {
        return Fetch({
            url: '/issue/brands',
            method: 'post',
            data: data
        });
    },
  /**
     * 删除文化品牌
     */
    delBrand(id) {
        return Fetch({
            url: '/issue/brands/' + id,
            method: 'delete'
        });
    },
    /**
     * 编辑文化品牌
     */
    modifyBrand(id, data) {
        return Fetch({
            url: '/issue/brands/' + id,
            method: 'put',
            data: data
        });
    },
    /**
     * 获取文化品牌列表
     */
    getBrandList(str, page, size) {
        return Fetch({
            url: '/issue/brands?search=' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    /**
     * 获取品牌资源列表
     */
    getBrandInfoList(id) {
        return Fetch({
            url: '/issue/brands/' + id + '/digitals',
            method: 'get'
        });
    },

    /**
     * 创建文化品牌资源
     */
    createBrandInfo(id, data) {
        return Fetch({
            url: '/issue/brands/' + id + '/digitals',
            method: 'post',
            data: data
        });
    },

    /**
     * 编辑文化品牌资源
     */
    modifyBrandInfo(id, did, data) {
        return Fetch({
            url: '/issue/brands/' + id + '/digitals/' + did,
            method: 'put',
            data: data
        });
    },

    /**
     * 删除文化品牌资源
     */
    delBrandInfo(id, did) {
        return Fetch({
            url: '/issue/brands/' + id + '/digitals/' + did,
            method: 'delete'
        });
    },

    /**
     * 查看文化品牌资源详情
     */
    getBrandInfo(id, did) {
        return Fetch({
            url: '/issue/brands/' + id + '/digitals/' + did,
            method: 'get'
        });
    },

    /**
     * 查看文化品牌详情
     */
    getBrand(id) {
        return Fetch({
            url: '/issue/brands/' + id,
            method: 'get'
        });
    },
    /**
     * 上架文化品牌
     */
    setBrandPublish(id) {
        return Fetch({
            url: '/issue/brands/' + id + '/publish/true',
            method: 'put'
        });
    },
    /**
     * 下架文化品牌
     */
    setBrandUnPublish(id) {
        return Fetch({
            url: '/issue/brands/' + id + '/publish/false',
            method: 'put'
        });
    },

    /**
     * 创建漂浮广告
     */
    createAdvert(data) {
      return Fetch({
        url: '/base/floatAdvert',
        method: 'post',
        data: data
      });
    },
    /**
     * 编辑广告
     */
    modifyAdvert(id, data) {
      return Fetch({
        url: '/base/floatAdvert/' + id,
        method: 'put',
        data: data
      });
    },
    /**
     * 查看广告详情
     */
    getAdvert(id) {
      return Fetch({
        url: '/base/floatAdvert/' + id,
        method: 'get'
      });
    },
    /**
     * 获取漂浮广告列表
     */
    getAdvertList(str, page, size) {
      return Fetch({
        url: '/base/floatAdvert?search=' + str + pageInfo(page, size),
        method: 'get'
      });
    },

    /**
     * 启用轮播图内容
     * @param {String} type 配置type
     * @param {String} data 轮播图内容id
     */
    advertContentTrue(cid) {
      return Fetch({
        url: '/base/floatAdvert/contents/' + cid + '/true',
        method: 'put'
      });
    },
    /**
     * 停用轮播图内容
     * @param {String} type 配置type
     * @param {String} cid 轮播图内容id
     */
    advertContentFalse(cid) {
      return Fetch({
        url: '/base/floatAdvert/contents/' + cid + '/false',
        method: 'put'
      });
    },

    /**
     * 删除漂浮广告
     */
    delAdvert(id) {
      return Fetch({
        url: '/base/floatAdvert/' + id ,
        method: 'delete'
      });
    },


  /**
     *  获取所有系统参数
     */
    getParamList() {
        return Fetch({
            url: '/sys/params',
            method: 'get'
        })
    },
    /**
     * 设置参数值
     * @param name
     * @param value
     */
    setParamValue(name, value) {
        return Fetch({
            url: '/sys/params/' + name + '/' + value,
            method: 'put'
        })
    },
    /**
     * 评论审核
     *
     * @param {any} id 评论id
     * @param {any} status 状态
     */
    auditComment(id, status) {
        return Fetch({
            url: '/user/comments/' + id + '/audit/' + status,
            method: 'put'
        })
    },
    /**
     * 删除评论
     *
     * @param {any} id 评论id
     */
    delComment(id) {
        return Fetch({
            url: '/user/comments/' + id,
            method: 'delete'
        })
    },
    /**
     * 获取评论列表
     *
     * @param {String} str 查询条件
     * @param {Number} page 页码
     * @param {Number} size 每页显示数量
     */
    getComments(str, page, size) {
        return Fetch({
            url: '/user/comments?search=' + str + pageInfo(page, size),
            method: 'get'
        })
    }
}
export default accountRequests;
