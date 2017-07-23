<template>
    <transition name="move">
        <div class="refund-detail" id="refund-detail">
            <v-header :title="title" :return="'0'" @back="back"></v-header>
            <div class="refund-top">
                <img src="./img/ok-icon.png"><span class="refund-top-text">退款成功</span>
            </div>
            <div class="refund-section refund-detail-hooker" id="refund-section">
                <div class="refund-content">
                    <div class="refund-content-amount">
                        <span class="refund-amount-text">退款金额</span>
                        <span class="refund-amount discount-amount">&yen;70.00</span>
                    </div>
                    <div class="refund-content-amount">
                        <span class="refund-amount-text">交易金额</span>
                        <span class="refund-amount discount-amount">&yen;70.00</span>
                    </div>
                  <div class="receipt-content-info">
                    <dl>
                      <dt>收款终端</dt>
                      <dd>其他终端</dd>
                    </dl>
                    <dl>
                      <dt>商户号</dt>
                      <dd>3498734958</dd>
                    </dl>
                    <dl>
                      <dt>商品</dt>
                      <dd>洗发水</dd>
                    </dl>
                    <dl>
                      <dt>商户名称</dt>
                      <dd>屈臣氏</dd>
                    </dl>
                    <dl>
                      <dt>优惠劵号</dt>
                      <dd>30498520935723049857</dd>
                    </dl>
                    <dl>
                      <dt>交易单号</dt>
                      <dd>2323434598743598783974</dd>
                    </dl>
                    <dl>
                      <dt>商户单号</dt>
                      <dd>234923874293874923874</dd>
                    </dl>
                    <dl>
                      <dt>下单时间</dt>
                      <dd>2017-03-28 14:58:43</dd>
                    </dl>
                    <dl>
                      <dt>支付方式</dt>
                      <dd>光大银行信用卡</dd>
                    </dl>
                    <!-- <dl>
                       <dt>交易状态</dt>
                       <dd>支付成功</dd>
                     </dl>-->
                    <dl>
                      <dt>完成时间</dt>
                      <dd>2017-03-28 14:59:08</dd>
                    </dl>
                    <dl>
                      <dt>退款单号</dt>
                      <dd>452435245454454545</dd>
                    </dl>
                    <dl>
                      <dt>退款申请时间</dt>
                      <dd>2017-04-01 15:34:23</dd>
                    </dl>
                    <dl>
                      <dt>退款状态</dt>
                      <dd>退款成功</dd>
                    </dl>
                    <dl>
                      <dt>退款完成时间</dt>
                      <dd>2017-04-01 15:34:25</dd>
                    </dl>
                  </div>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
    import BScroll from 'better-scroll';
    export default {
        data: function () {
            return {
                title: '退款详情'
            }
        },
        props: {
            showDetail: {
                type: String,
                default: '0'
            }
        },
        methods: {
            back: function(){
                this.$emit('hide');
            },
            _initRefundScroll: function(){
                let hook = document.getElementsByClassName('refund-detail-hooker')[0];
                if(!this.refundDetailScroll){
                    this.refundDetailScroll = new BScroll(hook, {
                        click: true
                    });
                } else{
                    this.refundDetailScroll.refresh();
                }
            }
        },
        mounted :function () {
            if(this.$getOs() === 'iOS') {
                var payment = document.getElementById('refund-detail');
                payment.style.paddingTop = '20px';
                var paymentSection = document.getElementById('refund-section');
                paymentSection.style.top = '6.4rem';
            }
            let _self = this;
            this.$back.subBack(()=>{
                _self.$emit('hide');
            })
        },
        watch: {
            showDetail: function(){
                if(this.showDetail === '1'){
                    console.log('...');
                    this.$nextTick(function(){
                        this._initRefundScroll();
                    });
                    let _self=this;
                    this.$back.subBack(()=>{
                        _self.$emit('hide');
                    })
                }
            }
        }
    }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .refund-detail {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        overflow: hidden;
        z-index: 50;
        width: 100%;
        background-color: #FFFFFF;
        transition: all 0.2s linear;
        transform: translate3d(0, 0, 0);
        &.move-enter, &.move-leave-active{
            transform: translate3d(100%, 0, 0);
        }

        .refund-top {
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

            .refund-top-text {
                margin-left: .4rem;
                color: #28AF49;
                font-size: .95rem;
                line-height: 1.325rem;
            }

        }
        .refund-section {
            position: absolute;
            top: 5.4rem;
            bottom: 0;
            overflow: hidden;
            width: 100%;

            .refund-content {
                width: 100%;

                .refund-content-amount {
                    margin-left: .75rem;
                    border-bottom: 1px solid #DDDDDD;
                    padding-top: .7rem;
                    padding-bottom: .7rem;
                    line-height: 1.25rem;

                    .refund-amount-text {
                        font-size: .8rem;
                    }

                    .refund-amount {
                        float: right;
                        padding-right: .75rem;
                        font-size: .9rem;
                    }

                }
              @import "../../common/scss/item-dl";
            }
            .discount-amount {
                color: #FF6600;
            }
        }
    }
</style>
