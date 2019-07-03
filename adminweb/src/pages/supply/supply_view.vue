<template>
    <div class="view-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'index',name: '文化配送管理' },{name:'文化配送详细信息'}]"></v-pageheader>
        <div style="margin-top:20px;">
            <el-row>
                <el-col :span="12">
                    <v-detailItem label="服务名称" :value="viewForm.title"></v-detailItem>
                    <v-detailItem label="资源类型" :value="viewForm.type"></v-detailItem>
                    <v-detailItem label="联系人" :value="viewForm.contactPerson"></v-detailItem>
                    <v-detailItem label="联系电话" :value="viewForm.contactPhone"></v-detailItem>
                    <v-detailItem label="服务时长" :value="viewForm.serveTime"></v-detailItem>
                    <v-detailItem label="服务提供" :value="viewForm.serveType"></v-detailItem>
                    <v-detailItem label="服务团队名称" :value="viewForm.teamName"></v-detailItem>
                    <v-detailItem label="场地及设施要求" :value="viewForm.site"></v-detailItem>
                    <v-detailItem label="服务价格" :value="viewForm.servePrice"></v-detailItem>
                    <v-detailItem label="服务备注" :value="viewForm.remark"></v-detailItem>
                    <v-detailItem label="预约须知" :value="viewForm.notice" type='rich'></v-detailItem>
                    <v-detailItem label="服务团队介绍" :value="viewForm.teamIntro" type='rich'></v-detailItem>
                    <v-detailItem label="配送服务内容" :value="viewForm.desc" type='rich'></v-detailItem>
                </el-col>
                <el-col :span="12">

                  <v-detailItem label="封面图片" type="image" :value="coverPic" class="cover"></v-detailItem>
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
            areaOption: [],
            viewForm: {
              type:'',
              }
        }
    },    
    methods: {
        back() {
            this.$router.go(-1);
        },
        getDetail(id) {
          Api.supply.getSupply(id).then((res) => {
            let type = [];
            for (let item of res.type) {
             if(this.dicts.getValueByCode('cultural', item))
              type.push(this.dicts.getValueByCode('cultural', item));
            }   
            res.type = type.join('、');         
            res.serveType = res.serveType=="team"?"团队":"个人";
            res.serveTime=res.serveTime+"小时";
            
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
