<template>
    <section class="container research-container">
        <v-nodata msg="此活动没有发布问卷调查" v-if="(!items || !items.length) && loaded"></v-nodata>
        <template v-else>
            <div class="question" v-for="(item,index) in items" :key="index">
                <div class='title'>{{index+1}}、{{item.title}}</div>
                <div class='question-content' v-if='item.type=="single"'>
                    <mt-radio class="page-part" v-model="item.answer" :options="item.contents" />
                </div>
                <div class='question-content' v-else-if='item.type=="multiple"'>
                    <mt-checklist v-model="item.answer" :options="item.contents">
                    </mt-checklist>
                </div>
                <div class='question-content' v-else-if='item.type=="question"'>
                    <textarea rows="4" v-model="item.answer" class="textarea" :readonly="answerStatus"></textarea>
                </div>
            </div>

            <footer class="footer pre-footer" ref="footWrapper">
                <div class="operations">
                    <mt-button class="btn" v-if="!answerStatus" @click='handleConfirm'>提交</mt-button>
                    <mt-button class="btn end">你已参与</mt-button>
                </div>
            </footer>
        </template>

    </section>
</template>

<script>
import axios from "axios";
import { toastMixin } from '~/components/mixins';
export default {
    middleware: 'auth',
    mixins: [toastMixin],
    head: {
        title: '问卷调查'
    },
    data() {
        return {
            id: '',
            items: [],
            answerStatus: false,
            loaded: false
        }
    },
    async mounted() {
        const id = this.$route.query.id
        let research = await axios.get("/activity/research/" + id)
        this.$nextTick(() => {
            research = research.data;
            let answerStatus = research.status;
            let dataList = [];
            let answersResearch = answerStatus ? research.answersResearch : null;
            if (research && research.isPublished) {
                dataList = research.items.map((item) => {
                    let index = -1;
                    if (answerStatus) {
                        index = answersResearch.titles.findIndex(x => x == item.title);
                    }
                    if (item.type === 'multiple') {
                        item.answer = [];
                        if (index !== -1) {
                            item.answer = answersResearch.results[index].split(',');
                        }
                    } else {
                        item.answer = '';
                        if (index !== -1) {
                            item.answer = answersResearch.results[index];
                        }
                    }

                    if (item.type === 'multiple' || item.type === 'single') {
                        item.contents = item.contents.map((x, index) => {
                            return {
                                label: x,
                                value: index + '',
                                disabled: answerStatus
                            }
                        })
                    }
                    return item;
                })
            }

            this.id = id
            this.items = dataList
            this.answerStatus = answerStatus
            this.loaded = true;
        });
    },
    methods: {
        async handleConfirm() {
            if (!this.$store.state.user) {
                this.$router.push({ path: '/login', query: { redirect: this.$route.fullPath } })
                return;
            }
            let answers = [];
            for (let i = 0; i < this.items.length; i++) {
                const element = this.items[i];
                if (element.answer === '' || element.answer.length == 0) {
                    this.showMsg('请对“' + ++i + '”作答');
                    return;
                }

                if (element.type === 'multiple') {
                    answers.push(element.answer.join());
                } else {
                    answers.push(element.answer);
                }
            }

            let titles = this.items.map(x => x.title);
            let answerObj = {
                titles: titles,
                results: answers
            }

            let { data } = await axios.post('/activity/research/' + this.id, answerObj)
            if (data.success) {
                this.showMsg('提交成功');
                this.$router.push('/activity/' + this.id);
            } else {
                this.showMsg('提交失败');
            }
        }
    }
}
</script>

<style type="text/css" lang="scss" scoped>
@import "~static/styles/pages/activity.scss";
</style>