<template>
    <transition name="move">
        <div class="successful-trade" id="successful-trade">
            <v-header :title="title" :rightTip="rightTip" :return="'0'" @back="back"></v-header>
            <div class="successful-trade-top">
                <img src="./img/ok-icon.png"><span class="successful-trade-top-text">收款成功</span>
            </div>
            <div class="successful-trade-section" id="successful-trade-section">
                <div class="successful-trade-content">
                    <div class="successful-trade-content-title"><span v-show="successData.busTyp == '2001'">10元{{successData.discountName}}</span></div>
                    <div class="successful-trade-content-money">
                        <span v-if="successData.busTyp == '2001'">&yen;{{successData.ordAmt |formatMoney}}</span>
                        <span v-else-if="successData.busTyp == '2002'">&yen;{{realPayAmount |formatMoney}}</span>
                        <span v-else>&yen;0.00</span>
                    </div>
                    <div class="successful-trade-content-info">
                        <dl>
                            <dt>应收金额</dt>
                            <dd v-if="successData.busTyp == '2001'">&yen;60</dd>
                            <dd v-else>&yen;{{successData.orgAmt || '0.00' | formatMoney}}</dd>
                        </dl>
                        <dl v-if="successData.busTyp == '2002'&&successData.discountId!==''">
                            <dt>优惠劵</dt>
                            <dd class="discount-amount">-&yen;{{successData.benefitAmt || '0.00' |formatMoney}}</dd>
                        </dl>
                        <dl v-if="successData.busTyp == '2002'&&successData.fullCutAmt">
                            <dt>满减</dt>
                            <dd class="discount-amount">-&yen;{{successData.fullCutAmt || '0.00' |formatMoney}}</dd>
                        </dl>
                        <dl v-if="successData.discountId!==''">
                            <dt>优惠劵号</dt>
                            <dd>{{successData.discountId}}</dd>
                        </dl>
                        <dl>
                            <dt>支付方式</dt>
                            <dd>{{successData.payTyp | formatType}}</dd>
                        </dl>
                        <dl>
                            <dt>交易时间</dt>
                            <dd>{{successData.creDt|formatDate}} {{successData.creTm|formatTime}}</dd>
                        </dl>
                        <dl>
                            <dt>交易单号</dt>
                            <dd>{{successData.orderNo}}</dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
    const PAYTYPE = {
        'DQP': '借记卡支付',
        'CQP': '信用卡支付'
    };
    export default {
        data: function () {
            return {
                title: '交易成功',
                rightTip: '完成',
                successData:{},
                returnmake:'0'
            }
        },
        methods: {
            back: function(){
                if(this.returnmake == '1') {
                  this.$router.replace('/main/make');
                }else {
                  this.$router.back();
                }
            }
        },
        created:function () {
            let params = this.$route.params;
            console.log(params)
            this.returnmake = params.receipt;
            this.successData = params;
            this.successData.ordAmt = (params.orgAmt||0) - (params.fullCutAmt||0) - (params.benefitAmt||0);
        },
        mounted:function () {
            if(this.$getOs() === 'iOS') {
                var payment = document.getElementById('successful-trade');
                payment.style.paddingTop = '20px';
                var paymentSection = document.getElementById('successful-trade-section');
                paymentSection.style.top = '6.4rem'
            }
        },
        computed:{
            realPayAmount:function () {
                let amount = this.successData.orgAmt;
                if(this.successData.benefitAmt) {
                   amount-=parseFloat(this.successData.benefitAmt);
                }
                if(this.successData.fullCutAmt) {
                  amount-=parseFloat(this.successData.fullCutAmt);
                }
                return amount;
            }
        },
        filters:{
            formatType:function (type) {
                return PAYTYPE[type] || '';
            },
            formatDate(date){
                if(date){
                    return date.slice(0,4)+"-"+date.slice(4,6)+'-'+date.slice(6);
                }
            },
            formatTime(time){
                if(time){
                    return time.slice(0,2)+':'+time.slice(2, 4)+':'+time.slice(4);
                }
            }
        }
    }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .successful-trade {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        overflow: hidden;
        z-index: 50;
        background: #F4F4F4;
        transition: all 0.2s linear;
        transform: translate3d(0, 0, 0);
        &.move-enter, &.move-leave-active{
            transform: translate3d(100%, 0, 0);
        }

        .successful-trade-top {
            width: 100%;
            height: 3.2rem;
            padding-top: .75rem;
            padding-left: .75rem;

            img {
                width: 1.7rem;
                height: 1.7rem;
                vertical-align: middle;
            }

            .successful-trade-top-text {
                margin-left: .4rem;
                color: #28AF49;
                letter-spacing: 0;
                font-size: .95rem;
                line-height: 1.325rem;
            }

        }

        .successful-trade-section{
            position: absolute;
            top: 5.4rem;
            bottom: 0;
            overflow: auto;
            width: 100%;
            background-color: #F4F4F4;
            .successful-trade-content {
                background-color: #FFF;
                border-top: 1px solid #CCCCCC;
                border-bottom: 1px solid #CCCCCC;

                .successful-trade-content-title {
                    text-align: center;
                    color: #666666;
                    letter-spacing: 0;
                    font-size: .8rem;
                    margin-top: 1.175rem;
                    line-height: 1.125rem;
                }

                .successful-trade-content-money {
                    margin-top: .45rem;
                    text-align: center;
                    margin-left: 1rem;
                    color: #333333;
                    letter-spacing: 0;
                    font-size: .9rem;
                    line-height: 1.25rem;

                    span {
                        margin-left: .15rem;
                        color: #151515;
                        letter-spacing: 0;
                        font-size: 1.6rem;
                        line-height: 1.25rem;
                    }

                }
                .successful-trade-content-info {
                    margin: 1rem .75rem .85rem;
                    overflow: hidden;

                    dl {
                        clear: left;
                        line-height: 1.5rem;

                        dt {
                            float: left;
                            color: #666666;
                            letter-spacing: 0;
                            font-size: .75rem;
                        }

                        dd {
                            float: right;
                            color: #666666;
                            letter-spacing: 0;
                            font-size: .8rem;
                        }

                        .discount-amount {
                            color: #FF7622;
                        }

                    }
                }
            }
        }
    }
</style>
