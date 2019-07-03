<template>
    <div class="view-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'index',name: '志愿者团队管理' },{name:'志愿者团队详细信息'}]"></v-pageheader>
        <div style="margin-top:20px;">
            <el-row>
                <el-col :span="12">
                    <v-detailItem label="姓名" :value="viewForm.name"></v-detailItem>
                    <v-detailItem label="团队类型" :value="viewForm.type"></v-detailItem>
                    <v-detailItem label="团队负责人" :value="viewForm.creator.userName"></v-detailItem>
                    <v-detailItem label="联系电话" :value="viewForm.contactPhone"></v-detailItem>
                    <v-detailItem label="所属区域" :value="viewForm.region"></v-detailItem>
                </el-col>
                <el-col :span="12">
                    <v-detailItem label="封面图片" type="image" :value="viewForm.coverPic" class="cover"></v-detailItem>
                </el-col>
            </el-row>
            <v-detailItem label="详细地址" :value="viewForm.detailAddress"></v-detailItem>
            <v-detailItem label="简介" type="rich" :value="viewForm.brief"></v-detailItem>
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
            areaOption: [],
            viewForm: {
                creator: { userId: '', userName: '' },
                name: '',
                coverPic: '',
                leaderName: '',
                contactPhone: '',
                brief: '',
                unitId: '',
                region: '',
                detailAddress: ''
            }
        }
    },   
    methods: {
        back() {
            this.$router.go(-1);
        },
        getDetail(id) {
            Api.nouns.getNouns(id).then((res) => {
                // 艺术分类
                let types = [];
                for (let item of res.type) {
                    if(this.dicts.getValueByCode('teamType', item))
                    types.push(this.dicts.getValueByCode('teamType', item));
                }
                res.type = types.join('、');

                res.coverPic = Api.system.getFileUrl(res.coverPic);
                this.viewForm = res;
                Api.system.getRegion(res.region).then((regionres) => {
                    this.viewForm.region = regionres.fullName;
                });
            });
        }
    },
    mounted() {
        this.getDetail(this.$route.query.id);
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>