<template>
  <section class="container vod-detail">
    <div class="card base-info live-base-info">

      <div class="card-hd" id='video-c'>
        <div id="my-video" class="video" preload="auto" autoplay data-setup="{}"></div>
      </div>

      <div class="card-bd">
        <h4 class="card-title"> {{detail.name}}
          <span class="smsg" id='liveSpan'>({{msg}})</span>
        </h4>
        <div class="card-scan"><span class="iconNew-scan"></span>{{detail.pageView}}</div>
        <p class="card-info">
          视频分类：{{detail.artistTypeNames}}
        </p>
      </div>

    </div>
    <div class="split"></div>

    <mt-navbar v-model="currentTab" ref='contentWrapper'>
      <mt-tab-item id="chat">聊天室</mt-tab-item>
      <mt-tab-item id="brief">直播介绍</mt-tab-item>
      <mt-tab-item id="detail" v-if="detail.content">直播详情</mt-tab-item>
    </mt-navbar>

    <mt-tab-container v-model="currentTab" :style="{height:chartHeight+'px'}" class="live-tab-content">
      <mt-tab-container-item id="chat" class="video-content chat">

        <div class="comment border-bottom live-comt" v-for='(item,index) in msg_list' :key="index">
          <div class="flex-item">
            <div class="cell fixed">
              <img :src='item.headImg' :alt="item.headImg" onerror="this.onerror=null;this.src='/images/portrait.png'" class="avatar" />
            </div>
            <p class="cell nickname">{{item.userName}}</p>
            <span class="cell  fixed time">{{item.time}}</span>
          </div>
          <p class="c-content">{{item.msg}}</p>
        </div>

      </mt-tab-container-item>
      <mt-tab-container-item id="brief">
        <div class="video-content">{{ detail.brief }}</div>
      </mt-tab-container-item>
      <mt-tab-container-item id="detail" v-if="detail.content">
        <div v-html="detail.content" class="video-content"></div>
      </mt-tab-container-item>
    </mt-tab-container>

    <footer class="footer live-comment" ref="footWrapper">
      <div class="flex-item">
        <div class="cell">
          <mt-field class="txtinput" placeholder="点击输入评论内容" v-model="current_msg"></mt-field>
        </div>
        <div class="cell fixed btn" @click="submitComments">发送</div>
      </div>
    </footer>

  </section>
</template> 
<script>
import axios from "axios";
import { toastMixin } from '~/components/mixins';
import moment from 'moment';
import wechat from '~/util/wechat.js';

export default {
  mixins: [toastMixin, wechat],
  head() {
    return {
      title: '百姓舞台'
    }
  },
  data() {
    return {
      currentTab: 'chat',
      detail: {},
      itval: '',
      over: false,
      msg: '',
      chartHeight: 10000,
      socket: null,
      current_msg: '',
      previewIndex: 0,
      msg_list: [],
      type: '',
      swiperOption: {
        lazyLoading: true,
        slidesPerView: 2.5
      },
      chatInfo: [],
    };
  },
  async asyncData({ params, error, query, req, route }) {

    let detailInfo = await axios.get('/live/detail/' + query.id);
    return {
      type: 'live',
      detail: detailInfo.data.data,
    };

  },
  created() {

  },

  mounted() {
    //  <video id="my-video" class="video" preload="auto" controls autoplay data-setup="{}"></video>

    //  var ovideo=  document.createElement('video');
    //  ovideo.id='my-video';
    //  ovideo.class='video';
    //  ovideo.preload='auto';

    //  document.getElementById('video-c').appendChild(ovideo);

    const _this = this;
    this.$nextTick(() => {
      let rect = this.$refs.contentWrapper.$el.getBoundingClientRect()
      let footer = this.$refs.footWrapper.getBoundingClientRect();
      this.chartHeight = footer.top - rect.bottom;
    })
    var dateNow = new Date();
    var vodStartT = new Date(this.detail.startTime);
    var vodEndT = new Date(this.detail.endTime);
    var video = document.getElementById('my-video');
    video.controls = true;
    if (dateNow < vodStartT) {
      this.msg = '直播开始时间：' + moment(vodStartT).format('YYYY-MM-DD HH:mm');
      var video = document.getElementById('my-video');
      if (this.detail.curDrama) { this.playPreview(this.detail.curDrama.file); }
      video.addEventListener("ended", this.nextVideo);
      var interval = setInterval(function() { //播放视频,到了直播时间，立刻切换直播地址
        var d = new Date();
        if (d > vodStartT) {
          _this.initPlay();
          clearInterval(interval);
        }
      }, 10000)

    } else {
      _this.initPlay();
    }
    this.socket = io.connect('ws://' + window.location.host + '?roomid=' + this.detail.id);
    this.socket.on('message', function(msg) {
      let d = new Date();
      msg.time = new moment().format('YYYY-MM-DD HH:mm:ss');
      _this.msg_list.unshift(msg);
    });
    this.shareOpts.imgUrl = this.detail.coverPic;
    this.shareOpts.title = this.detail.name;
     this.wechatInit()
  },
  methods: {
    submitComments() {
      if (!this.$store.state.user) {
        this.$router.replace({ path: "/login", query: { redirect: this.$route.fullPath } });
        return;
      } else {
        if (this.current_msg == '') {
          this.showMsg('请输入评论内容');
          return;
        }
        else {
          this.socket.emit('message', JSON.stringify({
            msg: this.current_msg,
            roomId: this.detail.id,
            userName: this.$store.state.user.nickname,
            headImg: this.$store.state.user.pic
          }))
        }
        this.current_msg = '';
      }
    },

    playPreview(path) {
      // var video = document.getElementById('my-video');
      // video.src = path;
      // video.play();

  let video = document.getElementById("my-video");
      if (video) {
        if (this.player) { this.player.destroy(); }
        this.player = new Clappr.Player({
          source: path,
          poster: this.detail.coverPic,
          parentId: "#my-video",
          width: '100%',
          // height: '10rem',
          autoPlay: true
        });
      this.player.on(Clappr.Events.PLAYER_ENDED, this.nextVideo); 
      }

    },

    startPlay(filePath) {
      var video = document.getElementById('my-video');
      if (video) {
        if (this.player) { this.player.destroy(); }
        this.player = new Clappr.Player({
          source: filePath,
          poster: this.coverPic,
          parentId: "#my-video",
          width: '100%',
          //  height: '10rem',
          autoPlay: true,
          events: {
            onError: function() {
              // _this.msg = "直播中断";
              // alert('error');
            }
          }
        });
      }
      // if (Hls.isSupported()) {
      //   var hls = new Hls();
      //   hls.loadSource(filePath);
      //   hls.attachMedia(video);
      //   hls.on(Hls.Events.MANIFEST_PARSED, function() {
      //     video.play();
      //   });
      // } else if (video.canPlayType('application/x-mpegURL')) {
      //   video.src = filePath;
      //   video.addEventListener('canplay', function() {
      //     video.play();
      //   });
      // }
    },

    initPlay() {
      let _this = this;
      this.setVideoStatus(this.detail);
      this.getVodInfo();
      this.itval = setInterval(function() {
        _this.getVodInfo();
      }, 10000)
    },

    /**@argument
     * 播放下一个预告片
     */
    nextVideo() {
      this.previewIndex = (this.previewIndex + 1) >= this.detail.dramas.length ? 0 : ++this.previewIndex;
      var vodc = this.detail.dramas[this.previewIndex];
      this.playPreview(vodc.file);
    },
    setVideoStatus() {
      if (this.detail.isOver) {
        if (this.detail.enablePayback == true) {
          this.msg = '直播回放中...';
          this.playPreview(this.detail.file);
        } else {
          this.msg = '直播已结束...';
        }
      }
      else {
        this.msg = '直播中...';
        this.startPlay(this.detail.viewPath);
      }
    },
    async getVodInfo() {
      let detailInfo = await axios.get('/live/detail/' + this.detail.id + '?loading=false');
      this.detail = detailInfo.data.data;
      if (this.detail.isOver == this.over) { return; }
      else {
        this.over = !this.over;
        this.setVideoStatus();
      }
    }
  },
  destroyed() {
    clearInterval(this.itval);
  }
};
</script>
<style lang="scss" scoped>
@import "~static/styles/pages/vod.scss";
</style>