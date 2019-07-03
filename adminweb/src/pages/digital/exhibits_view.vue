<template>
    <div class="view-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'index',name: '数字展览管理' },{name:'作品详细信息'}]"></v-pageheader>
        <div style="margin-top:20px;">

            <el-row>
                <el-col :span="12">
                    <v-detailItem label="展品名称" :value="viewForm.title"></v-detailItem>
                    <v-detailItem label="展品图片" type="image" :value="coverPic" class="cover"></v-detailItem>
                    <!-- <v-detailItem label="类型" :value="viewForm.type"></v-detailItem> -->
                    <v-detailItem label="展品简介" :value="viewForm.brief" type='rich'></v-detailItem>
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
            type: '',
            viewForm: {}
        };
    },
    created() {
        this.dicts.dictInit('worksType');
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        getDetail(mid,id) {
          Api.digital.getExhibits(mid,id).then((res) => {
            // let type = [];
            // for (let item of res.type) {
            //   type.push(this.dicts.getValueByCode('worksType', item));
            // }
            // res.type = type.join('、');
            this.viewForm = res;
            this.coverPic = Api.system.getFileUrl(res.coverPic);

          });
        }

    },
    mounted() {        
        this.getDetail(this.$route.query.mid,this.$route.query.id);
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
