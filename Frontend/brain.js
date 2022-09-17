let data = document.getElementById('data');
let websocket = new WebSocket('ws://192.168.1.2:3003/');
websocket.onmessage=message=>{data.innerHTML=message.data; console.log(message.data);}