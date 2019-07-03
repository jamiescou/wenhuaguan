<template>
  <div class="edit-wrapper train-wrapper">
    <v-pageheader :breadcrumbs="[{ to:titleInfo.path,name: titleInfo.name },{name:title}]"></v-pageheader>
    <div class="form-wrapper" style="width:1020px;">
      <el-form ref="trainForm" :model="trainForm" :rules="rules" label-position="right" label-width="150px" class="m-form">
        <el-row>
          <el-col :span="14" style="padding:20px 0;">
            <el-form-item label="所属文化馆：">
              <el-input v-model="unitName" readonly></el-input>
            </el-form-item>
            <el-form-item label="培训标题：" prop="title">
              <el-input v-model="trainForm.title" :maxlength="40"></el-input>
            </el-form-item>
            <el-form-item label="联系人" prop="contact">
              <el-input v-model="trainForm.contact"></el-input>
            </el-form-item>
            <el-form-item label="联系电话：" prop="contactNumber">
              <el-input v-model="trainForm.contactNumber"></el-input>
            </el-form-item>
            <el-form-item label="文化品牌：" prop="brand">
              <el-select v-model="trainForm.brandId" placeholder="请选择文化品牌" clearable @change="brandChange">
                <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in brandData"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否需要审核：" prop="isAudit">
              <el-radio-group v-model="trainForm.isAudit">
                <el-radio :label="true" key="true">是</el-radio>
                <el-radio :label="false" key="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="10" class='pic-col'>
            <!-- 封面图片 -->
            <el-form-item label=" " label-width="40px" prop="picture">
              <v-cropper class="cover" btnTxt="请选择培训封面图片" :imgUrl='picture' :upload="handleUpload" @remove="removeImg"></v-cropper>
              <el-input v-model="trainForm.picture" v-show="false"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="14">
            <el-form-item label="所在活动室：">
              <el-select v-model="cult" @change="cultChange" placeholder="请选择场馆" :disabled="isEditManager">
                <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in cultData"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label-width="0">
              <el-select v-model="trainForm.roomId" clearable @change="roomChange" placeholder="请选择活动室" :disabled="isEditManager">
                <el-option :key="room.id" :label="room.name" :value="room.id" v-for="room in roomList">
                  <span style="color: #8492a6; font-size: 13px">{{room.venue.name}}</span> &rarr; {{room.name}}
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <v-custom-label :label="'培训标签'" :type="'trainLabel'" @valueChange="labelChange" :initValue="labels"></v-custom-label>
        </el-row>
        <el-form-item label="艺术分类：" filterable prop="artType">
          <el-checkbox-group v-model="trainForm.artType">
            <v-checkbox typeName="artistClass"></v-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="允许总报名人数：" prop="allLimitPeoples" :disabled="isEditManager">
              <el-input v-model.number="trainForm.allLimitPeoples"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="每人可报名人数：" prop="userLimitPeoples" :disabled="isEditManager">
              <el-input v-model.number="trainForm.userLimitPeoples"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="报名条件：">
          <el-col :span="10" class="pd-r-10">
            <el-form-item label="性别限制" prop="limitSex" label-width="80px">
              <el-select v-model="trainForm.limitSex" placeholder="请选择" clearable>
                <el-option v-for="item in sexoptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="年龄限制" prop="startAge" label-width="100px">
              <el-input v-model="trainForm.startAge"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="至" prop="endAge" label-width="40px">
              <el-input v-model="trainForm.endAge"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="所属区域" required>
          <el-col :span="18">
            <el-form-item prop="region" class="cooperation">
              <v-cooperation v-model="trainForm.region" :code="trainForm.region" ref="cooperationRegion"></v-cooperation>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="address">
              <el-input v-model="trainForm.address"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="地图坐标：" required>
          <el-col :span="10" class="pd-r-10">
            <el-form-item prop="coordinate.longitude">
              <el-input v-model="trainForm.coordinate.longitude" readonly disabled>
                <template slot="prepend">X</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" class="pd-r-10">
            <el-form-item prop="coordinate.latitude">
              <el-input v-model="trainForm.coordinate.latitude" readonly disabled>
                  <template slot="prepend">  Y</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button @click="handleShowMap" type="primary" class="u-btn">查询坐标</el-button>
          </el-col>
        </el-form-item>
        <el-form-item label="报名时间：" required>
          <el-col :span="11">
            <el-form-item prop="enrolStartTime">
              <el-date-picker v-model="trainForm.enrolStartTime" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="报名开始时间" :disabled="isEditManager" :editable="false" :picker-options="pickerOptions"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="2" class="line"> &sim;</el-col>
          <el-col :span="11">
            <el-form-item prop="enrolEndTime">
              <el-date-picker v-model="trainForm.enrolEndTime" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="报名结束时间" :disabled="isEditManager" :editable="false" :picker-options="pickerOptions"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="课程时间：" prop="weekTimes" required>
          <el-tabs v-model="tabActive" type="border-card" class="rule-tabcard">
            <el-tab-pane label="课程时间" name="first">
              <v-schedule :weekTimes="trainForm.weekTimes" :startDate="trainForm.startDate" :endDate="trainForm.endDate" @weekTimeChange="weekTimeChange" :disabled="isEditManager"></v-schedule>
            </el-tab-pane>
            <el-tab-pane label="例外日期" name="second">
              <v-exceptSchedule :exceptTimes="trainForm.exceptTimes" @weekTimeChange="exepTimesChange"></v-exceptSchedule>
            </el-tab-pane>
          </el-tabs>
        </el-form-item>
        <el-form-item prop="trainTeacher" label="老师">
          <el-input v-model="trainForm.trainTeacher"></el-input>
        </el-form-item>
        <el-form-item label="培训简介：" prop="brief">
          <el-input type="textarea" v-model="trainForm.brief"></el-input>
        </el-form-item>
        <el-form-item label="培训介绍：" prop="introduce">
          <v-richeditor v-model="trainForm.introduce" ref="richEditor"></v-richeditor>
        </el-form-item>
        <el-form-item label="上传附件：">
          <!-- 附件 -->
             <v-uploadfile :upload="handleUploadFile" @remove="handleRemoveAttach" :filename="trainForm.attachmentName"   ref="uploadfile" @cancelfunction="cancelfunctioncanback"></v-uploadfile>
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
  import Api from '@/api'
  import axios from 'axios'
  import vRules from '@/config/validate_rules';
  import schedule from './modules/schedule'; // 课程时间表
  import exceptSchedule from './modules/except_schedule'; // 例外时间表
  import venueOpts from '../venues/modules/venue_opts'
  import _status from './modules/status'
  const DIALOG = {
    add: {
      title: '添加培训',
      flag: 'Add'
    },
    edit: {
      title: '编辑培训',
      flag: 'Edit'
    }
  };
  export default {
    components: {
      'v-venueOpts': venueOpts,
      'v-schedule': schedule,
      'v-exceptSchedule': exceptSchedule
    },
    data() {
      var allLimitCompare = (rule, value, callback) => {
        if (this.trainForm.allLimitPeoples && this.trainForm.userLimitPeoples) {
          let allLimit = parseInt(this.trainForm.allLimitPeoples, 10);
          let userLimit = parseInt(this.trainForm.userLimitPeoples, 10);
          if (!isNaN(allLimit) && !isNaN(userLimit) && allLimit < userLimit) {
            return callback(new Error('会员报名人数不能大于总报名人数!'));
          }
        }
        callback();
      };
      /**
       * 日期比较
       *  只比较日期，不比较时间
       * @param {any} rule 规则定义
       * @param {any} value 值
       * @param {any} callback 回调函数
       */
      const dateCompare = (rule, value, callback) => {
        let oneDate = this.trainForm[rule.type];
        let twoDate = value;
        if (oneDate && twoDate) {
          let compareResult = true;
          if ((oneDate instanceof Date) && (twoDate instanceof Date)) {
            oneDate = oneDate.getTime();
            twoDate = twoDate.getTime();
            if (rule.type === 'enrolEndTime') {
              compareResult = oneDate >= twoDate;
              this.$refs.trainForm.validateField(rule.type);
            } else {
              compareResult = oneDate <= twoDate;
            }
          }
          if (!compareResult) {
            return callback(new Error('报名开始日期不能大于报名结束日期'));
          }
        }
        callback();
      };
      return {
        source: null,
        searchType: "",
        addrAllName: '',
        title: DIALOG.add.title,
        flag: DIALOG.add.flag,
        titleInfo: _status.PARENT_NAME['1'],
        tabActive: 'first',
        picture: '',
        cult: '',
        unitName: '',
        cultData: [],
        brandData: [],
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        sexoptions: [{
          label: '仅限男性',
          value: 'male'
        }, {
          label: '仅限女性',
          value: 'female'
        }],
        trainForm: {
          title: '',
          contact: '',
          artType: [],
          labels: [],
          address: '',
          coordinate: {
            longitude: '',
            latitude: ''
          },
          contactNumber: '',
          enrolStartTime: '',
          enrolEndTime: '',
          startDate: '',
          endDate: '',
          weekTimes: [],
          exceptTimes: [],
          allLimitPeoples: "",
          userLimitPeoples: "",
          isCharge: false,
          isAudit: true,
          introduce: '',
          attachmentName: '',
          onlineStatus: _status.STATUS.WaitCommit,
          unitId: '',
          trainTeacher: '',
          roomId: '',
          roomName: '',
          picture: '',
          region: '',
          brief: '',
          brandId: '',
          brandName: '',
          dataDeptId: '',
          limitSex: '',
          startAge: undefined,
          endAge: undefined
        },
        isEditInit: {
          loading: false,
          roomId: ''
        },
        rules: {
          picture: [vRules.required_Msg('没有选择封面图片或图片上传中')],
          title: [vRules.required, vRules.maxLen(40)],
          contact: [vRules.required],
          contactNumber: [vRules.required],
          enrolEndTime: [vRules.datarequired, {
            validator: dateCompare,
            type: 'enrolStartTime',
            trigger: 'change'
          }],
          enrolStartTime: [vRules.datarequired, {
            validator: dateCompare,
            type: 'enrolEndTime',
            trigger: 'change'
          }],
          allLimitPeoples: [vRules.required, vRules.minPattern(), {
            validator: allLimitCompare,
            trigger: 'blur'
          }],
          introduce: [vRules.required],
          userLimitPeoples: [vRules.required, vRules.minPattern(), {
            validator: allLimitCompare,
            trigger: 'blur'
          }],
          artType: [vRules.requiredCbx],
          address: [vRules.required],
          'region': [vRules.required],
          "coordinate.longitude": [vRules.required],
          "coordinate.latitude": [vRules.required],
          weekTimes: [vRules.required_Array('请添加课程时间')]
        },
        roomList: [{
          id: '',
          name: '',
          venue: {
            name: ''
          }
        }],
        position: {
          longitude: '',
          latitude: ''
        },
        showMap: false,
        labels: []
      }
    },
    computed: {
      isEditManager() {
        let notEdit = ['Offline', 'Audited'];        
        return this.trainForm.onlineStatus !== '' && notEdit.some(item => item === this.trainForm.onlineStatus);
      }
    },
    methods: {
      labelChange(val) {
        this.trainForm.labels = JSON.parse(JSON.stringify(val));
      },
      back() {
        this.$router.go(-1);
      },
      // 图片上传
      handleUpload(formData) {
        Api.system.uploadFile(formData, 'pic').then((res) => {
          this.trainForm.picture = res.url;
        })
      },
      // 删除图片
      removeImg() {
        this.trainForm.picture = '';
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
          this.trainForm.attachment = res.url;
          this.trainForm.attachmentName = fileName;
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
        this.trainForm.attachment = '';
        this.trainForm.attachmentName = '';
      },
      cultChange(value) {
        if (!this.isEditInit.loading) {
          this.trainForm.roomId = '';
        this.$refs.cooperationRegion.selectedCity = "-1";
        this.trainForm.address = "";
        this.trainForm.coordinate.longitude = "";
        this.trainForm.coordinate.latitude = "";
        }
        if (value) {
          this.getVenueRoom(value);
        }
      },
      // 场馆选择触发
      roomChange(value) {
        if (this.isEditInit.loading) {
          this.isEditInit.loading = false;
          return;
        }
        let room = this.roomList.find(x => x.id === value);
        if (room) {
          this.trainForm.roomName = room.name;
          this.trainForm.address = room.venue.address;
          this.$refs.cooperationRegion.initCode(room.venue.region);
          this.trainForm.coordinate.longitude = room.venue.coordinate.longitude;
          this.trainForm.coordinate.latitude = room.venue.coordinate.latitude;
        }
      },
      // 品牌选择触发
      brandChange(value) {
        Api.system.getBrand(value).then((res) => {
          if (res) {
            this.trainForm.brandName = res.name;
          }
        });
      },
      // 保存课程时间
      weekTimeChange(weektims) {
        this.trainForm.startDate = weektims.startDate;
        this.trainForm.endDate = weektims.endDate;
        this.trainForm.weekTimes = weektims.weekTimes;
      },
      exepTimesChange(times) {
        this.trainForm.exceptTimes = times;
      },
      // 提交数据
      submitForm() {
        let bmed = this.$moment(this.trainForm.enrolEndTime).format('x');
        let yyed = this.$moment(this.trainForm.startDate).format('x');
        if (bmed > yyed) {
          this.showCenterTip('报名时间必须在培训时间之前！', 'error');
          return;
        }
        this.$refs['trainForm'].validate((valid) => {
          if (!valid) {
            return
          };
          let newForm = Object.assign({}, this.trainForm);
          newForm.condition = [];
          if (newForm.limitSex) {
            newForm.condition.push({
              type: 'sex',
              value: newForm.limitSex
            });
          }
          if (newForm.startAge || newForm.endAge) {
            newForm.condition.push({
              type: 'age',
              value: (newForm.startAge || '') + ',' + (newForm.endAge || '')
            });
          }
          if (newForm.brandId == null || newForm.brandId === '') {
            newForm.brandName = '';
          }
          if (newForm.roomId == null || newForm.roomId === '') {
            newForm.roomName = '';
          }
          delete newForm.limitSex
          delete newForm.startAge
          delete newForm.endAge
          // 报名开始，结束时间
          newForm.enrolStartTime = this.formatDate(newForm.enrolStartTime, 'yyyy-MM-dd HH:mm:ss');
          newForm.enrolEndTime = this.formatDate(newForm.enrolEndTime, 'yyyy-MM-dd HH:mm:ss');
          //培训开始时间，结束时间
          newForm.startDate = this.formatDate(this.trainForm.startDate, 'yyyy-MM-dd');
          newForm.endDate = this.formatDate(this.trainForm.endDate, 'yyyy-MM-dd');
          if (this.flag === DIALOG.add.flag) {
            this.trainForm.creator = this.$store.getters.AuditUser;
            newForm.dataDeptId = this.$store.getters.user.unit.id;
            Api.train.addTrain(newForm).then(this.back);
          } else if (this.flag === DIALOG.edit.flag) { // 编辑
            this.trainForm.lastModifier = this.$store.getters.AuditUser;
            Api.train.modifyTrain(newForm.id, newForm).then(this.back);
          }
        });
      },
      // 显示地图
      handleShowMap() {
      this.showMap = true;
      if( this.trainForm.coordinate.longitude!=null&&this.trainForm.coordinate.longitude!=""&&this.trainForm.coordinate.longitude!=undefined)
      {
           this.searchType="poi" ;
           this.$nextTick(() => {
                    this.$refs.gdmap.lng=this.trainForm.coordinate.longitude;
                    this.$refs.gdmap.lat=this.trainForm.coordinate.latitude;
                    this.$refs.gdmap.search.events.init;
           });
      }else
      {
      this.searchType="address" ;
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
      allName += this.trainForm.address;
      this.addrAllName = allName;
           this.$nextTick(() => {
                    this.$refs.gdmap.search.events.init;
           });
      }

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
          this.trainForm.coordinate = this.position;
        }
        this.showMap = false;
      },
      // 添加时段规则
      HandleAddPeriod(name, except = false) {
        this.tabActive = except ? 'second' : 'first';
        this.$refs[name].HandleAddPeriod();
      },
      getDetail() {
         this.isEditInit.loading = true;
        Api.train.getTrain(this.id).then((res) => {
          this.picture = Api.system.getFileUrl(res.picture);
          // 获得归属机构名称
          Api.system.getUnitInfo(res.unitId).then((res) => {
            if (res) {
              this.unitName = res.name;
            }
          });
          // 活动室
          if (res.roomId) {
            let roomId = res.roomId;
            this.isEditInit.roomId = res.roomId;
            Api.venue.getVenueRoom(roomId).then((room) => {
              this.cult = room.venue.id;
            });
                       res.roomId = '';
          }
          // res.roomId = "";
          // 日期处理
          res.enrolStartTime = this.convertToDate(res.enrolStartTime);
          res.enrolEndTime = this.convertToDate(res.enrolEndTime);
          res.startDate = this.convertToDate(res.startDate);
          res.endDate = this.convertToDate(res.endDate);
          // 报名条件
          if (res.condition) {
            let sex = res.condition.find(x => x.type === 'sex');
            res.limitSex = sex ? sex.value : '';
            let ageRange = res.condition.find(x => x.type === 'age');
            if (ageRange) {
              ageRange = ageRange.value.split(',');
              res.startAge = ageRange[0];
              res.endAge = ageRange[1];
            }
          }
          delete res.condition;
          this.trainForm = res;
          this.$refs.cooperationRegion.initCode(this.trainForm.region);
          this.labels = this.trainForm.labels;
        });
      },
      getVenueRoom(venueId) {
        Api.venue.getVenueRoomsList('venue.id:' + venueId + ',onlineStatus:Published&sort=venue~desc', 1, -1).then((res) => {
          this.roomList = res.content;
          if (this.isEditInit.loading) {
            this.trainForm.roomId = this.isEditInit.roomId;
          }
        });
      },
      initUnit() {
        let unitId = this.$store.getters.user.orgUnit.id;       
        Api.venue.getVenueList('searchUnitId,isPublish:true',1,-1).then((res)=>{
          this.cultData = res.content;
        });
        // 初始化文化品牌
        Api.system.getBrandList('', 1, -1).then((res) => {
          this.brandData = res.content;
        });
      }
    },
    mounted() {
      this.initUnit();
      let user = this.$store.getters.user;
      this.id = this.$route.query.id;
      let tag = this.$route.query.flag || '1';
      this.titleInfo = _status.PARENT_NAME[tag];
      if (this.id) {
        this.title = '编辑';
        this.flag = DIALOG.edit.flag;
        this.getDetail();
      } else {
        // 归属文化馆
        this.unitName = user.orgUnit.name;
        this.trainForm.unitId = user.orgUnit.id;
        this.trainForm.dataDeptId = user.unit.id;
        this.flag = DIALOG.add.flag
      }
    }
  }
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
  .train-wrapper {
    .rule-tabcard {
      margin-top: 5px;
    }
  }
</style>
