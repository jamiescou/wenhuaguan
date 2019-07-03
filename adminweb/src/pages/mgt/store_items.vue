<template>
    <div class="list-wrapper">
        <v-pageheader :breadcrumbs="[{ name: '题库管理' }]"></v-pageheader>
        <div class="right-opers">
            <el-button type="primary" icon="plus" @click="handleAdd">新增题目</el-button>
        </div>
        <section class="search-wrapper">
            <el-form :inline="true" :model="searchForm">

                <el-form-item label="标题" prop="title">
                    <el-input v-model="searchForm.title" placeholder="标题"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="loadData">查询</el-button>
                </el-form-item>
            </el-form>
        </section>
        <div class="table-container">
            <el-table :data="dataList" v-loading.body="loading" border tooltip-effect="custom">
                <el-table-column label="序号" type="index" width="80"></el-table-column>
                <el-table-column prop="title" label="标题"></el-table-column>
                <el-table-column prop="itemType" label="题型" width="80" :formatter="convertItemType"></el-table-column>
                <el-table-column prop="contents" label="问题内容" :formatter="convertContent" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="操作" width="200px" align="center">
                    <template scope="scope">
                        <a class="btn-act" @click="handleEdit(scope.row)">修改</a>
                        <a class="btn-act" @click="handleDel(scope.row)">删除</a>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container ">
                <v-pagination @pageChange="onCurrentChange" :total="total" :isShow="showPagination"></v-pagination>
            </div>
        </div>
        <el-dialog :title="title" v-model="dialogVisible" :close-on-click-modal='false' @close="resetForm">
            <div class="dialog-content">
                <el-form :model="storeitemForm" ref="storeitemForm" label-position="right" label-width="100px" :rules="rules">
                    <el-form-item label="标题：" prop="title">
                        <el-input v-model="storeitemForm.title"></el-input>
                    </el-form-item>

                    <el-form-item label="题型：" prop="itemType">
                        <el-select v-model="storeitemForm.itemType" placeholder="题目类型" @change="itemTypeChange">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <div class="code-domain" v-show="isShowOption">
                       
                        <el-row v-for="(domain, index) in storeitemForm.content" :key="domain.key" :gutter="10">
                            <el-col :span="20">
                                <el-form-item :prop="'content.' + index + '.value'" :label="'选项'+ letterSeq(index) + '：'" :rules="{required: true, message: '请输入选项内容', trigger: 'blur'}">
                                    <el-input v-model="domain.value"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-button @click.prevent="removeDomain(domain)" type="danger">删除</el-button>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="form-opres" label-width="0">
                        <el-button @click="resetForm">取 消</el-button>
                        <el-button @click="addDomain" v-show="isShowOption">新增问题选项</el-button>
                        <el-button type="primary" @click="submitForm">确 定</el-button>
                    </div>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import BaseTable from '@/mixins/base-table';
import vRules from '@/config/validate_rules'
import Api from '@/api';
// 题型 单选、多选、问答
const ITEMTYPE_LABEL = {
    'single': '单选',
    'multiple': '多选',
    'question': '问答'
}
const ITEMTYPE = {
    'single': 'single',
    'multiple': 'multiple',
    'question': 'question'
}

function typeOpts() {
    const keys = Object.keys(ITEMTYPE_LABEL);
    let opts = [];
    for (const key of keys) {
        opts.push({ label: ITEMTYPE_LABEL[key], value: key });
    }
    return opts;
}
const DIALOG = {
    add: { title: '添加题目', flag: 'Add' },
    edit: { title: '编辑题目', flag: 'Edit' }
};
export default {
    mixins: [BaseTable],
    data() {
        return {
            title: DIALOG.add.title,
            flag: DIALOG.add.flag,
            dialogVisible: false,
            storeitemForm: {},
            searchForm: { title: '' },
            options: typeOpts(),
            rules: {
                title: [{ required: true, message: '请输入标题' }, vRules.maxLen(40)],
                itemType: [{ required: true, message: '请选择题型' }]
            },
            initForm: {
                title: '',
                itemType: '',
                content: []
            }
        };
    },
    computed: {
        isShowOption() {
            let itemType = this.storeitemForm.itemType;
            return (itemType === ITEMTYPE.single || itemType === ITEMTYPE.multiple);
        }
    },
    methods: {
        loadData() {
            let str = [];
            let title = this.searchForm.title;
            if (title !== '') str.push('title~' + title);
            str = str.join(',');
            this.showLoading();
            Api.system.getStoreitems(str, this.page, this.size).then(res => {
                let data = [];
                for (let i = 0; i < res.content.length; i++) {
                    const question = res.content[i];
                    let q_Opts = [];
                    if (question.contents && question.contents.length) {
                        q_Opts = question.contents.map((item, index) => {
                            let key = i + '' + new Date().getTime() + '' + index;
                            return { key: key, value: item }
                        });
                    }
                    data.push({
                        id: question.id,
                        title: question.title,
                        itemType: question.itemType,
                        content: q_Opts
                    })
                }
                // for (const question of res.content) {

                // }
                this.dataList = data;
                this.total = res.totalElements;
                this.closeLoading();
            }).finally(this.closeLoading);
        },
        handleAdd() {
            this.storeitemForm = JSON.parse(JSON.stringify(this.initForm));
            this.title = DIALOG.add.title;
            this.flag = DIALOG.add.flag;
            this.dialogVisible = true;
        },
        handleEdit(row) {
            this.storeitemForm = JSON.parse(JSON.stringify(row));
            this.flag = DIALOG.edit.flag;
            this.title = DIALOG.edit.title;
            this.dialogVisible = true;
        },
        handleDel(row) {
            let self = this;
            self.delConfirm('题目', function() {
                Api.system.delStoreitem(row.id).then(res => {
                    self.showTip();
                    self.loadData();
                });
            });
        },
        removeDomain(item) {
            var index = this.storeitemForm.content.indexOf(item);
            if (index !== -1) {
                this.storeitemForm.content.splice(index, 1);
            }
        },
        addDomain() {
            this.storeitemForm.content.push({ key: new Date().getTime() + '' + this.storeitemForm.content.length, value: '' });
        },
        resetForm() {
            this.dialogVisible = false;
            this.$refs['storeitemForm'].resetFields();
        },
        callback() {
            this.showTip();
            this.resetForm();
            this.loadData();
        },
        // 数据提交保存
        submitForm() {
            this.$refs['storeitemForm'].validate(valid => {
                if (valid) {
                    let itemType = this.storeitemForm.itemType;
                    if (itemType !== ITEMTYPE.single && itemType !== ITEMTYPE.multiple && !this.storeitemForm.content) {
                        this.storeitemForm.content = [];
                    }

                    let contents = this.storeitemForm.content.map((x) => {
                        return x.value;
                    })

                    let newForm = {
                        title: this.storeitemForm.title,
                        itemType: this.storeitemForm.itemType,
                        contents: contents
                    }
                    if (this.flag === DIALOG.edit.flag) { // 编辑
                        newForm.id = this.storeitemForm.id;
                        Api.system.modifyStoreitem(newForm.id, newForm).then(this.callback);
                    } else {
                        // 新增
                        newForm.unitId = this.$store.getters.user.orgUnit.id;
                        Api.system.addStoreitem(newForm).then(this.callback);
                    }
                }
            });
        },
        // 格式化题型
        convertItemType(row) {
            var itemType = row.itemType;
            return ITEMTYPE_LABEL[itemType];
        },

        // 格式化问题内容
        convertContent(row) {
            var content = row.content;
            let str = [];
            for (var i = 0; i < content.length; i++) {
                str.push(this.letterSeq(i) + '.  ' + (content[i].value || ''));
            }
            return str.join('  ');
        },
        itemTypeChange(val) {
            if ((val === ITEMTYPE.single || val === ITEMTYPE.multiple) && this.storeitemForm.content.length === 0) {
                this.addDomain();
            }
        }
    }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
