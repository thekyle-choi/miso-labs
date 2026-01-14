'use client';

import { Navigation, HeroSection, ImageSection } from '@/components/home';

export default function HomePage() {
  return (
    <div className="bg-white text-gray-900 font-sans selection:bg-gray-200 h-screen overflow-hidden flex flex-col">
      <main className="flex-grow w-full h-full p-4 lg:p-6 flex flex-col lg:flex-row gap-6 overflow-hidden">
        {/* Left Section - Hero Image */}
        <ImageSection />

        {/* Right Section - Content */}
        <section className="w-full lg:w-1/2 flex flex-col h-full overflow-y-auto hide-scrollbar">
          {/* Navigation Header */}
          <Navigation />

          {/* Hero Content */}
          <HeroSection />

          {/* Footer spacer */}
          <footer className="lg:px-8 pb-4 pt-12 mt-auto" />
        </section>
      </main>
    </div>
  );
}
