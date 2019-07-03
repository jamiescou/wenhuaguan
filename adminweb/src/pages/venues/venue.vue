<template>
    <div class="edit-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'venuesmanage',name: '场馆管理' },{name:title}]"></v-pageheader>
        <div class="form-wrapper">
            <el-form ref="venueForm" :model="venueForm" :rules="rules" label-position="right" label-width="100px" class="m-form">
                <el-row :gutter="10">
                    <el-col :span="14">
                        <el-form-item label="场馆名称：" prop="name">
                            <el-input v-model="venueForm.name" :maxlength="40"></el-input>
                        </el-form-item>
                        <el-form-item label="类别：" prop="type">
                            <el-select v-model="venueForm.type">
                                <v-option typeName="venueType"></v-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="联系人：" prop="contact">
                            <el-input v-model="venueForm.contact"></el-input>
                        </el-form-item>
                        <el-form-item label="联系电话：" prop="contactMobile">
                            <el-input v-model="venueForm.contactMobile"></el-input>
                        </el-form-item>
                        <el-form-item label="开放时间：" prop="openDateTime">
                            <el-input v-model="venueForm.openDateTime"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label-width="0" prop="pic">
                            <v-cropper class="cover" btnTxt="请选择封面图片" :imgUrl='venuePic' :upload="handleUpload" @remove="removeImg"></v-cropper>
                            <el-input v-model="venueForm.pic" v-show="false"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="所属区域" required>
                    <el-col :span="18">
                        <el-form-item prop="region" class="cooperation">
                            <v-cooperation v-model="venueForm.region" :code="venueForm.region" ref="cooperationRegion"></v-cooperation>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item prop="address">
                            <el-input v-model="venueForm.address" placeholder="请输入详细地址"></el-input>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="地图坐标：" required>
                    <el-col :span="10" class="pd-r-10">
                        <el-form-item prop="coordinate.longitude">
                            <el-input v-model="venueForm.coordinate.longitude" readonly disabled>
                                <template slot="prepend">X</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10" class="pd-r-10">
                        <el-form-item prop="coordinate.latitude">
                            <el-input v-model="venueForm.coordinate.latitude" readonly disabled>
                                <template slot="prepend">
                                    Y
                                </template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-button @click="handleShowMap" type="primary" class="u-btn">查询坐标</el-button>
                    </el-col>
                </el-form-item>
                <el-form-item label="场馆简介：" prop="brief">
                    <el-input type="textarea" v-model="venueForm.brief"></el-input>
                </el-form-item>
                <el-form-item label="场馆描述：" prop="desc">
                    <v-richeditor v-model="venueForm.desc" ref="richEditor"></v-richeditor>
                </el-form-item>
                <div class="form-opres">
                    <el-button @click="back" class="u-btn">返回</el-button>
                    <el-button @click="submitForm" type="primary" class="u-btn">确定</el-button>
                </div>

            </el-form>
        </div>
        <el-dialog v-model="showMap" title="查询坐标" class="map-dialog">
            <v-gdmap v-if="showMap" :coordinate="getCoordinate" :addr="addrAllName" ref="gdmap" :searchType="searchType"></v-gdmap>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showMap = false">取 消</el-button>
                <el-button type="primary" @click="handleGetCoordinate">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import Api from '@/api';
import vRules from '@/config/validate_rules';
const DIALOG = {
    add: {
        title: '添加场馆',
        flag: 'Add'
    },
    edit: {
        title: '编辑场馆',
        flag: 'Edit'
    }
};
export default {
    data() {
        return {
            searchType: "",
            addrAllName: '',
            title: DIALOG.add.title,
            flag: DIALOG.add.flag,
            venuePic: '',
            venueForm: {
                // id: '',
                name: '',
                region: '',
                type: '',
                unitId: '',
                address: '',
                contact: '',
                contactMobile: '',
                openDateTime: '',
                desc: '',
                pic: '',
                brief: '',
                coordinate: {
                    longitude: '',
                    latitude: ''
                }
            },
            rules: {
                pic: [vRules.required_Msg('没有选择封面图片或图片上传中')],
                name: [vRules.required, vRules.maxLen(40)],
                type: [vRules.requiredSelect],
                'coordinate.longitude': [vRules.required],
                'coordinate.latitude': [vRules.required],
                openDateTime: [vRules.required],
                region: [vRules.required],
                contactMobile: [vRules.required, vRules.telPattern],
                address: [vRules.required],
                brief: [vRules.required],
                contact: [vRules.required, vRules.maxLen(200)],
                desc: [vRules.required]
            },
            img: '',
            showMap: false,
            position: {
                longitude: '',
                latitude: ''
            }
        }
    },
    methods: {
        // 返回
        back() {
            this.$router.go(-1);
        },
        // 显示地图
        handleShowMap() {
            this.showMap = true;
            if (this.venueForm.coordinate.longitude != null && this.venueForm.coordinate.longitude != "" && this.venueForm.coordinate.longitude != undefined) {
                this.searchType = "poi";
                this.$nextTick(() => {
                    this.$refs.gdmap.lng = this.venueForm.coordinate.longitude;
                    this.$refs.gdmap.lat = this.venueForm.coordinate.latitude;
                    this.$refs.gdmap.search.events.init;
                });
            } else {
                this.searchType = "address";
                let selectedProvinceCode = this.$refs.cooperationRegion.selectedProvince;
                let selectedCityCode = this.$refs.cooperationRegion.selectedCity;
                let selectedBlockCode = this.$refs.cooperationRegion.selectedBlock;
                let provinces = this.$refs.cooperationRegion.provinces;
                let cities = this.$refs.cooperationRegion.cities;
                let blocks = this.$refs.cooperationRegion.blocks;
                let allName = "";
                let selectedProvinceName = {};
                selectedProvinceName = provinces.find(item => {
                    //这里的provinces就是上面遍历的数据源
                    return item.code === selectedProvinceCode; //筛选出匹配的省级数据
                });
                if (selectedCityCode != "-1") {
                    let selectedCityName = {};
                    selectedCityName = cities.find(item => {
                        //这里的cities就是上面遍历的数据源
                        return item.code === selectedCityCode; //筛选出匹配的市级数据
                    });
                    allName += selectedCityName.name;
                }
                if (selectedBlockCode != "") {
                    let selectedBlockyName = {};
                    selectedBlockyName = blocks.find(item => {
                        //这里的blocks就是上面遍历的数据源
                        return item.code === selectedBlockCode; //筛选出匹配的区数据
                    });
                    allName += selectedBlockyName.name;
                }
                allName += this.venueForm.address;
                this.addrAllName = allName;
                this.$nextTick(() => {
                    this.$refs.gdmap.search.events.init;
                });
            }
        },
        // 上传图片
        handleUpload(formData) {
            Api.system.uploadFile(formData, 'pic').then((res) => {
                this.venueForm.pic = res.url;
            })
        },
        // 删除图片
        removeImg() {
            this.venueForm.pic = '';
        },
        // 人员操作回调函数
        callback() {
            this.showTip();
            this.back();
        },
        // 提交场馆信息
        submitForm() {
            this.$refs['venueForm'].validate((valid) => {
                if (valid) {
                    // let content = this.$refs.richEditor.getUEContent(); // 调用子组件方法
                    // this.venueForm.desc = content;
                    let newForm = {
                        name: this.venueForm.name,
                        type: this.venueForm.type,
                        unitId: this.venueForm.unitId,
                        address: this.venueForm.address,
                        contact: this.venueForm.contact,
                        contactMobile: this.venueForm.contactMobile,
                        desc: this.venueForm.desc,
                        pic: this.venueForm.pic,
                        region: this.venueForm.region,
                        coordinate: this.venueForm.coordinate,
                        openDateTime: this.venueForm.openDateTime,
                        brief: this.venueForm.brief
                    };
                    if (this.flag === DIALOG.add.flag) {
                        newForm.dataDeptId = this.$store.getters.user.unit.id;
                        Api.venue.addVenue(newForm).then(this.callback);
                    } else if (this.flag === DIALOG.edit.flag) {
                        newForm.id = this.venueForm.id;
                        Api.venue.modifyVenue(newForm.id, newForm).then(this.callback);
                    }
                }
            });
        },
        /**
         * 查询定位坐标
         */
        getCoordinate(lng, lat) {
            this.position = {
                longitude: lng,
                latitude: lat
            };
        },
        // 定位确定
        handleGetCoordinate() {
            if (this.position.longitude !== '0' || this.position.latitude !== '0') {
                this.venueForm.coordinate = this.position;
            }
            this.showMap = false;
        },
        // 获取场馆详细信息
        getDetail() {
            Api.venue.getVenue(this.id).then((res) => {
                // if (res.openDateTime) res.openDateTime = this.convertToDate(res.openDateTime);
                this.venueForm = res;
                this.venuePic = Api.system.getFileUrl(this.venueForm.pic);
            });
        },
        pickerOptions() { }
    },
    mounted() {
        this.id = this.$route.query.id;
        if (this.id) {
            this.title = DIALOG.edit.title;
            this.flag = DIALOG.edit.flag;
            this.getDetail();
        } else {
            this.venueForm.unitId = this.$store.getters.user.orgUnit.id;
        }
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
</style>
