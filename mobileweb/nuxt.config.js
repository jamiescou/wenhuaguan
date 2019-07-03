module.exports = {
    head: {
        // title: '湖南省文化馆',
        titleTemplate: '%s - 湖南省文化馆',
        meta: [
            { charset: 'utf-8' },
            { 'http-equiv': 'Content-Type', content: 'text/html; charset=utf-8' },
            { name: 'renderer', content: 'webkit' },
            { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge, chrome=1' },
            { name: 'format-detection', content: 'telephone=no' },
            { name: 'format-detection', content: 'email=no' },
            { name: 'apple-mobile-web-app-capable', content: 'yes' },
            { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
            { hid: '文化馆', name: 'description', content: '文化云、湖南省文化馆' },
            { name: 'hotcss', content: 'max-width=750' } // , initial-dpr=1
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        ],
        script: [
            { src: '/js/hotcss.js' },
            // { src: "https://cdn.jsdelivr.net/hls.js/latest/hls.min.js" },
            {src: "https://cdn.jsdelivr.net/npm/clappr@latest/dist/clappr.min.js"},
            { src: "/js/socket.io.js", },
            { src: 'https://res.wx.qq.com/open/js/jweixin-1.2.0.js' }
      ]
    },
    performance: {
        prefetch: false
    },
    render: {
        resourceHints: false,
    },
    loading: { color: '#3B8070' },
    router: {
        linkActiveClass: 'active-link',
        scrollBehavior: function(to, from, savedPosition) {
            return { x: 0, y: 0 }
        }
    },
    build: {
        analyze: false,
        // babel: {
        //     plugins: [
        //       ['component', [{
        //             libraryName: 'mint-ui',
        //             style: true
        //       }]]
        //     ]
        // },
        vendor: ['axios', 'mint-ui'],
        extend(config, { isDev, isClient }) {
            if (isClient) {
                // 拓展 webpack 配置
                config.entry['polyfill'] = ['babel-polyfill']
                config.module.rules.push({
                    enforce: 'pre',
                    test: /\.(js|vue)$/,
                    loader: 'eslint-loader',
                    exclude: /(node_modules)/
                })
            }
        }
    },
    plugins: [
        { src: '~plugins/axios' },
        { src: '~/plugins/components.js' },
        { src: '~plugins/swiper.js', ssr: false },
        { src: '~plugins/UI.js', ssr: true },
        { src: '~plugins/nuxt-video-player-plugin.js', ssr: false }
  ],
    css: [
        'swiper/dist/css/swiper.css',
        'mint-ui/lib/style.css',
        'video.js/dist/video-js.css',
        'vue-video-player/src/custom-theme.css',
        {
            src: 'static/styles/base/base.scss',
            lang: 'scss?indentedSyntax=true'
      }
    ]
}
