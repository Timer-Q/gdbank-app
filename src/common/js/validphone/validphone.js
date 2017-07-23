/**
 * 检验手机号格式是否正确
 * @param str
 */

export default {
    install: function(Vue) {
        Vue.prototype.$validPhone = function(str){
            return (/^1[3578]\d{9}$/.test(str));
        }
    }
}