<template>
    <div>
        <v-pageheader :breadcrumbs="breadcrumbs"></v-pageheader>
        <div class="questionnaire">
            <div class="q-heading">
                <h4 class="q-title">{{questionnaire.title}}</h4>
                <div class="q-desc">
                    <p>有效份数：{{questionnaire.peoples || 0}} 份</p>
                </div>
            </div>
            <div class="quest-content">
                <div class="quest-item" v-for="(qItem,index) in questionnaire.items" :key="qItem.index">
                    <h4 class="item-title">{{qItem.title}}</h4>
                    <p class="item-desc">
                        <span>题型：{{convertItemType(qItem.type)}}</span>
                    </p>
                    <div class="item-content">
                        <div v-if="qItem.type === answer" class="flex no-border">
                            <span class="cell q-no">统计人数: {{qItem.counts?qItem.counts[0]:0}}</span>

                            <!-- <el-form-item>
                                <el-input auto-complete="off"></el-input>
                            </el-form-item> -->
                        </div>
                        <div v-else>
                            <div class="flex content-hd">
                                <span class="cell q-no">序号</span>
                                <span class="cell">答案选项</span>
                                <span class="cell fixed">小计</span>
                                <span class="cell fixed">比例</span>
                            </div>
                            <div class="flex" v-for="(cItem,index) in qItem.contents" :key="index">
                                <span class="cell q-no">{{letterSeq(index)}}</span>
                                <span class="cell ">{{cItem}}</span>
                                <span class="cell fixed">{{ qItem.counts ? qItem.counts[index] : 0 }}</span>
                                <span class="cell fixed">{{toPercentage(index,qItem.counts)}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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

export default {
    data() {
        return {
            id: '',
            questionnaire: {},
            codes: [],
            answer: 'question',
            breadcrumbs: [],
        }
    },
    created() {
        this.id = this.$route.query.flag;
        this.getQuestionnaire();
        let rootPath = PARENT_NAME['3'];
        this.breadcrumbs = [
            { to: rootPath.path, name: rootPath.name },
            { to: { path: 'questionnaire', query: { flag: this.id } }, name: '活动问卷' },
            { name: '问卷统计' }
        ]
    },
    methods: {
        // 获取问卷
        getQuestionnaire() {
            Api.activity.getActivityResearch(this.id).then((res) => {
                this.questionnaire = res;
            });
        },
        // 格式化题型
        convertItemType(itemType) {
            return ITEMTYPE[itemType];
        },
        toPercentage(index, counts) {
            if (!counts) return '0%';
            var sum = 0;
            for (var i = 0; i < counts.length; i++) {
                sum += counts[i];
            }
            return ((counts[index] / sum).toFixed(2)) * 100 + '%';
        }
    },
    mounted() {

        // Api.comprehensive.findResearch(this.id).then((res) => {
        //     this.questionnaire = res;
        //     for (let i = 0; i < this.questionnaire.items.length; i++) {
        //         let question = this.questionnaire.items[i];
        //         if (question.itemType === ANSWER && !question.content.length) {
        //             question.content = [{}];
        //         }
        //     }
        // });
    }
}
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
/** 弹性布局（类似表格） **/
.flex {
  display: flex;
  width: 100%;
  /*overflow: hidden;*/
  align-items: center;
  background-color: #fff;
  & > .cell {
    position: relative;
    flex: 1;
    width: 0;
    max-width: 100%;
    display: block;
    word-break: break-all;
    font-size: 14px;
    padding: 6px 10px;
  }
  & > .fixed {
    flex: none;
    align-self: center;
    width: auto;
    -webkit-box-flex: 0;
  }
}

.questionnaire {
  width: 700px;
  margin: 0 auto;
  .q-heading {
    padding: 10px 15px 0;
    border-bottom: 1px solid #ddd;
    text-align: center;
  }
  .p-collectSum {
    display: inline-block;
    .el-input__inner {
      border-width: 0;
      border-bottom-width: 1px;
      border-radius: 0;
      height: 24px;
    }
  }
  .q-title {
    display: block;
    font-weight: 700;
    font-size: 16px;
    color: #2e363f;
    line-height: 20px;
    padding: 10px 15px 6px;
  }
  .el-form-item {
    margin-bottom: 0;
    .el-input__inner {
      height: 28px;
      font-size: 12px;
      width: 120px;
    }
  }
  .q-desc {
    display: block;
    padding: 0 0 10px;
    font-weight: normal;
    font-size: 12px;
    color: #818181;
    text-align: left;
    line-height: 24px;
    span + span {
      margin-left: 10px;
    }
  }
  .quest-item {
    border-top: 1px solid #ececec;
    border-bottom: 1px solid #ddd;
    padding: 15px 15px 25px;
    .item-title {
      display: block;
      font-size: 14px;
      color: #2e363f;
      line-height: 20px;
    }
    .item-desc {
      font-size: 12px;
      color: #2e363f;
      line-height: 18px;
      span + span {
        margin-left: 10px;
      }
    }
    .item-content {
      margin-top: 5px;

      .q-no {
        flex: 0 0 80px;
        width: 80px;
        overflow: hidden;
      }
      .content-hd {
        background-color: #f9f9f9;
      }
      .flex {
        border: 1px solid #ececec;
        margin-bottom: -1px;
        &.no-border {
          border-width: 0;
          .q-no {
            padding: 0;
            text-align: left;
          }
        }
        .cell {
          text-align: center;
          line-height: 30px;
          /*height:60px;*/
        }
        .cell + .cell {
          border-left: 1px solid #ececec;
        }
        .fixed {
          flex: 0 0 145px;
          width: 145px;
        }
      }
    }
  }
  .opres {
    padding: 20px 15px;
    text-align: center;
    & > .el-button {
      width: 150px;
    }
  }
}
</style>
