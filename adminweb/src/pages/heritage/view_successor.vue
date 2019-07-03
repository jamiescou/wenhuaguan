<template>
    <div class="view-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'../'+titleInfo.path,name: titleInfo.name },{name:'非遗名录详细信息'}]"></v-pageheader>
        <div style="margin-top:20px;">
            <el-row>
                <el-col :span="12">
                    <v-detailItem label="名录名称" :value="viewForm.name"></v-detailItem>
                    <v-detailItem label="区域" :value="viewForm.region"></v-detailItem>
                    <v-detailItem label="传承人类型" :value="viewForm.type"></v-detailItem>
                    <v-detailItem label="名录级别" :value="viewForm.level"></v-detailItem>
                </el-col>
                <el-col :span="12">
                    <v-detailItem label="封面图片" type="image" :value="viewForm.coverPic" class="cover"></v-detailItem>
                </el-col>
            </el-row>
            <v-detailItem label="申报批次" :value="viewForm.batch"></v-detailItem>
            <v-detailItem label="名录项目" :value="viewForm.project.name"></v-detailItem>
            <v-detailItem label="传承人简介" :value="viewForm.brief"></v-detailItem>
            <v-detailItem label="传承人描述" type="rich" :value="viewForm.remark"></v-detailItem>
            <div class="dialog-footer">
                <el-button @click="back">关闭</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import Api from '@/api';
import { PARENT_NAME } from './modules/successor_status'
export default {
    data() {
        return {
            tabActive: 'first',
            options:[],
            coverPic: '',
            viewForm: {
                name: '',
                region: '',
                batch: '',
                level: '',
                remark: '',
                type: '',
                directory: { id: '', name: '' },
                coverPic: '',
                brief: '',
                project:{}
            },
            flag: 'index'
        }
    },
    computed: {
        titleInfo() {
            return PARENT_NAME[this.flag];
        }
    },    
    methods: {
        getRegion() {
            return new Promise((resolve, reject) => {
                let unit = this.$store.getters.user.unit;
                Api.system.getRegionList(unit.region).then((res) => {
                    this.options = res;
                    resolve();
                }).catch(() => {
                    reject();
                });
            })
        },
        back() {
            this.$router.go(-1);
        },
        getDetail() {
            
            Api.heritage.getSuccessor(this.id).then((info) => {                
              
               
               info.region=this.dicts.regionName(info.region);
                info.level = this.dicts.getValueByCode('heritageLevel', info.level);
                info.type = this.dicts.getValueByCode('heritageType', info.type);
                info.batch = this.dicts.getValueByCode('heritageBatch', info.batch);
                info.coverPic = Api.system.getFileUrl(info.coverPic);
                this.viewForm = info;
                })  
           
        }
    },
    mounted() {
        this.id = this.$route.params.id;
        this.flag = this.$route.query.flag;
        this.getRegion().then(() => {
            this.getDetail();
        });
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
</style>
