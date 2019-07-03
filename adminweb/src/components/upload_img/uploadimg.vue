<template>
    <el-upload class="upload-wrapper" action="" :http-request="upload" :show-file-list="false" :on-remove="handleDelImg" :on-success="handleSuccess" :before-upload="beforeChecking">
        <img v-if="myImg" :src="myImg" alt="" class="thumbnail">
        <span class="img-actions" v-if="!disabled && myImg" @click.stop.prevent>
            <span class="delete" @click.stop.prevent="handleDelImg" title="删除">
                <i class="el-icon-delete2"></i>
            </span>
        </span>
        <div v-else class="thumbnail defaultHint">
            <i class="sz-ico ico-picture"></i>
            <el-button type="info" size="small">{{btnTxt}}</el-button>
            <div class="upload-hint">图片格式为jpg、png、gif，建议图片尺寸 {{sizecode}}，大小为{{filesize}}MB以内</div>
        </div>
    </el-upload>
</template>

<script>
export default {
    props: {
        disabled: Boolean,
        imgUrl: {
            type: String,
            default: ''
        },
        upload: Function,
        success: Function,
        btnTxt: {
            type: String,
            default: '点击选择文件'
        },
        sizecode:{
            type: String,
            default: '750*500'
        },
        filesizecode:{
            type: String,
            default: '5'
        },
    },
    data() {
        return {
            size:"",
            filesize:"",
            myImg: this.imgUrl
        }
    },
    watch: {
        imgUrl(val, oldVal) {
            if (val !== oldVal) {
                if (typeof val === 'object') this.myImg = window.URL.createObjectURL(val)
                else this.myImg = val;
            }
        }
    },
    methods: {
        handleSuccess(res, file) {
            this.myImg = URL.createObjectURL(file.raw);
        },
        beforeChecking(file) {
            const isImage = ['image/jpeg', 'image/gif', 'image/png'].some(type => type === file.type);
            const isLt2M = file.size / 1024 / 1024 < 5;
            let msg = '';

            // 仅限图片
            if (!isImage) {
                msg = '仅限jpg,pgn,gif格式的图片';
            }
            if (!isLt2M) {
                msg = '上传头像图片大小不能超过 5MB!';
            }
            this.$emit('onError', msg);
            return isImage && isLt2M;
        },
        handleDelImg() {
            this.myImg = '';
            this.$emit('onError', null);
            this.$emit('remove');
        }
    },
    mounted() {
      this.size=  this.sizecode;
      this.filesize=  this.filesizecode;
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.upload-wrapper {
  position: relative;
  display: inline-block;
  text-align: center;
  cursor: pointer;
  .el-upload {
    width: 100%;
    height: 100%;
  }
  .thumbnail {
    width: 100%;
    height: 100%;
    display: block;
    border-radius: 6px;
  }
  .defaultHint {
    position: relative;
    display: table;
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    box-sizing: border-box;
    overflow: hidden;
    text-align: center;
    cursor: pointer;
    &:hover {
      border-color: #20a0ff;
    }
    .sz-ico {
      display: block;
      margin-top: 10%;
      font-size: 45px;
      color: #8c939d;
    }
  }
  &:hover {
    .img-actions {
      opacity: 1;
      span {
        display: inline-block;
      }
    }
  }
  .img-actions {
    position: absolute;
    right: 0;
    top: 0;
    cursor: default;
    text-align: center;
    color: #fff;
    opacity: 0;
    font-size: 20px;
    border-radius: 6px;
    background-color: rgba(0, 0, 0, 0.5);
    transition: opacity 0.3s;
    span {
      display: none;
      cursor: pointer;
    }
    span + span {
      margin-left: 15px;
    }
  }
  .upload-hint {
    display: block;
    position: absolute;
    right: 1px;
    bottom: 1px;
    left: 1px;
    font-size: 12px;
    line-height: 1.2;
    padding: 3px 5px;
    text-align: left;
    color: #c1c1c1;
  }
}
</style>
