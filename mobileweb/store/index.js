import Vuex from 'vuex'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const createStore = () => {
    return new Vuex.Store({
        state: {
            enterUrl: null,
            user: null,
            weAuth: null,
            roomPreInfo: null, // 活动室预定信息
            unit: {
                id: '',
                name: '',
                logoPic: '',
                region: '',
                address: ''
            },
            regions: [],
            currentTrain: {},
            search: null
        },
        getters,
        actions,
        mutations
    })
}

export default createStore
