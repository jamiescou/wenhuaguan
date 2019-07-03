import Api from '@/api'

export default {
    state: {
        dicts: {}
    },
    mutations: {
        'ADD_DICT': (state, { dictName, dict }) => {
            state.dicts[dictName] = dict;
        }
    },
    getters: {
        dicts: state => state.dicts
    },
    actions: {
        'ADD_DICT': ({ commit, state }, dictName) => {
            return new Promise((resolve, reject) => {
                let result = state[dictName];
                if (!result) {
                    Api.system.getDicItem(dictName).then((res) => {
                        commit('ADD_DICT', { dictName, dict: res });
                        resolve(res);
                    }).catch((e) => reject(e));
                } else {
                    resolve(result);
                }
            })
        },
        'UPDATE_DICT': ({ commit, state }, dictName) => {
            return new Promise((resolve, reject) => {
                Api.system.getDicItem(dictName).then((res) => {
                    commit('ADD_DICT', { dictName, dict: res });
                    resolve(res);
                }).catch((e) => reject(e));
            })
        }
    }
}
