import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SignalingService {
    private socket: WebSocket

    constructor() { }

    public listenToSocket() {
        this.socket = new WebSocket('ws://localhost:3000')
    }

    public addEventListener(event, listener) {
        this.socket.addEventListener(event, listener)
    }

    sendMessage(message) {
        console.log('Sending message to Signaling Server: ' + message.type)
        this.socket.send(JSON.stringify(message))
    }
}