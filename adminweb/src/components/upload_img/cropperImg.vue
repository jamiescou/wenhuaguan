<template>
    <div class="upload-wrapper">
        <!-- accept="image/*" 加了限定，好慢 -->
        <input class="upload-input" type="file" ref="imgUpload" @change="handleChange"></input>
        <div class="preview" @drop="preventDefault" @dragleave="preventDefault" @dragover="preventDefault" @dragenter="preventDefault">
            <img v-if="myImg" :src="myImg" alt="" class="thumbnail">
            <div v-else class="thumbnail defaultHint" @click.stop.prevent="handleClick">
                <i class="sz-ico ico-picture"></i>
                <el-button type="info" size="small">{{btnTxt}}</el-button>
                <div class="upload-hint">图片格式为jpg、png、gif，建议图片尺寸 {{size}}，大小为{{filesize}}MB以内</div>
            </div>
            <span class="img-actions" v-if="!disabled && myImg" @click.stop.prevent>
                <span class="delete" @click.stop.prevent="handleDelImg" title="删除">
                    <i class="el-icon-delete2"></i>
                </span>
                <span class="again-upload" @click.stop.prevent="handleClick" title="重新上传">
                    <i class="el-icon-upload"></i>
                </span>
            </span>
        </div>
        <div class="error-hint" v-if="error.has">{{error.msg}}</div>
        <div class="cropper-wrapper" v-show="imgCropperDialog">
            <div class="cropper-content">
                <div class="imgcropper-wrap">
                    <div class="img-container">
                        <h5 class="content-title">图片编辑：</h5>
                        <div class="img-box">
                            <img ref="cropperImg" :src="cropImg">
                        </div>
                        <div class="choose-pic-btn">
                            <el-button type="info" size="small" @click="handleClick">重新选择</el-button>
                        </div>
                    </div>
                    <div class="docs-preview" style="">
                        <h5 class="content-title">预览：</h5>
                        <div class="img-preview"></div>
                    </div>
                </div>
                <div class="operations">
                    <el-button @click="imgCropperDialog = false">取 消</el-button>
                    <el-button type="primary" @click="handleCrop">确 定</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css';
export default {
    props: {
        disabled: Boolean,
        imgUrl: {
            type: [String, Blob],
            default: ''
        },
        btnTxt: {
            type: String,
            default: '点击选择图片'
        },
        upload: {
            type: Function,
            default: function(blob) { }
        },
        aspectRatio: {
            type: Number,
            default: 3 / 2
        },
        preview: {
            type: Boolean,
            default: true
        },
        index: {
            type: Number,
            default: 0
        },
        sizecode: {
            type: String,
            default: '750*500'
        },
        filesizecode: {
            type: String,
            default: '5'
        },
        maxWidth: {
            type: Number,
            default: 500
        }
    },
    data() {
        return {
            size: "",
            filesize: "",
            myImg: this.imgUrl,
            imgCropperDialog: false,
            croppable: false, // 是否可裁剪
            cropImg: '',
            sourceFile: '', // 原始文件
            error: {
                has: false,
                msg: ''
            }
        }
    },
    watch: {
        imgUrl(val, oldVal) {
            if (val !== oldVal && this.preview) {
                if (typeof val === 'object') this.myImg = window.URL.createObjectURL(val)
                else this.myImg = val;
            }
        }
    },
    methods: {
        preventDefault(e) {
            e.preventDefault();
            return false;
        },
        handleClick() {
            if (!this.disabled) {
                this.$refs.imgUpload.click();
            }
        },
        handleChange(event) {
            const files = event.target.files || event.dataTransfer.files;

            if (!files) return;
            this.changeFiles(files);
            this.$refs.imgUpload.value = null;
        },
        changeFiles(files) {
            let that = this;
            let postFiles = Array.prototype.slice.call(files);
            postFiles = postFiles.slice(0, 1);
            if (postFiles.length === 0) { return; }

            let file = postFiles[0];
            const before = this.beforeChecking(file);
            if (before) {
                let reader = new FileReader();
                reader.onloadend = function() {
                    that.cropImg = reader.result;
                    that.cropper.replace(that.cropImg);
                }
                this.sourceFile = file;
                reader.readAsDataURL(file);
                this.imgCropperDialog = true;
                this.error = { has: false, msg: '' };
            }
        },
        // 格式等验证
        beforeChecking(file) {
            const isImage = ['image/jpeg', 'image/gif', 'image/png'].some(type => type === file.type);
            const isLt2M = file.size / 1024 / 1024 < 5;
            let msg = '';

            // 仅限图片
            if (!isImage) {
                msg = '仅限jpg,pgn,gif格式的图片';
            }
            if (!isLt2M) {
                msg = '上传图片大小不能超过5MB!';
            }
            let valid = (isImage && isLt2M)
            this.error = { has: !valid, msg: msg };
            // this.$emit('onError', msg);
            return valid;
        },
        // 删除
        handleDelImg() {
            this.myImg = '';
            this.cropImg = '';
            this.sourceFile = '';
            this.$refs.imgUpload.value = null;
            this.error = { has: false, msg: '' };
            // this.$emit('onError', null);
            this.$emit('remove', this.index);
        },
        // 开始裁剪
        handleCrop() {
            if (!this.croppable) {
                return;
            }
            let croppedCanvas = this.cropper.getCroppedCanvas({
                fillColor: '#fff',
                imageSmoothingEnabled: false,
                imageSmoothingQuality: 'high',
                maxWidth: this.maxWidth
            });
            if (this.preview) this.myImg = croppedCanvas.toDataURL();
            let self = this;
            croppedCanvas.toBlob(function(blob) {
                var formData = new FormData();
                formData.append('file', blob);
                formData.append('filename', self.sourceFile.name);
                formData.append('filesize', self.sourceFile.size);
                self.upload(formData, self.index || 0);
            })
            this.imgCropperDialog = false;
        }
    },
    mounted() {
        this.size = this.sizecode;
        this.filesize = this.filesizecode;
        // 初始化裁剪框
        var self = this;
        this.cropper = new Cropper(this.$refs.cropperImg, {
            guides: true,
            viewMode: 1,
            dragMode: 'crop',
            autoCropArea: 1, // 0.5,
            background: true,
            rotatable: true,
            preview: '.img-preview',
            // zoomable: false, // 禁止缩放
            // zoomOnWheel: false, // 禁止滚轮缩放
            aspectRatio: this.aspectRatio,
            ready: function() {
                self.croppable = true;
            }
        });
    },
    destroyed() {
        this.cropper.destroy();
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.upload-wrapper {
  position: relative;
  display: inline-block;
  text-align: center;
  cursor: pointer;
  .upload-input {
    display: none;
  }
  .preview {
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
      display: none;
      cursor: pointer;
    }
    span + span {
      margin-left: 15px;
    }
    .again-upload {
      font-size: 25px;
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

  .cropper-wrapper {
    // height: 500px;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(37, 34, 35, 0.49);
    z-index: 9999;
    .cropper-content {
      background-color: #fff;
      $cropper-h: 520px;
      $cropper-w: 860px;
      position: absolute;
      top: 50%;
      left: 50%;
      height: $cropper-h;
      width: $cropper-w;
      margin-top: -($cropper-h / 2);
      margin-left: -($cropper-w/2);
    }
    .operations {
      padding-right: 30px;
      text-align: right;
      .el-button {
        padding: 8px 20px;
      }
    }
  }
  .error-hint {
    position: absolute;
    right: 1px;
    top: 1px;
    left: 1px;
    font-size: 12px;
    line-height: 1.8;
    padding: 4px 5px 3px;
    color: #ff4949;
    background: rgba(238, 241, 246, 0.8);
  }
}
</style>
