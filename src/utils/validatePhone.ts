export default function validatePhone(phone:string) {
  // 使用正则表达式判断手机号码是否有效
  const reg = /^1[3-9]\d{9}$/;
  return reg.test(phone);
}
