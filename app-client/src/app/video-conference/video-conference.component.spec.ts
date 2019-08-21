import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoConferenceComponent } from "./VideoConferenceComponent";

describe('VideoConferenceComponent', () => {
  let component: VideoConferenceComponent;
  let fixture: ComponentFixture<VideoConferenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoConferenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoConferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
