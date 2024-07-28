const truckLocation = [-83.093, 42.376];
const warehouseLocation = [-83.083, 42.363];
const lastAtRestaurant = 0;
const keepTrack = [];
const pointHopper = {};

// Add your access token
mapboxgl.accessToken = 'pk.eyJ1IjoiYW5kcmV3Y2hpdWxsIiwiYSI6ImNsejU4dHZ3cjN1eWgya3M2YjVzMWVlYjgifQ.crnPw_K3dclSRgskM3JWuQ';

// Initialize a map
const map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/light-v11', // stylesheet location
  center: truckLocation, // starting position
  zoom: 12 // starting zoom
});
// Create a GeoJSON feature collection for the warehouse
const warehouse = turf.featureCollection([turf.point(warehouseLocation)]);

// Create an empty GeoJSON feature collection for drop-off locations
const dropoffs = turf.featureCollection([]);

map.on('load', async () => {
  const marker = document.createElement('div');
  marker.classList = 'truck';

  // Create a new marker
  new mapboxgl.Marker(marker).setLngLat(truckLocation).addTo(map);

  // Create a circle layer
  map.addLayer({
    id: 'warehouse',
    type: 'circle',
    source: {
      data: warehouse,
      type: 'geojson'
    },
    paint: {
      'circle-radius': 20,
      'circle-color': 'white',
      'circle-stroke-color': '#3887be',
      'circle-stroke-width': 3
    }
  });

  // Create a symbol layer on top of circle layer
  map.addLayer({
    id: 'warehouse-symbol',
    type: 'symbol',
    source: {
      data: warehouse,
      type: 'geojson'
    },
    layout: {
      'icon-image': 'grocery',
      'icon-size': 1.5
    },
    paint: {
      'text-color': '#3887be'
    }
  });

  // dropoffs symbol layer
  map.addLayer({
    id: 'dropoffs-symbol',
    type: 'symbol',
    source: {
      data: dropoffs,
      type: 'geojson'
    },
    layout: {
      'icon-allow-overlap': true,
      'icon-ignore-placement': true,
      'icon-size': 3,
      'icon-image': 'marker' // ???? Use icons in [Maki Icons | By Mapbox](https://labs.mapbox.com/maki-icons/)
    }
  });
  // Listen for a click on the map
  await map.on('click', addWaypoints);
});
async function addWaypoints(event) {
  // When the map is clicked, add a new drop off point
  // and update the `dropoffs-symbol` layer
  await newDropoff(map.unproject(event.point));
  updateDropoffs(dropoffs);
}
async function newDropoff(coordinates) {
  // Store the clicked point as a new GeoJSON feature with
  // two properties: `orderTime` and `key`
  const pt = turf.point([coordinates.lng, coordinates.lat], {
    orderTime: Date.now(),
    key: Math.random()
  });
  dropoffs.features.push(pt);
}

function updateDropoffs(geojson) {
  map.getSource('dropoffs-symbol').setData(geojson);
}