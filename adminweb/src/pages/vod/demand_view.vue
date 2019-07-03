<template>
    <div class="view-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'demand',name: '点播管理' },{name:'查看点播详情'}]"></v-pageheader>
        <div style="margin-top:20px;">
            <el-row :gutter="10">
                <el-col :span="12">
                    <v-detailItem label="点播标题" :value="viewForm.name"></v-detailItem>
                    <v-detailItem label="视频分类" :value="viewForm.artistTypes"></v-detailItem>
                    <v-detailItem label="视频标签" :value="viewForm.labels"></v-detailItem>
                    <v-detailItem label="来源" :value="viewForm.resource"></v-detailItem>
                </el-col>
                <el-col :span="12">
                    <v-detailItem label="封面图片" type="image" :value="viewForm.coverPic" class="cover"></v-detailItem>
                </el-col>
            </el-row>
            <v-detailItem label="视频简介" :value="viewForm.brief"></v-detailItem>
            <v-detailItem label="视频详情" :value="viewForm.content" type="rich"></v-detailItem>
            <div class="tree-content-panel">
                <div class="tree-heading content-heading">
                    <div class="v-line"></div>
                    <h5 class="u-title">点播剧集</h5>
                </div>
                <div class="table-container">
                    <el-table :data="viewForm.dramas" border stripe>
                        <el-table-column prop="title" label="剧集标题"></el-table-column>
                        <el-table-column prop="serial" label="剧集序号" width="100px"></el-table-column>
                        <el-table-column prop="file" label="视频文件"></el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="dialog-footer">
                <el-button @click="back">关闭</el-button>
            </div>
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
                name: '',
                resource: '',
                coverPic: '',
                artistTypes: '',
                enablePayback: '',
                startTime: '',
                endTime: '',
                path: '',
                brief: '',
                content: '',
                labels: ''
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
        Api.vod.getDemand(this.id).then((res) => {
            let type=[];
            for(var i=0;i<res.artistTypes.length;i++){
                if( this.dicts.getValueByCode('videoType', res.artistTypes[i]))
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

