import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCatalog } from './components/ProductCatalog';
import { AboutSection } from './components/AboutSection';
import { QualityStandards } from './components/QualityStandards';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProductDetailPage } from './components/ProductDetailPage';
import { MessageSquare, PhoneCall } from 'lucide-react';
import { WhatsAppIcon } from './components/WhatsAppIcon';
import { COMPANY_INFO, PRODUCTS_DATA } from './data/products';
import { ProductItem } from './types';
import { useIsMobile } from './utils/animations';

export default function App() {
  const isMobile = useIsMobile();
  const [activeSection, setActiveSection] = useState('hero');
  const [currentView, setCurrentView] = useState<'home' | 'product-detail'>('home');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  // Single-page navigation: ensure address bar URL remains 100% clean (no hash, no query parameters)
  useEffect(() => {
    // If URL has any lingering hash from previous sessions, clear it cleanly without page reload
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    // Handle browser back/forward buttons using HTML5 history state while keeping the URL clean
    const handlePopState = (e: PopStateEvent) => {
      if (e.state?.view === 'product-detail' && e.state?.productId) {
        const found = PRODUCTS_DATA.find((p) => p.id === e.state.productId);
        if (found) {
          setSelectedProduct(found);
          setCurrentView('product-detail');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }
      // Return to single-page home overview
      setCurrentView('home');
      setSelectedProduct(null);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleSelectProduct = (product: ProductItem) => {
    setSelectedProduct(product);
    setCurrentView('product-detail');
    // Push in-memory history state keeping URL identical to current path (URL never changes)
    window.history.pushState(
      { view: 'product-detail', productId: product.id },
      '',
      window.location.pathname + window.location.search
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCatalog = () => {
    if (window.history.state?.view === 'product-detail') {
      window.history.back();
    } else {
      setCurrentView('home');
      setSelectedProduct(null);
    }
    setTimeout(() => {
      const elem = document.getElementById('products');
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 60);
  };

  const scrollToSection = (sectionId: string) => {
    const performScroll = () => {
      const elem = document.getElementById(sectionId);
      if (elem) {
        // Offset for the fixed header (~96px) so heading is fully visible below navbar
        const headerOffset = window.innerWidth < 640 ? 84 : 104;
        const elementPosition = elem.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: 'smooth'
        });
      }
    };

    if (currentView === 'product-detail') {
      setCurrentView('home');
      setSelectedProduct(null);
      if (window.history.state?.view === 'product-detail') {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
      setTimeout(performScroll, 80);
    } else {
      setActiveSection(sectionId);
      performScroll();
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-50 text-slate-900 selection:bg-[#FF6B00] selection:text-white overflow-x-hidden">
      {/* Professional Fixed Header */}
      <Header
        activeSection={currentView === 'product-detail' ? 'products' : activeSection}
        onNavigate={scrollToSection}
      />

      {/* Main Content: Animated View Transition */}
      <AnimatePresence mode="wait">
        {currentView === 'product-detail' && selectedProduct ? (
          <motion.div
            key={`product-${selectedProduct.id}`}
            initial={{ opacity: 0, y: isMobile ? 8 : 16 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { duration: isMobile ? 0.2 : 0.26, ease: "easeOut" }
            }}
            exit={{ 
              opacity: 0, 
              transition: { duration: 0.15, ease: "easeOut" }
            }}
            className="w-full origin-top"
          >
            <ProductDetailPage
              product={selectedProduct}
              onBackToCatalog={handleBackToCatalog}
              onSelectProduct={handleSelectProduct}
              onOpenContact={() => scrollToSection('contact')}
            />
          </motion.div>
        ) : (
          <motion.main
            key="home-main"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1, 
              transition: { duration: isMobile ? 0.2 : 0.26, ease: "easeOut" }
            }}
            exit={{ 
              opacity: 0, 
              transition: { duration: 0.15, ease: "easeOut" }
            }}
            className="relative"
          >
            {/* 1. Hero Overview */}
            <Hero
              onExploreCatalog={() => scrollToSection('products')}
              onOpenContact={() => scrollToSection('contact')}
              onSelectProduct={handleSelectProduct}
            />

            {/* 2. Comprehensive Product Catalog & Technical Photos */}
            <ProductCatalog
              onOpenContact={() => scrollToSection('contact')}
              onSelectProduct={handleSelectProduct}
            />

            {/* 3. Company Story & Digital Visiting Card */}
            <AboutSection
              onOpenContact={() => scrollToSection('contact')}
            />

            {/* 4. Manufacturing Standards & Testing Protocol */}
            <QualityStandards />

            {/* 5. Factory Location & Direct Inquiries */}
            <ContactSection />
          </motion.main>
        )}
      </AnimatePresence>

      {/* Footer */}
      <Footer onNavigate={scrollToSection} />

      {/* Floating Quick WhatsApp Chat Trigger (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        <a
          href={`https://wa.me/919173959019?text=Hello%20Surge%20Shore%20Powertech%2C%20I%20would%20like%20to%20inquire%20about%20your%20motors%20and%20panels.`}
          target="_blank"
          rel="noreferrer"
          className="p-3.5 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white shadow-lg hover:scale-105 transition-all flex items-center justify-center cursor-pointer group"
          title="Direct WhatsApp Chat with Factory"
          aria-label="Direct WhatsApp Chat with Factory"
        >
          <WhatsAppIcon className="w-6 h-6 fill-current shrink-0" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap text-xs font-bold ml-0 group-hover:ml-2">
            WhatsApp Direct
          </span>
        </a>
      </div>
    </div>
  );
}
