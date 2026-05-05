import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { calculateDistance } from '../../utils/distance';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const NearbyPlaces = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [allNearbyPlaces, setAllNearbyPlaces] = useState([]);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [radius, setRadius] = useState(15000); // Default to 15km
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
    { id: 'ALL', label: 'All Places', icon: 'explore' },
    { id: 'CAFE', label: 'Cafes', icon: 'local_cafe' },
    { id: 'TOURIST_ATTRACTION', label: 'Attractions', icon: 'attractions' },
    { id: 'MUSEUM', label: 'Museums', icon: 'account_balance' },
    { id: 'PARK', label: 'Parks', icon: 'park' },
    { id: 'SHOPPING_MALL', label: 'Shopping', icon: 'shopping_bag' },
    { id: 'HINDU_TEMPLE', label: 'Temples', icon: 'temple_hindu' },
  ];

  const radiusOptions = [
    { label: '5 KM', value: 5000 },
    { label: '10 KM', value: 10000 },
    { label: '15 KM', value: 15000 },
    { label: '25 KM', value: 25000 },
  ];

  useEffect(() => {
    const getInitialLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          (err) => {
            console.error("Geolocation Error:", err);
            let msg = "Location access denied.";
            if (err.code === 1) msg = "Please enable location permissions in your browser.";
            else if (err.code === 2) msg = "Position unavailable.";
            else if (err.code === 3) msg = "Location request timed out.";
            setError(msg);
          },
          { timeout: 10000 }
        );
      } else {
        setError("Geolocation is not supported by your browser.");
      }
    };

    getInitialLocation();
  }, []);

  const fetchNearby = async () => {
    if (!userLocation) return;
    if (!API_KEY) {
      setError("Google Maps API key is missing. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const { lat, lng } = userLocation;
    const locationStr = `${lat},${lng}`;
    const types = ['tourist_attraction', 'museum', 'park', 'shopping_mall', 'cafe', 'hindu_temple'];

    try {
      const promises = types.map(type =>
        axios.get(`/google-maps-api/maps/api/place/nearbysearch/json?location=${locationStr}&radius=${radius}&type=${type}&key=${API_KEY}`)
          .then(res => {
            if (res.data.status === "REQUEST_DENIED") {
              throw new Error(res.data.error_message || "API Request Denied");
            }
            if (res.data.status === "OVER_QUERY_LIMIT") {
              throw new Error("Google Maps API quota exceeded.");
            }
            return res.data.status === "OK" ? res.data.results : [];
          })
          .catch(err => {
            console.warn(`Error fetching ${type}:`, err.message);
            return [];
          })
      );

      const resultsArray = await Promise.all(promises);
      const allResults = resultsArray.flat();
      const uniquePlaces = [];
      const seenIds = new Set();

      for (const place of allResults) {
        if (!seenIds.has(place.place_id)) {
          seenIds.add(place.place_id);
          uniquePlaces.push({
            id: place.place_id,
            name: place.name,
            rating: place.rating,
            vicinity: place.vicinity,
            photoReference: place.photos?.[0]?.photo_reference,
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
            distance: parseFloat(calculateDistance(lat, lng, place.geometry.location.lat, place.geometry.location.lng)),
            type: place.types?.[0]?.toUpperCase() || 'LANDMARK',
            originalTypes: place.types || []
          });
        }
      }

      const sorted = uniquePlaces.sort((a, b) => a.distance - b.distance);
      setAllNearbyPlaces(sorted);
      if (sorted.length === 0) {
        setError(`No interesting landmarks found within ${radius / 1000}km of your location.`);
      }
    } catch (err) {
      console.error("Failed to fetch nearby places:", err);
      setError(err.message || "Failed to load nearby recommendations.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNearby();
  }, [userLocation, radius]);

  const handleRetry = () => {
    if (!userLocation) {
      window.location.reload();
    } else {
      fetchNearby();
    }
  };

  const filteredPlaces = allNearbyPlaces.filter(place => {
    if (activeCategory === 'ALL') return true;
    return (place.originalTypes || []).some(t => t.toUpperCase() === activeCategory);
  }).slice(0, 12);

  if (!userLocation && !isLoading && !error) return null;

  return (
    <section className="max-w-screen-2xl mx-auto px-8 py-32 border-t border-outline-variant/30">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
        <div className="max-w-3xl">
          <p className="text-[10px] tracking-[0.3em] uppercase text-secondary font-bold mb-4">Local Context</p>
          <h2 className="font-headline italic text-5xl md:text-6xl text-primary mb-6">Discover Your Surroundings</h2>
          <p className="text-on-surface-variant font-body font-light text-lg leading-relaxed max-w-2xl">
            Uncover hidden gems, local landmarks, and vibrant spots right in your vicinity.
            Adjust the range and select a category below to filter your local adventure.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Radius Selector */}
          <div className="flex bg-surface-container-low border border-outline-variant/30 rounded-full p-1 shadow-sm">
            {radiusOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setRadius(opt.value)}
                className={`px-4 py-2 text-[9px] font-bold tracking-widest rounded-full transition-all ${radius === opt.value
                    ? 'bg-primary text-on-primary shadow-md'
                    : 'text-on-surface-variant hover:bg-surface-container'
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col items-end gap-2">
            {userLocation && (
              <div className="flex items-center gap-3 px-5 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-full text-[10px] font-bold tracking-[0.2em] text-on-surface-variant uppercase shadow-sm whitespace-nowrap">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Location Active
              </div>
            )}
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary hover:text-secondary transition-colors"
            >
              <span className="material-symbols-outlined text-sm">refresh</span>
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-4 mb-12 border-b border-outline-variant/20 pb-8">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-6 py-3 text-[10px] font-bold uppercase tracking-widest transition-all rounded-sm border ${activeCategory === cat.id
                ? 'bg-primary text-on-primary border-primary shadow-lg scale-105'
                : 'bg-surface hover:bg-surface-container border-outline-variant/30 text-on-surface-variant'
              }`}
          >
            <span className="material-symbols-outlined text-sm">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="animate-pulse bg-surface-container h-96 rounded-sm"></div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-surface-container-lowest border border-outline-variant p-16 text-center rounded-sm flex flex-col items-center gap-6">
          <p className="text-on-surface-variant font-headline italic text-2xl max-w-lg">{error}</p>
          <button
            onClick={handleRetry}
            className="bg-primary text-on-primary px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-primary/90 transition-all"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {filteredPlaces.map(place => (
            <div key={place.id} className="group flex flex-col bg-surface-container-lowest border border-outline-variant/30 hover:border-outline-variant transition-all duration-700 shadow-sm hover:shadow-2xl">
              <div className="relative h-64 overflow-hidden">
                {place.photoReference ? (
                  <img
                    src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photoReference}&key=${API_KEY}`}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                  />
                ) : (
                  <div className="w-full h-full bg-surface-variant/20 flex items-center justify-center">
                    <span className="text-on-surface-variant/40 font-headline italic text-lg uppercase tracking-widest">No Preview</span>
                  </div>
                )}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                <div className="absolute top-4 left-4 bg-primary text-on-primary text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 shadow-lg">
                  {(place.type || 'LANDMARK').replace(/_/g, ' ')}
                </div>
                <div className="absolute top-4 right-4 bg-surface/90 backdrop-blur-md text-primary text-[10px] font-bold px-3 py-1.5 shadow-lg border border-white/20">
                  {place.distance} km away
                </div>
              </div>

              <div className="p-8 flex flex-col flex-1 relative">
                <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent"></div>

                <h3 className="font-headline italic text-2xl text-on-surface mb-3 line-clamp-1 group-hover:text-primary transition-colors duration-500">{place.name}</h3>
                <p className="text-on-surface-variant text-xs font-body font-light leading-relaxed mb-6 line-clamp-2">{place.vicinity}</p>

                <div className="mt-auto flex items-center justify-between pt-6 border-t border-outline-variant/20">
                  {place.rating ? (
                    <div className="flex items-center gap-1.5">
                      <div className="flex text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-[12px] ${i < Math.floor(place.rating) ? 'fill-current' : 'opacity-30'}`}>★</span>
                        ))}
                      </div>
                      <span className="text-[10px] font-bold tracking-widest text-on-surface-variant">{place.rating}</span>
                    </div>
                  ) : (
                    <span className="text-[10px] font-bold tracking-widest text-on-surface-variant/40 uppercase">Unrated</span>
                  )}

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}&query_place_id=${place.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary hover:tracking-[0.3em] transition-all duration-300 inline-flex items-center gap-2 group/link"
                  >
                    Explore <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && !error && filteredPlaces.length === 0 && (
        <div className="text-center py-20 bg-surface-container-low border border-dashed border-outline-variant rounded-sm">
          <p className="text-on-surface-variant font-headline italic text-xl">No immediate landmarks detected for this category within {radius / 1000}km.</p>
        </div>
      )}
    </section>
  );
};

export default NearbyPlaces;
