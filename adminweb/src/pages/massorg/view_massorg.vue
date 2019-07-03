<template>
    <div class="view-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'index',name: '群团组织' },{name:'群团组织详细信息'}]"></v-pageheader>
        <div style="margin-top:20px;">
            <el-row>
                <el-col :span="12">
                    <v-detailItem label="团队名称" :value="viewForm.name"></v-detailItem>
                    <v-detailItem label="艺术分类" :value="viewForm.artType"></v-detailItem>
                    <v-detailItem label="所属区域" :value="viewForm.region"></v-detailItem>
                    <v-detailItem label="地址" :value="viewForm.address"></v-detailItem>
                </el-col>
                <el-col :span="12">
                    <v-detailItem label="封面图片" type="image" :value="viewForm.coverPic" class="cover"></v-detailItem>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <v-detailItem label="联系电话" :value="viewForm.contactPhone"></v-detailItem>
                </el-col>
                <el-col :span="12">
                    <v-detailItem label="团队负责人" :value="viewForm.contact"></v-detailItem>
                </el-col>
            </el-row>
            <v-detailItem label="团队简介" :value="viewForm.brief"></v-detailItem>
            <v-detailItem label="团队描述" type="rich" :value="viewForm.desc"></v-detailItem>
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
        Api.massorg.getMassorg(this.id).then((res) => {
          // 所属机构
          Api.system.getUnitInfo(res.unitId).then((res) => {
            if (res) {
              this.unitName = res.name;
            }
          });        
          this.viewForm = res;         
          this.viewForm.coverPic = Api.system.getFileUrl(res.coverPic);
          this.$refs.cooperationRegion.initCode(this.massorgForm.region);
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
