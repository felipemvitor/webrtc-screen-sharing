const http = require('http')
const socketIo = require('socket.io')

const PORT = 3000

var server = http.createServer((req, res) => {
    console.log("Server is running on port " + PORT)
}).listen(3000)

var webSocket = socketIo.listen(server)

webSocket.sockets.on('connection', (socket) => {

    socket.on('message', (message) => {
        console.log('Message received: ' + message)
        socket.broadcast.emit('message', message)
    })

    socket.on('create or join', (room) => {
        console.log('Received request to create or join room ' + room)

        var clientsInRoom = webSocket.sockets.adapter.rooms[room]
        var numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0

        console.log('Clients in room' + room + 'updated to ' + numClients + ' clients')

        if (numClients === 0) {
            socket.join(room);
            console.log('Client ID ' + socket.id + ' created room ' + room);
            socket.emit('created', room, socket.id);
        } else if (numClients === 1) {
            console.log('Client ID ' + socket.id + ' joined room ' + room);
            webSocket.sockets.in(room).emit('join', room);
            socket.join(room);
            socket.emit('joined', room, socket.id);
            webSocket.sockets.in(room).emit('ready');
        } else {
            socket.emit('full', room);
        }
    })

    socket.on('ipaddr', () => {
        var ifaces = os.networkInterfaces();
        for (var dev in ifaces) {
            ifaces[dev].forEach(function (details) {
                if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
                    socket.emit('ipaddr', details.address);
                }
            });
        }
    });
})