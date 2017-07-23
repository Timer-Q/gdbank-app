import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        // { path: '/', redirect: '/login',},
        { path: '/login', component: function(resolve){
            return ( require(["components/login/login.vue"], resolve) );
        } },
        {name:'pay.success', path:'/successtrade',component: function (resolve) {
            return ( require(["components/successfultrade/successfultrade.vue"], resolve) );
        }},
        {name:'pay.receipt', path:'/receipt',component: function (resolve) {
          return ( require(["components/receiptewm/receiptewm.vue"], resolve) );
        }},
        { path: '/main', component: function(resolve){
            return ( require(["components/main/main.vue"], resolve) );
        }, children: [
            {name: 'main.ewm', path: 'ewm', component: function(resolve){
                return ( require(["components/ewm/ewm.vue"], resolve) );
            } },
            { path: 'make', component: function(resolve){
                return ( require(["components/make/make.vue"], resolve) );
            } },
            { path: 'orders', component: function(resolve){
                return ( require(["components/orders/orders.vue"], resolve) );
            } },
            { path: '', component: function(resolve){
                return ( require(["components/mine/mine.vue"], resolve) );
            } }
        ] }

  ]
})
