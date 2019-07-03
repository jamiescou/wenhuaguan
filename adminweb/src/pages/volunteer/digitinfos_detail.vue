<template>
    <div class="view-wrapper">
        <v-pageheader :breadcrumbs="breadcrumbs"></v-pageheader>
        <div style="margin-top:20px;">
            <el-row>
                <v-detailItem label="资源类型" :value="viewForm.typeName"></v-detailItem>
                <v-detailItem label="资源名称" :value="viewForm.name"></v-detailItem>
                <v-detailItem label="封面图片" type="image" :value="viewForm.pic" class="cover" v-if="hasPic"></v-detailItem>
                <v-detailItem label="资源文件" type="custom" v-show="hasFile">
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
const DIGITTYPE = { pic: '图片', video: '视频', audio: '音频' }
const HASPICTYPE = ['pic', 'video']; // 有图片
const HASFILETYPE = ['video', 'audio'];   // 有文件
export default {
    data() {
        return {
            id: '',
            did: '',
            viewForm: {
                type: '',
                typeName: '',
                name: '',
                pic: '',
                fileName: '',
                file: ''
            }
        }
    },
    computed: {
        hasPic() {
            return HASPICTYPE.some(x => x === this.viewForm.type);
        },
        hasFile() {
            return HASFILETYPE.some(x => x === this.viewForm.type);
        }
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        getDetail() {
            Api.nouns.getVolunrecruitDigitinfosde(this.id, this.did).then((info) => {
                info.typeName = DIGITTYPE[info.type];
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
    created() {
        this.id = this.$route.query.id;
        this.did = this.$route.query.did;
        this.getDetail();
        this.breadcrumbs = [
            { to: 'activity_list', name: '志愿者活动' },
            { to: { path: 'digitinfos_list', query: { id: this.id } }, name: '活动风采纪实' },
            { name: '查看' }
        ]
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>