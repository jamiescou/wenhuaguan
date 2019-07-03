<template>
    <div class="edit-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'suggestions',name: '意见反馈管理' },{name:'查看意见反馈详情'}]"></v-pageheader>
        <div style="margin-top:20px;">
            <el-row>
                <el-row :gutter="10">
                    <v-detailItem label="意见反馈名称" :value="viewForm.name"></v-detailItem>
                    
                    <v-detailItem label="意见内容:" :value="viewForm.content"></v-detailItem>
                    <v-detailItem label="创建时间:" :value="viewForm.createTime"></v-detailItem>
                    <v-detailItem label="是否回复" :value="viewForm.isReply?'已回复':'未回复'"></v-detailItem>
                    <v-detailItem label="手机号码" :value="viewForm.mobile" ></v-detailItem>
                    <v-detailItem label="邮箱" :value="viewForm.email" ></v-detailItem>
                     <v-detailItem label="回复人" :value="viewForm.replyName" ></v-detailItem>
                      <v-detailItem label="回复内容" :value="viewForm.replyContent" ></v-detailItem>
                       <!-- <v-detailItem label="手机号码" :value="viewForm.mobile" ></v-detailItem> -->
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
            viewForm: []
        }
    },
    methods: {
        goDetail(){
          Api.suggestions.getSuggestions(this.id).then((res) => {
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


