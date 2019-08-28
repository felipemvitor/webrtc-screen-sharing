import { Component, OnInit, ViewChild } from '@angular/core';

import { SignalingService } from '../signaling.service';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
    selector: 'app-video-conference',
    templateUrl: './video-conference.component.html',
    styleUrls: ['./video-conference.component.css']
})
export class VideoConferenceComponent implements OnInit {

    username = "Support"

    @ViewChild('remoteVideo', { static: true }) remoteVideo: any

    rVideo: any
    remoteStream: MediaStream
    peerConnection: any


    hasIncomingCall = false
    isCallAnswered = false
    videoEnabled = true
    btnEnableVideoText = "Enable Video"


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

    constructor(private server: SignalingService) { }

    ngOnInit() {
        this.rVideo = this.remoteVideo.nativeElement
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
