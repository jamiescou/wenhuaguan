<template>
    <div class="view-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'index',name: '数字展览管理' },{name:'展览详细信息'}]"></v-pageheader>
        <div style="margin-top:20px;">

            <el-row>
                <el-col :span="12">
                    <v-detailItem label="学会名称" :value="viewForm.name"></v-detailItem>
                    <v-detailItem label="封面图片" type="image" :value="coverPic" class="cover"></v-detailItem>
                    <v-detailItem label="负责人" :value="viewForm.leader"></v-detailItem>
                    <v-detailItem label="联系电话" :value="viewForm.mobile"></v-detailItem>
                    <v-detailItem label="邮箱" :value="viewForm.email"></v-detailItem>
                    <v-detailItem label="展览简介" :value="viewForm.brief" type='rich'></v-detailItem>
                </el-col>
                <el-col :span="12">
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
            coverPic: '',
            viewForm: {}
        }
    },   
    methods: {
        back() {
            this.$router.go(-1);
        },
        getDetail(id) {
          Api.society.getSociety(id).then((res) => {
            this.viewForm = res;
            this.coverPic = Api.system.getFileUrl(res.coverPic);

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
