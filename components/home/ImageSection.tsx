'use client';

import Image from 'next/image';

interface ImageSectionProps {
  imageUrl?: string;
  logoText?: string;
}

export function ImageSection({
  imageUrl = '/Elemental MISO.png',
  logoText = 'miso labs',
}: ImageSectionProps) {
  return (
    <section className="relative w-full lg:w-1/2 h-[50vh] lg:h-full rounded-4xl overflow-hidden group">
      {/* Background Image */}
      <Image
        alt="MISO Elemental composition"
        src={imageUrl}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        priority
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20" />

      {/* Logo */}
      <div className="absolute top-8 left-8">
        <span className="text-white font-heading font-bold text-3xl tracking-tight block drop-shadow-md">
          {logoText}
        </span>
      </div>
    </section>
  );
}
