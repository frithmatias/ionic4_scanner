import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicStorageModule } from '@ionic/storage';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// plugins Ionic
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { File } from '@ionic-native/file/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

@NgModule({
	declarations: [ AppComponent ],
	entryComponents: [],
	imports: [ IonicStorageModule.forRoot(), BrowserModule, IonicModule.forRoot(), AppRoutingModule ],
	providers: [
		StatusBar,
		SplashScreen,
		BarcodeScanner,
		InAppBrowser,
		File,
		EmailComposer,
		{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
	],
	bootstrap: [ AppComponent ]
})
export class AppModule {}
