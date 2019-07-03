<template>
    <div class="seat-wrapper">
        <div class='coulmn-seq'>
            <ul>
                <li v-for="index in maxRow" :key="index" class="seq-item col-seq" @click.stop.prevent="setRowValid($event,index)">
                    <i :ref="'row_i_'+index">&nbsp;</i>
                    {{index}}</li>
            </ul>
        </div>
        <div class="seatContainer">
            <h2 class="seatTitle">
                <i></i>舞台</h2>
            <v-scrollbar class="seat-table" :settings="settings">
                <table :style="'width:'+(maxColumn * 60) + 'px'">
                    <tbody>
                        <tr v-for="(row,rowIndex) in seatTable" :key="rowIndex">
                            <template v-for="seat in row">
                                <td @click.stop.prevent="selectCell(seat)" class="seat" :class="getClass(seat)" :key="seat.row + '-' + seat.column" :title="seat.seatNo">
                                    <i :class="{'seat-checked':seat.checked===1}">&nbsp;</i>
                                    <input type="text" class="seat_input" v-if="seat.flag != 1" :value="seat.seatNo" v-model="seat.seatNo" @blur="save(seat)" v-on:click.stop.prevent>
                                </td>
                            </template>
                        </tr>
                        <tr style="height:60px">
                            <td v-for="col in maxColumn" :key="col" @click="setColValid($event,col)" class="seq-item">
                                <i :ref="'col_i_'+col"></i>
                                {{col}}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </v-scrollbar>
            <div class="info">
                <div class="legend">
                    <span class="legend-item seat seat-disabled" @click="setValid('disable')">保留座位</span>
                    <span class="legend-item seat" @click="setValid('enable')">可选座位</span>
                    <span class="legend-item seat non-seat" @click="setNonSeat">改为过道</span>
                    <span class="legend-item seat-checked">选中</span>
                </div>
                <div class="desc">
                    <div class="desc-item">点击序号，进行批量选择;点击图例，进行座位设置</div>
                    <div class="desc-item"> 当前有座位：
                        <em class="emphasize">{{totalSeat}}</em>个</div>
                    <div class="desc-item">
                        可选座位：
                        <em class="emphasize">{{validSeatNum}}</em>个
                    </div>
                    <div class="desc-item">
                        已保留座位：
                        <em class="emphasize">{{noValidSeatNum}}</em> 个
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import _ from 'lodash';
import perfectScrollbar from '../../components/scrollbar/perfect-scrollbar'
export default {
    components: {
        'v-scrollbar': perfectScrollbar
    },
    props: {
        row: {
            type: Number,
            default: 1
        },
        col: {
            type: Number,
            default: 1
        },
        direction: {
            type: String,
            default: 'left'
        },
        grids: {
            type: Array,
            default() { return []; }
        }
    },
    watch: {
        direction(newVal, oldVal) {
            if (newVal !== '' && newVal !== oldVal) {
                this.init(true);
            }
        },
        row(newVal, oldVal) {
            if (newVal > 0 && newVal !== oldVal) {
                this.maxRow = newVal;
                this.init(true);
            }
        },
        col(newVal, oldVal) {
            if (newVal > 0 && newVal !== oldVal) {
                this.maxColumn = newVal;
                this.init(true);
            }
        }
    },
    data() {
        return {
            seats: [],
            maxRow: this.row,
            maxColumn: this.col,
            validSeatNum: 0, // 可用座位
            noValidSeatNum: 0, // 不可用座位
            totalSeat: 0, // 总座位数
            settings: {
                // wheelSpeed: 2,
                // wheelPropagation: true,
                // minScrollbarLength: 20,
                suppressScrollY: true
            }
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
        save(seat) {
            this.getValidSeatNum();
        },
        // 初始化座位表
        initTable: function() {
            let seatList = [];
            for (let row = 1; row < this.maxRow + 1; row++) {
                for (let col = 1; col < this.maxColumn + 1; col++) {
                    let seatNo = row + '排' + col + '座';
                    if (this.direction === 'right') {
                        seatNo = row + '排' + (this.maxColumn + 1 - col) + '座';
                    }
                    seatList.push({
                        'row': row,
                        'column': col,
                        'checked': 0,   // 选中
                        'valid': 'enable', // enable可用/disable 不可用
                        'flag': 0,  // 1非座位
                        'seatNo': seatNo
                    });
                }
            }
            this.seats = seatList;
            this.validSeatNum = this.totalSeat = this.maxRow * this.maxColumn;
        },
        // 覆盖座位
        overSeats(grids) {
            if (grids && grids.length > 0) {
                for (let seat of this.seats) {
                    let item = grids.find(x => x.row === seat.row && x.column === seat.column);
                    if (item) {
                        seat.valid = item.type;
                        seat.seatNo = item.seatNo;
                    } else {
                        seat.flag = 1;
                    }
                }
            }
            this.getValidSeatNum();
        },
        // 根据状态，设置样式
        getClass(seat) {
            let classStr = seat.valid === 'disable' ? ' seat-disabled' : '';
            classStr += seat.flag === 1 ? ' non-seat' : '';
            return classStr;
        },
        // 选中/取消选中
        selectCell(seat) {
            seat.checked = seat.checked === 1 ? 0 : 1;
            this.setAllSelected(seat.column, seat.row, seat.checked);
        },
        // 行或列全选状态
        setAllSelected(colIndex, rowIndex, checked) {
            let rows = this.seats.filter(x => x.column === colIndex && x.checked === checked);
            if (rows.length === this.maxRow) {
                this.$refs['col_i_' + colIndex][0].className = checked === 1 ? 'seat-checked' : '';
            }
            let cols = this.seats.filter(x => x.row === rowIndex && x.checked === checked);
            if (cols.length === this.maxColumn) {
                this.$refs['row_i_' + rowIndex][0].className = checked === 1 ? 'seat-checked' : '';
            }
        },
        // 整列选中/取消选中
        setColValid($event, colIndex) {
            let $i = this.$refs['col_i_' + colIndex][0];
            let checked = $i.className === 'seat-checked';
            $i.className = checked ? '' : 'seat-checked';
            let val = checked ? 0 : 1;
            for (let item of this.seats) {
                if (item.column === colIndex) {
                    item.checked = val;
                }
            }
        },
        // 整行选中/取消选中
        setRowValid($event, rowIndex) {
            let $i = this.$refs['row_i_' + rowIndex][0];
            let checked = $i.className === 'seat-checked';
            $i.className = checked ? '' : 'seat-checked';
            let val = checked ? 0 : 1;
            for (let item of this.seats) {
                if (item.row === rowIndex) {
                    item.checked = val;
                }
            }
        },
        // 设置座位排序号（行序号）
        setSeatNoOfRow() {
            // 行重新排位
            let seatGroup = _.orderBy(_.groupBy(this.seats, 'row'));
            let rowNo = 1;
            for (var key in seatGroup) {
                // 判断行状态，全部为“非座位”
                let index = seatGroup[key].findIndex(x => x.flag === 0);
                if (index !== -1) {
                    for (let item of seatGroup[key]) {
                        if (item.flag !== 1) {
                            item.seatNo = rowNo + '排' + item.seatNo.substr(item.seatNo.indexOf('排') + 1);
                        }
                    }
                    rowNo++;
                }
            }
        },
        // 设置座位排序号（列序号）
        setSeatNoOfCol(rowIndex) {
            let seats = this.seats.filter(item => item.row === rowIndex && item.flag !== 1);
            seats = _.orderBy(seats, 'column', 'asc')
            let maxNo = seats.length;
            let seatNo = this.direction === 'right' ? maxNo : 1;
            for (let item of seats) {
                item.seatNo = item.seatNo.substr(0, item.seatNo.indexOf('排') + 1) + seatNo + '座';
                this.direction === 'right' ? seatNo-- : seatNo++;
            }
        },
        // 设置座位可用/不可用
        setValid(status) {
            for (let item of this.seats) {
                if (item.checked === 1) {
                    item.valid = status;
                    item.flag = 0;
                    item.checked = 0;
                    item.seatNo = item.row + '排' + item.column + '座';
                    this.setAllSelected(item.column, item.row, 0);
                    this.setSeatNoOfCol(item.row);
                    this.setSeatNoOfRow();
                }
            }
            this.getValidSeatNum();
        },
        // 设置非座位
        setNonSeat() {
            for (let item of this.seats) {
                if (item.checked === 1) {
                    item.flag = 1;
                    item.checked = 0;
                    item.seatNo = '';
                    this.setAllSelected(item.column, item.row, 0);
                    this.setSeatNoOfCol(item.row);
                    this.setSeatNoOfRow();
                }
            }
            this.getValidSeatNum();
        },
        // 获取可用座位数
        getValidSeatNum() {
            this.totalSeat = this.seats.filter(x => x.flag !== 1).length;
            this.validSeatNum = this.seats.filter(x => x.flag !== 1 && x.valid === 'enable').length;
            this.noValidSeatNum = this.seats.filter(x => x.flag !== 1 && x.valid === 'disable').length;
            let seatList = this.getSeats();
            this.$emit('seatChange', seatList);
        },
        // 获取座位表
        getSeats() {
            let seatList = this.seats.filter(x => x.flag === 0);
            return seatList.map((seat) => {
                return {
                    row: seat.row,
                    column: seat.column,
                    type: seat.valid,
                    seatNo: seat.seatNo
                }
            })
        },
        init(isChange) {
            clearTimeout(this.timeout);
            this.initTable();
            let seatList = this.getSeats();
            if (this.grids.length === 0 || isChange) {
                this.$emit('seatChange', seatList);
            }
        }
    },
    beforeDestroy() {
        this.$emit('seatChange', []);
    },
    mounted() {
        this.$nextTick(() => {
            this.init();
            if (this.grids && this.grids.length > 0) {
                this.overSeats(this.grids);
            }
        });
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
@import "./seat.scss";
</style>
