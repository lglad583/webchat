
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'webcam',
  templateUrl: './webcam.component.html',
  styleUrls: ['./webcam.component.css']
})
export class WebcamComponent implements OnInit {

  @ViewChild('myvideo') myVideo: any;


  constructor() {
  }

  ngOnInit() {
    this.startVideo();
  }

  startVideo(){
    let video = this.myVideo.nativeElement;
    let constraints = {audio: false, video: {width: 720, height: 480}};
    navigator.mediaDevices.getUserMedia(constraints)
      .then(function (mediaStream) {
        let video = document.querySelector('video');
        video.srcObject = mediaStream;
        video.onloadedmetadata = function (e) {
          video.play();
          console.log('way to go')
        };
      })
      .catch(function (err) {
        console.log(err.name + ": " + err.message);

      });
  }


}
