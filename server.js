const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let answers = {};
let opened = false;

app.use(express.static("public"));

wss.on("connection", ws => {
  ws.send(JSON.stringify({ type:"init", answers, opened }));

  ws.on("message", msg => {
    const data = JSON.parse(msg);

    if(data.type === "answer"){
      answers[data.name] = data.answer;
    }
    if(data.type === "open"){
      opened = true;
    }
    if(data.type === "reset"){
      answers = {};
      opened = false;
    }

    wss.clients.forEach(c=>{
      c.send(JSON.stringify({
        type:"update",
        answers,
        opened,
        locked
      }));
    });
  });
});

server.listen(process.env.PORT || 3000);
