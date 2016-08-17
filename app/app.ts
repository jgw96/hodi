import { Component, ViewChild } from '@angular/core';
import { ionicBootstrap, Platform, Nav } from 'ionic-angular';

import {
  FIREBASE_PROVIDERS,
  defaultFirebase,
  firebaseAuthConfig,
  AuthProviders,
  AuthMethods } from 'angularfire2';

import { Page1 } from './pages/page1/page1';
import { Page2 } from './pages/page2/page2';
import { LoginPage } from './pages/login/login';

@Component({
  templateUrl: 'build/app.html'
})
class MyApp {

  rootPage: any = LoginPage;

  constructor(public platform: Platform) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {

    });
  }
}

ionicBootstrap(MyApp, [
  FIREBASE_PROVIDERS,
  // Initialize Firebase app  
  defaultFirebase({
    apiKey: 'AIzaSyB_r5i2UeGtPIA-K7OljYRod8Gwn2eYs9g',
    authDomain: 'trio-b3927.firebaseapp.com',
    databaseURL: 'https://trio-b3927.firebaseio.com',
    storageBucket: 'trio-b3927.appspot.com'
  }),
  firebaseAuthConfig({
    provider: AuthProviders.Google,
    method: AuthMethods.Redirect
  })
]);
