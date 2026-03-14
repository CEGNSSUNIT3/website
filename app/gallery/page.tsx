'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { supabase } from '@/lib/supabase';
import { Activity } from '@/types';
import { Images, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function GalleryPage() {
  const [events, setEvents] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<{ url: string; index: number; photos: string[] } | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase
        .from('activities')
        .select('*, photos(*)')
        .eq('is_gallery_only', true)
        .order('title', { ascending: true });

      if (!error && data) {
        setEvents(data.filter((e: Activity) => e.photos && e.photos!.length > 0));
      }

      setLoading(false);
    }

    fetchEvents();
  }, []);

  function openLightbox(photos: string[], index: number) {
    setLightbox({ url: photos[index], index, photos });
  }

  function lightboxNav(dir: 'prev' | 'next') {
    if (!lightbox) return;

    const total = lightbox.photos.length;

    const newIndex =
      dir === 'next'
        ? (lightbox.index + 1) % total
        : (lightbox.index - 1 + total) % total;

    setLightbox({
      ...lightbox,
      index: newIndex,
      url: lightbox.photos[newIndex]
    });
  }

  return (
    <>
      <style>{`

      @keyframes floatLight {
        0% { transform: translate(0px,0px); }
        50% { transform: translate(60px,-40px); }
        100% { transform: translate(0px,0px); }
      }

      @keyframes moveDots{
        from{ transform: translateY(0); }
        to{ transform: translateY(-200px); }
      }

      .hero-light{
        position:absolute;
        width:420px;
        height:420px;
        filter:blur(100px);
        animation: floatLight 20s ease-in-out infinite;
      }

      .light1{
        top:-120px;
        left:-120px;
        background:radial-gradient(circle, rgba(74,222,128,0.25) 0%, transparent 70%);
      }

      .light2{
        bottom:-120px;
        right:-120px;
        background:radial-gradient(circle, rgba(45,106,79,0.25) 0%, transparent 70%);
      }

      .dots{
        width:100%;
        height:100%;
        background-image: radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px);
        background-size: 60px 60px;
        animation: moveDots 60s linear infinite;
      }

      `}</style>

      {/* Header */}
      <section
        className="relative overflow-hidden py-24 pt-32 text-white"
        style={{
          background:
            "linear-gradient(135deg, #0b1220 0%, #0f2f26 45%, #0a1f3a 100%)"
        }}
      >

        {/* Moving dots */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="dots"></div>
        </div>

        {/* Floating lights */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="hero-light light1"></div>
          <div className="hero-light light2"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">

          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-5">
            <Images size={15} />
            <span className="text-sm font-medium">Photo Gallery</span>
          </div>

          <h1 className="font-display text-5xl font-bold mb-4">
            Our Memories
          </h1>

          <p className="text-green-100 text-lg max-w-xl mx-auto">
            Relive every event — each with its own photo collection, exactly as it happened.
          </p>

        </div>
      </section>

      {/* Events */}
      <section className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {loading && (
            <div className="flex justify-center py-32">
              <div className="w-10 h-10 border-4 border-nss-green border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && events.length === 0 && (
            <div className="text-center py-32 text-gray-400">
              <Images size={52} className="mx-auto mb-4 opacity-30" />
              <p className="text-xl font-display font-semibold text-gray-500">No photos yet</p>
              <p className="text-sm mt-1">Upload photos via the Admin Dashboard to see them here.</p>
            </div>
          )}

          <div className="space-y-16">
            {events.map((event, eventIdx) => {
              const photoUrls = event.photos!.map((p) => p.image_url);

              return (
                <div key={event.id}>

                  <div className="flex items-center justify-between gap-4 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-8 rounded-full bg-gradient-to-b from-nss-green to-nss-blue shrink-0" />
                      <h2 className="font-display text-2xl font-bold text-gray-800 tracking-wide">
                        {event.title}
                      </h2>
                    </div>

                    <div className="flex-1 h-px bg-gradient-to-r from-nss-green/20 to-transparent" />
                  </div>

                  <div className="relative rounded-2xl overflow-visible">
                    <Swiper
                      modules={[Navigation, Pagination, Autoplay]}
                      spaceBetween={12}
                      slidesPerView={1}
                      breakpoints={{
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                      }}
                      navigation={{
                        nextEl: `#next-${event.id}`,
                        prevEl: `#prev-${event.id}`,
                      }}
                      pagination={{ clickable: true, dynamicBullets: true }}
                      autoplay={{ delay: 4000 + eventIdx * 400, disableOnInteraction: false }}
                      className="!pb-10"
                    >
                      {photoUrls.map((url, photoIdx) => (
                        <SwiperSlide key={photoIdx}>
                          <div
                            className="relative h-64 sm:h-72 rounded-xl overflow-hidden cursor-zoom-in bg-gray-200"
                            onClick={() => openLightbox(photoUrls, photoIdx)}
                          >
                            <Image
                              src={url}
                              alt={`${event.title} photo ${photoIdx + 1}`}
                              fill
                              className="object-cover hover:scale-105 transition-transform duration-500"
                            />

                            <div className="absolute inset-0 bg-black/0 hover:bg-black/15 transition-colors duration-200 flex items-center justify-center">
                              <span className="opacity-0 hover:opacity-100 text-white text-xs font-medium bg-black/50 px-3 py-1 rounded-full transition-opacity">
                                Click to expand
                              </span>
                            </div>

                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>

                    <button
                      id={`prev-${event.id}`}
                      className="absolute -left-4 top-[45%] z-10 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center text-nss-green hover:bg-nss-green hover:text-white transition-all border border-gray-100"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    <button
                      id={`next-${event.id}`}
                      className="absolute -right-4 top-[45%] z-10 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center text-nss-green hover:bg-nss-green hover:text-white transition-all border border-gray-100"
                    >
                      <ChevronRight size={18} />
                    </button>

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >

          <button
            className="absolute top-5 right-5 text-white bg-white/10 hover:bg-white/25 rounded-full p-2.5 z-10 transition-colors"
            onClick={() => setLightbox(null)}
          >
            <X size={20} />
          </button>

          <button
            className="absolute left-4 sm:left-8 text-white bg-white/10 hover:bg-white/25 rounded-full p-3 transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); lightboxNav('prev'); }}
          >
            <ChevronLeft size={24} />
          </button>

          <div className="relative w-full max-w-4xl max-h-[85vh] mx-20" onClick={(e) => e.stopPropagation()}>
            <Image
              src={lightbox.url}
              alt="Full size"
              width={1200}
              height={800}
              className="object-contain w-full max-h-[85vh] rounded-lg"
            />
          </div>

          <button
            className="absolute right-4 sm:right-8 text-white bg-white/10 hover:bg-white/25 rounded-full p-3 transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); lightboxNav('next'); }}
          >
            <ChevronRight size={24} />
          </button>

        </div>
      )}

    </>
  );
}