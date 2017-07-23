/**
 * 去除前后空格的函数, 传入参数为字符串或数字
 * @param str
 * @returns {*}
 */

export default {
    install: function(Vue) {
        Vue.prototype.$trim = function(str){
            if (str && (typeof str === 'string' || typeof str === 'number')){
                return (str.replace(/^\s* | \s*$/g, ''));
            } else{
                return str;
            }
        }
    }
}