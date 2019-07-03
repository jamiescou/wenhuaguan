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
                <table :style="'width:'+(maxColumn * 60) + 'px'">
                    <tbody>
                        <tr v-for="(row,rowIndex) in seatTable" :key="rowIndex">
                            <td v-for="seat in row" :key="seat.row + '-' + seat.column" class="seat" :class="getClass(seat)" :title="seat.seatNo">
                                <i>&nbsp;</i>
                                {{seat.seatNo}}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="info">
                <div class="legend">
                    <span class="legend-item seat seat-disabled">保留座位</span>
                    <span class="legend-item seat">有效座位</span>
                </div>
                <div class="desc">
                    <div class="desc-item">
                        当前有座位：
                        <em class="emphasize">{{totalSeat}}</em>个
                    </div>
                    <div class="desc-item">
                        已保留座位：
                        <em class="emphasize">{{noValidSeatNum}}</em>个
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
        }
    },
    watch: {
        seatTmp: {
            handler: function() {
                this.initTable();
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
            noValidSeatNum: 0, // 不可用座位
            totalSeat: 0 // 总座位数
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
        // 根据状态，设置样式
        getClass(seat) {
            let classStr = seat.type === 'disable' ? 'seat-disabled' : '';
            classStr += seat.flag === 1 ? ' non-seat' : '';
            return classStr;
        },
        // 初始化座位表
        initTable: function() {
            if (!this.seatTmp.grids || this.seatTmp.grids.length === 0) return;
            this.maxRow = this.seatTmp.rows;
            this.maxColumn = this.seatTmp.columns;
            let seatList = [];
            for (let i = 1; i < this.maxRow + 1; i++) {
                for (let j = 1; j < this.maxColumn + 1; j++) {
                    let seat = {
                        'row': i,
                        'column': j,
                        'type': 'enable', // enable可用/disable 不可用
                        'flag': 1,  // 1非座位
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
            this.noValidSeatNum = this.seats.filter(x => x.type === 'disable' && x.flag === 0).length;
        }
    },
    mounted() {
        this.initTable();
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
@import "./seat.scss";
</style>
