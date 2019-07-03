const fetch = require('./fetch')
const assist = require('../util/assist')
class TaskModel {
    constructor() {
        this.result = {}
    }


    async cancelActivityOrder(id,reason) {
        let res = await fetch({
            url: '/activity/orders/' + id + '/cancel',
            data:reason,
            method: 'put',
        });
        return res;
    }

    async delActivityOrder(id) {
        let res = await fetch({
            // url: '/activity/orders/' + id,
            url:'/activity/orders/'+id+'/ishidden/true',
            method: 'put'
        });
        return res;
    }

    async cancelRoomOrder(id,reason) {
        let res = await fetch({
            url: '/venue/orders/' + id + '/cancel',
            data:reason,
            method: 'put'
        });
        return res;
    }
    
    async delRoomOrder(id) {
        let res = await fetch({
            url: '/venue/orders/'+id+'/ishidden/true',
            method: 'put'
        });
        return res;
    }

    async fetchUserTrainOrder(search, page, size) {
        let res = await fetch({
            url: '/train/orders?search=' + search + '&page=' + page + '&size=' + size,
            method: 'get',
        });
        return res;
    }
    async cancelTrainOrder(id,reason) {
        let res = await fetch({
            url: '/train/orders/' + id + '/cancel',
            data:reason,
            method: 'put',
        });
        return res;
    }
    async delTrainOrder(id) {
        let res = await fetch({
            url: '/train/orders/'+id+'/ishidden/true',
            method: 'put',
        });
        return res;
    }
    async fetchUserSave(id, type) {
        let res = await fetch({
            url: '/user/users/' + id + '/favorites/' + type,
            method: 'get',
        });
        return res;
    }

    async fetchUserInfo(id) {
        let res = await fetch({
            url: '/user/users/' + id,
            method: 'get',
        });
        return res;
    }

    async searchUserList(search) {
        const data = await fetch({
            url: '/user/users?search=' + search,
            method: 'get',
        });
        return data;
    }

    async userList(search) {
        const data = await fetch({
            url: '/user/users',
            method: 'get',
        });
        return data;
    }

    async updateUserInfo(id, userInfo) {
        const data = await fetch({
            url: '/user/users/' + id,
            method: 'put',
            data: userInfo
        });
        return data;
    }

    async addcontact(id, userInfo) {
        const data = await fetch({
            url: '/user/users/' + id + '/members',
            method: 'post',
            data: userInfo
        });
        return data;
    }

    async fetchcontact(id) {
        const data = await fetch({
            url: '/user/users/' + id + '/members',
            method: 'get',
        });
        return data;
    }

    async delcontact(id, idNumber) {
        const data = await fetch({
            url: '/user/users/' + id + '/members/' + idNumber,
            method: 'delete',
        });
        return data;
    }

    async fetchUserFavoritesStatus(userId, type, objectId) {
        let res = await fetch({
            url: '/user/users/' + userId + '/favorites/' + type + '/' + objectId,
            method: 'get'
        });
        return res;
    }

    async fetchUserFavorites(userId, type, page, size) {
        let res = await fetch({
            url: '/user/users/' + userId + '/favorites/' + type + '?search=' + '&page=' + page + '&size=' + size,
            method: 'get'
        });
        return res;
    }
    async cancelUserFavorites(userId, objectId) {
        let res = await fetch({
            url: '/user/users/' + userId + '/favorites/' + objectId,
            method: 'delete'
        });
        return res
    }

    async addUserFavorites(userId, favoriteObj) {
        let res = await fetch({
            url: '/user/users/' + userId + '/favorites',
            method: 'post',
            data: favoriteObj
        });
        return res
    }

    async favoritesCount(type,objectId){
        let res = await fetch({
            url: '/user/users/favoritescount/' + type + '/' + objectId,
            method: 'get',
        });
        return res
    }

    async cancelUserThumbup(userId, type, objectId) {
        let res = await fetch({
            url: '/user/users/' + userId + '/thumbup/' + type + '/' + objectId,
            method: 'delete',
        });
        return res
    }

    async addUserThumbup(userId, type, objectId) {
        let res = await fetch({
            url: '/user/users/' + userId + '/thumbup/' + type + '/' + objectId,
            method: 'post',
        });
        return res
    }

    async fetchUserThumbup(userId, type, objectId) {
        let res = await fetch({
            url: '/user/users/' + userId + '/thumbup/' + type + '/' + objectId,
            method: 'get',
        });
        return res
    }

    async fetchIdentifys(str) {
        let res = await fetch({
            url: '/user/identifys?'+str,
            method: 'get',
        });
        return res
    }

    async modifyUserInfo(userId, userInfo) {
        let res = await fetch({
            url: '/user/users/' + userId,
            method: 'put',
            data: userInfo
        });
        return res
    }

    async editpassword(pass, phone) {
        let res = await fetch({
            url: '/user/users/' + phone + '/pwd',
            method: 'put',
            data: pass
        });
        return res;
    }


    async login(type, params) {
        let res = await fetch({
            url: '/user/users/login/' + type,
            method: 'post',
            data: params
        });
        return res;
    }


    /**
     * 发送验证码
     */
    async sendVcodes(mobile) {
        const data = await fetch({
            url: '/user/vcodes?mobile=' + mobile,
            method: 'post'
        });
        return data;
    }

    /**
     * 校验验证码
     */
    async verifyVcodes(mobile, code) {
       
        const data = await fetch({
            url: '/user/vcodes/verify?mobile=' + mobile + '&code=' + code,
            method: 'get'
        });
        return data;
    }

    /**
     * 用户注册
     * @param {*} userInfo 
     */
    async submitRegister(userInfo) {
        userInfo.registerMode = 'pcweb';
        const data = await fetch({
            url: '/user/users',
            method: 'post',
            data: userInfo
        });
        return data;
    }

    /**
     * 活动问卷
     */
    async fetchanswer(id, userid) {
        const data = await fetch({
            url: '/activity/activitys/' + id + '/usersheets/' + userid,
            method: 'get'
        });
        return data;
    }

    async smrzload(workInfo) {
        let res = await fetch({
            url: '/user/identifys',
            method: 'post',
            data: workInfo
        });
        return res;
    }

    /**
     * 用户评论
     */
    async postComments(userId, comments) {
        let res = await fetch({
            url: '/user/users/' + userId + '/comments',
            method: 'post',
            data: comments
        });
        return res;
    }

    /**
     * 
     * @param {*} type 
     * @param {*} objectId 
     * @param {*} page 
     * @param {*} size 
     */
  async getComments(type,objectId,page,size) {

        let search = 'status:Pass';
        let getUrl = '';
        //['activity:活动','artexperts:文艺人才','artteams:文艺团队','volunrecruit;志愿者招募活动',
        //'supplys:文化配送','exhibit:数字展览','projects:非遗名录','successors:非遗传承人','train:培训', 
        //'venue:场馆','demands:点播','livevideos:直播','collect:作品征集','information：资讯']
    
        switch (type) {
            case 'activity':
                getUrl = '/activity/activitys/' + objectId + '/comments';
                break; //活动
            case 'artexperts':
                getUrl = '/cooperation/artexperts/' + objectId + '/comments';
                break; //文艺人才
            case 'artteams':
                getUrl = '/cooperation/artteams/' + objectId + '/comments';
                break; //文艺团队
            case 'volunrecruit':
                getUrl = '/volunteer/volunrecruit/' + objectId + '/comments';
                break; //志愿者招募活动
            case 'supplys':
                getUrl = '/delivery/supplys/' + objectId + '/comments';
                break; //文化配送
            case 'exhibit':
                getUrl = '/issue/exhibits/' + objectId + '/comments';
                break; //数字展览
            case 'projects':
                getUrl = '/heritage/projects/' + objectId + '/comments';
                break; //非遗名录
            case 'successors':
                getUrl = '/heritage/successors/' + objectId + '/comments';
                break; //非遗传承人
            case 'protections':
                getUrl = '/heritage/protections/' + objectId + '/comments';
                break; //非遗传承人
            case 'train':
                getUrl = '/train/trains/' + objectId + '/comments';
                break; //培训
            case 'venue':
                getUrl = '/venue/venues/' + objectId + '/comments';
                break; //场馆
            case 'room': 
                getUrl = '/venue/rooms/' + objectId + '/comments';
                break; //活动室
            case 'goodvideos':
                getUrl = '/vod/goodvideos/' + objectId + '/comments';
                break; //点播
            case 'livevideos':
                getUrl = '/vod/livevideos/' + objectId + '/comments';
                break; //直播
            case 'collect':
                getUrl = '/collect/activitys/' + objectId + '/comments';
                break; //作品征集
            case 'information':
                getUrl = '/issue/informations/' + objectId + '/comments';
                break; //资讯
            case 'CultrueBrand':
                getUrl = '/issue/brands/' + objectId + '/comments';
                break; //文化品牌
            case 'PhotographyArtWorks':
                getUrl = '/photographyCollect/activitys/' + objectId + '/comments';
                break; //赛事活动
            case 'PhotographyMemberWorks':
                getUrl = '/photographyMember/works/' + objectId + '/comments';
                break; //会员作品
            default:
                break
        }
    
        const data = await fetch({
            url: getUrl + '?search=' + search + '&page=' + page + '&size=' + size + '&sort=time~desc',
            method: 'get'
        });
    
        let userPic = {}; //同一个人多次评论减少请求次数
        for (var i = 0; i < data.content.length; i++) {
            let commentItem = data.content[i];
            if (!userPic[commentItem.userId]) {
                let commentUserInfo =await this.fetchUserInfo(commentItem.userId);
                commentItem.pic = assist.getFileUrl(commentUserInfo.pic);
             
                userPic[commentItem.userId] = commentItem.pic;
            } else {
                commentItem.pic = userPic[commentItem.userId];
            }
    
        }

        return data;
    }

}
module.exports = new TaskModel()