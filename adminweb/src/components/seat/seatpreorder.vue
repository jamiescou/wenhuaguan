<template>
    <div class="seat-wrapper">
        <div class='coulmn-seq'>
            <ul>
                <li v-for="index in maxRow" :key="index" class="seq-item col-seq">{{index}}</li>
            </ul>
        </div>
        <div class="seatContainer">
            <h2 class="seatTitle">
                <i></i>舞台</h2>
            <div class="seat-table">
                <table :style="'width:'+(maxColumn * 40) + 'px'">
                    <tbody>
                        <tr v-for="(row,rowIndex) in seatTable" :key="rowIndex">
                            <template v-for="seat in row">
                                <td :key="seat.row + '-' + seat.column" v-if="seat.flag===1" class="seat non-seat">
                                    &nbsp;
                                </td>
                                <td :key="seat.row + '-' + seat.column" class="seat" v-else :class="{'seat-disabled':seat.type === 'disable'}" :title="seat.seatNo" @click.stop.prevent="perorderSeat(seat)">
                                    &nbsp;
                                </td>
                            </template>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="info">
                <div class="legend">
                    <!-- <span class="legend-item seat seat-disabled">无效座位</span> -->
                    <span class="legend-item seat">可预定</span>
                    <span class="legend-item seat seat-disabled">保留座位</span>
                </div>
                <div class="desc">
                    <div class="desc-item">
                        当前有座位：
                        <em class="emphasize">{{totalSeat}}</em> 个
                    </div>
                    <div class="desc-item">
                        可预定座位：
                        <em class="emphasize">{{validSeatNum}}</em> 个
                    </div>
                    <div class="desc-item">
                        已选定座位：
                        <em class="emphasize">{{preorderNum}}</em> 个
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import _ from 'lodash';
export default {
    props: {
        seatTmp: {
            type: Object,
            default() {
                return {
                    rows: 1,
                    columns: 1,
                    grids: []
                }
            }
        },
        // preSeats: {
        //     type: Array,
        //     default() { return []; },
        //     deep: true
        // },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        seatTmp: {
            handler: function(newVal, oldVal) {
                if (!newVal) return;
                if (this.isDefault) {
                    this.initTable();
                }
            },
            deep: true
        }
    },
    data() {
        return {
            seats: [],
            maxRow: 1,
            maxColumn: 1,
            validSeatNum: 0, // 可用座位
            totalSeat: 0, // 总座位数
            preorderNum: 0,
            isDefault: true
        }
    },
    computed: {
        // 分析座位，组合成二维数组
        seatTable() {
            let seatTable = [];
            seatTable = _.groupBy(this.seats, 'row');
            return seatTable;
        }
    },
    methods: {
        // 初始化座位表
        initTable: function() {
            this.isDefault = false;
            this.maxRow = this.seatTmp.rows;
            this.maxColumn = this.seatTmp.columns;
            let seatList = [];
            for (let i = 1; i < this.maxRow + 1; i++) {
                for (let j = 1; j < this.maxColumn + 1; j++) {
                    let seat = {
                        'row': i,
                        'column': j,
                        'type': 'enable', // enable可用/disable 不可用
                        'flag': 1,  // 1非座位 0座位
                        'seatNo': ''
                    }
                    let item = this.seatTmp.grids.find(x => x.row === i && x.column === j);

                    if (item) {
                        seat.type = item.type;
                        seat.seatNo = item.seatNo;
                        seat.flag = 0;
                    }
                    seatList.push(seat);
                }
            }
            this.seats = seatList;
            this.totalSeat = this.seatTmp.grids.length;
            this.validSeatNum = this.seats.filter(x => x.type === 'enable' && x.flag === 0).length;
        },
        // 预定座位
        perorderSeat(seat) {
            seat.type = seat.type === 'enable' ? 'disable' : 'enable';
            this.getValidSeatNum();
        },
        // 获取可用座位数
        getValidSeatNum() {
            let grideSeat = this.getSeats();
            this.totalSeat = grideSeat.length;
            this.validSeatNum = this.seats.filter(x => x.flag !== 1 && x.type === 'enable' && x.preorder === 0).length;
            this.preorderNum = this.seats.filter(x => x.flag !== 1 && (x.type === 'disable' || x.preorder === 1)).length;
            this.$emit('perorderChange', grideSeat);
        },
        getSeats() {
            let seatList = this.seats.filter(x => x.flag !== 1);
            return seatList.map((seat) => {
                return {
                    row: seat.row,
                    column: seat.column,
                    type: seat.type,
                    seatNo: seat.seatNo
                }
            })
        }
    },
    beforeDestroy() {
        this.$emit('seatChange', []);
    },
    mounted() {
        this.initTable();
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
@import "./seat.scss";
</style>
