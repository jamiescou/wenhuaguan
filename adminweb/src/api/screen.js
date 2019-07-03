import Fetch, { pageInfo } from './fetch';
const SupplyRequests = {
    /**
     * 获取大屏资源列表
     */
    getScreenList(str, page, size) {
        return Fetch({
            url: '/screen/screendisplays?search=' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    /**
     * 新增大屏资源
     */
    addScreen(formData) {
        return Fetch({
            url: '/screen/screendisplays',
            method: 'post',
            data: formData
        });
    },
    /**
     * 编辑大屏资源
     */
    editScreen(id, formData) {
        return Fetch({
            url: '/screen/screendisplays/' + id,
            method: 'put',
            data: formData
        });
    },
    /**
     * 删除大屏资源
     */
    delScreen(id) {
        return Fetch({
            url: '/screen/screendisplays/' + id,
            method: 'delete'
        });
    },
    /**
     * 查看详情
     */
    getScreen(id) {
        return Fetch({
            url: '/screen/screendisplays/' + id,
            method: 'get'
        });
    },

    /**
     * 发布/取消发布
     */
    publishScreen(id, isPublish) {
        return Fetch({
            url: '/screen/screendisplays/' + id + '/publish/' + isPublish,
            method: 'put'
        });
    }
}
export default SupplyRequests;
