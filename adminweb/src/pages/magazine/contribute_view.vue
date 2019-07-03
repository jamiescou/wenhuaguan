<template>
    <div class="edit-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'index',name: '电子杂志管理' },{name:'查看稿件详情'}]"></v-pageheader>
        <div style="margin-top:20px;">
            <el-row>
                <el-row :gutter="10">
                    <v-detailItem label="稿件名称" :value="viewForm.title"></v-detailItem>
                    <v-detailItem label="摘要" :value="viewForm.brief"></v-detailItem>
                    <v-detailItem label="姓名" :value="viewForm.userName"></v-detailItem>
                    <v-detailItem label="联系电话" :value="viewForm.mobile"></v-detailItem>
                    <v-detailItem label="提交时间" :value="viewForm.commitTime"></v-detailItem>
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
        Api.magazine.getContribute(this.mid, this.id).then((res) => {
            this.viewForm = res;
        });
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
