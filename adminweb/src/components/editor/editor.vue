<template>
    <div ref="editor" class="richeditor">
    </div>
</template>

<script>
/* eslint-disable */
// import '@/assets/ueditor/ueditor.config';
// import '@/assets/ueditor/ueditor.all.min';
// import '@/assets/ueditor/lang/zh-cn/zh-cn';
// import '@/assets/ueditor/ueditor.parse.min';

export default {
    data() {
        return {
            editor: null,
            id: Math.random().toString(16).substring(2) + 'ueditorId',
            isReady: false,
            isInit: false
        };
    },
    props: {
        disabled: Boolean,
        value: {
            type: String,
            default: null
        },
        config: {
            type: Object,
            default() {
                return {
                    initialFrameWidth: null,
                    initialFrameHeight: 320,
                    elementPathEnabled: false,
                    topOffset: 50,
                    zIndex: 200
                };
            }
        }
    },
    watch: {
        value(val, oldVal) {
            if (val && this.isReady && !this.isInit && val !== this.editor.getContent()) {
                this.editor.setContent(val)
                this.isInit = true
            }
        },
        disabled(val) {
            if (this.editor && val) {
                this.editor.setDisabled();
            }
        }
    },
    mounted() {
        const _this = this;
        _this.$refs.editor.id = _this.id;
        this.initContent();
    },
    methods: {
        getUEContent() { // 获取内容方法
            return this.editor.getContent()
        },
        setContent(value) {
            if (this.isReady && value) {
                this.editor.setContent(value)
            }
        },
        initContent() {
            this.$nextTick(function init() {
                // 保证 this.$el 已经插入文档
                this.editor = UE.getEditor(this.id, this.config);

                this.editor.ready(() => {
                    if (this.disabled) {
                        this.editor.setDisabled();
                    }
                    this.editor.setContent(this.value);

                    this.editor.addListener("contentChange", () => {
                        const content = this.editor.getContent()
                        this.$emit('input', content)
                    })

                    this.$emit('ready', this.editor)
                    this.isReady = true

                });
            }.bind(this));
        }
    },
    beforeDestroy() {
        // 组件销毁的时候，要销毁 UEditor 实例
        if (this.editor !== null && this.editor.destroy) {
            this.editor.destroy();
        }
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.richeditor {
  line-height: 1.5;
}
</style>
