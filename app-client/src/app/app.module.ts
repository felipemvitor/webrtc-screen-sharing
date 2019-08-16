import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
	MatCardModule,
	MatButtonModule,
	MatProgressBarModule,
	MatIconModule
} from '@angular/material'

import { VideoConferenceComponent } from './video-conference/video-conference.component'

@NgModule({
	declarations: [
		AppComponent,
		VideoConferenceComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		MatCardModule,
		MatButtonModule,
		MatProgressBarModule,
		MatIconModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
