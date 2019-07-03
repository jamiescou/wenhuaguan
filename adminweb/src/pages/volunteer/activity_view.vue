<template>
    <div class="view-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'activity',name:'志愿者活动管理'},{name:'志愿者活动详情'}]"></v-pageheader>
        <div style="margin-top:20px;">
            <el-row>
                <el-col :span="12">
                    <v-detailItem label="活动名称" :value="viewForm.name"></v-detailItem>
                    <v-detailItem label="所属区域" :value="viewForm.region"></v-detailItem>         
                    <v-detailItem label="活动地址" :value="viewForm.address"></v-detailItem>
                    <v-detailItem label="服务类型" :value="viewForm.serviceTypes"></v-detailItem>                                
                    <v-detailItem label="联系电话" :value="viewForm.contactPhone"></v-detailItem>
                    <v-detailItem label="允许报名人数" :value="viewForm.limitNum"></v-detailItem>
                    <v-detailItem label="活动开始时间" :value="viewForm.startTime"></v-detailItem>
                    <v-detailItem label="预计服务时长" :value="viewForm.serviceHour"></v-detailItem>
                    <v-detailItem label="招募对象类型" :value="viewForm.permitSubject"></v-detailItem>
                    <v-detailItem label="已报名人数" :value="viewForm.applyMembers"></v-detailItem>
                </el-col>
                <el-col :span="12">
                    <v-detailItem label="活动开始时间" :value="viewForm.startTime"></v-detailItem>
                    <v-detailItem label="封面图片" type="image" :value="viewForm.coverPic" class="coveret"></v-detailItem>
                    <v-detailItem label="是否发布" :value="viewForm.isPublish"></v-detailItem>
                     <v-detailItem label="活动结束时间" :value="viewForm.endTime"></v-detailItem>
                      <v-detailItem label="是否停止招募" :value="viewForm.isStop"></v-detailItem>
                      <v-detailItem label="已录用人数" :value="viewForm.hasJoinMembers"></v-detailItem>
                       
                </el-col>
            </el-row>
            <v-detailItem label="活动描述" type="rich" :value="viewForm.desc"></v-detailItem>
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
                address: '',
                contactPhone: '',
                limitNum: '',
                startTime: '',
                lastTime: '',
                coverPic: '',
                desc: ''
            }
        }
    },    
    methods: {
        back() {
            this.$router.go(-1);
        },
        getDetail(id) {
            Api.nouns.getCooperation(id).then((res) => {
                let serviceTypesname=[];   
                 if(res.serviceTypes!=null)
               {
                    for (let index = 0; index < res.serviceTypes.length; index++) {
                    const element = this.dicts.getValueByCode('volunteerServiceType', res.serviceTypes[index]);
                    if(element)serviceTypesname.push(element);
                    
                }
               }   
                serviceTypesname=serviceTypesname.join('、'); 
                let permitSubjectname=[];  
                if(res.permitSubject!=null)
               {
                    for (let index = 0; index < res.permitSubject.length; index++) {
                    let element=res.permitSubject[index]=="personal"?"个人":"团体";
                    if(element)
                    permitSubjectname.push(element);
                    
                }
               }  
               permitSubjectname=permitSubjectname.join('、'); 
                res.permitSubject =permitSubjectname; 
                res.serviceTypes =serviceTypesname;  
                this.viewForm = res;
                this.viewForm.serviceHour=this.viewForm.serviceHour!=null&&this.viewForm.serviceHour!=""?this.viewForm.serviceHour+"小时":"";
                this.viewForm.coverPic = Api.system.getFileUrl(res.coverPic);
                this.viewForm.isPublish = this.viewForm.isPublish?"是":"否";
                this.viewForm.isStop = this.viewForm.isStop?"是":"否";                         
                 this.viewForm.region =this.dicts.regionFullName(this.viewForm.region);     
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
.view-wrapper {
  .coveret img {
    width: 354px;
    height: 236px;
  }
}
</style>