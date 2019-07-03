import Vue from 'vue'
if (process.browser) {
// const videojshls = require('videojs-contrib-hls/dist/videojs-contrib-hls');
//  Vue.use(videojshls)

const VueVideoPlayer = require('vue-video-player/dist/ssr')
 Vue.use(VueVideoPlayer)


}
 
