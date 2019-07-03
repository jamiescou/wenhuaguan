<template>
    <!--<div @click.stop.prevent="toggleFavorite">
        <i class="icon icon-collect" :class="{'active':currentValue}"></i>
        {{favoriteText}}
    </div>-->
   
    <div @click.stop.prevent="toggleFavorite">
    	<span class="iconNew" :class="{'iconNew-collect':!currentValue, 'iconNew-collectOn':currentValue}"><span class="path1"></span><span class="path2"></span></span>{{favoriteText}}
    </div>
    
</template>

<script>
import axios from "axios";
export default {
    props: {
        value: {
            type: Boolean,
            default: false
        },
        favType: {
            type: String
        },
        objectId: {
            type: String
        }
    },
    computed: {
        favoriteText() {
            return this.currentValue ? '已收藏' : '收藏';
        }
    },
    data() {
        return {
            currentValue: this.value
        }
    },
    watch: {
        value(val) {
            this.currentValue = val
        }
    },
    methods: {
        async toggleFavorite(event) {
           
            // 收藏需要用户登录
            if (!this.$store.state.user) {
                this.$router.push({ path: "/login", query: { redirect: this.$route.fullPath } });
                return;
            }

            if (this.currentValue) {
                // 取消收藏
                let { data } = await axios.post("/favorite/cancel", { objectId: this.objectId });
                if (data === '') {
                    this.currentValue = false;
                }
            } else {
                let favoriteInfo = {
                    type: this.favType,
                    objectId: this.objectId
                };

                let { data } = await axios.post("/favorite/add", favoriteInfo);
                if (data.id) {
                    this.currentValue = true;
                }
            }
            this.$emit('input', this.currentValue)
        }
    }
}
</script>