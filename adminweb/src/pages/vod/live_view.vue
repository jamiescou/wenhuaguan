<template>
    <div class="view-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'live',name: '直播管理' },{name:'查看直播详情'}]"></v-pageheader>
        <div style="margin-top:20px;">
            <el-row>
                <el-row :gutter="10">
                    <v-detailItem label="直播标题" :value="viewForm.name"></v-detailItem>
                    <v-detailItem label="封面图片" type="image" :value="viewForm.coverPic" class="coverlive"></v-detailItem>
                  <v-detailItem label="视频分类" :value="viewForm.artistTypes"></v-detailItem>
                  <v-detailItem label="视频标签" :value="viewForm.labels"></v-detailItem>
                    <v-detailItem label="允许回放" :value="viewForm.enablePayback"></v-detailItem>
                    <v-detailItem label="开始时间" :value="viewForm.startTime "></v-detailItem>
                    <v-detailItem label="推流地址" :value="viewForm.pushPath"></v-detailItem>
                    <v-detailItem label="播放地址" :value="viewForm.viewPath"></v-detailItem>
                    <v-detailItem label="视频简介" :value="viewForm.brief"></v-detailItem>
                    <v-detailItem label="视频详情" :value="viewForm.content" type="rich"></v-detailItem>
                </el-row>
              <div class="dialog-footer">
                <el-button @click="back">关闭</el-button>
              </div>
            </el-row>
        </div>
    </div>
</template>

<script>
import Api from '@/api'
export default {
    data() {
        return {
            id: '',
            mid: '',
            name: '',
            viewForm: {
                name:'',
                coverPic:'',
                artistTypes:'',
                enablePayback:'',
                startTime:'',
                endTime:'',
                path:'',
                brief:'',
                content:'',
                labels:''
            }
        }
    },
    methods: {
        back() {
            this.$router.go(-1);
        }
    },
    mounted() {
        this.id = this.$route.query.id;
        // 获取详情
        Api.vod.getLive(this.id).then((res) => {
            let type=[];
            for(var i=0;i<res.artistTypes.length;i++){
              if(this.dicts.getValueByCode('videoType', res.artistTypes[i]))
              type.push( this.dicts.getValueByCode('videoType', res.artistTypes[i]));
            }
            res.artistTypes=type.join('、');
            res.labels = res.labels.join("、");
            res.coverPic = Api.system.getFileUrl(res.coverPic);
            res.enablePayback = res.enablePayback ? '是' : '否';
            this.viewForm = res;
        });
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.coverlive
{
    height: auto;
}
.view-wrapper .coverlive img {
    width: 354px;
    height: 236px;
}
</style>

