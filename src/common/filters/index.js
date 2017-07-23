const orderType = {
  W1:	'待支付',
  W2:	'付款申请中',
  W4:	'银行处理中',
  S1:	'支付成功',
  S:	'退款成功',
  F:	'交易关闭'
};
export  default {
  formatMoney(money){
    var f = parseFloat(money);
    if (isNaN(f)) {
      return false;
    }
    var f = Math.round(money*100)/100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
      rs = s.length;
      s += '.';
    }
    while (s.length <= rs + 2) {
      s += '0';
    }
    return s;
  },
  formatSts(ordersts) {
    return orderType[ordersts] || '';
  }
}
