const process = require('process');
const BOLT_API_KEY =process.env.BOLT_IOT_API_KEY_MAIN; 

let deviceId = "BOLT8024485";
const LM35CONSTANT=10.24;

const port = 3003;

const http = require("http");
const {default:axios} = require('axios');

const httpserver = http.createServer((req, res) => {
    console.log("We got a request");
});

let connections = [];

const WebSocketServer = require("websocket").server;

const websocket = new WebSocketServer({

    httpServer: httpserver
});

websocket.on("request", (request) => {
    let connection = request.accept(null, request.origin);





    connection.on("message", (message) => {
        console.log("Got a message");
        console.log(message.utf8Data);
    })

    connections.push(connection)
  
}


);



setInterval(()=>{
   axios
   .get(`https://cloud.boltiot.com/remote/${BOLT_API_KEY}/analogRead?deviceName=${deviceId}&pin=A0`)
   .then(res=>{
        console.log(res.data)
        let temperature = "Server error"
        let raw_temperature =res.data["value"];
        if(isNaN(Number(raw_temperature)) == false) temperature = (Math.round(raw_temperature / LM35CONSTANT))+"&deg;C";
        connections.forEach(con=>con.send(temperature))
        

})


    
    } ,
    10000);
httpserver.listen(port, ()=>console.log(`Server is running on port ${port}`));