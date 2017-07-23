export default {
    install: function(Vue){
        Vue.prototype.$alert = function(text, cb){
            if(!text) {
                return;
            }
            let msgTip = document.getElementById('g-msgTip');
            if (msgTip.className === 'hide'){
                let p = msgTip.getElementsByClassName('text')[0];
                let confirm = msgTip.getElementsByClassName('confirm')[0];
                p.innerHTML = text;
                msgTip.className = 'show';
                confirm.onclick = function(){
                    msgTip.className = 'hide';
                    p.innerHTML = '';
                    if(cb && typeof cb === 'function'){
                        cb();
                    }
                }
            }
        }
    }
}