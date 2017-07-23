<template>
    <div class="login">
        <!--<div style="height: 2.2rem;"></div>-->
        <div class="login-logo"></div>
        <div class="login-info">
            <div class="login-info-input login-bottom-border">
                <input type="text" class="val" placeholder="请输入商户号或手机号" v-model="usrOprId">
            </div>
            <div class="login-info-input">
                <input type="password" class="val" placeholder="请输入密码" v-model="logPswd">
            </div>
        </div>
        <div class="login-rember">
            <span @click="toChecked"><input type="checkbox" class="login-rember-checkbox" :checked="isChecked"><label
                    class="login-rember-checkbox-label"></label>记住我</span>
            <span class="login-rember-label float-right">忘记密码?</span>
        </div>
        <div class="next-button-wrapper" @click="login">
            <next-button :next="title"></next-button>
        </div>
    </div>

</template>

<script>
    export default {
        data: function () {
            return {
                title: '登录',
                isChecked: false,
                usrOprId:'',
                logPswd:'',
                hasCheckedLogin:false
            }
        },
        methods: {
            test: function () {
                this.$quickTip('测试成功');
                console.log(this.$trim(' 123 555 '));
            },
            toChecked: function () {
                this.isChecked = !this.isChecked;
            },
            login: function () {
                if(this.valid()) {
                  let that = this;
                  this.$post('mercOprLogin', {
                    merchantSign: '122222',
                    usrOprId: that.$trim(that.usrOprId),
                    logPswd: that.$trim(that.logPswd),
                    cnlTyp: 'www'
                  }, function(res){
                      if(res.data.returnSts=='RPM00000') {
                        localStorage.setItem('merchUser', JSON.stringify(res.data));
                        localStorage.setItem('login', JSON.stringify({'id':that.usrOprId,'psd':that.logPswd}));
                        that.sendLogin();
                        that.$router.replace('/main');
                      }else {
                        that.$quickTip('账号或密码错误！');
                      }
                  }, function(res){
                    that.$quickTip('账号或密码错误！'+res);
                  });
                }
            },
            valid:function () {
              if (!this.$trim(this.usrOprId)) {
                this.$quickTip('请输入商户号或手机号');
                return false;
              }
              return true;
            },
            getLogin(vm){
                let _self =vm;
                vm.$indicator.open('加载中...');
                setTimeout(()=> _self.$indicator.close(),500);
                if(window.cordova){
                    window.cordova.exec(function (data) {
                            if(data){
                                _self.usrOprId = data.userId;
                                _self.logPswd = data.password;
                            }else{
                                let user = JSON.parse(localStorage.getItem('login'));
                                _self.usrOprId = user.id;
                                _self.logPswd = user.psd;
                            }
                        },
                        function (error) {
                            console.log(error);
                        },
                        'TPGetAccount',
                        'getAccountAction',
                        []
                    ); 
                }else{
                    let user = JSON.parse(localStorage.getItem('login'));
                    _self.usrOprId = user.id;
                    _self.logPswd = user.psd;
                }
            },
            sendLogin(){
                let _self = this; 
                try{
                    if(window.cordova){
                        window.cordova.exec(function (data) {
                                console.log(data);
                            },
                            function (error) {
                                console.log(error);
                            },
                            'TPSaveAccount',
                            'saveAccountAction',
                            [{'userId':_self.usrOprId,'password':_self.logPswd}]
                        );
                    }                   
                }catch(e){
                    console.log(e);
                }
            }
        },
        // mounted(){
        //     this.$nextTick(()=>{
        //         this.$back.mm()
        //     })
        // },
        beforeRouteEnter (to, from, next) {
          next(vm => {
            vm.$options.methods.getLogin(vm);
          })
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .login {
        font-family: PingFangSC-Regular;
        height: 100%;
        background: #F4F4F4;
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

        .float-right {
            float: right;
        }

        .login-logo {
            width: 100%;
            height: 185px;
            background: url("img/login-ceb-logo.png") no-repeat center;
            background-size: 13.75rem 4.305rem;
        }

        .login-info {
            margin-left: .625rem;
            margin-right: .875rem;
            background: #FFF;
            border: 1px solid #DDDDDD;
            border-radius: 2px;

            .login-bottom-border {
                border-bottom: 1px solid #DDDDDD;
            }

            .login-info-input {
                padding-top: .7rem;
                padding-bottom: .7rem;
                height: 2.5rem;
                color: #999999;
                letter-spacing: 0;
                font-size: .8rem;

                .val {
                    padding-left: .75rem;
                    outline: none;
                    width: 100%;

                }

            }
        }
        .login-rember {
            margin-left: .625rem;
            margin-top: .45rem;
            font-size: .8rem;
            color: #999999;
            letter-spacing: 0;
            /*line-height : 1.3 rem;*/

            .login-rember-checkbox {
                /*margin-right : .275 rem;*/
                display: none;

                &:checked + label {
                    background-color: #943EBD;
                    border-color: #943EBD;
                }

            }
            .login-rember-checkbox-label {
                position: relative;
                background-color: #FFF;
                margin-right: .275rem;
                margin-top: -.1rem;
                border: 1px solid #C1CACA;
                vertical-align: middle;
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05), inset 0px -15px 10px -12px rgba(0, 0, 0, 0.05);
                padding: .325rem;
                border-radius: 2px;
                display: inline-block;
                box-sizing: content-box;
                &:active {
                    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05), inset 0px 1px 3px rgba(0, 0, 0, 0.1);
                }
                &:after {
                    position: absolute;
                    box-sizing: content-box;
                    content: "";
                    border: 2px solid #FFF;
                    border-top: 0;
                    border-left: 0;
                    height: .4rem;
                    width: .2rem;
                    top: .05rem;
                    left: .17rem;
                    transform: rotate(45deg);
                    transform-origin: center;
                    transition: transform .15s cubic-bezier(.71, -.46, .88, .6) .05s;
                }
            }
            .login-rember-label {
                margin-right: 1.025rem;
            }

        }
        .next-button-wrapper {
            margin: .8rem .875rem 0 .625rem;
        }
    }

</style>
