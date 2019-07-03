<template>
    <div class="tag-wrapper" v-loading.body="loading">
        <v-pageheader :breadcrumbs="[{ name: '分类管理' }]"></v-pageheader>
        <div class="main-body">
            <div class="center-content table-container">
                <div class="opts">
                    <el-button type="primary" size="small" @click="handleEdit" icon="edit">编辑</el-button>
                </div>
                <h5 class="tag_title" style="margin: 0;height: 40px;line-height: 40px;background: #eef1f6;padding-left: 15px;">字典项配置</h5>
                <el-table :data="currentTag.codes" border stripe v-loading.body="loading" tooltip-effect="custom-effect" key="index">
                    <el-table-column prop="code" label="代码" align="center"></el-table-column>
                    <el-table-column prop="value" label="代码值" align="center"></el-table-column>
                    <el-table-column label="显示顺序" prop="seqno" align="center"></el-table-column>
                </el-table>
            </div>
        </div>
        <div class="tag_list">
            <h5 class="tag_title">类型列表</h5>
            <v-scrollbar class="scroll-wrapper" :settings="{useSelectionScroll: true}">
                <ul>
                    <li v-for="(item,index) in dataList" class="tag-item" :class="{'current':currentIndex===index}" :key="item.id" @click="selectTag(index,item)">{{item.typeName}}</li>
                </ul>
            </v-scrollbar>
        </div>
        <el-dialog :title="dictForm.typeName+' 编辑'" v-model="dialogVisible" key="1" :close-on-click-modal='false'>
            <el-form :model="dictForm" ref="dictForm" label-position="right" label-width="100px" :rules="rules" class="m-form">
                <!-- <el-form-item prop="typeCode" label="字典Code">
                    <el-input v-model="dictForm.typeCode" disabled></el-input>
                </el-form-item> -->
                <el-form-item prop="typeName" label="字典名称">
                    <el-input v-model="dictForm.typeName" disabled readonly></el-input>
                </el-form-item>
                <div class="code-domain">
                    <el-row v-for="(domain, index) in dictForm.codes" :key="domain.code">
                        <el-col :span="5">
                            <!-- <span v-show="false">{{domain.code = domain.code!==''?domain.code:'' + (index + 1) }}</span> -->
                            <el-form-item :label="'代码'+(index+1)" :prop="'codes.' + index + '.code'" :rules="{required: true, message: '代码不能为空', trigger: 'blur'}">
                                <el-input v-model="domain.code"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="代码值" :prop="'codes.' + index + '.value'" :rules="{required: true, message: '代码值不能为空', trigger: 'blur'}">
                                <el-input v-model="domain.value"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="显示顺序" :prop="'codes.' + index + '.seqno'">
                                <el-input v-model="domain.seqno"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-button @click.prevent="removeDomain(domain,'dictForm')" style="margin-left: 5px;">删除
                            </el-button>
                        </el-col>
                    </el-row>
                </div>
                <div class="dialog-footer">
                    <el-button type="primary" @click="submitForm('dictForm')">提交</el-button>
                    <el-button @click="addDomain()">新增代码</el-button>
                    <el-button @click="resetForm('dictForm')">取消</el-button>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import Api from "@/api";
import perfectScrollbar from "@/components/scrollbar/perfect-scrollbar";
import _valid from "@/config/validate_rules";
export default {
    components: {
        "v-scrollbar": perfectScrollbar
    },
    data() {
        return {
            loading: false,
            dialogVisible: false,
            dataList: [],
            currentIndex: -1,
            currentTag: { codes: [] },
            dictForm: {
                typeName: "",
                codes: []
            },
            rules: {
                typeName: [_valid.required,_valid.maxLen(40)]
            }
        };
    },
    methods: {
        showLoading() {
            this.loading = true;
        },
        closeLoading() {
            this.loading = false;
        },
        loadData() {
            this.showLoading();
            Api.system.getDictionaries().then(res => {
                if (res && res.length) {
                    this.dataList = res.map((x) => {
                        x.codes = [];
                        return x;
                    })
                    this.currentTag = res[0];
                    this.currentIndex = 0;

                }
                this.loadCodes();
            }).catch(this.closeLoading);
        },
        loadCodes() {
            Api.system.getDictofCodes(this.currentTag.typeCode).then(res => {
                this.currentTag.codes = res;
                this.closeLoading();
            }).catch(this.closeLoading);
        },
        handleEdit() {
            this.dictForm = JSON.parse(JSON.stringify(this.currentTag));  // Object.assign({}, this.currentTag);
            this.dialogVisible = true;
        },
        selectTag(index, item) {
            this.showLoading();
            this.currentIndex = index;
            this.currentTag = item;
            this.loadCodes();
        },
        addDomain() {
            if (!this.dictForm.codes) {
                this.dictForm.codes = [];
            }
            this.dictForm.codes.push({ code: '', value: '', seqno: this.dictForm.codes.length + 1 });
        },
        removeDomain(item, formName) {
            if (formName === "dictForm") {
                var index = this.dictForm.codes.indexOf(item);
                if (index !== -1) {
                    this.dictForm.codes.splice(index, 1);
                }
            }
        },
        resetForm(formName) {
            this.dialogVisible = false;
            this.$refs[formName].resetFields();
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (!valid) return;
                Api.system.editDicItem(this.dictForm.codes, this.dictForm.typeCode).then(res => {
                    this.dialogVisible = false;
                    this.currentTag = this.dictForm;
                    this.dataList[this.currentIndex] = this.dictForm;
                    this.$store.dispatch("UPDATE_DICT", this.dictForm.typeCode);
                });
            });
        }
    },
    mounted() {
        this.loadData();
    }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
@import "../../styles/mixin.scss";
.tag-wrapper {
  position: relative;
  @include clearfix;
  .main-body {
    width: 100%;
    float: left;
    .center-content {
      margin: 0 0 0 210px;
      .opts {
        margin: 10px 0;
      }
    }
  }
  .tag_list {
    width: 200px;
    float: left;
    padding-bottom: 30px;
    margin-left: -100%;
    background-color: #eaedf1;
    .tag_title {
      margin: 0;
      line-height: 40px;
      background: darken(#eaedf1, 5%);
      padding-left: 15px;
      border-left: 5px solid;
    }
    .scroll-wrapper {
      position: relative;
      max-height: 700px;
      overflow: auto;
    }
    ul,
    ol {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .tag-item {
      display: table;
      width: 100%;
      height: 42px;
      font-size: 14px;
      line-height: 42px;
      color: #333;
      text-align: center;
      cursor: pointer;
      &.current {
        background-color: #fff;
      }
    }
  }
}
</style>
