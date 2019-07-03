// ================================================================
// 【GET】 /heritage/projects 查询名录列表
// 【POST】 /heritage/projects 创建名录
// 【GET】 /heritage/projects/{id} 查看名录详情
// 【PUT】 /heritage/projects/{id} 编辑名录
// 【DELETE】 /heritage/projects/{id} 删除名录
// 【GET】 /heritage/projects/{id}/coverPic 获取封面图片
// 【DELETE】 /heritage/projects/{id}/coverPic 删除封面图片
// 【PUT】 /heritage/projects/{id}/onlineStatus 变更上线状态
// 【PUT】 /heritage/projects/{id}/top/true 置顶名录
// 【PUT】 /heritage/projects/{id}/top/false 取消置顶

// 【GET】/heritage/successors 查询传承人列表
// 【POST】/heritage/successors 创建传承人
// 【GET】/heritage/successors/{id} 查看传承人详情
// 【PUT】/heritage/successors/{id} 编辑传承人
// 【DELETE】/heritage/successors/{id} 删除传承人
// 【GET】/heritage/successors/{id}/coverPic 获取封面图片
// 【DELETE】/heritage/successors/{id}/coverPic 删除封面图片
// 【PUT】/heritage/successors/{id}/onlineStatus 变更上线状态
// 【PUT】/heritage/successors/{id}/top/true 置顶传承人
// 【PUT】/heritage/successors/{id}/top/false 取消置顶
// =========================  场馆管理  ============================
import Fetch, { pageInfo } from './fetch';
const heritageRequests = {
    /**
     * 查询名录列表
     * @param {String} str 查询条件
     * @param {Number} page 页码
     * @param {Number} size 每页显示数量
     */
    getHeritageList(str, page, size) {
        return Fetch({
            url: '/heritage/projects?search=' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    /**
     *  创建名录
     * @param {Object} data 名录信息
     */
    addHeritage(data) {
        return Fetch({
            url: '/heritage/projects',
            method: 'post',
            data: data
        });
    },
    /**
     *  查看名录详情
     * @param {String} id 传承人id
     */
    getHeritage(id) {
        return Fetch({
            url: '/heritage/projects/' + id,
            method: 'get'
        });
    },
    /**
     * 获取封面图片
     * @param {String} id 传承人id
     */
    getHeritageCover(id) {
        return Fetch({
            url: '/heritage/projects/' + id + '/coverPic',
            method: 'get',
            responseType: 'blob'
        });
    },
    /**
     * 删除封面图片
     * @param {String} id 传承人id
     */
    delHeritageCover(id) {
        return Fetch({
            url: '/heritage/projects/' + id + '/coverPic',
            method: 'delete'
        });
    },
    /**
     *  查看名录详情包括图片
     * @param {String} id 传承人id
     */
    getHeritageDetail(id) {
        let info = this.getHeritage(id);
        let cover = this.getHeritageCover(id);
        var result = Promise.all([info, cover]);
        return result;
    },
    /**
     *  编辑名录
     * @param {String} id 传承人id
     * @param {Object} data 名录信息
     */
    modifyHeritage(id, data) {
        return Fetch({
            url: '/heritage/projects/' + id,
            method: 'put',
            data: data
        });
    },
    /**
     *  删除名录
     * @param {String} id 传承人id
     */
    delHeritage(id) {
        return Fetch({
            url: '/heritage/projects/' + id,
            method: 'delete'
        });
    },
    /**
     *  变更上线状态
     * @param {String} id 传承人id
     * @param {Object} data 状态信息
     */
    modifyHeritageStatus(id, data) {
        return Fetch({
            url: '/heritage/projects/' + id + '/onlineStatus',
            method: 'put',
            data: data
        });
    },
    /**
     * 置顶名录/取消置顶
     * @param {String} id  传承人id
     * @param {Bolean} recommend  true置顶 false取消置顶
     */
    setTop(id, recommend) {
        return Fetch({
            url: '/heritage/projects/' + id + '/top/' + recommend,
            method: 'put'
        });
    },

    /**
     * 查询传承人列表
     * @param {String} str 查询条件
     * @param {Number} page 页码
     * @param {Number} size 每页显示数量
     */
    getSuccessorList(str, page, size) {
        return Fetch({
            url: '/heritage/successors?search=' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    /**
     *  创建传承人
     * @param {Object} data 传承人信息
     */
    addSuccessor(data) {
        return Fetch({
            url: '/heritage/successors',
            method: 'post',
            data: data
        });
    },
    /**
     *  查看传承人详情
     * @param {String} id 传承人id
     */
    getSuccessor(id) {
        return Fetch({
            url: '/heritage/successors/' + id,
            method: 'get'
        });
    },
    /**
     * 获取封面图片
     * @param {String} id 传承人id
     */
    getSuccessorCoverPic(id) {
        return Fetch({
            url: '/heritage/successors/' + id + '/coverPic',
            method: 'get',
            responseType: 'blob'
        });
    },
    /**
     * 删除封面图片
     * @param {String} id 传承人id
     */
    delSuccessorCoverPic(id) {
        return Fetch({
            url: '/heritage/successors/' + id + '/coverPic',
            method: 'delete'
        });
    },
    /**
     *  查看传承人详情包括图片
     * @param {String} id 传承人id
     */
    getSuccessorDetail(id) {
        let info = this.getSuccessor(id);
        let cover = this.getSuccessorCoverPic(id);
        var result = Promise.all([info, cover]);
        return result;
    },
    /**
     *  编辑传承人
     * @param {String} id 传承人id
     * @param {Object} data 传承人信息
     */
    modifySuccessor(id, data) {
        return Fetch({
            url: '/heritage/successors/' + id,
            method: 'put',
            data: data
        });
    },
    /**
     *  删除传承人
     * @param {String} id 传承人id
     */
    delSuccessor(id) {
        return Fetch({
            url: '/heritage/successors/' + id,
            method: 'delete'
        });
    },
    /**
     *  变更上线状态
     * @param {String} id 传承人id
     * @param {Object} data 状态信息
     */
    modifySuccessorStatus(id, data) {
        return Fetch({
            url: '/heritage/successors/' + id + '/onlineStatus',
            method: 'put',
            data: data
        });
    },
    /**
     * 置顶/取消置顶 传承人
     * @param {Boolean} isRecommend 是否置顶
     * @param {String} id 传承人id
     */
    setSuccessorTop(id, isRecommend) {
        return Fetch({
            url: '/heritage/successors/' + id + '/top/' + isRecommend,
            method: 'put'
        });
    },

    /**
     * 添加数字资源
     * @param {String} id 传承人id
     * @param {any} formData 数字资源
     * @returns
     */
    directoryAddDigicInfo(id, formData) {
        return Fetch({
            url: '/heritage/projects/' + id + '/digitinfos',
            method: 'post',
            data: formData
        });
    },
    /**
     * 获得数字资源列表
     * @param {String} id 传承人id
     * @returns
     */
    directoryDigicInfos(id) {
        return Fetch({
            url: '/heritage/projects/' + id + '/digitinfos',
            method: 'get'
        });
    },
    /**
     * 获得数字资源详情
     * @param {String} id 传承人id
     * @param {String} did 数字资源id
     * @returns
     */
    directoryDigicInfoDetail(id, did) {
        return Fetch({
            url: '/heritage/projects/' + id + '/digitinfos/' + did,
            method: 'get'
        });
    },
    /**
     * 编辑数字资源
     * @param {String} id 传承人id
     * @param {String} did 数字资源id
     * @returns
     */
    directoryDigicInfoModify(id, did, dataForm) {
        return Fetch({
            url: '/heritage/projects/' + id + '/digitinfos/' + did,
            method: 'put',
            data: dataForm
        });
    },
    /**
     * 删除数字资源
     * @param {String} id 传承人id
     * @param {String} did 数字资源id
     * @returns
     */
    directoryDigicInfoDelete(id, did) {
        return Fetch({
            url: '/heritage/projects/' + id + '/digitinfos/' + did,
            method: 'delete'
        });
    },
    /**
     * 添加数字资源
     * @param {String} id 传承人id
     * @param {any} formData 数字资源
     * @returns
     */
    successorAddDigicInfo(id, formData) {
        return Fetch({
            url: '/heritage/successors/' + id + '/digitinfos',
            method: 'post',
            data: formData
        });
    },
    /**
     * 获得数字资源列表
     * @param {String} id 传承人id
     * @returns
     */
    successorDigicInfos(id) {
        return Fetch({
            url: '/heritage/successors/' + id + '/digitinfos',
            method: 'get'
        });
    },
    /**
     * 获得数字资源详情
     * @param {String} id 传承人id
     * @param {String} did 数字资源id
     * @returns
     */
    successorDigicInfoDetail(id, did) {
        return Fetch({
            url: '/heritage/successors/' + id + '/digitinfos/' + did,
            method: 'get'
        });
    },
    /**
     * 编辑数字资源
     * @param {String} id 传承人id
     * @param {String} did 数字资源id
     * @returns
     */
    successorDigicInfoModify(id, did, dataForm) {
        return Fetch({
            url: '/heritage/successors/' + id + '/digitinfos/' + did,
            method: 'put',
            data: dataForm
        });
    },
    /**
     * 删除数字资源
     * @param {String} id 传承人id
     * @param {String} did 数字资源id
     * @returns
     */
    successorDigicInfoDelete(id, did) {
        return Fetch({
            url: '/heritage/successors/' + id + '/digitinfos/' + did,
            method: 'delete'
        });
    },
    /**
     * 查询展厅列表
     * @param {String} str 查询条件
     * @param {Number} page 页码
     * @param {Number} size 每页显示数量
     */
    getExhibitList(str, page, size) {
        return Fetch({
            url: '/heritage/exhibits?search=' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    /**
     * 添加展厅
     * @param {*} dataForm 展厅数据
     */
    addExhibit(dataForm) {
        return Fetch({
            url: '/heritage/exhibits',
            method: 'post',
            data: dataForm
        });
    },
    /**
     * 查看展厅详情
     * @param {*} id id
     */
    getExhibit(id) {
        return Fetch({
            url: '/heritage/exhibits/' + id,
            method: 'get'
        });
    },
    /**
     * 删除展厅
     * @param {*} id id
     */
    delExhibit(id) {
        return Fetch({
            url: '/heritage/exhibits/' + id,
            method: 'delete'
        });
    },
    /**
     * 编辑展厅
     * @param {*} id ID
     * @param {*} dataForm 展厅数据
     */
    modifyExhibit(id, dataForm) {
        return Fetch({
            url: '/heritage/exhibits/' + id,
            method: 'put',
            data: dataForm
        });
    },
    /**
     * 上下架展厅
     * @param {*} id id
     * @param {*} publish 是否上下架
     */
    isPublishExhibit(id, publish) {
        return Fetch({
            url: '/heritage/exhibits/' + id + '/publish/' + publish,
            method: 'put'
        });
    },
    /**
     * 获取单元列表
     * @param {*} id id
     */
    getExhibitUnitList(str, page, size) {
        return Fetch({
            url: '/heritage/units?search=' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    /**
     * 删除单元
     * @param {*}id id
     * @param {*}name 名称
     */
    delExhibitUnitList(id) {
        return Fetch({
            url: '/heritage/units/' + id,
            method: 'delete'
        });
    },
    /**
     * 添加展厅单元
     */
    addExhibitUnit(dataForm) {
        return Fetch({
            url: '/heritage/units/',
            method: 'post',
            data: dataForm
        });
    },
    /**
     * 编辑展厅单元
     */
    modifyExhibitUnit(id, dataForm) {
        return Fetch({
            url: '/heritage/units/' + id,
            method: 'put',
            data: dataForm
        });
    },
    /**
     * 查询作品列表
     * @param {String} str 查询条件
     * @param {Number} page 页码
     * @param {Number} size 每页显示数量
     */
    getWorksList(str, page, size) {
        return Fetch({
            url: '/heritage/works?search=' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    /**
     * 添加作品
     * @param {*} dataForm
     */
    addWorks(dataForm) {
        return Fetch({
            url: '/heritage/works',
            method: 'post',
            data: dataForm
        });
    },
    /**
     * 查看作品详情
     * @param {*} id id
     */
    getWorks(id) {
        return Fetch({
            url: '/heritage/works/' + id,
            method: 'get'
        });
    },
    /**
     * 删除作品
     * @param {*} id id
     */
    delWorks(id) {
        return Fetch({
            url: '/heritage/works/' + id,
            method: 'delete'
        });
    },
    /**
     * 编辑展厅
     * @param {*} id ID
     * @param {*} dataForm 展厅数据
     */
    modifyWorks(id, dataForm) {
        return Fetch({
            url: '/heritage/works/' + id,
            method: 'put',
            data: dataForm
        });
    },
    /**
     * 上下架展厅
     * @param {*} id id
     * @param {*} publish 是否上下架
     */
    isPublishWorks(id, publish) {
        return Fetch({
            url: '/heritage/works/' + id + '/publish/' + publish,
            method: 'put'
        });
    },
    /**
     * 创建非遗保护区
     */
    addHeritageArea(dataForm) {
        return Fetch({
            url: '/heritage/protections',
            method: 'post',
            data: dataForm
        });
    },
    /**
     * 获取非遗保护区列表
     */
    getHeritageAreaList(str, page, size) {
        return Fetch({
            url: '/heritage/protections?search=' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    /**
     *  获取非遗保区详情
     */
    getHeritageArea(id) {
        return Fetch({
            url: '/heritage/protections/' + id,
            method: 'get'
        });
    },
    /**
     * 删除非遗保护区
     */
    delHeritageArea(id) {
        return Fetch({
            url: '/heritage/protections/' + id,
            method: 'delete'
        });
    },
    /**
     * 编辑非遗保护区
     */
    modifyHeritageArea(id, dataForm) {
        return Fetch({
            url: '/heritage/protections/' + id,
            method: 'put',
            data: dataForm
        });
    },
    /**
     * 变更发布状态
     */
    statusHeritageArea(id, dataForm) {
        return Fetch({
            url: '/heritage/protections/' + id + '/onlineStatus',
            method: 'put',
            data: dataForm
        });
    },
    /**
     * 置顶保护区
     */
    topHeritageArea(id, status) {
        return Fetch({
            url: '/heritage/protections/' + id + '/top/' + status,
            method: 'put'
        });
    },
    /**
     * 获得下级所有区域
     */
    getAllChildRegion(code) {
        return Fetch({
            url: '/sys/regions/' + code + '/allchilds',
            method: 'get'
        });
    },
    /**
     * 获得直接下级区域
     */
    getDirectChilds(code) {
        return Fetch({
            url: '/sys/regions/' + code + '/directchilds',
            method: 'get'
        });
    },
    /**
     * 编辑区域
     */
    editRegion(id, dataForm) {
        return Fetch({
            url: '/sys/regions/' + id,
            method: 'put',
            data: dataForm
        });
    },
    /**
     * 获得区域列表
     */
    getRegions(str, page, size) {
        return Fetch({
            url: '/sys/regions?search=' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    /**
     * 获得区域
     */
    getRegionCode(code) {
        return Fetch({
            url: '/sys/regions/' + code,
            method: 'get'
        });
    }
}
export default heritageRequests;
