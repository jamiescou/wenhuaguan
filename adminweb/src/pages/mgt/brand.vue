<template>
    <div class="list-wrapper">
        <v-pageheader :breadcrumbs="[{ name: '文化品牌管理' }]"></v-pageheader>
        <div class="right-opers">
            <el-button type="primary" @click="handleAdd">添加文化品牌</el-button>
        </div>
        <div class="table-container">
            <section class="search-wrapper">
                <el-form :inline="true" :model="searchForm" label-width="0">
                    <el-form-item>
                        <el-input v-model="searchForm.name" placeholder="文化品牌名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="loadData">查询</el-button>
                    </el-form-item>
                </el-form>
            </section>
        </div>
        <div class="table-container">
            <el-table :data="dataList" border stripe v-loading.body="loading">
                <el-table-column prop="name" label="品牌名称">
                    <template scope="scope">
                        <router-link :to="{path:'brandview', query: {id: scope.row.id,flag:1}}" class="u-link">
                            {{scope.row.name}}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column label="封面图片">
                    <template scope="scope">
                        <div v-if="scope.row.coverPic" @click="showImg(scope.row)" class="event-pic">
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="brief" label="简介" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="isPublish" label="状态">
                    <template scope="scope">
                        <span>{{scope.row.isPublish? '已上架':'未上架'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="300px" align="center">
                    <template scope="scope">
                        <a class="btn-act" @click="edit(scope.$index, scope.row)"v-if="scope.row.isPublish !== true">编辑</a>
                        <a class="btn-act" @click="publish(scope.$index, scope.row)">{{scope.row.isPublish?'下架':'上架'}}</a>
                        <a class="btn-act" @click="digitinfos(scope.$index, scope.row)">品牌资源</a>
                        <a class="btn-act" @click="del(scope.$index, scope.row)"v-if="scope.row.isPublish !== true">删除</a>
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
            Api.system.getBrandList(str, this.page, this.size).then((res) => {
                this.dataList = res.content;
                this.total = res.totalElements;
            }).finally(this.closeLoading);
        },
        // 添加文化品牌
        handleAdd() {
            this.$router.push({ path: 'brandadd', query: { flag: 'add' } });
        },
        digitinfos(index, row) {
          this.$router.push({ path: 'digitinfos_list', query: { id: row.id } })
        },
        // 删除文化品牌
        del(index, row) {
            let self = this;
            self.delConfirm('文化品牌', () => {
                Api.system.delBrand(row.id).then(self.callback);
            });
        },
        // 编辑文化品牌
        edit(index, row) {
            this.$router.push({ path: 'brandadd', query: { id: row.id, flag: 'edit' } });
        },
        // 上下架
        publish(index, row) {
            let msg = row.isPublish ? '是否确认下架？' : '确认上架？';
            this.$confirm(msg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then((res) => {
                if (row.isPublish) {
                    Api.system.setBrandUnPublish(row.id).then(this.callback);
                } else {
                    Api.system.setBrandPublish(row.id).then(this.callback);
                }
            });
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
