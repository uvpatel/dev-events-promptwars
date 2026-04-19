import { useState, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Polygon } from '@react-google-maps/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useEvent } from '../context/EventContext';
import { DARK_MAP_STYLE, VENUE_CENTER, MARKER_ICONS, DENSITY_COLORS } from '../utils/helpers';
import { X, Navigation, Users, Search } from 'lucide-react';

const containerStyle = {
  width: '100%',
  height: '100%',
};

export default function VenueMap() {
  const { event, booths, crowdData, loading: eventLoading } = useEvent();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const mapRef = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyA...', // Add fallback or handle demo
  });

  const onLoad = useCallback(function callback(map) {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(function callback() {
    mapRef.current = null;
  }, []);

  if (loadError) {
    return <div className="page-container flex items-center justify-center text-red-400">Error loading map: {loadError.message}</div>;
  }

  // Demo mode handling if no valid API key
  const isDemoNoKey = !import.meta.env.VITE_GOOGLE_MAPS_API_KEY || import.meta.env.VITE_GOOGLE_MAPS_API_KEY === 'your-google-maps-api-key';

  const filteredBooths = booths.filter((b) => {
    const matchesTab = activeTab === 'all' || activeTab === b.type;
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (b.description && b.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  // Calculate polygon coordinates for crowd zones (approximate circle)
  const renderCrowdZones = () => {
    return crowdData.map((zone) => {
      // Create a simple polygon (circle approximation)
      const points = 20;
      const radiusInDeg = (zone.coordinates.radius || 50) / 111000; // rough convert meters to degrees
      const paths = [];
      for (let i = 0; i < points; i++) {
        const theta = (i / points) * (2 * Math.PI);
        const lat = zone.coordinates.lat + radiusInDeg * Math.cos(theta);
        const lng = zone.coordinates.lng + radiusInDeg * Math.sin(theta) / Math.cos(zone.coordinates.lat * Math.PI / 180);
        paths.push({ lat, lng });
      }

      const colors = DENSITY_COLORS[zone.density || 'low'];

      return (
        <Polygon
          key={`zone-${zone.id}`}
          paths={paths}
          options={{
            fillColor: colors.border,
            fillOpacity: 0.25,
            strokeColor: colors.border,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            clickable: false
          }}
        />
      );
    });
  };

  return (
    <div className="relative h-screen w-full pt-16 overflow-hidden bg-dark-950">
      
      {/* Map Control Sidebar Overlay */}
      <div className="absolute top-20 left-4 z-10 w-80 glass-card flex flex-col max-h-[calc(100vh-6rem)]">
        <div className="p-4 border-b border-white/[0.06]">
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2 mb-4">
            <Navigation className="w-5 h-5 text-primary-400" />
            Venue Map
          </h2>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-dark-500" />
            <input 
              type="text" 
              placeholder="Search locations..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-dark-900 border border-white/[0.1] rounded-lg pl-9 pr-4 py-2 text-sm text-dark-100 placeholder-dark-500 outline-none focus:border-primary-500/50 transition-colors"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {['all', 'stage', 'booth', 'food_stall'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-1.5 px-3 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab ? 'bg-primary-500 text-white' : 'bg-white/[0.05] text-dark-300 hover:bg-white/[0.1]'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {eventLoading ? (
            <div className="p-4 text-center text-dark-400 text-sm">Loading locations...</div>
          ) : (
            <div className="space-y-1">
              {filteredBooths.map(location => (
                <button
                  key={location.id}
                  onClick={() => {
                    setSelectedLocation(location);
                    mapRef.current?.panTo(location.location);
                    mapRef.current?.setZoom(18);
                  }}
                  className="w-full text-left px-3 py-3 rounded-xl hover:bg-white/[0.05] transition-colors flex gap-3 items-start group"
                >
                  <div className="text-xl">{MARKER_ICONS[location.type]?.emoji || '📍'}</div>
                  <div>
                    <h3 className="text-sm font-medium text-dark-100 group-hover:text-primary-300 transition-colors">{location.name}</h3>
                    <p className="text-xs text-dark-500 mt-0.5 line-clamp-1">{MARKER_ICONS[location.type]?.label || 'Location'}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Map Area */}
      <div className="w-full h-full relative">
        {isDemoNoKey && (
           <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none p-4">
              <div className="glass-card px-6 py-4 max-w-sm text-center border-yellow-500/30 bg-yellow-500/10">
                <p className="text-yellow-400 text-sm mb-2 font-medium">Demo Mode Warning</p>
                <p className="text-dark-300 text-xs">A valid Google Maps API Key was not provided. The map will load in development mode with a watermark.</p>
              </div>
           </div>
        )}
        
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={event?.venue ? { lat: event.venue.lat, lng: event.venue.lng } : VENUE_CENTER}
            zoom={17}
            options={{
              styles: DARK_MAP_STYLE,
              disableDefaultUI: true,
              zoomControl: true,
              mapTypeControl: false,
              streetViewControl: false,
            }}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            {/* Render Crowd Zones */}
            {renderCrowdZones()}

            {/* Render Markers */}
            {filteredBooths.map((location) => {
              const iconCfg = MARKER_ICONS[location.type] || { emoji: '📍', color: '#fff' };
              
              return (
                <Marker
                  key={location.id}
                  position={location.location}
                  onClick={() => setSelectedLocation(location)}
                  label={{
                    text: iconCfg.emoji,
                    fontSize: '18px',
                  }}
                  icon={{
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 0, // hide default dot
                  }}
                />
              );
            })}

            {/* Info Window */}
            {selectedLocation && (
              <InfoWindow
                position={selectedLocation.location}
                onCloseClick={() => setSelectedLocation(null)}
                options={{
                  pixelOffset: new window.google.maps.Size(0, -20),
                  disableAutoPan: false,
                }}
              >
                <div className="p-1 max-w-[200px]" style={{ color: '#0f172a' }}>
                  <h3 className="font-bold text-sm mb-1">{selectedLocation.name}</h3>
                  <p className="text-xs text-gray-600 mb-2">{selectedLocation.description}</p>
                  
                  {selectedLocation.nearbyDensity && (
                    <div className="flex items-center gap-1 mt-2 text-xs font-semibold bg-gray-100 rounded px-2 py-1 inline-flex">
                      <Users className="w-3 h-3" />
                      <span>Density: {selectedLocation.nearbyDensityPercentage}%</span>
                    </div>
                  )}
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-dark-900">
             <div className="w-10 h-10 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Legend Overlay */}
      <div className="absolute bottom-6 left-4 md:left-auto md:right-6 z-10 glass-card p-3 flex gap-4 text-xs font-medium">
         <div className="flex items-center gap-1.5">
           <div className="w-3 h-3 rounded-full bg-green-500 border border-white/20 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
           <span className="text-dark-200">Low</span>
         </div>
         <div className="flex items-center gap-1.5">
           <div className="w-3 h-3 rounded-full bg-yellow-500 border border-white/20 shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
           <span className="text-dark-200">Med</span>
         </div>
         <div className="flex items-center gap-1.5">
           <div className="w-3 h-3 rounded-full bg-red-500 border border-white/20 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
           <span className="text-dark-200">High</span>
         </div>
      </div>
    </div>
  );
}
