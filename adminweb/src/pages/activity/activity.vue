<template>
  <div class="edit-wrapper" v-loading="loading">
    <v-pageheader :breadcrumbs="[{ to:titleInfo.path,name: titleInfo.name },{name:title}]"></v-pageheader>
    <div class="form-wrapper">
      <el-form ref="activityForm" :model="activityForm" :rules="rules" label-position="right" label-width="100px" class="m-form">
        <el-row :gutter="20">
          <el-col :span="14">
            <el-form-item label="所属文化馆">
              <el-input v-model="unitName" readonly></el-input>
            </el-form-item>
            <el-form-item label="活动名称" prop="name">
              <el-input v-model="activityForm.name" :maxlength="40"></el-input>
            </el-form-item>
            <el-form-item label="联系人" prop="contact">
              <el-input v-model="activityForm.contact"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="contactPhone">
              <el-input v-model="activityForm.contactPhone"></el-input>
            </el-form-item>
            <el-form-item label="文化品牌" prop="brand">
              <el-select v-model="activityForm.brandId" @change="brandChange" placeholder="请选择文化品牌" clearable>
                <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in brandData"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否实名制" prop="isAuthenticate">
              <el-radio-group v-model="activityForm.isAuthenticate">
                <el-radio :label="true" :key="true" :value="true">是</el-radio>
                <el-radio :label="false" :key="false" :value="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="10" class='pic-col'>
            <!-- 封面图片 -->
            <el-form-item label-width="0" prop="coverPic">
              <v-cropper class="cover" btnTxt="请选择活动封面图片" :imgUrl='coverPic' :upload="handleUpload" @remove="removeImg"></v-cropper>
              <el-input v-model="activityForm.coverPic" v-show="false"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="活动形式" prop="activityType">
          <el-checkbox-group v-model="activityForm.activityType">
            <v-checkbox typeName="activityForm"></v-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="艺术分类" filterable prop="artType">
          <el-checkbox-group v-model="activityForm.artType">
            <v-checkbox typeName="artistClass"></v-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-row :gutter="15">
          <v-custom-label :label="'活动标签:'" :type="'activityLabel'" @valueChange="labelChange" :initValue="labels"></v-custom-label>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="14">
            <el-form-item label="所在活动室">
              <el-select v-model="cult" @change="cultChange" placeholder="请选择场馆" :disabled="isEditManager">
                <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in cultData"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label-width="0" prop="venueRoom">
              <el-select v-model="activityForm.roomId" @change="venueroomclick" clearable :disabled="isEditManager">
                <el-option :key="room.id" :label="room.name" :value="room.id" v-for="room in roomList">
                  <span style="color: #8492a6; font-size: 13px">{{room.venue.name}}</span> &rarr; {{room.name}}
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="活动地址" required>
          <el-col :span="18">
            <el-form-item prop="region" class="cooperation">
              <v-cooperation v-model="activityForm.region" :code="activityForm.region" ref="cooperationRegion"></v-cooperation>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="address">
              <el-input v-model="activityForm.address"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="地图坐标" required>
          <el-col :span="10" class="pd-r-10">
            <el-form-item prop="coordinate.longitude">
              <el-input v-model="activityForm.coordinate.longitude" readonly disabled>
                <template slot="prepend">X</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" class="pd-r-10">
            <el-form-item prop="coordinate.latitude">
              <el-input v-model="activityForm.coordinate.latitude" readonly disabled>
                <template slot="prepend"> Y </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button @click="handleShowMap" type="primary" class="u-btn">查询坐标</el-button>
          </el-col>
        </el-form-item>
        <el-form-item label="活动时间" required>
          <el-col :span="11">
            <el-form-item prop="holdStartDate">
              <el-date-picker v-model="activityForm.holdStartDate" type="date" format="yyyy-MM-dd" placeholder="开始时间" :readonly="isEditManager" :disabled="isEditManager" :editable="false" :picker-options="pickerOptions"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="2" class="line"> &sim;</el-col>
          <el-col :span="11">
            <el-form-item prop="holdEndDate">
              <el-date-picker v-model="activityForm.holdEndDate" type="date" format="yyyy-MM-dd" placeholder="结束时间" :readonly="isEditManager" :disabled="isEditManager" :editable="false" :picker-options="pickerOptions"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="订票方式：" prop="reserveType">
          <el-radio-group v-model="activityForm.reserveType">
            <el-radio :key="item.value" :label="item.value" :value="item.value" v-for="item in reserveTypeOpt" :readonly="isEditManager" :disabled="isEditManager">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="isFree || isOnline">
          <el-row>
            <el-col :span="12" v-if="isFree">
              <el-form-item label="总票数" prop="totalAllow" :rules="otherRules.totalAllow">
                <el-input v-model="activityForm.totalAllow" :readonly="isEditManager" :disabled="isEditManager">
                  <template slot="append">
                    张(每场)
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="每人最多预约" prop="perAllow" :rules="otherRules.perAllow">
                <el-input v-model="activityForm.perAllow" :readonly="isEditManager" :disabled="isEditManager">
                  <template slot="append">
                    张(每场)
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="预约时间" required>
            <el-col :span="11">
              <el-form-item prop="signStartTime" :rules="otherRules.signStartTime">
                <el-date-picker v-model="activityForm.signStartTime" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="开始时间" :readonly="isEditManager" :disabled="isEditManager" :editable="false" :picker-options="pickerOptions"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="2" class="line"> &sim;</el-col>
            <el-col :span="11">
              <el-form-item prop="signEndTime" :rules="otherRules.signEndTime">
                <el-date-picker v-model="activityForm.signEndTime" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="结束时间" :readonly="isEditManager" :disabled="isEditManager" :editable="false" :picker-options="pickerOptions"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="活动场次" prop="itms" required :rules="otherRules.itms">
            <el-button type="primary" @click="addDomain" style="margin-bottom:20px;">新增场次</el-button>
            <div class="activity-itms">
              <el-form-item v-for="(domain, index) in activityForm.itms" :label="'场次' + (index+1)" :key="'场次' + (index+1)" style="height: 50px">
                <el-col :span="5">
                  <el-form-item :prop="'itms.' + index +'.itmDate'" :rules="{type: 'date',required: true, message: '请选择日期', trigger: 'blur,change'}">
                    <el-date-picker v-model="domain.itmDate" type="date" format="yyyy-MM-dd" placeholder="场次日期" :disabled="isEditManager && domain.lockedEdit" :editable="false" :picker-options="itmPickerOptions">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="1" class="line"> &nbsp;</el-col>
                <el-col :span="5">
                  <el-form-item :prop="'itms.' + index +'.startTime'" :rules="otherRules.itmStartTime">
                    <el-input v-model="domain.startTime" placeholder="开始时间" :disabled="isEditManager && domain.lockedEdit"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2" class="line"> &sim;</el-col>
                <el-col :span="5">
                  <el-form-item :prop="'itms.' + index +'.endTime'" :rules="otherRules.itmEndTime">
                    <el-input v-model="domain.endTime" placeholder="结束时间" :disabled="isEditManager && domain.lockedEdit"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="1" class="line"> &nbsp;</el-col>
                <el-col :span="5" v-if="!(isEditManager && domain.lockedEdit)">
                  <el-button @click.prevent="removeDomain(domain)">删除</el-button>
                </el-col>
              </el-form-item>
            </div>
          </el-form-item>
          <el-form-item label="保留座位" prop="remark" v-if="isOnline">
            <el-button type="primary" @click="toggleSeat">{{showSeat?'收起座位模板':'展开座位模板'}}</el-button>
          </el-form-item>
          <v-seatTmp ref="seatPreorder" :seatTmp="activityForm.seatTemplate" v-if="showSeat && showSeatPanel" @perorderChange="saveSeats"></v-seatTmp>
        </div>

        <el-form-item label="活动简介" prop="brief">
          <el-input type="textarea" v-model="activityForm.brief"></el-input>
        </el-form-item>
        <el-form-item label="活动描述" prop="desc">
          <v-richeditor v-model="activityForm.desc" ref="richEditor"></v-richeditor>
        </el-form-item>
        <el-form-item label="上传附件">
          <!-- 附件 -->
          <v-uploadfile :upload="handleUploadFile" @remove="handleRemoveAttach" :filename="activityForm.attachName" ref="uploadfile" @cancelfunction="cancelfunctioncanback"></v-uploadfile>
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
import seatTmp from '../../components/seat/seatpreorder'
import venueOpts from '../venues/modules/venue_opts'
import vRules from '@/config/validate_rules'
const RESERVETYPE = {
  none: 'none',
  free: 'free',
  online: 'online'
};
import _status, {
  PARENT_NAME,
  reservetypeOpts
} from './activity_status'
const DIALOG = {
  add: {
    title: '添加活动',
    flag: 'Add'
  },
  edit: {
    title: '编辑活动',
    flag: 'Edit'
  }
};

export default {
  components: {
    'v-seatTmp': seatTmp,
    'v-venueOpts': venueOpts
  },
  data() {
    /**
     * 日期比较
     *  只比较日期，不比较时间
     * @param {any} rule 规则定义
     * @param {any} value 当前表单值
     * @param {any} callback 回调函数
     */
    const dateCompare = (rule, value, callback) => {
      let oneDate = this.activityForm[rule.comparison];
      let twoDate = value;
      if (oneDate && twoDate) {
        let compareResult = true;
        if ((oneDate instanceof Date) && (twoDate instanceof Date)) {
          oneDate = oneDate.getTime();
          twoDate = twoDate.getTime();
          if (rule.type && rule.type === 'end') {
            compareResult = oneDate >= twoDate;
            this.$refs.activityForm.validateField(rule.comparison);
          } else {
            compareResult = oneDate <= twoDate;
          }
        }
        if (!compareResult) {
          return callback(new Error(rule.message));
        }
      }
      callback();
    };
    /**
     * 时间比较
     */
    const TimeCompare = (rule, value, callback) => {
      callback();
    };
    // 总票数必须大于每人可预订数
    var allLimitCompare = (rule, value, callback) => {
      if (this.activityForm.totalAllow && this.activityForm.perAllow) {
        let allLimit = parseInt(this.activityForm.totalAllow, 10);
        let userLimit = parseInt(this.activityForm.perAllow, 10);
        if (!isNaN(allLimit) && !isNaN(userLimit) && allLimit < userLimit) {
          return callback(new Error('活动每场每人可预定票数不能大于活动每场总票数!'));
        }
      }
      callback();
    };
    // 时间重叠验证
    const overlapValid = (rule, value, callback) => {
      if (Array.isArray(value) && value.length) {
        for (let i = 0; i < value.length; i++) {
          // 1、验证开始时间必须大于结束时间
          let itm = value[i];
          let itmDate = this.$moment(itm.itmDate).format('YYYY-MM-DD');
          let startDateTime = this.$moment(itmDate + ' ' + itm.startTime).format('x');
          let endDateTime = this.$moment(itmDate + ' ' + itm.endTime).format('x');
          if (endDateTime < startDateTime) {
            return callback(new Error('结束时间必须大于开始时间'));
          }
          // 2、时间段与时间段之间不存在重叠
          for (let j = (i + 1); j < value.length; j++) {
            let _itm = value[j];
            let _itmDate = this.$moment(_itm.itmDate).format('YYYY-MM-DD');
            let _startDateTime = this.$moment(_itmDate + ' ' + _itm.startTime).format('x');
            let _endDateTime = this.$moment(_itmDate + ' ' + _itm.endTime).format('x');
            if (_endDateTime < _startDateTime) {
              return callback(new Error('结束时间必须大于开始时间'));
            }
            let result = this.checkOverlap(startDateTime, endDateTime, _startDateTime, _endDateTime);
            if (result) {
              return callback(new Error('场次时间有重叠，请检查'));
            }
          }
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
      loading: false,
      tag: 1,
      reserveTypeOpt: reservetypeOpts(),
      cult: '',
      cultData: [],
      brandData: [],
      isEditInit: {
        loading: false,
        roomId: ''
      },
      roomList: [{
        id: '',
        name: '',
        venue: {
          name: ''
        }
      }],
      showSeat: false,
      unitName: '', // 组织
      labels: [],
      activityForm: {
        name: '',
        activityType: [],
        artType: [],
        labels: [],
        onlineStatus: _status.STATUS.WAITCOMMIT,
        holdStartDate: '',
        holdEndDate: '',
        signStartTime: '',
        signEndTime: '',
        address: '',
        isAuthenticate: true,
        reserveType: RESERVETYPE.none,
        perAllow: '',
        totalAllow: '',
        region: '',
        desc: '',
        contact: '',
        contactPhone: '',
        attachName: '',
        coordinate: {
          longitude: '',
          latitude: ''
        },
        roomId: '',
        roomName: '',
        seatTemplate: {
          rows: 0,
          columns: 0,
          grids: []
        },
        unitId: '',
        itms: [], // 活动场次
        coverPic: '',
        attach: '',
        brief: '',
        brandId: '',
        brandName: '',
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      itmPickerOptions: {
        disabledDate: (time) => {
          if (this.activityForm.holdStartDate && this.activityForm.holdEndDate) {
            return time.getTime() < this.activityForm.holdStartDate || time.getTime() > this.activityForm.holdEndDate;
          }
        }
      },
      rules: {
        coverPic: [vRules.required_Msg('没有选择封面图片或图片上传中')],
        'name': [vRules.required, vRules.maxLen(40)],
        'activityType': [vRules.required],
        'artType': [vRules.required],
        'region': [vRules.required],
        'address': [vRules.required],
        'contact': [vRules.required],
        "coordinate.longitude": [vRules.required],
        "coordinate.latitude": [vRules.required],
        contactPhone: [vRules.required],
        desc: [vRules.required],
        holdStartDate: [vRules.datarequired, {
          validator: dateCompare,
          comparison: 'holdEndDate',
          type: 'end',
          trigger: 'change',
          message: '活动开始时间不能大于活动结束时间'
        }],
        holdEndDate: [vRules.datarequired, {
          validator: dateCompare,
          comparison: 'holdStartDate',
          trigger: 'change',
          message: '活动开始时间不能大于活动结束时间'
        }]
      },
      otherRules: {
        signStartTime: [vRules.datarequired, {
          validator: dateCompare,
          comparison: 'signEndTime',
          type: 'end',
          trigger: 'change',
          message: '预约开始时间不能大于预约结束时间'
        }],
        signEndTime: [vRules.datarequired, {
          validator: dateCompare,
          comparison: 'signStartTime',
          trigger: 'change',
          message: '预约开始时间不能大于预约结束时间'
        }],
        totalAllow: [{
          required: true,
          message: '请输入每场的总票数'
        }, vRules.minPattern(), {
          validator: allLimitCompare
        }],
        perAllow: [{
          required: true,
          message: '请输入每人每场的可预定的票数'
        }, vRules.minPattern(), {
          validator: allLimitCompare
        }],
        itms: [vRules.required_Array('请添加场次'), {
          validator: overlapValid,
          trigger: 'blur,change'
        }],
        itmStartTime: [{
          required: true,
          message: '请输入开始时间',
          trigger: 'blur'
        }, {
          min: 5,
          max: 5,
          message: '时间格式是24小时制,如：08:00',
          trigger: 'blur'
        }, vRules.timePattern],
        itmEndTime: [{
          required: true,
          message: '请输入结束时间',
          trigger: 'blur'
        }, {
          min: 5,
          max: 5,
          message: '时间格式是24小时制,如：08:00',
          trigger: 'blur'
        }, vRules.timePattern]
      },
      coverPic: '',
      initSeat: [],
      showMap: false,
      position: {
        longitude: '',
        latitude: ''
      }
    }
  },
  computed: {
    isEditManager() {
      let notEdit = ['Offline', 'Audited'];
      return this.activityForm.onlineStatus !== '' && notEdit.some(item => item === this.activityForm.onlineStatus);
    },
    // 是否显示座位图
    showSeatPanel() {
      return this.isOnline && this.activityForm.seatTemplate.grids.length > 0;
    },
    // 是否自由选座
    isFree() {
      if (this.activityForm.reserveType === RESERVETYPE.none) {
        this.activityForm.itms = [];
      } else if (this.activityForm.itms.length == 0) {
        this.addDomain();
      }
      return this.activityForm.reserveType === RESERVETYPE.free;
    },
    // 是否在线选座
    isOnline() {
      if (this.activityForm.reserveType === RESERVETYPE.none) {
        this.activityForm.itms = [];
      } else if (this.activityForm.itms.length == 0) {
        this.addDomain();
      }
      return this.activityForm.reserveType === RESERVETYPE.online;
    },
    titleInfo() {
      return PARENT_NAME[this.tag];
    }
  },
  methods: {
    labelChange(val) {
      this.activityForm.labels = JSON.parse(JSON.stringify(val));
    },
    getStart(start) {
      return start ? start : '00:00'
    },
    toggleSeat() {

      if (this.isOnline && !this.showSeatPanel) {
        this.showTip('没有选择活动室或活动室没有座位', 'error');
        return;
      } else if (this.isOnline && this.showSeatPanel) {
        this.showSeat = !this.showSeat;
      }
    },
    // 图片上传
    handleUpload(formData) {
      Api.system.uploadFile(formData, 'pic').then((res) => {
        this.activityForm.coverPic = res.url;
      })
    },
    //取消上传
    cancelfunctioncanback() {
      this.source.cancel('取消上传')
      this.$refs.uploadfile.progressShow = false;
      this.$refs.uploadfile.handleRemove();
      this.$refs.Progress = 0;
      this.handleRemoveAttach();
      this.$refs.fileList = [];
    },
    // 附件上传
    handleUploadFile(req) {
      let file = req.file;
      let fileName = file.name;
      var formData = new FormData();
      formData.append('file', file);
      formData.append('filename', fileName);
      this.$refs.uploadfile.progressShow = true;
      this.source = axios.CancelToken.source();
      return Api.system.uploadFile(formData, 'attach', this.onUploadProgress, this.source.token).then((res) => {
        this.activityForm.attach = res.url;
        this.activityForm.attachName = fileName;
      });
    },
    //上传进度显示
    onUploadProgress(value) {
      this.$refs.uploadfile.Progress = value;
      if (value == "100") {
        this.$refs.uploadfile.progressShow = false;
      }
    },
    // 保留座位
    saveSeats(seats) {
      this.activityForm.seatTemplate.grids = seats;
    },
    back() {
      this.$router.replace(this.titleInfo.path);
    },
    callback() {
      this.showTip();
      this.back();
    },
    // 提交
    submitForm() {
      // 在线选座必须有活动室和座位模板
      if (this.activityForm.reserveType === RESERVETYPE.online) {
        if (this.activityForm.roomId === '') {
          this.showCenterTip('在线选座,活动室不能为空！', 'warning');
          return;
        }
        if (!this.activityForm.seatTemplate || !this.activityForm.seatTemplate.rows) {
          this.showCenterTip('所选活动室没有座位模版！', 'warning');
          return;
        }
      }
      // 判断场次时间是否在活动时间内
      if (this.activityForm.reserveType !== RESERVETYPE.none) {
        let holdSD = this.$moment(this.activityForm.holdStartDate).format('x');
        let holdED = this.$moment(this.activityForm.holdEndDate).format('x');
        for (const itm of this.activityForm.itms) {
          let itmDate = this.$moment(itm.itmDate).format('x');
          if (!(holdED >= itmDate && itmDate >= holdSD)) {
            this.showCenterTip('场次时间必须在活动时间内！', 'error');
            return;
          }
        }
        let signED = this.$moment(this.activityForm.signEndTime).format('x');
        let holdED2 = this.$moment(this.activityForm.holdEndDate).add(1, 'days').subtract(1, 'seconds').format('x');
        if (signED > holdED2) {
          this.showCenterTip('预约时间必须在活动时间之前！', 'error');
          return;
        }
      }
      this.$refs['activityForm'].validate((valid) => {
        if (valid) {
          let newForm = Object.assign(this.activityForm);
          // 日期时间
          newForm.signStartTime = this.formatDate(newForm.signStartTime, 'yyyy-MM-dd HH:mm:ss');
          newForm.signEndTime = this.formatDate(newForm.signEndTime, 'yyyy-MM-dd HH:mm:ss');
          newForm.holdStartDate = this.formatDate(newForm.holdStartDate, 'yyyy-MM-dd');
          newForm.holdEndDate = this.formatDate(newForm.holdEndDate, 'yyyy-MM-dd');
          // 场次
          newForm.itms = newForm.itms.map((item, index) => {
            return {
              id: index + 1,
              itmDate: this.formatDate(item.itmDate, 'yyyy-MM-dd'),
              startTime: item.startTime,
              endTime: item.endTime,
              reserveSeats: item.reserveSeats
            };
          });
          if (newForm.brandId == null || newForm.brandId === '') {
            newForm.brandName = '';
          }
          if (newForm.roomId == null || newForm.roomId === '') {
            newForm.roomName = '';
          }
          if (this.activityForm.roomId === '') delete this.activityForm.seatTemplate;
          let user = this.$store.getters.user;
          if (this.flag === DIALOG.add.flag) {
            // 提交人信息
            newForm.creator = this.$store.getters.AuditUser;
            newForm.dataDeptId = user.unit.id;
            Api.activity.addActivity(newForm).then(this.callback);
          } else if (this.flag === DIALOG.edit.flag) { // 编辑活动信息
            // 修改人信息
            newForm.lastModifier = this.$store.getters.AuditUser;
            delete newForm.total;
            Api.activity.modifyActivity(newForm.id, newForm).then(this.callback);
          }
        }
      });
    },
    // 显示地图
    handleShowMap() {
      this.showMap = true;
      if (this.activityForm.coordinate.longitude != null && this.activityForm.coordinate.longitude != "" && this.activityForm.coordinate.longitude != undefined) {
        this.searchType = "poi";
        this.$nextTick(() => {
          this.$refs.gdmap.lng = this.activityForm.coordinate.longitude;
          this.$refs.gdmap.lat = this.activityForm.coordinate.latitude;
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
        allName += this.activityForm.address;
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
        this.activityForm.coordinate = this.position;
        // this.activityForm.address=this.$refs.gdmap.address;
      }
      this.showMap = false;
    },
    /**
     * 新增场次
     */
    addDomain() {
      this.activityForm.itms.push({
        itmDate: '',
        startTime: '',
        endTime: '',
        lockedEdit: false
      });
    },
    /**
     * 删除场次
     */
    removeDomain(item) {
      var index = this.activityForm.itms.indexOf(item);
      if (index !== -1) {
        this.activityForm.itms.splice(index, 1)
      }
    },
    // 删除附件
    handleRemoveAttach() {
      this.activityForm.attach = '';
      this.activityForm.attachName = '';
    },
    // 删除图片
    removeImg() {
      this.activityForm.coverPic = '';
    },
    cultChange(value) {
      if (!this.isEditInit.loading) {
        this.activityForm.roomId = '';
        this.activityForm.seatTemplate = {
          row: 0,
          columns: 0,
          grids: []
        };
        this.$refs.cooperationRegion.selectedCity = "-1";
        this.activityForm.address = "";
        this.activityForm.coordinate.longitude = "";
        this.activityForm.coordinate.latitude = "";
      }
      this.getVenueRoomList(value);
    },
    getVenueRoomList(unitid) {
      Api.venue.getVenueRoomsList('venue.id:' + unitid + ',onlineStatus:Published&sort=venue~desc', 1, -1).then((res) => {
        this.roomList = res.content.filter(x => x.venue);
        if (this.isEditInit.loading) {
          this.activityForm.roomId = this.isEditInit.roomId;
        }
      });
    },
    // 活动室选择触发
    venueroomclick(value) {
      this.showSeat = false;
      if (this.isEditInit.loading) {
        this.isEditInit.loading = false;
        return;
      }
      if (value !== null && value !== '') {
        Api.venue.getVenueRoom(value).then((res) => {
          this.$refs.cooperationRegion.initCode(res.venue.region);
          this.activityForm.address = res.venue.address;
          if (!this.showSeatPanel) {
            this.activityForm.seatTemplate = res.seatTemplate;
          }
          this.activityForm.coordinate.longitude = res.venue.coordinate.longitude;
          this.activityForm.coordinate.latitude = res.venue.coordinate.latitude;
          if (!res.seatTemplate) return;
          this.activityForm.roomName = res.name;
        });
      }
    },
    getDetail() {
      this.loading = true;
      this.isEditInit.loading = true;
      Api.activity.getActivity(this.id).then((res) => {
        // 活动室
        if (res.roomId) {
          let roomId = res.roomId;
          this.isEditInit.roomId = res.roomId;
          Api.venue.getVenueRoom(roomId).then((room) => {
            this.cult = room.venue.id;
          });
          res.roomId = '';
        }
        // 所属机构
        Api.system.getUnitInfo(res.unitId).then((res) => {
          if (res) {
            this.unitName = res.name;
          }
        });
        // 日期处理
        if (res.signStartTime) res.signStartTime = this.convertToDate(res.signStartTime);
        if (res.signEndTime) res.signEndTime = this.convertToDate(res.signEndTime);
        if (res.holdStartDate) res.holdStartDate = this.convertToDate(res.holdStartDate);
        if (res.holdEndDate) res.holdEndDate = this.convertToDate(res.holdEndDate);
        // 场次
        if (res.itms != null && res.itms.length > 0) {
          for (var i = 0; i < res.itms.length; i++) {
            res.itms[i].lockedEdit = true;
            res.itms[i].itmDate = this.convertToDate(res.itms[i].itmDate);
          }
        } else {
          res.itms = [];
        }
        this.activityForm = res;
        this.labels = this.activityForm.labels;
        this.coverPic = Api.system.getFileUrl(res.coverPic);
        this.$refs.cooperationRegion.initCode(this.activityForm.region);
        this.loading = false;
      }).catch(() => {
        this.loading = false
      });
    },
    brandChange(value) {
      for (let i = 0; i < this.brandData.length; i++) {
        if (this.brandData[i].id === value) {
          this.activityForm.brandName = this.brandData[i].name;
          break;
        }
      }
    },
    init() {
      let unitId = this.$store.getters.user.orgUnit.id;
      let allCult = Api.venue.getVenueList('searchUnitId,isPublish:true', 1, -1);
      let str = "isPublish:true";
      let brandList = Api.system.getBrandList(str, 1, -1); // 初始化文化品牌
      let result = Promise.all([allCult, brandList]);
      result.then(([allCult, brandList]) => {
        this.cultData = allCult.content;
        this.brandData = brandList.content;
        if (this.flag === DIALOG.edit.flag) {
          this.getDetail();
        } else {
          //            this.cult = this.$store.getters.user.orgUnit.id;
        }
      });
    }
  },
  mounted() {
    this.init();
    this.id = this.$route.query.id;

    if (this.id) {
      this.title = DIALOG.edit.title;
      this.flag = DIALOG.edit.flag;
      this.tag = this.$route.query.flag;
    } else {
      let orgUnit = this.$store.getters.user.orgUnit
      this.activityForm.unitId = orgUnit.id;
      this.unitName = orgUnit.name;
    }
  }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.activity-itms {
  padding: 20px 0;
  margin-top: -10px;
  box-shadow: inset 0 5px 4px -4px rgba(49, 49, 64, 0.1);
  border: 1px solid #ccc;
  .el-form-item {
    margin-bottom: 20px;
  }
  .el-form-item:last-child {
    margin-bottom: 0;
  }
}
</style>
