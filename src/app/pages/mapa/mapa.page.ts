import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
declare var mapboxgl: any;

@Component({
	selector: 'app-mapa',
	templateUrl: './mapa.page.html',
	styleUrls: [ './mapa.page.scss' ]
})
export class MapaPage implements OnInit, AfterViewInit {
	constructor(private activatedRoute: ActivatedRoute) {}

	lat = 0;
	lng = 0;
	coor: string[] = [];

	ngOnInit() {
		let geo = this.activatedRoute.snapshot.paramMap.get('geo');
		geo = geo.substr(4);
		this.coor = geo.split(',');

		this.lat = Number(this.coor[0]);
		this.lng = Number(this.coor[1]);

		console.log(this.lat, this.lng);
	}

	ngAfterViewInit() {
		// Live Cylce Hook, se dispara despues de que se inicializa el componente.
		mapboxgl.accessToken =
			'pk.eyJ1IjoiY29kZXI0MDQiLCJhIjoiY2sxMnBkMnl1MDA4cDNvcDFxanV4cThzZSJ9.qHR4JrSJ0aqpIG8VVRUTLw';

		// con estas propiedades puedo ver ya el mapa en perspeciva para visualizarlo en 3D.
		const map = new mapboxgl.Map({
			style: 'mapbox://styles/mapbox/light-v10',
			//			center: [ -74.0066, 40.7135 ],
			center: [ this.lng, this.lat ],

			zoom: 15.5,
			pitch: 45,
			bearing: -17.6,
			container: 'map',
			antialias: true
		});

		map.on('load', () => {
			// Cambio a función de flecha para no perder la referencia al objeto THIS.
			// Insert the layer beneath any symbol layer.
			map.resize(); // para solucionar el problema de que no ocupa toda la pantalla.

			// Marcador
			const marker = new mapboxgl.Marker().setLngLat([ this.lng, this.lat ]).addTo(map);

			const layers = map.getStyle().layers;

			let labelLayerId;
			for (let i = 0; i < layers.length; i++) {
				if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
					labelLayerId = layers[i].id;
					break;
				}
			}
			// para inicializar los edificios en 3D.
			map.addLayer(
				{
					id: '3d-buildings',
					source: 'composite',
					'source-layer': 'building',
					filter: [ '==', 'extrude', 'true' ],
					type: 'fill-extrusion',
					minzoom: 15,
					paint: {
						'fill-extrusion-color': '#aaa',

						// use an 'interpolate' expression to add a smooth transition effect to the
						// buildings as the user zooms in
						'fill-extrusion-height': [
							'interpolate',
							[ 'linear' ],
							[ 'zoom' ],
							15,
							0,
							15.05,
							[ 'get', 'height' ]
						],
						'fill-extrusion-base': [
							'interpolate',
							[ 'linear' ],
							[ 'zoom' ],
							15,
							0,
							15.05,
							[ 'get', 'min_height' ]
						],
						'fill-extrusion-opacity': 0.6
					}
				},
				labelLayerId
			);
		});
	}
}
