<template>
    <div class="view-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'memberWorks',name:'会员作品'},{name:'会员作品详情'},{name:title}]"></v-pageheader>
        <div style="margin-top:20px;">
            <el-row>
                <el-col :span="12">
                    <v-detailItem label="标题" :value="viewForm.title"></v-detailItem>
                    <v-detailItem label="内容" :value="viewForm.content"></v-detailItem>
                    <v-detailItem label="创建时间" :value="viewForm.createTime"></v-detailItem>
                    <v-detailItem label="简介" :value="viewForm.brief"></v-detailItem>
                </el-col>
            </el-row>
            <div class="detail-item">
                <label class="label-title">图片：</label>
                <div class="label-content">
                    <div style="float:left;" v-for="file in viewForm.files" :key="file.filePath" v-if="viewForm.files&&viewForm.files.length">
                        <img style="width:230px;" :src="getPath(file.filePath)" alt="">
                    </div>
                </div>
            </div>
            <div class="dialog-footer">
                <el-button @click="back">关闭</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import Api from '@/api';
export default {
    data() {
        return {
            title: '作品详情',
            viewForm: {
                name: '',
                coverPic: '',
                contactPhone: '',
                duty: '',
                joinDate: '',
                files: []
            }
        }
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        getDetail(id, mid) {
            Api.memberWorks.detailMien(id, mid).then((res) => {
                this.viewForm = res;
            });
        },
        getPath(path) {
            return Api.system.getFileUrl(path);
        }
    },
    mounted() {
        this.getDetail(this.$route.query.id, this.$route.query.mid);
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
