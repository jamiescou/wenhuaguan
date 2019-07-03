<template>
    <div class="edit-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'index',name: '电子杂志管理' },{name:'查看期刊详情'}]"></v-pageheader>
        <div style="margin-top:20px;">
            <el-row>
                <el-row :gutter="10">
                    <v-detailItem label="杂志名称" :value="name"></v-detailItem>
                    <v-detailItem label="封面图片" type="image" :value="viewForm.coverPic" class="cover"></v-detailItem>
                    <v-detailItem label="所属年份" :value="viewForm.year"></v-detailItem>
                    <v-detailItem label="当前期数" :value="viewForm.seqno"></v-detailItem>
                    <v-detailItem label="期数备注" :value="viewForm.remark"></v-detailItem>
                    <v-detailItem label="总期数" :value="viewForm.totalno"></v-detailItem>
                    <v-detailItem label="可否在线阅读" :value="viewForm.isOnline"></v-detailItem>
                    <v-detailItem label="杂志电子版" type="custom">
                        <div v-if="viewForm.fileName" @click="downLoadAttach" class="download-file">
                            <i class="sz-ico ico-download"></i>
                            <span class="attach-name">{{viewForm.fileName}}</span>
                        </div>
                    </v-detailItem>
                </el-row>
                <div class="form-opres" style="text-align:center">
                    <el-button @click="back" class="u-btn">返回</el-button>
                </div>
            </el-row>
        </div>
    </div>
</template>

<script>
import Api from '@/api'
export default {
    data() {
        return {
            id: '',
            mid: '',
            name: '',
            viewForm: {}
        }
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        // 下载附件
        downLoadAttach() {
            let filename = this.viewForm.fileName;
            let fileUrl = Api.system.getFileUrl(this.viewForm.fileAddress);
            this.downloadFile(filename, fileUrl);
        }
    },
    mounted() {
        this.mid = this.$route.query.mid;
        this.id = this.$route.query.id;
        // 获取所属杂志名称
        Api.magazine.getMagazine(this.mid).then((res) => {
            this.name = res.name;
        });
        // 获取详情
        Api.magazine.getMagazineIssue(this.mid, this.id).then((res) => {
            res.coverPic = Api.system.getFileUrl(res.coverPic);
            res.isOnline = res.isOnline ? '是' : '否';
            this.viewForm = res;
        });
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
