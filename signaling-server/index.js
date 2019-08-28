const http = require('http')
const socketIo = require('socket.io')

const PORT = 3000

var server = http.createServer((req, res) => {
    console.log("Server is running on port " + PORT)
}).listen(3000)

var webSocket = socketIo.listen(server)

webSocket.sockets.on('connection', (socket) => {
    console.log(' User connected')

    socket.on('message', message => {
        console.log('Received message: ' + message)
    })

    socket.on('close', () => {

    })
})