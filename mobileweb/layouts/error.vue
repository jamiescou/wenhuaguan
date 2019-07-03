<template>
    <section class="container error-container">
        <template v-if="error.statusCode === 404">
            <div class="icon icon-404"></div>
            <h2 class="info">{{message}}</h2>
            <nuxt-link to="/" class="btn link">返回首页</nuxt-link>
        </template>
        <div v-else-if="isChunkLoadingFailed" class="other-error">
            <img src="/images/lose.png" alt="">
            <h2 class="info">数据加载失败，将自动刷新页面</h2>
            <span class="u-hint">如未自动刷新，请手动刷新重试</span>
        </div>
        <div v-else class="other-error">
            <img src="/images/no-result.png" alt="">
            <h1 class="title">{{error.statusCode}}</h1>
            <h2 class="info">{{ error.message }}</h2>
        </div>
    </section>
</template>
<script>
export default {
    props: ['error'],
    computed: {
        message() {
            let msg = '您访问的页面被抓走了！';
            if (this.error.response && this.error.response.data) {
                msg = this.error.response.data;
            }
            return msg;
        }
    },
    data() {
        return {
            isChunkLoadingFailed: false
        }
    },
    mounted() {
        if (this.error.statusCode === 500 && /^Loading chunk (\d)+ failed\./.test(this.error.message)) {
            this.isChunkLoadingFailed = true
            setTimeout(() => {
                window.location.href = window.location.href + "?id=" + 10000 * Math.random();
            }, 3 * 1000);
        }
    }
}
</script>

<style scoped lang="scss">
@import "~static/styles/libs/px2rem.scss";
.error-container {
  min-height: 100%;
  min-height: 100vh;
  text-align: center;
  background: #fff;
  .icon {
    display: block;
    margin: 0 auto;
    text-align: center;
    font-size: px2rem(400);
  }
  .u-hint {
    color: #999;
    text-align: center;
  }
  .other-error {
    padding-top: 30%;
  }
}

.info {
  text-align: center;
  font-weight: 300;
  font-size: px2rem(30);
  color: #666;
  margin: px2rem(40) 0 0;
}
</style>
