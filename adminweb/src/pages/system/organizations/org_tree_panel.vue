<template>
    <div class="tree-panel">
        <!-- <el-input placeholder="关键字检索" v-model="filterText" icon="search" class="search-box"></el-input> -->
        <el-tree ref="orgTree" :data="treeData" :props="defaultProps" node-key="id" :current-node-key='currentNode' highlight-current :expand-on-click-node="false" :default-expanded-keys="defaultExpanded" @node-click="HandNodeclick" :filter-node-method="filterNode" :render-content="renderContent" :load="loadNode" lazy></el-tree>
    </div>
</template>

<script>
import Api from '@/api';
export default {
    data() {
        return {
            // filterText: '',
            treeData: [],
            defaultProps: { children: 'children', label: 'name' },
            currentNode: '',
            defaultExpanded: []
        }
    },
    props: {
        orgType: {
            type: String,
            default: 'all' // all、 org、dep
        },
        expanded: {  // 是否展开
            type: Boolean,
            default: true
        },
        orgId: {
            type: String,
            default: ''
        }
    },
    watch: {
        orgId(newVal, oldVal) {
            if (newVal !== '' && newVal !== oldVal) {
                this.getTreedatas();
            }
        }
    },
    methods: {
        // 组织机构树节点点击
        HandNodeclick(data, node, self) {
            this.$emit('orgClick', data);
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        // 获取组织树数据
        getTreedatas() {
            let user = this.$store.getters.user;            
            let rootId = user.orgUnit ? user.orgUnit.id : 'root';//  user.roles === null ? 'root' : user.orgUnit.id;
            let id = this.orgId === '' ? rootId : this.orgId;
            Api.system.getUnitInfo(id).then((res) => {
                this.treeData = [res];
                if (this.expanded) {
                    this.currentNode = res.id;
                    this.defaultExpanded = [this.currentNode];
                    this.$emit('orgClick', res);
                }
            });
        },
        // 节点渲染
        renderContent(h, { node, data, store }) {
            if (this.orgType === 'org' && !data.hasOrgChildren) {
                node.isLeaf = true;
            } else if (this.orgType === 'dep' && !data.hasDepChildren) {
                node.isLeaf = true;
            } else if (!data.hasOrgChildren && !data.hasDepChildren) {
                node.isLeaf = true;
            }

            let icon = data.type === 'org' ? 'sz-ico ico-org' : 'sz-ico ico-dep';
            return h('span', { class: 'u-tree-node' }, [
                h('i', { class: icon }),
                h('span', node.label)
            ]);
        },
        // 动态加载子节点
        loadNode(node, resolve) {
            if (node.level === 0) {
                return resolve(this.treeData);
            }
            if (node.data.hasDepChildren || node.data.hasOrgChildren) {
                if (this.orgType === 'dep') {
                    Api.system.getUnitChildrenForDep(node.data.id).then((res) => {
                        resolve(res);
                    });
                } else if (this.orgType === 'org') {
                    Api.system.getUnitChildrenForOrg(node.data.id).then((res) => {
                        resolve(res);
                    });
                } else {
                    Api.system.getUnitChildren(node.data.id).then((res) => {
                        resolve(res);
                    });
                }
            } else {
                return resolve([]);
            }
        }
    },
    mounted() {
        this.getTreedatas();
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.tree-panel {
  .el-tree-node__expand-icon:not(.is-leaf):hover {
    border-left-color: #333;
  }
}
</style>