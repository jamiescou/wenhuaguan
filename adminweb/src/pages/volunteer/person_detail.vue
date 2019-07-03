<template>
    <div class="view-wrapper">
        <v-pageheader :breadcrumbs="breadcrumbs"></v-pageheader>
        <div style="margin-top:20px;">
            <v-detailItem label="志愿者姓名" :value="viewForm.name"></v-detailItem>
            <v-detailItem label="志愿者头像" :value="viewForm.avatar" type="image" class="coverAvatar"></v-detailItem>
            <v-detailItem label="志愿者类型" :value="viewForm.type"></v-detailItem>
            <v-detailItem label="证件信息" :value="viewForm.idNumber"></v-detailItem>
            <v-detailItem label="手机号码" :value="viewForm.telephone"></v-detailItem>
            <v-detailItem label="性别" :value="viewForm.sex"></v-detailItem>
            <v-detailItem label="出生日期" :value="viewForm.birthDay"></v-detailItem>
            <v-detailItem label="服务类别" :value="viewForm.serviceTypes"></v-detailItem>
            <v-detailItem label="邮箱" :value="viewForm.email"></v-detailItem>
            <v-detailItem label="区域" :value="viewForm.region"></v-detailItem>            
            <v-detailItem label="服务时长" :value="viewForm.serviceTotal"></v-detailItem>
            <v-detailItem label="籍贯" :value="viewForm.holdAddress"></v-detailItem>
            <v-detailItem label="最高学历" :value="viewForm.education"></v-detailItem>
             <v-detailItem label="职业" :value="viewForm.occupation"></v-detailItem>
            <v-detailItem label="政治面貌" :value="viewForm.politicalStatus"></v-detailItem>
            <v-detailItem label="个人简介" :value="viewForm.brief"></v-detailItem>
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
            breadcrumbs:[],           
            title: '人员详情',
            viewForm: {
                name: '',
                age: '',
                address: '',
                holdAddress: '',
                occupation: '',
                interest: '',
                education: '',
                politicalStatus: '',
                selfInfo: '',
                /*user: {
                    name: '',
                    idNumber: '',
                    mobile: '',
                    sex: '',
                    birthday: '',
                    email: ''
                }*/
            }
        }
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        getDetail(id) {
            Api.nouns.getVolunteer(id).then((res) => {                
                res.sex = this.formatSex(res.sex);
                res.age = this.getAge(res.birthday);
                if(res.type==="personal"){
                  res.type = "个人";
                }else {
                  res.type = "团队";
                }
               let serviceTypesname=[];
             if(res.serviceTypes!=null)
               {
                    for (let index = 0; index < res.serviceTypes.length; index++) {
                    const element = this.dicts.getValueByCode('volunteerServiceType', res.serviceTypes[index]);
                    if(element)
                    serviceTypesname.push(element);
                }
               }    
              serviceTypesname=serviceTypesname.join('、'); ;
              res.serviceTypes =serviceTypesname;
              res.avatar  = Api.system.getFileUrl(res.avatar);
              res.occupation = this.dicts.getValueByCode('occupation', res.occupation);
              res.politicalStatus = this.dicts.getValueByCode('political', res.politicalStatus);
              res.education = this.dicts.getValueByCode('education', res.education);
               res.serviceTotal=res.serviceTotal!=null&&res.serviceTotal!=""?res.serviceTotal+"小时":"";
              
                this.viewForm = res;
            });
        }
    },  
     mounted()
    {
          let id = this.$route.query.id;
        let did = this.$route.query.did;
        let flag = this.$route.query.flag;       
             
        const breadcrumbObj = {
            'activity': [{ name: '志愿者活动管理', to: 'activity_list' }, { to: { path: 'activity_person', query: { id: did } }, name: '招募管理' }, { name: '查看志愿者信息' }],
            'team': [{ name: '志愿者团队管理', to: 'index' }, { to: { path: 'team_member', query: { id: did } }, name: '志愿者成员列表' }, { name: '查看志愿者信息' }],
            'default': [{ name: '志愿者管理', to: 'person_list' }, { name: '查看志愿者信息' }]
        };
        if (!flag) flag = 'default';
        this.breadcrumbs = breadcrumbObj[flag];
        this.getDetail(id);
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.view-wrapper .coverAvatar img {
    width: 354px;
    height: 236px;
}
</style>
