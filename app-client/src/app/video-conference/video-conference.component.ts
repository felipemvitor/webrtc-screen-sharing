import { Component, OnInit, ViewChild } from '@angular/core';
import { SignalingService } from '../signaling.service';
import * as socketIo from 'socket.io-client';

const SERVER_URL = 'http://localhost:3000'

@Component({
    selector: 'app-video-conference',
    templateUrl: './video-conference.component.html',
    styleUrls: ['./video-conference.component.css']
})
export class VideoConferenceComponent implements OnInit {

    username = "Client"

    @ViewChild('localVideo', { static: true }) localVideo: any

    lVideo: any
    localStream: MediaStream
    peerConnection: any

    hasIncomingCall = false
    isCallAnswered = false
    videoEnabled = true
    btnEnableVideoText = "Disable Video"

    mediaStreamConstraints = {
        video: {
            width: 480,
            height: 320
        },
        audio: false
    }

    rtcConfig = {
        iceServers: [{
            urls: 'stun:stun.l.google.com:19302'
        }]
    }

    offerOptions = {
        offerToReceiveVideo: 1
    }

    constructor(private service: SignalingService) { }

    ngOnInit() {
        console.log(this.localVideo)
        this.lVideo = this.localVideo.nativeElement

        this.showLocalVideo()
    }

    //This method will be used to mock the interface
    private showLocalVideo() {
        if (this.enableVideo) {
            navigator.mediaDevices.getUserMedia(this.mediaStreamConstraints)
                .then((mediaStream) => {
                    this.lVideo.srcObject = mediaStream
                    this.lVideo.play()
                    this.localStream = mediaStream
                })
                .catch((error) => {
                    console.log("Error (getUserMedia): " + error)
                })
        }
    }

    private enableVideo() {
        if (this.videoEnabled) {
            this.btnEnableVideoText = "Enable Video"
        } else {
            this.btnEnableVideoText = "Disable Video"
        }
        this.videoEnabled = !this.videoEnabled
    }
}
