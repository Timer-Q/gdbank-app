<template>
    <transition name="move">
        <div class="set-amount">
            <v-header :title="title" :return="'0'" @back="back"></v-header>
            <div class="set-amount-input">
                <label>单价(元)</label>
                <span v-show="amount!=''&&amount!=null">&yen;</span><input type="tel" placeholder="请填写收款金额" class="val" v-model="amount" @input="regAmount">
            </div>
            <div class="set-amount-input">
                <label>数量</label>
                <input type="number" placeholder="请填写数量" class="val" v-model.number="count" @input="regCount">
            </div>
            <div class="set-amount-remark" @click="toAddRemark"><span v-show="remarkNote">收款备注：&nbsp;{{remarkNote}}</span><span v-show="!remarkNote">添加收款备注</span></div>
            <div class="next-button-wrapper" @click.stop.prevent="setAmount">
                <next-button :next="buttonTitle"></next-button>
            </div>
            <!-- 收款备注 -->
            <div class="set-remark-pop" v-show="showPop==='1'" ref="pop">
                <div class="set-remark-pop-title">收款备注</div>
                <div class="set-remark-pop-content">
                    <div class="set-remark-pop-input">
                        <input type="text" placeholder="请输入收款备注" class="pop-val" v-model="remark" @focus="toFocus">
                    </div>
                    <div class="set-remark-pop-btn">
                        <div class="pop-btn cancel-btn" @click.self.stop="closePop">取消</div>
                        <div class="pop-btn submit-btn" @click.self.stop="submitRemark">确认</div>
                    </div>
                </div>
            </div>
            <!-- 遮罩层 -->
            <div class="mask" v-show="showPop==='1'" @click="closePop"></div>
        </div>
    </transition>
</template>
<script>
    export default {
        data: function () {
            return {
                title: '设置金额',
                buttonTitle: '下一步',
                amount: '',
                showPop: '0',
                remark:'',
                remarkNote:'',
                timer:'',
                windowInnerHeight:'',
                currwindowInnerHeight:''
            }
        },
        props:['set'],
        methods: {
            toAddRemark: function () {
                this.remark = this.remarkNote;
                this.showPop = '1';
            },
            closePop: function () {
                clearInterval(this.timer);
                this.showPop = '0';
                this.toBlur();
            },
            submitRemark: function () {
                this.remarkNote = this.remark;
                this.showPop = '0';
                this.toBlur();
            },
            back: function(){
                this.$emit('hide');
            },
            setAmount: function(){
                if(!this.$trim(this.amount)){
                    this.$quickTip('请设置收款金额');
                    return;
                }
                if(this.amount.indexOf('.')===this.amount.length-1){
                    this.amount=this.amount.slice(0,-1);
                }
                clearInterval(this.timer);
                this.$emit('setAmount', {amount:this.amount,remark:this.remark, count: this.count});

            },
            toFocus: function () {
              clearInterval(this.timer);
              let that = this;
              setTimeout(function () {
                that.timer = setInterval(function () {
                  console.log(that.windowInnerHeight+":"+window.innerHeight);
                  that.currwindowInnerHeight = window.innerHeight;
                  if(that.currwindowInnerHeight<that.windowInnerHeight) {
                    $('.set-remark-pop').css('top','3.5rem')
                  }else {
                    $('.set-remark-pop').css('top','');
                  }
                },100);
              },500);
            },
            toBlur: function () {
              $('.set-remark-pop').css('top','');
              clearInterval(this.timer);
            },
            regAmount(e){
                let str=this.amount;
                str=str.replace(/[^\d\.]/gi,'');
                if(str.indexOf('.')>0){
                    let reg = /([1-9]\d*|0?)\.[0-9]?[1-9]?/;
                    str = str.match(reg)&&str.match(reg)[0];
                }else{
                    let reg = /([1-9]\d*)|0/;
                    str = str.match(reg)&&str.match(reg)[0];
                }
                this.amount = str;
            },
            regCount(e) {
                if(this.count <= 0) {
                    this.count = 1
                    this.$quickTip('数量大于1');
                }
            }
        },
        created:function () {
          this.windowInnerHeight = window.innerHeight;
          let _self = this;
          this.$back.subBack(()=>{
              _self.$emit('hide');
          });
          this.count = 1;
        },
        watch: {
            set(){
               if(this.set==='1'){
                let _self=this;
                this.$back.subBack(()=>{
                    _self.$emit('hide');
                })
               }
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .set-amount {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        z-index: 30;
        background: #F4F4F4;
        transition: all, 0.2s linear;
        transform: translate3d(0, 0, 0);
        overflow:hidden;
        &.move-enter, &.move-leave-active{
            transform: translate3d(100%, 0, 0);
        }

        .set-amount-input {
            background: #FFFFFF;
            margin-top: .775rem;
            border-top: 1px solid #DDDDDD;
            border-bottom: 1px solid #DDDDDD;
            padding-left: .75rem;
            padding-top: .75rem;
            padding-bottom: .75rem;
            font-size: .8rem;
            color: #333333;

            ::-webkit-input-placeholder {
                color: #999999;
            }

            :-moz-placeholder {
                color: #999999;
            }

            ::-moz-placeholder {
                color: #999999;
            }

            :-ms-input-placeholder {
                color: #999999;
            }

            label {
                display: inline-block;
                min-width: 3rem;
                margin-right: 0.75rem;
            }

            .val {
                outline: none;
            }

        }
        .set-amount-remark {
            text-align: right;
            color: #0089C2;
            font-size: .7rem;
            line-height: 1.3rem;
            margin-top: .5rem;
            margin-right: .75rem;
        }

        .next-button-wrapper {
            margin: .75rem;
        }

        /*弹出层*/
        .set-remark-pop {
            z-index: 1001;
            position: absolute;
            height: 9.65rem;
            background: #FFF;
            left: .75rem;
            right: .75rem;
            font-size: .8rem;
            /*top:3rem;*/

            .set-remark-pop-title {
                background-color: #F4F4F4;
                height: 2.2rem;
                width: 100%;
                border-bottom: 1px solid #DDDD;
                padding-left: .75rem;
                padding-top: .55rem;
            }

            .set-remark-pop-input {
                margin-top: .975rem;
                margin-left: 1.125rem;
                margin-right: 1.125rem;
                border: 1px solid #CCCCCC;
                overflow:hidden;

                ::-webkit-input-placeholder {
                    color: #999999;
                }

                :-moz-placeholder {
                    color: #999999;
                }

                ::-moz-placeholder {
                    color: #999999;
                }

                :-ms-input-placeholder {
                    color: #999999;
                }

                .pop-val {
                    margin-left: .85rem;
                    padding-top: .55rem;
                    padding-bottom: .55rem;
                    outline: none;
                }

            }

            .set-remark-pop-btn {
                display: -webkit-flex;
                display: flex;
                flex-flow: row wrap;
                justify-content: space-between;
                align-items: center;
                margin-top: .975rem;
                margin-left: 1.875rem;
                margin-right: 1.875rem;
                align-items: center;

                .pop-btn {
                    flex: 1;
                    text-align: center;
                    color: #FFFFFF;
                    border-radius: .25rem;
                    line-height: 1.125rem;
                    padding-top: .45rem;
                    padding-bottom: .45rem;
                }

                .cancel-btn {
                    background: #CCCCCC;
                    margin-right: 1rem;
                }

                .submit-btn {
                    background: #FF6600;
                }

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
            z-index: 1000;
        }
    }
</style>
