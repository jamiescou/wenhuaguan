<template>
    <div class="edit-wrapper">
        <v-pageheader :breadcrumbs="[{ to:titleInfo.path,name: titleInfo.name },{name:'详细信息'}]"></v-pageheader>
        <div style="margin-top: 20px;">

                <v-detailItem label="活动名称" v-model="activityForm.name"></v-detailItem>
                <!--<v-detailItem  label="上传封面" class="cover" :imgUrl='coverPic' :upload="handleUpload" @remove="removeImg"></v-detailItem>-->
                <v-detailItem label="封面图片" type="image" :value="activityForm.coverPic" class="cover"></v-detailItem>

                <v-detailItem label="征集时间" :value="activityForm.startTime + '  到  ' + activityForm.endTime"></v-detailItem>
                <v-detailItem label="征集类型" v-model="activityForm.type"></v-detailItem>
                <v-detailItem label="作品格式" v-model="activityForm.digitType"></v-detailItem>
                <v-detailItem label="奖项设置" v-model="activityForm.award"></v-detailItem>
                <v-detailItem label="简介" :value="activityForm.brief"></v-detailItem>
                <v-detailItem label="活动描述" type="rich" :value="activityForm.desc"></v-detailItem>
                <div class="dialog-footer">
                  <el-button @click="back">返回</el-button>
                </div>

        </div>
    </div>
</template>

<script>
import Api from '@/api'
import _status from './document_status'

export default {
    data() {
        return {
            tag: 1,
            activityForm: {
                name: '',
                onlineStatus: _status.STATUS.WAITCOMMIT,
                startTime: '',
                endTime: '',
                desc: '',
                type: '',
                digitType: '',
                coverPic: '',
                brief: ''
            }
        }
    },
    computed: {
        titleInfo() {
            return _status.PARENT_NAME[this.tag];
        }
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        getDetail() {
            // 详细信息
            Api.document.getDocument(this.id).then((res) => {
                res.coverPic = Api.system.getFileUrl(res.coverPic);
                if(res.type === "activity"){
                  res.type = "活动";
                }else {
                  res.type="比赛"
                }
                if(res.digitType === "pic"){
                  res.digitType = "图片";
                }else if(res.digitType === "video"){
                  res.digitType="视频"
                }else if(res.digitType === "audio"){
                  res.digitType="音频"
                }else{
                  res.digitType = "文章";
                }
                this.activityForm = res;
            });
        }
    },
    mounted() {
        this.id = this.$route.query.id;
        this.dicts.dictInit('activityForm');
        this.getDetail();
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
