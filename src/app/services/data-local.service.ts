import { Injectable } from '@angular/core';
import { Registro } from '../models/registro.model';
import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { NavController } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

@Injectable({
	providedIn: 'root'
})
export class DataLocalService {
	guardados: Registro[] = [];

	constructor(
		private storage: Storage,
		private iab: InAppBrowser,
		private navController: NavController,
		private file: File,
		private emailComposer: EmailComposer
	) {
		this.cargarHistorial();
	}

	async guardarRegistro(format: string, text: string) {
		await this.cargarHistorial(); // tengo que asegurarme de que el storage este listo antes de guardar.
		const nuevoRegsitro = new Registro(format, text);
		this.guardados.unshift(nuevoRegsitro);
		this.storage.set('historialscan', this.guardados);
		console.log(this.guardados);
		this.abrirScan(nuevoRegsitro);
	}

	async cargarHistorial() {
		this.guardados = (await this.storage.get('historialscan')) || [];
	}

	abrirScan(registro: Registro) {
		this.navController.navigateForward('/tabs/tab2');
		switch (registro.type) {
			case 'http':
				// abrir el browser por defecto. Para eso utilizo el plugin In App Broswer
				// https://ionicframework.com/docs/native/in-app-browser
				// $ionic cordova plugin add cordova-plugin-inappbrowser
				// $npm install @ionic-native/in-app-browser
				const browser = this.iab.create(registro.text, '_system');
				browser.on('loadstop').subscribe((event) => {
					console.log(event);
					browser.insertCSS({ code: 'body{color: red;' });
				});

				browser.close();
				break;
			case 'geo':
				this.navController.navigateForward(`/tabs/tab2/mapa/${registro.text}`);
				break;
		}
	}

	enviarCorreo() {
		const arrTemp = [];
		const titulos = 'Tipo, Formato, CreadoEn, Texto\n';
		arrTemp.push(titulos);
		this.guardados.forEach((registro) => {
			const linea = `${registro.type}, ${registro.format}, ${registro.created}, ${registro.text.replace(
				',',
				' '
			)}\n`;

			arrTemp.push(linea);
		});
		console.log(arrTemp.join(''));
		this.crearDataCSV(arrTemp.join(''));
	}

	crearDataCSV(text: string) {
		this.file
			.checkFile(this.file.dataDirectory, 'registros.csv')
			// si existe -> escribe
			.then((existe) => {
				console.log('Existe archivo? ', existe);
				return this.escribirDataCSV(text);
			})
			// si no existe -> lo crea
			.catch((err) => {
				return (
					this.file
						.createFile(this.file.dataDirectory, 'registros.csv', false)
						// si pudo crear el archivo -> escribe
						.then((creado) => {
							console.log(creado);
							/*
							FileEntry {isFile: true, isDirectory: false, name: "registros.csv", fullPath: "/registros.csv", filesystem: FileSystem, …}
								> filesystem: FileSystem
									name: "files"
									root: DirectoryEntry
										filesystem: FileSystem {name: "files", root: DirectoryEntry}
										fullPath: "/"
										isDirectory: true
										isFile: false
										name: ""
										nativeURL: "file:///data/user/0/io.ionic.starter/files/"
										__proto__: Entry
									__proto__: Object
								> fullPath: "/registros.csv"
								> isDirectory: false
								> isFile: true
								> name: "registros.csv"
								> nativeURL: "file:///data/user/0/io.ionic.starter/files/registros.csv"


							El path de la aplicacion 'io.ionic.starter' lo puedo cambiar desde config.xml 
							<widget id="io.ionic.starter"...
							*/
							this.escribirDataCSV(text);
						})
						// si no pudo crear el archivo -> devuelve error
						.catch((err2) => {
							console.log('No se pudo crear el archivo, ', err2);
						})
				);
			});
	}

	async escribirDataCSV(text: string) {
		const archivo = `${this.file.dataDirectory}/registros.csv`;
		await this.file.writeExistingFile(this.file.dataDirectory, 'registros.csv', text);
		console.log('File: ', this.file.dataDirectory, 'registros.csv');

		// podríamos utilizar la validación sugerida por el plugin

		// this.emailComposer.isAvailable().then((available: boolean) =>{
		// 		if(available) {
		// 			//Now we know we can send
		// 		}
		// });

		// pero lo vamos a usar directamente.

		const email = {
			to: 'matiasfrith@gmail.com',
			cc: '',
			bcc: [ 'john@doe.com', 'jane@doe.com' ],
			attachments: [
				archivo
				// 'file://img/logo.png',
				// 'res://icon.png',
				// 'base64:icon.png//iVBORw0KGgoAAAANSUhEUg...',
				// 'file://README.pdf'
			],
			subject: 'App Scanner',
			body: 'Registros de escaneos de <strong>App Scanner</strong>',
			isHtml: true
		};

		// Send a text message using default options
		this.emailComposer.open(email);
	}
}
