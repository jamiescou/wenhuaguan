<template>
    <div class="view-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'calligraphy',name: '书法资源管理' },{name:'书法资源详情'}]"></v-pageheader>
        <div style="margin-top:20px;">

            <el-row>
                <el-col :span="12">
                    <v-detailItem label="名称" :value="viewForm.name"></v-detailItem>
                    <v-detailItem label="作者" :value="viewForm.author"></v-detailItem>
                    <v-detailItem label="图片" type="image" :value="coverPic" class="coverdigital"></v-detailItem>
                    <v-detailItem label="简介" :value="viewForm.brief" type='rich'></v-detailItem>
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
            type:'',
            viewForm: {}
        }
    },
    created() {
        this.dicts.dictInit('exhibition');
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        getDetail(id) {
         Api.screen.getScreen(id).then((res) => {
                this.viewForm = res;
                this.coverPic = Api.system.getFileUrl(res.file.filePath);
            });
        }

    },
    mounted() {
        this.getDetail(this.$route.query.id);
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.coverdigital {
    height:260px;
}
.view-wrapper .coverdigital img {
    width: 354px;
    height: 236px;
}
</style>
