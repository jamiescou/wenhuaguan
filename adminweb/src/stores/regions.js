import Api from '@/api'
import { REGIONS, REGIONS_CLEAR, LOCAL_REGIONS } from './types'
import { orderBy } from 'lodash'
import { session } from '@/util'

// 递归获取省级地区信息
function getRootRegion(region) {
    return Api.system.getRegion(region).then((rootR) => {
        if (rootR.level !== 1 && rootR.parentCode) {
            return getRootRegion(rootR.parentCode).then((res) => {
                return res;
            });
        } else { return rootR; }
    })
}

export default {
    state: {
        rootRegion: [],
        regions: []
    },
    mutations: {
        [REGIONS]: (state, { rootRegion, regions }) => {
            state.rootRegion = rootRegion;
            state.regions = regions;
            let cultRegions = {
                root: rootRegion,
                regions: regions
            }
            session(LOCAL_REGIONS, cultRegions)
        },
        /**
         * 删除信息
         */
        [REGIONS_CLEAR]: (state) => {
            state.rootRegion = [];
            state.regions = [];
            session(LOCAL_REGIONS, '')
        }
    },
    getters: {
        rootRegion: state => state.rootRegion,
        regions: state => state.regions
    },
    actions: {
        [REGIONS]({ commit }) {
            let cultRegions = session(LOCAL_REGIONS)
            if (cultRegions) {
                if (cultRegions.root && cultRegions.regions) {
                    commit(REGIONS, { rootRegion: cultRegions.root, regions: cultRegions.regions });
                }
            } else {
                return new Promise((resolve, reject) => {
                    Api.system.getUnitInfo('root').then((res) => {
                        getRootRegion(res.region).then((rootRegion) => {
                            // console.log('rootRegion', rootRegion)
                            Api.system.getAllRegion(rootRegion.code).then((regions) => {
                                let rootR = rootRegion;
                                regions.splice(0, 0, rootRegion);
                                let allR = orderBy(regions, ['code']);
                                commit(REGIONS, { rootRegion: rootR, regions: allR });
                                resolve();
                            })
                        })
                    }).catch(error => {
                        reject(error);
                    });
                })
            }
        }
    }
}
