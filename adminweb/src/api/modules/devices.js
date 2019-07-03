// ==============================================================
// 【GET】 /sys/devices 查询所有设备
// 【POST】 /sys/devices 添加设备
// 【GET】 /sys/devices/{id} 查看设备详情
// 【PUT】 /sys/devices/{id} 编辑设备
// 【DELETE】 /sys/devices/{id} 删除设备
// =========================  设备管理  ============================
import Fetch, { pageInfo } from '../fetch';

export const deviceRequests = {
    /**
     * 查询所有设备
     * @param {String} str 查询条件
     * @param {Number} page 页码
     * @param {Number} size 每页显示数量
     */
    getDevicesList(str, page, size) {
        return Fetch({
            url: '/sys/devices?' + pageInfo(page, size),
            method: 'get'
        });
    },
    /**
     *  添加设备
     * @param {Object} deviceInfo 设备信息
     */
    addDevice(deviceInfo) {
        return Fetch({
            url: '/sys/devices',
            method: 'post',
            data: deviceInfo
        });
    },
    /**
     * 查看设备详情
     * @param {String} id 设备id
     */
    getDeviceInfo(id) {
        return Fetch({
            url: '/sys/devices/' + id,
            method: 'get'
        });
    },
    /**
     * 编辑设备
     * @param {String} id id
     * @param {Object} deviceInfo 设备信息
     */
    modifyDeviceInfo(id, deviceInfo) {
        return Fetch({
            url: '/sys/devices/' + id,
            method: 'put',
            data: deviceInfo
        });
    },
    /**
     * 删除设备
     * @param {String} id 设备id
     */
    delDevice(id) {
        return Fetch({
            url: '/sys/devices/' + id,
            method: 'delete'
        });
    }
}
export default deviceRequests;
