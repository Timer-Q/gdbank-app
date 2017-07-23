<template>
    <div class="main">
        <router-view @footerChange="footerChange"></router-view>
        <v-footer :footer="footer" @toggle="toggle"></v-footer>
    </div>

</template>

<script>
const ROUTES = {
    '1': '/main/ewm',
    '2': '/main/make',
    '3': '/main/orders',
    '4': '/main'
}
export default {
    data: function(){
        return {
            footer: '1'
        }
    },
    methods: {
        toggle: function(footer){
            this.footer = footer;
            this.$router.replace(ROUTES[footer]);
        },
        footerChange: function(footer){
            footer && (this.footer = footer);
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .main {
        position: relative;
        width: 100%;
        height: 100%;
    }

</style>
