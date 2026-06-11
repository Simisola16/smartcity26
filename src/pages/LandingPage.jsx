import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Menu, X, ChevronRight, Trophy, Radio, LineChart, Users, 
  PlaneTakeoff, Handshake, CheckCircle, Quote, Facebook, 
  Twitter, Instagram, Youtube 
} from 'lucide-react';

export function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Why Join', href: '#why-join' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-amber-400 selection:text-emerald-950 flex flex-col overflow-x-hidden">
      
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-emerald-950/95 backdrop-blur-md shadow-xl py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-[0_0_15px_rgba(245,158,11,0.5)] border-2 border-amber-300 overflow-hidden p-1">
                  <img src="/smartCityImage.jpg" alt="SmartCity Logo" className="w-full h-full object-contain rounded-full" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black tracking-tighter text-white uppercase leading-none">
                    Smart<span className="text-amber-500">City</span>
                  </span>
                  <span className="text-[0.65rem] font-bold text-emerald-300 uppercase tracking-widest leading-none mt-1">
                    Osun State Football League
                  </span>
                </div>
              </Link>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} className="text-sm font-bold text-emerald-50 hover:text-amber-400 uppercase tracking-widest transition-colors relative group">
                  {link.name}
                  <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
              <div className="pl-4 border-l border-emerald-800 flex items-center gap-3">
                <Link to="/club-login" className="text-sm font-bold text-emerald-300 hover:text-amber-400 uppercase tracking-widest transition-colors">
                  Club Login
                </Link>
                <Link to="/login" className="text-sm font-bold text-white hover:text-amber-400 uppercase tracking-widest transition-colors">
                  Admin
                </Link>
                <Link to="/club-register" className="bg-amber-500 hover:bg-amber-400 text-emerald-950 font-black px-6 py-2.5 rounded-sm uppercase tracking-wider text-sm transition-all duration-300 transform hover:-translate-y-0.5 shadow-[0_4px_14px_0_rgba(245,158,11,0.39)] hover:shadow-[0_6px_20px_rgba(245,158,11,0.23)]">
                  Register Club
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-amber-400 focus:outline-none p-2"
              >
                {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden absolute top-full left-0 w-full bg-emerald-950 border-t border-emerald-900 transition-all duration-300 origin-top ${isMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'}`}>
          <div className="px-4 py-6 space-y-2 shadow-2xl">
            {navLinks.map((link) => (
              <a key={link.name} onClick={() => setIsMenuOpen(false)} href={link.href} className="block px-4 py-3 text-base font-bold text-white hover:text-emerald-950 hover:bg-amber-400 uppercase tracking-widest rounded-sm transition-colors">
                {link.name}
              </a>
            ))}
            <div className="pt-6 mt-4 border-t border-emerald-900 space-y-3">
              <Link onClick={() => setIsMenuOpen(false)} to="/club-login" className="block px-4 py-3 text-center text-base font-bold text-amber-400 border border-amber-600/40 hover:bg-amber-500/10 uppercase tracking-widest rounded-sm transition-colors">
                Club Login
              </Link>
              <Link onClick={() => setIsMenuOpen(false)} to="/login" className="block px-4 py-3 text-center text-base font-bold text-white border border-emerald-700 hover:bg-emerald-800 uppercase tracking-widest rounded-sm transition-colors">
                Admin Login
              </Link>
              <Link onClick={() => setIsMenuOpen(false)} to="/club-register" className="flex justify-center items-center gap-2 w-full bg-amber-500 text-emerald-950 font-black px-4 py-4 rounded-sm uppercase tracking-widest text-lg shadow-lg">
                Register Club <ChevronRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden bg-emerald-950">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-emerald-950/80 mix-blend-multiply z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/60 to-transparent z-10"></div>
          {/* Subtle Grid / Pitch pattern */}
          <div className="absolute inset-0 z-10 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent"></div>
          {/* Abstract Stadium Lights */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-400/20 blur-[100px] rounded-full z-10"></div>
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-amber-500/20 blur-[80px] rounded-full z-10"></div>
          
          <img 
            src="https://images.unsplash.com/photo-1518605368461-1ee12db0e181?q=80&w=2940&auto=format&fit=crop" 
            alt="Football Stadium" 
            className="w-full h-full object-cover object-center grayscale opacity-40 mix-blend-overlay"
          />
        </div>

        <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-12">
          {/* Top Badge */}
          <div className="inline-flex items-center justify-center animate-fade-in-up">
            <div className="bg-emerald-900/80 backdrop-blur-sm border border-emerald-700/50 px-6 py-2 rounded-full mb-8 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
              <span className="text-amber-400 font-bold text-xs sm:text-sm uppercase tracking-[0.2em]">Season 2026 Powered By SmartCity PLC</span>
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
            </div>
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter mb-6 leading-[1.05] drop-shadow-2xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Nigeria's Most <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-600">Exciting</span><br className="hidden md:block" />
            Grassroots League
          </h1>
          
          <p className="mt-6 max-w-3xl mx-auto text-lg md:text-2xl text-emerald-50/90 font-medium leading-relaxed mb-12 drop-shadow-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            SmartCity Osun State Football League — Where Talent Meets Opportunity.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link 
              to="/club-register" 
              className="w-full sm:w-auto px-10 py-5 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-black text-lg md:text-xl uppercase tracking-widest rounded-sm transition-all duration-300 transform hover:-translate-y-1 shadow-[0_0_40px_rgba(245,158,11,0.4)] flex items-center justify-center gap-3 border-b-4 border-amber-700 active:border-b-0 active:translate-y-1 group"
            >
              Register Your Club
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a 
              href="#about" 
              className="w-full sm:w-auto px-10 py-5 bg-transparent border-2 border-white hover:bg-white hover:text-emerald-950 text-white font-bold text-lg md:text-xl uppercase tracking-widest rounded-sm transition-all duration-300 flex items-center justify-center"
            >
              Learn More
            </a>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce hidden md:block">
          <a href="#stats" className="text-white/50 hover:text-amber-400 transition-colors">
            <div className="w-8 h-12 border-2 border-current rounded-full flex justify-center pt-2">
              <div className="w-1.5 h-3 bg-current rounded-full"></div>
            </div>
          </a>
        </div>
      </section>

      {/* Stats/Numbers Bar */}
      <section id="stats" className="bg-amber-500 border-y-4 border-emerald-950 relative z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x-0 md:divide-x divide-amber-600/30">
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-black text-emerald-950 mb-1">32+</p>
              <p className="text-emerald-900 font-bold uppercase tracking-widest text-xs md:text-sm">Clubs</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-black text-emerald-950 mb-1">4</p>
              <p className="text-emerald-900 font-bold uppercase tracking-widest text-xs md:text-sm">Conferences</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-black text-emerald-950 mb-1">11</p>
              <p className="text-emerald-900 font-bold uppercase tracking-widest text-xs md:text-sm">Match Grounds</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-black text-emerald-950 mb-1">400+</p>
              <p className="text-emerald-900 font-bold uppercase tracking-widest text-xs md:text-sm">Affiliated Clubs</p>
            </div>
          </div>
        </div>
      </section>

      {/* About the League */}
      <section id="about" className="py-24 bg-white relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-50/50 -skew-x-12 transform origin-top hidden lg:block"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="aspect-[4/5] bg-emerald-950 rounded-sm overflow-hidden relative shadow-2xl border-l-8 border-b-8 border-amber-500 p-2">
                <div className="absolute inset-0 bg-emerald-900 mix-blend-overlay z-10 opacity-60"></div>
                <img 
                  src="/smartCityImage.jpg" 
                  alt="SmartCity Logo" 
                  className="w-full h-full object-contain p-8"
                />
                <div className="absolute bottom-8 left-8 right-8 z-20 bg-emerald-950/90 backdrop-blur-md p-6 border-l-4 border-amber-500">
                  <p className="text-white font-bold text-lg leading-snug">"Empowering the next generation of Nigerian football stars."</p>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-[radial-gradient(circle,_#10b981_2px,_transparent_2px)] bg-[size:10px_10px] opacity-20 -z-10"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[radial-gradient(circle,_#f59e0b_2px,_transparent_2px)] bg-[size:10px_10px] opacity-20 -z-10"></div>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 text-emerald-700 font-bold text-sm uppercase tracking-widest mb-4">
                <div className="w-8 h-1 bg-amber-500"></div>
                About The League
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-emerald-950 uppercase tracking-tighter mb-8 leading-[1.1]">
                Osun State's <br />
                <span className="text-amber-500">Premier</span> Grassroots<br /> Competition
              </h2>
              
              <div className="space-y-6 text-lg text-neutral-600 font-medium leading-relaxed">
                <p>
                  The SmartCity Osun State Football League is Osun State's premier grassroots football competition, launched in February 2024 under a landmark 5-year partnership by <span className="text-emerald-900 font-bold">SmartCity PLC</span> — an investment and infrastructure development company led by Sir Demola Aladekomo.
                </p>
                <p>
                  Sanctioned by the <span className="text-emerald-900 font-bold">Osun State Football Association</span> (established 1992), the league is built to professionalize grassroots football, create unmatched visibility for local talent, and connect Osun State clubs to national and global opportunities.
                </p>
                <div className="bg-emerald-50 border-l-4 border-emerald-600 p-6 my-8">
                  <p className="text-emerald-900 font-bold italic">
                    In 2026, the league was upgraded to a 12-team professional elite format, governed by an independent board, Technical Director, and COO to ensure UEFA/CAF-level standards.
                  </p>
                </div>
              </div>
              
              <div className="mt-10 flex gap-8 border-t border-neutral-200 pt-8">
                <div>
                  <p className="text-3xl font-black text-emerald-950">2024</p>
                  <p className="text-sm font-bold text-neutral-500 uppercase tracking-wider">Established</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-emerald-950">5-Year</p>
                  <p className="text-sm font-bold text-neutral-500 uppercase tracking-wider">Partnership</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-emerald-950">Elite</p>
                  <p className="text-sm font-bold text-neutral-500 uppercase tracking-wider">12-Team Format</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join the League — Feature Cards */}
      <section id="why-join" className="py-24 bg-neutral-100 relative border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
            <div className="inline-flex items-center justify-center gap-2 text-emerald-700 font-bold text-sm uppercase tracking-widest mb-4">
              <div className="w-4 h-1 bg-amber-500"></div>
              The SmartCity Advantage
              <div className="w-4 h-1 bg-amber-500"></div>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-emerald-950 uppercase tracking-tighter mb-6">
              Why Join The <span className="text-amber-500">League</span>
            </h2>
            <p className="text-xl text-neutral-600 font-medium">Elevating grassroots football through unparalleled structure, media exposure, and data-driven insights.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-sm shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100 hover:border-amber-400 hover:shadow-[0_8px_30px_rgba(245,158,11,0.1)] transition-all duration-300 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-[100px] -z-10 group-hover:bg-amber-50 transition-colors"></div>
              <div className="w-14 h-14 bg-emerald-950 text-amber-400 rounded-sm flex items-center justify-center mb-8 transform -skew-x-12 group-hover:scale-110 transition-transform">
                <Trophy size={28} className="skew-x-12" />
              </div>
              <h3 className="text-2xl font-black text-emerald-950 mb-4 uppercase tracking-tight">Professional Format</h3>
              <p className="text-neutral-600 leading-relaxed font-medium">A highly structured, elite 12-team competition format designed to mirror the standards of top-tier global football divisions.</p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-sm shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100 hover:border-amber-400 hover:shadow-[0_8px_30px_rgba(245,158,11,0.1)] transition-all duration-300 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-[100px] -z-10 group-hover:bg-amber-50 transition-colors"></div>
              <div className="w-14 h-14 bg-emerald-950 text-amber-400 rounded-sm flex items-center justify-center mb-8 transform -skew-x-12 group-hover:scale-110 transition-transform">
                <Radio size={28} className="skew-x-12" />
              </div>
              <h3 className="text-2xl font-black text-emerald-950 mb-4 uppercase tracking-tight">Live Match Coverage</h3>
              <p className="text-neutral-600 leading-relaxed font-medium">Unprecedented visibility with matches broadcasted live on Blackdrum TV and amplified across major social media networks.</p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-sm shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100 hover:border-amber-400 hover:shadow-[0_8px_30px_rgba(245,158,11,0.1)] transition-all duration-300 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-[100px] -z-10 group-hover:bg-amber-50 transition-colors"></div>
              <div className="w-14 h-14 bg-emerald-950 text-amber-400 rounded-sm flex items-center justify-center mb-8 transform -skew-x-12 group-hover:scale-110 transition-transform">
                <LineChart size={28} className="skew-x-12" />
              </div>
              <h3 className="text-2xl font-black text-emerald-950 mb-4 uppercase tracking-tight">Data & Analytics</h3>
              <p className="text-neutral-600 leading-relaxed font-medium">Powered by Ixzdore, access deep player statistics, heatmaps, and performance analytics to optimize tactics and scouting.</p>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-8 rounded-sm shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100 hover:border-amber-400 hover:shadow-[0_8px_30px_rgba(245,158,11,0.1)] transition-all duration-300 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-[100px] -z-10 group-hover:bg-amber-50 transition-colors"></div>
              <div className="w-14 h-14 bg-emerald-950 text-amber-400 rounded-sm flex items-center justify-center mb-8 transform -skew-x-12 group-hover:scale-110 transition-transform">
                <Users size={28} className="skew-x-12" />
              </div>
              <h3 className="text-2xl font-black text-emerald-950 mb-4 uppercase tracking-tight">Scout Exposure</h3>
              <p className="text-neutral-600 leading-relaxed font-medium">Direct access to an extensive network of national and international football scouts, agents, and talent spotters.</p>
            </div>

            {/* Card 5 */}
            <div className="bg-white p-8 rounded-sm shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100 hover:border-amber-400 hover:shadow-[0_8px_30px_rgba(245,158,11,0.1)] transition-all duration-300 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-[100px] -z-10 group-hover:bg-amber-50 transition-colors"></div>
              <div className="w-14 h-14 bg-emerald-950 text-amber-400 rounded-sm flex items-center justify-center mb-8 transform -skew-x-12 group-hover:scale-110 transition-transform">
                <PlaneTakeoff size={28} className="skew-x-12" />
              </div>
              <h3 className="text-2xl font-black text-emerald-950 mb-4 uppercase tracking-tight">Path to NNL</h3>
              <p className="text-neutral-600 leading-relaxed font-medium">Clear, defined progression pathways and transfer opportunities facilitating movement to the Nigeria National League (NNL).</p>
            </div>

            {/* Card 6 */}
            <div className="bg-white p-8 rounded-sm shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100 hover:border-amber-400 hover:shadow-[0_8px_30px_rgba(245,158,11,0.1)] transition-all duration-300 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-[100px] -z-10 group-hover:bg-amber-50 transition-colors"></div>
              <div className="w-14 h-14 bg-emerald-950 text-amber-400 rounded-sm flex items-center justify-center mb-8 transform -skew-x-12 group-hover:scale-110 transition-transform">
                <Handshake size={28} className="skew-x-12" />
              </div>
              <h3 className="text-2xl font-black text-emerald-950 mb-4 uppercase tracking-tight">Sponsorship Access</h3>
              <p className="text-neutral-600 leading-relaxed font-medium">Leverage our platform to connect with private sector investments, securing vital sponsorships for your club's growth.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works — Step by Step */}
      <section id="how-it-works" className="py-24 bg-emerald-950 relative border-t-4 border-amber-500 overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjE1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter mb-6">
              How It <span className="text-amber-500">Works</span>
            </h2>
            <p className="text-xl text-emerald-100 font-medium">Your journey to the elite stage begins here. A streamlined path to professional football.</p>
          </div>

          <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-emerald-800 -translate-y-1/2 z-0"></div>
            
            <div className="grid lg:grid-cols-5 gap-8 lg:gap-4 relative z-10">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 bg-emerald-900 border-4 border-emerald-800 rounded-full flex items-center justify-center mb-6 group-hover:border-amber-400 group-hover:bg-emerald-800 transition-all duration-300 shadow-xl relative">
                  <span className="text-3xl font-black text-amber-400">1</span>
                  <div className="absolute -inset-2 rounded-full border-2 border-amber-400 opacity-0 group-hover:opacity-100 group-hover:animate-ping"></div>
                </div>
                <h4 className="text-xl font-black text-white uppercase tracking-wide mb-2">Register Your Club</h4>
                <p className="text-emerald-200/80 text-sm font-medium">Complete the online portal application</p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center group mt-8 lg:mt-0">
                <div className="w-20 h-20 bg-emerald-900 border-4 border-emerald-800 rounded-full flex items-center justify-center mb-6 group-hover:border-amber-400 group-hover:bg-emerald-800 transition-all duration-300 shadow-xl relative">
                  <span className="text-3xl font-black text-amber-400">2</span>
                  <div className="absolute -inset-2 rounded-full border-2 border-amber-400 opacity-0 group-hover:opacity-100 group-hover:animate-ping"></div>
                </div>
                <h4 className="text-xl font-black text-white uppercase tracking-wide mb-2">Get Verified</h4>
                <p className="text-emerald-200/80 text-sm font-medium">Approval by the Osun State FA</p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center group mt-8 lg:mt-0">
                <div className="w-20 h-20 bg-emerald-900 border-4 border-emerald-800 rounded-full flex items-center justify-center mb-6 group-hover:border-amber-400 group-hover:bg-emerald-800 transition-all duration-300 shadow-xl relative">
                  <span className="text-3xl font-black text-amber-400">3</span>
                  <div className="absolute -inset-2 rounded-full border-2 border-amber-400 opacity-0 group-hover:opacity-100 group-hover:animate-ping"></div>
                </div>
                <h4 className="text-xl font-black text-white uppercase tracking-wide mb-2">Join Conference</h4>
                <p className="text-emerald-200/80 text-sm font-medium">Drafted into 1 of 4 regional conferences</p>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center text-center group mt-8 lg:mt-0">
                <div className="w-20 h-20 bg-emerald-900 border-4 border-emerald-800 rounded-full flex items-center justify-center mb-6 group-hover:border-amber-400 group-hover:bg-emerald-800 transition-all duration-300 shadow-xl relative">
                  <span className="text-3xl font-black text-amber-400">4</span>
                  <div className="absolute -inset-2 rounded-full border-2 border-amber-400 opacity-0 group-hover:opacity-100 group-hover:animate-ping"></div>
                </div>
                <h4 className="text-xl font-black text-white uppercase tracking-wide mb-2">Compete Weekly</h4>
                <p className="text-emerald-200/80 text-sm font-medium">Live matches & intensive league fixtures</p>
              </div>

              {/* Step 5 */}
              <div className="flex flex-col items-center text-center group mt-8 lg:mt-0">
                <div className="w-20 h-20 bg-emerald-900 border-4 border-emerald-800 rounded-full flex items-center justify-center mb-6 group-hover:border-amber-400 group-hover:bg-emerald-800 transition-all duration-300 shadow-xl relative">
                  <span className="text-3xl font-black text-amber-400">5</span>
                  <div className="absolute -inset-2 rounded-full border-2 border-amber-400 opacity-0 group-hover:opacity-100 group-hover:animate-ping"></div>
                </div>
                <h4 className="text-xl font-black text-white uppercase tracking-wide mb-2">Get Discovered</h4>
                <p className="text-emerald-200/80 text-sm font-medium">Scouting, transfers, and national glory</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial/Quote Section */}
      <section className="py-24 bg-white border-y border-neutral-200 relative overflow-hidden">
        {/* Large faint quote mark background */}
        <div className="absolute -top-10 left-10 text-emerald-50 opacity-50 select-none">
          <Quote size={300} />
        </div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-10 text-amber-500">
            <Quote size={40} />
          </div>
          
          <blockquote className="text-3xl md:text-4xl lg:text-5xl font-black text-emerald-950 leading-tight uppercase tracking-tight mb-12">
            "I am excited by what is going on in Osun State… I recommend this model to all other States in the Federation."
          </blockquote>
          
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-1 bg-amber-500 mb-6"></div>
            <p className="text-xl font-bold text-emerald-900 uppercase tracking-widest">Alhaji Ibrahim Musa Gusau</p>
            <p className="text-neutral-500 font-medium">President, Nigeria Football Federation (NFF)</p>
          </div>
        </div>
      </section>

      {/* Register Your Club — CTA Section */}
      <section id="contact" className="py-24 bg-emerald-900 relative overflow-hidden">
        {/* Dynamic Abstract Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/30 via-emerald-900 to-emerald-950"></div>
          {/* Angled stripes */}
          <div className="absolute -inset-20 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #10b981 0, #10b981 2px, transparent 2px, transparent 12px)' }}></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-emerald-950/40 backdrop-blur-md p-10 md:p-16 rounded-sm border border-emerald-800 shadow-2xl">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter mb-6">
            Ready to Compete at the <span className="text-amber-400">Highest Level?</span>
          </h2>
          <p className="text-xl md:text-2xl text-emerald-100 mb-12 font-medium leading-relaxed max-w-3xl mx-auto">
            Register your club today and be part of the league that is redefining grassroots football in Nigeria.
          </p>
          <div className="flex justify-center">
            <Link 
              to="/club-register" 
              className="w-full sm:w-auto px-12 py-6 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-black text-xl md:text-2xl uppercase tracking-widest rounded-sm transition-all duration-300 transform hover:-translate-y-1 shadow-[0_0_40px_rgba(245,158,11,0.5)] flex items-center justify-center border-b-4 border-amber-700 active:border-b-0 active:translate-y-1 group"
            >
              Register Your Club for SmartCity
              <ChevronRight size={28} className="ml-2 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-emerald-950 pt-20 pb-8 border-t-8 border-amber-500 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            
            {/* Branding */}
            <div className="lg:col-span-2 flex flex-col items-start gap-6">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-2 border-amber-300 overflow-hidden p-1">
                  <img src="/smartCityImage.jpg" alt="SmartCity Logo" className="w-full h-full object-contain rounded-full" />
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-black tracking-tighter text-white uppercase leading-none">
                    Smart<span className="text-amber-500">City</span>
                  </span>
                  <span className="text-[0.7rem] font-bold text-emerald-300 uppercase tracking-widest leading-none mt-1">
                    Osun State Football League
                  </span>
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <p className="text-white font-bold tracking-widest text-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                  POWERED BY SMARTCITY PLC
                </p>
                <p className="text-emerald-400 font-bold tracking-widest text-xs flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                  IN PARTNERSHIP WITH OSUN STATE FA
                </p>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-black uppercase tracking-widest mb-6 border-b-2 border-emerald-800 pb-2 inline-block">Quick Links</h4>
              <ul className="space-y-4">
                <li><a href="#home" className="text-emerald-200 hover:text-amber-400 font-medium uppercase tracking-wide text-sm transition-colors flex items-center gap-2"><ChevronRight size={14}/> Home</a></li>
                <li><a href="#about" className="text-emerald-200 hover:text-amber-400 font-medium uppercase tracking-wide text-sm transition-colors flex items-center gap-2"><ChevronRight size={14}/> About</a></li>
                <li><Link to="/club-register" className="text-emerald-200 hover:text-amber-400 font-medium uppercase tracking-wide text-sm transition-colors flex items-center gap-2"><ChevronRight size={14}/> Register</Link></li>
                <li><a href="#contact" className="text-emerald-200 hover:text-amber-400 font-medium uppercase tracking-wide text-sm transition-colors flex items-center gap-2"><ChevronRight size={14}/> Contact</a></li>
              </ul>
            </div>
            
            {/* Socials */}
            <div>
              <h4 className="text-white font-black uppercase tracking-widest mb-6 border-b-2 border-emerald-800 pb-2 inline-block">Connect</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-sm bg-emerald-900 border border-emerald-800 flex items-center justify-center text-emerald-400 hover:text-emerald-950 hover:bg-amber-500 hover:border-amber-400 hover:scale-110 transition-all duration-300">
                  <Twitter size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-sm bg-emerald-900 border border-emerald-800 flex items-center justify-center text-emerald-400 hover:text-emerald-950 hover:bg-amber-500 hover:border-amber-400 hover:scale-110 transition-all duration-300">
                  <Instagram size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-sm bg-emerald-900 border border-emerald-800 flex items-center justify-center text-emerald-400 hover:text-emerald-950 hover:bg-amber-500 hover:border-amber-400 hover:scale-110 transition-all duration-300">
                  <Facebook size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-sm bg-emerald-900 border border-emerald-800 flex items-center justify-center text-emerald-400 hover:text-emerald-950 hover:bg-amber-500 hover:border-amber-400 hover:scale-110 transition-all duration-300">
                  <Youtube size={18} />
                </a>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-emerald-900 flex flex-col md:flex-row justify-between items-center gap-4 text-emerald-600 text-sm font-bold uppercase tracking-widest">
            <p>&copy; {new Date().getFullYear()} SmartCity Osun State Football League.</p>
            <p>All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

