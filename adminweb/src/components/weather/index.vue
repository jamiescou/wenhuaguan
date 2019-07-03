<template>
  <section class="jumbotron">
    <div class="aw-weather-head">
      <div class="aw-weather-maininfo" v-if="windInfo">
        <p class="temp-line">
          <span class="aw-weather-currentTemp">
            <span class="aw-current-temp">{{cityWeather.wendu}}</span>
            <span class="aw-weather-current-unit">℃</span>
          </span>
          <span class="aw-weather-animate-icon">
            <span :class="classType"></span>
          </span>
          <span class="aw-weather-currentWeather">{{weatherType || '未知'}}</span>
        </p>
        <div class="aw-weather-wind-info">
          <div class="aw-weather-wind c-line-clamp1">
            <span>今天：</span>
            <span class="aw-weather-temp-range c-gap-right">{{temperatureScope}}</span>
            <span class="aw-weather-wind-dir">{{windInfo.dir || '未知'}}</span>
            <!-- <span>{{windInfo.lv.replace(/^\<!\[CDATA\[/g,'').replace(/\]\]\>/g,'') || '未知'}}</span> -->
          </div>
        </div>
        <div class="aw-weather-prompt">
          <span class="aw-weather-prompt-text">{{cityWeather.ganmao}}</span>
        </div>
        <!-- <div class="aw-weather-abs">
                    <div class="btn-24h-toggle c-gap-right" @click="rippleAction($event)" ref="btn24htoggle"> 24小时
                        <span class="aw-weather-24-span">预报</span>
                        <span class="c-gap-left-small" :class="[show ? 'icon-circle-up' : 'icon-circle-down']"></span>
                    </div>
                </div> -->
      </div>
    </div>
  </section>
</template>

<script>
import Axios from 'axios';
import { weatherType2Icon } from "./weathertype2icon";
import { ripple } from "./ripple";
export default {
  data() {
    return {
      cityWeather: {
        yesterday: {},
        city: '',
        aqi: '',
        forecast: undefined,
        ganmao: '',
        wendu: ''
      },
      show: false
    }
  },
  computed: {
    // 今天的最高温和最低温
    temperatureScope() {
      if (!this.cityWeather.forecast) return;
      // 提取数字
      let highTmp = this.cityWeather.forecast[0].high.match(/[1-9](?:\d{0,2})(?:,\d{3})*|0/)[0];
      let lowTmp = this.cityWeather.forecast[0].low.match(/[1-9](?:\d{0,2})(?:,\d{3})*|0/)[0];

      return lowTmp + '~' + highTmp + '°C';
    },
    // 根据天气类型设置天气图标
    classType() {
      if (!this.cityWeather.forecast) return;
      return weatherType2Icon(this.cityWeather.forecast[0].type);
    },
    // 天气类型
    weatherType() {
      if (!this.cityWeather.forecast) return;

      return this.cityWeather.forecast[0].type;
    },
    // 风向风力
    windInfo() {
      if (!this.cityWeather.forecast) return false;
      let obj = {};
      obj.lv = this.cityWeather.forecast[0].fengli;
      obj.dir = this.cityWeather.forecast[0].fengxiang;

      return obj;
    }
  },
  methods: {
    // 根据城市代码请求相应城市的天气信息
    getWeatherByCity(city) {
      // let URL = "/WeatherApi?citykey=101010100";
      let URL = "http://wthrcdn.etouch.cn/weather_mini?city=" + city;
      return Axios.get(URL);
    },
    rippleAction(e) {
      this.show = !this.show;
      this.$nextTick(() => {
        ripple(e.currentTarget, e);
      });
    }

  },
  created() {
    let city = '长沙'
    this.getWeatherByCity(city).then((res) => {
      this.cityWeather = res.data.data;
    })
  }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
@import "./wticon.scss";
/**
 * 变量、函数定义区
 */
$shadow-1_5: 1.5px 1.5px 0 rgba(0, 0, 0, 0.23);
$shadow-1: 1px 1px 0 rgba(0, 0, 0, 0.23);
$duration: 0.3s;
@mixin icon-position($left: 68px, $top: -98px) {
  left: $left;
  top: $top;
}

// =================================================
.jumbotron {
  //   color: #fff;
  padding: 0 0 0.08rem;
  position: relative;
  .aw-weather-maininfo {
    // margin-top: .1rem;
    position: relative;
    .temp-line {
      position: relative;
      padding: 45px 0px 20px;
      .aw-weather-currentTemp {
        text-shadow: $shadow-1_5;
        position: relative;
        left: 0.02rem;
        font-size: 0.85rem;
        bottom: 0.02rem;
        font-family: "HelveticaNeue-Thin";
        .aw-current-temp {
          font-family: Ostrich Sans;
          font-size: 1.5rem;
          letter-spacing: 0.07rem;
        }
        .aw-weather-current-unit {
          text-shadow: $shadow-1;
          font-family: Ostrich Sans;
          //   position: absolute;
          //   top: 20px;
          font-size: 0.2rem;
          font-weight: 100;
        }
      }
      .aw-weather-currentWeather {
        text-shadow: $shadow-1_5;
        position: relative;
        left: 0rem;
        bottom: 0.08rem;
        font-size: 2.5rem;
        font-weight: 700;
      }
      .aw-weather-animate-icon {
        margin-left: 0.3rem;
        display: inline-block;
        transform: scale(0.6);
        top: 0.1rem;
        left: 0.95rem;
        .sunny {
          @include icon-position(130px, -120px);
        }
        .cloudy {
          @include icon-position(130px, -98px);
        }
        .rainy {
          @include icon-position(130px, -98px);
        }
        .rainbow {
          @include icon-position(130px, -98px);
        }
        .starry {
          @include icon-position(130px, 0);
        }
        .stormy {
          @include icon-position(130px, -98px);
        }
        .snowy {
          @include icon-position(130px, -98px);
        }
        .cloudy2sunny {
          @include icon-position(130px, -110px);
        }
        .sandstorm {
          @include icon-position(130px, -98px);
        }
      }
    }
    .aw-temp-switch {
      width: 0.65rem;
      height: 0.22rem;
      top: 0.08rem;
      right: 0.12rem;
      position: absolute;
      margin: 0.1rem auto;
      input {
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
        filter: alpha(opacity=0);
        -moz-opacity: 0;
        opacity: 0;
        z-index: 10;
        position: absolute;
        width: 100%;
        height: 100%;
        cursor: pointer;
      }
      label {
        display: block;
        width: 80%;
        height: 100%;
        position: relative;
        // background: #1F2736;
        background: linear-gradient(
          rgba(225, 225, 225, 0.8),
          rgba(225, 225, 225, 0.6)
        );
        border-radius: 30px 30px 30px 30px;
        box-shadow: inset 0 3px 8px 1px rgba(0, 0, 0, 0.2),
          inset 0 1px 0 rgba(0, 0, 0, 0.2), 0 1px 0 rgba(255, 255, 255, 0.2);
        // border: 1px solid rgba(0, 0, 0, .1);
        transition: all $duration ease;
        i {
          display: block;
          height: 0.2rem;
          width: 0.2rem;
          position: absolute;
          left: 2px;
          top: 2px;
          z-index: 0;
          border-radius: inherit;
          background: #283446;
          background: linear-gradient(#fff, #a1a1a1);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1),
            0 0 8px rgba(0, 0, 0, 0.13), 0 12px 12px rgba(0, 0, 0, 0.12);
          transition: all $duration ease;
        }
      }
      span {
        content: "";
        display: inline-block;
        position: absolute;
        width: 18px;
        height: 18px;
        font-size: 0.25rem;
        border-radius: 10px;
        // background: #283446;
        // background: gradient-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5));
        // box-shadow: inset 0 1px 0 rgba(0,0,0,0.2), 0 1px 0 rgba(255,255,255,0.1), 0 0 10px rgba(185,231,253,0), inset 0 0 8px rgba(0,0,0,0.9), inset 0 -2px 5px rgba(0,0,0,0.3), inset 0 -5px 5px rgba(0,0,0,0.5);
        transition: all $duration ease;
        z-index: 2;
        &.icon-Celsius {
          left: -0.33rem;
          top: 0;
        }
        &.icon-Fahrenheit {
          color: rgba(185, 231, 253, 0.3);
          right: -0.09rem;
          top: 0;
        }
      }
      // toggle
      input:checked ~ label + .icon-Celsius {
        content: "";
        display: inline-block;
        position: absolute;
        transition: all $duration ease;
        z-index: 2;
        // background: #b9f3fe;
        // background: gradient-gradient(#ffffff, #77a1b9);
        color: rgba(185, 231, 253, 0.3);
        // box-shadow: inset 0 1px 0 rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 10px rgba(100, 231, 253, 1), inset 0 0 8px rgba( 61, 157, 247, 0.8), inset 0 -2px 5px rgba(185, 231, 253, 0.3), inset 0 -3px 8px rgba(185, 231, 253, 0.5);
      }
      input:checked ~ .icon-Fahrenheit {
        color: #fff;
      }
      input:checked ~ label i {
        left: auto;
        left: 63%;
        // box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 0 8px rgba(0, 0, 0, 0.3), 0 8px 8px rgba(0, 0, 0, 0.3), inset -1px 0 1px #b9f3fe;
        transition: all $duration ease;
      }
    }
    .aw-weather-wind-info {
      position: relative;
      margin-left: 0.05rem;
      text-shadow: $shadow-1;
      .aw-weather-wind {
        margin-top: 0.06rem;
        font-size: 1rem;
      }
    }
    .aw-weather-prompt {
      margin-top: 1rem;
      padding: 0.04rem 0.1rem;
      border-radius: 3px;
      background: hsla(0, 0%, 100%, 0.1);
      overflow: hidden;
      font-size: 0.1rem;
      line-height: 1.5;
    }
    .aw-weather-abs {
      position: relative;
      margin-top: 0.15rem;
      texr-shadow: 0 1px 0 rgba(0, 0, 0, 0.23);
      .btn-24h-toggle {
        display: inline-block;
        padding: 0.04rem 0.1rem;
        border-radius: 3px;
        background: hsla(0, 0%, 100%, 0.1);
        overflow: hidden;
        position: relative;
      }
    }
  }
}
</style>
