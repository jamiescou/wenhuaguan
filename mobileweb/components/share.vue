<template>
<div>
	<div class="fBtn" @click="share"><span class="iconNew iconNew-share"></span>分享</div>
	<!-- 分享 -->
    <div class="background-fx" style="position: fixed;top: 0px;left: 0px;width: 100%;height: 100%;z-index: 110;display: none;" v-show="shareData" @click="share">
		<img src="/images/fx-bg.png" style="width: 100%;height: 100%;" />
	</div>
	<mt-popup v-model="popupVisible" class="wechat-popup">请在微信浏览器中打开</mt-popup>
</div>
</template>

<script>
import { Popup } from 'mint-ui';
export default {
	components: {
	    'mt-popup': Popup
	},
	data() {
		return {
			shareData: false,
      		popupVisible: false
		}
	},
	methods: {
		//判断是否是微信浏览器
	    is_weixin() {
			var ua = navigator.userAgent.toLowerCase();
			if(ua.match(/MicroMessenger/i)=="micromessenger") {
				return true;
		 	} else {
				return false;
			}
		},
	    // 分享
	    share() {
	    	if(this.is_weixin()) {
	    		this.shareData = !this.shareData;
	    	} else {
	    		this.popupVisible = true;
	    	}
	    }
	}
}
</script>

<style lang="scss" scoped>

</style>