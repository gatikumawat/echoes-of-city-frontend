import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { calculateDistance } from '../utils/distance';
import Navbar from '../components/Navbar';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const MapPage = () => {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState(null);
  const [sites, setSites] = useState([]);
  const [sortedSites, setSortedSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch sites from backend API
  useEffect(() => {
    const fetchSites = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/sites/`);
        const mapped = res.data.map(site => {
          const [lat, lng] = site.latLng ? site.latLng.split(',').map(Number) : [null, null];
          return {
            id: site.id,
            typeTag: site.typeTag,
            title: site.title.join(' '),
            description: site.subtitle,
            imageSrc: site.heroImage,
            url: `/site/${site.id}`,
            lat,
            lng,
          };
        });
        setSites(mapped);
        setSortedSites(mapped);
      } catch (err) {
        console.error('Failed to fetch map sites:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSites();
  }, []);

  // Sort by distance once we have both sites and user location
  useEffect(() => {
    if (!userLocation || sites.length === 0) return;
    if (navigator.geolocation) {
      const sitesWithDist = sites.map(site => {
        if (site.lat && site.lng) {
          const dist = parseFloat(calculateDistance(userLocation.lat, userLocation.lng, site.lat, site.lng));
          return { ...site, distance: dist };
        }
        return site;
      }).sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
      setSortedSites(sitesWithDist);
    }
  }, [userLocation, sites]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        (err) => {
          console.warn("Geolocation Error:", err);
        }
      );
    }
  }, []);


  return (
    <div className="flex flex-col h-screen w-full bg-surface text-on-surface overflow-hidden">
      <Navbar showLinks={true} />
      
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden relative">
      {/* Sidebar List */}
      <div className="w-full md:w-1/3 lg:w-1/4 h-[40vh] md:h-full bg-surface-container-high overflow-y-auto border-r border-outline/20 relative z-10 flex flex-col shadow-xl">
        <div className="p-6 sticky top-0 bg-surface-container-high/90 backdrop-blur z-20 border-b border-outline/20">
          <h1 className="font-headline text-3xl italic mb-2">Heritage Radar</h1>
          <p className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">
            {userLocation ? "Sorted by distance from you" : "Showing all sites"}
          </p>
        </div>
        
        <div className="p-4 flex flex-col gap-4">
          {isLoading ? (
            <p className="text-center text-on-surface-variant text-sm italic py-8">Loading heritage sites...</p>
          ) : (
            sortedSites.map(site => (
              <div 
                key={site.id} 
                className={`p-4 rounded bg-surface hover:bg-surface-variant transition-colors cursor-pointer border ${selectedSite?.id === site.id ? 'border-primary' : 'border-transparent'} shadow-sm`}
                onClick={() => setSelectedSite(site)}
              >
                <div className="flex gap-4 items-center">
                  <img src={site.imageSrc} alt={site.title} className="w-16 h-16 object-cover rounded-sm" />
                  <div className="flex-1">
                    <h3 className="font-headline text-lg font-bold">{site.title}</h3>
                    <p className="text-[10px] tracking-widest text-on-surface-variant mb-1 uppercase opacity-80">{site.typeTag}</p>
                    {site.distance && (
                      <p className="text-xs font-bold text-primary">{site.distance} km away</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Map Canvas */}
      <div className="flex-1 h-[60vh] md:h-full relative">
        <APIProvider apiKey={API_KEY}>
          <Map
            defaultZoom={12}
            defaultCenter={{ lat: 12.9716, lng: 77.5946 }}
            mapId="DEMO_MAP_ID"
            disableDefaultUI={true}
            className="w-full h-full"
          >
            {sites.filter(s => s.lat && s.lng).map(site => (
              <AdvancedMarker
                key={site.id}
                position={{ lat: site.lat, lng: site.lng }}
                onClick={() => setSelectedSite(site)}
              >
                <Pin background={'#4a3f35'} borderColor={'#eeeae2'} glyphColor={'#eeeae2'} />
              </AdvancedMarker>
            ))}

            {userLocation && (
              <AdvancedMarker position={userLocation} zIndex={50}>
                <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow-[0_0_15px_rgba(220,38,38,0.8)] animate-pulse"></div>
              </AdvancedMarker>
            )}

            {selectedSite && (
              <InfoWindow
                position={{ lat: selectedSite.lat, lng: selectedSite.lng }}
                onCloseClick={() => setSelectedSite(null)}
                pixelOffset={[0, -30]}
              >
                <div className="p-2 max-w-[200px] text-[#111111] font-body bg-surface">
                  <img src={selectedSite.imageSrc} alt={selectedSite.title} className="w-full h-24 object-cover rounded mb-3" />
                  <h3 className="font-headline font-bold text-lg leading-tight mb-1">{selectedSite.title}</h3>
                  <p className="text-xs mb-3 text-[#111111]/70 line-clamp-2">{selectedSite.description}</p>
                  {selectedSite.url && (
                    <button 
                      onClick={() => navigate(selectedSite.url)}
                      className="w-full bg-[#4a3f35] text-[#eeeae2] text-[10px] uppercase tracking-widest py-2 rounded shadow hover:bg-black transition-colors"
                    >
                      Explore Now
                    </button>
                  )}
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
      </div>
      </div>
    </div>
  );
};

export default MapPage;
