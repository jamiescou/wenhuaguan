<template>
  <section class="container index-container">
    <!--<img class="nav-menu-fixed" src="/images/navFixed.png" />-->
    <div class="searchbar">
      <div class="flex-item">
        <!-- <a class="cell fixed to-position" href="javascript:;"><span class="iconNew-location"></span>长沙</a> -->
        <nuxt-link to="/search" class="cell to-search">
          <i class="icon icon-search pull-left"></i>试试输入百姓舞台···
        </nuxt-link>
        <nuxt-link to="/zoe" class="cell fixed to-zoe">
          <span class="iconNew-mine"></span>我的
        </nuxt-link>
      </div>
    </div>
    <div class="swipe-loop" v-swiper:mySwiper="swiperOption">
      <div class="swiper-wrapper">
        <a class="swiper-slide" v-for="(banner,index) in looppic" :key="index" :href="banner.url" :style="`background:url('${banner.coverPic}') center;background-size:100% 100%`">
            <div class="char">
               <div class="titYi">{{banner.title}}</div>
            </div>
        </a>
      </div>
      <div class="j-loop swiper-pagination round-bullets"></div>
    </div>
    <!-- 菜单 START -->
    <!--<div class="nav-bar-wrapper">
      <div v-swiper:barSwiper="navSwiperOption">
        <div class="swiper-wrapper">
          <div class="swiper-slide">
            <div class="nav-bar">
              <nuxt-link to="/information" class="bar-menu">
                <img src="/images/issue.png" alt="文化资讯" class="menu-icon">
                <h4 class="menu-title">文化资讯</h4>
              </nuxt-link>
              <nuxt-link to="/heritage" class="bar-menu">
                <img src="/images/heritage.png" alt="非遗保护" class="menu-icon">
                <h4 class="menu-title">非遗保护</h4>
              </nuxt-link>
              <nuxt-link to="/vod" class="bar-menu">
                <img src="/images/vod.png" alt="百姓舞台" class="menu-icon">
                <h4 class="menu-title">百姓舞台</h4>
              </nuxt-link>
              <nuxt-link to="/exhibition" class="bar-menu">
                <img src="/images/exhibits.png" alt="数字展览" class="menu-icon">
                <h4 class="menu-title">数字展览</h4>
              </nuxt-link>
            </div>
            <div class="nav-bar">
              <nuxt-link to="/volunteer" class="bar-menu">
                <img src="/images/volun.png" alt="志愿服务" class="menu-icon">
                <h4 class="menu-title">志愿服务</h4>
              </nuxt-link>
              <nuxt-link to="/activity" class="bar-menu">
                <img src="/images/activity.png" alt="活动预约" class="menu-icon">
                <h4 class="menu-title">活动预约</h4>
              </nuxt-link>
              <nuxt-link to="/venue" class="bar-menu">
                <img src="/images/venue.png" alt="场馆预订" class="menu-icon">
                <h4 class="menu-title">场馆预订</h4>
              </nuxt-link>
              <nuxt-link to="/train" class="bar-menu">
                <img src="/images/train.png" alt="培训报名" class="menu-icon">
                <h4 class="menu-title">培训报名</h4>
              </nuxt-link>
            </div>
          </div>
          <div class="swiper-slide">
            <div class="nav-bar">
              <nuxt-link to="/team" class="bar-menu">
                <img src="/images/artteam.png" alt="文艺社团" class="menu-icon">
                <h4 class="menu-title">文艺社团</h4>
              </nuxt-link>
              <nuxt-link to="/brand" class="bar-menu">
                <img src="/images/brand.png" alt="文化品牌" class="menu-icon">
                <h4 class="menu-title">文化品牌</h4>
              </nuxt-link>
              <nuxt-link to="/collect" class="bar-menu">
                <img src="/images/collect.png" alt="作品征集" class="menu-icon">
                <h4 class="menu-title">作品征集</h4>
              </nuxt-link>
            </div>
          </div>
        </div>
        <div class="j-nav-bullets swiper-pagination round-bullets gray"></div>
      </div>
    </div>-->

    <div class="nav-bar-wrapper">
        <div class="swiper-container" v-swiper:barSwiper="navSwiperOption">
          <div class="swiper-wrapper">
            <div class="swiper-slide">
              <nuxt-link to="/information" class="bar-menu">
                <img src="/images/issue.png" alt="资讯" class="menu-icon">
                <h4 class="menu-title">资讯</h4>
              </nuxt-link>
            </div>
            <div class="swiper-slide">
              <nuxt-link to="/vod" class="bar-menu">
                <img src="/images/vod.png" alt="直播点播" class="menu-icon">
                <h4 class="menu-title">直播点播</h4>
              </nuxt-link>
            </div>
            <div class="swiper-slide">
              <nuxt-link to="/exhibition" class="bar-menu">
                <img src="/images/exhibits.png" alt="数字展览" class="menu-icon">
                <h4 class="menu-title">数字展览</h4>
              </nuxt-link>
            </div>
            <div class="swiper-slide">
              <nuxt-link to="/activity" class="bar-menu">
                <img src="/images/activity.png" alt="文化活动" class="menu-icon">
                <h4 class="menu-title">文化活动</h4>
              </nuxt-link>
            </div>
            <div class="swiper-slide">
              <nuxt-link to="/heritage" class="bar-menu">
                <img src="/images/heritage2.png" alt="文化非遗" class="menu-icon">
                <h4 class="menu-title">文化非遗</h4>
              </nuxt-link>
            </div>
            <div class="swiper-slide">
              <nuxt-link to="/venue" class="bar-menu">
                <img src="/images/venue2.png" alt="场馆预定" class="menu-icon">
                <h4 class="menu-title">场馆预定</h4>
              </nuxt-link>
            </div>
            <div class="swiper-slide">
              <nuxt-link to="/train" class="bar-menu">
                <img src="/images/train2.png" alt="培训报名" class="menu-icon">
                <h4 class="menu-title">培训报名</h4>
              </nuxt-link>
            </div>
            <div class="swiper-slide">
              <nuxt-link to="/volunteer" class="bar-menu">
                <img src="/images/volunteer.png" alt="志愿服务" class="menu-icon">
                <h4 class="menu-title">志愿服务</h4>
              </nuxt-link>
            </div>
          </div>
          <div class="j-nav-bullets swiper-pagination round-bullets gray"></div>
        </div>
    </div>
    <!-- 菜单 END -->
    <!--<div class="split"></div>-->
    <div class="panel">
      <nuxt-link class="panel-hd" tag="h4" to="/information">资讯<span class="pinyin">zixun</span></nuxt-link>
      <div class="panel-bd">
        <nuxt-link :to="`/information/${news.type}/${news.id}`" class="flex-item media-box border-bottom" style="padding: 0.42667rem 0;" v-for="(news,index) in informations" :key="'new_'+index">
          <div class="cell fixed media-object">
            <img :src="news.coverPic" onerror="this.onerror=null;this.src='/images/default.png'">
          </div>
          <div class="cell media-bd">
            <h4 class="media-title">{{news.title}}</h4>
            <div class="tagHollow clearfix">
              <span class="item">资讯</span>
            </div>
            <p class="media-info bottom">
              {{news.publishTime}}
            </p>
          </div>
        </nuxt-link>
      </div>
      <!--<div class="panel-ft">
        <nuxt-link to="/information">查看更多&nbsp;&nbsp;&rarr;</nuxt-link>
      </div>-->
    </div>
    <div class="split"></div>
    <div class="panel" style="padding-bottom: 0">
      <nuxt-link class="panel-hd" tag="h4" to="/vod">直播点播<span class="pinyin">zhibodianbo</span></nuxt-link>
      <div class="panel-bd card-col-2">
        <nuxt-link :to="`/vod/demand?id=${item.id}`" class="card card-syvod col-2" v-for="(item,index) in demands" :key="'demand_'+index">
          <div class="card-hd">
            <img :src="item.coverPic" onerror="this.onerror=null;this.src='/images/default.png'">
            <div class="tagBlack clearfix">
              <span class="item">轮播回看</span>
            </div>
          </div>
          <div class="card-bd">
            <h4 class="card-title">{{item.name}}</h4>
            <p class="card-info">时间：{{item.createTime}}</p>
          </div>
        </nuxt-link>
      </div>
      <!--<div class="panel-ft border-top">
        <nuxt-link to="/vod">查看更多&nbsp;&nbsp;&rarr;</nuxt-link>
      </div>-->
    </div>
    <div class="split"></div>
    <div class="panel" style="padding-bottom: 0;">
      <nuxt-link class="panel-hd" tag="h4" to="/exhibition">数字展览<span class="pinyin">shuzizhanlan</span></nuxt-link>
      <div class="panel-bd" style="padding-left: 0;padding-right: 0;">
        <nuxt-link :to="`/exhibition/${item.id}`" tag="div" class="card card-syact card-syexh" style="padding-bottom: 0" v-for="(item,index) in exhibits" :key="'exhibit_'+index">
          <div class="card-hd">
            <img :src="item.coverPic" onerror="this.onerror=null;this.src='/images/default.png'">
          </div>
          <div class="card-bd clearfix">
            <h4 class="card-title">{{item.title}}</h4>
          </div>
        </nuxt-link>
      </div>
      <!--<div class="panel-bd" style="padding-left: 0;padding-right: 0;">
        <nuxt-link :to="`/exhibition/${item.id}`" class="img-card" v-for="(item,index) in exhibits" :key="'exhibit_'+index">
          <img :src="item.coverPic" onerror="this.onerror=null;this.src='/images/default.png'">
          <h6 class="card-title">{{item.title}}</h6>
        </nuxt-link>
      </div>-->
      <!--<div class="panel-ft border-top">
        <nuxt-link to="/exhibition">查看更多&nbsp;&nbsp;&rarr;</nuxt-link>
      </div>-->
    </div>
    <div class="panel" style="padding-bottom: 0;">
      <h4 class="panel-hd">文化服务<span class="pinyin">wenhuafuwu</span></h4>
      <div class="panel-hdNav clearfix">
        <a class="item" :class="item.tag == culType ?'active':''" href="javascript:;" @click="culNavChange(item.tag)" v-for="(item, index) in culNavList" :key="'culNav_'+index">{{item.name}}</a>
      </div>
      <div class="panel-bd" style="padding-left: 0;padding-right: 0;" v-if="this.culType =='Activity'">
        <nuxt-link class="card card-syact" tag="div" :to="`/activity/${item.id}`" v-for="(item, index) in activitys" :key="'activitys_'+index">
          <div class="card-hd">
            <img :src="item.coverPic" onerror="this.onerror=null;this.src='/images/default.png'">
            <div class="endTag" v-if="item.signRemain.day">距报名结束<span>{{item.signRemain.day}}</span>天</div>
            <div class="endTag" v-if="!item.signRemain.day && item.signRemain.hour">距报名结束<span>{{item.signRemain.hour}}</span>小时</div>
            <div class="endTag" v-if="!item.signRemain.day && !item.signRemain.hour && item.signRemain.minute">距报名结束<span>{{item.signRemain.minute}}</span>分钟</div>
            <div class="tagBlack clearfix" v-if="item.activityType && item.activityType.length">
              <span class="item" v-for="tag in item.activityType" :key="tag" v-if="convertTypeActivity(tag)">{{convertTypeActivity(tag)}}</span>
            </div>
          </div>
          <div class="card-bd clearfix">
            <div class="pull-left">
              <h4 class="card-title">{{item.name}}</h4>
              <p class="card-info">时间：{{item.holdStartDate}}&nbsp;至&nbsp;{{item.holdEndDate}}</p>
              <p class="card-info">地址：{{item.address}}</p>
            </div>
            <div class="pull-right clearfix">
              <template v-if="item.reserve==1">
                <p class="card-info">余票：{{item.remainTicket}}/{{item.ticketSum}}</p>
                <div class="fOrder">{{item.reserveMsg}}</div>
              </template>
              <template v-else-if="item.reserve==2">
                <div class="fOrder">{{item.reserveMsg}}</div>
              </template>
              <template v-else>
                <div class="fOrder end">{{item.reserveMsg}}</div>
              </template>
            </div>
          </div>
        </nuxt-link>
      </div>
      <div class="panel-bd" style="padding-left: 0;padding-right: 0;" v-if="this.culType =='Venue'">
        <nuxt-link class="card card-syact" tag="div" :to="`/venue/${item.id}`" v-for="(item, index) in venues" :key="'venues_'+index">
          <div class="card-hd">
            <img :src="item.coverPic" onerror="this.onerror=null;this.src='/images/default.png'">
            <div class="tagBlack clearfix">
              <span class="item">{{item.enableName}}</span>
              <span class="item" v-if="convertTypeVenue(item.type)">{{convertTypeVenue(item.type)}}</span>
            </div>
          </div>
          <div class="card-bd clearfix">
            <h4 class="card-title">{{item.venue.name}}&minus; {{item.name}}</h4>
            <p class="card-info card-info-two">{{item.brief}}</p>
          </div>
        </nuxt-link>
      </div>
      <div class="panel-bd" style="padding-left: 0;padding-right: 0;" v-if="this.culType =='Train'">
        <nuxt-link class="card card-syact" tag="div" :to="`/train/${item.id}`" v-for="(item, index) in trains" :key="'trains_'+index">
          <div class="card-hd">
            <img :src="item.picture" onerror="this.onerror=null;this.src='/images/default.png'">
            <div class="endTag" v-if="item.signRemain.day">距报名结束<span>{{item.signRemain.day}}</span>天</div>
            <div class="endTag" v-if="!item.signRemain.day && item.signRemain.hour">距报名结束<span>{{item.signRemain.hour}}</span>小时</div>
            <div class="endTag" v-if="!item.signRemain.day && !item.signRemain.hour && item.signRemain.minute">距报名结束<span>{{item.signRemain.minute}}</span>分钟</div>
            <div class="tagBlack clearfix" v-if="item.artType && item.artType.length">
              <span class="item" v-for="tag in item.artType" :key="tag" v-if="convertTypeTrain(tag)">{{convertTypeTrain(tag)}}</span>
            </div>
          </div>
          <div class="card-bd clearfix">
            <div class="pull-left">
              <h4 class="card-title">{{item.title}}</h4>
              <p class="card-info">时间：{{item.enrolStartTime}}&nbsp;至&nbsp;{{item.enrolEndTime}}（报名时间）</p>
              <p class="card-info">地址：{{item.address}}</p>
            </div>
            <div class="pull-right clearfix">
              <template v-if="item.reserve==1">
                <p class="card-info">余票：{{item.remain}}/{{item.allLimitPeoples}}</p>
                <div class="fOrder">{{item.reserveMsg}}</div>
              </template>
              <template v-else>
                <div class="fOrder end">{{item.reserveMsg}}</div>
              </template>
            </div>
          </div>
        </nuxt-link>
      </div>
    </div>
    <!--<div class="split"></div>-->
  </section>
</template>


<script>
import axios from "axios";
import wechat from '~/util/wechat.js';

export default {
  mixins: [wechat],
  asyncData({ req, params, store }) {
    store.dispatch('setSearch', null)
    return axios.get('/').then((res) => {
      return res.data
    })
  },
  data() {
    return {
      looppic: [],
      swiperOption: {
        loop: true,
        autoplay: true,
        pagination: {
          el: '.j-loop',
          bulletActiveClass: 'bullet-active'
        }
      },
      navSwiperOption: {
        pagination: {
          el: '.j-nav-bullets',
          bulletActiveClass: 'bullet-active'
        },
        slidesPerView: 4,
        slidesPerGroup: 4
      },
      culNavList: [
        {
          name: '活动预约',
          tag: 'Activity'
        },
        {
          name: '场馆预约',
          tag: 'Venue'
        },
        {
          name: '培训报名',
          tag: 'Train'
        }
      ],
      culType: 'Activity',
    }
  },
  mounted() {
    this.shareOpts.title = '湖南省文化馆'
    this.shareOpts.desc = '湖南省文化馆是一个聚合中国传统、促进文化交流的互联网平台，它不仅提供全国一流的文化场馆信息，包含大量电影、曲艺、讲座、舞蹈、歌剧、等文化活动资讯，提供最热门的文化活动预订，建立最全的文化大师交流渠道，更能让用户足不出户的了解天下，参与云上文化活动，引领品质生活，从文化云开始'
    this.wechatInit()
  },
  methods: {
    convertTypeActivity(code) {
      let type = this.activityForm.find(item => item.code === code);
      if (type) {
        return type.value;
      }
    },
    convertTypeTrain(code) {
      let type = this.artists.find(item => item.code === code);
      if (type) {
        return type.value
      }
    },
    convertTypeVenue(code) {
      if (code) {
        let type = this.RoomTypes.find(item => item.code === code);
        if (type) {
          return type.value;
        }
      }
    },
    culNavChange: function(tag) {
      this.culType = tag;
    }
  }
}
</script>



<style scoped lang="scss">
@import "~static/styles/pages/index.scss";
</style>

