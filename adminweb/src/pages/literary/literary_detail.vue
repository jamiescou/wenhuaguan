<template>
    <div class="view-wrapper">
        <v-pageheader v-if="type==1" :breadcrumbs="[{ to:'index',name: '文艺人才管理' },{name:'文艺人才详细信息'}]"></v-pageheader>

         <v-pageheader v-if="type==2" :breadcrumbs="[{ to:'index',name: '专家管理' },{name:'专家详细信息'}]"></v-pageheader>

        <div style="margin-top:20px;">
            <el-row>
                <el-col :span="12">
                    <v-detailItem label="姓名" :value="viewForm.name"></v-detailItem>
                    <v-detailItem label="性别" :value="viewForm.sex"></v-detailItem>
                    <v-detailItem label="艺术分类" :value="viewForm.artType"></v-detailItem>
                    <v-detailItem label="出生日期" :value="viewForm.birthDate"></v-detailItem>
                    <v-detailItem label="最高学历" :value="viewForm.edu"></v-detailItem>
                    <v-detailItem label="毕业院校" :value="viewForm.school"></v-detailItem>
                    <v-detailItem label="所属区域" :value="regionName"></v-detailItem>
                    <v-detailItem label="详细地址" :value="viewForm.detailAddr"></v-detailItem>
                </el-col>
                <el-col :span="12">
                    <v-detailItem label="封面图片" type="image" :value="viewForm.coverPic" class="cover portrait"></v-detailItem>
                </el-col>
            </el-row>
            <v-detailItem label="人才简介" type="rich" :value="viewForm.brief"></v-detailItem>
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
            type:'',
            regionName:'',
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
        this.type=this.$route.query.type;
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        getDetail(id) {
            Api.literary.getLiterary(id).then((res) => {
                let artType = [];
                for (let item of res.artType) {
                    if(this.dicts.getValueByCode('artistClass', item))
                    artType.push(this.dicts.getValueByCode('artistClass', item));
                }
                res.artType = artType.join('、');
                res.sex = this.formatSex(res.sex);
                Api.system.getRegion(res.region).then((data) => {
                  this.regionName = data.fullName.substring(3);
                });
                this.viewForm = res;
                this.viewForm.coverPic = Api.system.getFileUrl(res.coverPic);
            });
        }
    },
    mounted() {
        this.getDetail(this.$route.query.id);
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
