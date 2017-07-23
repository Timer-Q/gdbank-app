<template>
    <div class="order" @click.capture="hideState($event)">
        <div class="status">
            <span class="text">支付成功</span>
            <div class="state-wrapper" v-show="show ==='0'" @click.stop.prevent="showSelect">
                <div class="triangle"></div>
                <div class="select-state">{{ showState }}</div>
            </div>
            <ul class="select" v-show="show ==='1'" @click.stop.prevent="selectState">
                <div class="triangle"></div>
                <li data-value="">订单状态</li>
                <li data-value="">全部</li>
                <li data-value="S1">支付成功</li>
                <li data-value="F">已关闭</li>
                <li data-value="S">已退款</li>
            </ul>
        </div>

        <div class="order-list-wrapper order-list-hooker" ref="wrapper">
            <div ref="itemWrapper">
                <div class="item-wrapper" @click="toDetail(detail)" v-for="detail in items">
                  <div class="item">
                    <div class="left-block">
                      <div class="line">
                        <div class="img-wrapper order-gd"></div>
                        <div class="order-number">{{detail.orderNo}}</div>
                      </div>
                      <div class="time">
                        {{detail.orderDate}}
                      </div>
                    </div>

                    <div class="right-block clear">
                      <div class="order-mount">&yen;{{detail.ordAmt | formatMoney}}</div>
                      <div class="order-state">{{detail.ordersts | formatSts}}</div>
                    </div>
                  </div>
                </div>
            </div>
        </div>

        <payment-detail v-show="showDetail === '1'" @hide="hide" :itemDetail="itemDetail" :show-detail="showDetail"></payment-detail>

    </div>

</template>

<script>
import paymentDetail from '../../paymentdetail/paymentdetail.vue';
import BScroll from 'better-scroll';
export default {
    props: {
        orderDate:{
            type:String,
            default:''
        }
    },
    components: {
        'payment-detail': paymentDetail
    },
    data: function(){
        return {
            state: '',
            show: '0',
            showState: '订单状态',
            items:[],
            itemDetail:{},
            /*detail: {
                orderNum: '34234598345',
                payMethod: 'ali',
                time: '10:12:32',
                mount: '347.00',
                state: '支付成功'
            },*/
            showDetail: '0',
            payMethod:'order',
              pageNum:1,
              canscroll:true
        }
    },
    methods: {
        showSelect: function(){
            this.show = '1';
        },
        selectState: function(e){
            let target = e.target;
            this.showState = target.innerHTML;
            if (this.showState) {
                this.state = target.getAttribute('data-value');
                this.show = '0';
            }
            // this.queryOrders();
        },
        toDetail: function(item){
            if(item.ordersts=='S1') {
              this.itemDetail = item;
              this.showDetail = '1';
            }
        },
        hide: function(){
            this.showDetail = '0';
        },
        hideState(e){
            if(this.show=='1'){
                // console.log(e.target.parentNode.classList)
                if(e.target.parentNode.classList.contains('select')>0&&!e.target.classList.contains('triangle')){
                    this.selectState(e);
                }else{
                    e.stopPropagation();
                    e.preventDefault();
                }
                this.show="0";
                return;
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
        queryOrders: function (date) {
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
            this.$post('orderListQuery',{
                userSign:'',
                mercNo:merch.mercId,
                ordSts:that.state,
                usrOprId:merch.usrOprId,
                startDate:startDate,
                cnlTyp:'www',
                  pageNum:that.pageNum,
                  pageSize:10
            },
            function (resData) {
                if(resData.data.returnSts=='RPM00000') {
                    let items = resData.data.orderInfoList;
                    let count=resData.data.totalCount||0;
                    let sumAmount=resData.data.ordersTotalAmt||0;
                    let today = that.getToday();
                    if(that.state===''||that.state==='S1'){
                        if(that.canscroll&&that.pageNum===1){
                          that.items = items;
                        }else{
                          that.items = that.items.concat(items);
                        }
                        that.pageNum+=1;
                        if(items.length<10){
                          that.canscroll=false;
                        }else{
                          that.canscroll=true;
                        }

                        
                        for(let i=0;i<that.items.length;i++) {
                            let time = that.items[i].creTm;
                            let date = that.items[i].creDt;
                            if(date < today) {
                              that.items[i].orderDate = date.slice(0,4)+'/'+date.slice(4,6)+'/'+date.slice(6);
                            }else {
                              that.items[i].orderDate = time.slice(0,2) + ':' + time.slice(2,4) + ':' + time.slice(4);
                            }
                        }
                        that.$emit('setSubAmount', sumAmount);
                    }else{
                        that.items = [];
                        count=0;
                    }
                    let desc = '';
                    if(that.state===''){
                        desc='全部订单';
                    }else if(that.state==='S1'){
                        desc='成功收款';
                    }else if(that.state==='F'){
                        desc='已关闭订单'
                    }else if(that.state==='S'){
                        desc='已退款'
                    }
                    that.$emit('setSubDesc', desc+(count||0)+'笔');
                    that.$nextTick(function(){
                        that._initOrderScroll();
                    });
                }else {
                    that.$quickTip(resData.data.returnMsg);
                }
            },
            function (res) {
                that.$quickTip('请求错误'+res);
            })
        },
        _initOrderScroll: function(){
            let hook = document.getElementsByClassName('order-list-hooker')[0];
            if(!this.orderScroll){
                this.orderScroll = new BScroll(hook, {
                    click: true,
                    probeType:3
                });
                this.orderScroll.scrollTo(0,0);
                this.orderScroll.on('scroll', (pos) => {
                  if(this.canscroll&&this.$refs.itemWrapper.clientHeight+pos.y-this.$refs.wrapper.clientHeight<150){
                    this.canscroll=false;
                    this.queryOrders(this.orderDate);
                  }
                })
            } else {
                this.orderScroll.refresh();
            }
        }
    },
    created: function () {
        this.queryOrders();
    },
    watch: {
        items:function(){
            this._initOrderScroll();
        },
         orderDate() {
          this.canscroll=true;
          this.pageNum=1;
          this.queryOrders(this.orderDate);
          if(this.couponsScroll){
            this.couponsScroll.scrollTo(0,0);
          }
        },
        state() {
            this.canscroll=true;
            this.pageNum=1;
            this.queryOrders(this.orderDate);
              if(this.couponsScroll){
                this.couponsScroll.scrollTo(0,0);
              }
        }
    },
    filters: {
        formatSts(val){
            if(val==='S1'){
                return '支付成功';
            }else if(val==='S'){
                return '已退款';
            }else if(val==='F'){
                return '已关闭'
            }
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

    .order {
        position: absolute;
        top: 11.9rem;
        bottom: 0;
        padding-bottom: 0.4rem;
        width: 100%;
        overflow: hidden;

        .status {
            position: relative;
            width: 100%;
            height: 2.2rem;
            line-height: 2.2rem;
            background: #EEEEEE;

            .text {
                display: inline-block;
                margin-left: 0.75rem;
                height: 100%;
                line-height: 2.2rem;
                font-size: 0.8rem;
                color: #666666;
                letter-spacing: 0;
            }

            .state-wrapper, .select {
                position: absolute;
                top: 0.375rem;
                right: 0.375rem;
                padding: 0 1.25rem 0 0.7rem;
                height: 1.475rem;
                line-height: 1.475rem;
                border: 1px solid transparent;

                .triangle {
                    position: absolute;
                    top: 0.55rem;
                    right: 0.5rem;
                    width: 0;
                    height: 0;
                    border-left: 0.25rem solid transparent;
                    border-right: 0.25rem solid transparent;
                    border-top: 0.5rem solid #0089C2;
                    z-index: 10;
                }

                .select-state {
                    font-size: 0.7rem;
                    color: #666666;
                    letter-spacing: 0;
                }
            }

            .select {
                padding: 0;
                font-size: 0.7rem;
                color: #666666;
                letter-spacing: 0;
                z-index: 10;

                li {
                    margin-top: -0.05rem;
                    padding: 0 1.2rem 0 0.7rem;
                    border: 1px solid #CCCCCC;
                    border-bottom: 0;
                    background: #FFFFFF;
                    text-align: center;
                }

                li:last-child {
                    border-bottom: 1px solid #CCCCCC;
                }
            }
        }

        .order-list-wrapper {
            position: absolute;
            top: 2.2rem;
            bottom: 0;
            width: 100%;
            overflow: hidden;
            .item-wrapper {
              @import "../../../common/scss/item";
              overflow:hidden;
              .order-gd {
                height: 1.2rem;
                background: url("./img/order-pay.png") no-repeat;
                background-size: 100%;
                vertical-align: middle;
              }
              .right-block{
                    text-align: right;
              }
            }
        }
    }

</style>
