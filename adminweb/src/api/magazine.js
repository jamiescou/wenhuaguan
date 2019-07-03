import Fetch, { pageInfo } from './fetch';
const nounsRequests = {
    /**
     * 创建杂志
     */
    creatMagazine(data) {
        return Fetch({
            url: '/magazine/magazines',
            method: 'post',
            data: data
        });
    },
    /**
     * 获取杂志列表
     */
    getMagazineList(str, page, size) {
        return Fetch({
            url: '/magazine/magazines?search=' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    /**
     * 编辑杂志
     */
    modifyMagazine(id, data) {
        return Fetch({
            url: '/magazine/magazines/' + id,
            method: 'put',
            data: data
        });
    },
    /**
     * 删除杂志
     */
    delMagazine(id) {
        return Fetch({
            url: '/magazine/magazines/' + id,
            method: 'delete'
        });
    },
    /**
     * 查看杂志详情
     */
    getMagazine(id) {
        return Fetch({
            url: '/magazine/magazines/' + id,
            method: 'get'
        });
    },
    /**
     * 上架电子杂志
     */
    setMagazinePublish(id) {
        return Fetch({
            url: '/magazine/magazines/' + id + '/publish/true',
            method: 'put'
        });
    },
    /**
     * 下架电子杂志
     */
    setMagazineUnPublish(id) {
        return Fetch({
            url: '/magazine/magazines/' + id + '/publish/false',
            method: 'put'
        });
    },
    /**
     * 创建期刊
     */
    creatMagazineIssue(mid, data) {
        return Fetch({
            url: '/magazine/magazines/' + mid + '/issues',
            method: 'post',
            data: data
        });
    },
    /**
     * 查看期刊详情
     */
    getMagazineIssue(mid, id) {
        return Fetch({
            url: '/magazine/magazines/' + mid + '/issues/' + id,
            method: 'get'
        });
    },
    /**
     * 查询期刊列表
     */
    getMagazineIssueList(id, str, page, size) {
        return Fetch({
            url: '/magazine/magazines/' + id + '/issues?search=' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    /**
     * 编辑期刊
     */
    modifyMagazineIssue(mid, id, data) {
        return Fetch({
            url: '/magazine/magazines/' + mid + '/issues/' + id,
            method: 'put',
            data: data
        });
    },
    /**
     * 删除期刊
     */
    delMagazineIssue(mid, id) {
        return Fetch({
            url: '/magazine/magazines/' + mid + '/issues/' + id,
            method: 'delete'
        });
    },
    /**
     * 上架期刊
     */
    setMagazineIssuePublish(mid, id) {
        return Fetch({
            url: '/magazine/magazines/' + mid + '/issues/' + id + '/publish/true',
            method: 'put'
        });
    },
    /**
     * 下架期刊
     */
    setMagazineIssueUnPublish(mid, id) {
        return Fetch({
            url: '/magazine/magazines/' + mid + '/issues/' + id + '/publish/false',
            method: 'put'
        });
    },
    /**
     * 查询期刊列表
     */
    getContributeList(id, str, page, size) {
        return Fetch({
            url: '/magazine/magazines/' + id + '/contributions?search=' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    /**
     * 删除稿件
     */
    delContribute(mid, id) {
        return Fetch({
            url: '/magazine/magazines/' + mid + '/contributions/' + id,
            method: 'delete'
        });
    },
    /**
     * 查看期刊稿件详情
     */
    getContribute(mid, id) {
        return Fetch({
            url: '/magazine/magazines/' + mid + '/contributions/' + id,
            method: 'get'
        });
    },
    /**
     * 查询期刊资源目录列表
     */
    getMagazineDirectList(str, page, size) {
        return Fetch({
            url: '/magazine/directorys?search=' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    /**
     * 添加期刊资源目录
     */
    addMagazineDirect(dataForm) {
        return Fetch({
            url: '/magazine/directorys',
            method: 'post',
            data: dataForm
        });
    },
    /**
     * 删除期刊资源目录
     */
    delMagazineDirect(id) {
        return Fetch({
            url: '/magazine/directorys/' + id,
            method: 'delete'
        });
    },
    /**
     * 编辑期刊资源目录
     */
    modifyMagazineDirect(id, dataForm) {
        return Fetch({
            url: '/magazine/directorys/' + id,
            method: 'put',
            data: dataForm
        });
    },
    /**
     *增加资源文件
     */
    addMagazineFile(id, dataForm) {
        return Fetch({
            url: '/magazine/directorys/' + id + '/files',
            method: 'post',
            data: dataForm
        });
    },
    /**
     *删除资源文件
     */
    delMagazineFile(id, fid) {
        return Fetch({
            url: '/magazine/directorys/' + id + '/files/' + fid,
            method: 'delete'
        });
    },
    /**
     *获取资源文件列表
     */
    getMagazineFiles(id, str, page, size) {
        return Fetch({
            url: '/magazine/directorys/' + id + '/files?search=' + str + pageInfo(page, size),
            method: 'get'
        });
    },
     /**
     *编辑资源文件
     */
    modifyMagazineFiles(pid, id, dataForm) {
        return Fetch({
            url: '/magazine/directorys/' + pid + '/files/' + id,
            method: 'put',
            data: dataForm
        });
    }
}
export default nounsRequests;
