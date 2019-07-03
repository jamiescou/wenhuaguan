<template>
    <div class="view-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'index',name: '展厅管理' },{name:'展厅详细信息'}]"></v-pageheader>
        <div style="margin-top:20px;">
            <el-row>
                <el-col :span="12">
                    <v-detailItem label="展厅名称" :value="viewForm.title"></v-detailItem>
                    <v-detailItem label="地址" :value="viewForm.address"></v-detailItem>
                    <v-detailItem label="电话" :value="viewForm.phone"></v-detailItem>
                    <v-detailItem label="联系人" :value="viewForm.contact"></v-detailItem>
                </el-col>
                <el-col :span="12">
                    <v-detailItem label="封面图片" type="image" :value="viewForm.coverPic" class="cover"></v-detailItem>
                </el-col>
            </el-row>
            <v-detailItem label="展厅简介" :value="viewForm.brief"></v-detailItem>
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
           viewForm: {
                title: '',
                address: '',
                phone: '',
                contact: '',
                coverPic: '',
                brief: ''
            }
        }
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        getDetail() {
            Api.heritage.getExhibit(this.id).then((info) => {
                info.coverPic = Api.system.getFileUrl(info.coverPic);
                this.viewForm = info;
            });
        }
    },
    mounted() {
        this.id = this.$route.query.id;
        this.flag = this.$route.query.flag;
        this.getDetail();
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
