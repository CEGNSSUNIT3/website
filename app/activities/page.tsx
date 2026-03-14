'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Activity } from '@/types';
import {
  Heart, MessageCircle, Bookmark, MoreHorizontal,
  Calendar, ImageIcon, X, ChevronLeft, ChevronRight, Search
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

const CYCLING_WORDS = ['SERVE', 'CARE', 'ACT', 'GIVE', 'UNITE', 'LEAD', 'BUILD', 'GROW'];

function TypewriterHero() {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [pause, setPause] = useState(false);

  useEffect(() => {
    if (pause) return;
    const word = CYCLING_WORDS[wordIndex];

    if (!deleting && displayed.length < word.length) {
      const t = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 90);
      return () => clearTimeout(t);
    }
    if (!deleting && displayed.length === word.length) {
      setPause(true);
      const t = setTimeout(() => { setPause(false); setDeleting(true); }, 1400);
      return () => clearTimeout(t);
    }
    if (deleting && displayed.length > 0) {
      const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 50);
      return () => clearTimeout(t);
    }
    if (deleting && displayed.length === 0) {
      setDeleting(false);
      setWordIndex((i) => (i + 1) % CYCLING_WORDS.length);
    }
  }, [displayed, deleting, wordIndex, pause]);

  return (
    <span style={{
      color: '#4ade80',
      fontFamily: 'Georgia, serif',
      letterSpacing: '-0.02em',
      borderRight: '3px solid #4ade80',
      paddingRight: '4px',
      animation: 'blink 0.75s step-end infinite',
      minWidth: '200px',
      display: 'inline-block',
    }}>
      {displayed}
    </span>
  );
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [lightbox, setLightbox] = useState<{ photos: string[]; index: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    async function fetchActivities() {
      const { data, error } = await supabase
        .from('activities')
        .select('*, photos(*)')
        .eq('is_gallery_only', false)
        .order('date', { ascending: false });
      if (!error && data) setActivities(data);
      setLoading(false);
    }
    fetchActivities();
  }, []);

  // Subtle canvas particle bg for hero
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const dots: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
    for (let i = 0; i < 50; i++) {
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.2 + 0.4,
      });
    }
    let raf: number;
    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach((d) => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0) d.x = canvas.width;
        if (d.x > canvas.width) d.x = 0;
        if (d.y < 0) d.y = canvas.height;
        if (d.y > canvas.height) d.y = 0;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(200,230,215,0.25)';
        ctx.fill();
      });
      // connecting lines
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(180,215,200,${0.1 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  function lightboxNav(dir: 'prev' | 'next') {
    if (!lightbox) return;
    const total = lightbox.photos.length;
    const newIndex = dir === 'next'
      ? (lightbox.index + 1) % total
      : (lightbox.index - 1 + total) % total;
    setLightbox({ ...lightbox, index: newIndex });
  }

  return (
    <>
      <style>{`
        @keyframes blink { 0%,100%{border-color:#4ade80} 50%{border-color:transparent} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .hero-fade { animation: fadeUp 0.7s ease both; }
        .hero-fade-2 { animation: fadeUp 0.7s ease 0.2s both; }
        .hero-fade-3 { animation: fadeUp 0.7s ease 0.4s both; }
      `}</style>

      {/* ── Hero ── */}
      <section style={{
        background: 'linear-gradient(145deg, #111 0%, #1c1c1c 35%, #1a2e22 65%, #0e1e30 100%)',
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '5rem',
      }}>
        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.03,
          backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        {/* Canvas */}
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />

        {/* Glow orb */}
        <div style={{
          position: 'absolute', top: '20%', right: '10%',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(45,106,79,0.18) 0%, transparent 70%)',
        }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '1100px', margin: '0 auto', padding: '4rem 2rem', width: '100%' }}>

          {/* Tag */}
          <div className="hero-fade" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            border: '1px solid rgba(255,255,255,0.12)', borderRadius: '2px',
            padding: '5px 14px', marginBottom: '1.75rem',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4ade80', display: 'inline-block' }} />
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', letterSpacing: '0.25em', fontFamily: 'system-ui', textTransform: 'uppercase' }}>
              NSS Unit 3 · Activity Feed
            </span>
          </div>

          {/* Headline with typewriter */}
          <div className="hero-fade-2" style={{ marginBottom: '1.5rem' }}>
            <h1 style={{
              color: '#fff', fontFamily: 'Georgia, serif',
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontWeight: '700', lineHeight: '1.1',
              letterSpacing: '-0.02em', margin: 0,
            }}>
              We{' '}
              <TypewriterHero />
            </h1>
          </div>

          {/* Subtext */}
          <div className="hero-fade-3">
            <p style={{
              color: 'rgba(255,255,255,0.45)', fontFamily: 'system-ui',
              fontSize: '1rem', maxWidth: '480px', lineHeight: '1.7', margin: 0,
            }}>
              Stories from our volunteers — every drive, camp, and cause NSS Unit 3 stood for.
            </p>
          </div>

          {/* Word pills */}
          <div className="hero-fade-3" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '2rem' }}>
            {CYCLING_WORDS.map((w) => (
              <span key={w} style={{
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.2)',
                fontFamily: 'system-ui', fontSize: '0.65rem',
                letterSpacing: '0.2em', padding: '4px 12px',
                borderRadius: '2px',
              }}>{w}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feed ── */}
      <section style={{ backgroundColor: '#e0e0e0', minHeight: '60vh', padding: '3rem 0' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '0 1rem' }}>

          {loading && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '6rem 0' }}>
              <div style={{ width: '36px', height: '36px', border: '3px solid #2d6a4f', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
          )}

          {!loading && activities.length === 0 && (
            <div style={{ textAlign: 'center', padding: '6rem 0', color: '#888' }}>
              <Search size={44} style={{ margin: '0 auto 1rem', opacity: 0.25 }} />
              <p style={{ fontSize: '1.1rem', fontWeight: '600', color: '#666', marginBottom: '0.5rem' }}>No posts yet</p>
              <p style={{ fontSize: '0.875rem', color: '#999' }}>The admin will post updates soon.</p>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {activities.map((activity) => {
              const photos = activity.photos?.map((p) => p.image_url) ?? [];
              const isExpanded = expanded[activity.id];
              const desc = activity.description;
              const shortDesc = desc.length > 120 ? desc.slice(0, 120) + '…' : desc;

              return (
                <article key={activity.id} style={{
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                  border: '1px solid #e8e8e8',
                  overflow: 'hidden',
                  borderTop: '3px solid #2d6a4f',
                }}>
                  {/* Post header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '38px', height: '38px', borderRadius: '50%',
                        background: 'linear-gradient(135deg,#2d6a4f,#1a4a8a)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <span style={{ color: '#fff', fontWeight: '700', fontSize: '0.65rem', fontFamily: 'system-ui' }}>NSS</span>
                      </div>
                      <div>
                        <p style={{ color: '#1a1a1a', fontFamily: 'system-ui', fontWeight: '700', fontSize: '0.875rem', margin: '0 0 2px' }}>
                          NSS Unit 3 · CEG
                        </p>
                        <p style={{ color: '#94a3b8', fontFamily: 'system-ui', fontSize: '0.7rem', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={9} />
                          {format(new Date(activity.date), 'dd MMM yyyy')}
                          <span style={{ margin: '0 2px' }}>·</span>
                          {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}>
                      <MoreHorizontal size={17} />
                    </button>
                  </div>

                  {/* Photos */}
                  {photos.length === 0 && (
                    <div style={{ height: '180px', background: 'linear-gradient(135deg,rgba(45,106,79,0.08),rgba(26,74,138,0.08))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
                      <ImageIcon size={36} />
                    </div>
                  )}
                  {photos.length === 1 && (
                    <div style={{ position: 'relative', height: '340px', backgroundColor: '#f0f0f0', cursor: 'zoom-in' }} onClick={() => setLightbox({ photos, index: 0 })}>
                      <Image src={photos[0]} alt={activity.title} fill style={{ objectFit: 'cover' }} />
                    </div>
                  )}
                  {photos.length === 2 && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', height: '260px', cursor: 'pointer' }}>
                      {photos.map((url, i) => (
                        <div key={i} style={{ position: 'relative', backgroundColor: '#f0f0f0' }} onClick={() => setLightbox({ photos, index: i })}>
                          <Image src={url} alt="" fill style={{ objectFit: 'cover' }} />
                        </div>
                      ))}
                    </div>
                  )}
                  {photos.length === 3 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2px', height: '220px', cursor: 'pointer' }}>
                      {photos.map((url, i) => (
                        <div key={i} style={{ position: 'relative', backgroundColor: '#f0f0f0' }} onClick={() => setLightbox({ photos, index: i })}>
                          <Image src={url} alt="" fill style={{ objectFit: 'cover' }} />
                        </div>
                      ))}
                    </div>
                  )}
                  {photos.length >= 4 && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '2px', height: '260px', cursor: 'pointer' }}>
                      <div style={{ position: 'relative', backgroundColor: '#f0f0f0', gridRow: '1 / 3' }} onClick={() => setLightbox({ photos, index: 0 })}>
                        <Image src={photos[0]} alt="" fill style={{ objectFit: 'cover' }} />
                      </div>
                      <div style={{ position: 'relative', backgroundColor: '#f0f0f0' }} onClick={() => setLightbox({ photos, index: 1 })}>
                        <Image src={photos[1]} alt="" fill style={{ objectFit: 'cover' }} />
                      </div>
                      <div style={{ position: 'relative', backgroundColor: '#f0f0f0' }} onClick={() => setLightbox({ photos, index: 2 })}>
                        <Image src={photos[2]} alt="" fill style={{ objectFit: 'cover' }} />
                        {photos.length > 3 && (
                          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ color: '#fff', fontSize: '1.75rem', fontWeight: '700', fontFamily: 'system-ui' }}>+{photos.length - 3}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px 4px' }}>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center' }}
                        onMouseEnter={e => (e.currentTarget.style.color='#ef4444')}
                        onMouseLeave={e => (e.currentTarget.style.color='#94a3b8')}>
                        <Heart size={20} />
                      </button>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                        onMouseEnter={e => (e.currentTarget.style.color='#1a4a8a')}
                        onMouseLeave={e => (e.currentTarget.style.color='#94a3b8')}>
                        <MessageCircle size={20} />
                      </button>
                    </div>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                      onMouseEnter={e => (e.currentTarget.style.color='#2d6a4f')}
                      onMouseLeave={e => (e.currentTarget.style.color='#94a3b8')}>
                      <Bookmark size={18} />
                    </button>
                  </div>

                  {photos.length > 0 && (
                    <p style={{ padding: '0 16px', color: '#94a3b8', fontFamily: 'system-ui', fontSize: '0.7rem', margin: '0 0 4px' }}>
                      {photos.length} photo{photos.length > 1 ? 's' : ''}
                    </p>
                  )}

                  {/* Caption */}
                  <div style={{ padding: '6px 16px 16px' }}>
                    <p style={{ color: '#1a1a1a', fontFamily: 'system-ui', fontSize: '0.875rem', lineHeight: '1.6', margin: '0 0 8px' }}>
                      <strong>NSS Unit 3 CEG</strong>{' '}
                      <strong>{activity.title} —</strong>{' '}
                      {isExpanded ? desc : shortDesc}
                      {desc.length > 120 && (
                        <button onClick={() => setExpanded(p => ({ ...p, [activity.id]: !isExpanded }))}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '600', marginLeft: '4px' }}>
                          {isExpanded ? 'less' : 'more'}
                        </button>
                      )}
                    </p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {['#NSS', '#CEG', '#AnnauniversityNSS', '#NotMeButYou'].map(tag => (
                        <span key={tag} style={{ color: '#1a4a8a', fontFamily: 'system-ui', fontSize: '0.75rem', fontWeight: '500' }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setLightbox(null)}>
          <button style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}
            onClick={() => setLightbox(null)}><X size={18} /></button>
          <div style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(0,0,0,0.4)', color: 'rgba(255,255,255,0.7)', fontFamily: 'system-ui', fontSize: '0.8rem', padding: '6px 16px', borderRadius: '999px' }}>
            {lightbox.index + 1} / {lightbox.photos.length}
          </div>
          {lightbox.photos.length > 1 && <>
            <button style={{ position: 'absolute', left: '24px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '44px', height: '44px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}
              onClick={e => { e.stopPropagation(); lightboxNav('prev'); }}><ChevronLeft size={22} /></button>
            <button style={{ position: 'absolute', right: '24px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '44px', height: '44px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}
              onClick={e => { e.stopPropagation(); lightboxNav('next'); }}><ChevronRight size={22} /></button>
          </>}
          <div style={{ position: 'relative', width: '100%', maxWidth: '900px', maxHeight: '85vh', margin: '0 80px' }} onClick={e => e.stopPropagation()}>
            <Image src={lightbox.photos[lightbox.index]} alt="Full size" width={1200} height={800}
              style={{ objectFit: 'contain', width: '100%', maxHeight: '85vh', borderRadius: '8px' }} />
          </div>
        </div>
      )}
    </>
  );
}