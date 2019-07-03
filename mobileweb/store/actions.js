import axios from 'axios'
import uniqWith from 'lodash/uniqWith'
import isEqual from 'lodash/isEqual'
import { saveToLocal, loadFromLocal, removeFromLocal } from '../util/store';

function saveUser(userId) {
    let expiresDate = new Date();
    expiresDate.setMonth(expiresDate.getMonth() + 1);
    let authUser = {
        id: userId,
        expires_in: expiresDate.getTime() // 过期时间
    }
    saveToLocal('cn.creatoo.hn', 'user', authUser);
}

export default {
    nuxtServerInit({ commit, state }, { req, route }) {
        if (req.session && req.session.user) {
            commit('SET_USER', req.session.user)
        }
        // let originalUrl = route.fullPath;
        // if (!state.enterUrl && originalUrl.indexOf("socket.io") === -1) {
        //     let protocol = req.protocol || 'http://';
        //     let url = protocol + req.headers.host + originalUrl;
        //     console.log('enterUrl:' + url)
        //     commit('SET_URL', url)
        // }
        if (req.curUnit) {
            commit('SET_UNIT', req.curUnit)
        }
    },

    async login({ commit, dispatch }, { mobile, password }) {
        try {
            let res = await axios.post('/user/login', {
                mobile,
                password
            })

            const { data } = res
            if (res.status === 200 && data.success) {
                commit('SET_USER', data.user)
            }
            return data
        } catch (e) {
            if (e.response.status === 401) {
                throw new Error('来错地方了')
            }
        }
    },
    async wxlogin({ commit, dispatch }, uid) {
        try {
            let res = await axios.post('/user/wxlogin', uid)
            const { data } = res
            if (res.status === 200 && data.success) {
                commit('SET_USER', data.user)
            }
            return data
        } catch (e) {
            throw new Error('来错地方了')
        }
    },

    async logout({ commit }) {
        await axios.post('/user/loginOut')

        removeFromLocal('cn.creatoo.hn', 'user');
        commit('SET_USER', null)
    },

    // 更新用户信息
    async fetchUsers({ commit }) {
        let localUser = loadFromLocal('cn.creatoo.hn', 'user', null);
        if (localUser && localUser.id) {
            const { data } = await axios.get('/user/info/' + localUser.id);
            commit('SET_USER', data);
        }
    },

    async setWeAuth({ commit }, data) {
        commit('SET_WEAUTH', data);
    },

    // 存储搜索数据
    async setSearch({ commit }, data) {
        commit('SET_SEARCH', data);
    },

    // 客户验证用户
    async valid({ commit, dispatch, state }) {
        // 1、如果本地存在，state.user不存在，根据本地数据中的过期时间判断是否过期，未过期，根据key更新用户信息，已过期清除用户信息
        // 2、如果本地不存在，state.user存在，存在到本地
        let localUser = loadFromLocal('cn.creatoo.hn', 'user', null);
        if ((!localUser && state.user) || (localUser && state.user && localUser.id !== state.user.id)) {
            // console.log('客户验证用户:存本地');
            saveUser(state.user.id);
        } else if (localUser && !state.user) {
            // console.log('客户验证用户:比较');
            if (localUser.id && localUser.expires_in) {
                const expiresIn = localUser.expires_in
                const now = (new Date().getTime())
                if (now < expiresIn) {
                    await dispatch('fetchUsers'); // 未过期，更新用户信息
                } else {
                    await dispatch('logout'); // 过期了清除用户信息
                }
            }
        }
    },

    // // 客户端初始化用户信息(区域、当前所属文化馆)
    async clientInit({ commit, state }) {
        if (!state.region || !state.region.length) {
            const regions = await axios.get('/regions');
            commit('SET_REGIONS', regions.data)
        }
    },

    // 获取微信签名
    async getWechatSignature({ commit }, url) {
        return await axios.get(`/wechat/signature?url=${url}`);
    },

    async fetchCurrentTrain({ state }, order) {
        if (order.id === state.currentTrain.id) return
        order.signList = [];
        if (order.users && order.users.length) {
            await order.users.forEach(async element => {
                let { data } = await axios.post('/train/student', { id: order.trainId, idNumber: element.idnumber });
                order.signList = order.signList.concat(data);
            });
            order.signList = uniqWith(order.signList, isEqual); //去掉重复的
        }
        state.currentTrain = order

        return order
    },

    async updateCurrentTrain({ state }, { id, sign }) {
        if (id === state.currentTrain.id) {
            state.currentTrain.signList.push(sign); //去掉重复的
        }
    }
}
