import axios from "axios";
const favMixin = {
    middleware: "auth",
    data() {
        return {
            loaded: false,
            totalPages: 0,
            dataList: [],
            page: 0
        }
    },
    watch: {
        dataList() {
            setTimeout(() => {
                this.$refs.loadMore.forceUpdate(true)
            }, 20)
        }
    },
    methods: {
        async delHandle(item, index) {
            this.$messagebox.confirm("确定删除该收藏吗？")
                .then(async action => {
                    await this.favoriteCancel(item, index);
                })
                .catch(() => {});
        },
        async favoriteCancel(item, index) {
            let { status, data } = await axios.post("/favorite/cancel", { objectId: item.objectId });
            if (status === 200) {
                this.$toast({
                    message: "取消成功",
                    position: "middle",
                    duration: 3000
                });
                this.dataList.splice(index, 1);
            }
        },
        async loadData(pageNo) {
            
            let { data } = await axios.get('/favorite/' + this.type + '?page=' + pageNo)
            let DataList = data.content;
            console.log(DataList);
            if (pageNo === 0) {
                this.dataList = DataList; // 根据Id，更新现有数据集
            } else {
                this.dataList = this.dataList.concat(DataList);
            }
            this.totalPages = data.totalPages;
        },
        // 加载更多
        handleLoadMore() {
            if (this.totalPages === 0 || this.totalPages === (this.page + 1)) {
                this.$refs.loadMore.forceUpdate()
            } else {
                this.page += 1;
                this.loadData(this.page);
            }
        },
        // 刷新
        async handleRefresh() {
            await this.loadData(0);
            this.$refs.loadMore.forceUpdate()
        }
    },
    beforeDestroy() {}
}
export default favMixin
