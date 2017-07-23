<template>
    <div class="refund refund-list-hooker">
        <div class="refund-list-wrapper">
            <div class="item-wrapper" @click="toDetail">
              <div class="item-wrapper" @click="toDetail">
                <div class="item">
                  <div class="left-block">
                    <div class="line">
                      <div class="img-wrapper wx"></div>
                      <div class="order-number">{{ detail.orderNum}}</div>
                    </div>
                    <div class="time">
                      {{ detail.time||'10:12:32' }}
            </div>
                  </div>

                  <div class="right-block clear">
                    <div class="order-mount">&yen;{{ detail.mount}}</div>
                    <div class="order-state">{{detail.state | formatSts}}</div>
                  </div>
                </div>
              </div>
              <div class="item-wrapper" @click="toDetail">
                <div class="item">
                  <div class="left-block">
                    <div class="line">
                      <div class="img-wrapper ali"></div>
                      <div class="order-number">{{ detail.orderNum}}</div>
                    </div>
                    <div class="time">
                      {{ detail.time||'10:12:32' }}
                    </div>
                  </div>

                  <div class="right-block clear">
                    <div class="order-mount">&yen;{{ detail.mount}}</div>
                    <div class="order-state">{{detail.state | formatSts}}</div>
                  </div>
                </div>
              </div>
            </div>
        </div>
        <refund-detail @hide="hide" v-show="showDetail==='1'" :show-detail="showDetail"></refund-detail>
    </div>

</template>

<script>
import refundDetail from '../../refunddetail/refunddetail.vue';
import BScroll from 'better-scroll';
export default {
    components: {
        'refund-detail': refundDetail
    },
    data: function(){
        return {
            detail: {
                orderNum: '34234598345',
                payMethod: 'ali',
                time: '10:12:32',
                mount: '347.00',
                state: 'S'
            },
            showDetail: '0',
            payMethod: 'ali',
            payMethod2: 'wx'
        }
    },
    methods: {
        toDetail: function(){
            this.showDetail = '1';
        },
        hide: function(){
            this.showDetail = '0';
        },
        _initRefundScroll: function(){
            let hook = document.getElementsByClassName('refund-list-hooker')[0];
            if(!this.refundScroll){
                this.refundScroll = new BScroll(hook, {
                    click: true
                });
            } else {
                this.refundScroll.refresh();
            }
        }
    },
    created:function () {
        this.$emit('setSubAmount', 694.00);
        this.$emit('setSubDesc', '退款已受理'+2+'笔');
        let that = this;
        this.$nextTick(function(){
            that._initRefundScroll();
        });
    }
    
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .refund {
        position: absolute;
        top: 11.925rem;
        bottom: 0;
        padding-bottom: 0.4rem;
        width: 100%;
        overflow: hidden;

        .refund-list-wrapper {
            width: 100%;
            .item-wrapper {
              .wx {
                height: 1.2rem;
                background: url("./img/wx-pay-icon.png") no-repeat;
                background-size: 100%;
                vertical-align: middle;
              }

              .ali {
                height: 1.2rem;
                background: url("./img/alipay-icon.png") no-repeat;
                background-size: 100%;
                vertical-align: middle;
              }
              @import "../../../common/scss/item";
            }
        }
    }

</style>
