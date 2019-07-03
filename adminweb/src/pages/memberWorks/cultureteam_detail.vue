<template>
    <div class="view-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'memberWorks',name: '会员作品' },{name:'会员详细信息'}]"></v-pageheader>
        <div style="margin-top:20px;">
            <el-row>
                <el-col :span="12">
                    <v-detailItem label="会员名称" :value="viewForm.name"></v-detailItem>
                    <!-- <v-detailItem label="艺术分类" :value="viewForm.artType"></v-detailItem> -->
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
                <!-- <el-col :span="12">
                    <v-detailItem label="会员负责人" :value="viewForm.contactName"></v-detailItem>
                </el-col> -->
            </el-row>
            <v-detailItem label="会员简介" :value="viewForm.brief"></v-detailItem>
            <v-detailItem label="会员描述" type="rich" :value="viewForm.desc"></v-detailItem>
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
    methods: {
        back() {
            this.$router.go(-1);
        },
        getDetail(id) {
            Api.memberWorks.getmemberWorksDetail(id).then((res) => {
                console.log('res=======>>>', res)
                // let artType = [];
                // for (let item of res.artType) {
                //     if(this.dicts.getValueByCode('artistClass', item))  
                //     artType.push(this.dicts.getValueByCode('artistClass', item));
                // }
                // res.artType = artType.join('、');
                Api.system.getRegion(res.region).then((rres) => {
                    res.region = rres.name;
                });
                this.viewForm = res;
                this.viewForm.coverPic = Api.system.getFileUrl(res.coverPic);
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
        this.getDetail(this.$route.query.id);
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
