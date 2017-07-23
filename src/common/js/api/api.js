export  default {
  install:function(Vue) {
    Vue.prototype.$getOs = function(){
      var ua;
      ua = navigator.userAgent;
      switch (false) {
        case !/iPhone|iPad|iOS/i.test(ua):
          return 'iOS';
        default:
          return 'Unknown';
      }
    }
  }
}
