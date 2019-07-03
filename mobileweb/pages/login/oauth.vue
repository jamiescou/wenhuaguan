<template>
  <div></div>
</template>
<script>
import axios from 'axios';
import { toastMixin } from '~/components/mixins';
function getUrlParam(param) {
  const reg = new RegExp('(^|&)' + param + '=([^&]*)(&|$)')
  const result = window.location.search.substr(1).match(reg)

  return result ? decodeURIComponent(result[2]) : null
}

export default {
  mixins: [toastMixin],
  head: {
    title: `loading`
  },
  async beforeMount() {
    const url = window.location.href
    const { status, data } = await axios.get('/wechat/oauth?url=' + encodeURIComponent(url));
    if (data.success) {
      let res = await this.$store.dispatch('wxlogin', { uid: data.data.unionid })
      if (res.success) {
        const paramsArr = getUrlParam('state').split('_')
        const visit = paramsArr.length === 1 ? `/${paramsArr[0]}` : `/${paramsArr[0]}?id=${paramsArr[1]}`
        this.$router.replace(visit)
      } else if (!res.success && res.state === 401) {
        await this.$store.dispatch('setWeAuth', data.data)
        this.$router.replace('/zoe/chooseBind');
      } else {
        throw new Error('用户信息获取失败')
      }
    } else {
      throw new Error('用户信息获取失败')
    }
  }
}
</script>
