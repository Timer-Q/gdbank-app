<template>
    <div class="mine">
        <div class="mine-wrapper">
            <v-header :title="title" :show-back="'0'"></v-header>
            <div class="user-header">
                <div class="portrait"><!-- <img :src="userLogo"> --><img src="./img/avatar1.jpg"></div>
                <div class="user-msg">
                  <div>{{usrOprNo}}&nbsp;&nbsp;{{usrOprName}}</div>
                  <div style="color: #888888">{{mercNm}}</div>
                 </div>
            </div>

            <div class="content setting-hooker">
                <div>
                    <div class="line">
                        <div class="img lv1"></div>
                        <p class="text">收银员龙虎榜</p>
                        <div class="right-arrow"></div>
                    </div>

                    <div class="line">
                        <div class="img lv2"></div>
                        <p class="text">收银员管理</p>
                        <div class="right-arrow"></div>
                    </div>

                    <div class="line">
                        <div class="img lv3"></div>
                        <p class="text">退款管理</p>
                        <div class="right-arrow"></div>
                    </div>

                    <div class="line">
                        <div class="img lv4"></div>
                        <p class="text">结算记录</p>
                        <div class="right-arrow"></div>
                    </div>

                    <div class="split"></div>

                    <div class="line">
                        <div class="img lv5"></div>
                        <p class="text">设置默认支付方式</p>
                        <div class="right-arrow"></div>
                    </div>

                    <div class="line">
                        <div class="img lv6"></div>
                        <p class="text">语言切换</p>
                        <div class="right-arrow"></div>
                    </div>

                    <div class="line" @click="showPage('1')">
                        <div class="img lv7"></div>
                        <p class="text">设置</p>
                        <div class="right-arrow"></div>
                    </div>
                </div>
            </div>
        </div>

        <setting v-show="pageShow === '1'" @hidePage="hidePage" :pageShow="pageShow"></setting>
    </div>

</template>

<script>
import setting from '../setting/setting.vue';
import BScroll from 'better-scroll';
export default {
    components: {
        setting: setting
    },
    data: function(){
        return {
            title: '我的',
            pageShow: '0',
            usrOprNo:'',
            usrOprName:'',
            mercNm:'',
            userLogo:'static/img/ewm-logo2.png',
        }
    },
    methods: {
        showPage: function(page){
            this.pageShow = page;
        },
        hidePage: function(){
            this.pageShow = '0';
        },
        _initSettingScroll: function(){
            let hook = document.getElementsByClassName('setting-hooker')[0];
            if(!this.settingScroll){
                this.settingScroll = new BScroll(hook, {
                    click: true
                });
            } else {
                this.settingScroll.refresh();
            }
        }
    },
    created: function(){
        this.$emit('footerChange', '4');
        let merch = JSON.parse(localStorage.getItem('merchUser'));
        this.usrOprNo = merch.usrOprId;
        this.usrOprName = merch.usrOprName;
        this.mercNm = merch.mercNm;
        if(merch.mercId == '800010000020022') {
          this.userLogo = 'static/img/ewm-logo1.png';
        }else if(merch.mercId == '800057100030001') {
          this.userLogo = 'static/img/ewm-logo2.png';
        }
        let that = this;
        this.$nextTick(function(){
            that._initSettingScroll();
        })
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .mine {
        position: absolute;
        top: 0;
        bottom: 2.5rem;
        width: 100%;
        background-color: #F4F4F4;

        .mine-wrapper {
            position: relative;
            width: 100%;
            height: 100%;
            .user-header {
                width: 100%;
                height: 5.5rem;
                background: url("./img/mine-bg.png") no-repeat;
                background-size: 100% 100%;
                padding-top: .95rem;
                padding-left: .75rem;

                .portrait {
                    display: inline-block;
                    border-radius: 50%;
                    float: left;
                    margin-right: .7rem;
                    border-radius: 50%;
                    img{
                      width: 3.5rem;
                      height: 3.5rem;
                    }
                    /*width: 3.5rem;
                    height: 3.5rem;
                    background: url("./img/user-header-img.png") no-repeat;
                    background-size: 100%;*/
                }

                .user-msg {
                    font-size: 0.8rem;
                    line-height: 1.05rem;
                    margin-top: .775rem;
                    color: #333333;
                    letter-spacing: 0;
                }
            }

            .content {
                position: absolute;
                top: 7.7rem;
                bottom: 0;
                width: 100%;
                overflow: hidden;
                background-color: #FFFFFF;

                .line {
                    padding: 0.5rem 0.75rem 0.5rem 0.9rem;
                    border-bottom: 1px solid #CCCCCC;
                    height: 2.5rem;

                    .img {
                        display: inline-block;
                        height: 1.5rem;
                        vertical-align: top;

                        &.lv1 {
                            width: 1.1575rem;
                            background: url("./img/bank-icon.png") no-repeat;
                            background-size: 100% 100%;
                        }
                       &.lv2 {
                         width: 1.5rem;
                         background: url("./img/admin-icon.png") no-repeat;
                         background-size: 100% 100%;
                       }
                      &.lv3 {
                        width: 1.45rem;
                        background: url("./img/refund-icon.png") no-repeat;
                        background-size: 100% 100%;
                      }
                      &.lv4 {
                        width: 1.4rem;
                        background: url("./img/settle-icon.png") no-repeat;
                        background-size: 100% 100%;
                      }
                      &.lv5 {
                        height: 1.125rem;
                        width: 1.5rem;
                        background: url("./img/defalut-pay-icon.png") no-repeat;
                        background-size: 100% 100%;
                      }
                      &.lv6 {
                        width: 1.5rem;
                        height: 1.375rem;
                        background: url("./img/language-icon.png") no-repeat;
                        background-size: 100% 100%;
                      }
                      &.lv7 {
                        width: 1.5rem;
                        background: url("./img/setting-icon.png") no-repeat;
                        background-size: 100% 100%;
                      }
                    }

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
                        margin-top: 0.28rem;
                        width: 0.5rem;
                        height: 0.925rem;
                        background: url("./img/right-arrow-icon.png") no-repeat;
                        background-size: 100% 100%;
                    }
                }

                .split {
                    background-color: #F4F4F4;
                    height: 0.75rem;
                    width: 100%;
                    border-bottom: 1px solid #CCCCCC;
                }
            }
        }
    }

</style>
