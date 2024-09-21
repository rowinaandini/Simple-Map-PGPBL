import { Component, OnInit } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol'; // Import PictureMarkerSymbol
import ImageryLayer from '@arcgis/core/layers/ImageryLayer';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  mapView: MapView | any;
  userLocationGraphic: Graphic | any;
  map: Map | any;
  currentBasemap: string = 'topo-vector'; // Initial basemap
  isBasemapCardVisible: boolean = false; // Card visibility flag

  // Coordinates for the weather-related point marker
  weatherPointCoordinates = { latitude: 39.18038213986539, longitude:  -99.72276158254209}; // Denver, CO

  constructor() {}

  async ngOnInit() {
    this.map = new Map({
      basemap: this.currentBasemap
    });

    this.mapView = new MapView({
      container: 'container',
      map: this.map,
      zoom: 8
    });

    await this.updateUserLocationOnMap();
    this.mapView.center = this.userLocationGraphic.geometry as Point;
    setInterval(this.updateUserLocationOnMap.bind(this), 10000);

    const weatherServiceFL = new ImageryLayer({
      url: WeatheServiceUrl
    });
    this.map.add(weatherServiceFL);

    // Add the weather point marker to the map
    this.addWeatherPointMarker();
  }

  async getLocationService(): Promise<number[]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((resp) => {
        resolve([resp.coords.latitude, resp.coords.longitude]);
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true, // Menambahkan opsi untuk akurasi tinggi
        timeout: 10000, // Mengatur timeout jika terlalu lama
        maximumAge: 0 // Tidak menggunakan cache lokasi
      });
    });
  }

  async updateUserLocationOnMap() {
    const latLng = await this.getLocationService();
    const geom = new Point({ latitude: latLng[0], longitude: latLng[1] });
    if (this.userLocationGraphic) {
      this.userLocationGraphic.geometry = geom;
    } else {
      this.userLocationGraphic = new Graphic({
        symbol: new SimpleMarkerSymbol(),
        geometry: geom
      });
      this.mapView.graphics.add(this.userLocationGraphic);
    }
  }

  changeBasemap(basemap: string) {
    this.currentBasemap = basemap;
    this.map.basemap = basemap;
  }

  toggleBasemapCard() {
    this.isBasemapCardVisible = !this.isBasemapCardVisible;
  }

  addWeatherPointMarker() {
    const weatherPoint = new Point({
      latitude: this.weatherPointCoordinates.latitude,
      longitude: this.weatherPointCoordinates.longitude
    });

    // Use PictureMarkerSymbol for a more recognizable marker
    const weatherPointSymbol = new PictureMarkerSymbol({
      url: 'https://static.arcgis.com/images/Symbols/Shapes/RedPin1LargeB.png', // Example location pin URL
      width: '40px',
      height: '40px'
    });

    const weatherPointGraphic = new Graphic({
      geometry: weatherPoint,
      symbol: weatherPointSymbol
    });

    this.mapView.graphics.add(weatherPointGraphic);
  }
}

const WeatheServiceUrl = 'https://mapservices.weather.noaa.gov/eventdriven/rest/services/radar/radar_base_reflectivity_time/ImageServer';


// import { Component, OnInit } from '@angular/core';
// import Map from '@arcgis/core/Map';
// import MapView from '@arcgis/core/views/MapView';
// import Graphic from '@arcgis/core/Graphic';
// import Point from '@arcgis/core/geometry/Point';  // Import Point class
// import { Geolocation } from '@capacitor/geolocation';

// @Component({
//   selector: 'app-home',
//   templateUrl: 'home.page.html',
//   styleUrls: ['home.page.scss'],
// })
// export class HomePage implements OnInit {

//   constructor() {}
//   private latitude: number | any;
//   private longitude: number | any;

//   public async ngOnInit() {
//     const position = await Geolocation.getCurrentPosition();
//     this.latitude = position.coords.latitude;
//     this.longitude = position.coords.longitude;

//     console.log("Latitude: ", this.latitude);
//     console.log("Longitude: ", this.longitude);

//     const map = new Map({
//       basemap: "topo-vector"
//     });

//     const view = new MapView({
//       container: "container",
//       map: map,
//       zoom: 15,  // Increase zoom level for a closer view
//       center: [this.longitude, this.latitude]
//     });

//     // Ensure the view is ready before adding the marker
//     view.when(() => {
//       // Marker symbol
//       const markerSymbol = {
//         type: "simple-marker",
//         color: [226, 119, 40],
//         outline: {
//           color: [255, 255, 255],
//           width: 2
//         }
//       };

//       // Create a Point geometry
//       const point = new Point({
//         longitude: this.longitude,
//         latitude: this.latitude
//       });

//       // Create a graphic and add the geometry and symbol to it
//       const pointGraphic = new Graphic({
//         geometry: point,
//         symbol: markerSymbol
//       });

//       // Add the graphic to the view's graphics layer
//       view.graphics.add(pointGraphic);
//     });
//   }
// }
