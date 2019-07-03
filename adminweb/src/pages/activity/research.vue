<template>
    <div v-loading.body="loading">
        <v-pageheader :breadcrumbs="[{ to:titleInfo.path,name: titleInfo.name },{name:title}]"></v-pageheader>
        <div class="opets-actions">
            <template v-if="isEdit">
                <el-button type="primary" @click="handlePub">{{questionnaireForm.isPublished?'取消发布':'问卷发布'}}</el-button>
                <el-button type="primary" @click="handStatistics">问卷统计</el-button>
            </template>
        </div>
        <div class="survey-wrapper" v-show="startEdit">
            <div class="sur-sidebar">
                <div class="questions-wrapper">
                    <ul v-if="listData && listData.length">
                        <li v-for="(quest,index) in listData" :key="quest.id" class="quest-item">
                            <span>{{(index+1)+'. '+quest.title}}</span>
                            <span class="q-type">({{convertItemType(quest.itemType)}})</span>
                            <el-popover placement="right-start" popper-class="qitem-wrapper" trigger="hover" v-if="quest.contents&&quest.contents.length">
                                <h4 class="quest-title">{{quest.title}}({{convertItemType(quest.itemType)}})</h4>
                                <div class="quest-content">
                                    <div v-for="(item,index) in quest.contents" :key="index">{{letterSeq(index)+'. '+item}}</div>
                                </div>
                                <i class="sz-ico ico-desc" slot="reference"></i>
                            </el-popover>
                            <el-button @click.prevent="handleToRight(quest)" icon="plus" size="mini" :plain="true" type="info" class="quest-add" title="添加到问卷"></el-button>
                        </li>
                    </ul>
                    <v-nodata tipMsg="还没有相关题目" v-else></v-nodata>
                </div>
            </div>
            <div class="sur-main">
                <el-form ref="questionnaireForm" :model="questionnaireForm" label-position="right" label-width="80px">
                    <div class="table-container">
                        <el-table max-height="700" :data="questionnaireForm.items" border highlight-current-row tooltip-effect="custom">
                            <el-table-column label=" " type="index" width="70px" align="center"></el-table-column>
                            <el-table-column prop="title" label="标题"></el-table-column>
                            <el-table-column prop="itemType" label="题型" width="70px" align="center" :formatter="convertItemType"></el-table-column>
                            <el-table-column prop="contents" label="问题内容" :formatter="convertContent" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="操作" width="120px">
                                <template scope="scope">
                                    <a class="btn-act" @click="handleDelete(scope.row,scope.$index)">删除</a>
                                </template>
                            </el-table-column>
                            <template slot="empty">
                                <v-nodata tipMsg="选择左侧题库中题目，添加到此空白区域"></v-nodata>
                            </template>
                        </el-table>
                    </div>
                    <div class="form-opres">
                        <el-button type="primary" @click="submit">{{isEdit?'编辑问卷':'添加问卷'}}</el-button>
                        <el-button @click="back">返回</el-button>
                    </div>
                </el-form>
            </div>
        </div>
        <div class="sur-main" v-if="isEdit">
            <el-form ref="questionnaireForm" :model="questionnaireForm" label-position="right" label-width="80px">
                <div class="table-container">
                    <el-table max-height="700" :data="questionnaireForm.items" border highlight-current-row tooltip-effect="custom">
                        <el-table-column label=" " type="index" width="70px" align="center"></el-table-column>
                        <el-table-column prop="title" label="标题"></el-table-column>
                        <el-table-column prop="itemType" label="题型" width="70px" align="center" :formatter="convertItemType"></el-table-column>
                        <el-table-column prop="contents" label="问题内容" :formatter="convertContent" :show-overflow-tooltip="true"></el-table-column>
                    </el-table>
                </div>
                <div class="form-opres">
                    <el-button type="primary" @click="startEdit = true">现在去编辑</el-button>
                    <el-button @click="back">返回</el-button>
                </div>
            </el-form>
        </div>
        <div v-show="!startEdit && !isEdit" class="empty-tip">
            <i class="icon sz-ico ico-smile"></i>
            <p>当前活动还没有问卷</p>
            <el-button type="primary" @click="startEdit = true">现在去创建</el-button>
        </div>
    </div>
</template>
<script>
import Api from '@/api'
import { PARENT_NAME } from './activity_status'
// 题型 单选、多选、问答
const ITEMTYPE = {
    'single': '单选',
    'multiple': '多选',
    'question': '问答'
};

const DIALOG = {
    add: { title: '添加活动问卷', flag: 'Add' },
    edit: { title: '编辑活动问卷', flag: 'Edit' }
};
export default {
    data() {
        return {
            titleInfo: PARENT_NAME['3'],
            id: '',
            loading: false,
            title: DIALOG.add.title,
            flag: DIALOG.add.flag,
            startEdit: false,
            checkAll: false, // 全选
            isIndeterminate: false, // 标记关联全选
            questClass: '',
            listData: [],
            allQuestion: [],
            questionnaireForm: { isPublished: false, items: [] },
            checkedQuestion: [], // 已选问题
            rules: {}
        }
    },
    computed: {
        hasQuestion() {
            return (this.questionnaireForm.items && this.questionnaireForm.items.length);
        },
        isEdit() {
            return this.flag === DIALOG.edit.flag;
        }
    },
    methods: {
        // 格式化问题内容
        convertContent(row) {
            var content = row.contents;
            if (!content) return;
            let str = [];
            for (var i = 0; i < content.length; i++) {
                str.push(this.letterSeq(i) + '.  ' + (content[i] || ''));
            }
            return str.join('  ');
        },
        // 获取题库
        getQuestionBank(type) {
            this.loading = true;
            let search = '';
            search += '&sort=createTime~desc';
            Api.system.getStoreitems(search, 1, -1).then((res) => {
                this.allQuestion = res.content;
                this.listData = res.content;
            });
        },
        // 删除
        handleDelete(row, index) {
            this.questionnaireForm.items.splice(index, 1);
            // this.allQuestion.push(row);
            // this.updateListData();
        },
        callback() {
            this.showTip();
            this.title = DIALOG.edit.title;
            this.flag = DIALOG.edit.flag;
            this.startEdit = false;
        },
        // 提交
        submit() {
            if (!this.questionnaireForm.items || !this.questionnaireForm.items.length) {
                this.showTip('空白问卷，请添加题目！');
                return;
            }
            this.$refs['questionnaireForm'].validate((valid) => {
                if (!valid) return;

                let newForm = this.deepClone(this.questionnaireForm);
                let items = newForm.items.map((x) => {
                    return {
                        title: x.title,
                        type: x.itemType || x.type,
                        contents: x.contents
                    };
                })
                newForm.items = items;
                if (this.flag === DIALOG.edit.flag) { // 更新
                    Api.activity.modifyActivityResearch(this.id, newForm).then(this.callback);
                } else {    // 新增问卷
                    Api.activity.addActivityResearch(this.id, newForm).then(this.callback);
                }
            });
        },
        // 格式化题型
        convertItemType(row) {
            let type = row.itemType;
            if (!type) {
                type = row.type;
            }
            return ITEMTYPE[type];
        },
        // 获取问卷
        getQuestionnaire() {
            Api.activity.getActivityResearch(this.id).then((res) => {
                if (res === null || res === undefined || res === '') {
                    this.title = DIALOG.add.title;
                    this.flag = DIALOG.add.flag;
                } else {
                    this.questionnaireForm = res;
                    this.title = DIALOG.edit.title;
                    this.flag = DIALOG.edit.flag;
                }
            }).finally(() => { this.loading = false });
        },
        // 添加到问卷
        handleToRight(questItem) {
            if (!this.questionnaireForm.items) {
                this.$set(this.questionnaireForm, 'items', []);
            }
            let index = this.questionnaireForm.items.findIndex(x => x.title === questItem.title);
            if (index != -1) {
                this.showTip('题目已添加，请勿重复添加');
                return;
            }
            this.questionnaireForm.items.push(questItem);
        },
        back() {
            this.$router.go(-1);
        },
        handlePub() {
            Api.activity.activityResearchPublish(this.id, !this.questionnaireForm.isPublished).then(() => {
                this.questionnaireForm.isPublished = !this.questionnaireForm.isPublished;
                this.showTip();
            });
        },
        handStatistics() {
            this.$router.push({ path: 'statistics', query: { flag: this.id } });
        }
    },
    created() {
        this.id = this.$route.query.flag;
        this.getQuestionnaire();
        this.getQuestionBank();
    },
    mounted() {
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.opets-actions {
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: right;
}
.survey-wrapper {
  width: 100%;
  margin: 0 auto;
  &:after {
    content: "";
    display: table;
    clear: both;
  }
  $siderbar-w: 350px;
  .sur-sidebar {
    $sidebar-h: 735px;
    float: left;
    width: $siderbar-w;
    height: $sidebar-h;
    overflow: hidden;
    border: 1px solid #bfcbd9;
    position: relative;
    padding: 0;
    box-sizing: border-box;
    .side-hd {
      display: block;
      width: 100%;
      height: 40px;
      margin: 0;
      font-size: 16px;
      font-weight: 700;
      line-height: 40px;
      text-align: center;
      background: #ececec;
    }
    .serveyClass {
      width: 100%;
      .el-input__inner {
        text-align: center;
        border-radius: 0;
      }
    }
    .questions-wrapper {
      .q-type {
        display: inline-block;
        font-size: 12px;
        color: #ccc;
      }
      ul,
      ol {
        width: 100%;
        list-style: none;
        padding-left: 0;
      }
      .quest-item {
        position: relative;
        width: 100%;
        display: table;
        padding: 0 35px 0 12px;
        line-height: 28px;
        font-size: 14px;
        box-sizing: border-box;
        .quest-add {
          position: absolute;
          right: 10px;
          top: 50%;
          margin-top: -12px;
        }
        .sz-ico {
          color: #999;
        }
      }
    }
  }
  .sur-main {
    margin-left: ($siderbar-w + 20px);
  }
}
.sur-main {
  overflow: hidden;
  .form-opres {
    text-align: center;
    padding: 20px 15px;
    & > .el-button {
      width: 120px;
    }
  }
  .el-table__empty-text {
    position: relative;
    left: 0;
    top: 0;
  }
}
.qitem-wrapper {
  max-width: 300px;
  .quest-title {
    margin: 0 0 10px;
    padding: 0;
  }
  .quest-content {
    margin: 0;
    line-height: 1.8;
    word-wrap: break-word;
  }
}
</style>
