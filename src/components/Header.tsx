import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Layers, 
  Clock, 
  Menu, 
  X, 
  MessageSquare, 
  ShieldCheck, 
  FileText, 
  ArrowRight,
  Download,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { SurgeShoreLogo } from './SurgeShoreLogo';
import { COMPANY_INFO } from '../data/products';
import { downloadBothPDFs } from '../utils/catalogDownloader';

interface HeaderProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onNavigate,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'downloading' | 'completed'>('idle');

  const handleDownloadBothPDFs = async () => {
    if (downloadStatus === 'downloading') return;
    setDownloadStatus('downloading');
    try {
      await downloadBothPDFs();
      setDownloadStatus('completed');
      setTimeout(() => setDownloadStatus('idle'), 3500);
    } catch {
      setDownloadStatus('idle');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'products', label: 'Products', icon: Layers },
    { id: 'about', label: 'Company Profile', icon: FileText },
    { id: 'quality', label: 'Quality & Testing', icon: ShieldCheck },
    { id: 'contact', label: 'Factory & Contact', icon: MapPin },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-sans">
      {/* Top Professional Contact & Info Strip */}
      <div className="bg-[#0B2559] text-white text-xs py-1.5 sm:py-2 px-3 sm:px-8 border-b border-[#123887]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Contact Details */}
          <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
            <a
              href={`tel:${COMPANY_INFO.phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-1.5 hover:text-[#FF6B00] transition-colors py-0.5"
            >
              <Phone className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
              <span className="font-semibold text-[11px] sm:text-xs">{COMPANY_INFO.phone}</span>
            </a>
            <a
              href={`mailto:${COMPANY_INFO.email}`}
              className="hidden sm:flex items-center gap-1.5 hover:text-slate-200 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
              <span className="text-[11px] sm:text-xs truncate max-w-[180px] sm:max-w-none">{COMPANY_INFO.email}</span>
            </a>
            <div className="hidden lg:flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
              <span className="truncate max-w-sm text-xs">Copper Ind. Area, Rajkot - 360022, Gujarat</span>
            </div>
          </div>

          {/* Business Hours & Badge */}
          <div className="flex items-center gap-2 sm:gap-4 text-slate-300 text-[10.5px] sm:text-[11px]">
            <div className="hidden md:flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
              <span>Thu - Tue: 8:30 AM - 8:00 PM</span>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-400/30 text-[10px] sm:text-xs shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Direct Manufacturer
            </span>
          </div>
        </div>
      </div>

      {/* Main White Navbar */}
      <div
        className={`px-3 sm:px-8 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200'
            : 'bg-white border-b border-slate-200/90'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between min-h-[4.5rem] sm:min-h-[5.5rem] py-1 sm:py-1.5">
          {/* Exact Brand Logo */}
          <button
            onClick={() => handleNavClick('hero')}
            className="flex items-center gap-2 sm:gap-3 text-left focus:outline-none cursor-pointer group py-0.5"
            title="Surge Shore Powertech LLP"
          >
            <SurgeShoreLogo variant="full" size="lg" theme="light" />
          </button>

          {/* Desktop Navigation Links (Aligned to Right Side) */}
          <nav className="hidden lg:flex items-center gap-2 xl:gap-3 ml-auto">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3 xl:px-4 py-2 rounded-xl text-xs xl:text-sm font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'text-[#0B2559] bg-slate-100 font-extrabold shadow-xs'
                      : 'text-slate-600 hover:text-[#0B2559] hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#FF6B00]' : 'text-slate-400'}`} />
                  <span className="whitespace-nowrap">{link.label}</span>
                </button>
              );
            })}

            {/* Desktop Download Catalogs button */}
            <button
              onClick={handleDownloadBothPDFs}
              disabled={downloadStatus === 'downloading'}
              className="ml-2 min-h-[40px] px-3.5 py-2 rounded-xl bg-[#FF6B00] hover:bg-[#E56000] text-white text-xs xl:text-sm font-bold transition-all shadow-sm hover:shadow-md flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-80 disabled:cursor-wait shrink-0"
              title="Download Surge Shore Product Catalogs"
            >
              {downloadStatus === 'downloading' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Downloading...</span>
                </>
              ) : downloadStatus === 'completed' ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  <span>Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Catalogs</span>
                </>
              )}
            </button>
          </nav>

          {/* Quick Action & Mobile Menu Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Quick WhatsApp Call CTA on mobile/tablet */}
            <a
              href={`https://wa.me/919173959019?text=Hello%20Surge%20Shore%2C%20I%20am%20inquiring%20about%20your%20motors.`}
              target="_blank"
              rel="noreferrer"
              className="lg:hidden p-2.5 rounded-xl bg-emerald-50 text-[#25D366] hover:bg-[#25D366] hover:text-white border border-emerald-200 transition-all flex items-center justify-center cursor-pointer active:scale-95"
              aria-label="WhatsApp"
            >
              <MessageSquare className="w-4 h-4" />
            </a>

            {/* Mobile Menu Hamburger (44x44 touch target) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden min-w-[44px] min-h-[44px] p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:text-[#0B2559] border border-slate-200 flex items-center justify-center cursor-pointer active:scale-95 transition-all"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#FF6B00]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="lg:hidden w-full bg-white border-b border-slate-200 px-4 sm:px-6 py-5 shadow-2xl overflow-hidden max-h-[80vh] overflow-y-auto"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = activeSection === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`min-h-[44px] flex items-center justify-between p-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#0B2559]/10 text-[#0B2559] font-extrabold'
                        : 'text-slate-700 hover:bg-slate-50 active:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? 'bg-[#0B2559] text-white' : 'bg-slate-100 text-slate-500'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span>{link.label}</span>
                    </div>
                    <ArrowRight className={`w-4 h-4 ${isActive ? 'text-[#FF6B00]' : 'text-slate-300'}`} />
                  </button>
                );
              })}

              <div className="pt-4 mt-2 border-t border-slate-100 flex flex-col gap-2.5">
                <a
                  href={`tel:${COMPANY_INFO.phone.replace(/\s+/g, '')}`}
                  className="min-h-[44px] w-full py-3 px-4 rounded-xl bg-[#0B2559] text-white text-xs sm:text-sm font-bold text-center flex items-center justify-center gap-2 shadow-sm active:scale-98"
                >
                  <Phone className="w-4 h-4 text-[#FF6B00]" />
                  <span>Direct Call: {COMPANY_INFO.phone}</span>
                </a>

                {/* Download Catalogs button above WhatsApp button */}
                <button
                  onClick={handleDownloadBothPDFs}
                  disabled={downloadStatus === 'downloading'}
                  className="min-h-[44px] w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF851A] hover:from-[#E56000] hover:to-[#FF6B00] text-white text-xs sm:text-sm font-bold text-center flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all cursor-pointer disabled:opacity-80 disabled:cursor-wait"
                >
                  {downloadStatus === 'downloading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Downloading Catalogs...</span>
                    </>
                  ) : downloadStatus === 'completed' ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      <span>Downloaded Catalogs!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download Catalogs</span>
                    </>
                  )}
                </button>

                <a
                  href={`https://wa.me/919173959019?text=Hello%20Surge%20Shore%20Powertech%2C%20I%20am%20interested%20in%20your%20motors%20and%20panels.`}
                  target="_blank"
                  rel="noreferrer"
                  className="min-h-[44px] w-full py-3 px-4 rounded-xl bg-[#25D366] text-white text-xs sm:text-sm font-bold text-center flex items-center justify-center gap-2 shadow-sm active:scale-98"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
