<template>
    <section class="upload-wrapper" @touchmove.prevent>
        <input class="upload-input" type="file" ref="imgUpload" @change="handleChange">
        <div class="preview" @drop="preventDefault" @dragleave="preventDefault" @dragover="preventDefault" @dragenter="preventDefault" @click.stop.prevent="handleClick">
            <slot></slot>
        </div>
    </section>
</template>


<script>
import { toastMixin } from '~/components/mixins';
export default {
    mixins: [toastMixin],
    data() {
        return {
            sourceFile: '' // 原始文件
        }
    },
    methods: {
        preventDefault(e) {
            e.preventDefault();
            return false;
        },
        handleClick(e) {
            this.$refs.imgUpload.click();
        },
        handleChange(event) {
            const files = event.target.files || event.dataTransfer.files;

            if (!files) return;
            this.changeFiles(files);
            this.$refs.imgUpload.value = null;
        },
        changeFiles(files) {
            let that = this;
            let postFiles = Array.prototype.slice.call(files);
            postFiles = postFiles.slice(0, 1);
            if (postFiles.length === 0) { return; }

            let file = postFiles[0];
            const before = this.beforeChecking(file);
            if (before) {
                let reader = new FileReader();
                reader.onloadend = function() {
                    // that.cropImg = reader.result;
                    that.$emit('loadimg', reader.result);
                }
                this.sourceFile = file;
                reader.readAsDataURL(file);
                this.$emit('changeFiles', this.sourceFile);
            }
        },
        // 格式等验证
        beforeChecking(file) {
            const isImage = ['image/jpeg', 'image/gif', 'image/png'].some(type => type === file.type);
            const isLt2M = file.size / 1024 / 1024 < 5;
            let msg = '';

            // 仅限图片
            if (!isImage) {
                msg = '仅限jpg,png,gif格式的图片';
            }
            if (!isLt2M) {
                msg = '上传图片大小不能超过 5MB!';
            }
            let valid = (isImage && isLt2M)
            if (!valid) {
                this.showMsg(msg);
            }
            // this.$emit('onError', msg);
            return valid;
        }
    },
    mounted() {
    },
    destroyed() {
    }
}
</script>
<style lang="scss" scoped>
@import "~static/styles/components/cropper-img";
</style>