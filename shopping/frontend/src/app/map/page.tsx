'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import 'mapbox-gl/dist/mapbox-gl.css';
import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

export default function MapPage() {
  const IdsInputRef = useRef<HTMLInputElement>(null);
  const [ids, setIds] = useState<number[]>([]);
  const [initialDropoffs, setInitialDropoffs] = useState<Dropoff[]>([]);

  useEffect(() => {
    // Update the input field with the current ids
    // If the input field is empty, return
    if (!(IdsInputRef.current?.value)) return;

    IdsInputRef.current.value = ids.join(',');
    console.log("in the useEffect 1, ids: ", ids);
    const query = `?q=${ids.join('&q=')}`;
    axios.get(`/api/testing/customer_from_purchase_id/${query}`).then(response => {
      setInitialDropoffs(response.data);
    }).catch(error => {
      console.error("There was an error fetching the products!", error);
    });
  }, [ids]);

  useEffect(() => {
    // Update the map with the initial dropoffs
    initialDropoffs.forEach(async (location) => {
      await addWaypoint(new mapboxgl.LngLat(location.lon, location.lat));
      updateDropoffs(dropoffs);
    });
  }, [initialDropoffs]);

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

      // // Add click event listener
      // map.current!.on('click', async (e) => {
      //   await addWaypoint(e.lngLat);
      //   updateDropoffs(dropoffs);
      // });
    });
  }, [initialDropoffs]);

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
      console.log("geojson: ", geojson);
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
      <div 
        style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          zIndex: 1,
          backgroundColor: 'white',
          padding: '5px',
          borderRadius: '5px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}
      >
        <input ref={IdsInputRef} type="text" placeholder="Enter Purchase IDs"
          style={{
            margin: '5px'
          }}
        />
        <button onClick={() => {
          // filter out negative numbers and empty strings
          setIds(() => {
            return IdsInputRef.current?.value.split(',')
              .map(Number)
              .filter((num: number) => num > 0)
              || [];
          });
        }}
        style={{
          margin: '5px'
        }}
        >Submit</button>
      </div>
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
