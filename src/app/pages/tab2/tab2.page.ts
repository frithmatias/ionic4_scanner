import { Component } from '@angular/core';
import { DataLocalService } from 'src/app/services/data-local.service';

@Component({
	selector: 'app-tab2',
	templateUrl: 'tab2.page.html',
	styleUrls: [ 'tab2.page.scss' ]
})
export class Tab2Page {
	constructor(public dataLocal: DataLocalService) {}
	// public porque desde el html voy a aceder a una propiedad 'guardados' en el servicio que es pública
	// recordemos que si no esta definido como si es pública o privada typescript lo infiere como pública.
	// html -> *ngFor="let registro of dataLocal.guardados" <- acá, dataLocal también debe ser pública.

	abrirRegistro(registro) {
		console.log('registro: ', registro);
		this.dataLocal.abrirScan(registro);
	}

	enviarCorreo() {
		this.dataLocal.enviarCorreo();
	}
}
