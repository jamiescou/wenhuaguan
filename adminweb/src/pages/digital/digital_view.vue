<template>
    <div class="view-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'index',name: '数字展览管理' },{name:'展览详细信息'}]"></v-pageheader>
        <div style="margin-top:20px;">

            <el-row>
                <el-col :span="12">
                    <v-detailItem label="展览名称" :value="viewForm.title"></v-detailItem>
                    <v-detailItem label="封面图片" type="image" :value="coverPic" class="coverdigital"></v-detailItem>
                    <v-detailItem label="类型" :value="viewForm.type"></v-detailItem>
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
            Api.digital.getDigital(id).then((res) => {
                let type = [];
                for (let item of res.type) {
                    if(this.dicts.getValueByCode('exhibition', item))
                    type.push(this.dicts.getValueByCode('exhibition', item));
                }
                res.type = type.join('、');
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
.coverdigital {
    height:260px;
}
.view-wrapper .coverdigital img {
    width: 354px;
    height: 236px;
}
</style>
