<template>
    <div class="upload-file-wrapper">
        <el-upload action="" :http-request="upload" :on-change="handleChange" :on-remove="handleRemove"  :file-list="fileList" :before-upload="beforeChecking">
            <el-button size="small" type="primary">选择文件</el-button>
            <div slot="tip" class="el-upload__tip">{{acceptTip}}</div>
        </el-upload>
        <div class="error-hint" v-if="error.has">{{error.msg}}</div>
        
    </div>
</template>

<script>
export default {
    props: {
        disabled: Boolean,
        upload: Function,
        filename: {
            type: String,
            default: null
        },
        acceptType: {
            type: String,
            default: 'document' // document\image\audio\video
        },
        options: {
            default() {
                return {
                    // maxFileSize: 10000000, // 10 MB
                    // minFileSize:
                }
            }
        }

    },
    computed: {
        acceptTip() {
            return this.messages[this.acceptType]
        },
        validType() {
            return this.acceptTypes[this.acceptType]
        }
    },
    data() {
        return {            
            fileList: [],
            error: {
                has: false,
                msg: ''
            },
            messages: {
                acceptFileTypes: '不允许的文件类型',
                maxFileSize: '文件太大',
                minFileSize: '文件太小',
                document: '限.doc/.docx/.xls/.xlsx/.txt/.pdf/.rar/.zip格式的文件',
                image: '限jpg,pgn,gif格式的图片',
                audio: '限mp3、m4a、wma格式的音频',
                video: '限.mp4格式的视频',
                pdf: '限.pdf格式的文件'
            },
            acceptTypes: {
                document: [
                    'text/csv', // *.csv
                    'application/msword', // *.doc、*.dot
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
                    'application/vnd.ms-excel', // *.xlc、*.xlm、*.xls、*.xlt、*.xlw
                    'application/zip', // *.zip
                    'application/x-zip-compressed',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
                    'application/pdf', // *.pdf
                    'text/plain' // *.txt
                ],
                pdf: ['application/pdf'],
                image: ['image/jpeg', 'image/gif', 'image/png'],
                audio: ['audio/mpeg', 'audio/mp3', 'audio/mp4', 'audio/x-ms-wma', 'audio/x-m4a'],
                video: ['video/mp4']
            }
        }
    },
    watch: {
        filename(val) {
            if (val && val !== '') {
                this.fileList = [{ name: val }]
            } else {
                this.fileList = [];
            }
        },
        acceptType(val, oldval) {
            if (val !== '' && val !== oldval) {
                this.clear();
            }
        }
    },
  mounted(){
    if (this.filename && this.filename !== '') {
      this.fileList = [{ name: this.filename }]
    } else {
      this.fileList = [];
    }
  },
    methods: {
        clear() {
            // this.fileList = [];
            this.error = { has: false, msg: '' };
        },
        handleRemove(file, fileList) {            
            this.fileList = fileList;
            this.$emit('remove');
        },
        cancelfunctioncanback()
        {
            this.$emit('cancelfunction');
        },
        handleChange(file, fileList) {
            this.fileList = fileList.slice(-1);
        },
        beforeChecking(file) {
            this.error.msg = '';
            // 格式限制
            let acceptType = this.validType;
            const isAcceptType = acceptType.some(type => type === file.type);
            if (this.acceptType === 'document' && file.type === '') {
                let isZipOrRar = false;
                var pos = file.name.lastIndexOf('.');
                var lastname = file.name.substring(pos).toLowerCase();
                isZipOrRar = (lastname === '.zip' || lastname === '.rar');
                if (!(isAcceptType || isZipOrRar)) {
                    this.error.msg = this.messages.acceptFileTypes;
                }
            } else if (!isAcceptType) {
                this.error.msg = this.messages.acceptFileTypes;
            }

            // 大小限制
            let fileSize;
            if (this.options.minFileSize || this.options.maxFileSize) {
                fileSize = file.size;
            }
            if (fileSize && this.options.maxFileSize && fileSize > this.options.maxFileSize) {
                this.error.msg = this.messages.maxFileSize;
            }
            if (fileSize && this.options.minFileSize && fileSize < this.options.minFileSize) {
                this.error.msg = this.messages.minFileSize;
            }

            this.error.has = this.error.msg !== '';
            return !this.error.has;
        }
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.upload-file-wrapper {
  text-align: left;
  .error-hint {
    font-size: 12px;
    line-height: 1.8;
    padding: 4px 5px 3px;
    color: #ff4949;
  }
  .el-upload__tip {
    display: inline-block;
    margin-left: 10px;
  }
}
</style>
