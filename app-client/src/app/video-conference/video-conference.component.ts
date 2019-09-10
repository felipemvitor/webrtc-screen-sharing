import { Component, OnInit, ViewChild } from '@angular/core';
import { SignalingService } from '../signaling.service';

@Component({
    selector: 'app-video-conference',
    templateUrl: './video-conference.component.html',
    styleUrls: ['./video-conference.component.css']
})
export class VideoConferenceComponent implements OnInit {

    username = "Client"
    otherUsername: any

    @ViewChild('localVideo', { static: true }) localVideo: any
    @ViewChild('remoteVideo', { static: true }) remoteVideo: any

    lVideo: any
    rVideo: any
    localStream: MediaStream
    remoteStream: MediaStream

    peerConnection: any

    btnConnection = "Connect"
    connected = false

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

    constructor(private server: SignalingService) { }

    ngOnInit() {
        this.lVideo = this.localVideo.nativeElement
        this.rVideo = this.remoteVideo.nativeElement
        this.configureSocket()
    }

    private configureSocket() {
        this.server.listenToSocket()
        this.server.addEventListener('open', this.onOpen)
        this.server.addEventListener('message', this.onMessage)
    }

    private onOpen = () => {
        console.log('Connected to the signaling server.')
    }

    private onError = (error) => {
        console.error('Error: ' + error)
    }

    private onMessage = (message) => {
        console.log('Message received: ' + message.data)

        const data = JSON.parse(message.data)

        switch (data.type) {
            case 'login':
                this.handleLogin(data.success)
                break
            case 'offer':
                this.handleOffer(data.offer, data.username)
                break
            case 'answer':
                this.handleAnswer(data.answer)
                break
            case 'candidate':
                this.handleCandidate(data.candidate)
                break
            case 'close':
                this.handleClose()
                break
            default:
                break

        }
    }

    handleLogin = async (success) => {
        if (success === false) {
            alert('Username already taken')
        } else {
            // this.localStream = await navigator.mediaDevices.getUserMedia(this.mediaStreamConstraints)
            // this.lVideo.srcObject = this.localStream
            // this.lVideo.play()

            try {
                const mediaDevices:any = navigator.mediaDevices

                if (mediaDevices.getDisplayMedia) {
                    console.log('navigator.mediaDevices.getDisplayMedia')
                    mediaDevices.getDisplayMedia(this.mediaStreamConstraints).then(screenStream => {
                        this.localStream = screenStream
                        this.lVideo.srcObject = this.localStream
                        this.lVideo.play().then()
                        this.configurePeerConnection()
                    })
                }

            } catch (error) {
                console.log('error : ' + error)
            }

        }
    }

    handleOffer = (offer, username) => {
        this.otherUsername = username
        this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
        this.peerConnection.createAnswer()
            .then(answer => {
                this.peerConnection.setLocalDescription(answer)
                this.server.sendMessage({
                    type: 'answer',
                    answer: answer,
                    otherUsername: this.otherUsername
                })
            })
            .catch(error => {
                alert('Error when creating an answer')
                console.error('Error creating answer: ' + error)
            })
    }

    handleAnswer = answer => {
        this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
    }

    handleCandidate = candidate => {
        this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
    }

    handleClose = () => {
        this.otherUsername = null
        this.rVideo.stop()
        this.rVideo.srcObject = null
        this.peerConnection.close()
        this.peerConnection.onicecandidate = null
        this.peerConnection.onaddstream = null
    }

    configurePeerConnection = () => {
        console.log('Configuring peer connection')
        this.peerConnection = new RTCPeerConnection(this.rtcConfig)
        this.peerConnection.addStream(this.localStream)
        this.peerConnection.onaddstream = (event => {
            this.rVideo.srcObject = event.stream
            this.remoteStream = event.stream
        })
        this.peerConnection.onicecandidate = event => {
            if (event.candidate) {
                this.server.sendMessage({
                    type: 'candidate',
                    candidate: event.candidate,
                    otherUsername: this.otherUsername
                })
            }
        }
    }

    connect() {
        if (!this.connected) {

            this.server.sendMessage({ type: 'login', username: this.username })

            this.btnConnection = "Disconnect"

        } else {
            this.server.sendMessage({ type: 'close' })
            this.btnConnection = "Connect"
        }
        this.connected = !this.connected
    }

    makeCall() {
        this.otherUsername = 'Support'
        this.peerConnection.createOffer()
            .then(offer => {
                this.server.sendMessage({
                    type: 'offer',
                    offer: offer,
                    otherUsername: this.otherUsername
                })
                this.peerConnection.setLocalDescription(offer)
            })
            .catch(error => console.error('Error creating an offer: ' + error))
    }

    answerCall() {
        if (this.remoteStream != null) {
            this.rVideo.play()
        }
    }
}
