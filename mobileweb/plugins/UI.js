import Vue from 'vue'
// import mintUI from 'mint-ui'
// import 'mint-ui/lib/style.css'
// Vue.use(mintUI)
import {
    Button,
    Navbar,
    TabItem,
    Picker,
    TabContainer,
    TabContainerItem,
    Field,
    Radio,
    Checklist,
    Search,
    Popup,
    CellSwipe,
    Lazyload,
    Indicator, 
    MessageBox, 
    Toast 
} from 'mint-ui'

Vue.component(Button.name, Button)
Vue.component(Navbar.name, Navbar)
Vue.component(TabItem.name, TabItem)
Vue.component(Picker.name, Picker);
Vue.component(TabContainer.name, TabContainer);
Vue.component(TabContainerItem.name, TabContainerItem);
Vue.component(Field.name, Field);
Vue.component(Radio.name, Radio);
Vue.component(Checklist.name, Checklist);
Vue.component(Search.name, Search);
Vue.component(Popup.name, Popup);
Vue.component(CellSwipe.name, CellSwipe);

//定制化
Vue.use(Lazyload, {
    preLoad: 1.3,
    error: '/images/default.png',
    attempt: 1
})

Vue.$messagebox = Vue.prototype.$messagebox = MessageBox;
Vue.$toast = Vue.prototype.$toast = Toast;
Vue.$indicator = Vue.prototype.$indicator = Indicator;

