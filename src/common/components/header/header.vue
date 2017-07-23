<template>
    <div class="header">
        <div class="back" @click="back">
            <div class="img-wrapper" v-show="showBack === '1'"></div>
            <span v-show="showBack === '1'">返回</span>
        </div>
        <div class="title">{{title}}</div>
        <div class="right-block right" @click="rightBack">{{ rightTip }}</div>
    </div>

</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: ''
        },
        rightTip: {
            type: String,
            default: ''
        },
        showBack: {
            type: String,
            default: '1'
        },
        return: {
            type: String,
            default: '1'
        }
    },
    methods: {
        back: function(){
            if (this.return === '1'){
                this.$router.back();
            } else {
                this.$emit('back');
            }
        },
        rightBack :function () {
          this.$router.replace('/main/orders');
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header {
    display: flex;
    width: 100%;
    height: 2.2rem;
    background-color: #943EBD;

    .back, .right-block {
        position: relative;
        flex: 1;
        color: #fff;
        font-size: 0.8rem;
        line-height: 2.2rem;

        .img-wrapper {
            position: absolute;
            top: 0.7rem;
            left: 0.79rem;
            width: 0.5rem;
            height: 0.8675rem;
            background: url("./right-arrow-icon.png") no-repeat center center;
            background-size: 100% ;
            transform: rotate(180deg);
        }

        span {
            display: inline-block;
            margin-left: 1.5975rem;
            height: 100%;
            vertical-align: middle;
            padding-top: .07rem;
        }
    }

    .title {
        flex: 0 0 9.55rem;
        width: 9.55rem;
        line-height: 2.2rem;
        text-align: center;
        color: #fff;
        font-size: 0.95rem;
    }
    .right {
        text-align: center;
    }

}

</style>
