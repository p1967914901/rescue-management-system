export default function validateIdCard(idCard:string) {
  // 使用正则表达式判断身份证号码是否有效
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  return reg.test(idCard);
}
