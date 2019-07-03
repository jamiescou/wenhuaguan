import axios from "axios";
const IndicatorMixin = {
    methods: {
        showLoading(title = '加载中...') {
            this.$indicator.open({
                text: title
            });
        },
        closeLoading() {
            this.$indicator.close();
        }
    },
    beforeDestroy() {}
}
const toastMixin = {
    methods: {
        /**
         * 提示
         * 
         * @param {any} msg 
         * @param {any} type 提示类型 success info warning error
         * @param {any} icon 
         */
        showMsg(msg, type, icon, position = 'middle') {
            this.$toast({
                message: msg,
                className: 'toast-tip ' + (type ? ' is-' + type : ''),
                iconClass: (icon && 'icon icon-' + icon),
                position: position,
                duration: 3000
            });
        },
        // 拨打电话
        callPhone(phone) {
            this.$messagebox.confirm("确定拨打" + phone + "？")
                .then(action => {
                    window.location.href = "tel:" + phone;
                })
                .catch(() => {});
        },
        confirm(msg, callback) {
            this.$messagebox.confirm(msg)
                .then(action => {
                    callback();
                })
                .catch(() => {});
        }
    }
}

const paginationMixin = {
    data() {
        return {
            dataList: [],
            totalPages: 0,
            totalElements: 0,
            loadPath: '',
            search: '',
            page: 0,
            loaded: false // 初始化
        }
    },
    methods: {
        async loadData(pageNo = 0) {
            this.$indicator.open();
            this.page = pageNo;
            let url = this.loadPath + pageNo + (this.search ? '?' + this.search : '');

            let { data } = await axios.get(url)
            let DataList = data.content;
            if (pageNo === 0) {
                this.dataList = DataList;
                // this.dataList = listCover(this.dataList, DataList, 'id'); // 根据Id，更新现有数据集
            } else {
                this.dataList = this.dataList.concat(DataList);
            }
            this.totalPages = data.totalPages;
            this.totalElements = data.totalElements;
            this.loaded = true;
            this.$indicator.close();
        },
        // 加载更多
        handleLoadMore() {
            if (this.totalPages === 0 || this.totalPages === (this.page + 1)) {
                this.$refs.loadMore.forceUpdate()
            } else {
                this.page += 1;
                setTimeout(() => {
                    this.loadData(this.page);
                }, 400);
            }
        },
        // 刷新
        async handleRefresh() {
            await this.loadData(0);
            this.$refs.loadMore.forceUpdate()
        }
    },
    watch: {
        dataList() {
            setTimeout(() => {
                this.$refs.loadMore.forceUpdate(true)
            }, 20)
        }
    }
}
export {
    IndicatorMixin,
    toastMixin,
    paginationMixin
}
