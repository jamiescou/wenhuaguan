<template>
    <div class="view-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'index',name: '通知管理' },{name:'查看通知详情'}]"></v-pageheader>
        <div style="margin-top:20px;">
            <el-row>
                <el-row :gutter="10">
                    <v-detailItem label="直播标题" :value="viewForm.title"></v-detailItem>
                    <v-detailItem label="发布人员" :value="viewForm.creator.userName"></v-detailItem>
                    <v-detailItem label="时间周期" :value="viewForm.startDate + '  到  ' + viewForm.startDate"></v-detailItem>
                    <v-detailItem label="内容" :value="viewForm.content" type="rich"></v-detailItem>
                    <v-detailItem label="通知对象" :value="viewForm.persons"></v-detailItem>
                    <v-detailItem label="附件" type="custom">
                        <div v-if="viewForm.fileName" @click="downLoadAttach" class="download-file">
                            <i class="sz-ico ico-download"></i>
                            <span class="attach-name">{{viewForm.fileName}}</span>
                        </div>
                    </v-detailItem>
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
            viewForm: {
                content: '',
                creator: {}
            }
        }
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        // 下载附件
        downLoadAttach() {
            let filename = this.viewForm.fileName;
            let fileUrl = Api.system.getFileUrl(this.viewForm.attach);
            this.downloadFile(filename, fileUrl);
        }
    },
    mounted() {
        this.id = this.$route.query.id;
        // 获取详情
        Api.assist.getNotice(this.id).then((res) => {
            if (res) {
                if (res.persons && res.persons.length) {
                    res.persons = res.persons.map((x) => {
                        return '【' + x.unitName + ' - ' + x.depName + '】' + x.managerName;
                    })
                    res.persons = res.persons.join(',  ');
                }

                this.viewForm = res;
            }
        });
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
