import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, AlertController, ToastController, ActionSheetController } from 'ionic-angular';

import { AngularFire } from 'angularfire2';
import { LoginPage } from '../login/login';

declare var SimpleWebRTC: any;

@Component({
  templateUrl: 'build/pages/page1/page1.html'
})
export class Page1 {

  @ViewChild('local') localVideo: ElementRef;
  @ViewChild('remote') remoteVideo: ElementRef;
  webRTC: any;
  userPic: string;
  audioState: string;
  videoState: string;
  inCall: boolean;

  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private af: AngularFire,
    private toastCtrl: ToastController,
    private actionCtrl: ActionSheetController) {
  }

  ionViewDidEnter() {
    this.userPic = sessionStorage.getItem('userPic');
    this.audioState = 'unmuted';
    this.videoState = 'playing';
    this.inCall = false;

    this.webRTC = new SimpleWebRTC({
      // the id/element dom element that will hold "our" video
      localVideoEl: this.localVideo.nativeElement,
      // the id/element dom element that will hold remote videos
      remoteVideosEl: this.remoteVideo.nativeElement,
      // immediately ask for camera access
      autoRequestMedia: true
    });

    this.webRTC.joinRoom(sessionStorage.getItem('userEmail'));

    // connection status
    this.webRTC.on('videoAdded', (video, peer) => {
      if (peer && peer.pc) {
        peer.pc.on('iceConnectionStateChange', (event) => {
          switch (peer.pc.iceConnectionState) {
            case 'checking':
              let toast = this.toastCtrl.create({
                message: 'Connecting...',
                duration: 2000
              });
              toast.present();
              break;
            case 'connected':
            case 'completed': // on caller side
              let connectedToast = this.toastCtrl.create({
                message: 'Connected!',
                duration: 2000
              });
              connectedToast.present();
              this.inCall = true;
              break;
            case 'disconnected':
              let disconnectedToast = this.toastCtrl.create({
                message: 'Disconnected',
                duration: 2000
              });
              disconnectedToast.present();
              this.inCall = false;
              break;
            case 'failed':
              let failedToast = this.toastCtrl.create({
                message: 'Connection failed',
                duration: 2000
              });
              failedToast.present();
              break;
            case 'closed':
              let closedToast = this.toastCtrl.create({
                message: 'Connection closed',
                duration: 2000
              });
              closedToast.present();
              this.inCall = false;
              break;
          }
        });
      }
    });

    this.webRTC.on('mute', () => {
      let toast = this.toastCtrl.create({
        message: 'The other user has paused their video',
        duration: 2000
      });
      toast.present();
    });
  }

  call() {
    let alert = this.alertCtrl.create({
      title: 'Call',
      message: 'Enter the gmail of the person you would like to call',
      inputs: [
        {
          name: 'email',
          placeholder: 'cool@gmail.com'
        },
      ],
      buttons: [
        {
          text: 'Call',
          handler: data => {
            console.log(data);
            this.webRTC.joinRoom(data.email);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
        }
      ]
    });
    alert.present();
  }

  logout() {
    let actionsheet = this.actionCtrl.create({
      title: 'Options',
      buttons: [
        {
          text: 'Logout',
          handler: () => {
            console.log('Archive clicked');
            this.af.auth.logout();
            this.navCtrl.setRoot(LoginPage);
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionsheet.present();
  }

  callOptions() {
    let actionSheet = this.actionCtrl.create({
      title: 'Call Options',
      buttons: [
        {
          text: 'mute/unmute audio',
          handler: () => {
            if (this.audioState === 'unmuted') {
              this.webRTC.mute();
              this.audioState = 'muted';
            } else {
              this.webRTC.unmute();
              this.audioState = 'unmuted';
            }
          }
        },
        {
          text: 'resume/pause video',
          handler: () => {
            if (this.videoState === 'playing') {
              this.webRTC.pauseVideo();
              this.videoState = 'paused';
            } else {
              this.webRTC.resumeVideo();
              this.videoState = 'playing';
            }
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
}
