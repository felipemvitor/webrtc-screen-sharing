const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 3000 })

wss.on('connection', ws => {
    console.log(' User connected')

    ws.on('message', message => {
        console.log('Received message: ' + message)
    })

    ws.on('close', () => {
        console.log('Close connection')
    })
})