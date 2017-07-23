<template>
  <div class="receipt-content-info">
    <dl>
      <dt>收款终端</dt>
      <dd>其他终端</dd>
    </dl>
    <dl>
      <dt>商户号</dt>
      <dd>3498734958</dd>
    </dl>
    <dl>
      <dt>商品</dt>
      <dd>洗发水</dd>
    </dl>
    <dl>
      <dt>商户名称</dt>
      <dd>屈臣氏</dd>
    </dl>
    <dl>
      <dt>优惠劵号</dt>
      <dd>30498520935723049857</dd>
    </dl>
    <dl>
      <dt>交易单号</dt>
      <dd>2323434598743598783974</dd>
    </dl>
    <dl>
      <dt>商户单号</dt>
      <dd>234923874293874923874</dd>
    </dl>
    <dl>
      <dt>下单时间</dt>
      <dd>2017-03-28 14:58:43</dd>
    </dl>
    <dl>
      <dt>支付方式</dt>
      <dd>光大银行信用卡</dd>
    </dl>
   <!-- <dl>
      <dt>交易状态</dt>
      <dd>支付成功</dd>
    </dl>-->
    <dl>
      <dt>完成时间</dt>
      <dd>2017-03-28 14:59:08</dd>
    </dl>
    <dl>
      <dt>退款单号</dt>
      <dd>452435245454454545</dd>
    </dl>
    <dl>
      <dt>退款申请时间</dt>
      <dd>2017-04-01 15:34:23</dd>
    </dl>
    <dl>
      <dt>退款状态</dt>
      <dd>退款成功</dd>
    </dl>
    <dl>
      <dt>退款完成时间</dt>
      <dd>2017-04-01 15:34:25</dd>
    </dl>
  </div>
</template>
<script>
  export default {
    props: {
      data: {
        type: Object,
        default: null
      }
    }
  }
</script>
<style  rel="stylesheet/scss" lang="scss" scoped>
  .receipt-content-info {
    padding: .525rem .75rem 1.275rem;
    overflow: hidden;
    dl {
      clear: left;
      line-height: 1.5rem;
      dt {
        float: left;
        color: #666666;
        font-size: .75rem;
      }
      dd {
        float: right;
        color: #666666;
        font-size: .8rem;
      }
    }
  }
</style>
