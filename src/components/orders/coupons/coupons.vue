<template>
    <div class="coupons coupons-list-hooker" ref="wrapper">
        <div class="coupon-list-wrapper" ref="itemWrapper">
            <div class="item-wrapper" @click="toDetail" v-for="detail in couponItems">
              <div class="item">
                <div class="left-block">
                  <div class="line">
                    <div class="img-wrapper sale"></div>
                    <div class="order-number">{{detail.discountVal}}元{{detail.discountName}}</div>
                  </div>
                  <div class="time">
                    {{ detail.discountUseOrdNo }}
                    </div>
                </div>

                <div class="right-block clear">
                  <div class="order-mount">&yen;50.00</div>
                  <div class="order-state">{{detail.useDat}}</div>
                </div>
              </div>
            </div>
        </div>
    </div>

</template>

<script>

import successfulTrade from '../../successfultrade/successfultrade.vue';
import BScroll from 'better-scroll';
export default {
    props: {
        orderDate:{
            type:String,
            default:''
        }
    },
    components: {
        'successful-trade': successfulTrade
    },
    data: function(){
        return {
          showDetail: '0',
          couponItems: [],
          payMethod:'sale',
          pageNum:1,
          canscroll:true
        }
    },
    methods:{
        toDetail: function(){
            this.showDetail = '1';
        },
        hide: function(){
            this.showDetail = '0';
        },
        _initCouponsScroll: function(){
            let hook = document.getElementsByClassName('coupons-list-hooker')[0];
            if(!this.couponsScroll){
                this.couponsScroll = new BScroll(hook, {
                    click: true,
                    probeType:3
                });
                this.couponsScroll.on('scroll', (pos) => {
                  if(this.canscroll&&this.$refs.itemWrapper.clientHeight+pos.y-this.$refs.wrapper.clientHeight<150){
                    this.canscroll=false;
                    this.queryConpons(this.orderDate);
                  }
                })
            } else {
                this.couponsScroll.refresh();
            }
        },
        getToday: function(){
            let now = new Date();
            let year = now.getFullYear();
            let month = now.getMonth()+1;
            if(month<10) {
                month = '0'+month;
            }
            let day =  now.getDate();
            if(day<10) {
                day = '0'+day;
            }
            return (year + '' + (month) + '' + day);
        },
        queryConpons:function (date) {
          let that = this;


          let startDate;
          if(date) {
              startDate = date;
          }else {
              startDate = this.orderDate;
          }
          startDate = startDate.replace(/-/g,"");


          let merch = JSON.parse(localStorage.getItem('merchUser'));
          that.$indicator.open('加载中...');
          setTimeout(()=> that.$indicator.close(),300);
          console.log(this.pageNum,startDate,)
          console.log(JSON.stringify({
              userSign:'',
              mercId:merch.mercId,
              cnlTyp:'www',
              startDate:startDate,
              pageNum:that.pageNum,
              pageSize:10
            }))
          this.$post('discountInfoQuery',{
              userSign:'',
              mercId:merch.mercId,
              cnlTyp:'www',
              startDate:startDate,
              pageNum:that.pageNum,
              pageSize:10
            },
            function (resData) {
              if(resData.data.returnSts=='RPM00000') {
                console.log(resData.data.discountList)
                let couponItems = resData.data.discountList;
                // console.log('couponsItems: ' + JSON.stringify(couponItems));
                
                if(that.canscroll&&that.pageNum===1){
                  that.couponItems = couponItems;
                }else{
                  that.couponItems = that.couponItems.concat(couponItems);
                }
                if(couponItems.length<10){
                  that.canscroll=false;
                }else{
                  that.canscroll=true;
                }

                that.pageNum+=1;
                let count=resData.data.totalCount;
                let sumAmount=0;
                let today = that.getToday();
                for(let i=0;i<that.couponItems.length;i++) {
                  sumAmount = sumAmount+parseFloat(that.couponItems[i].discountVal);
                  let useDat = that.couponItems[i].useDat;
                  if(useDat.indexOf('/')<0){
                    if(useDat.slice(0,8) < today){       // 如果日期小于今天
                      that.couponItems[i].useDat = useDat.slice(0,4) + '/' + useDat.slice(4,6) + '/' + useDat.slice(6,8);
                    } else {                // 如果等于今天
                      that.couponItems[i].useDat = useDat.slice(8,10) + ':' + useDat.slice(10,12) + ':' + useDat.slice(12);
                    }
                  }
                  
                }
                that.$emit('setSubAmount', count*50);
                that.$emit('setSubDesc', '已经使用卡劵'+count+'张');
                that.$nextTick(function(){
                  that._initCouponsScroll();
                })
              }else {
                that.$quickTip(resData.data.returnMsg);
              }
            },
            function (res) {
              that.$quickTip('请求错误'+res);
            })
        }
    },
    created:function () {
      this.queryConpons();
    },
    watch: {
        // couponItems: function(){
        //     this._initCouponsScroll();
        // },
        orderDate() {
          this.canscroll=true;
          this.pageNum=1;
          this.queryConpons(this.orderDate);
          if(this.couponsScroll){
            this.couponsScroll.scrollTo(0,0);
          }
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .coupons {
        position: absolute;
        top: 11.925rem;
        bottom: 0;
        padding-bottom: 0.4rem;
        width: 100%;
        overflow: hidden;

        .coupon-list-wrapper {
            width: 100%;
            .item-wrapper {
              .sale {
                height: 0.835rem;
                background: url("./img/sale-icon.png") no-repeat;
                background-size: 100%;
                vertical-align: middle;
              }
              @import "../../../common/scss/item";
            }
        }
    }

</style>
