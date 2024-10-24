'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import 'mapbox-gl/dist/mapbox-gl.css';
import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

export default function MapPage() {

  useEffect(() => {
    const ids = [4, 5, 6, 7, 8];
    const query = `?q=${ids.join('&q=')}`;
    axios.get(`/api/testing/customer_from_purchase_id/${query}`).then(response => {
      console.log(response.data);
    }).catch(error => {
      console.error("There was an error fetching the products!", error);
    });
  }, []);

  // Mapbox Access Token
  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'USE_YOUR_OWN_TOKEN';

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
  type Dropoff = {
    address: string;
    email: string;
    lat: number;
    id: number;
    name: string;
    lon: number;
  }

  const initialDropoffs: Dropoff[] = [
      {
          address: "台北市大安區羅斯福路四段1號",
          email: "ntu@ntu.edu.tw",
          lat: 25.019,
          id: 4,
          name: "國立臺灣大學",
          lon: 121.537
      },
      {
          address: "台中市南區國光路250號",
          email: "nchu@nchu.edu.tw",
          lat: 24.125,
          id: 5,
          name: "國立中興大學",
          lon: 120.674
      },
      {
          address: "嘉義市東區學府路300號",
          email: "cycu@cycu.edu.tw",
          lat: 23.466,
          id: 6,
          name: "國立嘉義大學",
          lon: 120.485
      },
      {
          address: "屏東縣內埔鄉學府路1號",
          email: "npu@npu.edu.tw",
          lat: 22.656,
          id: 7,
          name: "國立屏東科技大學",
          lon: 120.597
      },
      {
          address: "宜蘭縣宜蘭市神農路一段1號",
          email: "niu@niu.edu.tw",
          lat: 24.747,
          id: 8,
          name: "國立宜蘭大學",
          lon: 121.748
      }
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
        await addWaypoint(new mapboxgl.LngLat(location.lon, location.lat));
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
      const response = await axios.get(assembleQueryURL());
      const json = response.data;

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
      
      const routeSource = map.current!.getSource('route');
      if (routeSource && 'setData' in routeSource) {
        (routeSource as mapboxgl.GeoJSONSource).setData(routeGeoJSON);
      } else {
        console.error('Route source not found or does not support setData');
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  }

  function updateDropoffs(geojson: any) {
    const dropoffsSource = map.current!.getSource('dropoffs-symbol');
    if (dropoffsSource && 'setData' in dropoffsSource) {
      (dropoffsSource as mapboxgl.GeoJSONSource).setData(geojson);
    } else {
      console.error('Dropoffs source not found or does not support setData');
    }
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
