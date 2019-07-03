<template>
    <div class="mien-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'index',name:'文化团队管理'},{name:'风采管理'},{name:title}]"></v-pageheader>
        <div class="form-wrapper">
            <el-form ref="digitInfoForm" :model="digitInfoForm" :rules="rules" label-position="right" label-width="120px" class="m-form">
                <el-form-item label="风采标题：" prop="title">
                    <el-input v-model="digitInfoForm.title" placeholder="风采标题"></el-input>
                </el-form-item>
                <el-col :span="24">
                    <el-form-item label="风采内容：" prop="content">
                        <el-input v-model="digitInfoForm.content"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="简介：" prop="brief">
                        <el-input v-model="digitInfoForm.brief"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="风采图片：" v-show="repic">
                        <ul class="mien-files-wrapper" style="padding:0;">
                            <li v-for="file in digitInfoForm.files" :key="file.filePath" v-if="digitInfoForm.files&&digitInfoForm.files.length" style="padding-right:13px;">
                                <img :src="getPath(file.filePath)" alt="">
                                <div class="img-actions" @click.stop.prevent>
                                    <span class="delete" @click.stop.prevent="handleDelImg(file)" title="删除">
                                        <i class="el-icon-delete2"></i>
                                    </span>
                                </div>
                            </li>
                        </ul>
                        <v-cropper class="cover" :imgUrl="pic" btnTxt="点击选择图片" :upload="handleUpload" :preview="false" v-show="digitInfoForm.files.length<5"></v-cropper>
                    </el-form-item>
                </el-col>
                <div class="form-opres">
                    <el-button @click="back" class="u-btn">返回</el-button>
                    <el-button @click="submitForm" type="primary" :loading="btnload" class="u-btn">确定</el-button>
                </div>
            </el-form>
        </div>

    </div>
</template>

<script>
import Api from '@/api';
import BaseTable from '@/mixins/base-table';
import vRules from '@/config/validate_rules';

export default {
    mixins: [BaseTable],
    data() {
        return {
            id: '',
            pic: '',
            title: '',
            acceptType: 'image',
            btnload: false,
            addType: false,
            refile: false,
            repic: true,
            currentIndex: '',
            callVisible: false,
            digitInfoForm: {
                title: '',
                files: [],
                content: '',
                brief: ''
            },
            dataList: [],
            rules: {
                title: [vRules.required,vRules.maxLen(40)],
                 content: [vRules.required]
            }
        }
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        callback() {
            this.showTip();
            this.back();
        },
        submitForm() {
            this.$refs['digitInfoForm'].validate((valid) => {
                if (valid) {
                    let newForm = Object.assign({}, this.digitInfoForm);
                    if (this.flag === 'add') {
                        Api.cultureteam.addMien(this.id, newForm).then(this.callback);
                    } else {
                        Api.cultureteam.editMien(this.id, this.$route.query.mid, newForm).then(this.callback);
                    }
                }
            });
        },
        /**
         * 上传封面图
         */
        handleUpload(formData) {
            Api.system.uploadFile(formData, 'pic').then((res) => {
                this.digitInfoForm.files.push({ fileType: 'pic', filePath: res.url });
            });
        },
        handleDelImg(file) {
            var index = this.digitInfoForm.files.indexOf(file)
            if (index !== -1) {
                this.digitInfoForm.files.splice(index, 1)
            }
        },
        getPath(path) {
            return Api.system.getFileUrl(path);
        },
        getDetail() {
            Api.cultureteam.detailMien(this.id, this.$route.query.mid).then((res) => {
                this.digitInfoForm = res;
            });
        }
    },
    mounted() {
        this.id = this.$route.query.id;
        this.flag = this.$route.query.flag;
        if (this.flag === 'edit') {
            this.title = '修改风采'
            this.getDetail();
        } else {
            this.title = '新增风采'
        }
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.mien-wrapper {
  .cover {
    width: 300px;
    height: 200px;
  }
  .mien-files-wrapper {
    list-style: none;
    margin: 0;
    display: inline-block;
    li {
      position: relative;
      display: inline-block;
      font-size: 0;
      line-height: 0;
      img {
        width: 300px;
        height: 200px;
      }
      &:hover {
        .img-actions {
          opacity: 1;
        }
      }
      .img-actions {
        position: absolute;
        right: 0;
        top: 0;
        width: 100%;
        height: 100%; // padding: 3px 6px;
        cursor: default;
        text-align: center;
        color: #fff;
        opacity: 0;
        font-size: 20px;
        background-color: rgba(0, 0, 0, 0.5);
        transition: opacity 0.3s;
        &:after {
          content: "";
          width: 0;
          height: 100%;
          display: inline-block;
          vertical-align: middle;
        }
        span {
          cursor: pointer;
        }
      }
    }
  }
}
</style>
