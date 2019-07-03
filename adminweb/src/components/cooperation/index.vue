<template>
    <div>
        <el-select v-model="selectedProvince" placeholder="请选择省">
            <el-option v-for="item in provinces" :key="item.code" :label="item.name" :value="item.code">
            </el-option>
        </el-select>
        <el-select v-model="selectedCity" placeholder="请选择市">
            <el-option v-for="item in cities" :key="item.code" :label="item.name" :value="item.code">
            </el-option>
        </el-select>
        <el-select v-model="selectedBlock" placeholder="请选择区">
            <el-option v-for="item in blocks" :key="item.code" :label="item.name" :value="item.code">
            </el-option>
        </el-select>
    </div>
</template>

<script>
import Api from '@/api';
import { REGIONS } from '@/stores/types';
import { orderBy } from 'lodash'
export default {
    props: {
        code: {
            type: String
        }
    },
    data() {
        return {
            selectedProvince: '',
            selectedCity: '',
            selectedBlock: '',
            allRegion: [], // 省 下级区域
            provinces: [], // 省
            cities: [], // 市
            blocks: [], // 区
            isDefault: true,
            defaultValue: ''
        }
    },
    created() {
        let rootR = this.$store.getters.rootRegion;
        let allRegion = this.$store.getters.regions;
        if (!rootR || !allRegion || !allRegion.length) {
            this.$store.dispatch(REGIONS).then(() => {
                rootR = this.$store.getters.rootRegion;
                allRegion = this.$store.getters.regions;
                this.initData(rootR, allRegion);
            })
        } else {
            this.initData(rootR, allRegion);
        }
    },
    watch: {
        code(newVal, oldVal) {
            if (!newVal) return;
            if (this.isDefault) {
                this.defaultValue = newVal;
                this.initCode(newVal);
                this.isDefault = false;
            }
        },
        selectedProvince(newVal, oldVal) {
            if (!newVal || !this.allRegion || !this.allRegion.length) return;
            this.cities = this.allRegion.filter(x => x.parentCode === newVal);
            // 此时在渲染DOM,渲染结束之后再选中第一个
            this.selectedCity = this.cities[0].code;
        },
        selectedCity(newVal) {
            if (!newVal || !this.allRegion || !this.allRegion.length) return;
            this.blocks = this.allRegion.filter(x => x.parentCode === newVal);
            if (newVal === '-1') {
                this.selectedBlock = '';
            } else {
                this.selectedBlock = this.blocks[0].code;
            }
        },
        selectedBlock() {
            this.$nextTick(() => {
                this.$emit('input', this.selectedBlock)
            })
        }
    },
    methods: {
        initData(province, provinceRegion) {
            // 设置省
            this.selectedProvince = province.code;
            let allRegion = provinceRegion.filter(x => x.code !== province.code); // 省级地区下的区域
            this.provinces = [province];
            let tipOpt = {
                code: '-1',
                name: '请选择市',
                parentCode: this.selectedProvince
            };
            allRegion.push(tipOpt)
            allRegion = orderBy(allRegion, ['code']);
            this.allRegion = allRegion;
            if (this.defaultValue !== '') {
                this.initCode(this.defaultValue);
                this.isDefault = false;
            }
        },
        initCode(code) {
            this.$nextTick(() => {
                if (this.allRegion.length) {
                    let initCode = this.allRegion.find(x => x.code === code);
                    if (initCode) {
                        this.selectedCity = initCode.parentCode;
                        setTimeout(() => {
                            this.selectedBlock = code;
                        }, 0);
                    }
                }
            })
        }
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
</style>
