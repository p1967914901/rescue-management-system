export default function compareTime(time1:string, time2:string) {
  const date1 = new Date(time1.replace(/-/g, '/'));
  const date2 = new Date(time2.replace(/-/g, '/'));
  return date1 > date2 ? 1 : date1 < date2 ? -1 : 0;
}
