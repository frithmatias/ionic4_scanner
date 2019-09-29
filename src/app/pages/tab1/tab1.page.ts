import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { DataLocalService } from 'src/app/services/data-local.service';

@Component({
	selector: 'app-tab1',
	templateUrl: 'tab1.page.html',
	styleUrls: [ 'tab1.page.scss' ]
})
export class Tab1Page {
	constructor(private barcodeScanner: BarcodeScanner, private dataLocal: DataLocalService) {}
	sliderOptions = {
		allowSlidePrev: false,
		allowSlideNext: false
	};

	scan() {
		this.barcodeScanner
			.scan()
			.then((barcodeData) => {
				if (!barcodeData.cancelled) {
					this.dataLocal.guardarRegistro(barcodeData.format, barcodeData.text);
				}
				console.log('Barcode data', barcodeData);
			})
			.catch((err) => {
				console.log('Error', err);

				// Solo para probarlo desde el escritorio. Esto se ejecuta porque me devuelve un error
				// ese error es que no disponemos de cordova desde el escritorio.

				// 'https://www.altair.com.ar/projects'
				this.dataLocal
					.guardarRegistro('QR_CODE', 'geo:-34.579554261480304,-58.507536797131365')
					.then((data) => {
						console.log(data);
					});
			});
	}

	ionViewDidEnter() {
		// console.log('viewDidEnter!');
	}

	ionViewDidLeave() {
		// console.log('viewDidLeave!');
	}

	ionViewDidLoad() {
		// console.log('ionViewDidLoad!'); // no se dispara posiblemente obsoleto.
	}

	ionViewWillEnter() {
		// console.log('ionViewWillEnter!'); // no se dispara posiblemente obsoleto.
	}
}
