<template>
    <div class="view-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'index',name: '文艺人才管理' },{name:'文艺人才详细信息'}]"></v-pageheader>
        <div style="margin-top:20px;">
            <el-row>
                <el-col :span="12">
                    <v-detailItem label="姓名" :value="viewForm.name"></v-detailItem>
                    <v-detailItem label="联系方式" :value="viewForm.contactPhone"></v-detailItem>
                    <v-detailItem label="团队职责" :value="viewForm.duty"></v-detailItem>
                    <v-detailItem label="加入团队时间" :value="viewForm.joinDate"></v-detailItem>
                </el-col>
                <el-col :span="12">
                    <v-detailItem label="封面图片" type="image" :value="viewForm.coverPic" class="cover"></v-detailItem>
                </el-col>
            </el-row>
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
                name: '',
                coverPic: '',
                contactPhone: '',
                duty: '',
                joinDate: ''
            }
        }
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        getDetail(id, mid) {
            Api.cultureteam.getTeamPerson(id, mid).then((res) => {
                this.viewForm = res;
                this.viewForm.coverPic = Api.system.getFileUrl(res.coverPic);
            });
        }
    },
    mounted() {
        this.getDetail(this.$route.query.id, this.$route.query.mid);
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>