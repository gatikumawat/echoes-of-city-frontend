import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

const MapSection = () => {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation(loc);
        },
        (err) => {
          console.warn("Geolocation Error:", err);
        }
      );
    }
  }, []);

  return (
    <section className="py-24 bg-gradient-to-br from-amber-50 via-orange-50/80 to-yellow-100/50 overflow-hidden" id="map">
      <div className="max-w-screen-2xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-5">
          <h2 className="font-headline text-4xl md:text-6xl text-primary font-bold mb-8">The Navigator's Map</h2>
          <p className="text-on-surface-variant text-lg leading-relaxed mb-8">Trace the historical ley lines of the city. Our interactive cartography reveals the architectural evolution from the 16th century to the present day.</p>
          <ul className="space-y-6">
            <li className="flex items-center gap-4">
              <span className="material-symbols-outlined text-secondary">explore</span>
              <span className="font-medium">124 Documented Heritage Sites</span>
            </li>
            <li className="flex items-center gap-4">
              <span className="material-symbols-outlined text-secondary">history_edu</span>
              <span className="font-medium">15 Historical Map Layers</span>
            </li>
          </ul>
        </div>
        <div
          className="lg:col-span-7 relative h-[500px] rounded-lg overflow-hidden shadow-2xl group cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Black & White filter on Map Container */}
          <div className="w-full h-full grayscale relative pointer-events-none">
            {API_KEY ? (
              <APIProvider apiKey={API_KEY}>
                <Map
                  defaultZoom={userLocation ? 13 : 11}
                  center={userLocation || { lat: 12.9716, lng: 77.5946 }}
                  mapId="DEMO_MAP_ID"
                  disableDefaultUI={true}
                  className="w-full h-full absolute inset-0"
                >
                  {userLocation && (
                    <AdvancedMarker position={userLocation} zIndex={50}>
                      <div className="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-[0_0_15px_rgba(74,63,53,0.8)] animate-pulse"></div>
                    </AdvancedMarker>
                  )}
                </Map>
              </APIProvider>
            ) : (
              <div className="w-full h-full bg-surface-variant flex items-center justify-center text-on-surface-variant font-bold">
                Map Unavailable (API Key Missing)
              </div>
            )}
          </div>

          {/* Original Decorative Overlay Elements */}
          <div className={`absolute inset-0 bg-secondary/10 pointer-events-none transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}></div>

          <div className={`absolute top-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-lg shadow-xl max-w-[240px] pointer-events-none transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
            <p className="font-label text-xs uppercase tracking-widest text-secondary font-bold mb-2">Location status</p>
            <p className="font-headline text-xl text-primary font-bold">
              {userLocation ? "Tracking active" : "Scanning coordinates..."}
            </p>
            <div className="mt-4 h-1 w-full bg-secondary-container rounded-full overflow-hidden">
              <div className={`h-full bg-secondary ${userLocation ? 'w-full' : 'w-1/3 animate-pulse'}`}></div>
            </div>
          </div>

          {/* Hover Overlay for Sign Up */}
          <div
            className={`absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center transition-all duration-300 ease-in-out ${isHovered ? 'opacity-100 pointer-events-none' : 'opacity-0 pointer-events-none'}`}
          >
            <h3 className="text-white font-headline text-4xl mb-6 transform transition-transform duration-500 font-bold tracking-wide drop-shadow-lg">Unlock the Full Map</h3>
            <p className="text-white/90 text-lg mb-8 max-w-sm text-center px-4 font-body leading-relaxed drop-shadow-md">Sign up to explore all detailed layers and access exclusive content.</p>
            <button
              onClick={(e) => { e.stopPropagation(); navigate('/signup'); }}
              className={`bg-primary hover:bg-secondary text-surface hover:text-on-secondary px-10 py-4 rounded-full font-label tracking-widest uppercase transition-all duration-300 transform shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] border-2 border-transparent hover:border-surface/20 ${isHovered ? 'pointer-events-auto scale-100 hover:scale-105' : 'scale-90 pointer-events-none'}`}
            >
              Sign Up Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
