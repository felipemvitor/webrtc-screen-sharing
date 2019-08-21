import { Component, OnInit, ViewChild } from '@angular/core';
@Component({
    selector: 'app-video-conference',
    templateUrl: './video-conference.component.html',
    styleUrls: ['./video-conference.component.css']
})
export class VideoConferenceComponent implements OnInit {

    @ViewChild('localVideo', { static: true })
    localVideo: any;
    @ViewChild('remoteVideo', { static: true })
    remoteVideo: any;

    lVideo: any;
    rVideo: any;

    localStream: any;
    remoteStream: any;

    servers: any = null;
    localPeerConnection: any;
    remotePeerConnection: any;
    hasIncomingCall = false;
    isCallAnswered = false;
    videoEnabled = true;
    btnEnableVideoText = "Enable Video";

    mediaStreamConstraints = {
        video: {
            width: 480,
            height: 320
        },
        audio: false
    };

    offerOptions = {
        offerToReceiveVideo: 1
    };

    constructor() { }

    ngOnInit() {
        this.lVideo = this.localVideo.nativeElement;
        this.showLocalVideo();
    }

    //This method will be used to mock the interface
    showLocalVideo() {
        if (this.enableVideo) {
            navigator.mediaDevices.getUserMedia(this.mediaStreamConstraints)
                .then((mediaStream) => {
                    this.lVideo.srcObject = mediaStream;
                    this.lVideo.play();
                    this.localStream = mediaStream;
                    console.log("Received local stream");
                })
                .catch((error) => {
                    console.log("Error (getUserMedia): " + error);
                });
        }
    }

    enableVideo() {
        if (this.videoEnabled) {
            this.btnEnableVideoText = "Enable Video";
        }
        else {
            this.btnEnableVideoText = "Disable Video";
        }
        this.videoEnabled = !this.videoEnabled;
    }

    makeCall() {
        this.localPeerConnection = new RTCPeerConnection(this.servers);
        this.localPeerConnection.addEventListener('icecandidate', this.onConnection);
        this.localPeerConnection.addEventListener('iceconnectionstatechange', this.onConnectionChanged);
        this.remotePeerConnection = new RTCPeerConnection(this.servers);
        this.remotePeerConnection.addEventListener('icecandidate', this.onConnection);
        this.remotePeerConnection.addEventListener('iceconnectionstatechange', this.onConnectionChanged);
        this.remotePeerConnection.addEventListener('addstream', this.getRemoteMediaStream);
        this.localPeerConnection.addStream(this.localStream);
        this.localPeerConnection.createOffer(this.offerOptions)
            .then(this.createdOffer)

            .catch();
    }

    private onConnection = (event) => {
        this.rVideo = this.remoteVideo.nativeElement
        console.log("onIceCandidateEvent");
        const peerConnection = event.target;
        const iceCandidate = event.candidate;
        if (iceCandidate) {
            const newIceCandidate = new RTCIceCandidate(iceCandidate);
            const otherPeer = this.getOtherPeer(peerConnection);
            otherPeer.addIceCandidate(newIceCandidate)
                .then(() => {
                    console.log(`${this.getPeerName(peerConnection)} addIceCandidate success.`);
                }).catch(error => {
                    `${this.getPeerName(peerConnection)} failed to add ICE Candidate:\n` +
                        `${error.toString()}.`;
                });
            console.log(`${this.getPeerName(peerConnection)} ICE candidate:\n` +
                `${event.candidate.candidate}.`);
        }
    };

    private onConnectionChanged = (event) => {
        const peerConnection = event.target;
        console.log('ICE state change event: ', event);
        console.log(`${this.getPeerName(peerConnection)} ICE state: ` +
            `${peerConnection.iceConnectionState}.`);
    };

    private getRemoteMediaStream = (event) => {
        this.rVideo = this.remoteVideo.nativeElement
        const mediaStream = event.stream;
        this.rVideo.srcObject = mediaStream;
        this.rVideo.play();
        this.remoteStream = mediaStream;
    }

    private getOtherPeer(peerConnection) {
        return (peerConnection == this.localPeerConnection) ?
            this.remotePeerConnection : this.localPeerConnection;
    }

    private createdOffer = (description) => {
        //console.log(`Offer from localPeerConnection:\n${description.sdp}`);
        console.log('localPeerConnection setLocalDescription start.');
        this.localPeerConnection.setLocalDescription(description)
            .then(() => {
                this.setLocalDescriptionSuccess(this.localPeerConnection);
            }).catch(this.setSessionDescriptionError);
        console.log('remotePeerConnection setRemoteDescription start.');
        this.remotePeerConnection.setRemoteDescription(description)
            .then(() => {
                this.setRemoteDescriptionSuccess(this.remotePeerConnection);
            }).catch(this.setSessionDescriptionError);
        console.log('remotePeerConnection createAnswer start.');
        this.remotePeerConnection.createAnswer()
            .then(this.createdAnswer)
            .catch(this.setSessionDescriptionError);
    };

    private createdAnswer = (description) => {
        //console.log(`Answer from remotePeerConnection:\n${description.sdp}.`);
        console.log('remotePeerConnection setLocalDescription start.');
        this.remotePeerConnection.setLocalDescription(description)
            .then(() => {
                this.setLocalDescriptionSuccess(this.remotePeerConnection);
            }).catch(this.setSessionDescriptionError);
        console.log('localPeerConnection setRemoteDescription start.');
        this.localPeerConnection.setRemoteDescription(description)
            .then(() => {
                this.setRemoteDescriptionSuccess(this.remotePeerConnection);
            }).catch(this.setSessionDescriptionError);
    };

    private setDescriptionSuccess(peerConnection, functionName) {
        const peerName = this.getPeerName(peerConnection);
        console.log(`${peerName} ${functionName} complete.`);
    }

    private setSessionDescriptionError(error) {
        console.log(`Failed to create session description: ${error.toString()}.`);
    }

    private setLocalDescriptionSuccess(peerConnection) {
        this.setDescriptionSuccess(peerConnection, 'setLocallDescription');
    }

    private setRemoteDescriptionSuccess(peerConnection) {
        this.setDescriptionSuccess(peerConnection, 'setRemoteDescription');
    }

    private getPeerName(peerConnection) {
        return (peerConnection === this.localPeerConnection) ?
            'localPeerConnection' : 'remotePeerConnection';
    }
}
