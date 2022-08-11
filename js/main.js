const postUrl =
  "https://script.google.com/macros/s/AKfycbzR0ihiyd3Nt31s3DCyOMd-ZYbjFOfYZsVz46OVcyYskGOY_U11aDliO9C3jUN-N3w2/exec";
function getNowDate() {
  const dayList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const date = new Date();
  const dateText = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()} ${dayList[date.getDay()]}`;
  return dateText;
}
function post(url, data) {
  const param = {
    "method": "POST",
    "mode": "no-cors",
    "Content-Type": "application/x-www-form-urlencoded",
    "body": data
  };
  fetch(url, param)
}
function clickEntry() {
  hideButton();
  //alert("entry");
  const data = makeJson(Object.assign({ type: "entry" }, template()));
  post(postUrl, data);
}
function clickExit() {
  hideButton();
  //alert("exit");
  const data = makeJson(Object.assign({ type: "exit" }, template()));
  post(postUrl, data);
}
function template() {
  return {
    date: getNowDate(),
    name: document.getElementById("QR-msg").innerText,
    sheetId: "1mDxnBSa8N6JqXkUZKDzSNWFnj4B8RVi8yJ-E9eFbvEs",
    sheetName: "データ",
  };
}
function makeJson(obj) {
  const json = JSON.stringify(obj);
  return json;
}