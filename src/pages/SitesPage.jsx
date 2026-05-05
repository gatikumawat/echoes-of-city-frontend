import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CollectionHero from '../components/sites/CollectionHero';
import SiteGrid from '../components/sites/SiteGrid';
import NearbyPlaces from '../components/sites/NearbyPlaces';

const SitesPage = () => {
  return (
    <div className="bg-[#fbf9f6] min-h-screen text-stone-900 font-sans flex flex-col">
      <Navbar showLinks={true} />
      <main className="flex-1">
        <CollectionHero />
        <SiteGrid />
        <NearbyPlaces />
      </main>
      <Footer />
    </div>
  );
};

export default SitesPage;
