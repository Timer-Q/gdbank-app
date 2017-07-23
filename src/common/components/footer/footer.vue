<template>
    <div class="footer">
        <div class="ewm" @click="toggle('1')">
            <div class="img">
                <img src="./footer-ewm-icon-gray.png" v-show="footer !== '1'"/>
                <img src="./footer-ewm-icon.png" v-show="footer === '1'"/>
            </div>
            <p class="text" :class="{'purple': footer==='1'}">收款码</p>
        </div>
        <div class="make" @click="toggle('2')">
            <div class="img">
                <img src="./footer-make-icon-gray.png" v-show="footer !== '2'"/>
                <img src="./footer-make-icon.png" v-show="footer === '2'"/>
            </div>
            <p class="text" :class="{'purple': footer==='2'}">收款</p>
        </div>
        <div class="order" @click="toggle('3')">
            <div class="img">
                <img src="./footer-order-icon-gray.png" v-show="footer !== '3'"/>
                <img src="./footer-order-icon.png" v-show="footer ==='3'"/>
            </div>
            <p class="text" :class="{'purple': footer==='3'}">订单</p>
        </div>
        <div class="mine" @click="toggle('4')">
            <div class="img">
                <img src="./footer-mine-icon-gray.png" v-show="footer !== '4'"/>
                <img src="./footer-mine-icon.png" v-show="footer === '4'"/>
            </div>
            <p class="text" :class="{'purple': footer==='4'}">我的</p>
        </div>
    </div>

</template>

<script>
export default {
    props: {
        footer: {
            type: String,
            default: '1'
        }
    },
    methods: {
        toggle: function(footer){
            this.$emit('toggle', footer);
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

    .footer {
        position: fixed;
        bottom: 0;
        z-index: 20;
        display: flex;
        height: 2.5rem;
        width: 100%;
        border-top: 1px solid #D1D1D1;
        background-image: linear-gradient(-180deg, #FEFEFE 0%, #F8F9F8 100%);

        .ewm, .make, .order, .mine {
            flex: 1;

            .img {
                width: 100%;
                height: 1.6925rem;
                padding: 0.4425rem 0 0.25rem 0;
                text-align: center;

                img {
                    width: 1rem;
                    height: 1rem;
                }
            }

            .text {
                text-align: center;
                width: 100%;
                height: 0.6rem;
                line-height: 0.6rem;
                font-size: 0.6rem;
                color: #666666;
                letter-spacing: 0;

                &.purple {
                    color: #943EBD;
                 }
            }
        }
    }

</style>