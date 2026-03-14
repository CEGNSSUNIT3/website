'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { ArrowRight, ArrowUpRight, ChevronDown } from 'lucide-react';

export default function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    let raf: number;
    let t = 0;

    // NSS wheel spokes — 8 spokes like the NSS emblem
    const SPOKES = 8;

    // Ripple rings that pulse outward from center — "ripples of service"
    const rings: { r: number; alpha: number; speed: number }[] = [];
    for (let i = 0; i < 6; i++) {
      rings.push({ r: i * 140, alpha: 0.06 - i * 0.008, speed: 0.4 + i * 0.1 });
    }

    // Rising service words
    const words = ['SERVE', 'CARE', 'GROW', 'UNITE', 'LEAD', 'GIVE', 'BUILD', 'HOPE'];
    const floaters: { x: number; y: number; word: string; alpha: number; speed: number; size: number }[] = [];
    for (let i = 0; i < 12; i++) {
      floaters.push({
        x: Math.random() * W,
        y: H + Math.random() * H,
        word: words[i % words.length],
        alpha: Math.random() * 0.18 + 0.08,
        speed: Math.random() * 0.5 + 0.2,
        size: Math.random() * 10 + 9,
      });
    }

    // Small dot nodes on a hex grid — community nodes
    const nodes: { x: number; y: number; phase: number }[] = [];
    const cols = Math.ceil(W / 90) + 1;
    const rows = Math.ceil(H / 80) + 1;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const offset = r % 2 === 0 ? 0 : 45;
        nodes.push({
          x: c * 90 + offset,
          y: r * 80,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, W, H);
      t += 0.008;

      const cx = W / 2;
      const cy = H / 2;

      // 1. Rotating NSS-wheel in background (very faint)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.08);
      for (let s = 0; s < SPOKES; s++) {
        const angle = (s / SPOKES) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * Math.min(W, H) * 0.45, Math.sin(angle) * Math.min(W, H) * 0.45);
        ctx.strokeStyle = 'rgba(45,106,79,0.04)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      // Outer rim
      ctx.beginPath();
      ctx.arc(0, 0, Math.min(W, H) * 0.44, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(45,106,79,0.05)';
      ctx.lineWidth = 2;
      ctx.stroke();
      // Inner circle
      ctx.beginPath();
      ctx.arc(0, 0, Math.min(W, H) * 0.12, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(45,106,79,0.06)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // 2. Pulsing ripple rings from center
      rings.forEach((ring) => {
        ring.r += ring.speed;
        if (ring.r > Math.max(W, H) * 0.8) ring.r = 0;
        ctx.beginPath();
        ctx.arc(cx, cy, ring.r, 0, Math.PI * 2);
        const fade = ring.r > Math.max(W, H) * 0.5
          ? ring.alpha * (1 - (ring.r - Math.max(W, H) * 0.5) / (Math.max(W, H) * 0.3))
          : ring.alpha;
        ctx.strokeStyle = `rgba(100,180,140,${Math.max(0, fade)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // 3. Hex-grid community nodes — gently pulsing dots
      nodes.forEach((node) => {
        const pulse = Math.sin(t * 1.5 + node.phase) * 0.5 + 0.5;
        const alpha = 0.04 + pulse * 0.06;
        const r = 1.5 + pulse * 1;
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,220,200,${alpha})`;
        ctx.fill();
      });

      // 4. Rising service words
      floaters.forEach((f) => {
        f.y -= f.speed;
        if (f.y < -40) {
          f.y = H + 20;
          f.x = Math.random() * W;
        }
        ctx.save();
        ctx.font = `${f.size}px system-ui`;
        ctx.fillStyle = `rgba(180,230,205,${f.alpha})`;
        ctx.letterSpacing = '0.3em';
        ctx.fillText(f.word, f.x, f.y);
        ctx.restore();
      });

      raf = requestAnimationFrame(draw);
    }
    draw();

    const handleResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', handleResize); };
  }, []);

  return (
    <div style={{ backgroundColor: '#e0e0e0' }}>

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section style={{
        background: 'linear-gradient(145deg, #111 0%, #1c1c1c 35%, #1a2e22 65%, #0e1e30 100%)',
        minHeight: '100vh', position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Animated canvas */}
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

        {/* Glowing orbs */}
        <div style={{
          position: 'absolute', top: '20%', left: '10%',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(45,106,79,0.15) 0%, transparent 70%)',
          animation: 'pulse 6s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '15%', right: '8%',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(26,74,138,0.12) 0%, transparent 70%)',
          animation: 'pulse 8s ease-in-out infinite 2s',
        }} />

        <style>{`
          @keyframes pulse { 0%,100%{opacity:0.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.08)} }
          @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
          @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
          @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
          .hero-title { animation: fadeUp 0.8s ease 0.2s both; }
          .hero-sub   { animation: fadeUp 0.8s ease 0.4s both; }
          .hero-body  { animation: fadeUp 0.8s ease 0.6s both; }
          .hero-btns  { animation: fadeUp 0.8s ease 0.8s both; }
          .hero-logos { animation: fadeUp 0.8s ease 0.5s both; }
        `}</style>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '8rem 2rem 4rem', maxWidth: '900px' }}>

          {/* 3 logos row */}
          <div className="hero-logos" style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '3rem' }}>
            {['/ceg-logo.png', '/nss-logo.png', '/annauniv-logo.png'].map((src, i) => (
              <div key={i} style={{
                width: '90px', height: '90px', borderRadius: '50%',
                background: '#ffffff',
                border: '3px solid rgba(255,255,255,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 24px rgba(0,0,0,0.4), 0 0 0 4px rgba(255,255,255,0.06)',
                position: 'relative', overflow: 'hidden',
              }}>
                <Image src={src} alt="" fill style={{ objectFit: 'contain', padding: '10px' }} />
              </div>
            ))}
          </div>

          {/* Tag */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            border: '1px solid rgba(255,255,255,0.12)', borderRadius: '2px',
            padding: '5px 14px', marginBottom: '1.5rem',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4ade80', display: 'inline-block' }} />
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', letterSpacing: '0.25em', fontFamily: 'system-ui', textTransform: 'uppercase' }}>
              College of Engineering, Guindy · Anna University · Chennai
            </span>
          </div>

          {/* Main title */}
          <div className="hero-title">
            <h1 style={{
              color: '#fff', fontFamily: 'Georgia, serif',
              fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
              fontWeight: '700', lineHeight: '1.05',
              letterSpacing: '-0.02em', margin: '0 0 0.5rem',
            }}>
              National Service<br />Scheme
            </h1>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
              <span style={{
                background: 'linear-gradient(90deg, #2d6a4f, #1a4a8a)',
                color: '#fff', fontFamily: 'system-ui', fontWeight: '700',
                fontSize: '1.1rem', letterSpacing: '0.3em',
                padding: '4px 12px', borderRadius: '10px',
              }}>UNIT 3</span>
            </div>
          </div>

          {/* Motto */}
          <div className="hero-sub" style={{
            margin: '0 auto 2.5rem',
            padding: '1rem 2rem',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            display: 'inline-block',
          }}>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem', letterSpacing: '0.3em', fontFamily: 'system-ui', textTransform: 'uppercase', marginBottom: '6px' }}>OUR MOTTO</p>
            <p style={{
              color: '#fff', fontFamily: 'Georgia, serif',
              fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
              fontStyle: 'italic', fontWeight: '400',
              background: 'linear-gradient(90deg, #a8d5b8, #fff, #a8c8e8)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'shimmer 4s linear infinite',
            }}>"Not Me, But You"</p>
          </div>

          {/* Buttons */}
          <div className="hero-btns" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/activities" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              backgroundColor: '#2d6a4f', color: '#fff',
              padding: '13px 32px', borderRadius: '3px',
              fontFamily: 'system-ui', fontWeight: '600', fontSize: '0.8rem',
              textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase',
              boxShadow: '0 4px 20px rgba(45,106,79,0.4)',
            }}>Explore Activities <ArrowRight size={15} /></Link>
            <Link href="/gallery" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.75)',
              padding: '13px 32px', borderRadius: '3px',
              fontFamily: 'system-ui', fontWeight: '600', fontSize: '0.8rem',
              textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>View Gallery</Link>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{
          position: 'relative', zIndex: 2, width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '1px',
          borderTop: '1px solid rgba(255,255,255,0.07)',
        }}>
          {[['200+','Volunteers'],['50+','Activities / Year'],['2','Signature Events'],['240 hrs','Service Hours']].map(([v,l], i) => (
            <div key={i} style={{
              padding: '1.5rem', textAlign: 'center',
              borderRight: i < 3 ? '1px solid rgba(255,255,255,0.07)' : 'none',
              background: 'rgba(255,255,255,0.02)',
              minWidth: '120px',
            }}>
              <p style={{ color: '#fff', fontFamily: 'Georgia,serif', fontSize: '2rem', fontWeight: '700', margin: '0 0 4px' }}>{v}</p>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'system-ui', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>{l}</p>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <div style={{ position: 'absolute', bottom: '80px', left: '50%', transform: 'translateX(-50%)', zIndex: 2, animation: 'pulse 2s ease infinite' }}>
          <ChevronDown size={20} color="rgba(255,255,255,0.25)" />
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 1 — College  (full-width photo top, text below)
      ══════════════════════════════════════════ */}
      <section style={{ backgroundColor: '#e0e0e0', padding: '0 0 5rem' }}>

        {/* Section header */}
        <div style={{ backgroundColor: '#e0e0e0', paddingTop: '4rem', paddingBottom: '2.5rem' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>

            {/* Label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
              {/* <span style={{ color: '#800020', fontFamily: 'system-ui', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.25em', textTransform: 'uppercase' }}>01</span> */}
              {/* <div style={{ width: '40px', height: '1px', backgroundColor: '#800020' }} /> */}
              <span style={{ color: '#888', fontFamily: 'system-ui', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>About the Institution</span>
            </div>

            {/* Two-column: decorative image left, title+intro right */}
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4rem', alignItems: 'center', marginBottom: '1rem' }}>

              {/* Left — image at natural size with maroon border */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{
                  width: '350px', height: '250px',
                  borderRadius: '8px', overflow: 'hidden',
                  border: '1.5px solid #800020',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                }}>
                  <Image
                    src="/college/college-1.png"
                    alt="College of Engineering Guindy"
                    width={350}
                    height={250}
                    quality={100}
                    style={{ width: '100%', height: '100%', objectFit: 'fill', display: 'block' }}
                    priority
                  />
                </div>
                <div style={{ marginTop: '8px', textAlign: 'center' }}>
                  <p style={{ fontFamily: 'system-ui', fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#800020', margin: 0 }}>Est. 1794 · Chennai</p>
                </div>
              </div>

              {/* Right — heading + intro */}
              <div>
                <h2 style={{
                  color: '#1a1a1a', fontFamily: 'Georgia,serif',
                  fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                  fontWeight: '700', lineHeight: '1.15',
                  marginBottom: '1.25rem', letterSpacing: '-0.01em',
                }}>
                  College of<br />Engineering,<br />Guindy
                </h2>
                <div style={{ width: '40px', height: '3px', background: 'linear-gradient(90deg,#800020,#2d6a4f)', borderRadius: '2px', marginBottom: '1.25rem' }} />
                <p style={{
                  color: '#555', fontFamily: 'Georgia,serif',
                  fontSize: '1rem', lineHeight: '1.85', textAlign: 'justify',
                }}>
                  The College of Engineering, Guindy (CEG), established in <strong style={{ color: '#1a1a1a' }}>1794</strong>, is one
                  of the oldest and most prestigious engineering institutions in Asia.
                  A constituent college of Anna University, CEG has been a pioneer in
                  technical education, research, innovation, and societal development
                  for over two centuries.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content below photo */}
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 2rem 0' }}>

          {/* Two small photos + text row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '3.5rem' }}>
            <div style={{ position: 'relative', height: '220px', borderRadius: '6px', overflow: 'hidden', boxShadow: '0 6px 24px rgba(0,0,0,0.15)', border: '1.5px solid #800020' }}>
              <Image src="/college/college-2.png" alt="CEG" fill quality={100} sizes="50vw" style={{ objectFit: 'cover' }} />
            </div>
            <div style={{ position: 'relative', height: '220px', borderRadius: '6px', overflow: 'hidden', boxShadow: '0 6px 24px rgba(0,0,0,0.15)', border: '1.5px solid #800020' }}>
              <Image src="/college/college-3.png" alt="CEG" fill quality={100} sizes="50vw" style={{ objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(128,0,32,0.8),transparent)', padding: '12px 16px' }}>
                <p style={{ color: '#fff', fontFamily: 'system-ui', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 }}>CEG · Anna University</p>
              </div>
            </div>
          </div>

          {/* 3 text columns */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '3rem' }}>
            {[
              { num: '01', text: 'CEG is defined by the "Guindy Pride" of its iconic red-brick Main Building and majestic clock tower, a testament to centuries of engineering heritage. Nestled within a 189-acre urban forest in Chennai, the campus offers a serene ecosystem where students coexist with spotted deer and diverse wildlife.' },
              { num: '02', text: 'Located in the heart of Chennai, CEG has consistently produced eminent engineers, researchers, entrepreneurs, administrators, and leaders who have significantly contributed to national and global development. The institution stands for academic excellence, ethical values, and social responsibility.' },
              { num: '03', text: 'College of Engineering Guindy consistently ranks among the top institutions nationally. Ranked #29 in the NIRF 2025 \'Overall\' category, CEG continues to demonstrate excellence in engineering education, research output, and placement outcomes, inspiring generations of change-makers.' },
            ].map((col) => (
              <div key={col.num} className="info-card" style={{
                backgroundColor: '#d8d8d8',
                borderRadius: '8px',
                borderTop: '3px solid #800020',
                padding: '1.75rem',
                boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform='translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow='0 10px 28px rgba(0,0,0,0.13)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform='translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow='0 2px 12px rgba(0,0,0,0.07)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                  <span style={{ color: '#800020', fontFamily: 'system-ui', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.2em' }}>{col.num}</span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#b8b8b8' }} />
                </div>
                <p style={{ color: '#444', fontFamily: 'Georgia,serif', fontSize: '0.9rem', lineHeight: '1.85', margin: 0 }}>{col.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 2 — NSS (dark bg, centered logo)
      ══════════════════════════════════════════ */}
      <section style={{ backgroundColor: '#1c1c1c', padding: '5rem 0', position: 'relative', overflow: 'hidden' }}>
        {/* Subtle bg grid */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '48px 48px' }} />

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 1 }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <p style={{ color: '#4ade80', fontFamily: 'system-ui', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>About NSS</p>
            <h2 style={{ color: '#fff', fontFamily: 'Georgia,serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '700', margin: 0 }}>National Service Scheme</h2>
          </div>

          {/* Center logo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3.5rem' }}>
            <div style={{
              width: '180px', height: '180px', borderRadius: '50%',
              backgroundColor: '#fff',
              boxShadow: '0 0 0 12px rgba(255,255,255,0.05), 0 0 0 24px rgba(255,255,255,0.03), 0 8px 40px rgba(0,0,0,0.5)',
              position: 'relative', overflow: 'hidden',
            }}>
              <Image src="/nss-logo.png" alt="NSS" fill style={{ objectFit: 'contain', padding: '18px' }} />
            </div>
          </div>

          {/* 3 columns */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1px', backgroundColor: 'rgba(255,255,255,0.08)', marginBottom: '3.5rem', borderRadius: '6px', overflow: 'hidden' }}>
            {[
              { title: 'Founded', body: 'The NSS was launched in 1969 by the Government of India with the primary objective of developing student personality through community service.' },
              { title: 'Philosophy', body: 'NSS reflects democratic living and selfless service demonstrating that the welfare of the individual is ultimately dependent on the welfare of society at large.' },
              { title: 'At CEG', body: 'At CEG, NSS plays a pivotal role in shaping socially responsible engineers who engage with real-world challenges through sustained community initiatives.' },
            ].map((col, i) => (
              <div key={col.title} style={{
                backgroundColor: 'rgba(255,255,255,0.03)',
                borderTop: '3px solid #4ade80',
                padding: '2rem',
                transition: 'transform 0.25s ease, background 0.25s ease',
                cursor: 'default',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform='translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.background='rgba(255,255,255,0.07)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform='translateY(0)'; (e.currentTarget as HTMLDivElement).style.background='rgba(255,255,255,0.03)'; }}
              >
                <p style={{ color: '#4ade80', fontFamily: 'system-ui', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>{col.title}</p>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'Georgia,serif', fontSize: '0.9rem', lineHeight: '1.85', margin: 0 }}>{col.body}</p>
              </div>
            ))}
          </div>

          {/* Motto + bullets row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Motto */}
            <div style={{
              borderTop: '3px solid #e88',
              borderLeft: '1px solid rgba(255,255,255,0.08)',
              borderRight: '1px solid rgba(255,255,255,0.08)',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px', padding: '2.5rem', textAlign: 'center',
              background: 'rgba(255,255,255,0.02)',
              transition: 'transform 0.25s ease, background 0.25s ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform='translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.background='rgba(255,255,255,0.05)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform='translateY(0)'; (e.currentTarget as HTMLDivElement).style.background='rgba(255,255,255,0.02)'; }}
            >
              <p style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'system-ui', fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '1rem' }}>NSS Motto</p>
              <p style={{ color: '#e88', fontFamily: 'Georgia,serif', fontSize: '2.8rem', fontWeight: '900', lineHeight: '1.15', margin: 0 }}>"NOT ME,<br />BUT YOU"</p>
            </div>
            {/* Bullets */}
            <div style={{
              borderTop: '3px solid #4ade80',
              borderLeft: '1px solid rgba(255,255,255,0.08)',
              borderRight: '1px solid rgba(255,255,255,0.08)',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px', padding: '2rem',
              background: 'rgba(255,255,255,0.02)',
              transition: 'transform 0.25s ease, background 0.25s ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform='translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.background='rgba(255,255,255,0.05)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform='translateY(0)'; (e.currentTarget as HTMLDivElement).style.background='rgba(255,255,255,0.02)'; }}>
              <p style={{ color: '#e88', fontFamily: 'system-ui', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Students Are Encouraged To:</p>
              {['Understand social realities and community needs', 'Develop leadership, teamwork, and organizational skills', 'Cultivate empathy, discipline, and civic responsibility', 'Contribute meaningfully to nation-building'].map((item) => (
                <div key={item} style={{ display: 'flex', gap: '10px', marginBottom: '0.85rem', alignItems: 'flex-start' }}>
                  <span style={{ color: '#4ade80', fontWeight: '900', fontSize: '0.6rem', marginTop: '4px' }}>▸</span>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'system-ui', fontSize: '0.875rem', lineHeight: '1.6', margin: 0 }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 3 — Unit 3 (grey, centered logo)
      ══════════════════════════════════════════ */}
      <section style={{ backgroundColor: '#d8d8d8', padding: '5rem 0' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <p style={{ color: '#800020', fontFamily: 'system-ui', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Our Unit</p>
            <h2 style={{ color: '#1a1a1a', fontFamily: 'Georgia,serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '700', margin: '0 0 0.5rem' }}>NSS Unit 3 CEG</h2>
            <div style={{ width: '48px', height: '3px', background: 'linear-gradient(90deg,#2d6a4f,#800020)', borderRadius: '2px', margin: '0 auto' }} />
          </div>

          {/* Center logo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3.5rem' }}>
            <div style={{
              width: '180px', height: '180px', borderRadius: '50%',
              backgroundColor: '#111',
              boxShadow: '0 0 0 12px #ccc, 0 0 0 24px #c4c4c4, 0 8px 40px rgba(0,0,0,0.2)',
              position: 'relative', overflow: 'hidden',
            }}>
              <Image src="/unit3-logo.png" alt="Unit 3" fill style={{ objectFit: 'contain', padding: '12px' }} />
            </div>
          </div>

          {/* 4 text paragraphs in 2×2 grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
            {[
              'The NSS Unit–3 of CEG, Anna University is dedicated to creating socially responsible students who actively contribute to community development. Guided by the motto "Not Me, But You," the unit cultivates empathy, leadership, and civic responsibility.',
              'NSS Unit–3 regularly organizes outreach programs addressing real societal challenges by organizing health camps, awareness rallies, educational programs, environmental drives, and community surveys, working directly with communities for meaningful impact.',
              'The unit strongly believes true education goes beyond classrooms. Service-oriented activities nurture compassion, teamwork, and social awareness, shaping volunteers into responsible citizens and future leaders committed to positive change.',
              'Through consistent dedication and collaborative efforts, NSS Unit–3 upholds the spirit of service and community engagement at CEG, inspiring students to create a lasting, meaningful impact on society and the nation.',
            ].map((para, i) => (
              <div key={i} style={{
                backgroundColor: '#d0d0d0',
                border: '1px solid #b8b8b8',
                borderTop: `3px solid ${i % 2 === 0 ? '#2d6a4f' : '#800020'}`,
                borderRadius: '8px',
                padding: '1.75rem',
                boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                cursor: 'default',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform='translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow='0 10px 28px rgba(0,0,0,0.13)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform='translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow='0 2px 12px rgba(0,0,0,0.07)'; }}
              >
                <p style={{ color: '#333', fontFamily: 'Georgia,serif', fontSize: '0.9rem', lineHeight: '1.85', margin: 0, textAlign: 'justify' }}>{para}</p>
              </div>
            ))}
          </div>

          {/* What we stand for — horizontal chips */}
          <div style={{ backgroundColor: '#c8c8c8', borderTop: '3px solid #800020', border: '1px solid #b4b4b4', borderRadius: '8px', padding: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
            <p style={{ color: '#800020', fontFamily: 'system-ui', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1.25rem', textAlign: 'center' }}>What We Stand For</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '1.5rem' }}>
              {['Social Responsibility', 'Community Engagement', 'Empowering Communities', 'Awareness & Inclusivity', 'Student Leadership', 'Teamwork', 'Compassionate Society'].map((tag) => (
                <span key={tag} style={{
                  backgroundColor: '#b8b8b8', color: '#222',
                  fontFamily: 'system-ui', fontSize: '0.8rem', fontWeight: '600',
                  padding: '6px 16px', borderRadius: '3px',
                  border: '1px solid #a8a8a8',
                }}>{tag}</span>
              ))}
            </div>
            <div style={{ textAlign: 'center', paddingTop: '1.25rem', borderTop: '1px solid #b0b0b0' }}>
              <p style={{ color: '#800020', fontFamily: 'Georgia,serif', fontSize: '1.5rem', fontWeight: '700', fontStyle: 'italic', margin: 0 }}>
                Driven by Service · Inspired by Change
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA
      ══════════════════════════════════════════ */}
      {/* <section style={{ backgroundColor: '#111', padding: '4rem 0' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem', display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'center' }}>
          <div>
            <p style={{ color: '#4ade80', fontFamily: 'system-ui', fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Join the Movement</p>
            <h3 style={{ color: '#fff', fontFamily: 'Georgia,serif', fontSize: '1.8rem', fontWeight: '700', margin: '0 0 0.5rem' }}>Ready to Make a Difference?</h3>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'system-ui', fontSize: '0.875rem', margin: 0 }}>Join NSS Unit 3 and serve society through meaningful action.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/activities" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#2d6a4f', color: '#fff', padding: '11px 22px', borderRadius: '3px', fontFamily: 'system-ui', fontWeight: '600', fontSize: '0.75rem', textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Activities <ArrowUpRight size={13} />
            </Link>
            <Link href="/events" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#800020', color: '#fff', padding: '11px 22px', borderRadius: '3px', fontFamily: 'system-ui', fontWeight: '600', fontSize: '0.75rem', textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Our Events <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </section> */}

    </div>
  );
}