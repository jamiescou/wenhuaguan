<template>
    <div class="view-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'learnannual',name: '学会年审' },{name:'学会年审详细信息'}]"></v-pageheader>
        <div style="margin-top:20px;">
            <el-row>
                  <el-col :span="12">
                    <v-detailItem label="年审单位" :value="viewForm.masOrgName"></v-detailItem>
                    <v-detailItem label="联系人" :value="viewForm.contact"></v-detailItem>
                    
                </el-col>
                <el-col :span="12">
                    <v-detailItem label="联系电话" :value="viewForm.contactPhone"></v-detailItem>
                    <v-detailItem label="区域" :value="viewForm.region"></v-detailItem>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <v-detailItem label="所属机构" :value="unitName"></v-detailItem>
                </el-col>
                <el-col :span="12">
                    <v-detailItem label="团队负责人" :value="viewForm.contact"></v-detailItem>
                </el-col>
            </el-row>            
            <v-detailItem label="附件信息" type="custom">
              <div v-if="viewForm.attachName" @click="downLoadAttach" class="download-file">
                <i class="sz-ico ico-download"></i>
                <span class="attach-name">{{viewForm.attachName}}</span>
              </div>
            </v-detailItem>
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
            id:'',
            
            viewForm: {
                name: '',
                coverPic: '',
                address: '',
                contactPhone: '',
                contactName: '',
                brief: '',
                desc: '',
                region: '',
                artType: ''
            }
        }
    },
    created() {
        this.dicts.dictInit('venueType');
        this.dicts.dictInit('artistClass');
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        getDetail() {       
        this.loading = true;        
        Api.massorg.getLearnannual(this.id).then((res) => {
        
          // 所属机构
          Api.system.getUnitInfo(res.unitId).then((res) => {
            if (res) {
              this.unitName = res.name;
            }
          });       
          res.region= this.dicts.regionFullName(res.region); 
          this.viewForm = res;         
          this.viewForm.coverPic = Api.system.getFileUrl(res.coverPic);          
          this.loading = false;
        }).catch(() => {
          this.loading = false
        });
      },
        // 下载附件
        downLoadAttach() {
          let filename = this.viewForm.attachName;
          let fileUrl = Api.system.getFileUrl(this.viewForm.attach);
          this.downloadFile(filename, fileUrl);
        }
    },
    mounted() {
       this.id = this.$route.query.id;
       this.getDetail();
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
