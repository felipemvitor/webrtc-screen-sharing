import { Component, OnInit, ViewChild } from '@angular/core';

import * as socketIo from 'socket.io-client'

const SERVER_URL = 'http://localhost:3000'

@Component({
  selector: 'app-video-conference',
  templateUrl: './video-conference.component.html',
  styleUrls: ['./video-conference.component.css']
})
export class VideoConferenceComponent implements OnInit {

  @ViewChild('remoteVideo', { static: true }) remoteVideo: any

  rVideo: any

  hasIncomingCall = false
  isCallAnswered = false
  videoEnabled = true
  btnEnableVideoText = "Enable Video"

  socket: any
  remoteStream: MediaStream
  remotePeerConnection: any

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

  constructor() { }

  ngOnInit() {
    this.rVideo = this.remoteVideo.nativeElement

    this.configureSocket()
    this.createPeerConnection()
  }

  enableVideo() {
    if (this.videoEnabled) {
      this.btnEnableVideoText = "Enable Video"
    } else {
      this.btnEnableVideoText = "Disable Video"
    }
    this.videoEnabled = !this.videoEnabled
  }

  configureSocket() {
    this.socket = socketIo(SERVER_URL)

    this.socket.on('message', (message) => {
      console.log('Support received message')
      if (JSON.parse(message).type === 'offer') {
        this.remotePeerConnection.setRemoteDescription(new RTCSessionDescription(JSON.parse(message)))
        this.answerCall()
      } else {
        console.log('message: ' + message)
      }
    })
  }

  createPeerConnection() {
    try {
      this.remotePeerConnection = new RTCPeerConnection(this.rtcConfig)
      this.remotePeerConnection.onicecandidate = this.onIceCandidate
      this.remotePeerConnection.onaddstream = this.onAddStream
      this.remotePeerConnection.onremovestream = this.onRemoveStream
      console.log('Peer connection created')
    } catch (exeption) {
      console.log('Failed to create peer connection: ' + exeption.message)
      return
    }


  }

  onIceCandidate = (event) => {
    console.log('onIceCandidate event: ', event);
    if (event.candidate) {
      this.sendMessage({
        type: 'candidate',
        label: event.candidate.sdpMLineIndex,
        id: event.candidate.sdpMid,
        candidate: event.candidate.candidate
      });
    } else {
      console.log('End of candidates.');
    }
  }

  onAddStream = (event) => {
    console.log('Remote stream added.')
    console.log('remoteStream: ' + this.remoteStream)
    this.rVideo.srcObject = event.stream
    this.rVideo.play()
    this.remoteStream = event.stream

  }

  onRemoveStream = (event) => {
    console.log('Remote stream removed.')
  }

  private sendMessage(message) {
    console.log('Remote sending message: ' + message)
    this.socket.emit(message)
  }

  private answerCall() {
    console.log('Sending answer to peer.')
    this.remotePeerConnection.createAnswer()
      .then((sessionDescription) => {
        this.remotePeerConnection.setLocalDescription(sessionDescription)
        console.log('setLocalAndSendMessage sending message', sessionDescription)
        this.sendMessage(sessionDescription)
      })
      .catch((error) => {
        console.log('Failed to create session description: ' + error)
      })
  }
}
