<template>
    <section class="container zoe-auth">
        <div class="field-wrapper">
            <mt-field label="姓 名" placeholder="请输入姓名" v-model="member.name" class="form-field border-bottom"></mt-field>
            <mt-field label="身份证号" placeholder="请输入身份证号码" v-model="member.idNumber" class="form-field border-bottom" :attr="{ maxlength: 18 }" v-mBlur="handleValid" :readonly="isEdit" :disabled="isEdit"></mt-field>
            <mt-field label="手机号码" placeholder="请输入手机号码" v-model="member.mobile" type="tel" class="form-field border-bottom" :attr="{ maxlength: 11 }"></mt-field>
            <div class="flex-item relation" @click="visible = true">
                <div class="fixed mint-cell-title">
                    <span class="mint-cell-text"> 关系</span>
                </div>
                <div class="cell selectText">{{member.relation.label}}</div>
                <div class="cell fixed">
                    <i class="icon icon-angle-left"></i>
                </div>
            </div>
        </div>
        <div class="split"></div>
        <div class="card-box">
            <div class="flex-item">
                <div class="cell up-file">
                    <v-uploadimg class="import-btn" ref="handCardImg" @loadimg="loadimg" @changeFiles="changeFiles">
                        <img :src="handCardImg" alt="" class="preview-img" v-if="handCardImg">
                        <span v-if="!handCardImg">点击上传</span>
                        <p v-if="!handCardImg">(手持身份证正面)</p>
                    </v-uploadimg>
                </div>
                <div class="cell fixed example">
                    <img src="/images/IDCard.png" alt="">
                </div>
            </div>
            <div class="hint">
                <p>请确保身份证上的信息清晰可见</p>
                <p>身份证号码必须清晰可识别</p>
                <p>图片大小不超过5M</p>
            </div>
        </div>
        <div class="split"></div>
        <footer class="footer pre-footer" ref="footWrapper">
            <mt-button class="btn" @click="addContactor">确定</mt-button>
        </footer>
        <mt-popup v-model="visible" position="bottom" class="act-pre-schedule">
            <mt-picker :slots="slots" @change="onValuesChange" valueKey="label" :itemHeight="100"></mt-picker>
        </mt-popup>
    </section>
</template>
<script>
import axios from 'axios';
import rules from '~/util/validateRules';
import uploadImg from '~/components/uploadImg.vue';
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
    middleware: 'auth',
    head: {
        title: '添加常用联系人'
    },
    components: {
        'v-uploadimg': uploadImg
    },
    async beforeCreate() {
        let { data } = await axios.get('/user/contacts');
        this.contacts = data;
        let idCard = this.$route.query.id;
        let member = this.contacts.find(x => x.idNumber === idCard);
        if (member) {
            this.isEdit = true;
            let contact = JSON.parse(JSON.stringify(member));
            contact.idNumber = getDecAse192(contact.idNumber, 'szwhg');
            this.member = {
                name: contact.name,
                idNumber: contact.idNumber,
                mobile: contact.mobile,
                handpic: contact.handpic,
                relation: {
                    value: contact.relation,
                    label: contact.relationName
                }
            }
            this.handCardImg = contact.handpic2
        }
    },
    data() {
        return {
            idCard: this.$route.query.id,
            isEdit: false,
            contacts: [],
            member: {
                name: '',
                idNumber: '',
                mobile: '',
                relation: {}
            },
            visible: false,
            handCardImg: '',
            slots: [
                {
                    flex: 1,
                    values: [
                        { value: 'children', label: '子女' },
                        { value: 'parent', label: '父母' },
                        { value: 'friend', label: '朋友' },
                        { value: 'mate', label: '夫妻' }
                    ],
                    className: 'm-picker-slot',
                    textAlign: 'center'
                }
            ]
        };
    },
    directives: {
        mBlur: {
            // 指令的定义
            inserted: function(el, bind) {
                let oInput = el.querySelector('input');
                oInput.onblur = function() {
                    bind.value();
                };
            }
        }
    },
    methods: {
        onValuesChange(picker, values) {
            if (values === undefined) return;
            this.member.relation = values[0]
            this.visible = false;
        },
        loadimg(url) {
            this.handCardImg = url;
        },
        changeFiles(file) {
            this.member.handpic = file;
        },
        valid() {
            if (this.contacts.length > 0) {
                let contact = this.contacts.find(x => getDecAse192(x.idNumber, 'szwhg') === this.member.idNumber);
                if (!contact) return true;
                switch (contact.identifyStatus) {
                    case 'Fail':
                        if (!this.isEdit) {
                            this.showMsg('该联系人实名认证失败，请前往联系人列表，重新编辑后提交认证')
                            return false;
                        }
                        break;
                    case 'Not':
                    case 'Wait':
                        this.showMsg('该联系人实名认证审核中，请不要重复提交')
                        return false;
                    case 'Yes':
                        this.showMsg('该联系人已存在，请不要重复提交')
                        return false;
                    default:
                        break;
                }
            }
            return true;
        },
        handleValid() {
            if (this.isEdit) return;
            if (!rules.required(this.member.idNumber, '请输入身份证号码！')) return false;
            if (!rules.checkPersonIDNo(this.member.idNumber)) return false;
            this.valid();
        },
        async addContactor() {
            if (!rules.required(this.member.name, '请输入联系人姓名！')) return false;
            if (!rules.required(this.member.idNumber, '请输入身份证号码！')) return false;
            if (!rules.checkPersonIDNo(this.member.idNumber)) return false;
            if (!rules.required(this.member.mobile, '请输入手机号码！')) return false;
            if (!rules.checkPhone(this.member.mobile)) return false;
            if (!rules.required(this.member.relation.value, '请选择关系！')) return false;
            if (!rules.required(this.handCardImg, '请上传手持照片')) return false;
            if (!this.valid()) return;

            let user = this.$store.state.user;
            // 上传图片
            let formData = new FormData();
            formData.append('handpic', this.member.handpic);
            formData.append('realname', this.member.name);
            formData.append('idnumber', this.member.idNumber);
            formData.append('nickname', user.nickname);
            formData.append('userId', user.id);
            formData.append('mobile', this.member.mobile);
            formData.append('relation', this.member.relation.value);
            formData.append('isEdit', this.isEdit);
            let { status, data } = await axios.post('/user/contact', formData);
            if (data.success) {
                this.showMsg('操作成功！');
                this.$router.push('/zoe/contacts');
            } else {
                this.showMsg(data.message);
            }
        }
    }
};
</script>
<style lang="scss">
@import "~static/styles/pages/zoe.scss";
</style>
       
        