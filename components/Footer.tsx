'use client';

import Link from 'next/link';
import { MapPin, Mail, Instagram, Linkedin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#080f1e', color: '#94a3b8' }}>

      {/* Top gradient bar */}
      <div style={{ height: '3px', background: 'linear-gradient(90deg, #1a4a8a 0%, #2d6a4f 40%, #800020 70%, #1a4a8a 100%)' }} />

      {/* ── Large Motto Banner ── */}
      <div style={{
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        padding: '3.5rem 2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Faint background text */}
        <p style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          fontFamily: 'Georgia,serif', fontSize: 'clamp(4rem,10vw,9rem)',
          fontWeight: '900', color: 'rgba(255,255,255,0.02)',
          whiteSpace: 'nowrap', pointerEvents: 'none', userSelect: 'none',
          letterSpacing: '-0.02em',
        }}>NOT ME, BUT YOU</p>

        <p style={{
          color: '#334155', fontFamily: 'system-ui',
          fontSize: '0.65rem', letterSpacing: '0.35em',
          textTransform: 'uppercase', marginBottom: '1rem',
        }}>NSS Unit 3 · CEG · Anna University</p>

        <p style={{
          fontFamily: 'Georgia,serif',
          fontSize: 'clamp(2rem,5vw,4rem)',
          fontWeight: '700', color: '#e2e8f0',
          letterSpacing: '-0.02em', margin: '0 0 0.5rem',
          lineHeight: '1.1',
        }}>
          <span style={{ color: '#60a5fa' }}>"</span>
          Not Me, But You
          <span style={{ color: '#60a5fa' }}>"</span>
        </p>
        <p style={{
          color: '#475569', fontFamily: 'system-ui',
          fontSize: '0.75rem', letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }}>— NSS Motto</p>
      </div>

      {/* ── 4 Equal Columns ── */}
      <div style={{
        maxWidth: '1200px', margin: '0 auto',
        padding: '3rem 2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2.5rem',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>

        {/* Col 1 — About */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
            <div style={{ width: '20px', height: '2px', backgroundColor: '#1a4a8a' }} />
            <p style={{ color: '#fff', fontFamily: 'system-ui', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.25em', textTransform: 'uppercase', margin: 0 }}>About</p>
          </div>
          <p style={{ color: '#fff', fontFamily: 'Georgia,serif', fontSize: '1.1rem', fontWeight: '700', margin: '0 0 0.5rem', lineHeight: '1.3' }}>
            NSS Unit 3
          </p>
          <p style={{ color: '#475569', fontFamily: 'system-ui', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 1rem' }}>
            CEG · Anna University
          </p>
          <p style={{ color: '#64748b', fontFamily: 'Georgia,serif', fontSize: '0.85rem', lineHeight: '1.8', margin: 0 }}>
            Nurturing responsible citizens through community service and social actions.
          </p>
        </div>

        {/* Col 2 — Navigate */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
            <div style={{ width: '20px', height: '2px', backgroundColor: '#2d6a4f' }} />
            <p style={{ color: '#fff', fontFamily: 'system-ui', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.25em', textTransform: 'uppercase', margin: 0 }}>Navigate</p>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { href: '/', label: 'Home' },
              { href: '/activities', label: 'Activities' },
              { href: '/events', label: 'Our Events' },
              { href: '/gallery', label: 'Gallery' },
              { href: '/admin/login', label: 'Admin Login' },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} style={{ color: '#64748b', fontSize: '0.875rem', fontFamily: 'system-ui', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#e2e8f0')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
                >
                  <span style={{ width: '14px', height: '1px', backgroundColor: '#1a4a8a', display: 'inline-block', flexShrink: 0 }} />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 — Connect */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
            <div style={{ width: '20px', height: '2px', backgroundColor: '#800020' }} />
            <p style={{ color: '#fff', fontFamily: 'system-ui', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.25em', textTransform: 'uppercase', margin: 0 }}>Connect</p>
          </div>

          {/* Instagram */}
          <a href="https://www.instagram.com/nss__unit__3" target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem', textDecoration: 'none' }}
            onMouseEnter={e => { (e.currentTarget.querySelector('.social-label') as HTMLElement).style.color = '#f472b6'; }}
            onMouseLeave={e => { (e.currentTarget.querySelector('.social-label') as HTMLElement).style.color = '#64748b'; }}
          >
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg,#f97316,#ec4899,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Instagram size={16} color="#fff" />
            </div>
            <div>
              <p style={{ color: '#94a3b8', fontFamily: 'system-ui', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 2px' }}>Instagram</p>
              <p className="social-label" style={{ color: '#64748b', fontFamily: 'system-ui', fontSize: '0.875rem', margin: 0, transition: 'color 0.15s' }}>@nss__unit__3</p>
            </div>
          </a>

          {/* LinkedIn */}
          <a href="https://www.linkedin.com/in/ceg-nss-unit-3-926894379/?originalSubdomain=in" target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}
            onMouseEnter={e => { (e.currentTarget.querySelector('.social-label') as HTMLElement).style.color = '#60a5fa'; }}
            onMouseLeave={e => { (e.currentTarget.querySelector('.social-label') as HTMLElement).style.color = '#64748b'; }}
          >
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#0a66c2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Linkedin size={16} color="#fff" />
            </div>
            <div>
              <p style={{ color: '#94a3b8', fontFamily: 'system-ui', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 2px' }}>LinkedIn</p>
              <p className="social-label" style={{ color: '#64748b', fontFamily: 'system-ui', fontSize: '0.875rem', margin: 0, transition: 'color 0.15s' }}>CEG NSS Unit 3</p>
            </div>
          </a>
        </div>

        {/* Col 4 — Contact */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
            <div style={{ width: '20px', height: '2px', backgroundColor: '#60a5fa' }} />
            <p style={{ color: '#fff', fontFamily: 'system-ui', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.25em', textTransform: 'uppercase', margin: 0 }}>Contact</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <MapPin size={14} color="#1a4a8a" style={{ marginTop: '3px', flexShrink: 0 }} />
              <p style={{ color: '#64748b', fontFamily: 'system-ui', fontSize: '0.85rem', lineHeight: '1.65', margin: 0 }}>
                College of Engineering, Guindy<br />
                Anna University<br />
                Chennai – 600 025
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <Mail size={14} color="#1a4a8a" style={{ flexShrink: 0 }} />
              <a href="mailto:cegnssunit3@gmail.com" style={{ color: '#64748b', fontFamily: 'system-ui', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#93c5fd')}
                onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
              >
                cegnssunit3@gmail.com
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* ── Bottom bar ── */}
      <div style={{
        maxWidth: '1200px', margin: '0 auto',
        padding: '1.25rem 2rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '0.5rem',
      }}>
        <p style={{ color: '#656668', fontFamily: 'system-ui', fontSize: '0.75rem', margin: 0 }}>
          © NSS Unit 3, CEG Anna University.
        </p>
        <p style={{ color: '#656668', fontFamily: 'system-ui', fontSize: '0.75rem', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
          Made by the batch of 2027'
        </p>
      </div>

    </footer>
  );
}