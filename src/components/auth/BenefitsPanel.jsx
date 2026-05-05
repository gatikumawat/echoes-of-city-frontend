import React from 'react';

const BenefitsPanel = () => {
  return (
    <div className="lg:col-span-2 bg-primary text-on-primary p-8 md:p-12 lg:rounded-l-lg flex flex-col justify-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-secondary-fixed-dim rounded-full blur-3xl"></div>
      </div>
      <div className="relative z-10 space-y-8">
        <h3 className="font-headline text-3xl italic leading-tight">Become a Guardian of the Past</h3>
        <div className="space-y-6">
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-secondary-fixed">history_edu</span>
            <div>
              <h4 className="font-label text-sm uppercase tracking-widest mb-1 text-secondary-fixed-dim">Share Stories</h4>
              <p className="text-on-primary/70 text-sm leading-relaxed">Contribute to the living history of the city by documenting family lore and neighborhood anecdotes.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-secondary-fixed">route</span>
            <div>
              <h4 className="font-label text-sm uppercase tracking-widest mb-1 text-secondary-fixed-dim">Personalized Trails</h4>
              <p className="text-on-primary/70 text-sm leading-relaxed">Receive custom-tailored exploration paths based on your interests, from colonial architecture to ancient temples.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenefitsPanel;
