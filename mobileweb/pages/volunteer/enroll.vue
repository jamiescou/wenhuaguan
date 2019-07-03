<template>
  <section class="container vol-container">
    <mt-navbar v-model="currentTab" class="dd">
      <mt-tab-item id="personal">个人志愿者</mt-tab-item>
      <mt-tab-item id="team">团队志愿者</mt-tab-item>
    </mt-navbar>
    <div class="split"></div>
    <template v-if='formItem[currentTab].isvol==false'>
      <div class="block-heading">
        <h4 class="title">志愿者服务方向</h4>
      </div>
      <div class="flex-item desc-list serv-type">
        <span :class="formItem[currentTab].typeSelect[item.code]?'active':''" @click="serveSelect(item.code)" v-for='(item,index) in dicInfo.serviceTypes' :key='index'>
          <i class="icon icon-jiaobiao"></i>{{item.value}}</span>
        <!-- <span v-if='currentTab=="personal"' :class="personalTypeSelect[item.code]?'active':''" @click="serveSelect(item.code)" v-for='(item,index) in dicInfo.serviceTypes' :key='index'>
        <i class="icon icon-jiaobiao"></i>{{item.value}}</span> -->
      </div>
      <p class="vol-tip">注：志愿者招募活动将优先录用服务方向相同的志愿者</p>
      <div class="split"></div>
      <div class="block-heading">
        <h4 class="title">确认并填写志愿者身份信息</h4>
      </div>
      <div class="field-wrapper">
        <mt-field :label="formItem[currentTab].nameLabel" placeholder="请输入姓名" v-model="formItem[currentTab].name" class="form-field border-bottom"></mt-field>
        <mt-field label="手 机" placeholder="请输入手机号" v-model="formItem[currentTab].telephone" type='tel' class="form-field border-bottom"></mt-field>
        <mt-field label="团队人数" v-if='currentTab=="team"' placeholder="请输入团队人数" v-model="formItem[currentTab].teamCount" type='number' class="form-field border-bottom"></mt-field>
        <div class="flex-item desc-list border-bottom vfield  " @click="showPhoto">
          <div class="cell" v-if='currentTab=="personal"'>&nbsp;头&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;像</div>
          <div class="cell" v-if='currentTab=="team"'>团队头像</div>
          <div class="cell fixed">
            <v-uploadimg class="import-btn" style="width:200px;" ref="uploadImg" @loadimg="loadimg" @changeFiles="changeFiles">
              <img :src="formItem[currentTab].uploadImg" alt="" class="preview-img" v-if="formItem[currentTab].uploadImg">
            </v-uploadimg>
          </div>
          <div class="cell fixed">
            <i class="icon icon-angle-left"></i>
          </div>
        </div>
        <div class="flex-item desc-list border-bottom vfield ">
          <div class="cell ">&nbsp;所在区域</div>
          <div class="cell fixed ">
            <span class="selectText">{{formItem[currentTab].region}}</span>
            <i class="icon icon-down" @click='showRegionSelect'></i>
          </div>
        </div>

      </div>
      <mt-field label="详细地址" type="textarea" v-model="formItem[currentTab].address" class="form-field border-bottom" rows="4"></mt-field>
      <div class="split"></div>
      <div class="field-wrapper">
        <mt-field label="籍贯" v-model="formItem[currentTab].holdAddress" class="form-field border-bottom"></mt-field>
        <mt-field label="邮箱" type="email" v-model="formItem[currentTab].email" class="form-field border-bottom"></mt-field>

        <div class="flex-item desc-list border-bottom vfield ">
          <div class="cell ">&nbsp;职&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;业</div>
          <div class="cell fixed">
            <span class="selectText">{{formItem[currentTab].occupationName}}</span>
            <i class="icon icon-down" @click='showOccupation'></i>
          </div>
        </div>

        <div class="flex-item desc-list border-bottom vfield ">
          <div class="cell mint-cell-text">&nbsp;最高学历</div>
          <div class="cell fixed ">
            <span class="selectText">{{formItem[currentTab].educationName}}</span>
          </div>
          <div class="cell fixed ">
            <i class="icon icon-down" @click='showDegree'></i>
          </div>
        </div>

        <div class="flex-item desc-list border-bottom vfield ">
          <div class="cell mint-cell-text">&nbsp;政治面貌</div>
          <div class="cell fixed ">
            <span class="selectText">{{formItem[currentTab].politicalName}}</span>
            <i class="icon icon-down" @click='showPolitical'></i>
          </div>
        </div>
      </div>
      <mt-field label="个人简介" class="form-field border-bottom" v-model="formItem[currentTab].brief" type="textarea" rows="4"></mt-field>
    </template>
    <v-view :view="formItem[currentTab]" v-else></v-view>

    <div class="split"></div>
    <footer class="footer pre-footer" ref="footWrapper">
      <mt-button class="btn" v-if='formItem[currentTab].isvol==false' @click="submitVolReply">报名</mt-button>
      <mt-button class="btn end" v-if='formItem[currentTab].isvol==true'>已经是志愿者</mt-button>
    </footer>

    <mt-popup v-model="degree" position="bottom" class="act-pre-schedule vol-pop">
      <mt-picker :slots="slotsDegree" @change="onDegreeChange" :itemHeight="100"></mt-picker>
    </mt-popup>
    <mt-popup v-model="occupation" position="bottom" class="act-pre-schedule vol-pop">
      <mt-picker :slots="slotsOccupation" @change="onOccupationChange" :itemHeight="100"></mt-picker>
    </mt-popup>

    <mt-popup v-model="political" position="bottom" class="act-pre-schedule vol-pop">
      <mt-picker :slots="slotsPolitical" @change="onPoliticalChange" :itemHeight="100"></mt-picker>
    </mt-popup>

    <mt-popup v-model="address" position="bottom" class="act-pre-schedule vol-pop">
      <mt-picker :slots="slotsRegion" @change="onRegionChange" :itemHeight="100"></mt-picker>
    </mt-popup>

  </section>
</template>

<script>
import axios from "axios";
import { Field } from "mint-ui";
// import filterPanel from '~/components/filter-panel';
import rules from "~/util/validateRules";
import { toastMixin } from "~/components/mixins";
import uploadImg from "~/components/uploadImg.vue";
import view from "~/components/volutteer/view.vue";
export default {
  middleware: "auth",
  mixins: [toastMixin],
  components: {
    "v-uploadimg": uploadImg,
    'v-view': view
  },
  head: {
    title: "志愿者报名"
  },
  data() {
    return {
      currentTab: "personal",
      dicInfo: [],
      address: false,
      regions: [],
      degree: false,
      political: false,
      occupation: false,
      selectedOptions: {},
      filters: [],

      formItem: {
        team: {
          isvol: false,
          typeSelect: {},
          uploadImg: '/images/portrait.png',
          name: '',
          type: '',
          idNumber: '',
          sex: '',
          birthDay: '',
          avatar: '',
          email: '',
          serviceTypes: [],
          politicalStatus: "",
          politicalName: "",
          occupation: "",
          occupationName: "",
          education: '',
          educationName: '',
          holdAddress: '',
          brief: '',
          teamCount: '',
          telephone: '',
          region: '',
          address: '',
          userId: '',
          unitId: '',
          portraitName: '团队头像',
          nameLabel: '团队名称'
        },
        personal: {
          isvol: false,
          typeSelect: {},
          uploadImg: '/images/portrait.png',
          name: '',
          type: '',
          idNumber: '',
          sex: '',
          birthDay: '',
          avatar: '',
          email: '',
          serviceTypes: [],
          politicalStatus: "",
          politicalName: "",
          occupation: "",
          occupationName: "",
          education: '',
          educationName: '',
          holdAddress: '',
          brief: '',
          teamCount: '',
          telephone: '',
          region: '',
          address: '',
          userId: '',
          unitId: '',
          portraitName: '头像',
          nameLabel: '姓名'
        }
      },

      slotsDegree: [],
      slotsOccupation: [],
      slotsPolitical: [],
      slotsRegion: [
        {
          flex: 1,
          values: [],
          className: 'slot1',
          textAlign: 'center'
        }, {
          divider: true,
          content: '-',
          className: 'slot2'
        }, {
          flex: 1,
          values: [],
          className: 'slot3',
          textAlign: 'center'
        }
      ],

    };
  },

  async asyncData({ req, params, store }) {
    let res = await axios.get("/volunteer/enroll");
    let degree = res.data.education.map(item => item.value);
    let occupation = res.data.occupation.map(item => item.value);
    let political = res.data.politicalStatus.map(item => item.value);
    console.log(res);
    

    let typeSelect = {};
    res.data.serviceTypes.forEach(function(item) {
      typeSelect[item.code] = false;
    })

    return {
      dicInfo: res.data,
      typeSelect: typeSelect,
      slotsDegree: [
        {
          flex: 1,
          values: degree,
          className: 'slot1',
          textAlign: 'center'
        }
      ],
      slotsOccupation: [
        {
          flex: 1,
          values: occupation,
          className: "slot3",
          textAlign: "center"
        }
      ],
      slotsPolitical: [
        {
          flex: 1,
          values: political,
          className: "slot2",
          textAlign: "center"
        }
      ]
    };
  },
  watch: {
    '$store.getters.regions'(val) {
      this.setRegion();
    }
  },
  mounted() {
    //console.log(this.dicInfo.serviceTypes)
    //console.log(this.$store)
    if (this.$store.getters.regions) {
      this.setRegion();
    }
    this.formItem.team.typeSelect = JSON.parse(JSON.stringify(this.typeSelect));
    this.formItem.personal.typeSelect = JSON.parse(JSON.stringify(this.typeSelect));

    if (this.dicInfo.teamInfo) {  //团队志愿者
      Object.assign(this.formItem.team, this.dicInfo.teamInfo);
      this.formItem.team.isvol = true;
      this.dicInfo.teamInfo.serviceTypes.forEach(item => this.formItem.team.typeSelect[item] = true)
      this.formItem.team.uploadImg = this.dicInfo.teamInfo.avatar;

    }

    if (this.dicInfo.personalInfo) {
      Object.assign(this.formItem.personal, this.dicInfo.personalInfo);
      this.dicInfo.personalInfo.serviceTypes.forEach(item => this.formItem.personal.typeSelect[item] = true)
      this.formItem.personal.isvol = true;
      this.formItem.personal.uploadImg = this.dicInfo.personalInfo.avatar;
    }

  },
  methods: {
    setRegion() {
      if (!this.$store.getters.regions || !this.$store.getters.regions.length) return;
      let regions = this.$store.getters.regions.slice(0);
      //console.log(regions)
      regions.shift(0);//去掉全部
      this.regions = regions;
      let citys = regions.map(item => item.name);
      let counts = regions[0].children.map(item => item.name);
      this.slotsRegion[0].values = citys;
      this.slotsRegion[2].values = counts;
    },
    loadimg(url) {       //预览
      this.formItem[this.currentTab].uploadImg = url;
    },
    changeFiles(file) {  //选择文件

      this.formItem[this.currentTab].avatar = file;
    },
    showDegree() {
      this.degree = true;
    },
    showPolitical() {
      this.political = true;
    },
    showOccupation() {
      this.occupation = true;
    },
    showRegionSelect() {
      this.address = true;
    },
    onDegreeChange(picker, values) {
      let _this = this;
      if (values === undefined) return;
      this.formItem[this.currentTab].educationName = values[0];
      this.dicInfo.education.forEach(function(item) {
        if ((item.value == values[0])) {
          _this.formItem[_this.currentTab].education = item.code;
        }
      });
    },
    onOccupationChange(picker, values) {
      let _this = this;
      if (values === undefined) return;
      this.formItem[this.currentTab].occupationName = values[0];
      this.dicInfo.occupation.forEach(function(item) {
        if ((item.value == values[0])) {
          _this.formItem[_this.currentTab].occupation = item.code;
        }
      });
    },
    onPoliticalChange(picker, values) {
      let _this = this;
      if (values === undefined) return;
      this.formItem[this.currentTab].politicalName = values[0];
      this.dicInfo.politicalStatus.forEach(function(item) {
        if ((item.value == values[0])) {
          _this.formItem[_this.currentTab].politicalStatus = item.code;
        }
      });
    },
    onRegionChange(picker, values) {
      let countys = [];


      this.regions.forEach(function(item) {
        if (item.name == values[0]) {
          countys = item.children.map(itm => itm.name);
        }
      })
      picker.setSlotValues(1, countys);
      this.formItem[this.currentTab].region = values.join(' ');
    },
    showPhoto() {
      this.$refs.uploadImg.handleClick();
    },
    serveSelect(code) {
      //console.log(code + '  ' + this.currentTab);
      let formItem = this.formItem[this.currentTab];
      //console.log(formItem.typeSelect);
      //console.log(formItem.serviceTypes);
      let index = formItem.serviceTypes.indexOf(code);
      //console.log(index);
      if (index >= 0) {
        formItem.serviceTypes.splice(index, 1);
        formItem.typeSelect[code] = false;
      } else {
        formItem.serviceTypes.push(code);
        formItem.typeSelect[code] = true;
      }
    },
    async submitVolReply() {

      let formItem = this.formItem[this.currentTab];
      if (!rules.required(formItem.name, '请输入名称！')) return false;
      if (!rules.required(formItem.serviceTypes, '请选择服务类型！')) return false;
      if (!rules.required(formItem.avatar, '请上传头像')) return false;
      if (!rules.required(formItem.region, '请选择地区！')) return false;
      if (!rules.required(formItem.address, '请填写详细地址！')) return false;
      if (!rules.required(formItem.brief, '请填写志愿者介绍')) return false;

      let formData = new FormData();
      formData.append('name', formItem.name);
      formData.append('type', this.currentTab);
      formData.append('avatar', formItem.avatar);
      formData.append('email', formItem.email);
      formData.append('serviceTypes', JSON.stringify(formItem.serviceTypes));
      formData.append('politicalStatus', formItem.politicalStatus);
      formData.append('occupation', formItem.occupation);
      formData.append('education', formItem.education);
      formData.append('holdAddress', formItem.holdAddress);
      formData.append('brief', formItem.brief);
      formData.append('telephone', formItem.telephone);
      formData.append('region', formItem.region);
      formData.append('address', formItem.address);
      formData.append('teamCount', formItem.teamCount);

      let res = await axios.post('/volunteer/enroll', formData);
      this.showMsg(res.data.msg);
      if (res.data.success) {

        await this.$store.dispatch('fetchUsers')
        this.$router.replace('/volunteer');
        //  this.showMsg(res.data.msg);
      } else {

      }

    }

  }
};
</script>

<style lang="scss" >
@import "~static/styles/pages/volunteer.scss";
</style>