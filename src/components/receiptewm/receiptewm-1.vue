<template>
  <div class="receipt-ewm">
    <v-header :title="ewmTitle"></v-header>
    <div class="receipt-ewm-money">
      <span>金额：</span><span style="margin-left: 1px"><span style="margin-right: 2px">&yen;</span>{{amount}}</span>
    </div>
    <div class="receipt-ewm-info">
      <div class="receipt-ewm-qrcode">
        <div id="code" :class="qrCls"></div>
        <img :src="qrcodeLogo" class="qrcode-logo">
      </div>
      <div class="receipt-ewm-opr">
        <span class="receipt-ewm-opr-sm"><img src="./img/sm-cls-icon.png"></span>
        <span class="ewm-opr-set"  @click="toScaning">扫一扫</span>
        <span class="ewm-opr-set"  @click="toFinish">完成支付</span>
        <span class="receipt-ewm-opr-left"><img src="./img/person-left-arrow.png"></span>
      </div>
    </div>
    <transition name="opacity">
      <div class="mask" v-show="showMask"></div>
    </transition>
    <transition name="slide-up">
      <ul class="list" v-show="showMask">
        <li class="item first" @click="showMask=false">请选择支付方式</li>
        <li class="item"><label for="radio1">微信扫码支付<input v-model="payType" value="1" type="radio" id="radio1" class="checkbox"></label></li>
        <li class="item"><label for="radio2">QQ扫码支付<input v-model="payType" value="2" type="radio" id="radio2" class="checkbox"></label></li>
        <li class="item"><label for="radio3">支付宝扫码支付<input v-model="payType" value="3" type="radio" id="radio3" class="checkbox"></label></li>
        <li class="item"><label for="radio4">光大银行信用卡扫码支付<input v-model="payType" value="4" type="radio" id="radio4" class="checkbox"></label></li>
      </ul>
    </transition>
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
        // 遮罩
        showMask: false,
        payType: "4"
      }
    },
    methods: {
      toScaning: function () {
        clearInterval(this.intervalID);
        this.set = '1';
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
      toFinish: function () {
        this.amount='';
        this.remark='';
        this.createQr();
        this.$quickTip('成功');
        this.show = '0';
        this.showMask = true;
      },
      queryOrderResult:function () {
        let that = this;
        this.$post('orderResultQuery',{
          userSign:'',
          qrNo:that.qrNo,
          cnlTyp:'www'
        },function (resData) {
          if(resData.data.returnSts=='RPM00000') {
            if(resData.data.orderSts == 'S1') {
              that.$router.push({name:'pay.success',params:resData.data})
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
        })
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
    },
    mounted: function () {
      let that = this;
      this.$nextTick(function () {
        require ('../../common/libs/jquery.qrcode.min.js');
        that.ewmQrcode();
      });
      /*var timer = that.intervalID = setInterval(function () {
       if(that.countMs>=0) {
       that.countMs = that.countMs-2000;
       //that.queryOrderResult();
       }else {
       clearInterval(timer);
       that.countMs = 120000;
       }
       },2000)*/
    },
    destroyed:function () {
      clearInterval(this.intervalID);
    },
    watch:{
      rqrUrl:function () {
        this.ewmQrcode();
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .receipt-ewm {
    height: 100%;
    background: #F4F4F4;
    font-family: PingFangSC-Regular;
    letter-spacing: 0;
    overflow:auto;
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
          width: 1.5rem;
          height: 1.5rem;
          top: 50%;
          position: absolute;
          left: 50%;
          transform: translate(-50%,-50%);
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
    .mask{

      position:fixed;
      top:0;
      left:0;
      bottom:0;
      right:0;
      z-index:10000;
      background-color:rgba(0,0,0,.5);
    }
    .list{
      position:fixed;
      bottom:0;
      left:0;
      width:100%;
      z-index:10010;
      background-color:#fff;
      .item{
        width:100%;
        height:8.2vh;
        line-height:8.2vh;
        overflow:hidden;
        font-size: 0.96rem;
        text-align:center;
        border-bottom:1px solid #ccc;
        &.first{
          position:relative;
          height:7.5vh;
          line-height:7.5vh;
          &:before{
            content:'';
            position:absolute;
            left:0;
            top:0;
            width:15vw;
            height:100%;
            background-image:url('./img/person-left-arrow.png');
            background-repeat:no-repeat;
            background-position:center;
            background-size:20%;
          }
        }
        &:last-child{
          border-bottom:none;
        }
        label{
          position:relative;
          display:block;
          width:100%;
          height:100%;
          .checkbox{
            -webkit-appearance:none;
            position:absolute;
            right:3vw;
            top:2.6vh;
            width:3vh;
            height:3vh;
            border-radius:100%;
            border:none;
            outline:none;
            border:1px solid #ff4a01;
            transition:all .5s;
            &:after{
              content:'';
              position:absolute;
              top:35%;
              left:50%;
              width:2vh;
              height:1vh;
              border-bottom:1px solid #fff;
              border-left:1px solid #fff;
              transform:translate3d(-50%,-30%,0) rotate(-45deg) scale(0);
              transition:all .5s;
            }
            &:checked{
              background-color:#ff4a01;
            }
            &:checked:after{
              transform:translate3d(-50%,-30%,0) rotate(-45deg) scale(1);
            }
          }
        }
      }

    }
    .opacity-enter-to, .opacity-leave-to {
      transition: all 1s;
    }
    .opacity-enter ,.opacity-leave-to{
      opacity:0;
    }
    .slide-up-enter-to, .slide-up-leave-to {
      transition: all 1s;
    }
    .slide-up-enter ,.slide-up-leave-to{
      transform:translate3d(0,100%,0);
    }
  }

</style>
