<template>
  <mt-popup v-model="visible" position="bottom" class="mint-datetime">
    <mt-picker
      :slots="dateSlots"
      @change="onChange"
      :visible-item-count="visibleItemCount"
      class="mint-datetime-picker"
      ref="picker"
      show-toolbar>
      <span class="mint-datetime-action mint-datetime-cancel" @click="visible = false">{{ cancelText }}</span>
      <span class="mint-datetime-action mint-datetime-confirm" @click="confirm">{{ confirmText }}</span>
    </mt-picker>
  </mt-popup>
</template>
<style rel="stylesheet/scss" lang="scss" scoped>
  .mint-datetime {
    width: 100%;
    .picker-slot-wrapper, .picker-item {
      backface-visibility: hidden;
    }
    .picker-toolbar {
      border-bottom: solid 1px #eaeaea;
    }
    .mint-datetime-action {
      display: inline-block;
      width: 50%;
      text-align: center;
      line-height: 40px;
      font-size: 16px;
      color: #26a2ff;
    }
    .mint-datetime-cancel {
      float: left;
    }
    .mint-datetime-confirm {
      float: right;
    }
  }
</style>
