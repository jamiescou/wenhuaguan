<template>
  <section class="container comment-container">
    <!-- 资讯 -->
    <div class="flex-item media-box detail" v-if="type==='information'">
      <div class="cell media-bd">
        <h4 class="media-title">{{detail.title}}</h4>
        <p class="media-info bottom">
          {{detail.publishTime}}&nbsp;&nbsp;&sdot;&nbsp;&nbsp;{{detail.source}}
        </p>
      </div>
      <div class="cell fixed media-object">
        <img :src="detail.coverPic" onerror="this.onerror=null;this.src='/images/default.png'">
      </div>
    </div>
    <!-- 非遗（项目、继承人、保护区） -->
    <div class="flex-item media-box detail" v-if="type==='isheritage'">
      <div class="cell media-bd">
        <h4 class="media-title">{{detail.name}}</h4>
        <p class="media-info bottom" v-if="detail.level">
          {{ detail.levelName }}&nbsp;&nbsp;&sdot;&nbsp;&nbsp;{{detail.batchName}}
        </p>
      </div>
      <div class="cell fixed media-object">
        <img :src="detail.coverPic" onerror="this.onerror=null;this.src='/images/default.png'">
      </div>
    </div>
    <!-- 展览 -->
    <div class="flex-item media-box detail" v-if="type==='exhibition'">
      <div class="cell fixed media-object left">
        <img :src="detail.coverPic" onerror="this.onerror=null;this.src='/images/default.png'">
      </div>
      <div class="cell  media-bd">
        <h4 class="media-title">{{detail.title}}</h4>
        <p class="media-info bottom brief">
          {{ detail.brief }}
        </p>
      </div>
    </div>
    <!-- 文化品牌 -->
    <div class="flex-item media-box detail" v-if="type==='brand'">
      <div class="cell fixed media-object left">
        <img :src="detail.coverPic" onerror="this.onerror=null;this.src='/images/default.png'">
      </div>
      <div class="cell  media-bd">
        <h4 class="media-title">{{detail.name}}</h4>
        <p class="media-info bottom brief">
          {{ detail.brief }}
        </p>
      </div>
    </div>
    <!-- 活动 -->
    <div class="flex-item media-box detail" v-if="type==='activity'">
      <div class="cell fixed media-object left">
        <img :src="detail.coverPic" onerror="this.onerror=null;this.src='/images/default.png'">
      </div>
      <div class="cell  media-bd">
        <h4 class="media-title">{{detail.name}}</h4>
        <div class="media-info">
          <p>
            <i class="icon icon-clock"></i>{{detail.holdStartDate}}</p>
          <p>
            <i class="icon icon-position"></i>{{detail.address}}</p>
        </div>
      </div>
    </div>
    <!-- 志愿者 -->
    <div class="flex-item media-box detail" v-if="type==='volunteer'">
      <div class="cell fixed media-object left">
        <img :src="detail.coverPic" onerror="this.onerror=null;this.src='/images/default.png'">
      </div>
      <div class="cell  media-bd">
        <h4 class="media-title">{{detail.name}}</h4>
        <div class="media-info">
          <p>
            <i class="icon icon-clock"></i>{{detail.startTime}}</p>
          <p>
            <i class="icon icon-position"></i>{{detail.address}}</p>
        </div>
      </div>
    </div>
    <!-- 活动室 -->
    <div class="flex-item media-box detail" v-if="type==='venueroom'">
      <div class="cell fixed media-object left">
        <img :src="detail.coverPic" onerror="this.onerror=null;this.src='/images/default.png'">
      </div>
      <div class="cell  media-bd">
        <h4 class="media-title">{{detail.venue.name}}&minus; {{detail.name}}</h4>
        <p class="media-info bottom brief">
          {{ detail.brief }}
        </p>
      </div>
    </div>
    <!-- 培训 -->
    <div class="flex-item media-box detail" v-if="type==='train'">
      <div class="cell fixed media-object left">
        <img :src="detail.picture" onerror="this.onerror=null;this.src='/images/default.png'">
      </div>
      <div class="cell  media-bd">
        <h4 class="media-title">{{detail.title}}</h4>

        <div class="media-info">
          <i class="icon icon-calendar"></i> {{detail.startDate}}&nbsp;-&nbsp;{{detail.endDate}}
        </div>
      </div>
    </div>
    <!-- 点播 -->
    <div class="flex-item media-box detail" v-if="type==='demand'">
      <div class="cell media-bd">
        <h4 class="media-title">{{detail.name}}</h4>
        <p class="media-info bottom">
          {{detail.createTime}}
        </p>
      </div>
      <div class="cell fixed media-object">
        <img :src="detail.coverPic" onerror="this.onerror=null;this.src='/images/default.png'">
      </div>
    </div>

    <div class="split"></div>
    <div class="comments">
      <div class="block-heading">
        <h4 class="title">评论(共{{totalElements}}条)</h4>
      </div>
      <v-loadmore ref="loadMore" @pullUpLoad="handleLoadMore" @pullDownRefresh="handleRefresh">
        <div class="comment-list">
          <v-nodata v-if="loaded && !dataList.length" msg="暂无评论"></v-nodata>
          <template v-else>
            <div class="comment border-bottom" v-for="item in dataList" :key="'comment_'+item.id">
              <div class="flex-item">
                <div class="cell fixed">
                  <img :src='item.pic' :alt="item.pic" onerror="this.onerror=null;this.src='/images/portrait.png'" class="avatar" />
                </div>
                <h4 class="cell nickname">{{item.nickname}}</h4>
                <span class="cell  fixed time">{{item.time}}</span>
              </div>
              <p class="c-content">{{item.content}}</p>
            </div>
          </template>
        </div>
      </v-loadmore>
    </div>
    <footer class="footer" ref="footWrapper">
      <div class="foot-content" @click="showDialog">
        <span>在这里说点什么吧...</span>
      </div>
      <transition name="fold">
        <div class="comment-eidt" v-show='isShow'>
          <textarea rows="8" class="form-textarea" v-model="commentContent" maxlength="500"></textarea>
          <mt-button class="btn" size="large" @click="submitComment">提交</mt-button>
        </div>
      </transition>
    </footer>
    <v-overlayer v-model="isShow"></v-overlayer>
  </section>
</template>
<script>
import axios from "axios";
import loadmore from '~/components/loadmore';
import { toastMixin, paginationMixin } from '~/components/mixins';
import rules from '~/util/validateRules';
export default {
  head: {
    title: '评论列表'
  },
  mixins: [toastMixin, paginationMixin],
  components: {
    'v-loadmore': loadmore
  },
  async asyncData({ params, error, req, query }) {
    let type = query.type;
    let id = params.id;
    let detail = await axios.get('/' + type + '/detail/' + id);
    return {
      id: id,
      type: type,
      detail: detail.data
    };
  },

  data() {
    return {
      type: '',
      id: '',
      isShow: false,
      commentContent: ''
    }
  },
  async created() {
    this.loadPath = '/comments/' + this.type + '/' + this.id + '/';
    await this.loadData(0);
  },
  computed: {
    isheritage() {
      let heritageType = ['project', 'successor', 'protection', 'demand'];
      return heritageType.some(item => item === this.type);
    }
  },
  methods: {
    showDialog() {
      if (!this.$store.state.user) {
        this.$router.replace({ path: "/login", query: { redirect: this.$route.fullPath } });
        return;
      }
      this.isShow = true;
    },
    async submitComment() {
      if (!rules.required(this.commentContent, '请输入评论内容！')) return false;
      if (!rules.checkLen(this.commentContent, 500, '最多输入500个字')) return false;
      let data = {
        content: this.commentContent,
        type: this.type,
        objId: this.id
      };
      let res = await axios.post('/comment', data);
      if (res.status === 200 && res.data.error) {
        this.showMsg(res.data.error);
      } else if (res.data.id) {
        this.showMsg('评论已提交，审核中');
        this.commentContent = '';
        this.isShow = false;
      } else {
        this.showMsg('评论提交失败');
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~static/styles/pages/_comment.scss";
</style>