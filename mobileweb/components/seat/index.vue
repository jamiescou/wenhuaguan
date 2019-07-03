<template>
    <div class="seat-wrapper">
        <div class="legend">
            <div class="seat">可选</div>
            <div class="seat seat-disabled">已预定</div>
            <div class="seat seat-preorder">已选</div>
        </div>
        <div class="seatContainer">
            <h2 class="seatTitle">
                <p class="txt">大屏幕</p>
                <img class="bg" src="data:image/svg+xml;charset=utf8,%3Csvg width='301' height='45' viewBox='0 0 301 44' xmlns='http://www.w3.org/2000/svg'%3E%3Ctitle%3EGroup 6%3C/title%3E%3Cg fill='%23E2E2E2' fill-rule='evenodd'%3E%3Cpath d='M238.5 34.593c0 5.028-4.1 9.104-9.163 9.104H95.31L14.662 44C9.6 44 5.5 39.924 5.5 34.896L0 .303 82.48 0H244l-5.5 34.593z'/%3E%3Cpath d='M295.5 34.593c0 5.028-4.1 9.104-9.163 9.104H152.31L71.662 44C66.6 44 62.5 39.924 62.5 34.896L57 .303 139.48 0H301l-5.5 34.593z'/%3E%3C/g%3E%3C/svg%3E">
            </h2>
            <div class="seat-content" ref="wrapper">
                <scroll ref="scroll" :freeScroll="freeScroll" :click="true" :scrollbar="scrollbar" :mouseWheel="mouseWheel" :probe-type="probeType" :listen-scroll="listenScroll" @scroll="scroll">
                    <div class="content" :style="'width:'+contentWidth" :class="fixedSeq">
                        <div class='row-seq'>
                            <ul>
                                <li v-for="index in maxRow" :key="index" ref="rowSeq" class="seq-item" @click="selectSeq(index,$event)">{{index}}</li>
                            </ul>
                        </div>
                        <table :style="'width:'+tableWidth">
                            <tbody>
                                <tr v-for="(row,rowIndex) in seatTable" :key="rowIndex" ref="seatRow">
                                    <template v-for="seat in row">
                                        <template v-if=" seat.flag===-1 || seat.flag == 1 ">
                                            <td :key="seat.row + '-' + seat.column" class="seat " :class="{'non-seat': seat.flag===-1,'seat-disabled':seat.flag === 1}">
                                                &nbsp;
                                            </td>
                                        </template>
                                        <td :key="seat.row + '-' + seat.column" v-else class="seat" :class="{'seat-preorder':seat.checked}" @click.stop.prevent="perorderSeat(seat)">
                                            &nbsp;
                                        </td>
                                    </template>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </scroll>
            </div>
        </div>
    </div>
</template>

<script>
import groupBy from 'lodash/groupBy';
import Scroll from '../scroll'
import { toastMixin } from '~/components/mixins';
export default {
    components: {
        Scroll
    },
    mixins: [toastMixin],
    props: {
        seatTmp: {   //座位模板
            type: Object,
            default() {
                return {
                    rows: 1,
                    columns: 1,
                    grids: []
                }
            }
        },
        perAllow: {
            type: Number
        },
        preSeats: {   //已预订座位
            type: Array,
            default() { return []; },
            deep: true
        }
    },
    data() {
        return {
            seats: [],
            maxRow: this.row,
            maxColumn: this.col,
            checkedNum: 0,// 已选座位数量
            checkedSeat: [], // 已选座位
            scrollX: 0,
            freeScroll: true,
            scrollbar: {
                fade: true,
                interactive: true
            },
            mouseWheel: true,
            listenScroll: true,
            probeType: 3,

        }
    },
    computed: {
        // 分析座位，组合成二维数组
        seatTable() {
            let seatTable = [];
            seatTable = groupBy(this.seats, 'row');
            return seatTable;
        },
        tableWidth() {
            return (this.maxColumn * 60) * 320 / 750 / 20 + 'rem';
        },
        contentWidth() {
            return (this.maxColumn * 60 + 80) * 320 / 750 / 20 + 'rem';
        },
        fixedSeq() {
            if (this.scrollX > -0.2) {
                return ''
            }
            return 'fixed-seq'
        }
    },
    methods: {
        // 初始化座位表
        initTable: function() {
            this.maxRow = this.seatTmp.rows;
            this.maxColumn = this.seatTmp.columns;
            let seatList = [];
            for (let i = 1; i < this.maxRow + 1; i++) {
                for (let j = 1; j < this.maxColumn + 1; j++) {
                    let seat = {
                        'row': i,
                        'column': j,
                        'flag': -1,  // 1非座位 0可预定 1不可预定
                        'seatNo': '', // i + '排' + j + '座',
                        'checked': false
                    }
                    let item = this.seatTmp.grids.find(x => x.row === i && x.column === j);
                    if (item) {
                        seat.flag = item.type === 'disable' ? 1 : 0;
                        seat.seatNo = item.seatNo;
                    }
                    if (this.preSeats && this.preSeats.findIndex(x => x === seat.seatNo) > -1) {
                        seat.flag = 1;
                    }
                    seatList.push(seat);
                }
            }
            this.seats = seatList;
        },
        // 选座位
        perorderSeat(seat) {
            if (this.checkedNum === this.perAllow && !seat.checked) {
                this.showMsg('最多可选' + this.perAllow + '个座位')
                return;
            }
            seat.checked = !seat.checked;
            this.getValidSeatNum();
            this.$emit('seatChange', this.checkedSeat);
        },
        // 获取可用座位数
        getValidSeatNum() {
            this.checkedSeat = this.seats.filter(x => x.flag === 0 && x.checked)
            this.checkedNum = this.checkedSeat.length;
        },
        scroll(pos) {
            this.scrollX = pos.x
        }
    },
    created() {
        this.initTable();
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
@import "~static/styles/components/seat";
</style>