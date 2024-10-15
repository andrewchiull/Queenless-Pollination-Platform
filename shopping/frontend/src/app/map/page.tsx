'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function MapPage() {
  // Mapbox Access Token
  mapboxgl.accessToken = 'pk.eyJ1IjoiYW5kcmV3Y2hpdWxsIiwiYSI6ImNsejU4dHZ3cjN1eWgya3M2YjVzMWVlYjgifQ.crnPw_K3dclSRgskM3JWuQ';

  // Refs for the map and container
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  // Locations and state
  const truckLocation: [number, number] = [-83.093, 42.376];
  const warehouseLocation: [number, number] = [-83.083, 42.363];
  const dropoffs = turf.featureCollection([]);
  const pointHopper: { [key: string]: any } = {};
  const lastAtRestaurant = 0;
  let keepTrack: any[] = [];

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
      new mapboxgl.Marker(truckMarker)
        .setLngLat(truckLocation)
        .addTo(map.current!);

      // Add warehouse layer
      const warehouse = turf.featureCollection([
        turf.point(warehouseLocation),
      ]);

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
          'circle-stroke-color': '#3887be',
          'circle-stroke-width': 3,
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

      // Add route source and layer
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
            'line-color': '#3887be',
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
            'text-color': '#3887be',
            'text-halo-color': 'hsl(55, 11%, 96%)',
            'text-halo-width': 3,
          },
        },
        'waterway-label'
      );

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
          background: #3887be;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}