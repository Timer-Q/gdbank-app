// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router/index.js';
import quickTip from './plugins/quicktip/index.js';
import msgTip from './plugins/msgtip/index.js';
import tools from './common/js/index.js';
import components from './common/components/index.js';
import Toast from './plugins/toast'
import Indicator from './plugins/indicator';
import Back from './plugins/back/back.js';
import filters from './common/filters';

Vue.use(quickTip);
Vue.use(msgTip);
Vue.$toast = Vue.prototype.$toast = Toast;
Vue.$indicator = Vue.prototype.$indicator = Indicator;
Vue.$back = Vue.prototype.$back = Back;

for (var key in components) {
    Vue.component(key, components[key]);
}

for (var key in tools) {
    Vue.use(tools[key]);
}
// 注册全局过滤器
for (let key in filters) {
    Vue.filter(key, filters[key]);
}


Vue.config.productionTip = false;
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
})