import { Injectable } from '@angular/core';

import * as socketIo from 'socket.io-client'
import { Observable } from 'rxjs';

const SERVER_URL = "http://localhost:3000"

@Injectable({
    providedIn: 'root'
})
export class SignalingService {
    private socket: any

    constructor() { }

    public listenToSocket() {
        this.socket = socketIo(SERVER_URL)
    }

    public sendMessage(message) {
        console.log('Sending message to socket.')
        this.socket.emit('message', message)
    }

    public onMessage(): Observable<string> {
        return new Observable<string>(observer => {
            this.socket.on('message', (message) => {
                observer.next(message)
            })
        })
    }
}
