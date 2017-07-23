<template>
    <div class="orders" @click.capture="hideState($event)">
        <v-header :title="title" :return="'0'" @back="back" :show-back="'0'"></v-header>
        <datepicker :showDate="showDate" @confirm.self="confirmDate" @cancel="cancelSel"></datepicker>
        <div class="top">
            <div class="date">
                今日流水({{date}})<span class="date-click" @click.self="toShowPicker"></span>
            </div>
            <p class="money">
                <span class="mark"><b>&yen;</b></span>
                <span class="num"><b>{{submitAmount | formatMoney}}</b></span>
            </p>
            <p class="text">{{submitDesc}}</p>
        </div>

        <div class="tap">
            <div class="order" :class="{'selected': show === '1'}" @click="toggleShow('1')">订单</div>
            <div class="coupons" :class="{'selected': show === '2'}" @click="toggleShow('2')">卡券</div>
            <div class="refund" :class="{'selected': show === '3'}" @click="toggleShow('3')">退款</div>
        </div>

        <order v-if="show === '1'"  @setSubAmount="setSubAmount" @setSubDesc="setSubDesc" ref="orderChild" :orderDate="date"></order>
        <coupons v-if="show === '2'" @setSubAmount="setSubAmount" @setSubDesc="setSubDesc" :orderDate="date" ref="couponChild"></coupons>
        <refund v-if="show === '3'" @setSubAmount="setSubAmount" @setSubDesc="setSubDesc"></refund>

    </div>

</template>

<script>

import order from './order/order.vue';
import coupons from './coupons/coupons.vue';
import refund from './refund/refund.vue';
import datepicker from './datepicker.vue';
export default {
    components: {
        order,
        coupons,
        refund,
        datepicker
    },
    data: function(){
        return {
            title: '收款订单',
            date: '',
            show: '1',
            submitAmount:0,
            submitDesc:'全部订单0笔',
            showDate:false
        }
    },
    methods: {
        hideState(e){
            if(this.$refs.orderChild){
                this.$refs.orderChild.hideState(e);
            }
        },
        back: function(){
            console.log('111');
        },
        confirmDate:function (paramsArray) {
         /* let inputDate = new Date(paramsArray[0].replace(/-/g,"\/"));
          let nowData=  new Date();*/
          console.log("不能大于今天",paramsArray[1]);
          if(paramsArray[1] == 1) {
            this.$toast({message:'选择日期不能超过今天',duration:1000});
            return;
          }else {
            this.date = paramsArray[0];
            if(this.show=='1') {
              this.showDate = false;
              // this.$refs.orderChild.queryOrders(paramsArray[0]);
            }else if(this.show=='2') {
              this.showDate = false;
              // this.$refs.couponChild.queryConpons(true);
            }

          }
        },
        cancelSel:function () {
            this.showDate = false;
        },
        toShowPicker: function () {
          this.showDate = true;
        },
        getTime: function(){
            let date = new Date();
            this.date = date.getFullYear() + '-' + ('00' + (date.getMonth()+1)).slice(-2) + '-' +
            ('00' + (date.getDate())).slice(-2)
        },
        toggleShow: function(show){
            this.show = show;
        },
        trigger: function(){
            let inputDate = this.$refs['orders-date'];
        },
        test: function(){
        },
        setSubAmount:function (amount) {
          this.submitAmount = amount;
        },
        setSubDesc:function (desc) {
          this.submitDesc = desc;
        }
    },
    created: function(){
        this.getTime();
        this.$emit('footerChange', '3');
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .orders {
        position: absolute;
        top: 0;
        bottom: 2.5rem;
        width: 100%;
        overflow: hidden;

        .top {
            position: relative;
            width: 100%;
            height: 7.5rem;
            background: url("./pay-bg.png") no-repeat;
            background-size: 100% 100%;
            color: #FFFFFF;

            .date {
                padding-top: .625rem;
                //height: 1.05rem;
                line-height: 1.05rem;
                font-size: 0.75rem;
                letter-spacing: 0;
                text-align: center;
                z-index: 10;
                height: auto;
                .date-click {
                  display: inline-block;
                  border-left: 5px solid transparent;
                  border-right: 5px solid transparent;
                  border-top: 10px solid #D9BAE7;
                  margin-left: 4px;
                  opacity: 0.65;
                }

                .val {
                    display: inline-block;
                    margin: 0;
                    background: transparent;
                    font-size: 0.75rem;
                    color: #FFFFFF;
                    letter-spacing: 0;
                    outline: none;
                    width: auto;
                    vertical-align: middle;
                }
            }

            .money {
                position: relative;
                height: 2.5rem;
                line-height: 1.4rem;
                color: #FFFFFF;
                text-align: center;
                padding-top: 1rem;

                .mark {
                    font-size: 1rem;
                    letter-spacing: 0;
                    font-weight: 200;
                }
                .num {
                    font-size: 1.8rem;
                    letter-spacing: 0;
                    font-weight: 200;
                }
            }
            .text {
                padding-top: 1rem;
                text-align: center;
                font-size: 0.7rem;
                color: #FFFFFF;
                letter-spacing: 0;
                line-height: 1rem;
            }
        }

        .tap {
            display: flex;
            border-top: 1px solid #BBBBBB;
            height: 2.2rem;
            line-height: 2.2rem;

            .order, .coupons, .refund {
                flex: 1;
                border-bottom: 1px solid #BBBBBB;
                text-align: center;
                font-size: 0.75rem;
                color: #333333;
                letter-spacing: 0;

                &.selected {
                    color: #FF6600;
                    border-bottom: 2px solid #FF6600;
                }
            }
        }
    }

</style>
