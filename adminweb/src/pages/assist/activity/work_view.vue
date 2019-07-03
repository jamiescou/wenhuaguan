<template>
    <div class="view-wrapper">
        <div class="tree-heading">
            <div class="v-line"></div>
            <h5 class="u-title">{{viewForm.name}}{{'（'+typeFormat+'）'}}</h5>
        </div>
        <template v-if="viewForm.type === 'stageArts'">
            <el-row>
                <el-col :span="12">
                    <v-detailItem label="作品负责人" :value="viewForm.contact"></v-detailItem>
                    <v-detailItem label="联系方式" :value="viewForm.telephone"></v-detailItem>
                    <v-detailItem label="演出单位" :value="viewForm.producer"></v-detailItem>
                    <v-detailItem label="艺术门类" :value="artFormat"></v-detailItem>
                </el-col>
                <el-col :span="12">
                    <v-detailItem label="节目时长" :value="(viewForm.hourLong || 0) + '(分钟)'"></v-detailItem>
                    <v-detailItem label="参演人数" :value="(viewForm.peoples||0 )+'(人)'"></v-detailItem>
                    <v-detailItem label="指导文化馆" :value="viewForm.unitName"></v-detailItem>
                </el-col>
            </el-row>
            <v-detailItem label="道具情况" type="custom">
                <div>灯光要求：{{viewForm.lampLight || '无'}}</div>
                <div>特效要求：{{viewForm.specialEffects || '无'}}</div>
                <div>话筒音响要求：{{viewForm.voiceTube || '无'}}</div>
            </v-detailItem>
            <v-detailItem label="作品简介" :value="viewForm.workBrief"></v-detailItem>
             <div class="tree-content-panel" v-if="viewForm.attach">
                <div class="tree-heading">
                    <div class="v-line"></div>
                    <h5 class="u-title">附件信息</h5>
                </div>
                <el-row>
                    <div v-if="viewForm.attachName" @click="downLoadAttach" class="download-file">
                        <i class="sz-ico ico-download"></i>
                        <span class="attach-name">{{viewForm.attachName}}</span>
                    </div>
                </el-row>
            </div>
            <div class="tree-heading">
                <div class="v-line"></div>
                <h5 class="u-title">参演人员信息</h5>
            </div>
            <el-table :data="viewForm.actinPeoples" border stripe>
                <el-table-column type="index" label="序列"></el-table-column>
                <el-table-column prop="userName" label="姓名"></el-table-column>
                <el-table-column prop="sex" label="性别" :formatter="sexFormat"></el-table-column>
                <el-table-column prop="age" label="年龄"></el-table-column>
                <el-table-column prop="roles" label="饰演角色" align="center"></el-table-column>
                <el-table-column prop="works" label="工作单位"></el-table-column>
            </el-table>
            <div class="tree-heading">
                <div class="v-line"></div>
                <h5 class="u-title">主创人员信息</h5>
            </div>
            <el-table :data="viewForm.mainPeoples" border stripe>
                <el-table-column type="index" label="序列"></el-table-column>
                <el-table-column prop="userName" label="姓名"></el-table-column>
                <el-table-column prop="sex" label="性别" :formatter="sexFormat"></el-table-column>
                <el-table-column prop="age" label="年龄"></el-table-column>
                <el-table-column prop="roles" label="角色" align="center"></el-table-column>
                <el-table-column prop="works" label="工作单位"></el-table-column>
            </el-table>
        </template>
        <template v-else>
            <v-detailItem label="作品尺寸（框边）" type="custom">
                宽（cm）： {{viewForm.workWidth}} &nbsp;&nbsp;&nbsp;&nbsp;高（cm）：{{viewForm.workHeight}}
            </v-detailItem>
            <v-detailItem label="创作时间" :value="viewForm.createDate"></v-detailItem>
            <v-detailItem label="作者姓名" :value="viewForm.contact"></v-detailItem>
            <v-detailItem label="手机号码" :value="viewForm.telephone"></v-detailItem>
            <v-detailItem label="身份证号" :value="viewForm.idNumber"></v-detailItem>
            <v-detailItem label="邮编" :value="viewForm.postCode"></v-detailItem>
            <v-detailItem label="详细地址" :value="viewForm.address"></v-detailItem>
            <v-detailItem label="作品简介" :value="viewForm.workBrief"></v-detailItem>
            <div class="tree-content-panel" v-if="viewForm.attach">
                <div class="tree-heading">
                    <div class="v-line"></div>
                    <h5 class="u-title">附件信息</h5>
                </div>
                <el-row>
                    <div v-if="viewForm.attachName" @click="downLoadAttach" class="download-file">
                        <i class="sz-ico ico-download"></i>
                        <span class="attach-name">{{viewForm.attachName}}</span>
                    </div>
                </el-row>
            </div>
        </template>
    </div>
</template>

<script>
import Api from '@/api'
const TYPE = { stageArts: '舞台艺术类', exhibition: '展览艺术类' };
export default {
    props: {
        viewForm: Object
    },
    data() {
        return {
        }
    },
    computed: {
        typeFormat() {
            return TYPE[this.viewForm.type] || ''
        },
        artFormat() {
            return this.dicts.getValueByCode('artcategory', this.viewForm.arts) || ''
        }
    },
    methods: {
        sexFormat(row, col, cell) {
            if (cell == '01') return '男';
            else if (cell == '02') return '女';
            else return '未知';
        },
            // 下载附件
        downLoadAttach() {
            let filename = this.viewForm.attachName;
            let fileUrl = Api.system.getFileUrl(this.viewForm.attach);
            this.downloadFile(filename, fileUrl);
        }
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
</style>