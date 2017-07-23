<template>
  <transition name="sh-indicator">
    <div class="sh-indicator" v-show="visible">
      <div class="sh-indicator-wrapper" :style="{'padding':text?'20px':'15px'}">
        <spinner class="sh-indicator-spin" :type="convertedSpinnerType" :size="32"></spinner>
        <span class="sh-indicator-text" v-show="text">{{text}}</span>
      </div>
      <div class="sh-indicator-mask" @touchmove.stop.prevent></div>
    </div>
  </transition>
</template>
<style rel="stylesheet/scss" lang="scss" scoped>
   .sh-indicator {
     transition: opacity .2s linear;
     .sh-indicator-wrapper {
       top:50%;
       left:50%;
       position: fixed;
       transform: translate(-50%, -50%);
       border-radius: 5px;
       background: rgba(0, 0, 0, 0.7);
       color: white;
       box-sizing: border-box;
       text-align: center;
       .sh-indicator-spin {
         display: inline-block;
         text-align: center;
       }
       .sh-indicator-text{
         display: block;
         color: #fff;
         text-align: center;
         margin-top: 10px;
         font-size: 16px;
       }
     }
     .sh-indicator-mask {
       top:0;
       left:0;
       position: fixed;
       width: 100%;
       height: 100%;
       opacity: 0;
       background: transparent;
     }
   }
   .sh-indicator-enter,
   .sh-indicator-leave-active {
     opacity: 0;
   }
</style>
<script>
  import Spinner from '../spinner/snake.vue';
  export default {
      data:function () {
        return {
          visible:false
        }
      },
      components:{
          Spinner
      },
      computed: {
        convertedSpinnerType() {
          switch (this.spinnerType) {
            default:
              return 0;
          }
        }
      },
      props:{
        text: String,
        spinnerType: {
          type: String,
          default: 'snake'
        }
      }
  }
</script>
