<template>
    <div class="detail-item" :class="{'align-start':(type==='image' || type==='rich' || type ==='custom')}">
        <label class="label-title">{{label}}：</label>
        <div class="label-content" :class="{'img-content':type==='image'}">
            <template v-if="type==='text'">
                {{currentValue}}
            </template>
            <template v-if="type==='image'">
                <transition name="fade">
                  <img  :src="currentValue" :alt="label" class="detail-img" v-if="currentValue&&currentValue!==''">
               
                    <!-- <img src="static/images/default.png" v-else class="detail-img"> -->
                </transition>
                <!-- <img src="static/images/default.png" v-show="!currentValue" class="default-imag"> -->
            </template>
            <template v-if="type==='rich'">
                <div v-html="currentValue"></div>
            </template>
            <template v-if="type==='custom'">
                <slot>
                </slot>
            </template>
        </div>
             
    </div>
</template>

<script>
 
 
export default {
 
    props: {
        label: {
            type: String
        },
        value: {
            type: [String, Number],
            default: ''
        },
        type: {
            type: String,
            default: 'text'
        }
    },
    data() {
        return {
            dialogVisible: false,
            currentValue: this.value
            
        }
    },
  
    watch: {
        value() {
            this.setCurrentValue();
        }
    },
    methods: {
       
        setCurrentValue() {
            this.$nextTick(() => {
                if (this.value === this.currentValue) return;
                this.currentValue = this.value;
            });
        }
    },
   
    update() {
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
@import '../../styles/mixin.scss';
.detail-item {
    // position: relative;
    display: flex;
    width: 100%;
    font-size: 14px;
    margin-bottom: 8px;
    align-items: center;
    @include clearfix;
    &.align-start {
        align-items: flex-start;
    }
    .label-title {
        flex: 0 0 100px;
        width: 100px;
        line-height: 20px;
        padding: 20px 0;
        text-align: center;
        background-color: #f3f5f7;
        color: #07111b;
        font-weight: 700;
        float: left;
        box-sizing: border-box;
        word-break: break-all;
    }
    .label-content {
        flex: 1;
        max-width: 100%;
        margin-left: 8px;
        min-height: 20px;
        line-height: 20px;
        padding: 20px 10px 20px 22px;
        border-bottom: 1px solid #ddd;
       
    }
    .img-content {
        position: relative;
        padding-top: 10px;
        .detail-img {
            opacity: 1;
            z-index: 1;
            &.fade-enter-active,
            &.fade-leave-active {
                transition: all .5s;
            }
            &.fade-enter,
            &.fade-leave-active {
                opacity: 0;
            }
        }
        // .default-imag{
        //     position: absolute;
        //     top:0;
        //     z-index:0;
        // }
    }
}
</style>