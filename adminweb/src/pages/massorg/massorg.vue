<template>
  <div class="edit-wrapper" v-loading="loading">
    <v-pageheader :breadcrumbs="[{ to:titleInfo.path,name: titleInfo.name },{name:title}]"></v-pageheader>
    <div class="form-wrapper">
      <el-form ref="massorgForm" :model="massorgForm" :rules="rules" label-position="right" label-width="100px" class="m-form">
        <el-row :gutter="20">
          <el-col :span="14">
            <el-form-item label="所属文化馆">
              <el-input v-model="unitName" readonly></el-input>
            </el-form-item>
            <el-form-item label="组织名称" prop="name">
              <el-input v-model="massorgForm.name" :maxlength="40"></el-input>
            </el-form-item>
            <el-form-item label="联系人" prop="contact">
              <el-input v-model="massorgForm.contact"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="contactPhone">
              <el-input v-model="massorgForm.contactPhone"></el-input>
            </el-form-item>
            <el-form-item label="电子邮箱" prop="email">
              <el-input v-model="massorgForm.email"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" class='pic-col'>
            <!-- 封面图片 -->
            <el-form-item label-width="0" prop="coverPic">
              <v-cropper class="cover" btnTxt="请选择活动封面图片" :imgUrl='coverPic' :upload="handleUpload" @remove="removeImg"></v-cropper>
              <el-input v-model="massorgForm.coverPic" v-show="false"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="活动地址" required>
          <el-col :span="18">
            <el-form-item prop="region" class="cooperation">
              <v-cooperation v-model="massorgForm.region" :code="massorgForm.region" ref="cooperationRegion"></v-cooperation>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="address">
              <el-input v-model="massorgForm.address" ></el-input>
            </el-form-item>
          </el-col>
       </el-form-item>
       <el-form-item label="组织简介" prop="brief">
          <el-input type="textarea" v-model="massorgForm.brief"></el-input>
        </el-form-item>
        <el-form-item label="组织描述" prop="desc">
          <v-richeditor v-model="massorgForm.desc" ref="richEditor"></v-richeditor>
        </el-form-item>
        <el-form-item label="上传附件" >          <!-- 附件 -->
             <v-uploadfile :upload="handleUploadFile" @remove="handleRemoveAttach"  :filename="massorgForm.attachName"  ref="uploadfile" @cancelfunction="cancelfunctioncanback"></v-uploadfile>
        </el-form-item>
        <div class="form-opres">
          <el-button @click="back" class="u-btn">返回</el-button>
          <el-button @click="submitForm" type="primary" class="u-btn">确定</el-button>
        </div>
      </el-form>
    </div>

  </div>
</template>

<script>
import Api from "@/api";
import axios from "axios";
import vRules from "@/config/validate_rules";
import _status, { PARENT_NAME, reservetypeOpts } from "./massorg_status";
const DIALOG = {
  add: {
    title: "添加组织",
    flag: "Add"
  },
  edit: {
    title: "编辑组织",
    flag: "Edit"
  }
};
export default {
  components: {},
  data() {
    return {
      loading: false,
      flag: "",
      coverPic: "",
      titleInfo: PARENT_NAME["1"],
      title: DIALOG.add.title,
      flag: DIALOG.add.flag,
      unitName: "", // 组织
      massorgForm: {
        name: "",
        coverPic: "",
        region: "",
        address: "",
        contact: "",
        contactPhone: "",
        email: "",
        brief: "",
        desc: "",
        attachName: "",
        attach: "",
        unitId: "",
        isPublish:false
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },

      rules: {
        coverPic: [vRules.required_Msg("没有选择封面图片或图片上传中")],
        name: [vRules.required, vRules.maxLen(40)],
        region: [vRules.required],
        address: [vRules.required],
        contact: [vRules.required],
        contactPhone: [vRules.required],
        email: [vRules.required]

      },
      otherRules: {}
    };
  },
  computed: {},
  methods: {
    submitForm() {
      this.$refs["massorgForm"].validate(valid => {
        if (valid) {
          if (this.flag === DIALOG.add.flag) {
            // 提交人信息
            this.massorgForm.dataDeptId = this.$store.getters.user.unit.id;
            Api.massorg.addMassorg(this.massorgForm).then(this.callback);
          } else if (this.flag === DIALOG.edit.flag) {

            Api.massorg.modifyMassorg(this.massorgForm.id, this.massorgForm)
              .then(this.callback);
          }
        }
      });
    },
     getDetail() {
        this.loading = true;
        Api.massorg.getMassorg(this.id).then((res) => {
          // 所属机构
          Api.system.getUnitInfo(res.unitId).then((res) => {
            if (res) {
              this.unitName = res.name;
            }
          });
          this.massorgForm = res;
          this.coverPic = Api.system.getFileUrl(res.coverPic);
          this.$refs.cooperationRegion.initCode(this.massorgForm.region);
          this.loading = false;
        }).catch(() => {
          this.loading = false
        });
      },
    callback() {
      this.showTip();
      this.back();
    },
    back() {
      this.$router.replace(this.titleInfo.path);
    },
    // 图片上传
    handleUpload(formData) {
      Api.system.uploadFile(formData, "pic").then(res => {
        this.massorgForm.coverPic = res.url;
      });
    },
    // 删除图片
    removeImg() {
      this.massorgForm.coverPic = "";
    },
    //取消上传
    cancelfunctioncanback() {
      this.source.cancel("取消上传");
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
      formData.append("file", file);
      formData.append("filename", fileName);
      this.$refs.uploadfile.progressShow = true;
      this.source = axios.CancelToken.source();
      return Api.system
        .uploadFile(
          formData,
          "attach",
          this.onUploadProgress,
          this.source.token
        )
        .then(res => {
          this.massorgForm.attach = res.url;
          this.massorgForm.attachName = fileName;
        });
    },
    //上传进度显示
    onUploadProgress(value) {
      this.$refs.uploadfile.Progress = value;
      if (value == "100") {
        this.$refs.uploadfile.progressShow = false;
      }
    },
    // 删除附件
    handleRemoveAttach() {
      this.massorgForm.attach = "";
      this.massorgForm.attachName = "";
    }
  },
  mounted() {
    this.id = this.$route.query.id;

    if (this.id) {
      this.title = DIALOG.edit.title;
      this.flag = DIALOG.edit.flag;
      this.tag = this.$route.query.flag;
      this.getDetail();
    } else {
      let orgUnit = this.$store.getters.user.orgUnit;
      this.massorgForm.unitId = orgUnit.id;
      this.unitName = orgUnit.name;
    }
  }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
