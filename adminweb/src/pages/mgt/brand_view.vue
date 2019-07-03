<template>
    <div class="edit-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'brand',name: '文化品牌管理' },{name:'查看品牌详情'}]"></v-pageheader>
        <div style="margin-top:20px;">
            <el-row>
                <el-row :gutter="10">
                    <v-detailItem label="品牌名称" :value="viewForm.name"></v-detailItem>
                    <v-detailItem label="封面图片" type="image" :value="viewForm.coverPic" class="cover"></v-detailItem>
                    <v-detailItem label="关联资讯" :value="info"></v-detailItem>
                    <v-detailItem label="所属区域" :value="region"></v-detailItem>
                    <v-detailItem label="简介" :value="viewForm.brief"></v-detailItem>
                    <v-detailItem label="品牌描述" :value="viewForm.describe" type="rich"></v-detailItem>
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
            name: '',
            info:'',
            region:'',
            viewForm: {}
        }
    },
    methods: {
        goDetail(){
          Api.system.getBrand(this.id).then((res) => {
            let infos = res.infos || [];
            let  arr = [];
            for (let i of infos){
              arr.push(i.title);
            }
            this.info = arr.join(",");
            res.coverPic = Api.system.getFileUrl(res.coverPic);

            Api.heritage.getRegionCode(res.region).then((r) => {
              this.region = r.name
            });

            this.viewForm = res;
          });
        },
        back() {
            this.$router.go(-1);
        }
    },
    mounted() {
        this.id = this.$route.query.id;
        // 获取详情
        this.goDetail();
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
