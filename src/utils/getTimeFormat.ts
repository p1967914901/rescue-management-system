export default function getTimeFormat (format = 'yyyy-MM-dd') {
  const date = new Date();
  const year = date.getFullYear(); // 年份
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份，注意要补零
  const day = String(date.getDate()).padStart(2, '0'); // 日，注意要补零
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  if (format === 'yyyy-MM-dd') {
    return `${year}-${month}-${day}`; // 返回格式化后的日期字符串
  } else if (format === 'yyyy-MM-dd HH:mm') {
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
  return '';
}

