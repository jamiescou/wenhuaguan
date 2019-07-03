<template>
    <div class="view-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'activity',name: '活动辅助管理' },{name:'查看详情'}]"></v-pageheader>
        <div style="margin-top:20px;">
            <el-row :gutter="10">
                <el-col :span="12">
                    <v-detailItem label="活动名称" :value="viewForm.name"></v-detailItem>
                    <v-detailItem label="活动类型" :value="viewForm.type"></v-detailItem>
                    <v-detailItem label="组织机构" :value="viewForm.organizer"></v-detailItem>
                    <v-detailItem label="活动对象" :value="viewForm.actObject"></v-detailItem>
                </el-col>
                <el-col :span="12">
                    <v-detailItem label="封面图片" type="image" :value="viewForm.coverPic" class="cover"></v-detailItem>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="12">
                    <v-detailItem label="活动时间" type='rich' :value="viewForm.startDate + '&nbsp;&nbsp;&nbsp;&nbsp;到&nbsp;&nbsp;&nbsp;&nbsp;' + viewForm.endDate"></v-detailItem>
                </el-col>
                <el-col :span="12">
                    <v-detailItem label="报名时间" type='rich' :value="viewForm.signStartTime + '&nbsp;&nbsp;&nbsp;&nbsp;到&nbsp;&nbsp;&nbsp;&nbsp;' + viewForm.signEndTime"></v-detailItem>
                </el-col>
            </el-row>
            <v-detailItem label="报名详情" type="rich" :value="viewForm.enrollDesc"></v-detailItem>
            <v-detailItem label="活动目的" type="rich" :value="viewForm.purpose"></v-detailItem>
            <v-detailItem label="活动内容" type="rich" :value="viewForm.description"></v-detailItem>
            <v-detailItem label="实施安排" type="rich" :value="viewForm.actPlan"></v-detailItem>
            <v-detailItem label="宣传推广" type="rich" :value="viewForm.actPublicity"></v-detailItem>
            <v-detailItem v-show="isShow" label="经费预算" type="rich" :value="viewForm.actBudget"></v-detailItem>
            <v-detailItem label="附件信息" type="custom">343434
                <template v-if="viewForm.fileList&& viewForm.fileList.length">
                    <div @click="downLoadAttach(item)" class="download-file" v-for="(item,index) in viewForm.fileList" :key="index" style="margin-bottom:10px;">
                        <i class="sz-ico ico-download"></i>
                        <span class="attach-name">{{item.fileName}}</span>
                    </div>
                </template>
            </v-detailItem>
            <div class="dialog-footer">
                <el-button @click="back">关闭</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import Api from '@/api'
export default {
    data() {
        return {
            isShow: false,
            id: '',
            viewForm: {}
        }
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        // 下载附件
        downLoadAttach(item) {
            this.downloadFile(item.fileName, item.filePath);
        }
    },
    mounted() {
        this.id = this.$route.query.id;
        let user = this.$store.getters.user;
        // 获取详情
        const type = { stageArts: '舞台艺术类', exhibition: '展览艺术类' };
        Api.assist.getAct(this.id).then((res) => {
            if (user.username === res.creator.userId) this.isShow = true;
            res.type = type[res.type];
            res.coverPic = Api.system.getFileUrl(res.coverPic);
            if (res.fileList && res.fileList.length > 0) {
                res.fileList = res.fileList.map(x => {
                    x.filePath = Api.system.getFileUrl(x.filePath);
                    return x;
                })
            }
            console.log(res);
            this.viewForm = res;
        });
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
</style>