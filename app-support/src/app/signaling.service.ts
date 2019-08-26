import { Injectable } from '@angular/core';

import * as socketIo from 'socket.io-client'
import { Observable } from 'rxjs';

const SERVER_URL = "http://localhost:3000"

@Injectable({
    providedIn: 'root'
})
export class SignalingService {
    private socket: any

    constructor() {
        this.socket = socketIo(SERVER_URL)
    }

    public createOrJoin(room: string) {
        this.socket.emit('create or join', room)
    }

    public onCreated(): Observable<string> {
        return new Observable<string>(observer => {
            this.socket.on('created', (data: string) => {
                observer.next(data)
            })
        })
    }

    public onJoin(): Observable<string> {
        return new Observable<string>(observer => {
            this.socket.on('join', (data: string) => {
                observer.next(data)
            })
        })
    }

    public onJoined(): Observable<string> {
        return new Observable<string>(observer => {
            this.socket.on('joined', (data: string) => {
                observer.next(data)
            })
        })
    }


    public onReady(): Observable<string> {
        return new Observable<string>(observer => {
            this.socket.on('ready', (data: string) => {
                observer.next(data)
            })
        })
    }


    public onIpAddr(): Observable<string> {
        return new Observable<string>(observer => {
            this.socket.on('ipaddr', (data: string) => {
                observer.next(data)
            })
        })
    }
}
