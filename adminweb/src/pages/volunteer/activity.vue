<template>
    <div class="edit-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'activity_list',name: '志愿者活动管理' },{name:title}]"></v-pageheader>
        <div class="form-wrapper">
            <el-form ref="nounsForm" :model="nounsForm" :rules="rules" label-position="right" label-width="120px" class="m-form">
                <el-form-item label="活动名称" prop="name">
                    <el-input v-model="nounsForm.name"></el-input>
                </el-form-item>
                <el-form-item label="封面图片" prop="coverPic">
                    <v-cropper class="cover" :imgUrl="cultureteamPic" :upload="handleUpload" @remove="removeImg"></v-cropper>
                    <el-input v-model="nounsForm.coverPic" v-show="false"></el-input>
                </el-form-item>
                <!--<el-form-item label="艺术分类" filterable prop="artType">
                    <el-checkbox-group v-model="nounsForm.artType">
                        <v-option typeName="artistClass" optType="check"></v-option>
                    </el-checkbox-group>
                </el-form-item>-->
                <el-form-item label="服务类别" prop="serviceTypes">
                    <el-checkbox-group v-model="nounsForm.serviceTypes">
                        <v-option typeName="volunteerServiceType" optType="check"></v-option>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="启动招募" prop="isStop">
                    <el-radio-group v-model="nounsForm.isStop">
                        <el-radio :label="false" :value="false" :key="false">是</el-radio>
                        <el-radio :label="true" :value="true" :key="true">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!--<el-form-item label="志愿者团队" prop="team.id">
                    <el-select v-model="nounsForm.team.id">
                        <el-option v-for="item in teams" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>-->
                <el-form-item label="招募对象类型" prop="permitSubject">
                  <el-col :span="10" class="pd-r-10">
                    <el-select v-model="nounsForm.permitSubject" multiple placeholder="请选择">
                      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
                 <el-form-item label="活动地址" required>
                      <el-col :span="18">
                          <el-form-item  prop="region" class="cooperation">
                               <v-cooperation v-model="nounsForm.region" :code="nounsForm.region" ref="cooperationRegion"></v-cooperation>
                          </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item prop="address">
                            <el-input v-model="nounsForm.address"></el-input>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="地图坐标">
                    <el-col :span="10" class="pd-r-10">
                        <el-form-item prop="coordinate.longitude">
                            <el-input v-model="nounsForm.coordinate.longitude" readonly disabled>
                                <template slot="prepend">X</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10" class="pd-r-10">
                        <el-form-item prop="coordinate.latitude">
                            <el-input v-model="nounsForm.coordinate.latitude" readonly disabled>
                                <template slot="prepend">Y</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-button @click="handleShowMap" type="primary" class="u-btn">查询坐标</el-button>
                    </el-col>
                </el-form-item>
                <el-form-item label="联系电话" prop="contactPhone">
                  <el-input v-model="nounsForm.contactPhone"></el-input>
                </el-form-item>
                <el-form-item label="允许报名人数" prop="limitNum">
                    <el-input v-model="nounsForm.limitNum"></el-input>
                </el-form-item>
                <!-- <el-form-item label="志愿者报名条件" label-width="120px">
                    <el-col :span="10" class="pd-r-10">
                        <el-form-item label="性别限制" prop="limitSex" label-width="80px">
                            <el-select v-model="nounsForm.limitSex" placeholder="请选择" clearable>
                                <el-option v-for="item in sexoptions" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="年龄限制" prop="startAge">
                            <el-input v-model="nounsForm.startAge"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="至" prop="endAge" label-width="40px">
                            <el-input v-model="nounsForm.endAge"></el-input>
                        </el-form-item>
                    </el-col>
                </el-form-item> -->

                <el-form-item label="活动时间" required>
                    <el-col :span="11" class="pd-r-10">
                        <el-form-item label-width="0" prop="startTime">
                            <el-date-picker placeholder="活动开始时间" v-model="nounsForm.startTime" type="datetime" format="yyyy-MM-dd HH:mm" :editable="false"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2" style="text-align:center; padding-right:10px;">~</el-col>
                    <el-col :span="11">
                        <el-form-item label-width="0" prop="endTime">
                            <el-date-picker placeholder="活动结束时间" v-model="nounsForm.endTime" type="datetime" format="yyyy-MM-dd HH:mm" :editable="false"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="服务时长" prop="serviceHour">
                    <el-input v-model="nounsForm.serviceHour">
                        <template slot="append">小时</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="活动描述" prop="desc">
                    <v-richeditor v-model="nounsForm.desc" ref="richEditor"></v-richeditor>
                </el-form-item>
                <el-form-item label="上传附件">
                    <v-uploadfile :upload="handleUploadFile" @remove="handleRemoveAttach" :filename="nounsForm.attachName"  ref="uploadfile" @cancelfunction="cancelfunctioncanback"></v-uploadfile>
                </el-form-item>

                <div class="form-opres">
                    <el-button @click="back" class="u-btn">返回</el-button>
                    <el-button @click="submitForm" type="primary" class="u-btn">确定</el-button>
                </div>
            </el-form>

            <el-dialog v-model="showMap" title="查询坐标" class="map-dialog">
                <v-gdmap v-if="showMap" :coordinate="getCoordinate" :addr="addrAllName" ref="gdmap" :searchType="searchType"></v-gdmap>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="showMap = false">取 消</el-button>
                    <el-button type="primary" @click="handleGetCoordinate">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import Api from '@/api'
import axios from 'axios'
import vRules from '@/config/validate_rules';
const DIALOG = {
    add: { title: '新增志愿者活动', flag: 'add' },
    edit: { title: '编辑志愿者活动', flag: 'edit' }
};
export default {
    data() {
        return {
             source: null,
            searchType: "",
            addrAllName: '',
            title: DIALOG.add.title,
            flag: DIALOG.add.flag,
            culid: '',
            showMap: false,
            sexoptions: [{ label: '仅限男性', value: 'male' }, { label: '仅限女性', value: 'female' }],
            cultureteamPic: '',
            options: [{ label: '个人', value: 'personal' }, { label: '团队', value: 'team' }],
            teams: [],
            nounsForm: {
                name: '',
                permitSubject: [],
                coverPic: '',
                serviceTypes: [],
                address: '',
                region: '',
                coordinate: { longitude: '', latitude: '' },
                contactPhone: '',
                limitNum: '',
                // limitSex: '',
                startTime: '',
                endTime: '',
                serviceHour: '',
                desc: '',
                attachName: '',
                startAge: undefined,
                endAge: undefined,
                attach: undefined,
                isStop:false
            },
            rules: {
                contactPhone: [ vRules.telPattern],
                name: [vRules.required,vRules.maxLen(40)],
                region: [vRules.required],
                coverPic: [vRules.required],
                limitNum: [vRules.required, vRules.numberPattern],
                serviceTypes: [vRules.requiredCbx],
                permitSubject: [vRules.requiredCbx],
                address: [vRules.required],
                startTime: [vRules.datarequired],
                endTime: [vRules.datarequired],
                lastTime: [vRules.required, vRules.numberPattern],
            },
            position: { longitude: '', latitude: '' }
        }
    },
    methods: {
         // 显示地图
      handleShowMap() {
        this.showMap = true;
        if (this.nounsForm.coordinate.longitude != null && this.nounsForm.coordinate.longitude != "" && this.nounsForm.coordinate.longitude != undefined) {
          this.searchType = "poi";
          this.$nextTick(() => {
            this.$refs.gdmap.lng = this.nounsForm.coordinate.longitude;
            this.$refs.gdmap.lat = this.nounsForm.coordinate.latitude;
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
          allName += this.nounsForm.address;
          this.addrAllName = allName;
          this.$nextTick(() => {
            this.$refs.gdmap.search.events.init;
          });
        }
      },
        submitForm() {
            this.$refs['nounsForm'].validate((valid) => {
                if (valid) {
                    let newForm = Object.assign({}, this.nounsForm);
                    newForm.startTime = this.formatDate(newForm.startTime, 'yyyy-MM-dd HH:mm:ss');
                    newForm.endTime = this.formatDate(newForm.endTime, 'yyyy-MM-dd HH:mm:ss');
                    let user = this.$store.getters.user;
                    if (this.flag === DIALOG.add.flag) {
                        newForm.unitId = user.orgUnit.id;
                        newForm.creator = this.$store.getters.AuditUser;
                        newForm.dataDeptId = this.$store.getters.user.unit.id;
                        Api.nouns.addCooperation(newForm).then(this.callback);
                    } else if (this.flag === DIALOG.edit.flag) {
                        newForm.unitId = user.orgUnit.id;
                        delete newForm.hasJoinMembers;
                        delete newForm.applyMembers;
                        newForm.lastModifier = this.$store.getters.AuditUser;
                        Api.nouns.editCooperation(this.culid, newForm).then(this.callback);
                    }
                }
            })
        },
        // 上传图片
        handleUpload(formData) {
            Api.system.uploadFile(formData, 'pic').then((res) => {
                this.nounsForm.coverPic = res.url;
            })
        },
        // 删除图片
        removeImg() {
            this.nounsForm.coverPic = '';
        },
        callback() {
            this.showTip();
            this.back();
        },
        back() {
            this.$router.go(-1);
        },
        //取消上传
      cancelfunctioncanback(){
        this.source.cancel('取消上传')
        this.$refs.uploadfile.progressShow=false;
        this.$refs.uploadfile.handleRemove();
        this.$refs.Progress=0;
        this.handleRemoveAttach();
        this.$refs.fileList=[];
      },
        // 附件上传
        handleUploadFile(req) {
            let file = req.file;
            let fileName = file.name;
            var formData = new FormData();
            formData.append('file', file);
            formData.append('filename', fileName);
            this.$refs.uploadfile.progressShow=true;
            this.source = axios.CancelToken.source();
            return Api.system.uploadFile(formData, 'attach',this.onUploadProgress,this.source.token).then((res) => {
                this.nounsForm.attach = res.url;
                this.nounsForm.attachName = fileName;
            });
        },
         //上传进度显示
        onUploadProgress(value)
        {
                this.$refs.uploadfile.Progress=value;
                if(value=="100")
                {
                        this.$refs.uploadfile.progressShow=false;
                }
        },
        // 删除附件
        handleRemoveAttach() {
            this.nounsForm.attach = '';
            this.nounsForm.attachName = '';
        },
        getDetail() {
            Api.nouns.getCooperation(this.culid).then((res) => {
                res.startTime = this.convertToDate(res.startTime);
                res.endTime = this.convertToDate(res.endTime);
                this.nounsForm = res;
                this.cultureteamPic = Api.system.getFileUrl(res.coverPic);
            });
        },
        /**
        * 查询定位坐标
        */
        getCoordinate(lng, lat) {
            this.position = { longitude: lng, latitude: lat };
        },
        // 定位确定
        handleGetCoordinate() {
            if (this.position.longitude !== '0' || this.position.latitude !== '0') {
                this.nounsForm.coordinate = this.position;
            }
            this.showMap = false;
        }
    },
    created() {
        let user = this.$store.getters.user;
        // 'creator.id:' + user.id
        // Api.nouns.getNounsList('', 1, -1).then((res) => {
        //     this.teams = res.content;
        // });
    },
    mounted() {
        this.culid = this.$route.query.id;
        if (this.culid) {
            this.title = DIALOG.edit.title;
            this.flag = DIALOG.edit.flag;
            this.getDetail();
        }
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
