<template>
    <div class="ewm">
        <v-header :title="title" :show-back="'0'"></v-header>
        <div class="ewm-qrcode-info" v-show="set === '0'">
            <div class="ewm-merchant">{{merchName}}</div>
            <div class="ewm-set-amount" v-show="show==='1'">
                <div class="ewm-set-amount-money">&yen;<span>{{ amount | formatMoney}} </span></div>
                <div class="ewm-set-amount-remark"><span>数量：</span><span>{{count}}</span></div>
                <div class="ewm-set-amount-remark" v-show="remark"><span>备注：</span><span>{{remark}}</span></div>
            </div>
            <div class="ewm-qrcode">
                <!--<img src="../static/img/ewm-img02.png" alt="">-->
                <!--<qrcode :cls="qrCls" :value="qrUrl"  type="image" :size="qrSize" class="qrcode-hooker"></qrcode>-->
                <div id="code" :class="qrCls"></div>
                <div class="qrcode-logo"><img :src="qrcodeLogo" id="qrCode-img"  style="display: none"></div> <!-- 无用样式代码 -->
            </div>
            <div class="ewm-opr">
                <span class="ewm-opr-set" v-show="show==='0'" @click="toSetAmount">设置金额</span>
                <span class="ewm-opr-set" v-show="show==='1'" @click="toClearAmount">清除金额</span>
                <span class="ewm-opr-save" @click="toSaveImg">保存图片</span>
            </div>
        </div>
        <div class="payment-bill" v-show="set === '0'" @click="toViewBills">收款账单</div>
        <canvas id="pic"></canvas>
        <img src="./img/cut.png" alt="" id="pic_img">
        <set-amount v-show="set === '1'" :set="set" @hide="hide" @setAmount="setAmount"></set-amount>
    </div>
</template>

<script>
    import setAmount from './setamount.vue';
    export default {
        components: {
            'set-amount': setAmount
        },
        data: function () {
            return {
                title: '固定收款二维码',
                show: '0',
                set: '0',
                amount: '',
                ewmTitle:'',
                qrSize:265,
                qrUrl:'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx2581f3f0f7c9cf17',
                qrCls:'ewm-qrcode-border',
                remark:'',
                countMs:120000,
                intervalID:null,
                qrNo:'',
                qrcodeLogo:'./static/img/avatar1.jpg',
                merchId:'',
                merchName:'',
                imgSave:'0',
                count: 1
            }
        },
        methods: {
            toSetAmount: function () {
                this.countMs = 120000;
                clearInterval(this.intervalID);
                $('.footer').hide();
                $('.ewm').css('height','100%');
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
                    goodsQuantity: that.count,
                    cnlTyp:'www'
                },function (resData) {
                    if(resData.data.returnSts=='RPM00000') {
                      //that.amount = params.amount;
                      //that.remark = params.remark;
                      that.qrNo = resData.data.qrNo;
                      that.qrUrl = resData.data.url;
                      that.imgSave='0';
                    }else {
                      that.$quickTip(resData.data.returnMsg);
                    }
                },function (errorData) {
                    that.$quickTip('请求错误'+errorData);
                });
            },
            toClearAmount: function () {
                this.countMs = 120000;
                clearInterval(this.intervalID);
                this.amount='';
                this.remark='';
                this.createQr();
                this.$quickTip('清除成功');
                this.show = '0';
            },
            toSaveImg: function () {
                let that = this;
                // let canvasCode = $('#code>canvas').eq(0);
                let canvasCode =$('#pic');
                // let canvasCode = $('.ewm').eq(0);
                // console.log(canvasCode[0].toDataURL("image/png").replace(/data:image\/png;base64,/, ''));
                

                if(this.imgSave=='0') {
                  window.cordova.exec(function (data) {
                    if(data) {
                       that.imgSave='1';
                       that.$quickTip('保存成功');
                    }else {
                      that.$quickTip('保存失败');
                    }
                  },function (error) {
                    that.$quickTip('保存失败');
                    console.log('调用失败',error)
                  },'TPSavePhoto','savePhotoAction',[{qrcode:canvasCode[0].toDataURL("image/png").replace(/data:image\/png;base64,/, '')}]);
                }else {
                  this.$quickTip('此收款二维码图片已存在');
                }
            },
            toViewBills: function () {
                this.$router.replace('/main/orders');
                this.$emit('footerChange', '3');
            },
            hide: function(){
               $('.footer').show();
               $('.ewm').css('height','auto');
                this.set ='0';
            },
            setAmount: function(obj){
                //console.log(obj);
                this.amount = obj.amount * obj.count;
                this.remark = obj.remark;
                this.count = obj.count;
                this.$nextTick(()=>{
                    this.createQr();
                })
                let _self = this; 
                setTimeout(function(){
                    _self.set = '0';
                    $('.footer').show();
                    _self.show = '1';
                    $('.ewm').css('height','auto');
                },500)
            },
            queryOrderResult:function () {
                let that = this;
                console.log(that.qrNo);
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
                  text:that.qrUrl,
                  width:that.qrSize,
                  height:that.qrSize
                });
              let img = $('#qrCode-img')[0];
              let canvasCode = $('#code>canvas').eq(0);
              let ctx = canvasCode[0].getContext('2d');
              // ctx.clearRect(98,98,70,70);
              ctx.drawImage(img, 98, 98, 70, 70);

              this.ewmQrcode2();
              console.log(12)
          },
          ewmQrcode2:function(){
            let img = document.getElementById('pic_img');
            img.onload=function(){
                let canvas = document.getElementById('pic');
                let p=img.naturalWidth/img.clientWidth;
                let height = img.naturalHeight/p;
                canvas.style.height=height+'px';
                // canvas.setAttribute('width',img.clientWidth);
                // canvas.setAttribute('height',height);
                canvas.setAttribute('width',img.naturalWidth);
                canvas.setAttribute('height',img.naturalHeight);
                // canvas.style.width=img.naturalWidth+'px';
                // canvas.style.height=img.naturalHeight+'px';
                let ctx1 = canvas.getContext("2d")
                ctx1.drawImage(img,0,0,canvas.width,canvas.height);


                let canvasCode = $('#code>canvas').eq(0);
                let ctx = canvasCode[0].getContext('2d');
                let imgData = ctx.getImageData( 0, 0, canvasCode[0].width, canvasCode[0].height );
                console.log(imgData)

                 ctx1.clearRect((canvas.width-canvasCode[0].width)/2,65,canvasCode[0].width, canvasCode[0].height);
                ctx1.putImageData(imgData,(canvas.width-canvasCode[0].width)/2,65,0,0,canvasCode[0].width/p, canvasCode[0].height/p);
            }
          },
          lunxunOrder:function () {
              let that = this;
              var timer = that.intervalID = setInterval(function () {
                if(that.countMs>=0) {
                  that.countMs = that.countMs-2000;
                  that.queryOrderResult();
                }else {
                  clearInterval(timer);
                  that.countMs = 120000;
                }
              },2000);
          }
        },
        watch:{
          qrUrl:function (val) {
            this.ewmQrcode();
            this.lunxunOrder(); 
          }
        },
        created:function () {
            console.log(1)
            let merch = JSON.parse(localStorage.getItem('merchUser'));
            this.merchId = merch.mercId;
            this.merchName = merch.mercNm;
            if(this.merchId == '800010000020022') {
                this.qrcodeLogo = './static/img/avatar1.jpg';
            }else if(this.merchId == '800057100030001') {
                this.qrcodeLogo = './static/img/avatar1.jpg';
            }
            let that = this;
            this.$nextTick(function () {
                that.createQr();
              require ('../../common/libs/jquery.qrcode.min.js');
              that.ewmQrcode();
            });

        },
        mounted(){

            
        },
        destroyed:function () {
          clearInterval(this.intervalID);
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    #pic{
        position:absolute;
        top:0;
        left:-100%;
        width: 100%;
        height:448px;
        background-color:#fff;
    }
    #pic_img{
        width:100%;
        position:absolute;
        top:0;
        left:-100%;
    }
    .ewm {
        position: absolute;
        top: 0;
        bottom: 2.5rem;
        width: 100%;
        background-color: #943EBD;
        font-family: PingFangSC-Regular;
        letter-spacing: 0;
        overflow-x: hidden;

        .ewm-qrcode-info {
            background-color: #FFF;
            border-radius: .25rem;
            margin-left: .75rem;
            margin-right: .75rem;
            text-align: center;

            .ewm-merchant {
                color: #333333;
                font-size: .9rem;
                line-height: 1rem;
                padding-top: 1.1rem;
            }

            .ewm-set-amount {

                .ewm-set-amount-money {
                    color: #FF6600;
                    font-size: .9rem;
                    line-height: 1.65rem;

                    span {
                        font-size: 1.2rem;
                    }

                }
                .ewm-set-amount-remark {
                    line-height: 1.5;
                    color: #999999;
                    font-size: .75rem;
                    text-align: left;
                    span:first-child {
                        display: inline-block;
                        text-align: left;
                        min-width: 50%;
                        text-align: right;
                    }
                }
            }
            .ewm-qrcode {
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
            .ewm-opr {
                color: #0089C2;
                line-height: 1.05rem;
                font-size: .75rem;
                padding-top: 1.1rem;
                padding-bottom: 1.34rem;

                .ewm-opr-set {

                    &:after {
                        content: "";
                        margin-left: .8rem;
                        margin-right: .8rem;
                        border-right: 1px solid #DDDDDD;
                    }

                }
            }
        }
        .payment-bill {
            text-align: center;
            color: #FFF;
            font-size: .75rem;
            line-height: 1.05rem;
            margin-top: 1rem;
        }
    }

</style>
