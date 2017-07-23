<template>
    <div class="item">
        <div class="left-block">
            <div class="line">
                <div class="img-wrapper" :class="payMethod"></div>
                <div class="order-number">{{ detail.orderNum || detail.text  || detail.orderNo}}</div>
            </div>
            <div class="time">
                {{ detail.time  || detail.creTm}}
            </div>
        </div>

        <div class="right-block clear">
            <div class="order-mount">&yen;{{ detail.mount || detail.ordAmt | formatMoney}}</div>
            <div class="order-state">{{detail.state || detail.ordersts | formatSts}}</div>
        </div>
    </div>

</template>

<script>
const orderType = {
    W1:	'待支付',
    W2:	'付款申请中',
    W4:	'银行处理中',
    S1:	'支付成功',
    S:	'退款成功',
    F:	'交易关闭'
 };
export default {
    props: {
        detail: {
            type: Object,
            default: function(){
                return {
                    orderNum: '',
                    payMethod: '',
                    time: '',
                    mount: '',
                    state: ''
                }
            }
        },
        payMethod: {
            type:String,
            default:''
        }
    },
    filters:{
        formatSts: function(ordersts){
            return orderType[ordersts] || ordersts;
        },
        formatMoney:function (money) {
          var f = parseFloat(money);
          if (isNaN(f)) {
            return false;
          }
          var f = Math.round(money*100)/100;
          var s = f.toString();
          var rs = s.indexOf('.');
          if (rs < 0) {
            rs = s.length;
            s += '.';
          }
          while (s.length <= rs + 2) {
            s += '0';
          }
          return s;
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .item {
        padding: 0.675rem 0.75rem 0.6rem;
        height: 3.75rem;
        border-bottom: 1px solid #CCCCCC;

        .left-block {
            position: relative;
            display: inline-block;
            height: 100%;

            .line {
                height: 1.2rem;
                line-height: 1.2rem;

                .img-wrapper {
                    display: inline-block;
                    width: 1.2rem;

                    &.wx {
                        height: 1.2rem;
                        background: url("./wx-pay-icon.png") no-repeat;
                        background-size: 100%;
                        vertical-align: middle;
                     }

                    &.ali {
                        height: 1.2rem;
                        background: url("./alipay-icon.png") no-repeat;
                        background-size: 100%;
                        vertical-align: middle;
                     }

                    &.sale {
                        height: 0.835rem;
                        background: url("./sale-icon.png") no-repeat;
                        background-size: 100%;
                        vertical-align: middle;
                     }
                    &.order {
                        height: 1.2rem;
                        background: url("./order-pay.png") no-repeat;
                        background-size: 100%;
                        vertical-align: middle;
                    }
                }

                .order-number {
                    display: inline-block;
                    font-size: 0.8rem;
                    color: #333333;
                    letter-spacing: 0;
                }
            }
            .time {
                margin-top: 0.3rem;
                font-size: 0.7rem;
                color: #666666;
                letter-spacing: 0;
            }
        }

        .right-block {
            float: right;
            padding-top: 0.15rem;
            height: 100%;
            .order-mount {
                font-size: 0.75rem;
                color: #666666;
                letter-spacing: 0;
                text-align: right;
                height: 1.05rem;
            }

            .order-state {
                margin-top: 0.1rem;
                font-size: 0.7rem;
                color: #666666;
                letter-spacing: 0;
                height: 1rem;
                line-height: 1rem;
            }
        }
    }


</style>
