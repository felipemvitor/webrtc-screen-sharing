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

  @ViewChild('localVideo', { static: true }) localVideo: any

  lVideo: any
  localStream: MediaStream
  localPeerConnection: any
  socket: any

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

  offerOptions = {
    offerToReceiveVideo: 1
  }

  constructor(private service: SignalingService) { }

  ngOnInit() {
    console.log(this.localVideo)
    this.lVideo = this.localVideo.nativeElement

    this.showLocalVideo()

    this.socket = socketIo(SERVER_URL)

  }

  //This method will be used to mock the interface
  showLocalVideo() {
    if (this.enableVideo) {
      navigator.mediaDevices.getUserMedia(this.mediaStreamConstraints)
        .then((mediaStream) => {
          this.lVideo.srcObject = mediaStream
          this.lVideo.play()
          this.localStream = mediaStream

          console.log("Received local stream")

          this.createPeerConnection()
        })
        .catch((error) => {
          console.log("Error (getUserMedia): " + error)
        })
    }
  }

  enableVideo() {
    if (this.videoEnabled) {
      this.btnEnableVideoText = "Enable Video"
    } else {
      this.btnEnableVideoText = "Disable Video"
    }
    this.videoEnabled = !this.videoEnabled
  }

  createPeerConnection() {
    try {
      this.localPeerConnection = new RTCPeerConnection(this.rtcConfig)
      this.localPeerConnection.onicecandidate = this.onIceCandidate
    } catch (exeption) {
      console.log('Failed Creating RTCPeerConnecion: ' + exeption)
      return
    }

    this.localPeerConnection.addStream(this.localStream)

    console.log('RTCPeerConnection created')
  }

  makeCall() {
    console.log("Make Call")
    this.localPeerConnection.createOffer()
      .then((sessionDescription) => {
        this.localPeerConnection.setLocalDescription(sessionDescription)
        this.sendMessage(sessionDescription)

      })
      .catch((event) => {
        console.log('Error creating offer: ' + event)
      })

  }

  private onIceCandidate = (event) => {
    console.log('Ice candidate event: ' + event)

    if (event.candidate) {
      this.sendMessage({
        type: 'candidate',
        label: event.candidate.sdpMLineIndex,
        id: event.candidate.sdpMid,
        candidate: event.candidate.candidate
      })
    } else {
      console.log('End of candidates')
    }
  }

  sendMessage(message) {
    console.log('App client sending message: ' + message)
    this.socket.emit('message', message)
  }
}
