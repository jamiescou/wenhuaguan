export default {
    SET_USER: (state, user) => {
        state.user = user
    },
    SET_WEAUTH: (state, user) => {
        state.weAuth = user
    },

    SELECTED_ROOM_TIME: (state, data) => {
        state.roomPreInfo = data;
    },
    SET_UNIT: (state, unit) => {
        state.unit = unit;
    },
    SET_REGIONS: (state, regions) => {
        state.regions = regions;
    },
    SET_URL: (state, url) => {
        state.enterUrl = url
    },
    SET_SEARCH: (state, key) => {
        state.search = key
    }
}
