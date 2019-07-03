<template>
    <div class="list-wrapper">
        <v-pageheader :breadcrumbs="[{ name: '漂浮广告管理' }]"></v-pageheader>
        <div class="table-container" style="margin:10px;">
            <el-button type="primary" @click="handleAdd">添加</el-button>
        </div>
        <div class="table-container">
            <el-table :data="dataList" border stripe v-loading.body="loading">
             <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>

                <el-table-column prop="name" label="标题"></el-table-column>
                <el-table-column label="广告图">
                    <template scope="scope">
                        <div v-if="scope.row.coverPic" @click="showImg(scope.row)" class="event-pic">
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="url" label="链接地址URL" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="state" label="状态">
                     <template scope="scope">
                        <el-switch v-model="scope.row.state" on-text="启用" off-text="停用" :on-value="true" :off-value="false" @change="handleLock(scope.row)"></el-switch>
                     </template>
                </el-table-column>
                <el-table-column label="操作" width="300px" align="center">
                     <template scope="scope">
                          <a class="btn-act" @click="handleEdit(scope.row)">编辑</a>
                          <a class="btn-act" @click="handleDel(scope.row)">删除</a>
                     </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container ">
                <v-pagination @pageChange="onCurrentChange" :total="total" :isShow="showPagination"></v-pagination>
            </div>
        </div>

        <el-dialog title="封面图片" v-model="eventPicDialog">
            <el-carousel :initial-index="carouselObj.initialIndex" :autoplay="false" class="event-pic-carousel" :arrow="(carouselObj.items && carouselObj.items.length)?'always':'never'">
                <el-carousel-item v-for="(item,pIndex) in carouselObj.items" :key="pIndex">
                    <img :src="item" :alt="'封面图片'+ pIndex">
                </el-carousel-item>
            </el-carousel>
        </el-dialog>
    </div>
</template>

<script>
import BaseTable from '@/mixins/base-table';
import vRules from '@/config/validate_rules';
import Api from '@/api';
export default {
    mixins: [BaseTable],
    data() {
        return {
            searchForm: { name: '' },
            title: '',
            dataList: [],
            areaOption: [],
            flag: '',
            nounsPic: '',
            eventPicDialog: false,
            viewForm: {},
            carouselObj: {
                initialIndex: 0,
                currentEvent: '',
                items: []
            },
            rules: {
                name: [vRules.required,vRules.maxLen(40)]
            }
        };
    },
    methods: {
        // 数据加载
        loadData() {
            let name = this.searchForm.name;
            let str = "" ;
            if (name !== '') str += 'name~' + name;
            str +='&sort=createTime~desc';
            this.showLoading();
            Api.system.getAdvertList(str, this.page, this.size).then((res) => {
                this.dataList = res.content;
                this.total = res.totalElements;
            }).finally(this.closeLoading);
        },
        // 添加文化品牌
        handleAdd() {
            this.$router.push({ path: 'advert_add', query: { flag: 'add' } });
        },
        digitinfos(index, row) {
          this.$router.push({ path: 'digitinfos_list', query: { id: row.id } })
        },

        // 删除广告
        handleDel(row) {
            //Api.system.delAdvert(row.id).then(this.callback);
             let self = this;
            self.delConfirm('漂浮广告', () => {
                Api.system.delAdvert(row.id).then(self.callback);
            });
        },

        // 编辑文化品牌
        handleEdit(row) {
            this.$router.push({ path: 'advert_add', query: { id: row.id, flag: 'edit' } });
        },

       _ShowTip(msg, type = 'success') {
            this.$message({
                message: msg,
                type: type
            });
        },
        // 启用及停用
        handleLock(row) {
            if (row.state) {
                Api.system.advertContentTrue(row.id).then((res) => {
                    this._ShowTip('操作成功')
                }).catch(err=>{
                  row.state = false;
                });
            } else {
                Api.system.advertContentFalse(row.id).then((res) => {
                    this._ShowTip('操作成功')
                });
            }
        },
        callback() {
            this.showTip();
            this.loadData();
        },
        // 显示封面大图
        showImg(row) {
            let id = row.id;
            if (this.carouselObj.currentEvent !== id) {
                this.carouselObj.items = [];
                this.carouselObj.currentEvent = id;
                // for (let i = 1; i < 4; i++) {
                if (row.coverPic) {
                    this.carouselObj.items[0] = Api.system.getFileUrl(row.coverPic);
                    // this.carouselObj.items[i - 1] = '';
                    // if (row['pictrue' + i]) {
                    //     this.carouselObj.items[i - 1] = row['pictrue' + i];
                    // } else {
                    //     let index = i;
                    //     Api.safe.fetchEventPic(id, index).then((res) => {
                    //         let imgSrc =  Api.system.getFileUrl(res.coverPic);
                    //         this.$set(row, 'pictrue' + index, imgSrc);
                    //         this.carouselObj.items[index - 1] = imgSrc;
                    //     });
                    // }
                    // }
                }
            }
            this.eventPicDialog = true;
        }
    },
    mounted() {
    }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
