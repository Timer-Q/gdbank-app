<template>
  <div class="page-toast">
    <h1 class="page-title">Toast</h1>
    <div class="page-toast-wrapper">
      <mt-button @click.native="openToast" size="large">点击弹出 Toast</mt-button>
    </div>
  </div>
</template>
<script>
  import {Toast} from 'mint-ui'
  export default {
    methods :{
      openToast(){
          Toast('dddd')
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

</style>
