import Fetch, { pageInfo } from './fetch';
const StatisticsRequests = {
    /**
     * 获取通知列表
     */
    getGeneral() {
        return Fetch({
            url: '/report/user/general',
            method: 'get'
        });
    },
    /**
     * 新增通知
     */
    getUserbyMonth(str) {
        return Fetch({
            url: '/report/user/register/month?' + str,
            method: 'get'
        });
    },
    /**
     * 新增通知
     */
    getUserbyDay(str) {
        return Fetch({
            url: '/report/user/register/day?' + str,
            method: 'get'
        });
    },
    /**
     * 按月统计报名培训会员数
     */
    getUsertrainmonth(str) {
        return Fetch({
            url: '/report/user/train/month?' + str,
            method: 'get'
        });
    },
    /**
     * 按月统计报名培训会员数
     */
    getUserbyactivitydata(str) {
        return Fetch({
            url: '/report/user/activity/month?' + str,
            method: 'get'
        });
    },
    /**
     * 按照培训艺术形式统计发布量
     */
    getTrainform(str) {
        return Fetch({
            url: '/report/train/form',
            method: 'get'
        });
    },
    /**
     * 按照活动形式统计发布量
     */
    getActivityform(str) {
        return Fetch({
            url: '/report/activity/form',
            method: 'get'
        });
    },
    /**
     * 按照活动形式统计发布量
     */
    getVenuesform(str) {
        return Fetch({
            url: '/report/venue/type',
            method: 'get'
        });
    },
    /**
     * 按照活动地区统计发布量
     */
    getRegionalActivity(str) {
        return Fetch({
            url: '/report/activity/region?region=' + str,
            method: 'get'
        });
    },
    /**
     * 按照活动地区统计发布量
     */
    getRegionalVenues(str) {
        return Fetch({
            url: '/report/venue/region?region=' + str,
            method: 'get'
        });
    },
    /**
     * 按照活动地区统计发布量
     */
    getRegionalTrain(str) {
        return Fetch({
            url: '/report/train/region?region=' + str,
            method: 'get'
        });
    },
    /**
     * 按月统计活动发布情况,格式：yyyyMM
     */
    getActivitybymonth(str) {
        return Fetch({
            url: '/report/activity/month?' + str,
            method: 'get'
        });
    },
    /**
     * 按月统计活动发布情况,格式：yyyyMM
     */
    getVenuesbymonth(str) {
        return Fetch({
            url: '/report/venue/month?' + str,
            method: 'get'
        });
    },
    /**
     * 按月统计活动发布情况,格式：yyyyMM
     */
    getTrainbymonth(str) {
        return Fetch({
            url: '/report/train/month?' + str,
            method: 'get'
        });
    },
    /**
     * 按月统计活动发布情况,格式：yyyyMM
     */
    getActivitybystatistics(str, page, size) {
        return Fetch({
            url: '/report/activity/data?' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    /**
     * 按月统计活动发布情况,格式：yyyyMM
     */
    getVenuesbystatistics(str, page, size) {
        return Fetch({
            url: '/report/venue/usageRate?' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    /**
     * 按月统计活动发布情况,格式：yyyyMM
     */
    getTrainbystatistics(str, page, size) {
        return Fetch({
            url: '/report/train/data?' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    /**
     * 按照资讯栏目统计发布量
     */
    getInformationForm(str) {
        return Fetch({
            url: '/report/information/form',
            method: 'get'
        });
    },
    /**
     * 资讯发布月统计,格式：yyyyMM
     */
    getInformationByMonth(str) {
        return Fetch({
            url: '/report/information/month?' + str,
            method: 'get'
        });
    }
}
export default StatisticsRequests;
