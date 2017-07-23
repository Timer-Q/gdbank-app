export default {
    install: function(Vue) {
        Vue.quickTipTimeCode = null;

        Vue.prototype.$quickTip = function(text, remain){
            if (!remain){
                remain = 2000;
            }
            let quickTip = document.getElementById('g-quickTip');
            if (Vue.quickTipTimeCode){
                clearTimeout(Vue.quickTipTimeCode);
            } else {
                quickTip.className = 'show';
            }
            let p = quickTip.getElementsByTagName('p')[0];
            p.innerHTML = text;

            Vue.quickTipTimeCode = setTimeout(function(){
                quickTip.className = 'hide';
                Vue.quickTipTimeCode = null;
            }, remain);
        }
    }
}