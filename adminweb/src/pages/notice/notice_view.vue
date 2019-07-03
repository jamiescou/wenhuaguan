<template>
    <div class="view-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'index',name: '通知管理' },{name:'查看通知详情'}]"></v-pageheader>
        <div style="margin-top:20px;">
            <el-row>
                <el-row :gutter="10">
                    <v-detailItem label="标题" :value="viewForm.title"></v-detailItem>
                    <v-detailItem label="创建时间" :value="viewForm.createTime"></v-detailItem>
                    <v-detailItem label="内容" :value="viewForm.content" type="rich"></v-detailItem>
                    <v-detailItem label="附件" type="custom">
                        <div v-if="viewForm.fileName" @click="downLoadAttach" class="download-file">
                            <i class="sz-ico ico-download"></i>
                            <span class="attach-name">{{viewForm.fileName}}</span>
                        </div>
                    </v-detailItem>
                </el-row>
                <div class="dialog-footer">
                    <el-button @click="back">返回</el-button>
                    <el-button @click="noticeSign" type="primary" v-if="isTarget">签 收</el-button>
                </div>

                <div class="tree-content-panel" v-if="isSelf">
                    <div class="tree-heading content-heading">
                        <div class="v-line"></div>
                        <h5 class="u-title">签收情况</h5>
                    </div>
                    <div class="table-container">
                        <el-table :data="viewForm.targets" border highlight-current-row>
                            <el-table-column prop="unitName" label="签收机构"></el-table-column>
                            <el-table-column prop="managerName" label="签收人"></el-table-column>
                            <el-table-column prop="readTime" label="签收时间"></el-table-column>
                            <el-table-column prop="hasRead" label="是否签收">
                                <template scope="scope">{{scope.row.hasRead?'已签收':''}}</template>
                            </el-table-column>
                        </el-table>
                    </div>
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
                creator: {},
                targets: [],
                title: null
            },

            sign: false
        }
    },
    computed: {
        isSelf() {
            return !this.viewForm.isInner && this.viewForm.targets && this.viewForm.unitId === this.$store.getters.user.orgUnit.id;
        },
        isTarget() {
            if (this.viewForm.isInner) {
                return false;
            }
            if (!this.viewForm.targets || this.viewForm.targets.length === 0) {
                return false;
            }
            let target = this.viewForm.targets.find(x => x.unitId === this.$store.getters.user.orgUnit.id);
            if (!target || target.hasRead) {
                return false;
            }
            return true;
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
        },
        noticeSign() {
            if (this.sign) return;

            this.sign = true;
            let user = this.$store.getters.user
            let data = {
                'unitId': user.orgUnit.id,
                'managerId': user.id,
                'managerName': user.name,
                'hasRead': true,
                'readTime': this.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss')
            }
            Api.notice.noticeSign(this.id, data).then((res) => {
                this.$message({
                    message: '签收成功',
                    type: 'success'
                });
                this.back();
                // this.isTarget=false;
            }).finally(() => {
                this.sign = false;
            });
        }
    },
    mounted() {
        this.id = this.$route.query.id;
        // 获取详情
        Api.notice.getNotice(this.id).then((res) => {
            if (res) {
                if (!res.isInner && res.targets) {
                    let unitIds = res.targets.map(x => x.unitId);
                    Api.system.getUnits('id:' + unitIds.join('~'), 1, -1).then((units) => {
                        if (units.content.length > 0) {
                            for (let i = 0; i < units.content.length; i++) {
                                const element = units.content[i];
                                let target = res.targets.find(x => x.unitId === element.id);
                                target.unitName = element.name;
                            }
                        }
                        this.viewForm = res;
                    })
                } else {
                    this.viewForm = res;
                }
            }
        });
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
</style>
