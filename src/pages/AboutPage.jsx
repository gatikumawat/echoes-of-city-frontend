import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AboutPage = () => {
  return (
    <div className="bg-[#fbf9f6] min-h-screen text-stone-900 font-sans flex flex-col">
      <Navbar showLinks={true} />

      <main className="flex-1 max-w-3xl mx-auto px-8 py-24 md:py-32">

        {/* Label */}
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#4A0404]/50 mb-6">
          About the Project
        </p>

        {/* Page Title */}
        <h1 className="font-headline italic text-5xl md:text-7xl text-[#210000] font-bold leading-tight mb-16">
          Echoes of<br />the City
        </h1>

        {/* Divider */}
        <div className="w-16 h-px bg-[#4A0404]/30 mb-12" />

        {/* About the website */}
        <div className="mb-16">
          <h2 className="font-serif font-bold text-[#210000] text-xl mb-5">What is this?</h2>
          <p className="text-stone-500 font-light leading-relaxed text-lg mb-4">
            Echoes of the City is a digital heritage archive dedicated to preserving and showcasing the rich historical legacy of Bangalore's landmarks. From centuries-old temples and royal palaces to civic monuments and green sanctuaries, we bring the city's stories to life.
          </p>
          <p className="text-stone-500 font-light leading-relaxed text-lg">
            Using live geolocation, interactive maps, historical galleries, and real-time visitor insights, the platform connects citizens and history enthusiasts to the architectural heritage that surrounds them every day.
          </p>
        </div>

        {/* Divider */}
        <div className="w-16 h-px bg-[#4A0404]/30 mb-12" />

        {/* About the team */}
        <div className="mb-16">
          <h2 className="font-serif font-bold text-[#210000] text-xl mb-5">Who made this?</h2>
          <p className="text-stone-500 font-light leading-relaxed text-lg mb-4">
            Hi! We are <span className="text-[#210000] font-medium">Vanshika Sultania</span> and <span className="text-[#210000] font-medium">Gati Kumawat</span>, first-year students at <span className="text-[#210000] font-medium">Polaris School of Technology</span>.
          </p>
          <p className="text-stone-500 font-light leading-relaxed text-lg">
            Echoes of the City was built as our OJT (On-the-Job Training) semester project. It was a hands-on opportunity for us to apply what we've learned — React, Django, APIs, and modern web design — into something meaningful that celebrates the city we live in.
          </p>
        </div>

        {/* Divider */}
        <div className="w-16 h-px bg-[#4A0404]/30 mb-12" />

        {/* Built with */}
        <div>
          <h2 className="font-serif font-bold text-[#210000] text-xl mb-5">How is it built?</h2>
          <p className="text-stone-500 font-light leading-relaxed text-lg mb-6">
            The frontend is built with React and Vite, styled with Tailwind CSS, and deployed on Vercel. The backend runs on Django REST Framework, hosted on Render. We've integrated the Google Maps Platform for live geolocation, interactive maps, and distance calculations.
          </p>
          <div className="flex flex-wrap gap-3">
            {["React", "Django", "Vite", "Tailwind CSS", "Google Maps API", "Vercel", "Render"].map(tech => (
              <span
                key={tech}
                className="text-[10px] font-bold uppercase tracking-widest border border-[#4A0404]/20 text-[#4A0404]/70 px-4 py-2"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
