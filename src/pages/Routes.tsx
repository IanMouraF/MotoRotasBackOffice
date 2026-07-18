import React, { useMemo } from 'react';
import Map, { Marker, Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN; 

const RESTAURANT_COORDS = { lat: -3.7838716, lon: -38.5008209 };

interface Order {
  id: string;
  coords: { lat: number; lon: number };
}

interface RouteProps {
  id: number;
  orders: Order[];
}

interface RoutesMapProps {
  routes?: RouteProps[];
}

export default function RoutesMap({ routes = [] }: RoutesMapProps) {
  
  const routeLines = useMemo(() => {
    const features = (routes || [])
      .map((route) => {
        
        // 1. ESCUDO: Filtra pedidos que vieram sem coordenada ou com coordenada "0"
        const validOrders = (route.orders || []).filter(
          order => order.coords && Number(order.coords.lat) !== 0 && Number(order.coords.lon) !== 0
        );

        // 2. FORÇAR NÚMEROS: Garante que o Mapbox vai receber cálculo matemático
        const coordinates = [
          [Number(RESTAURANT_COORDS.lon), Number(RESTAURANT_COORDS.lat)],
          ...validOrders.map((order) => [Number(order.coords.lon), Number(order.coords.lat)])
        ];

        return {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: coordinates
          }
        };
      })
      // 3. A CAUSA DO CRASH: Só entrega a linha pro Mapbox se ela tiver 2 pontos ou mais!
      .filter(feature => feature.geometry.coordinates.length > 1);

    return {
      type: 'FeatureCollection',
      features
    };
  }, [routes]);

  const routeColors = ['#ff4b4b', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <div style={{ height: '500px', width: '100%', borderRadius: '15px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <Map
        initialViewState={{
          longitude: RESTAURANT_COORDS.lon,
          latitude: RESTAURANT_COORDS.lat,
          zoom: 12.5
        }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        {/* MARCADOR DO RESTAURANTE (Com Number() por segurança) */}
        <Marker longitude={Number(RESTAURANT_COORDS.lon)} latitude={Number(RESTAURANT_COORDS.lat)} anchor="bottom">
          <div style={{ fontSize: '32px', filter: 'drop-shadow(0px 3px 4px rgba(0,0,0,0.4))', zIndex: 10 }}>
            🏪
          </div>
        </Marker>

        {/* MARCADORES DOS PEDIDOS */}
        {(routes || []).map((route, routeIndex) => {
          const markerColor = routeColors[routeIndex % routeColors.length]; 
          
          const validOrders = (route.orders || []).filter(
            order => order.coords && Number(order.coords.lat) !== 0 && Number(order.coords.lon) !== 0
          );

          return validOrders.map((order, index) => (
            <Marker key={order.id} longitude={Number(order.coords.lon)} latitude={Number(order.coords.lat)} anchor="bottom">
              <div style={{ 
                background: markerColor, 
                color: 'white', 
                width: '26px', 
                height: '26px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                borderRadius: '50%', 
                fontWeight: 'bold', 
                fontSize: '13px',
                border: '2px solid white',
                boxShadow: '0 3px 6px rgba(0,0,0,0.3)'
              }}>
                {index + 1}
              </div>
            </Marker>
          ));
        })}

        {/* LINHA CONTÍNUA DO TRAJETO */}
        <Source id="route-lines" type="geojson" data={routeLines as any}>
          <Layer 
            id="lines" 
            type="line" 
            paint={{
              'line-color': '#2d3748', 
              'line-width': 4,
              'line-opacity': 0.7,
              'line-dasharray': [1, 1.5]
            }} 
          />
        </Source>
      </Map>
    </div>
  );
}