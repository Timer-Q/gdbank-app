<template>
    <div class="receipt-ewm">
        <v-header :title="ewmTitle"></v-header>
         <div class="receipt-ewm-money">
           <span>金额：</span><span style="margin-left: 1px"><span style="margin-right: 2px">&yen;</span>{{amount | formatMoney}}</span>
         </div>
        <div class="receipt-ewm-info">
          <div class="receipt-ewm-qrcode">
            <div id="code" :class="qrCls"></div>
            <div class="qrcode-logo"><img src="./img/ewm-gd.png"></div>
          </div>
          <div class="receipt-ewm-opr" @click="selectPayType">
            <span class="receipt-ewm-opr-sm"><img src="./img/sm-cls-icon.png"></span>
            <span class="ewm-opr-set" >扫一扫</span>
            <span class="ewm-opr-set">完成支付</span>
            <span class="receipt-ewm-opr-left"><img src="./img/person-left-arrow.png"></span>
          </div>
        </div>
      <transition name="slide-up">
         <div class="receipt-ewm-pop" v-show="showPop==='1'">
           <div class="set-remark-pop-title"><span style="position: absolute;left: .85rem" @click="closePop"><img src="./img/person-left-arrow.png"></span><span>请选择支付方式</span></div>
           <div class="set-remark-pop-title" @click="toSelectPaytype('wx')">微信扫码支付</div>
           <div class="set-remark-pop-title" @click="toSelectPaytype('qq')">QQ扫码支付</div>
           <div class="set-remark-pop-title" @click="toSelectPaytype('ali')">支付宝扫码支付</div>
           <div class="set-remark-pop-title active" style="border: none" @click="toSelectPaytype('gd')"><span>光大银行信用卡扫码支付</span></div>
         </div>
      </transition>
        <div class="mask" v-show="showPop==='1'" @click="closePop"></div>
    </div>
</template>

<script>
    export default {
        data: function () {
            return {
                amount: '',
                ewmTitle:'光大信用卡支付',
                rqrSize:265,
                rqrUrl:'',
                qrCls:'ewm-qrcode-border',
                remark:'',
                countMs:120000,
                intervalID:null,
                qrrNo:'',
                qrcodeLogo:'static/img/ewm-logo2.png',
                merchId:'',
                merchName:'',
                showPop:'0'
            }
        },
        methods: {
            toScaning: function () {//用不到
                  clearInterval(this.intervalID);
                  this.set = '1';
            },
            selectPayType: function () {
                this.showPop = '1';
            },
            closePop:function () {
                this.showPop = '0';
            },
            toSelectPaytype:function (type) {
                let etitle = type=='gd'?'光大信用卡支付':type=='wx'?'微信支付':type=='ali'?'支付宝支付':type=='qq'?'QQ支付':'';
                if(type!='gd') {
                  this.$alert('商户未开通'+etitle+'方式');
                  this.showPop = '0';
                  return;
                }else {
                  this.showPop = '0';
                }
            },
            createQr:function () {
                let that = this;
                this.$post('qrcodeRequest',{
                    userSign:'',
                    busType:'',
                    merId:that.merchId,
                    merName:that.merchName,
                    QRType:'02',
                    reqAmt:that.amount,
                    cnlTyp:'www'
                },function (resData) {
                    if(resData.data.returnSts=='RPM00000') {
                      that.qrUrl = resData.data.url;
                      that.qrNo = resData.data.qrNo;
                      that.imgSave='0';
                    }else {
                      that.$quickTip(resData.data.returnMsg);
                    }
                },function (errorData) {
                    that.$quickTip('请求错误'+errorData);
                });
            },
            toFinish: function () {//用不到
                  this.amount='';
                  this.remark='';
                  this.createQr();
                  this.$quickTip('成功');
                  this.show = '0';
              },
            queryOrderResult:function () {
                let that = this;
                this.$post('orderResultQuery',{
                    userSign:'',
                    qrNo:that.qrrNo,
                    cnlTyp:'www'
                },function (resData) {
                    if(resData.data.returnSts=='RPM00000') {
                        if(resData.data.orderSts == 'S1') {
                            let resdata = resData.data;
                            resdata.receipt = '1';
                            that.$router.replace({name:'pay.success',params:resdata})
                        }
                    }
                },function (errorData) {
                    that.$quickTip('请求错误'+errorData);
                });
            },
            ewmQrcode:function(){
                let that = this;
                $('#code').html("");
                $('#code').qrcode({
                  text:that.rqrUrl,
                  width:that.rqrSize,
                  height:that.rqrSize
                });
            },
            lunxunOrder:function () {
              let that = this;
              var timer = that.intervalID = setInterval(function () {
                if(that.countMs>=0) {
                  that.countMs = that.countMs-2000;
                  that.queryOrderResult();
                }else {
                  that.$quickTip('请求超时,请重新输入金额再试');
                  clearInterval(timer);
                  that.countMs = 120000;
                }
              },2000);
            }
        },
        created:function () {
            let merch = JSON.parse(localStorage.getItem('merchUser'));
            this.merchId = merch.mercId;
            this.merchName = merch.mercNm;
            if(this.merchId == '800010000020022') {
                this.qrcodeLogo = 'static/img/ewm-logo1.png';
            }else if(this.merchId == '800057100030001') {
                this.qrcodeLogo = 'static/img/ewm-logo2.png';
            }
            let params = this.$route.params;
            this.rqrUrl = params.url;
            this.qrrNo = params.qrNo;
            this.amount = params.amount;
            this.ewmTitle = params.title;
            let that = this;
            this.$nextTick(function () {
              require ('../../common/libs/jquery.qrcode.min.js');
              that.ewmQrcode();
              this.lunxunOrder();
            });
        },
        // mounted: function () {
        //   console.log(this.$route.params)
        //   let that = this;
        //   this.$nextTick(function () {
        //     require ('../../common/libs/jquery.qrcode.min.js');
        //     that.ewmQrcode();
        //     this.lunxunOrder();
        //   });
        // },
        destroyed:function () {
          clearInterval(this.intervalID);
        }
        /*watch:{
          rqrUrl:function () {
            this.ewmQrcode();
          }
        },*/
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .receipt-ewm {
        height: 100%;
        background: #F4F4F4;
        font-family: PingFangSC-Regular;
        letter-spacing: 0;
        overflow:hidden;
            position: relative;
        .receipt-ewm-money {
          font-size: .9rem;
          color: #333333;
          text-align: center;
          margin-bottom: .775rem;
          margin-top: .825rem;
        }

        .receipt-ewm-info {
            background-color: #FFF;
            text-align: center;
            padding-top: 1.925rem;
            border-top: 1px solid #CCCCCC;
            border-bottom: 1px solid #CCCCCC;
            .receipt-ewm-qrcode {
                /*padding-top: 1.15rem;*/
                margin-top: .875rem;
                /*margin-left: .875rem;
                margin-right: .875rem;*/
                position: relative;
                /*img {
                  !*width: 13.75rem;
                  height: 13.75rem;*!
                }*/
                .qrcode-logo {
                    top: 50%;
                    position: absolute;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    /*background: #FFF;
                    border-radius: 2px;
                    border: .25rem solid #FFF;*/
                    img {
                        width: 3.5rem;
                        height: 3.5rem;
                    }
                }
            }
            .receipt-ewm-opr {
                color: #333333;
                line-height: 1.125rem;
                font-size: .8rem;
                margin-top: 1.225rem;
                padding-bottom: 1.15rem;
                .ewm-opr-set {
                  vertical-align: middle;
                }
                .receipt-ewm-opr-sm {
                  margin-right: .2rem;
                  img{
                    width: .9rem;
                    height: .9rem;
                    vertical-align: middle;
                  }
                }
              .receipt-ewm-opr-left {
                margin-left: .2rem;
                img {
                  vertical-align: middle;
                  height: .8rem;
                  width: .46rem;
                  transform: rotate(180deg);
                }
              }
            }
        }
        .receipt-ewm-pop {
          z-index: 1005;
          position: absolute;
          bottom: 0;
          background: #FFF;
          width: 100%;
          overflow: hidden;
          .set-remark-pop-title {
            text-align: center;
            height: 2.5rem;
            font-family: STHeitiSC-Light;
            color: #333333;
            font-size: .9rem;
            letter-spacing: 0;
            line-height: .925rem;
            padding-top: .8rem;
            border-bottom: 1px solid #CCCCCC;;
            img {
              height: .85rem;
              width: .5rem;
            }
            .other-font {
              font-size: .8rem;
              line-height: 1.125rem;
            }
          }
          .active {
            background: url("./img/person-selected-icon.png") no-repeat  95%;
            background-size: 1rem 1rem;
          }

        }
        .mask {
          width: 100%;
          height: 100%;
          opacity: 0.5;
          background: #000000;
          filter: alpha(opacity=70);
          position: absolute;
          left: 0;
          top: 0;
          z-index: 1004;
        }
      .slide-up-enter-to, .slide-up-leave-to {
        transition: all 0.15s;
      }
      .slide-up-enter ,.slide-up-leave-to{
        transform:translate3d(0,100%,0);
      }
    }

</style>
