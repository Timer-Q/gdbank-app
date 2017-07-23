<template>
  <div class="make">
    <div class="make-header">
      <div class="block" @click="toScaning('01','2001')">
        <div class="img"></div>
        <div class="text">核销</div>
      </div>

      <div class="block right clear" @click="toScaning('02','2002')">
        <div class="img"></div>
        <div class="text">扫一扫</div>
      </div>
    </div>

    <div class="content">
      <p class="text">请输入支付金额</p>
      <div class="mount">
        <span class="mark">&yen;</span><b>{{ mount }}</b>
       </div>
    </div>

    <div class="key-board">
      <div class="line">
        <div class="key" @click.stop.prevent="enter">
          <span class="num" data-num="1">1</span>
        </div>
        <div class="key" @click.stop.prevent="enter">
          <span class="num" data-num="2">2</span>
        </div>
        <div class="key" @click.stop.prevent="enter">
          <span class="num" data-num="3">3</span>
        </div>
      </div>
      <div class="line">
        <div class="key" @click.stop.prevent="enter">
          <span class="num" data-num="4">4</span>
        </div>
        <div class="key" @click.stop.prevent="enter">
          <span class="num" data-num="5">5</span>
        </div>
        <div class="key" @click.stop.prevent="enter">
          <span class="num" data-num="6">6</span>
        </div>
      </div>
      <div class="line">
        <div class="key" @click.stop.prevent="enter">
          <span class="num" data-num="7">7</span>
        </div>
        <div class="key" @click.stop.prevent="enter">
          <span class="num" data-num="8">8</span>
        </div>
        <div class="key" @click.stop.prevent="enter">
          <span class="num" data-num="9">9</span>
        </div>
      </div>
      <div class="line">
        <div class="key" @click.stop.prevent="enter">
          <span class="num" data-num="." style="padding-bottom: 20px;">.</span>
        </div>
        <div class="key" @click.stop.prevent="enter">
          <span class="num" data-num="0">0</span>
        </div>
        <div class="key" @click.stop.prevent="enter">
          <span class="num" data-num="X"><img src="./img/del-num.png" class="num-img" data-num="X"></span>
        </div>
      </div>
    </div>
    <div class="pay-type">
      <div class="left">
        <transition :name="sideDirection">
          <div class="left-box" :class="left" :key="left"></div>
        </transition>
      </div>
      <div class="center">
        <div class="list" ref="list" @touchstart="handleTouchStart" @touchend="handletouchEnd" @touchmove="handleTouchMove">
          <div class="item" :class="prev"></div>
          <div class="item" :class="cur" @click.self="payQrCode()"></div>
          <div class="item" :class="next"></div>
        </div>
      </div>
      <div class="right">
        <transition :name="sideDirection">
          <div class="right-box" :class="right" :key="right"></div>
        </transition>
      </div>
    </div>
  </div>

</template>

<script>
  const PAY_TYPE = {
    'GD': 1,
    'WX': 2,
    'ALI': 3,
    'QQ': 4
  };
  const PAY_TYPE_LIST = [ 'gd', 'wx', 'ali', 'qq'];
  export default {
    data: function(){
      return {
        title: '收款',
        mount: '0.00',
        payType: PAY_TYPE.GD,
        transitionGD: '',
        transitionWX: '',
        transitionALI: '',
        transitionQQ: '',
        // 滑动
        sideDirection: 'side-left',
        left: 'qq',
        right: 'wx',
        prev: 'qq',
        cur: 'gd',
        next: 'wx',
        itemWidth: 0,
        startX: 0,
        endX: 0,
        moveX: 0,
        curIndex: 0,
        canMove: true
      }
    },
    methods: {
      enter: function(e){
        let target = e.target;
        if (target.className === 'key'){
          target = target.firstChild;
        }
        var num = target.getAttribute('data-num');
        if (num === 'X'){
          this.mount.length > 0 && (this.mount = this.mount.slice(0, -1));        // 有位数才删除
        } else if(this.mount.length < 10){          // 最大位数为 10
          if(this.mount=== '0.00'){
            this.mount = ''
          }
          if (num === '.'){
            if (this.float === -1){            // 没有小数点才加上小数点
              if(!this.mount[0]){
                this.mount += '0.';
              } else{
                this.mount += '.';
              }

            }
          } else {
            if (this.mount[0] === '0'){         // 如果第一位是0
              if(this.float>0){
                let decimal = this.mount.slice(this.float+1);
                if (decimal.length < 2){        // 如果有小数点但小数位数不够2位，可继续输入
                  this.mount += num;
                }
              }else{
                this.mount = num + '.00';
              }
            } else {
              if (this.float === -1){         // 如果没有小数点
                this.mount += num;
              } else {
                let decimal = this.mount.slice(this.float+1);
                if (decimal.length < 2){        // 如果有小数点但小数位数不够2位，可继续输入
                  this.mount += num;
                }
              }
            }
          }
        }
      },
      toScaning :function (scanType,busTyp) {
        let that = this;
        if(!this.$trim(that.mount)&&scanType=='02'||that.mount==='0.00'||that.mount==="0.0"||that.mount==="0.") {
          this.$quickTip('请输入支付金额');
          return;
        }
        if(this.$trim(that.mount)&&scanType=='01') {
          this.$quickTip('核销无需输入收款金额');
          that.mount='';
          return;
        }
        window.cordova.exec(function (data) {
          console.log('调用成功',data);
          let mercOrdId = that.formatmatDateToString(new Date())+that.mathRandom();
          let merch = JSON.parse(localStorage.getItem('merchUser'));
          let goodsDesc = scanType==='01'?'优惠活动-定额核销':merch.mercNm+'-二维码刷卡消费';
          that.$post('orderCreate',{
            userSign:'',
            mercOrdId:mercOrdId,
            scanType:scanType,
            ordAmt:that.mount,
            goodsNm:'扫码付',
            qrNo:data,
            // goodsDesc:'',
            mercId:merch.mercId,
            mercNm:merch.mercNm,
            sysCnl:'2',
            usrOprId:merch.usrOprId,
            cnlTyp:'www',
            busTyp:busTyp,
            goodsDesc:goodsDesc,
            goodsQuantity: 1
          },function (resData) {
            // alert(JSON.stringify(resData.data));//
            if(resData.data.returnSts==='RPM00000') {
              if(resData.data.ordSts === 'S1') {
                that.$router.push({name:'pay.success',params:resData.data});
              }else if(resData.data.returnMsg){
                that.$quickTip(resData.data.returnMsg);
              }
            }else {
              that.$quickTip(resData.data.returnMsg);
            }
          },function (res) {
            that.$quickTip('请求错误'+res);
          })
        },function (error) {
          console.log('调用失败',error)
        },'TPScanCode','scanCodeAction',[{'amout':that.mount,'scanType':scanType}]);
      },
      payQrCode :function () {
        let that = this;
        let payType = this.cur;
        let etitle = payType=='gd'?'光大信用卡支付':payType=='wx'?'微信支付':payType=='ali'?'支付宝支付':payType=='qq'?'QQ支付':'';
        if(!this.$trim(that.mount)||that.mount==='0.00'||that.mount==="0.0"||that.mount==="0.") {
          this.$quickTip('请输入支付金额');
          return;
        }else if(payType!='gd') {
            this.$alert('商户未开通'+etitle+'方式');
            return;
        }

        let merch = JSON.parse(localStorage.getItem('merchUser'));
        this.$post('qrcodeRequest',{
          userSign:'',
          busType:'',
          merId:merch.mercId,
          merName:merch.mercNm,
          QRType:'02',
          reqAmt:that.mount,
          cnlTyp:'www'
        },function (resData) {
          if(resData.data.returnSts=='RPM00000') {
            let data = resData.data;
            data.amount = that.mount;
            data.title = etitle;
            that.$router.push({name:'pay.receipt',params:data});
          }else {
            that.$quickTip(resData.data.returnMsg);
          }
        },function (errorData) {
          that.$quickTip('请求错误'+errorData);
        })
      },
      mathRandom:function () {
        let num = '';
        for(let i=0;i<6;i++) {
          num+=Math.floor(Math.random()*10);
        }
        return num;
      },
      formatmatDateToString:function(date) {
        if(!date) {
          date = new Date();
        }
        let year = date.getFullYear();
        let month = date.getMonth()+1;
        let day = date.getDate();
        if(month<10) month = "0"+month;
        if(day<10) day = "0"+day;
        let hours = date.getHours();
        let mins = date.getMinutes();
        let secs = date.getSeconds();
        let msecs = date.getMilliseconds();
        if(hours<10) hours = "0"+hours;
        if(mins<10) mins = "0" +mins;
        if(secs<10) secs = "0"+secs;
        if(msecs<10) msecs = "0"+msecs;
        return year+month+day+hours+mins+secs+msecs;
      },
      // 滑动
      handleTouchStart(e) {
        if(!this.canMove) return;
        let touch = e.targetTouches[0];
        this.startX = touch.pageX;
      },
      handleTouchMove(e) {
        if(!this.canMove) return;
        let touch = e.targetTouches[0];
        this.moveX = touch.pageX;
        let distance = this.itemWidth+this.moveX-this.startX;
        this.$refs.list.style.webkitTransform = 'translate3d('+distance+'px,0,0)';
      },
      handletouchEnd(e) {
        if(!this.canMove) return;
        let _self = this;
        let touch = e.changedTouches[0];
        this.endX = touch.pageX;
        let distance = this.endX - this.startX;
        let prevIndex,nextIndex;
        this.$refs.list.style.webkitTransition = 'all .1s';
        if(distance>10){
          this.sideDirection = 'side-right';
          this.$refs.list.style.webkitTransform = 'translate3d(0,0,0)';
          prevIndex = this.curIndex - 2;
          nextIndex = this.curIndex;
          this.curIndex -= 1;
          if(this.curIndex===0) {
            prevIndex = 3;
          }else if(this.curIndex === -1){
            this.curIndex = 3;
            prevIndex = 2;
          }
        } else if(distance<-10){
          this.sideDirection = 'side-left';
          this.$refs.list.style.webkitTransform = 'translate3d('+2*this.itemWidth+'px,0,0)';
          prevIndex = this.curIndex;
          nextIndex = this.curIndex + 2;
          this.curIndex += 1;
          if(this.curIndex===3) {
            nextIndex = 0;
          }else if(this.curIndex === 4){
            this.curIndex = 0;
            nextIndex = 1;
          }
        }
        if(distance<-10 || distance>10){
          this.$refs.list.addEventListener('transitionend',handleTransitionEndCallback,false);
        }
        function handleTransitionEndCallback(){
          _self.left = PAY_TYPE_LIST[prevIndex];
          _self.right = PAY_TYPE_LIST[nextIndex];
          _self.cur = PAY_TYPE_LIST[_self.curIndex];
          _self.$refs.list.style.webkitTransition = '';
          _self.$refs.list.style.webkitTransform = 'translate3d('+_self.itemWidth+'px,0, 0)';
          _self.prev = PAY_TYPE_LIST[prevIndex];
          _self.next = PAY_TYPE_LIST[nextIndex];
          _self.canMove = true;
          _self.$refs.list.removeEventListener('transitionend',handleTransitionEndCallback,false);
        }
      }
    },
    computed: {
      float: function(){
        return (this.mount.indexOf('.'));
      }
    },
    created: function(){
      this.$emit('footerChange', '2');
      this.$nextTick(() => {
        this.itemWidth = this.hasMoveX = -(this.$refs.list.clientWidth / 3);
      });
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .make {
    position: absolute;
    top: 0;
    bottom: 2.5rem;
    width: 100%;
    overflow: hidden;

    .make-header {
      padding: 0.5rem 0.75rem;
      width: 100%;
      height: 2.2rem;
      background: #943EBD;

      .block {
        display: inline-block;

        &.right{
          float: right;
        }

        .img {
          display: inline-block;
          width: 0.9rem;
          height: 0.9rem;
          background: url("./img/top-ss-icon.png") no-repeat;
          background-size: 100% 100%;
          vertical-align: middle;
        }

        .text {
          display: inline-block;
          height: 100%;
          line-height: 0.9rem;
          font-size: 0.8rem;
          color: #FFFFFF;
          letter-spacing: 0;

        }
      }

    }

    .content {
      padding-top: 1.05rem;
      width: 100%;
      height: 9.55rem;
      color: #FFFFFF;
      background: url("./img/pay-bg.png") no-repeat;
      background-size: 100% 100%;

      .text {
        font-size: 0.75rem;
        letter-spacing: 0;
        line-height: 1.025rem;
        opacity: 0.6;
        text-align: center;
      }

      .mount {
        margin-top: 0.9rem;
        height: 3.5rem;
        line-height: 3.5rem;
        text-align: center;
        font-size: 2.5rem;
        font-weight: 200;
        color: #FFFFFF;
        letter-spacing: 0;

        .mark {
          display: inline-block;
          margin-right: 0.5rem;
          font-size: 1.5rem;
          letter-spacing: 0;
        }
      }
    }

    .key-board {
      position: absolute;
      top: 11.75rem;
      bottom: 2.75rem;
      cursor: pointer;
      width: 100%;

      .line {
        display: flex;
        height: 25%;

        .key {
          position: relative;
          flex: 1;
          border-right: 1px solid #CCCCCC;
          border-bottom: 1px solid #CCCCCC;
          height: 100%;
          text-align: center;
          font-size: 1.6rem;
          color: #333333;
          letter-spacing: 0;
          cursor: pointer;

          &:last-child {
            border-right: none;
          }

          .num {
            position: absolute;
            top: 50%;
            left: 50%;
            cursor: pointer;
            transform: translateX(-50%) translateY(-50%);
            font-size: 1.6rem;
            color: #333333;
            letter-spacing: 0;
            .num-img {
              height: 1.1925rem;
              width: 1.625rem;
            }
          }
        }
      }
    }

    .pay-type {
      position: absolute;
      bottom: 0;
      display:flex;
      align-items:center;
      height: 2.75rem;
      width: 100%;
      background-color:#fff;

      .type-gd, .type-wx, .type-ali, .type-qq {
        display: flex;
        padding: 0.25rem 1rem;
        width: 100%;
        height: 100%;
        transition: all, 0.3s linear;
        transform: translate3d(0, 0, 0);

        &.slide-left-leave-active, &.slide-left-enter{
          transition: all, 0.3s linear;
          transform: translate3d(-100%, 0, 0);
          opacity: 0;
        }
        &.slide-left-enter-active {
          transition: all, 0.3s linear;
          transform: translate3d(0, 0, 0);
          opacity: 1;
        }
        &.slide-right-leave,&.slide-left-leave{
          transition: all, 0.3s linear;
          transform: translate3d(0, 0, 0);
          opacity: 1;
        }

        &.slide-right-leave-active, &.slide-right-enter {
          transition: all, 0.3s linear;
          transform: translate3d(100%, 0, 0);
          opacity: 0;
        }
      }

      .choose {
        flex: 0 0 1.5rem;
        margin: 0.375rem 0;
        height: 1.5rem;

        &.wx {
          background: url("./img/pay-wx-icon.png") no-repeat;
          background-size: 100% 100%;
        }

        &.ali {
          background: url("./img/pay-alipay-icon.png") no-repeat;
          background-size: 100% 100%;
        }

        &.qq {
          background: url("./img/pay-qq-icon.png") no-repeat;
          background-size: 100% 100%;
        }

        &.gd {
          background: url("./img/pay-ceb-icon.png") no-repeat;
          background-size: 100% 100%;
        }
      }

      .pay {
        flex: 1;
        margin: 0 0.875rem;
        height: 100%;

        &.gd {
          background: url("./img/pay-ceb-big-icon.png") no-repeat;
          background-size: 100% 100%;
        }

        &.wx {
          background: url("./img/pay-wx-big-icon.png") no-repeat;
          background-size: 100% 100%;
        }

        &.ali {
          background: url("./img/pay-alipay-big-icon.png") no-repeat;
          background-size: 100% 100%;
        }

        &.qq {
          background: url("./img/pay-qq-big-icon.png") no-repeat;
          background-size: 100% 100%;
        }
      }
      .left,.right{
        position:relative;
        flex:0 0 3rem;
        height:100%;
        overflow:hidden;
        &-box{
          position:absolute;
          top:0;
          left:0;
          width:100%;
          height:100%;
          background-repeat:no-repeat;
          background-size:1.5rem;
          background-position:center;
          &.gd{
            background-image:url('./img/pay-ceb-icon.png');
          }
          &.wx{
            background-image:url('./img/pay-wx-icon.png');
          }
          &.qq{
            background-image:url('./img/pay-qq-icon.png');
          }
          &.ali{
            background-image:url('./img/pay-alipay-icon.png');
          }
        }
      }
      .center{
        flex:1;
        height:100%;
        overflow:hidden;
        .list{
          display:flex;
          width:300%;
          height:100%;
          transform:translate3d(-33.33%,0,0);
          .item{
            flex:1;
            background-repeat:no-repeat;
            background-size:contain;
            background-position:center;
            &.gd{
              background-image:url('./img/pay-ceb-big-icon.png');
            }
            &.wx{
              background-image:url('./img/pay-wx-big-icon.png');
            }
            &.qq{
              background-image:url('./img/pay-qq-big-icon.png');
            }
            &.ali{
              background-image:url('./img/pay-alipay-big-icon.png');
            }
          }
        }
      }
    }

  }
  // .side-left-enter-active,.side-left-leave-active{
  //   transition:all .5s;
  // }
  // .side-left-enter{
  //   transform:translate3d(100%,0,0);
  //   backgroundColor:red;
  // background-position:100% center;
  // }
  // .side-left-leave-active{
  //   transform:translate3d(-100%,0,0);
  //   // background-position:-100% center;
  // }
  .side-left-enter-to, .side-left-leave-to {
    transition: all .1s;
  }
  .side-left-enter {
    transform:translate3d(100%,0,0);
  }
  .side-left-leave-to {
    transform:translate3d(-100%,0,0);
  }
  .side-right-enter-to, .side-right-leave-to {
    transition: all .1s;
  }
  .side-right-enter {
    transform:translate3d(-100%,0,0);
  }
  .side-right-leave-to {
    transform:translate3d(100%,0,0);
  }
</style>
