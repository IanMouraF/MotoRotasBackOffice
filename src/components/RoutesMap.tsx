import React, { useMemo } from 'react';
import Map, { Marker, Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Coloque o seu token gerado no site do Mapbox aqui
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

// As coordenadas exatas do seu restaurante
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
  routes: RouteProps[];
}

export default function RoutesMap({ routes }: RoutesMapProps) {
  // Criar linhas (GeoJSON) conectando o restaurante aos pedidos para dar o efeito de "Rota"
  const routeLines = useMemo(() => {
    const features = routes.flatMap((route) => 
      route.orders.map((order) => ({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [RESTAURANT_COORDS.lon, RESTAURANT_COORDS.lat],
            [order.coords.lon, order.coords.lat]
          ]
        }
      }))
    );

    return {
      type: 'FeatureCollection',
      features
    };
  }, [routes]);

  return (
    <div style={{ height: '400px', width: '100%', borderRadius: '15px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <Map
        initialViewState={{
          longitude: RESTAURANT_COORDS.lon,
          latitude: RESTAURANT_COORDS.lat,
          zoom: 13 // Zoom focado na região
        }}
        mapStyle="mapbox://styles/mapbox/streets-v12" // Estilo claro e moderno
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        {/* MARCADOR DO RESTAURANTE */}
        <Marker longitude={RESTAURANT_COORDS.lon} latitude={RESTAURANT_COORDS.lat} anchor="bottom">
          <div style={{ fontSize: '30px', filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.3))' }}>
            🏪
          </div>
        </Marker>

        {/* MARCADORES DOS PEDIDOS */}
        {routes.map(route => 
          route.orders.map((order, index) => (
            <Marker key={order.id} longitude={order.coords.lon} latitude={order.coords.lat} anchor="bottom">
              <div style={{ 
                background: '#ff4b4b', 
                color: 'white', 
                width: '24px', 
                height: '24px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                borderRadius: '50%', 
                fontWeight: 'bold', 
                fontSize: '12px',
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}>
                {index + 1}
              </div>
            </Marker>
          ))
        )}

        {/* LINHAS CONECTANDO O RESTAURANTE AOS PEDIDOS */}
        <Source id="route-lines" type="geojson" data={routeLines as any}>
          <Layer 
            id="lines" 
            type="line" 
            paint={{
              'line-color': '#ff4b4b',
              'line-width': 3,
              'line-opacity': 0.6,
              'line-dasharray': [2, 2] // Efeito de linha tracejada
            }} 
          />
        </Source>
      </Map>
    </div>
  );
}