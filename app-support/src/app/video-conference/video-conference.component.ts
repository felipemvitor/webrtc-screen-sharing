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
		navigator.mediaDevices.getUserMedia(this.mediaStreamConstraints)
			.then((mediaStream) => {
				console.log(this.video)
				this.video.srcObject = mediaStream
				this.video.play()

				console.log("Received local stream")
			})
			.catch((error) => {
				console.log("Error (getUserMedia): " + error)
			})
	}
}
