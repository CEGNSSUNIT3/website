import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'NSS Unit — College of Engineering, Guindy | Anna University',
  description:
    'National Service Scheme Unit of College of Engineering, Guindy, Anna University. Serving the nation through youth.',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-white font-body text-gray-800 antialiased">
        <Toaster position="top-right" />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Chatbot />
      </body>
    </html>
  );
}
