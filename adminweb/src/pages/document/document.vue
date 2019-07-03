<template>
    <div class="edit-wrapper">
        <v-pageheader :breadcrumbs="[{ to:titleInfo.path,name: titleInfo.name },{name:title}]"></v-pageheader>
        <div class="form-wrapper">
            <el-form ref="activityForm" :model="activityForm" :rules="rules" label-position="right" label-width="140px" class="m-form">
                <el-form-item label="活动名称：" prop="name">
                    <el-input v-model="activityForm.name"></el-input>
                </el-form-item>
                <el-form-item label="上传封面：" prop="coverPic">
                    <v-cropper class="cover" :imgUrl='coverPic' :upload="handleUpload" @remove="removeImg"></v-cropper>
                </el-form-item>
                <el-form-item label="征集时间：" required>
                    <el-col :span="11">
                        <el-form-item prop="startTime">
                            <el-date-picker v-model="activityForm.startTime" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="开始时间" :editable="false"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2" class="line"> &sim;</el-col>
                    <el-col :span="11">
                        <el-form-item prop="endTime">
                            <el-date-picker v-model="activityForm.endTime" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="结束时间" :editable="false"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-form-item>

                  <el-form-item label="征集类型：">
                    <el-radio-group v-model="activityForm.type">
                      <el-radio  key="activity" label="activity">活动</el-radio>
                      <el-radio  key="competition" label="competition">比赛</el-radio>
                    </el-radio-group>
                  </el-form-item>
                <!--<el-form-item label="作品格式：">
                  <el-radio-group v-model="activityForm.digitType">
                    <el-radio  key="pic" label="pic">图片</el-radio>
                    <el-radio  key="video" label="video">视频</el-radio>
                    <el-radio  key="audio" label="audio">音频</el-radio>
                    <el-radio  key="text" label="text">文章</el-radio>
                  </el-radio-group>
                </el-form-item>-->

                <el-form-item label="奖项设置：" prop="award" v-if="activityForm.type == 'competition'">
                    <el-input type="textarea" v-model="activityForm.award"></el-input>
                </el-form-item>
                <el-form-item label="简介：" prop="brief">
                    <el-input v-model="activityForm.brief" placeholder="请输入最多100个字的资讯简介"></el-input>
                </el-form-item>
                <el-form-item label="征集活动详情：" prop="desc">
                    <v-richeditor v-model="activityForm.desc" ref="richEditor"></v-richeditor>
                </el-form-item>
                <div class="form-opres">
                    <el-button @click="back" class="u-btn">返回</el-button>
                    <el-button @click="submitForm" type="primary" class="u-btn">确定</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
import Api from '@/api'
import vRules from '@/config/validate_rules'
import _status from './document_status'
const DIALOG = {
    add: { title: '添加作品征集活动', flag: 'Add' },
    edit: { title: '编辑作品征集活动', flag: 'Edit' }
};
export default {
    data() {
          /**
         * 日期比较
         *  只比较日期，不比较时间
         * @param {any} rule 规则定义
         * @param {any} value 值
         * @param {any} callback 回调函数
         */
        const dateCompare = (rule, value, callback) => {
            let oneDate = this.activityForm[rule.type];
            let twoDate = value;
            if (oneDate && twoDate) {
                let compareResult = true;
                if ((oneDate instanceof Date) && (twoDate instanceof Date)) {
                    oneDate = oneDate.getTime();
                    twoDate = twoDate.getTime();
                    if (rule.type === 'endTime') {
                        compareResult = oneDate >= twoDate;
                        this.$refs.activityForm.validateField(rule.type);
                    } else {
                        compareResult = oneDate <= twoDate;
                    }
                }
                if (!compareResult) {
                    return callback(new Error('报名开始日期不能大于报名结束日期'));
                }
            }
            callback();
        };
        return {
            title: DIALOG.add.title,
            flag: DIALOG.add.flag,
            tag: 1,
            activityForm: {
                type:'activity',
                name: '',
                digitType: 'pic',
                onlineStatus: _status.STATUS.WAITCOMMIT,
                startTime: '',
                endTime: '',
                desc: '',
                coverPic: '',
                brief: ''
            },
            rules: {
                'name': [vRules.required,vRules.maxLen(40)],
                'coverPic': [vRules.required],
                'brief': [vRules.rangeLen(1, 100)],
                startTime: [vRules.datarequired, { validator: dateCompare, type: 'endTime', trigger: 'change' }],
                endTime:[vRules.datarequired, { validator: dateCompare, type: 'startTime', trigger: 'change' }] ,
                'desc': [vRules.required]
            },
            coverPic: ''
        }
    },
    watch: {
        'activityForm.type'(val) {
            if (val === 'activity') {
                this.activityForm.award = '';
            }
        }
    },
    computed: {
        titleInfo() {
            return _status.PARENT_NAME[this.tag];
        }
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        // 图片上传
        handleUpload(formData) {
            Api.system.uploadFile(formData, 'pic').then((res) => {
                this.activityForm.coverPic = res.url;
            })
        },
        // 提交
        submitForm() {
            this.$refs['activityForm'].validate((valid) => {
                if (valid) {
                  // 日期时间格式化
                    let newForm = Object.assign(this.activityForm);
                    newForm.startTime = this.formatDate(newForm.startTime, 'yyyy-MM-dd HH:mm:ss');
                    newForm.endTime = this.formatDate(newForm.endTime, 'yyyy-MM-dd HH:mm:ss');
                    let user = this.$store.getters.user;
                    if (this.flag === DIALOG.add.flag) {
                        // 提交人信息
                        newForm.creator = { userId: user.username, userName: user.name };
                        newForm.dataDeptId = user.unit.id;
                       newForm.unitId = this.$store.getters.user.orgUnit.id;
                        Api.document.addDocument(newForm).then(this.back);
                    } else if (this.flag === DIALOG.edit.flag) {
                        // 修改人信息
                        newForm.lastModifier = { userId: user.username, userName: user.name };
                        // 编辑活动信息
                        Api.document.modifyDocument(newForm.id, newForm).then(this.back);
                    }
                }
            });
        },
        getDetail() {
            // 详细信息
            Api.document.getDocument(this.id).then((res) => {
                if (res.startTime) {
                    res.startTime = this.convertToDate(res.startTime);
                }
                if (res.endTime) res.endTime = this.convertToDate(res.endTime);
                this.activityForm = res;
                this.coverPic = Api.system.getFileUrl(res.coverPic);
            });
        },
        // 删除图片
        removeImg() {
            this.activityForm.coverPic = '';
        },
        // 富文本编辑器
        initUnit() {
            Api.system.getUnits('type:org&sort=seqno~desc', 1, -1).then((res) => {
                this.cultData = res.content;
            });
        }
    },
    mounted() {
        this.initUnit();
        this.id = this.$route.query.id;
        if (this.id) {
            this.title = DIALOG.edit.title;
            this.flag = DIALOG.edit.flag;
            this.tag = this.$route.query.flag;
            this.getDetail();
        } else {
            let user = this.$store.getters.user;
        }
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
