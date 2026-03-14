'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Heart, TreePine, Quote, Sparkles } from 'lucide-react';

const events = [
  {
    id: 'greenify',
    title: 'Greenify',
    logo: '/event-logos/greenify-logo.png',
    tagline: 'Go Green. Choose Green. Celebrate Clean.',
    motto: 'A Greener Diwali for a Healthier Tomorrow.',
    semester: 'Odd Semester',
    icon: TreePine,
    description: 'Greenify is an environmental awareness initiative organized by NSS Unit–3, College of Engineering, Guindy, Anna University, with the aim of promoting eco-friendly and responsible celebrations during the festival of Diwali. The initiative seeks to create awareness about the harmful effects of excessive firecracker usage, such as air pollution, noise pollution, and environmental damage, and encourages individuals to adopt more sustainable ways of celebrating the festival.Through Greenify, NSS volunteers strive to educate students and the public about the importance of protecting the environment while preserving the joy and spirit of festive celebrations. The event promotes alternatives such as celebrating with traditional oil lamps, decorations, and community activities, rather than relying on firecrackers that harm both human health and the environment.To make the awareness campaign more engaging and impactful, Greenify also includes creative competitions such as drawing and poster-making, where participants express their ideas on environmental protection and eco-friendly celebrations. These activities encourage students to think critically about sustainability and spread awareness through creativity.By bringing together awareness initiatives and student participation, Greenify aims to inspire a culture of responsible celebration and environmental consciousness, reminding everyone that true joy in festivals comes from sharing happiness while caring for the planet and future generations.',
    quote: 'Sustainable living is not a choice, but a necessity for our future generations.',
  },
  {
    id: 'magizhvi',
    title: 'Magizhvi',
    logo: '/event-logos/magizhvi-logo.png',
    tagline: 'Spread Joy. Spread Happiness.',
    motto: 'Happiness multiplies when shared with others.',
    semester: 'Even Semester',
    icon: Heart,
    description: " Magizhvi is a social outreach initiative organized by NSS Unit 3, College of Engineering, Guindy, Anna University, on account of the International day of Happiness dedicated to supporting and uplifting underserved and often overlooked communities in society. The core objective of Magizhvi is to create awareness, foster empathy, and encourage meaningful engagement between students and communities that require greater social recognition and support.Unlike a one-time theme, Magizhvi evolves each year, focusing on different sectors of society that deserve appreciation, visibility, and empowerment. In previous editions, the initiative has highlighted the contributions of sanitary workers, acknowledging their vital role in maintaining public health and cleanliness while also bringing attention to the challenges they face. By doing so, Magizhvi seeks to instill a sense of gratitude and respect for individuals whose work often goes unnoticed. This year, Magizhvi focuses on the transgender community, aiming to promote understanding, acceptance, and equality. Despite gradual social progress, many transgender individuals continue to face stigma, discrimination, and limited opportunities. Through awareness activities, discussions, and creative engagement, the event seeks to encourage students and the public to recognize the importance of inclusivity and respect for gender diversity. Magizhvi also incorporates interactive and creative platforms such as poetry and letter-writing competitions, allowing participants to express empathy, appreciation, and support through words and ideas. These activities encourage students to reflect on social issues and actively contribute to building a more compassionate and inclusive society. Through Magizhvi, NSS Unit 3 continues its commitment to community service and social responsibility, striving to bridge the gap between society and marginalized groups. By shining a light on different communities each year, the initiative aims to inspire awareness, understanding, and positive change while nurturing a spirit of service among students.",
    quote: 'The simplest act of kindness can create ripples of change in someone’s life.',
  },
];

export default function EventsPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let W = canvas.width = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;
    let t = 0;
    let raf: number;

    const leaves: { x: number; y: number; size: number; speed: number; wobble: number; phase: number; color: string; rotation: number; rotSpeed: number }[] = [];
    const colors = ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)'];
    for (let i = 0; i < 35; i++) {
      leaves.push({
        x: Math.random() * W,
        y: H + Math.random() * H,
        size: Math.random() * 8 + 4,
        speed: Math.random() * 0.6 + 0.2,
        wobble: Math.random() * 2 + 1,
        phase: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
      });
    }

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, W, H);
      t += 0.01;
      leaves.forEach(leaf => {
        leaf.y -= leaf.speed;
        leaf.x += Math.sin(t * leaf.wobble + leaf.phase) * 0.5;
        leaf.rotation += leaf.rotSpeed;
        if (leaf.y < -20) {
          leaf.y = H + 20;
          leaf.x = Math.random() * W;
        }
        ctx.save();
        ctx.translate(leaf.x, leaf.y);
        ctx.rotate(leaf.rotation);
        ctx.beginPath();
        ctx.moveTo(0, -leaf.size);
        ctx.bezierCurveTo(leaf.size * 0.8, -leaf.size * 0.5, leaf.size * 0.8, leaf.size * 0.5, 0, leaf.size);
        ctx.bezierCurveTo(-leaf.size * 0.8, leaf.size * 0.5, -leaf.size * 0.8, -leaf.size * 0.5, 0, -leaf.size);
        ctx.fillStyle = leaf.color;
        ctx.fill();
        ctx.restore();
      });
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer {
          0% { transform: translateX(-150%) skewX(-20deg); }
          100% { transform: translateX(150%) skewX(-20deg); }
        }
        
        .ev-fade { animation: fadeUp 0.7s ease both; }
        .ev-fade-2 { animation: fadeUp 0.7s ease 0.15s both; }
        .ev-fade-3 { animation: fadeUp 0.7s ease 0.3s both; }

        .motto-gold-card {
          transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
          background: linear-gradient(135deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
          background-size: 200% 200%;
          position: relative;
          overflow: hidden;
          perspective: 1000px;
        }
        
        .motto-gold-card:hover {
          transform: translateY(-60px) rotateX(12deg) rotateY(-2deg) scale(1.03);
          box-shadow: 0 45px 100px rgba(0, 0, 0, 0.4);
        }

        .motto-gold-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 60%;
          height: 100%;
          background: linear-gradient(
            to right, 
            transparent 0%, 
            rgba(255, 255, 255, 0.4) 50%, 
            transparent 100%
          );
          animation: shimmer 4s infinite linear;
          pointer-events: none;
        }

        .motto-gold-card:hover::after {
          animation-duration: 1.5s;
        }
      `}} />

      <section style={{
        background: 'linear-gradient(145deg, #111 0%, #1c1c1c 100%)',
        minHeight: '60vh', display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden', paddingTop: '5rem',
      }}>
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '1100px', margin: '0 auto', padding: '4rem 2rem', width: '100%', textAlign: 'center' }}>
          <div className="ev-fade" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(255,255,255,0.12)', padding: '5px 14px', marginBottom: '1.75rem' }}>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase' }}>Signature Events</span>
          </div>
          <h1 className="ev-fade-2" style={{ color: '#fff', fontFamily: 'Georgia, serif', fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: '700', margin: '0 0 1.25rem' }}>Our Events</h1>
          <p className="ev-fade-3" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1rem', maxWidth: '560px', margin: '0 auto 2.5rem', lineHeight: '1.6' }}>
            NSS Unit 3 organises impactful social service and community development events every semester.
          </p>
        </div>
      </section>

      <div style={{ backgroundColor: '#f5f5f5' }}>
        {events.map((event, idx) => {
          return (
            <section key={event.id} id={event.id} style={{
              backgroundColor: idx % 2 === 0 ? '#f5f5f5' : '#eeeeee',
              padding: '8rem 2rem',
            }}>
              <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1rem' }}>

                <div style={{
                  width: '100%',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                  marginBottom: '3rem',
                  backgroundColor: '#fff'
                }}>
                  <Image 
                    src={event.logo} 
                    alt={event.title} 
                    width={1200} 
                    height={400}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                  <div>
                    <h2 style={{ color: '#1a1a1a', fontFamily: 'Georgia, serif', fontSize: '2rem', fontWeight: '700', margin: 0 }}>{event.title}</h2>
                    <p style={{ color: '#999', fontSize: '0.85rem', fontStyle: 'italic', margin: 0 }}>{event.tagline}</p>
                  </div>
                  <div style={{ marginLeft: 'auto' }}>
                    <span style={{ backgroundColor: '#e0e0e0', color: '#444', fontSize: '0.75rem', fontWeight: '700', padding: '6px 16px', borderRadius: '99px' }}>
                      {event.semester}
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: '2.5rem' }}>
                  <div style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '2.5rem', borderLeft: '4px solid #333', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                    <p style={{ color: '#444', fontSize: '1.05rem', lineHeight: '1.8', textAlign: 'justify', margin: 0 }}>
                      {event.description}
                    </p>
                  </div>
                </div>

                <div style={{ backgroundColor: '#1a1a1a', borderRadius: '10px', padding: '2.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '4rem' }}>
                  <Quote size={32} color="rgba(255,255,255,0.1)" style={{ flexShrink: 0 }} />
                  <div>
                    <p style={{ color: '#fff', fontFamily: 'Georgia, serif', fontSize: '1.25rem', fontStyle: 'italic', margin: '0 0 8px' }}>
                      "{event.quote}"
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
                      NSS Unit 3 CEG
                    </p>
                  </div>
                </div>

                <div className="motto-gold-card" style={{
                  padding: '4rem 2rem',
                  borderRadius: '24px',
                  textAlign: 'center',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>
                    <Sparkles size={18} color="#000" />
                    <span style={{ color: '#000', fontSize: '0.75rem', fontWeight: '900', letterSpacing: '0.5em', textTransform: 'uppercase' }}>Signature Motto</span>
                    <Sparkles size={18} color="#000" />
                  </div>
                  <p style={{ color: '#000', fontFamily: 'Georgia, serif', fontSize: '2rem', fontStyle: 'italic', fontWeight: '800', lineHeight: '1.3', position: 'relative', zIndex: 1 }}>
                    "{event.motto}"
                  </p>
                  <div style={{ marginTop: '1.5rem', height: '3px', width: '80px', background: 'rgba(0,0,0,0.8)', margin: '1.5rem auto 0', position: 'relative', zIndex: 1 }}></div>
                </div>

              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}