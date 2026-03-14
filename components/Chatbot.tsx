'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Sparkles } from 'lucide-react';

interface Message {
  role: 'assistant' | 'user';
  text: string;
  loading?: boolean;
}

const SYSTEM_PROMPT = `You are the official AI assistant for the NSS (National Service Scheme) Unit 3 of College of Engineering, Guindy (CEG), Anna University, Chennai.

Your job is to help students, volunteers, and visitors with questions about:

ABOUT NSS:
- NSS stands for National Service Scheme, launched in 1969 by the Government of India
- Motto: "Not Me, But You"
- Objective: Develop student personality through community service
- Requires 240 hours of regular activities + 7-day Special Camp per year
- Earns an NSS Certificate recognized by UPSC and state PSCs

ABOUT CEG NSS UNIT 3:
- Located at College of Engineering, Guindy, Anna University, Chennai – 600 025
- 200+ active volunteers
- Activities: Blood donation camps, tree plantation, awareness rallies, village adoption, cleanliness drives, school visits, orphanage visits, eye check-up camps, public surveys
- Email: cegnssunit3@gmail.com
- Instagram: nss__unit__3

BENEFITS:
- NSS Certificate recognized by UPSC and state PSCs
- Weightage in government job applications
- National Award for Best NSS Volunteers
- Leadership and personality development

NSS (National Service Scheme) Unit 3 organizes community service and social impact programs conducted by student volunteers.

Two major events organized by NSS Unit 3 are:

Greenify:
Greenify is an environmental initiative focused on tree plantation, environmental awareness campaigns, and sustainability. Volunteers participate in planting saplings, spreading awareness about climate change, and encouraging eco-friendly habits among the public and students.

Magizhvi:
Magizhvi is a social outreach program designed to spread happiness and support underprivileged communities. NSS volunteers visit orphanages, children's homes, and community centers to conduct activities such as games, cultural performances, motivational interactions, and donation drives.

When users ask about NSS events, explain these programs clearly and encourage students to participate in social service and volunteer activities.

Keep responses concise, friendly, and helpful. If asked something outside NSS/CEG scope, politely redirect to NSS topics. Always respond in the same language the user writes in.`;

async function askGroq(messages: { role: string; content: string }[]): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

  if (!apiKey) {
    return "⚠️ Groq API key not configured. Please add NEXT_PUBLIC_GROQ_API_KEY to your .env.local file.";
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama3-8b-8192',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
      max_tokens: 300,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'API error');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

const SUGGESTIONS = ['What is NSS?', 'How to join?', 'Activities', 'Contact', 'Certificate benefits'];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: "👋 Hi! I'm the NSS CEG Assistant. Ask me anything about our Unit, activities, or how to join!",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const historyRef = useRef<{ role: string; content: string }[]>([]);

  // Nudge Logic: Triggers 10s after closing the chat
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!open) {
      timer = setTimeout(() => {
        setShowTooltip(true);
      }, 10000);
    } else {
      setShowTooltip(false);
    }
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  async function send(text?: string) {
    const userText = (text ?? input).trim();
    if (!userText || loading) return;

    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setLoading(true);

    setMessages((prev) => [...prev, { role: 'assistant', text: '', loading: true }]);

    historyRef.current = [
      ...historyRef.current.slice(-8),
      { role: 'user', content: userText },
    ];

    try {
      const reply = await askGroq(historyRef.current);
      historyRef.current = [...historyRef.current, { role: 'assistant', content: reply }];

      setMessages((prev) => [
        ...prev.filter((m) => !m.loading),
        { role: 'assistant', text: reply },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev.filter((m) => !m.loading),
        {
          role: 'assistant',
          text: `❌ Sorry, I couldn't process that. Please try again!`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        
        {/* Tooltip Nudge */}
        {showTooltip && !open && (
          <div className="mb-4 mr-2 bg-white text-[#555555] text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl border border-gray-100 animate-bounce relative max-w-[220px]">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowTooltip(false); }}
              className="absolute -top-2 -left-2 bg-white shadow-md rounded-full p-1 text-gray-400 hover:text-[#555555] transition-colors"
            >
              <X size={10} />
            </button>
            Talk to me to know about our Unit!
            <div className="absolute -bottom-1 right-6 w-3 h-3 bg-white border-r border-b border-gray-100 rotate-45"></div>
          </div>
        )}

        {/* The NSS Rath Wheel Button */}
        <button
          onClick={() => {
            setOpen(!open);
            setShowTooltip(false);
          }}
          className="relative group w-16 h-16 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
          aria-label="Toggle Support Chat"
        >
          {/* Light Grey Ripple Effect */}
          {!open && (
            <>
              <span className="absolute w-full h-full rounded-full bg-[#555555]/20 animate-ping"></span>
              <span className="absolute w-full h-full rounded-full bg-[#555555]/10 animate-[ping_3s_linear_infinite]"></span>
            </>
          )}

          {/* Main Button Body - LIGHT GREY Theme */}
          <div className={`relative w-16 h-16 rounded-full shadow-2xl flex items-center justify-center border-2 transition-all duration-500 overflow-hidden ${
            open ? 'bg-white border-[#555555] rotate-90' : 'bg-[#555555] border-white'
          }`}>
            {open ? (
              <X size={26} className="text-[#555555]" />
            ) : (
              /* CSS-Built NSS Rath Wheel */
              <div className="relative w-10 h-10 animate-[spin_15s_linear_infinite] group-hover:animate-[spin_5s_linear_infinite] transition-all">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute top-1/2 left-1/2 w-full h-[2px] bg-white/50 -translate-x-1/2 -translate-y-1/2"
                    style={{ transform: `translate(-50%, -50%) rotate(${i * 45}deg)` }}
                  />
                ))}
                <div className="absolute inset-0 border-2 border-white rounded-full"></div>
                <div className="absolute inset-[30%] border border-white/40 rounded-full flex items-center justify-center">
                   <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              </div>
            )}
          </div>
        </button>
      </div>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] border border-gray-100 flex flex-col overflow-hidden animate-slide-up">

          {/* Header - Light Grey Gradient */}
          <div className="bg-gradient-to-r from-[#666666] to-[#444444] px-6 py-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
              <Sparkles size={18} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm tracking-tight uppercase">NSS Unit 3 Assistant</p>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <p className="text-green-100 text-[10px] font-bold tracking-widest uppercase">Online Now</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 h-80 chatbot-container bg-gray-50/50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                    msg.role === 'assistant'
                      ? 'bg-white border border-gray-100 text-[#555555]'
                      : 'bg-[#555555] text-white'
                  }`}
                >
                  {msg.role === 'assistant' ? <Bot size={14} /> : <User size={14} />}
                </div>

                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === 'assistant'
                      ? 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'
                      : 'bg-nss-green text-white rounded-tr-none'
                  }`}
                >
                  {msg.loading ? (
                    <div className="flex items-center gap-1 py-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce" />
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce [animation-delay:150ms]" />
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce [animation-delay:300ms]" />
                    </div>
                  ) : (
                    <p className="whitespace-pre-line">{msg.text}</p>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          <div className="px-3 py-2 flex gap-2 overflow-x-auto border-t border-gray-50 bg-white scrollbar-none">
            {SUGGESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                disabled={loading}
                className="text-[11px] whitespace-nowrap px-3 py-1.5 rounded-xl border border-gray-100 text-gray-500 font-bold hover:bg-nss-green hover:text-white transition-all"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-50 flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Ask about Unit 3..."
              disabled={loading}
              className="flex-1 bg-gray-100 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#555555]/10 border-none transition-all"
            />
            <button
              onClick={() => send()}
              disabled={loading || !input.trim()}
              className="w-12 h-12 rounded-2xl bg-[#555555] text-white flex items-center justify-center hover:opacity-80 shadow-lg shadow-black/5 transition-all disabled:opacity-30"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}