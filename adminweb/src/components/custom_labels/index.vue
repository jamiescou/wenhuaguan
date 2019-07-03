<template>
  <el-form-item :label="label">
    <el-col :span="12">
      <el-select v-model="labels" @change="labelChange" placeholder="可选择常用标签也可以自定义标签">
        <el-option v-for="item in labelsItem" :label="item" :key="item" :value="item"></el-option>
      </el-select>
    </el-col>
    <el-col :span="12">
      <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm">
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 自定义标签</el-button>
    </el-col>
    <el-col :span="24">
      <el-tag :key="tag" v-for="tag in params" closable :disable-transitions="false" @close="handleClose(tag)"> {{tag}}
      </el-tag>
    </el-col>
  </el-form-item>
</template>
<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
<script>
  import Api from '@/api';
  export default {
    props: {
        label: {
          required: true,
          type: String,
          default: '标签'
        },
        type: {
          required: true,
          type: String,
          default: 'trainLabel'
        },
        initValue: {
          type: Array,
          default: []
        }
    },
    data() {
      return {
        labelsItem: [],
        labels: '',
        inputValue: '',
        inputVisible: false,
        params: [],
      }
    },
    created() {
      this.getLabels();
      this.params = this.initValue;
    },
    methods: {
      getLabels() {
        Api.train.getLabels(this.type+"?search=searchUnitId").then((res) => {
          this.labelsItem = res.labels;
        });
      },
      labelChange(val) {
        if (val !== '' && val && this.params.indexOf(val) === -1) {
          this.params.push(val);
        }
        this.labels = '';
      },
      handleClose(tag) {
        this.params.splice(this.params.indexOf(tag), 1);
      },

      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue && this.params.indexOf(inputValue) === -1) {
          this.params.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
    },
    watch: {
      initValue(val) {
        this.params = JSON.parse(JSON.stringify(val || []));
      },
      params: {
        handler(curVal,oldVal){
          this.$emit('valueChange', curVal);
        },
        deep:true
      }
    }
  }
</script>
