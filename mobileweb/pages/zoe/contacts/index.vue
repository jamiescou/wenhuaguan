<template>
    <section class="container zoe-favorite contacts">
        <div class="split"></div>
        <v-nodata v-if="loaded && !dataList.length" msg="暂无常用联系人"></v-nodata>
        <div class="favorite-content members" v-else>
            <div class="block-heading border-bottom">
                <h4 class="title">常用联系人</h4>
            </div>
            <mt-cell-swipe :right="[{content: '删除',style: { background: '#ea525c', color: '#fff' },handler(){delHandle(item,index)}}]" v-for="(item,index) in dataList" :key="item.idNumber">
                <div class="flex-item" slot="title">
                    <div class="cell">
                        <h4 class="name">{{item.name}}({{item.relationName}})</h4>
                        <p class="idnum">{{item.IDNum}}</p>
                        <p class="audit-remark" v-if="item.identifyStatus==='Fail'">失败理由：{{item.auditComment}}</p>
                    </div>
                    <div class="cell fixed identify" :class="{'fail':item.identifyStatus==='Fail'}">
                        <p>{{item.authStatus}}</p>
                        <nuxt-link :to="`/zoe/contacts/contact?id=${item.idNumber}`" class="btn" v-if="item.identifyStatus==='Fail'">重新认证</nuxt-link>
                    </div>
                </div>
            </mt-cell-swipe>
        </div>
        <div class="split"></div>
        <footer class="footer pre-footer" ref="footWrapper">
            <nuxt-link to="/zoe/contacts/contact" class="btn">添加联系人</nuxt-link>
        </footer>
    </section>
</template>

<script>
import axios from "axios";
import { toastMixin } from '~/components/mixins';
import crypto from 'crypto'
/**
 * @aes192解密模块
 * @param str string 要解密的字符串
 * @param secret string 要使用的解密密钥(要和密码的加密密钥对应,不然就解不了密啦)
 * @retrun string 解密后的字符串
 * */
export function getDecAse192(str, secret) {
    var decipher = crypto.createDecipher("aes192", secret);
    var dec = decipher.update(str, "hex", "utf8"); //编码方式从hex转为utf-8;
    dec += decipher.final("utf8"); //编码方式从utf-8;
    return dec;
}

export default {
    mixins: [toastMixin],
    middleware: "auth",
    head: {
        title: '常用联系人'
    },
    data() {
        return {
            loaded: false,
            dataList: []
        }
    },
    async beforeMount() {
        let { data } = await axios.get('/user/contacts');
        if (data.length > 0) {
            data = data.map((x) => {
                let IDNum = getDecAse192(x.idNumber, 'szwhg');
                x.IDNum = IDNum.replace(/^(.{4})(.*)(.{4})$/, "$1********$3")
                return x;
            });
        }

        this.dataList = data;
        this.loaded = true;
    },
    methods: {
        async delHandle(item, index) {
            this.$messagebox.confirm("确定删除该联系人吗？")
                .then(async action => {
                    await this.delContact(item, index);
                })
                .catch(() => { });
        },
        async delContact(item, index) {
            let { status, data } = await axios.delete('/user/contact/' + item.idNumber);
            if (data.success) {
                this.showMsg('删除成功')
                this.dataList.splice(index, 1);
            } else {
                this.showMsg(data.message)
            }
        }
    }
}
</script>

<style type="text/css" lang="scss" scoped>
@import "~static/styles/pages/zoe.scss";
</style>