import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
	selector: 'app-video-conference',
	templateUrl: './video-conference.component.html',
	styleUrls: ['./video-conference.component.css']
})
export class VideoConferenceComponent implements OnInit {

	@ViewChild('remoteVideo') remoteVideo: any

	video: any

	hasIncomingCall = false
	isCallAnswered = false
	videoEnabled = false
	btnEnableVideoText = "Enable Video"

	mediaStreamConstraints = {
		video: true,
		audio: true
	}

	constructor() { }

	ngOnInit() {
		this.video = this.remoteVideo.nativeElement

		this.showLocalVideo()
	}

	//This method will be used to mock the interface
	showLocalVideo() {
		if (this.enableVideo) {
			navigator.mediaDevices.getUserMedia(this.mediaStreamConstraints)
				.then((mediaStream) => {
					this.video.srcObject = mediaStream
					this.video.play()

					console.log("Received local stream")
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
}
