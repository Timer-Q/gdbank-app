<template>
    <transition name="move">
        <div class="payment" id="payment">
            <v-header :title="title" :return="'0'" @back="back"></v-header>
            <div class="payment-top">
                <img src="./img/ok-icon.png"><span class="payment-top-text">收款成功</span>
            </div>
            <div class="payment-section payment-hooker" id="payment-section">
                <div>
                    <div class="payment-content">
                        <div class="payment-content-amount">
                            <span class="pay-amount-text">实收金额</span>
                            <span class="pay-amount discount-amount">&yen;{{itemDetail.ordAmt}}</span>
                        </div>
                        <div class="payment-content-received">
                            <div class="payment-content-received-amount">
                                <span class="received-amount-text">应收金额</span>
                                <span class="received-amount-money discount-amount">&yen;{{itemDetail.orgAmt}}</span>
                            </div>
                            <div class="payment-content-received-coupon" v-show="itemDetail.benefitAmt">
                                <span class="received-amount-text">优惠劵</span>
                                <span class="received-amount-money discount-amount">-&yen;{{itemDetail.benefitAmt}}</span>
                            </div>
                            <div class="payment-content-received-coupon" v-show="itemDetail.fullCutAmt">
                                <span class="received-amount-text">满减</span>
                                <span class="received-amount-money discount-amount">-&yen;{{itemDetail.fullCutAmt}}</span>
                            </div>
                            <div class="payment-content-received-coupon" v-show="itemDetail.pointAmt && itemDetail.pointAmt!='0'">
                                <span class="received-amount-text">积分优惠</span>
                                <span class="received-amount-money discount-amount">-&yen;{{itemDetail.pointAmt}}</span>
                            </div>
                        </div>
                      <div class="receipt-content-info">
                        <dl>
                          <dt>收款终端</dt>
                          <dd>其他终端</dd>
                        </dl>
                        <dl>
                          <dt>商户号</dt>
                          <dd>{{itemDetail.mercId}}</dd>
                        </dl>
                        <dl>
                          <dt>商品名称</dt>
                          <dd>{{itemDetail.goodsDesc}}</dd>
                        </dl>
                        <dl>
                          <dt>商户名称</dt>
                          <dd>{{itemDetail.mercNm}}</dd>
                        </dl>
                        <dl>
                          <dt>优惠劵号</dt>
                          <dd>{{itemDetail.discountId || '无'}}</dd>
                        </dl>
                        <dl>
                          <dt>交易单号</dt>
                          <dd>{{itemDetail.orderNo}}</dd>
                        </dl>
                        <dl>
                          <dt>商户单号</dt>
                          <dd>{{itemDetail.merOrderNo}}</dd>
                        </dl>
                        <dl>
                          <dt>下单时间</dt>
                          <dd>{{itemDetail.creDt|formatDate}}&nbsp;{{itemDetail.creTm|formatTime}}</dd>
                        </dl>
                        <dl>
                          <dt>支付方式</dt>
                          <dd>{{itemDetail.capCorg|formatBank}}{{itemDetail.payTyp==='DQP'?'借记卡':'信用卡'}}</dd>
                        </dl>
                        <dl>
                          <dt>交易状态</dt>
                          <dd>{{itemDetail.ordersts|formatState}}</dd>
                        </dl>
                        <dl>
                          <dt>完成时间</dt>
                          <dd>{{itemDetail.creDt|formatDate}}&nbsp;{{itemDetail.creTm|formatTime}}</dd>
                        </dl>
                      </div>
                    </div>
                    <div class="payment-content-barcode">
                        <img src="./img/line-img03.png">
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
    import BScroll from 'better-scroll';
    export default {
        props: {
            itemDetail:{
                type:Object,
                default:function(){
                    return {}
                }
            },
            showDetail: {
                type: String,
                default: '0'
            }
        },
        data: function () {
            return {
                title: '交易详情'
            }
        },
        methods: {
            back: function(){
                this.$emit('hide');
            },
            _initPaymentScroll: function(){
                console.log(this.itemDetail,1)
                let hook = document.getElementsByClassName('payment-hooker')[0];
                if(!this.paymentScroll){
                    this.paymentScroll = new BScroll(hook, {
                        click: true
                    });
                } else {
                    this.paymentScroll.refresh();
                }
            }
        },
        mounted :function () {
            if(this.$getOs() === 'iOS') {
                var payment = document.getElementById('payment');
                payment.style.paddingTop = '20px';
                var paymentSection = document.getElementById('payment-section');
                paymentSection.style.top = '6.4rem';
            }
            let _self = this;
            this.$back.subBack(()=>{
                _self.$emit('hide');
            })
            this.$nextTick(()=>{
                console.log(this.itemDetail)
            })
        },
        filters:{
            formatDate(date){
                if(date){
                    return date.slice(0,4)+"-"+date.slice(4,6)+'-'+date.slice(6);
                }
            },
            formatTime(time){
                if(time){
                    return time.slice(0,2)+':'+time.slice(2, 4)+':'+time.slice(4);
                }
            },
            formatState(state){
                if(state){
                    if(state==='S1'){
                        return '支付成功';
                    }else if(state==='S'){
                        return '已退款';
                    }else if(state==='F'){
                        return '已关闭';
                    }
                }
            },
            formatType(val){
                if(val){
                   return '('+val.slice(-4)+')';
                }
            },
            formatBank(val){
                let bank = {
                    'CCB':'建设银行',
                    'ABC':'农业银行',
                    'ICBC':'工商银行',
                    'BOC':'中国银行',
                    'CMBC':'民生银行',
                    'CMB':'招商银行',
                    'CIB':'兴业银行',
                    'BCM':'交通银行',
                    'CEB':'光大银行',
                    'GDB':'广东发展银行'
                }
                console.log(bank[val])
                return bank[val];

            }
        },
        watch: {
            showDetail(){
               if(this.showDetail==='1'){
                console.log(this.itemDetail)
                let _self=this;
                this.$back.subBack(()=>{
                    _self.$emit('hide');
                })
                this.$nextTick(function(){
                    this._initPaymentScroll();
                });
               }
            }
        }
    }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .payment {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        overflow: hidden;
        z-index: 50;
        background: #FFFFFF;
        letter-spacing: 0;
        transition: all, 0.2s linear;
        transform: translate3d(0, 0, 0);
        &.move-enter, &.move-leave-active{
            transform: translate3d(100%, 0, 0);
        }

        .payment-top {
            width: 100%;
            height: 3.2rem;
            background-color: #F4F4F4;
            padding-top: .75rem;
            padding-left: .75rem;
            border-bottom: 1px solid #DDDDDD;

            img {
                width: 1.7rem;
                height: 1.7rem;
                vertical-align: middle;
            }

            .payment-top-text {
                margin-left: .4rem;
                color: #28AF49;
                font-size: .95rem;
                line-height: 1.325rem;
            }

        }
        .payment-section {
            position: absolute;
            top: 5.4rem;
            bottom: 0;
            width: 100%;
            overflow: hidden;

            .payment-content {

                .payment-content-amount {
                    margin-left: .75rem;
                    border-bottom: 1px solid #DDDDDD;
                    padding-top: .7rem;
                    padding-bottom: .7rem;
                    line-height: 1.25rem;

                    .pay-amount-text {
                        font-size: .8rem;
                    }

                    .pay-amount {
                        float: right;
                        padding-right: .75rem;
                        font-size: .9rem;
                    }

                }
                .payment-content-received {
                    margin-left: .75rem;
                    border-bottom: 1px solid #DDDDDD;
                    padding-top: .275rem;
                    padding-bottom: .275rem;
                    line-height: 1.5rem;

                    .received-amount-text {
                        font-size: .75rem;
                        color: #666666;
                    }

                    .received-amount-money {
                        float: right;
                        padding-right: .75rem;
                        font-size: .8rem;
                    }

                }
                .discount-amount {
                    color: #FF6600;
                }
              @import "../../common/scss/item-dl";

            }
            .payment-content-barcode {
                text-align: center;

                img {
                    width: 15.5rem;
                    height: 2.665rem;
                }

            }
        }
    }
</style>
