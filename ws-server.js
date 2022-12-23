const app = require("./http-server").app;
const expressWs = require('express-ws')

// let server = require('http').createServer(app);
// var WebSocketServer = require("ws").Server;
// const io = require('socket.io')(http, {cors: {origin: '*'}}); //TODO get rid of socket.io in public folder

const port = require("./http-server").port;
expressWs(app)

// http.listen(port, function() {

//     console.log(`http/ws server listening on ${port}`);

// });

// server.listen(port, () => {
//   console.log(`http/ws server listening on ${port}`);
// });

// var wss = new WebSocketServer({server: server, path: "/mapws"});

// wss.on('connection', (socket) => {
//     console.log('CONNECTED: ' + socket.remoteAddress +':'+ socket.remotePort);
//     socket.emit('message', 'Connection started.');

//     socket.on('message', (message) => {
//       socket.send('copy: ' + message);
//     })
  
// });

app.ws('/mapws', (ws, req) => {
  ws.on('connect', () => {
    console.log('WebSocket was opened')
  })

  ws.on('message', (msg) => {
      ws.send(msg)
  })

  ws.on('close', () => {
      console.log('WebSocket was closed')
  })
})

app.listen(port);