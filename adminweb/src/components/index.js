import pagination from './pagination/pagination.vue'
import noData from './no_data/index.vue'
import pageHeader from './page_header/index.vue'
import selectOption from './select_option/option.vue'
import checkboxOption from './select_option/checkbox.vue'
import detailItem from './detail/detail_item.vue'
import uploadImg from './upload_img/uploadimg'
import cropperImg from './upload_img/cropperImg'
import uploadFile from './upload_img/uploadfile'
import uploadfileqt from './upload_img/uploadfileqt'
import richEditor from './editor/editor.vue'
import map from './map/map.vue'
import backToTop from './back_to_top/index.vue'
import canlendar from './calendar'
import weather from './weather'

import timeSelect from './time_period/time_select.vue'
import timeBlock from './time_period/time_block.vue'
import weekPeriod from './time_period/week_period.vue'
import cooperation from './cooperation/index.vue'
import treeSelect from './tree_select/index.vue'
import customLabel from './custom_labels/index'

export default {
    'pagination': pagination,
    'nodata': noData,
    'pageheader': pageHeader,
    'option': selectOption,
    'checkbox': checkboxOption,
    'detailItem': detailItem,
    'uploadimg': uploadImg,
    'cropper': cropperImg,
    'uploadfile': uploadFile,
    'richeditor': richEditor,
    'gdmap': map,
    'backtotop': backToTop,
    'canlendar': canlendar,
    'weather': weather,
    'timeSelect': timeSelect,
    'timeBlock': timeBlock,
    'weekPeriod': weekPeriod,
    'cooperation': cooperation,
    'treeselect': treeSelect,
    'customLabel': customLabel,
    "uploadfileqt": uploadfileqt
}
