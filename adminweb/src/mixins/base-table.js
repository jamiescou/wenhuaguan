module.exports = {
    data() {
        return {
            dataList: [],
            page: 1,
            size: 15,
            total: 0,
            loading: false, // 加载标识
            doNotInit: false, // 是否需要初始化数据
            dictNames: [] // 表格中使用到的字典(名称)
        }
    },
    created() {
        this.initList();
        if (this.dictNames.length > 0) {
            for (let i = 0; i < this.dictNames.length; i++) {
                this.dicts.dictInit(this.dictNames[i]);
            }
        }
    },
    watch: {
        page: 'loadData' // 监控page的变化，page发生变化调用loadData
    },
    computed: {
        showPagination() {
            return !this.loading && this.total > this.size;
        }
    },
    methods: {
        /**
         * 获取请求参数 默认只传递index(页码) size(每页条数) 可以由调用方传递指定对象合并(或者覆盖)原参数
         * @param params
         * @returns {*}
         */
        getParams(params) {
            return Object.assign({
                index: this.page,
                size: this.size
            }, params)
        },
        /**
         * 跳转页面
         */
        onCurrentChange(page) {
            this.page = page;
        },
        /**
         * 推送到dataList中 因为vue的监听特性 只能用push进行数据的添加 如果有特殊处理 通过传递一个filter来过滤数据
         * @param dataList
         * @param filter
         */
        pushToList(list, filter) {
            list.forEach((item) => {
                if (typeof filter === 'function') {
                    this.dataList.push(filter(item))
                } else {
                    this.dataList.push(item)
                }
            })
        },
        /**
         * 初始化列表
         */
        initList() {
            this.dataList = [];
            if (!this.doNotInit) this.loadData();
        },
        closeLoading() {
            this.loading = false;
        },
        showLoading() {
            this.loading = true;
        },
        /**
         * @overwrite
         * 加载数据方法 用到该mixin的都应该重写该方法 否则无法实现加载数据
         */
        loadData() {
            // 每个列表自己的获取数据的方法需要重写
        }
    }
}
