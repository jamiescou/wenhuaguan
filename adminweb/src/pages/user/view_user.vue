<template>
    <div class="view-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'../index',name: '会员列表' },{name:'会员详细信息'}]"></v-pageheader>
        <div style="margin-top:20px;">
            <el-row>
                <el-col :span="12">
                    <v-detailItem label="昵称" :value="viewForm.nickname"></v-detailItem>
                    <v-detailItem label="姓名" :value="viewForm.name"></v-detailItem>
                    <v-detailItem label="性别" :value="viewForm.sex"></v-detailItem>
                    <v-detailItem label="出生日期" :value="viewForm.birthday"></v-detailItem>

                </el-col>
                <el-col :span="12">
                    <v-detailItem label="头像" type="image" :value="viewForm.pic" class="cover"></v-detailItem>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <v-detailItem label="身份证号码" :value="viewForm.idNumber"></v-detailItem>
                </el-col>
                <el-col :span="12">
                    <v-detailItem label="认证状态" :value="viewForm.identifyStatus"></v-detailItem>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <v-detailItem label="手机号" :value="viewForm.mobile"></v-detailItem>
                </el-col>
                <el-col :span="12">
                    <v-detailItem label="邮箱" :value="viewForm.email"></v-detailItem>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <v-detailItem label="是否绑定微信" :value="viewForm.bindWeixin?'是':'否'"></v-detailItem>
                </el-col>
                <el-col :span="12">
                    <v-detailItem label="是否锁定" :value="viewForm.locked?'是':'否'"></v-detailItem>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <v-detailItem label="注册时间" :value="viewForm.registTime"></v-detailItem>
                </el-col>
                <el-col :span="12">
                    <v-detailItem label="注册来源" :value="viewForm.registerMode"></v-detailItem>
                </el-col>
            </el-row>
            <v-detailItem label="认证信息" :value="viewForm.identifyComment"></v-detailItem>
            <v-detailItem label="绑定信息" type="custom">
                <template v-if="viewForm.bindWeixin">
                    <div v-for="(item,index) in viewForm.binds" :key="index">
                        【{{item.type}}】{{item.account}}
                    </div>
                </template>

            </v-detailItem>
            <div class="tree-content-panel">
                <div class="tree-heading content-heading">
                    <div class="v-line"></div>
                    <h5 class="u-title">家庭成员</h5>
                </div>
                <div class="table-container">
                    <el-table :data="members" border tooltip-effect="custom-effect">
                        <el-table-column label=" " type="index" align="center"></el-table-column>
                        <el-table-column prop="name" label="姓名" align="center"></el-table-column>
                        <el-table-column prop="idNumber" label="证件号" align="center"></el-table-column>
                        <el-table-column prop="sex" label="性别" align="center">
                            <template scope="scope">
                                {{formatSex(scope.row.sex)}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="birthday" label="年龄" align="center" :formatter="convertAge"></el-table-column>
                        <el-table-column prop="identifyStatus" label="认证状态" align="center" :formatter="convertStatus"></el-table-column>
                        <el-table-column prop="identifyComment" label="认证信息" align="center"></el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="dialog-footer">
                <el-button @click="back">返回</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import Api from '@/api';
import _userStatus from './user_status';
export default {
    data() {
        return {
            members: [],
            viewForm: {
                id: '',
                nickname: '',
                name: '',
                idNumber: '',
                sex: '',
                birthday: '',
                mobile: '',
                email: '',
                locked: '',
                identifyStatus: '',
                identifyComment: '',
                binds: '',
                bindWeixin: '',
                regionCode: '',
                registTime: '',
                registerMode: '',
                pic: '',
                limits: '',
                roles: '',
                bonus: '',

            }
        }
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        getDetail() {
            Api.user.getUserInfo(this.id).then((res) => {
                // res.sex = this.formatSex(res.sex);
                if (res.idNumber===null) {
                    res.sex = "";
                } else {
                    let str = res.idNumber.substring(16, 17);
                    if (str % 2 === 0) {
                      res.sex = '女';
                    } else {
                      res.sex = "男";
                    }
                    res.birthday = res.idNumber.substring(6, 10)+"-"+res.idNumber.substring(10,12)+"-"+res.idNumber.substring(12,14);
                }
                // res.lockedlocked = res.locked ? '是' : '否';
                // res.bindWeixin = res.bindWeixin ? '是' : '否';
                res.registerMode = res.registerMode == 'pcweb' ? 'PC' : '移动端';
                res.pic = Api.system.getFileUrl(res.pic);
                res.identifyStatus = _userStatus.statusName(res.identifyStatus);
                this.viewForm = res;
            });

            Api.user.getUserMembers(this.id).then((res) => {
                this.members = res || [];
            });
        },
        convertStatus(row, column, cellValue) {
            return _userStatus.statusName(cellValue);
        },
        convertAge(row, column, cellValue) {
            return this.getAge(cellValue);
        }
    },
    mounted() {
        this.id = this.$route.params.id;
        this.getDetail();
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
     
</style>
