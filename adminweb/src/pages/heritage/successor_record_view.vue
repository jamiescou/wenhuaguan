<template>
    <div class="view-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'index',name:'传承人管理'},{name:'数字资源'},{name:'查看'}]"></v-pageheader>
        <div style="margin-top:20px;">
            <el-row>
                <v-detailItem label="资源类型" :value="viewForm.type"></v-detailItem>
                <v-detailItem label="资源名称" :value="viewForm.name"></v-detailItem>
                <v-detailItem label="封面图片" type="image" :value="viewForm.pic" class="coveret" v-show="viewForm.type==='音频'?false:true"></v-detailItem>
                <v-detailItem label="资源文件" type="custom" v-show="viewForm.type==='图片'?false:true">
                    <div v-if="viewForm.fileName" @click="downLoadAttach" class="download-file">
                        <i class="sz-ico ico-download"></i>
                        <span class="attach-name">{{viewForm.fileName}}</span>
                    </div>
                </v-detailItem>
                <div class="dialog-footer">
                    <el-button @click="back">返回</el-button>
                </div>
            </el-row>
        </div>
    </div>
</template>

<script>
import Api from '@/api';
const RESERVETYPE = { pic: '图片', video: '视频', audio: '音频' };
export default {
    data() {
        return {
            id: '',
            did: '',
            viewForm: {
                type: '',
                name: '',
                pic: '',
                fileName: '',
                file: ''
            }
        }
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        getDetail() {
            Api.heritage.successorDigicInfoDetail(this.id, this.did).then((info) => {
                info.type = RESERVETYPE[info.type];
                info.pic = Api.system.getFileUrl(info.pic);
                this.viewForm = info;
            });
        },
        // 下载附件
        downLoadAttach() {
            let filename = this.viewForm.fileName;
            let fileUrl = Api.system.getFileUrl(this.viewForm.file);
            this.downloadFile(filename, fileUrl);
        }
    },
    mounted() {
        this.id = this.$route.query.id;
        this.did = this.$route.query.did;
        this.getDetail();
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.view-wrapper .coveret img {
    width: 354px;
    height: 236px;
}
</style>