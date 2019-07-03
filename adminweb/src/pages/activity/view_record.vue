<template>
    <div class="view-wrapper">
        <v-pageheader :breadcrumbs="breadcrumbs"></v-pageheader>
        <div style="margin-top:20px;">
            <el-row>
                <v-detailItem label="资源类型" :value="viewForm.type"></v-detailItem>
                <v-detailItem label="资源名称" :value="viewForm.name"></v-detailItem>
                <v-detailItem label="封面图片" type="image" :value="viewForm.pic" class="cover" v-show="viewForm.type==='音频'?false:true"></v-detailItem>
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
import { PARENT_NAME } from './activity_status'
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
    created() {
        this.id = this.$route.query.id;
        this.did = this.$route.query.did;
        let rootPath = PARENT_NAME['3'];
        this.breadcrumbs = [
            { to: rootPath.path, name: rootPath.name },
            { to: { path: 'record_list', query: { flag: this.id } }, name: '活动纪实' },
            { name: '查看' }
        ]
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        getDetail() {
            Api.activity.activityDigicInfoDetail(this.id, this.did).then((info) => {
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

</style>