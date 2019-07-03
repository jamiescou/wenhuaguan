<template>
    <div class="view-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'../index',name: '资讯公告' },{name:'资讯公告详细信息'}]"></v-pageheader>
        <div style="margin-top:20px;">
            <v-detailItem label="资讯标题" :value="viewForm.title"></v-detailItem>
            <el-row>
                <el-col :span="12">
                    <v-detailItem label="封面图片" type="image" :value="viewForm.coverPic" class="cover"></v-detailItem>
                </el-col>
                <el-col :span="12">
                    <v-detailItem label="所属栏目" :value="viewForm.column"></v-detailItem>
                    <v-detailItem label="来  源" :value="viewForm.source"></v-detailItem>
                    <v-detailItem label="作  者" :value="viewForm.author"></v-detailItem>
                    <v-detailItem label="发布时间" :value="viewForm.publishTime"></v-detailItem>
                </el-col>
            </el-row>
            <v-detailItem label="资讯简介" :value="viewForm.brief"></v-detailItem>
            <div v-if="viewForm.type ==='article'" class="article">
            <v-detailItem label="资讯内容" type="rich" :value="viewForm.content"></v-detailItem>
            <v-detailItem label="附件" type="custom">
                <div v-if="viewForm.attachName" @click="downLoadAttach" class="download-file">
                    <i class="sz-ico ico-download"></i>
                    <span class="attach-name">{{viewForm.attachName}}</span>
                </div>
            </v-detailItem>
            </div>
            <div v-if="viewForm.type ==='atlas'" class="atlas">
                <el-col >                    
                    <div class="detail-item coveratlas align-start">
                        <label class="label-title">图集：</label>
                        <div   class="el-row" style="width:100%;">
                        <el-col :span="6" v-for="(item,index) in viewForm.picList"  :key="index">
                        <div class="label-content img-content">
                            <img :src="item.pictureFile" alt="图集" class="detail-img">
                            <div class="ellipsis" :title="item.content"> {{item.content}}</div>                         
                        </div>
                        </el-col>
                         </div>
                    </div>
                </el-col>
                <div style="clear:both;"></div>
            </div>
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
            id: '',
            viewForm: {
                title: '',
                column: '',
                source: '',
                author: '',
                publishTime: '',
                content: '',
                attachName: '',
                isRecommend: '',
                isPublish: '',
                coverPic: '',
                attach: '',
                brief: ''
            }
        }
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        getDetail() {
            Api.information.getInformation(this.id).then((info) => {
                info.column = info.column.map((item) => { return item.name }).join('、');
                info.coverPic = Api.system.getFileUrl(info.coverPic);
                if(info.picList!=null||info.picList!="")
                {
                    for (let index = 0; index < info.picList.length; index++) {
                        info.picList[index].pictureFile = Api.system.getFileUrl(info.picList[index].pictureFile);
                 }
                }                
                this.viewForm = info;
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
        this.id = this.$route.params.id;
        this.getDetail();
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.view-wrapper {
  .cover img {
    width: 354px;
    height: 236px;
  }
}
.coveratlas
{    
    height:auto;
}
.view-wrapper {
  .coveratlas  img {
    width: 354px;
    height: 236px;
  }
}
 .ellipsis
    {
        width: 340px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        height: 20px;
    }
</style>