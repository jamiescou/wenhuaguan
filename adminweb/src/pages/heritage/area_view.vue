<template>
    <div class="view-wrapper">
        <v-pageheader :breadcrumbs="[{ to:titleInfo.path,name: titleInfo.name },{name:'非遗保护区详细信息'}]"></v-pageheader>
        <div style="margin-top:20px;">
            <el-row>
                <el-col :span="12">
                    <v-detailItem label="名称" :value="viewForm.name"></v-detailItem>
                    <v-detailItem label="保护主体" :value="viewForm.protectSubject"></v-detailItem>
                    <v-detailItem label="所属区域" :value="viewForm.region"></v-detailItem>
                    <v-detailItem label="详细地址" :value="viewForm.address"></v-detailItem>
                </el-col>
                <el-col :span="12">
                    <v-detailItem label="封面图片" type="image" :value="viewForm.coverPic" ></v-detailItem>
                </el-col>
            </el-row>
            <v-detailItem label="简介" :value="viewForm.brief"></v-detailItem>
            <v-detailItem label="描述" type="rich" :value="viewForm.remark"></v-detailItem>
            <div class="dialog-footer">
                <el-button @click="back">关闭</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import Api from '@/api';
import { PARENT_NAME } from './modules/heritage_status'
export default {
    data() {
        return {
            tabActive: 'first',
            options: [],
            viewForm: {
                name: '',
                region: '',
                protectSubject: '',
                address: '',
                remark: '',
                isTop: '',
                onlineStatus: '',
                flowLogs: '',
                coverPic: '',
                brief: ''
            },
            flag: 'area'
        }
    },
    computed: {
        titleInfo() {
            return PARENT_NAME[this.flag];
        }
    },
    created() {
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        getDetail() {
            Api.heritage.getHeritageArea(this.id).then((info) => {
                let name = '';
                Api.system.getRegion(info.region).then((res) => {
                    name = res.fullName;
                    info.region = name;
                    info.coverPic = Api.system.getFileUrl(info.coverPic);
                    this.viewForm = info;
                });
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
