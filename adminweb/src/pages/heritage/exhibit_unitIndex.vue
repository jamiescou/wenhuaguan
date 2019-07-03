<template>
    <div class="list-wrapper">
        <v-pageheader :breadcrumbs="[{to:'index', name: '展厅管理' },{name:'展厅单元管理'}]"></v-pageheader>
        <section class="search-wrapper">
            <el-form :inline="true" label-width="0">
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">添加展厅单元</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="back">返回</el-button>
                </el-form-item>
            </el-form>
        </section>
        <div class="table-container">
            <el-table :data="dataList" border stripe v-loading.body="loading">
                <el-table-column prop="name" label="展厅名称"></el-table-column>
                <el-table-column prop="type" label="非遗类型" :formatter="typeFormatter"></el-table-column>
                <el-table-column prop="brief" label="简介"></el-table-column>
                <el-table-column label="操作" width="500px" align="center">
                    <template scope="scope">
                      <a class="btn-act" @click="view(scope.$index, scope.row)">查看</a>
                      <a class="btn-act" @click="edit(scope.$index, scope.row)">编辑</a>
                      <a class="btn-act" @click="handleWork(scope.$index, scope.row)">单元作品管理</a>
                      <a class="btn-act" @click="del(scope.$index, scope.row)">删除</a>

                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-dialog :title="title" :visible.sync="dialogFormVisible">
            <el-form ref="unitForm" :model="unitForm" :rules="rules" label-position="right" label-width="100px" class="m-form">
                <el-row :gutter="20">
                    <el-form-item label="单元名称" prop="name">
                        <el-input v-model="unitForm.name" :disabled="isDisable"></el-input>
                    </el-form-item>
                    <el-form-item label="封面图片：" prop="coverPic">
                        <v-cropper class="cover" :imgUrl="coverPic" btnTxt="点击选择封面" :upload="handleUpload" remove="removeImg"></v-cropper>
                    </el-form-item>
                    <el-form-item label="非遗类型" prop="type">
                        <el-checkbox-group v-model="unitForm.type">
                            <v-checkbox typeName="heritageType"></v-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="简介" prop="brief">
                        <el-input type="textarea" v-model="unitForm.brief"></el-input>
                    </el-form-item>
                </el-row>
                <div class="form-opres" style="text-align:center">
                    <el-button @click="dialogFormVisible=false" class="u-btn">取消</el-button>
                    <el-button @click="submitForm" type="primary" class="u-btn">确定</el-button>
                </div>
            </el-form>
        </el-dialog>

        <el-dialog title="查看" :visible.sync="viewFormShow">
            <el-form ref="viewForm" :model="viewForm" label-position="right" label-width="100px" class="m-form" v-if="viewFormShow">
                <v-detailItem label="单元名称" :value="viewForm.name"></v-detailItem>
                <v-detailItem label="图片" type="image" :value="viewForm.coverPic"></v-detailItem>
                <v-detailItem label="非遗类型" :value="viewForm.type"></v-detailItem>
                <v-detailItem label="简介" :value="viewForm.brief"></v-detailItem>
                <div class="form-opres" style="text-align:center">
                    <el-button @click="viewFormShow=false" class="u-btn">关闭</el-button>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import vRules from '@/config/validate_rules';
import Api from '@/api';
const DIALOG = {
    add: { title: '添加展厅单元', flag: 'Add' },
    edit: { title: '编辑展厅单元', flag: 'Edit' }
};
export default {
    data() {
        return {
            dialogFormVisible: false,
            viewFormShow: false,
            loading: false,
            isDisable: false,
            flag: '',
            title: '',
            coverPic: '',
            id: '',
            mid: '',
            heritageExhi:{id:''},
            dataList: [],
            unitForm: {
              type: [],
              heritageExhi:{id:''}
              },
            viewForm: {},
            rules: {
                'name': [vRules.required]
            }
        }
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        callback() {
            this.dialogFormVisible = false;
            this.getData();
        },
        handleWork(index, row) {
          this.$router.push({ path: 'exhibitworksindex', query: { mid: row.id } });
        },
        /**
       * 上传封面图
       */
        handleUpload(formData) {
            Api.system.uploadFile(formData, 'pic').then((res) => {
                this.unitForm.coverPic = res.url;
            })
        },
        // 删除图片
        removeImg() {
            this.unitForm.coverPic = '';
        },
        // 添加
        handleAdd() {
            this.title = DIALOG.add.title;
            this.flag = DIALOG.add.flag;
            this.unitForm = { type: [],heritageExhi:{id:this.mid} };
            this.isDisable = false;
            this.dialogFormVisible = true;
        },
        // 编辑
        edit(index, row) {
            this.coverPic = Api.system.getFileUrl(row.coverPic);
            this.unitForm = JSON.parse(JSON.stringify(row));
            this.title = DIALOG.edit.title;
            this.flag = DIALOG.edit.flag;
            this.isDisable = true;
            this.dialogFormVisible = true;
        },
        // 提交
        submitForm() {
            this.$refs['unitForm'].validate((valid) => {
                if (valid) {
                    if (this.flag === DIALOG.add.flag) {
                        Api.heritage.addExhibitUnit(this.unitForm).then(this.callback);
                    } else if (this.flag === DIALOG.edit.flag) {
                        Api.heritage.modifyExhibitUnit(this.unitForm.id, this.unitForm).then(this.callback);
                    }
                }
            });
        },
        // 删除
        del(index, row) {
            let self = this;
            self.delConfirm('展厅单元', () => {
                Api.heritage.delExhibitUnitList(row.id).then((res) => {
                    self.getData();
                });
            });
        },
        // 查看
        view(index, row) {
            row = JSON.parse(JSON.stringify(row));
            row.coverPic = Api.system.getFileUrl(row.coverPic);
            if (row.type) {
                let artType = [];
                for (let item of row.type) {
                    if(this.dicts.getValueByCode('heritageType', item))
                    artType.push(this.dicts.getValueByCode('heritageType', item));
                }
                row.type = artType.join('、');
            }
            this.viewForm = row;
            this.viewFormShow = true;
        },
        // 查询
        getData() {
            this.loading = true;
            let str = 'heritageExhi.id:' + this.mid;
            Api.heritage.getExhibitUnitList(str,1, -1).then((res) => {
                this.dataList = res.content;
            }).finally(this.loading = false);
        },
        // 类型转译
        typeFormatter(row, column, cellValue) {
            let artType = [];
            for (let item of cellValue) {
                if(this.dicts.getValueByCode('heritageType', item))
                artType.push(this.dicts.getValueByCode('heritageType', item));
            }
            return artType.join('、');
        }
    },
    mounted() {       
        this.mid = this.$route.query.id;
        this.id = this.$route.query.id;
        this.$set(this.unitForm.heritageExhi, "id", this.mid);
        Api.heritage.getExhibit(this.mid).then((info) => {
          this.unitForm.heritageExhi = info;
          this.heritageExhi = info;
        });
        this.getData();
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.cover,
.cult-pic img {
  width: 240px;
  height: 160px;
}
</style>
