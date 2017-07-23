import axios from 'axios';
import qs from 'qs';
// const basePath = 'http://userpay.icitic.net/user/';
const basePath = 'http://192.168.111.105:80/user';
// const basePath = 'http://192.168.111.105:7070/user';
export default {
    install: function(Vue) {
        Vue.prototype.$get = function(url, scb, fcb) {
                if (!url || typeof url !== 'string') {
                    console.log('请输入url 地址');
                    return;
                }
                axios.get(basePath + url).then(function(res) {
                    console.log('get 请求成功 ' + JSON.stringify(res));
                    if (scb && typeof scb === 'function') {
                        scb(res);
                    }
                }, function(res) {
                    console.log('get 请求失败 ' + JSON.stringify(res));
                    if (fcb && typeof fcb === 'function') {
                        fcb(res);
                    }
                });

            },

            Vue.prototype.$post = function(url, json, scb, fcb) {

                if (!url || typeof url !== 'string') {
                    console.log('请输入url 地址');
                    return;
                }

                if (arguments[1] && typeof arguments[1] !== 'function') { // 传入的参数第二个不为 回调函数
                    let requestData = qs.stringify(arguments[1]);
                    axios.post(basePath + url, requestData).then(function(res) {
                        // console.log('post 请求成功 ' + JSON.stringify(res));
                        if (scb && typeof scb === 'function') {
                            scb(res);
                        }
                    }, function(res) {
                        // console.log('post 请求失败 ' + JSON.stringify(res));
                        if (fcb && typeof fcb === 'function') {
                            fcb(res);
                        }
                    });
                }

                if (arguments[1] && typeof arguments[1] === 'function') { // 不传参的 post 请求
                    let cb1 = arguments[1],
                        cb2 = arguments[2];
                    axios.post(basePath + url, '').then(function(res) {
                        // console.log('post 请求成功 ' + JSON.stringify(res));
                        cb1(res);
                    }, function(res) {
                        // console.log('post 请求失败 ' + JSON.stringify(res));
                        if (cb2 && typeof cb2 === 'function') {
                            cb2(res);
                        }
                    });
                }

            }
    }
}