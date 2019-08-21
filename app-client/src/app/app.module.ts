import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
	MatCardModule,
	MatButtonModule,
	MatProgressBarModule,
	MatIconModule,
	MatGridListModule
} from '@angular/material'

import { VideoConferenceComponent } from "./video-conference/VideoConferenceComponent";

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
		MatIconModule,
		MatGridListModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
