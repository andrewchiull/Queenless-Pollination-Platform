'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import 'mapbox-gl/dist/mapbox-gl.css';
import dotenv from 'dotenv';

dotenv.config();

export default function MapPage() {
  // Mapbox Access Token
  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'USE YOUR OWN TOKEN';

  // Color variables
  const yellow = '#f2b21d';
  const red = '#be3887';
  const blue = '#3887be';

  // Refs for the map and container
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  // Locations and state
  const truckLocation: [number, number] = [121.542, 25.018]; // NTU BiME Building
  const warehouseLocation: [number, number] = [121.564, 25.033]; // Taipei 101
  const dropoffs = turf.featureCollection([]);
  const pointHopper: { [key: string]: any } = {};
  const lastAtRestaurant = 0;
  let keepTrack: any[] = [];

  // Initial dropoff locations
  const initialDropoffs: [number, number][] = [
    [121.537, 25.019], // 國立臺灣大學
    [121.748, 24.747], // 國立宜蘭大學
    [120.674, 24.125], // 國立中興大學
    [120.426, 23.480], // 國立嘉義大學
    [120.597, 22.656], // 國立屏東科技大學
  ];

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (map.current) return; // Initialize map only once

    // Initialize the map
    map.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: truckLocation,
      zoom: 12,
    });

    map.current.on('load', () => {
      // Add truck marker
      const truckMarker = document.createElement('div');
      truckMarker.className = 'truck';
      new mapboxgl.Marker(truckMarker).setLngLat(truckLocation).addTo(map.current!);

      // Add warehouse layer
      const warehouse = turf.featureCollection([turf.point(warehouseLocation)]);

      map.current!.addLayer({
        id: 'warehouse',
        type: 'circle',
        source: {
          type: 'geojson',
          data: warehouse,
        },
        paint: {
          'circle-radius': 20,
          'circle-color': 'white',
          'circle-stroke-color': red,
          'circle-stroke-width': 5,
        },
      });

      map.current!.addLayer({
        id: 'warehouse-symbol',
        type: 'symbol',
        source: {
          type: 'geojson',
          data: warehouse,
        },
        layout: {
          'icon-image': 'grocery',
          'icon-size': 1.5,
        },
      });

      // Add dropoffs layer
      map.current!.addLayer({
        id: 'dropoffs-symbol',
        type: 'circle',
        source: {
          type: 'geojson',
          data: dropoffs,
        },
        paint: {
          'circle-radius': 5,
          'circle-color': 'white',
          'circle-stroke-color': red,
          'circle-stroke-width': 5,
        },
      });

      map.current!.addLayer({
        id: 'warehouse-symbol',
        type: 'symbol',
        source: {
          type: 'geojson',
          data: warehouse,
        },
        layout: {
          'icon-image': 'grocery-15',
          'icon-size': 1.5,
        },
      });

      // Add dropoffs layer
      map.current!.addLayer({
        id: 'dropoffs-symbol',
        type: 'symbol',
        source: {
          type: 'geojson',
          data: dropoffs,
        },
        layout: {
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
          'icon-image': 'marker-15',
        },
      });

      // Add route source and layers
      const nothing = turf.featureCollection([]);
      map.current!.addSource('route', {
        type: 'geojson',
        data: nothing,
      });

      map.current!.addLayer(
        {
          id: 'routeline-active',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': blue,
            'line-width': ['interpolate', ['linear'], ['zoom'], 12, 3, 22, 12],
          },
        },
        'waterway-label'
      );

      map.current!.addLayer(
        {
          id: 'routearrows',
          type: 'symbol',
          source: 'route',
          layout: {
            'symbol-placement': 'line',
            'text-field': '▶',
            'text-size': ['interpolate', ['linear'], ['zoom'], 12, 24, 22, 60],
            'symbol-spacing': ['interpolate', ['linear'], ['zoom'], 12, 30, 22, 160],
            'text-keep-upright': false,
          },
          paint: {
            'text-color': red,
            'text-halo-color': 'hsl(55, 11%, 96%)',
            'text-halo-width': 3,
          },
        },
        'waterway-label'
      );

      // Add initial dropoffs
      initialDropoffs.forEach(async (location) => {
        await addWaypoint(new mapboxgl.LngLat(location[0], location[1]));
        updateDropoffs(dropoffs);
      });

      // Add click event listener
      map.current!.on('click', async (e) => {
        await addWaypoint(e.lngLat);
        updateDropoffs(dropoffs);
      });
    });
  }, []);

  async function addWaypoint(lngLat: mapboxgl.LngLat) {
    const pt = turf.point([lngLat.lng, lngLat.lat], {
      orderTime: Date.now(),
      key: Math.random(),
    });
    dropoffs.features.push(pt);
    pointHopper[pt.properties.key] = pt;

    try {
      const response = await fetch(assembleQueryURL());
      const json = await response.json();

      if (json.code !== 'Ok') {
        const handleMessage =
          json.code === 'InvalidInput'
            ? 'Refresh to start a new route.'
            : 'Try a different point.';
        alert(`${json.code} - ${json.message}\n\n${handleMessage}`);
        dropoffs.features.pop();
        delete pointHopper[pt.properties.key];
        return;
      }

      const routeGeoJSON = turf.featureCollection([
        turf.feature(json.trips[0].geometry),
      ]);
      map.current!.getSource('route')!.setData(routeGeoJSON);
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  }

  function updateDropoffs(geojson: any) {
    map.current!.getSource('dropoffs-symbol')!.setData(geojson);
  }

  function assembleQueryURL() {
    const coordinates = [truckLocation];
    const distributions: string[] = [];
    keepTrack = [truckLocation];

    const restJobs = Object.keys(pointHopper).map((key) => pointHopper[key]);

    if (restJobs.length > 0) {
      const needToPickUp =
        restJobs.filter((d) => d.properties.orderTime > lastAtRestaurant).length >
        0;

      let restaurantIndex;
      if (needToPickUp) {
        restaurantIndex = coordinates.length;
        coordinates.push(warehouseLocation);
        keepTrack.push(pointHopper.warehouse);
      }

      for (const job of restJobs) {
        keepTrack.push(job);
        coordinates.push(job.geometry.coordinates);
        if (needToPickUp && job.properties.orderTime > lastAtRestaurant) {
          distributions.push(`${restaurantIndex},${coordinates.length - 1}`);
        }
      }
    }

    const url =
      `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/` +
      coordinates.join(';') +
      `?distributions=${distributions.join(';')}` +
      `&overview=full&steps=true&geometries=geojson&source=first` +
      `&access_token=${mapboxgl.accessToken}`;
    return url;
  }

  return (
    <div>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100vh' }} />
      <style jsx global>{`
        .truck {
          width: 20px;
          height: 20px;
          border: 2px solid #fff;
          border-radius: 50%;
          background: ${blue};
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
