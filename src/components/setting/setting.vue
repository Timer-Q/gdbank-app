<template>
    <transition name="move">
        <div class="setting">
            <v-header :title="title" :return="'0'" @back="back"></v-header>
            <div class="line">
                <p class="text">商户资料</p>
                <div class="right-arrow"></div>
            </div>

            <div class="line">
                <p class="text">登录密码管理</p>
                <div class="right-arrow"></div>
            </div>

            <div class="split"></div>

            <div class="line">
                <p class="text">固定二维码支付成功语音播报</p>
                <!--<div class="person-float" :class="{'on': on==='1', 'off':on==='0'}" @click="toggle"></div>-->
                <div class="person-float"  @click="toggle"><input type="checkbox" class="person-float-chk" :checked="isChecked"><span class="person-float-span"></span></div>
            </div>

            <div class="line">
                <p class="text">常见问题</p>
                <div class="right-arrow"></div>
            </div>

            <div class="line">
                <p class="text">检查版本</p>
                <div class="right-arrow"></div>
                <p class="version">V3.9.1</p>
            </div>

            <div class="next-button-wrapper" @click="logout">
                <next-button :next="next"></next-button>
            </div>

        </div>
    </transition>

</template>

<script>

export default {
    props:['pageShow'],
    data: function(){
        return {
            title: '设置',
            on: '0',
            next: '安全退出',
            isChecked:false
        }
    },
    methods: {
        back: function(){
            this.$emit('hidePage');
        },
        toggle: function(){
            /*this.on = (this.on === '0'? '1':'0');*/
            this.isChecked = !this.isChecked;
        },
        logout: function(){
            localStorage.clear();
            this.$router.replace('/login');
        }
    },
    watch: {
        pageShow(){
           if(this.pageShow==='1'){
            let _self=this;
            this.$back.subBack(()=>{
                _self.$emit('hidePage');
            })
           }
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .setting {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        z-index: 30;
        background: #F4F4F4;
        transition: all, 0.2s linear;
        transform: translate3d(0, 0, 0);
        &.move-enter, &.move-leave-active{
            transform: translate3d(100%, 0, 0);
        }

        .line {
            padding: 0.5rem 0.75rem 0.5rem 0.9rem;
            border-bottom: 1px solid #CCCCCC;
            height: 2.5rem;
            background-color: #FFFFFF;

            .text {
                display: inline-block;
                height: 100%;
                line-height: 1.5rem;
                font-size: 0.8rem;
                color: #333333;
                letter-spacing: 0;
            }

            .right-arrow {
                float: right;
                margin-top: 0.3rem;
                width: 0.5rem;
                height: 0.925rem;
                background: url("./right-arrow-icon.png") no-repeat;
                background-size: 100% 100%;
            }

            .person-float {
                float: right;
                /*margin-top: 0.15rem;*/
                width: 2.4rem;
                height: 1.45rem;
                transform: translateY(-1px);
                .person-float-chk {
                  display: none;
                  &:checked + span {
                    background-color: #44DB5E;
                    border-color: #44DB5E;
                    &::before {
                      transform: scale(0);
                    }
                    &::after {
                      transform: translateX(20px);
                    }
                  }
                }
                .person-float-span {
                  display: inline-block;
                  position: relative;
                  width: 52px;
                  height: 32px;
                  background-color:#d9d9d9;
                  border: 1px solid #d9d9d9;
                  border-radius: 16px;
                  box-sizing: border-box;
                  &::before,&::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    transition:transform .3s,-webkit-transform .3s;
                    border-radius: 16px;
                  }
                  &::before {
                    width: 50px;
                    height: 30px;
                    background-color: #fdfdfd;
                  }
                  &::after {
                    width: 30px;
                    height: 30px;
                    background-color: #FFF;
                    box-shadow: 0 1px 3px rgba(0,0,0,.4);
                  }
                }


                &.on {
                    background: url("./person-float-on.png") no-repeat;
                    background-size: 100% 100%;
                }

                &.off {
                    background: url("./person-float-off.png") no-repeat;
                    background-size: 100% 100%;
                }
            }

            .version {
                float: right;
                margin-right: 0.35rem;
                height: 100%;
                line-height: 1.5rem;
                font-size: 0.8rem;
                color: #666666;
                letter-spacing: 0;
            }
        }

        .split {
            background-color: #F4F4F4;
            height: 0.75rem;
            width: 100%;
            border-bottom: 1px solid #CCCCCC;
        }

        .next-button-wrapper {
            margin: 0.75rem 0.75rem 0 0.75rem;
        }
    }

</style>
