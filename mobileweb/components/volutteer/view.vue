<template>
    <section class="volunteer-detail">
        <div class="block-heading">
            <h4 class="title">志愿者服务方向</h4>
        </div>
        <div class="flex-item desc-list serv-type">
            <span v-for='(item,index) in view.serviceTypeNames' :key='index'>
                <i class="icon icon-jiaobiao"></i>{{item}}</span>
        </div>
        <p class="vol-tip">注：志愿者招募活动将优先录用服务方向相同的志愿者</p>
        <div class="split"></div>
        <div class="block-heading">
            <h4 class="title">志愿者身份信息</h4>
        </div>
        <div class="field-wrapper">
            <div class="detail-item flex-item border-bottom">
                <div class="mint-cell-title">
                    <span class="mint-cell-text">{{view.nameLabel}}</span>
                </div>
                <div class="cell txt-right">{{view.name}}</div>
            </div>
            <div class="detail-item flex-item border-bottom">
                <div class="mint-cell-title">
                    <span class="mint-cell-text">手机</span>
                </div>
                <div class="cell txt-right">{{view.telephone}}</div>
            </div>
            <div class="detail-item flex-item border-bottom" v-if="view.teamCount">
                <div class="mint-cell-title">
                    <span class="mint-cell-text">团队人数</span>
                </div>
                <div class="cell txt-right">{{view.teamCount}}</div>
            </div>
            <div class="detail-item flex-item border-bottom">
                <div class="mint-cell-title">
                    <span class="mint-cell-text">头像</span>
                </div>
                <div class="cell txt-right">
                    <img :src="view.uploadImg" alt="" class="preview-img"  onerror="this.onerror=null;this.src='/images/portrait.png'">
                </div>
            </div>
            <div class="detail-item flex-item border-bottom">
                <div class="mint-cell-title">
                    <span class="mint-cell-text">所在区域</span>
                </div>
                <div class="cell txt-right">{{view.region}}</div>
            </div>
            <div class="detail-item flex-item">
                <div class="mint-cell-title">
                    <span class="mint-cell-text">详细地址</span>
                </div>
                <div class="cell txt-right">{{view.address}}</div>
            </div>
            <div class="split"></div>

            <div class="detail-item flex-item border-bottom">
                <div class="mint-cell-title">
                    <span class="mint-cell-text">籍贯</span>
                </div>
                <div class="cell txt-right">{{view.holdAddress}}</div>
            </div>
            <div class="detail-item flex-item border-bottom">
                <div class="mint-cell-title">
                    <span class="mint-cell-text">邮箱</span>
                </div>
                <div class="cell txt-right">{{view.email}}</div>
            </div>
            <div class="detail-item flex-item border-bottom">
                <div class="mint-cell-title">
                    <span class="mint-cell-text">职业</span>
                </div>
                <div class="cell txt-right">{{view.occupationName}}</div>
            </div>
            <div class="detail-item flex-item border-bottom">
                <div class="mint-cell-title">
                    <span class="mint-cell-text">最高学历</span>
                </div>
                <div class="cell txt-right">{{view.educationName}}</div>
            </div>
            <div class="detail-item flex-item border-bottom">
                <div class="mint-cell-title">
                    <span class="mint-cell-text">政治面貌</span>
                </div>
                <div class="cell txt-right">{{view.politicalName}}</div>
            </div>
            <div class="detail-item flex-item border-bottom">
                <div class="mint-cell-title">
                    <span class="mint-cell-text">个人简介</span>
                </div>
                <div class="cell txt-right">{{view.brief}}</div>
            </div>
        </div>
    </section>
</template>

<script>
import axios from "axios";
export default {
    props: {
        view: Object
    }
}
</script>