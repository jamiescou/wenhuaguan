<template>
  <section class="container map-container">
    <a href="javascript:void(0)" @click="goProvince" v-show="mapType !== 'hn'" class="goProvince">回到全省</a>
    <div class="echart-wrapper" id="map"></div>
    <div class="block-heading clearfix">
      <h4 class="title pull-left">非遗名录项目</h4>
      <nuxt-link :to="`/heritage/resource?city=${city.name}&code=${city.code}`" class="more pull-right">
        <i class="icon icon-angle-left"></i>
      </nuxt-link>
    </div>
    <div class="statistic-content">
      <div class="col-4 v-line">
        <p class="emphasize">{{ statistic.project.countryCount||0 }}</p>
        <p>国家级</p>
      </div>
      <div class="col-4 v-line">
        <p class="emphasize">{{ statistic.project.provinceCount||0 }}</p>
        <p>省级</p>
      </div>
      <div class="col-4 v-line">
        <p class="emphasize">{{ statistic.project.cityCount||0 }}</p>
        <p>市级</p>
      </div>
      <div class="col-4">
        <p class="emphasize">{{ statistic.project.townCount||0 }}</p>
        <p>县级</p>
      </div>
    </div>
    <div class="split"></div>
    <div class="block-heading clearfix">
      <h4 class="title pull-left">代表性传承人</h4>
      <nuxt-link :to="`/heritage/resource?type=successor&city=${city.name}&code=${city.code}`" class="more pull-right">
        <i class="icon icon-angle-left"></i>
      </nuxt-link>
    </div>
    <div class="statistic-content">
      <div class="col-4 v-line">
        <p class="emphasize">{{ statistic.successor.countryCount||0 }}</p>
        <p>国家级</p>
      </div>
      <div class="col-4 v-line">
        <p class="emphasize">{{ statistic.successor.provinceCount||0 }}</p>
        <p>省级</p>
      </div>
      <div class="col-4 v-line">
        <p class="emphasize">{{ statistic.successor.cityCount||0 }}</p>
        <p>市级</p>
      </div>
      <div class="col-4">
        <p class="emphasize">{{ statistic.successor.townCount||0 }}</p>
        <p>县级</p>
      </div>
    </div>
    <div class="split"></div>
  </section>
</template>
<script>
import axios from 'axios';
let getDpr;
let echarts;
if (process.browser) {
  // 引入 ECharts 主模块
  echarts = require('echarts/lib/echarts');
  require('echarts/lib/chart/map');
  getDpr = function getDpr() {
    var dpr = document.getElementsByTagName("html")[0].getAttribute('data-dpr');
    if (dpr == 2 || dpr == 3) {
      return {
        titleSize: 32,
        labelSize: 24,
        emphasisSize: 28
      };
    } else {
      return {
        titleSize: 18,
        labelSize: 14,
        emphasisSize: 16
      }
    }
  };
}
export default {
  head: {
    title: '非遗地图'
  },
  data() {
    return {
      map: null,
      city: {
        name: '',
        code: ''
      },
      mapType: 'hn',
      mapFontSize: null,
      mapOptions: {
        title: {
          text: '',
          left: 'center',
          bottom: '30',
          textStyle: {
            color: '#333'
          }
        },
        series: [{
          type: 'map',
          id: 'hnmap',
          selectedMode: 'single',
          aspectScale: 0.9,
          label: {
            normal: {
              show: true,
              textStyle: {
                color: '#444',
                fontWeight: 'bold',
                fontSize: 14,
              }
            },
            emphasis: {
              textStyle: {
                color: '#fff',
                fontWeight: 'bold',
                fontSize: 16,
              }
            }
          },
          itemStyle: {
            normal: {
              borderColor: '#fff',
              borderWidth: 1,
              areaColor: '#ef9298',
            },
            emphasis: { // 鼠标hover样式
              areaColor: '#e94e58',
              borderWidth: 1
            }
          },
          animation: false
        }]
      }
    }
  },
  async asyncData({ params, error }) {
    let statistic = await axios.get("/heritageMap");
    return {
      statistic: statistic.data
    };
  },
  methods: {
    async goProvince() {
      this.setOption('hn');
      let statistic = await axios.get('/heritageMap');
      this.statistic = statistic.data;
      ;
    },
    async showCityData() {
      if (this.mapType === 'hn') {
        this.setOption();
      }
      let statistic = await axios.get("/heritageMap?city=" + this.city.code);
      this.statistic = statistic.data;
      ;
    },
    async setOption(mapType) {

      let res = await axios.get('/mapdata', { params: { regionType: mapType == 'hn' ? 'province' : 'city', region: this.city ? this.city.name : '' } })

      let data = res.data.data;
      let mapPrp = res.data.prop;
      if (mapType === 'hn') {
        this.mapOptions.title.text = '湖南省非物质文化遗产';
        this.mapType = 'hn';
        // data = hunan; //  hunan ---> mapdata.js 中定义
      } else {
        this.mapOptions.title.text = this.city.name + '非物质文化遗产';
        this.mapType = this.city.code;
        // data = hunanCounty[this.city.name]; //  hunanCounty ---> mapdata.js 中定义
      }
      this.mapOptions.series[0].mapType = this.mapType;
      this.mapOptions.series[0].data = mapPrp;
      echarts.registerMap(this.mapType, data);
      this.map.setOption(this.mapOptions);
    }
  },
  mounted() {
    let _this = this;
    this.$nextTick(() => {
      _this.mapFontSize = getDpr();
      _this.map = echarts.init(document.getElementById("map"));
      // _this.mapOptions.series[0].data = mapPrp;    // mapPrp ---> mapdata.js 中定义
      _this.mapOptions.title.textStyle.fontSize = _this.mapFontSize.titleSize;
      _this.mapOptions.series[0].label.normal.textStyle.fontSize = _this.mapFontSize.labelSize;
      _this.mapOptions.series[0].label.emphasis.textStyle.fontSize = _this.mapFontSize.labelSize;
      _this.setOption('hn');

      _this.map.on('click', function(param) {
        _this.city.name = param.name;
        _this.city.code = param.value;
        _this.showCityData();
      });
    });
  }
};
</script>
<style lang="scss" scoped>
@import "~static/styles/pages/heritage.scss";
</style>