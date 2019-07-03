import * as types from './types'
import Api from '@/api'
import { session } from '@/util'

export default {
    // 应用状态的数据结构
    state: {
        info: {
            name: '',
            id: '',
            orgUnit: { id: '', name: '' },
            logo: ''
        },
        accesstoken: {},
        remandField: 'topTime3'
    },
    // 唯一允许更新应用状态的地方
    mutations: {
        /**
         * 存储信息
         */
        [types.LOGIN]: (state, user) => {
            state.info = user;
        },
        /**
         * 存储Token
         */
        [types.TOKEN]: (state, token) => {
            state.accesstoken = token;
            session(types.LOCAL_TOKEN, token)
        },
        /**
         * 删除信息
         */
        [types.LOGOUT]: (state) => {
            state.accesstoken = {};
            state.info = {};
            state.topMenu = [];
            state.remandField = 1;
            session(types.LOCAL_TOKEN, '')
            sessionStorage.removeItem('allchildren')
            sessionStorage.removeItem('orgchildren')
        },
        [types.REMAND_FIELD]: (state, level) => {
            state.remandField = level;
        }
    },
    // Getters 允许组件从 Store 中获取数据
    getters: {
        token: state => state.accesstoken,
        user: state => state.info,
        AuditUser: function(state) {
            return { userId: state.info.id, userName: state.info.name }
        },
        remandField: state => state.remandField
    },
    actions: {
        [types.REFRESH]({ commit }) {
            let local = session(types.LOCAL_TOKEN)
            if (local) {
                commit(types.TOKEN, local)
            }
        },
        // 获取用户信息
        [types.USERINFO]({ commit, state }) {
            return new Promise((resolve, reject) => {
                Api.system.getLoginUserInfo().then(res => {
                    let user = res;
                    user.loginTime = new Date();
                    if (res.orgUnit) {
                        user.logo = Api.system.getFileUrl(res.orgUnit.logoPic);
                    }

                    commit(types.LOGIN, user);
                    resolve(res);
                }).catch(error => {
                    reject(error);
                });
            });
        },
        // 登录
        Login({ commit }, userInfo) {
            const username = userInfo.username.trim()
            return new Promise((resolve, reject) => {
                Api.system.requestToken({ username: username, password: userInfo.password, grant_type: 'password' }).then(response => {
                    let token = {
                        logintime: new Date(),
                        tokenType: response.token_type,
                        refreshToken: response.refresh_token,
                        expiresIn: response.expires_in,
                        scope: response.scope,
                        accesstoken: response.access_token
                    }
                    commit(types.TOKEN, token)
                    resolve(token)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 登出
        [types.LOGOUT]({ commit, state }) {
            commit(types.LOGOUT)
            console.log('退出成功');
        }
    }
}
