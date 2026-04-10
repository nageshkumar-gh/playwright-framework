export function randomEmpIdData() {
  const now = new Date();

  //const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  const ms = String(now.getMilliseconds()).padStart(2, '0');

  return `${min}${ss}${ms}`;
}