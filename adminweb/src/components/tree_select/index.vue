rreu<template>
    <div class="ats-tree" v-clickoutside="handleCloseTree" ref="atsTree">
        <div class="ats-input" @mouseenter="hovering=true" @mouseleave="hovering=false">
            <!-- 单选 -->
            <div class="ats-input-single" v-if="!this.multiple" @click.stop="toggleMenu">
                <i class="el-input__icon el-icon-caret-bottom" :class="{'is-reverse':treeVisible,'el-icon-circle-close':showCloseIcon}" @click="handleCloseTree(!treeVisible)"></i>
                <input type="text" class="el-input__inner" readonly v-model="filterText" :placeholder="placetext">
            </div>

            <!-- 多选 -->
            <div class="ats-input-multiple el-input__inner" v-if="this.multiple" @click.stop="toggleMenu">
                <i class="el-input__icon el-icon-caret-bottom" :class="{'is-reverse':treeVisible}" @click="handleCloseTree(!treeVisible)"></i>
                <div class="ats-labels">
                    <div class="el-select__tags" @click.prevent="handleCloseTree(true)">
                        <el-tag v-for="item in checkedItems" :key="item.id" :closable="true" type="primary" class="el-tag--primary" @close="handleDelItem(item,$event)" :title="handleTitleVisible(item[treeProps.label])">
                            {{item[treeProps.label] | showEllips}}
                        </el-tag>
                    </div>
                    <input ref="multipleInput" type="text" :placeholder="placetext" v-model="filterText">
                </div>
            </div>
        </div>
        <!-- 树结构 -->
        <el-scrollbar v-show="treeVisible" class="ats-tree-scrollbar" ref="treeScrollbar">
            <div class="ats-tree-wrapper">
                <el-tree ref="selectTree" :data="treeData" :props="treeProps" :node-key="nodeKey" :current-node-key='currentNodeId' highlight-current @node-click="handleNodeClick" :render-content="renderContent" default-expand-all :filter-node-method="filterNode"></el-tree>
            </div>
        </el-scrollbar>
    </div>
</template>

<script>
import Vue from 'vue';
import { Tag, Scrollbar } from 'element-ui';
import debounce from 'throttle-debounce/throttle'
import Clickoutside from './utils/clickoutside'
import { addClass, removeClass, hasClass } from './utils/dom';
Vue.component(Scrollbar.name, Scrollbar);
Vue.component(Tag.name, Tag);
export default {
    name: 'tree',
    props: {
        nodeKey: {
            type: String
        },
        treeData: {
            type: Array,
            default: []
        },
        treeProps: {
            type: Object,
            default: {
                label: 'label',
                children: 'children'
            }
        },
        placeholder: {
            type: String,
            default: '请选择'
        },
        value: {
        },
        multiple: {
            type: Boolean,
            default: false
        }
    },
    updated() {
        this.isDefault = true;
    },
    computed: {
        showCloseIcon() {
            return this.hovering && this.value !== undefined && this.value !== '' && !this.multiple;
        }
    },
    watch: {
        filterText(val) {
            if (this.isQuering) {
                this.$refs.selectTree.filter(val);
            }
        },
        value(val) {
            if (this.isDefault) {
                this.setDefaultValue();
            }
        },
        treeData(val) {
            if (val) {
                if (this.isDefault) {
                    this.setDefaultValue();
                }
            }
        },
        checkedKeys(val) {
            if (val.length) {
                this.placetext = '';
            } else {
                this.placetext = this.placeholder;
            }
            if (this.multiple) {
                setTimeout(function() {
                    this.resetTreeTop();
                }.bind(this), 400)
                if (!this.isDefault) {
                    this.setInputFocus();
                }
            }
        }
    },
    data() {
        return {
            placetext: this.placeholder,
            currentNodeId: '',
            currentSelected: '',
            filterText: '',
            treeVisible: false,
            isQuering: false,
            query: '',
            checkedItems: [],
            checkedKeys: [],
            isDefault: true,
            error: {
                message: '',
                data: ''
            },
            hovering: false
        }
    },
    filters: {
        // 截取前18个字节
        showEllips(str) {
            if (!str) return '';
            let tempLen = 0;
            for (let i = 0; i < str.length; i++) {
                if (str.charCodeAt(i) > 255) {
                    tempLen += 2;
                } else {
                    tempLen += 1;
                }
                if (tempLen >= 15) {
                    str = str.substring(0, i) + "...";
                    break;
                }
            }
            return str;
        }
    },
    methods: {
        setDefaultValue() {
            let self = this;
            if (this.multiple) {
                this.value.forEach(function(id) {
                    self.findTreeItem(id, self.treeData)
                })
            } else {
                this.currentNodeId = this.value;
                this.$nextTick(() => {
                    self.findTreeItem(this.value, self.treeData);
                })
            }
        },
        //单选设置初始值
        setSelected(defaultNode) {
            this.currentNodeId = defaultNode[this.nodeKey];
            this.filterText = defaultNode[this.treeProps.label];
            this.currentSelected = defaultNode;
        },
        findTreeItem(id, treeNodes) {
            if (!treeNodes || !treeNodes.length) return;
            let self = this;
            for (let i = 0; i < treeNodes.length; i++) {
                let node = treeNodes[i];
                if (node[this.nodeKey] == id) {
                    if (self.multiple) {
                        self.handleAddItem(node);
                    } else {
                        self.setSelected(node);
                    }
                    break;
                } else {
                    self.findTreeItem(id, node[self.treeProps.children]);
                }
            }
        },
        // 搜索
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        // 节点渲染
        renderContent(h, { node, data, store }) {
            let icon = data.checked ? 'sz-ico ico-fasong' : '';
            return h('span', { class: 'u-tree-node' }, [
                h('i', { class: icon }),
                h('span', node.label)
            ]);
        },
        toggleMenu() {
            if (!this.disabled) {
                this.treeVisible = !this.treeVisible;
            }
        },
        resetValue() {
            if (this.multiple) {
                this.checkedItems = [];
                this.checkedKeys = [];
                this.$emit('setSelectedId', []);
            } else {
                this.filterText = '';
                this.currentNodeId = '';
                this.$emit('setSelectedId', '');
            }
        },
        handleCloseTree(val) {
            if (this.showCloseIcon) {
                this.resetValue();
            } else {
                if (val == undefined) {
                    this.treeVisible = false;
                } else {
                    this.treeVisible = val;
                }
                if (this.multiple) {
                    this.filterText = '';
                    if (val) {
                        this.setInputFocus();
                    }
                }
            }
        },
        handleNodeClick(data, node, tree) {
            // if (event) {
            //     this.isDefault = false;
            // }
          this.isDefault = false;
            if (node.isLeaf) {
                if (this.multiple) {
                    let icon = tree.$children[0].$el.querySelector('i');
                    if (!this.hasSameItem(this.checkedItems, data)) {
                        this.handleAddItem(data);
                        addClass(icon, 'sz-ico ico-fasong');
                        this.$emit('setSelectedId', this.checkedKeys);
                    } else {
                        removeClass(icon, 'sz-ico ico-fasong');
                        this.handleDelItem(data, node);
                    }
                } else {
                    this.filterText = node.label;
                    this.currentNodeId = node.key;
                    this.currentSelected = data;
                    this.toggleMenu();
                    this.$emit('setSelectedId', data);
                }
            }
        },
        handleAddItem(item) {
            item.checked = true;
            this.checkedItems.push(item);
            this.checkedKeys.push(item[this.nodeKey]);
        },
        findNode(children, id) {
            let self = this;
            for (let i = 0; i < children.length; i++) {
                let treeNode = children[i];
                if (treeNode.node.data[self.nodeKey] === id) {
                    let icon = treeNode.$el.querySelector('i');
                    removeClass(icon, 'sz-ico ico-fasong');
                    break;
                } else {
                    self.findNode(treeNode.$children, id);
                }
            }
        },
        handleDelItem(item, event) {
            // if (event) {
            //     this.isDefault = false;
            // }
          this.isDefault = false;
            item.checked = false;
            this.checkedKeys.splice(this.checkedKeys.indexOf(item[this.nodeKey]), 1);
            this.checkedItems.splice(this.checkedItems.indexOf(item), 1);
            // 递归去掉选中样式
            let $children = this.$refs.selectTree.$children;
            this.findNode($children, item[this.nodeKey]);
            this.$emit('setSelectedId', this.checkedKeys);
        },
        hasSameItem(obj, item) {
            return obj.indexOf(item) > -1;
        },
        resetTreeTop() {
            this.$nextTick(function() {
                let inputMultiple = this.$refs.atsTree.querySelector(".ats-input-multiple");
                let treeScrollbar = this.$refs.atsTree.querySelector(".ats-tree-scrollbar");
                let inputMultipleHeight = inputMultiple.offsetHeight;
                treeScrollbar.style.top = (inputMultipleHeight + 5) + "px";
            })
        },
        setInputFocus() {
            let multipleInput = this.$refs.multipleInput;
            multipleInput.focus();
        },
        handleTitleVisible(str) {
            if (!str) return '';
            let tempLen = 0;
            for (let i = 0; i < str.length; i++) {
                if (str.charCodeAt(i) > 255) {
                    tempLen += 2;
                } else {
                    tempLen += 1;
                }
            }
            if (tempLen >= 15) {
                return str;
            } else {
                return '';
            }
        }
    },
    directives: { Clickoutside }
}
</script>

<style lang="scss">
.ats-tree {
  display: inline-block;
  position: relative;
  .ats-input {
    position: relative;
    .el-icon-caret-bottom {
      cursor: pointer;
      &.is-reverse {
        transform: rotateZ(180deg);
      }
    }
  }
  .el-input__inner {
    width: 360px;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid rgb(191, 204, 217);
    box-sizing: border-box;
    color: rgb(31, 46, 61);
    display: block;
    font-size: inherit;
    height: 36px;
    line-height: 1;
    outline: 0;
    padding: 3px 10px;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
  .ats-input-multiple {
    height: auto;
  }
  .ats-input-multiple input {
    line-height: 1;
    height: 28px;
    box-sizing: border-box;
    outline: none;
    border: 0px;
    position: relative;
    right: 35px;
    left: 0;
    width: 320px;
  }
  .ats-input-multiple .el-select__tags {
    position: relative;
    height: auto;
    top: auto;
    transform: none;
    width: 320px;
    &:hover {
      cursor: pointer;
    }
  }
  .ats-input-multiple .el-select__tags .el-tag {
    margin: 5px;
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: top;
  }
  .ats-input-multiple input:focus {
    outline: none;
  }
  .ats-tree-scrollbar {
    top: 40px;
    min-width: 360px;
    // min-height: 300px;
    position: absolute;
    z-index: 10001;
    background: #fff;
    border: 1px solid #d1dbe5;
    .el-scrollbar__view {
      //   height: 500px;
    }
    transition: all 0.1s linear;
  }
  .ats-tree-wrapper {
    background-color: #fff;
    .el-tree {
      border: none;
    }
    ul,
    ol {
      list-style: none;
      padding: 0;
    }
  }
}
</style>
