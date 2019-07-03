<template>
    <div class="view-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'../venuesmanage',name: '场馆管理' },{name:'场馆详细信息'}]"></v-pageheader>
        <div style="margin-top:20px;">
            <el-row>
                <el-col :span="12">
                    <v-detailItem label="场馆名称" :value="viewForm.name"></v-detailItem>
                    <v-detailItem label="类别" :value="viewForm.type"></v-detailItem>
                    <v-detailItem label="联系人" :value="viewForm.contact"></v-detailItem>
                    <v-detailItem label="联系电话" :value="viewForm.contactMobile"></v-detailItem>
                </el-col>
                <el-col :span="12">
                    <v-detailItem label="封面图片" type="image" :value="viewForm.pic" class="cover"></v-detailItem>
                </el-col>
            </el-row>
            <v-detailItem label="开放时间" :value="viewForm.openDateTime"></v-detailItem>
            <v-detailItem label="所属区域" :value="regionName"></v-detailItem>
            <v-detailItem label="场馆地址" :value="viewForm.address"></v-detailItem>
            <el-row>
                <el-col :span="12">
                    <v-detailItem label="(坐标)经度" :value="viewForm.coordinate.longitude"></v-detailItem>
                </el-col>
                <el-col :span="12">
                    <v-detailItem label="(坐标)纬度" :value="viewForm.coordinate.latitude"></v-detailItem>
                </el-col>
            </el-row>
            <v-detailItem label="场馆简介" :value="viewForm.brief"></v-detailItem>
            <v-detailItem label="场馆描述" type="rich" :value="viewForm.desc"></v-detailItem>
            <!--<v-detailItem label="附件信息" type="custom">
                <div v-if="viewForm.attachName" @click="downLoadAttach" class="download-file">
                    <i class="sz-ico ico-download"></i>
                    <span class="attach-name">{{viewForm.attachName}}</span>
                </div>
            </v-detailItem>-->
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
            regionName:'',
            viewForm: {
                name: '',
                type: '',
                unit: {},
                address: '',
                contact: '',
                contactMobile: '',
                openDateTime: '',
                desc: '',
                pic: '',
                brief: '',
                coordinate: { longitude: '', latitude: '' }
            }
        }
    },    
    methods: {
        back() {
            this.$router.go(-1);
        },
        downLoadAttach() {
            Api.venue.getVenueAttach(this.viewForm.id).then((res) => {
                if (res.size > 0) {
                    this.downloadFile(this.viewForm.attachName, res);
                }
            });
        },
        getDetail() {
            Api.venue.getVenue(this.id).then((res) => {
                res.type = this.dicts.getValueByCode('venueType', res.type)?this.dicts.getValueByCode('venueType', res.type):"";
                res.pic = Api.system.getFileUrl(res.pic);
                Api.system.getRegion(res.region).then((data) => {
                  this.regionName = data.fullName.substring(3);
                });
                this.viewForm = res;
            });
        }
    },
    mounted() {
        this.id = this.$route.params.id;  // this.$route.query.id;
        this.getDetail();
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
