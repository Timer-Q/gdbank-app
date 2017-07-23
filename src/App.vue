<template>
    <div id="app">
        <router-view></router-view>
        <quick-tip></quick-tip>
        <msg-tip></msg-tip>
    </div>
</template>

<script>
import quickTip from './plugins/quicktip/quicktip.vue';
import msgTip from './plugins/msgtip/msgtip.vue';
export default {
    name: 'app',
    components: {
        'quick-tip': quickTip,
        'msg-tip': msgTip
    },
    created:function () {
      if(this.$getOs() === 'iOS') {
        document.body.style.paddingTop='20px';
      }
    },
    mounted(){
        this.$back.init();
        this.$router.replace('/login');
    }
}
</script>

<style>
#app {
    position: relative;
    width: 100%;
    height: 100%;
    font-family: PingFangSC-Regular;
    overflow-x: hidden;
   /*-webkit-overflow-scrolling: auto;*/
    overflow-y: auto;
}
</style>
