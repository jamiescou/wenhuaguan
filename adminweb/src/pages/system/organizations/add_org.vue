<template>
    <div class="addOrg-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'orgmanage',name: '组织管理' },{name:'添加组织'}]"></v-pageheader>
        <div class="form-wrapper">
            <el-form ref="orgForm" :model="orgForm" :rules="rules" label-position="right" label-width="100px" class="m-form">
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item label="组织名称：" prop="name">
                            <el-input v-model="orgForm.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="组织类型：" prop="type">
                            <el-radio-group v-model="orgForm.type">
                                <el-radio :label="item.value" v-for="item in orgType" :key="item.value">{{item.label}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item label="联系人：" prop="contactName">
                            <el-input v-model="orgForm.contactName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系电话：" prop="contactPhone">
                            <el-input v-model="orgForm.contactPhone"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item label="地区：" prop="region">
                            <el-select v-model="orgForm.region">
                                <v-option typeName="region"></v-option>
                            </el-select>
                            <!-- <option-code typeName="region"></option-code> -->
                            <!-- <el-input v-model="orgForm.region"></el-input> -->
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="组织站点：" prop="site">
                            <el-input v-model="orgForm.site"></el-input>
                        </el-form-item>

                    </el-col>
                </el-row>
                <!-- <el-form-item label="顺序号" prop="seqno">
                            <el-input v-model="orgForm.seqno"></el-input>
                        </el-form-item> -->
                <el-form-item label="详细地址：" prop="address">
                    <el-input v-model="orgForm.address"></el-input>
                </el-form-item>
                <el-form-item label="简介：" prop="remark">
                    <el-input type="textarea" :rows="3" v-model="orgForm.remark"></el-input>
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
const ORG_TYPE = [{ value: '1', label: '机构' }, { value: '0', label: '部门' }];

export default {
    data() {
        return {
            orgForm: {
                'name': '',
                'type': '1',
                'contactName': '',
                'contactPhone': '',
                'region': '',
                'address': '',
                'site': '',
                'remark': ''
            },
            rules: {},
            orgType: ORG_TYPE
        }
    },
    methods: {
        back() {

        },
        submitForm() {

        }
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.addOrg-wrapper {}
</style>