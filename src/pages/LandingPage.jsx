import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Menu, X, ChevronRight, Trophy, Users, ShieldCheck, Target, 
  CalendarDays, Clock, MapPin, Phone, Mail, Camera, ArrowRight, 
  CheckCircle2, Sparkles, Shield, Radio, LineChart, PlaneTakeoff, 
  Handshake, UserCog, Facebook, Twitter, Instagram, Youtube, Award,
  ExternalLink, Play
} from 'lucide-react';
import { BACKEND_URL } from '../config';

export function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const defaultMatches = [
    {
      id: "m1",
      homeTeam: "Osogbo United FC",
      awayTeam: "Ife City Royals",
      homeLogo: "🛡️",
      awayLogo: "👑",
      homeScore: null,
      awayScore: null,
      status: "Scheduled",
      date: "Oct 24, 2026",
      time: "15:00 WAT",
      venue: "Osogbo City Stadium",
      type: "State FA Cup Final"
    },
    {
      id: "m2",
      homeTeam: "Ilesa Warriors FC",
      awayTeam: "Ede City Strikers",
      homeLogo: "⚔️",
      awayLogo: "🦁",
      homeScore: null,
      awayScore: null,
      status: "Scheduled",
      date: "Oct 28, 2026",
      time: "16:00 WAT",
      venue: "Ilesa Township Stadium",
      type: "Conference Matchday 12"
    },
    {
      id: "m3",
      homeTeam: "Olorunda Stars",
      awayTeam: "Ikire Dynamos FC",
      homeLogo: "⭐",
      awayLogo: "⚡",
      homeScore: null,
      awayScore: null,
      status: "Scheduled",
      date: "Nov 2, 2026",
      time: "14:00 WAT",
      venue: "Olorunda Arena",
      type: "Conference Matchday 13"
    }
  ];

  const [fixtures, setFixtures] = useState(defaultMatches);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchLatestMatches = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/matches`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.matches && data.matches.length > 0) {
            const latest3 = data.matches.slice(0, 3).map((m, idx) => ({
              id: m._id || idx,
              homeTeam: m.homeTeamName || "Home Team",
              awayTeam: m.awayTeamName || "Away Team",
              homeLogo: m.homeTeamLogo || "🛡️",
              awayLogo: m.awayTeamLogo || "👑",
              homeScore: m.homeScore,
              awayScore: m.awayScore,
              status: m.status || "Scheduled",
              date: m.matchDate ? new Date(m.matchDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Upcoming",
              time: m.matchTime || "16:00 WAT",
              venue: m.venue || "Osogbo City Stadium",
              type: m.stage || (m.group ? `Conference Group ${m.group}` : "League Matchday")
            }));
            setFixtures(latest3);
          }
        }
      } catch (err) {
        // Fall back gracefully to default latest 3 fixtures
      }
    };
    fetchLatestMatches();
  }, []);

  const marqueeNews = [
    "🔥 2026 REGISTRATION: SmartCity Football League club intake is now officially open.",
    "🏆 MATCH CENTER: Real-time scores and tournament stats available on Live Score Hub.",
    "⚽ NEW INITIATIVE: Grassroots coaching clinic & referee development clinic in session.",
    "🏟️ VENUES: Osogbo City Stadium, Ilesa Township Stadium & conference grounds confirmed.",
    "📢 NOTICE: Verified player digital licensing & anti-fraud squad rosters enforced."
  ];

  const scrollItems = [...marqueeNews, ...marqueeNews];

  const featuresList = [
    {
      id: "f1",
      category: "PORTAL AUTOMATION",
      title: "Digital Club & Player Registration",
      desc: "Streamlined online squad registration, document validation, player profile intake, and digital approval workflows.",
      badge: "Self-Service",
      link: "/club-register"
    },
    {
      id: "f2",
      category: "TOURNAMENT HUB",
      title: "Live Match Center & Real-Time Stats",
      desc: "Live scores, match event logging, conference tables, and public tournament brackets updated in real-time.",
      badge: "Live Scored",
      link: "/livescore"
    },
    {
      id: "f3",
      category: "OFFICIAL PORTAL",
      title: "Referee Match Reporting & Integrity",
      desc: "Dedicated digital interface for accredited referees to record goals, cautions, substitutions, and submit post-match sheets.",
      badge: "FA Sanctioned",
      link: "/referee"
    },
    {
      id: "f4",
      category: "SECURITY & COMPLIANCE",
      title: "Automated Printable Accreditation Cards",
      desc: "Automated instant ID passes and printable membership credentials for club executives, players, and match commissioners.",
      badge: "Verified Pass",
      link: "/club-login"
    }
  ];

  const aboutFeatures = [
    {
      icon: <Users className="w-8 h-8 text-[#e5a823]" />,
      title: "Grassroots Development",
      description: "Nurturing local talent across Osun State to build future champions and provide youth with positive pathways."
    },
    {
      icon: <Trophy className="w-8 h-8 text-[#00ff88]" />,
      title: "Premier Competitions",
      description: "Organizing state leagues, cups, and tournaments that showcase the vibrant football culture of Osun State."
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-[#e5a823]" />,
      title: "Integrity & Fair Play",
      description: "Upholding the highest standards of governance, refereeing, and sportsmanship in every single match."
    },
    {
      icon: <Target className="w-8 h-8 text-[#00ff88]" />,
      title: "Coaching Excellence",
      description: "Providing world-class training and licensing for coaches to elevate the tactical quality of the game."
    }
  ];



  const galleryImages = [
    {
      id: 1,
      color: "bg-[#0b6e4f]",
      label: "Osun FA Cup Final 2025",
      span: "md:col-span-2 md:row-span-2",
      accent: "from-emerald-600/90 to-emerald-950/90"
    },
    {
      id: 2,
      color: "bg-[#b8860b]",
      label: "Grassroots Training Clinic",
      span: "md:col-span-1 md:row-span-1",
      accent: "from-amber-600/90 to-amber-950/90"
    },
    {
      id: 3,
      color: "bg-[#131815]",
      label: "Referee Clinic & Certification",
      span: "md:col-span-1 md:row-span-1",
      accent: "from-neutral-800/90 to-neutral-950/90"
    },
    {
      id: 4,
      color: "bg-[#013618]",
      label: "Youth League Kickoff",
      span: "md:col-span-2 md:row-span-1",
      accent: "from-emerald-700/90 to-black/90"
    },
  ];

  const sponsors = [
    { name: "SmartCity PLC", type: "Principal Title Sponsor", logo: "/partners/smartcity-plc.png" },
    { name: "Osun State Government", type: "State Partner", logo: "/partners/osun-state-government.png" },
    { name: "Lanreleke Sports Academy", type: "Technical Partner", logo: "/partners/lanreleke-sports-academy.png" },
    { name: "Perculia Ultimate Concerns Limited", type: "Corporate Partner", logo: "/partners/perculia-ultimate-concerns-limited.png" },
    { name: "Armstrong Paint", type: "Official Partner", logo: "/partners/armstrong.png" },
  ];

  return (
    <div className="bg-[#0a0d0b] text-white min-h-screen font-sans selection:bg-[#00ff88] selection:text-[#013618] flex flex-col overflow-x-hidden">
      
      {/* ============================================================== */}
      {/* 1. TOPBAR & NAVIGATION                                         */}
      {/* ============================================================== */}
      <nav className="fixed top-0 left-0 w-full z-50 flex flex-col transition-all duration-300 shadow-xl">
        {/* Topbar: Contact & Socials */}
        <div className="hidden lg:block bg-[#013618] text-gray-300 py-2 border-b border-white/5 text-xs font-semibold tracking-wide">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-2 xl:flex-row xl:justify-between xl:items-center">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <div className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer min-w-0">
                <MapPin className="w-3.5 h-3.5 text-[#e5a823]" />
                <span className="truncate">SmartCity Secretariat, Osogbo City Stadium, Osun State</span>
              </div>
              <div className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer min-w-0">
                <Phone className="w-3.5 h-3.5 text-[#e5a823]" />
                <span className="truncate">+234 (0) 800 123 4567</span>
              </div>
              <div className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer min-w-0">
                <Mail className="w-3.5 h-3.5 text-[#e5a823]" />
                <span className="truncate">info@smartcityleague.ng</span>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-[10px] uppercase text-gray-400 tracking-wider">Follow Us:</span>
              <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="hover:text-[#00ff88] transition-colors"><Facebook className="w-4 h-4" /></a>
              <a href="https://x.com" target="_blank" rel="noreferrer" className="hover:text-[#00ff88] transition-colors"><Twitter className="w-4 h-4" /></a>
              <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#00ff88] transition-colors"><Instagram className="w-4 h-4" /></a>
              <a href="https://www.youtube.com" target="_blank" rel="noreferrer" className="hover:text-[#00ff88] transition-colors"><Youtube className="w-4 h-4" /></a>

              <div className="h-4 w-px bg-white/20 mx-2"></div>
              
              <Link to="/admin" className="flex items-center gap-1.5 hover:text-[#00ff88] transition-colors group">
                <UserCog className="w-3.5 h-3.5 text-[#e5a823] group-hover:text-[#00ff88] transition-colors" />
                <span className="uppercase text-[11px] font-bold tracking-wider text-gray-200">Admin Login</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className={`text-white border-b border-white/10 w-full transition-all duration-300 ${scrolled ? 'bg-black/95 backdrop-blur-xl shadow-xl' : 'bg-[#0a0d0b]'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
              
              {/* Logo & Brand Name */}
              <div className="shrink-0">
                <Link to="/" className="flex items-center gap-3 group">
                  <div className="w-11 h-11 sm:w-13 sm:h-13 bg-white rounded-full flex items-center justify-center border-2 border-[#e5a823] p-1 shadow-[0_0_20px_rgba(229,168,35,0.4)] group-hover:scale-105 transition-transform overflow-hidden">
                    <img 
                      src="/smartCityImage.jpg" 
                      alt="SmartCity Logo" 
                      className="w-full h-full object-contain rounded-full" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-xl sm:text-2xl tracking-tight leading-none text-white uppercase">
                      Smart<span className="text-[#e5a823]">City</span>
                    </span>
                    <span className="text-[10px] sm:text-xs font-bold text-[#00ff88] tracking-widest uppercase mt-0.5">
                      Osun State Football League
                    </span>
                  </div>
                </Link>
              </div>

              {/* Desktop Menu Links */}
              <div className="hidden lg:flex items-center space-x-7">
                <a href="#home" className="hover:text-[#00ff88] text-sm font-semibold tracking-wider uppercase transition-colors">
                  Home
                </a>
                <a href="#about" className="hover:text-[#00ff88] text-sm font-semibold tracking-wider uppercase transition-colors">
                  About
                </a>
                <a href="#matches" className="hover:text-[#00ff88] text-sm font-semibold tracking-wider uppercase transition-colors">
                  Match Center
                </a>
                <a href="#features" className="hover:text-[#00ff88] text-sm font-semibold tracking-wider uppercase transition-colors">
                  Latest Features
                </a>
                <a href="#partners" className="hover:text-[#00ff88] text-sm font-semibold tracking-wider uppercase transition-colors">
                  Partners
                </a>
              </div>

              {/* Desktop CTA Action Buttons */}
              <div className="hidden lg:flex items-center gap-3">
                <Link
                  to="/club-login"
                  className="text-sm font-bold text-gray-300 hover:text-white px-4 py-2 uppercase tracking-wider transition-colors"
                >
                  Club Login
                </Link>
                <Link
                  to="/club-register"
                  className="bg-[#00ff88] text-[#013618] hover:bg-[#e5a823] font-black px-6 py-2.5 rounded-full text-xs uppercase tracking-wider transition-all duration-300 transform hover:-translate-y-0.5 shadow-[0_0_20px_rgba(0,255,136,0.35)]"
                >
                  Register Club
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <div className="flex lg:hidden">
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Toggle menu"
                >
                  {isMenuOpen ? <X className="w-7 h-7 text-[#00ff88]" /> : <Menu className="w-7 h-7" />}
                </button>
              </div>

            </div>
          </div>

          {/* Mobile Drawer */}
          {isMenuOpen && (
            <div className="lg:hidden bg-[#0d120f] border-t border-white/10 px-4 py-6 space-y-4 shadow-2xl">
              <div className="space-y-1">
                <a 
                  href="#home" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-lg text-base font-semibold text-gray-200 hover:bg-[#013618] hover:text-[#00ff88]"
                >
                  Home
                </a>
                <a 
                  href="#about" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-lg text-base font-semibold text-gray-200 hover:bg-[#013618] hover:text-[#00ff88]"
                >
                  About Association
                </a>
                <a 
                  href="#matches" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-lg text-base font-semibold text-gray-200 hover:bg-[#013618] hover:text-[#00ff88]"
                >
                  Match Center
                </a>
                <a 
                  href="#features" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-lg text-base font-semibold text-gray-200 hover:bg-[#013618] hover:text-[#00ff88]"
                >
                  Latest Features
                </a>
                <a 
                  href="#partners" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-lg text-base font-semibold text-gray-200 hover:bg-[#013618] hover:text-[#00ff88]"
                >
                  Partners
                </a>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-2">
                <Link
                  to="/club-register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full py-3 text-center bg-[#00ff88] text-[#013618] font-black rounded-lg uppercase tracking-wider text-sm shadow-md"
                >
                  Register Your Club
                </Link>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link
                    to="/club-login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2.5 text-center bg-white/5 border border-white/10 text-white font-bold rounded-lg text-xs uppercase tracking-wider"
                  >
                    Club Login
                  </Link>
                  <Link
                    to="/livescore"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2.5 text-center bg-white/5 border border-white/10 text-[#e5a823] font-bold rounded-lg text-xs uppercase tracking-wider"
                  >
                    Live Score Hub
                  </Link>
                </div>
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-2 text-center text-xs text-gray-400 hover:text-white uppercase tracking-wider"
                >
                  Admin Supervision Portal
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ============================================================== */}
      {/* 2. MARQUEE BANNER                                              */}
      {/* ============================================================== */}
      <div className="bg-[#013618] mt-16 sm:mt-20 lg:mt-[116px] text-white h-11 sm:h-12 border-y border-[#00ff88]/30 overflow-hidden relative flex items-center w-full z-20 shadow-xl">
        <div className="absolute left-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-r from-[#013618] to-transparent pointer-events-none"></div>

        <div className="flex-shrink-0 h-full px-4 sm:px-5 bg-[#00ff88] text-[#013618] font-black text-xs sm:text-sm z-20 uppercase tracking-wider flex items-center gap-2 shadow-md">
          <span className="w-2 h-2 rounded-full bg-[#013618] animate-ping"></span>
          Live Updates
        </div>

        <div className="flex whitespace-nowrap overflow-hidden items-center group w-full flex-1">
          <div 
            className="flex animate-marquee group-hover:[animation-play-state:paused] items-center"
            style={{ animationDuration: '40s' }}
          >
            {scrollItems.map((item, index) => (
              <div key={index} className="flex items-center">
                <span className="mx-6 sm:mx-8 text-xs sm:text-sm font-semibold tracking-wide text-gray-100">{item}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#e5a823] mx-2 opacity-80 shrink-0"></span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 z-10 bg-gradient-to-l from-[#013618] to-transparent pointer-events-none"></div>
      </div>

      {/* ============================================================== */}
      {/* 3. HERO SECTION (WITH LATEST FEATURES WIDGET)                  */}
      {/* ============================================================== */}
      <section id="home" className="relative pt-8 sm:pt-14 pb-20 lg:pt-20 lg:pb-32 overflow-hidden bg-[#131815] text-white">
        
        {/* Dynamic Background Elements */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat top-0 left-0 w-full h-full overflow-hidden z-0"
          style={{ backgroundImage: "url('/bg-image.png')" }}
        >
          {/* Athletic Image Background with Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#131815] via-[#131815]/85 to-[#131815]/40"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#131815]/60 to-[#131815]"></div>

          {/* Abstract pattern overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>

          {/* Brand color glows */}
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#025928] rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#00ff88] rounded-full mix-blend-screen filter blur-[120px] opacity-20"></div>
          <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-[#e5a823] rounded-full mix-blend-screen filter blur-[90px] opacity-20"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Column: Association & League Info */}
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[#00ff88] text-xs sm:text-sm font-semibold tracking-wide uppercase backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-ping"></span>
                The Pulse of SmartCity Football
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
                Elevating <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] via-[#e5a823] to-[#0d8442]">
                  Football Excellence
                </span>
                <br /> In Osun State
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-2xl leading-relaxed">
                Dedicated to governing, developing, and promoting grassroots football across all levels in Osun State under a premier elite format powered by SmartCity PLC in partnership with Osun State FA. From local academies to national scouts, we nurture talent and build a stronger football community.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  to="/club-register"
                  className="inline-flex justify-center items-center gap-2 bg-[#00ff88] text-[#013618] font-black px-8 py-4 rounded-full hover:bg-[#e5a823] hover:shadow-[0_0_25px_rgba(229,168,35,0.45)] transition-all duration-300 transform hover:-translate-y-1 text-base uppercase tracking-wider"
                >
                  Register Your Club
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  to="/livescore"
                  className="inline-flex justify-center items-center gap-2 bg-transparent text-white border-2 border-white/20 hover:border-[#00ff88] hover:text-[#00ff88] font-bold px-8 py-4 rounded-full transition-all duration-300 text-base uppercase tracking-wider"
                >
                  <Play className="w-4 h-4 fill-current text-[#00ff88]" />
                  Tournament Hub
                </Link>
              </div>

              {/* Quick stats mini row */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 max-w-lg">
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-[#e5a823]">32+</p>
                  <p className="text-xs uppercase text-gray-400 font-bold tracking-wider">Registered Clubs</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-[#00ff88]">4</p>
                  <p className="text-xs uppercase text-gray-400 font-bold tracking-wider">Conferences</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-white">100%</p>
                  <p className="text-xs uppercase text-gray-400 font-bold tracking-wider">Digital Scoring</p>
                </div>
              </div>
            </div>

            {/* Right Column: Latest Features Widget (Changed from Latest Updates) */}
            <div className="lg:col-span-5" id="features">
              <div className="bg-[#0a0d0b]/80 backdrop-blur-xl rounded-2xl p-6 lg:p-8 shadow-2xl border border-white/10 relative overflow-hidden group">
                {/* Glow accent */}
                <div className="absolute top-0 right-0 w-36 h-36 bg-[#e5a823] opacity-15 rounded-full filter blur-2xl group-hover:opacity-25 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 w-36 h-36 bg-[#00ff88] opacity-10 rounded-full filter blur-2xl pointer-events-none"></div>

                <div className="flex justify-between items-end mb-6 border-b border-white/10 pb-4 relative z-10">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
                      Latest Features
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff88] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00ff88]"></span>
                      </span>
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-400 mt-1">Key digital innovations powering SmartCity League</p>
                  </div>
                  <Link to="/livescore" className="text-xs sm:text-sm text-[#00ff88] hover:text-[#e5a823] flex items-center gap-1 transition-colors cursor-pointer font-bold uppercase tracking-wider">
                    Explore <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Features List */}
                <div className="space-y-4 relative z-10">
                  {featuresList.map((item) => (
                    <Link
                      key={item.id}
                      to={item.link}
                      className="block p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-[#00ff88]/30 transition-all duration-300 group/feature"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold text-[#e5a823] uppercase tracking-wider">
                          {item.category}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00ff88]/15 text-[#00ff88] border border-[#00ff88]/30">
                          {item.badge}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white group-hover/feature:text-[#00ff88] transition-colors leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
                        {item.desc}
                      </p>
                    </Link>
                  ))}
                </div>

                {/* Widget Footer Action */}
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs relative z-10">
                  <span className="text-gray-400">Ready to enter your squad?</span>
                  <Link to="/club-register" className="font-bold text-[#e5a823] hover:text-white flex items-center gap-1 transition-colors uppercase tracking-wider">
                    Start Intake <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. ABOUT SECTION                                               */}
      {/* ============================================================== */}
      <section id="about" className="py-24 bg-white text-gray-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">

            {/* Text Content */}
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 mb-4 text-[#025928] font-bold uppercase tracking-wider text-sm">
                <span className="w-8 h-1 bg-[#e5a823] rounded-full"></span>
                About SmartCity Football League
              </div>

              <h2 className="text-4xl md:text-5xl font-extrabold text-[#1f2937] mb-6 leading-tight">
                Driving the Passion of <span className="text-[#025928]">Osun Football</span>
              </h2>

              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                The SmartCity Osun State Football League is Osun State's premier football competition, operated in close collaboration with the official governing body — the Osun State Football Association (Osun FA).
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Under the landmark partnership with SmartCity PLC, we are transforming grassroots football by deploying modern digital club administration, transparent refereeing, live tournament scoring, and professional scouts connecting local players to international football.
              </p>

              <div className="flex items-center gap-4">
                <a 
                  href="#matches" 
                  className="inline-flex items-center gap-2 text-[#025928] hover:text-[#0d8442] font-bold text-lg group transition-colors"
                >
                  View League Fixtures
                  <span className="bg-[#025928]/10 group-hover:bg-[#025928]/20 p-2 rounded-full transition-colors">
                    <Trophy className="w-4 h-4 text-[#025928]" />
                  </span>
                </a>
                <Link 
                  to="/club-register" 
                  className="ml-4 inline-flex items-center gap-2 px-5 py-2.5 bg-[#e5a823] text-[#013618] font-bold text-sm rounded-lg hover:bg-amber-400 transition-colors uppercase tracking-wider"
                >
                  Register Team
                </Link>
              </div>
            </div>

            {/* Features 2x2 Grid */}
            <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {aboutFeatures.map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-[#f8faf9] p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#025928] to-[#e5a823] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#025928]/10 group-hover:bg-[#025928]/15 transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[#1f2937] mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. MATCH CENTER / UPCOMING MATCHES                             */}
      {/* ============================================================== */}
      <section id="matches" className="py-24 bg-[#131815] text-white relative border-t border-[#1f2924]">
        {/* Glow */}
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-[#025928] rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-[#00ff88] text-xs font-bold uppercase tracking-wider mb-3">
              <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-ping"></span>
              Latest 3 Match Fixtures
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              Match Center — <span className="text-[#e5a823]">Latest Fixtures</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg">
              Official schedule featuring the latest 3 fixtures and clashes across Osun State conferences and championships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {fixtures.slice(0, 3).map((match, idx) => (
              <div 
                key={match.id || idx} 
                className="bg-[#0a0d0b]/80 backdrop-blur-md rounded-2xl p-6 border border-white/5 hover:border-[#00ff88]/40 transition-all duration-300 group shadow-xl flex flex-col justify-between hover:-translate-y-1"
              >
                <div>
                  <div className="flex justify-between items-center mb-6 text-xs text-gray-400 font-semibold tracking-wide uppercase">
                    <span className="bg-[#025928]/30 text-[#00ff88] px-3 py-1 rounded-full border border-[#00ff88]/20">
                      {match.type}
                    </span>
                    {match.status === "Live" ? (
                      <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full flex items-center gap-1.5 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
                        LIVE
                      </span>
                    ) : match.status === "Completed" ? (
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full font-bold">
                        FULL TIME
                      </span>
                    ) : (
                      <span className="bg-[#e5a823]/20 text-[#e5a823] border border-[#e5a823]/30 px-3 py-1 rounded-full font-bold">
                        UPCOMING
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center mb-8">
                    <div className="text-center flex-1">
                      <div className="w-16 h-16 mx-auto bg-gray-900 rounded-full flex items-center justify-center text-3xl mb-3 shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-gray-700 group-hover:border-[#e5a823] transition-colors overflow-hidden">
                        {match.homeLogo && typeof match.homeLogo === 'string' && (match.homeLogo.startsWith('http') || match.homeLogo.startsWith('/')) ? (
                          <img src={match.homeLogo} alt={match.homeTeam} className="w-full h-full object-contain p-1.5 rounded-full" />
                        ) : (
                          <span>{match.homeLogo || "🛡️"}</span>
                        )}
                      </div>
                      <h4 className="font-bold text-base sm:text-lg leading-tight line-clamp-1">{match.homeTeam}</h4>
                    </div>

                    <div className="px-4 text-center">
                      {match.status === "Live" || match.status === "Completed" ? (
                        <div className="flex flex-col items-center">
                          <span className="text-2xl font-black text-[#00ff88] tracking-wider">
                            {match.homeScore ?? 0} - {match.awayScore ?? 0}
                          </span>
                          <span className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">Score</span>
                        </div>
                      ) : (
                        <span className="text-2xl font-black text-gray-500 italic">VS</span>
                      )}
                    </div>

                    <div className="text-center flex-1">
                      <div className="w-16 h-16 mx-auto bg-gray-900 rounded-full flex items-center justify-center text-3xl mb-3 shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-gray-700 group-hover:border-[#00ff88] transition-colors overflow-hidden">
                        {match.awayLogo && typeof match.awayLogo === 'string' && (match.awayLogo.startsWith('http') || match.awayLogo.startsWith('/')) ? (
                          <img src={match.awayLogo} alt={match.awayTeam} className="w-full h-full object-contain p-1.5 rounded-full" />
                        ) : (
                          <span>{match.awayLogo || "👑"}</span>
                        )}
                      </div>
                      <h4 className="font-bold text-base sm:text-lg leading-tight line-clamp-1">{match.awayTeam}</h4>
                    </div>
                  </div>

                  <div className="space-y-3 pt-6 border-t border-white/10">
                    <div className="flex items-center text-sm text-gray-300 gap-3">
                      <CalendarDays className="w-5 h-5 text-[#e5a823]" />
                      <span>{match.date}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-300 gap-3">
                      <Clock className="w-5 h-5 text-[#e5a823]" />
                      <span>{match.time}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-300 gap-3">
                      <MapPin className="w-5 h-5 text-[#e5a823]" />
                      <span className="truncate">{match.venue}</span>
                    </div>
                  </div>
                </div>

                <Link 
                  to="/livescore"
                  className="w-full mt-6 py-3 rounded-lg bg-white/5 hover:bg-[#025928] text-white font-semibold transition-colors duration-300 flex justify-center items-center gap-2 group-hover:text-white text-sm uppercase tracking-wider"
                >
                  <Play className="w-4 h-4 fill-current text-[#00ff88]" />
                  Open Live Match Hub
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/livescore"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-[#00ff88] text-[#00ff88] hover:bg-[#00ff88] hover:text-[#013618] font-bold uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(0,255,136,0.2)]"
            >
              Full Tournament Hub & Standings
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. MOMENTS CAPTURED (GALLERY SECTION)                          */}
      {/* ============================================================== */}
      <section className="py-24 bg-white text-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div className="mb-6 md:mb-0">
              <div className="inline-flex items-center gap-2 text-[#025928] font-bold text-xs uppercase tracking-widest mb-2">
                <Camera className="w-4 h-4" />
                Visual Tournament Archive
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-[#1f2937] mb-4">
                Moments <span className="text-[#025928] italic">Captured</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-xl">
                Highlights from our championship matches, youth clinics, referee trainings, and community excitement across Osun State.
              </p>
            </div>
            
            <Link 
              to="/livescore"
              className="inline-flex items-center gap-2 bg-[#1f2937] text-white px-6 py-3 rounded-full hover:bg-[#025928] font-bold transition-colors text-sm uppercase tracking-wider"
            >
              View Match Highlights
              <Camera className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-[550px]">
            {galleryImages.map((img) => (
              <div
                key={img.id}
                className={`relative rounded-2xl overflow-hidden group shadow-md hover:shadow-2xl transition-all duration-300 ${img.span} ${img.color} flex items-center justify-center`}
              >
                {/* Background overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-t ${img.accent} opacity-80 group-hover:opacity-95 transition-opacity duration-300 flex items-end p-6`}>
                  <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="text-[#00ff88] text-xs font-bold uppercase tracking-wider block mb-1">
                      SmartCity League Archive
                    </span>
                    <span className="text-white font-black text-xl md:text-2xl drop-shadow-md">
                      {img.label}
                    </span>
                  </div>
                </div>

                <Camera className="w-16 h-16 text-white/10 group-hover:scale-110 transition-transform" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 7. PROUD PARTNERS & SPONSORS SECTION                           */}
      {/* ============================================================== */}
      <section id="partners" className="py-20 bg-[#f8faf9] text-gray-900 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-widest text-[#025928] uppercase">
              Our Proud Partners & Sponsors
            </span>
            <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-[#1f2937]">
              Empowering Osun Football
            </h2>
            <p className="text-sm md:text-base text-gray-600 max-w-xl mx-auto mt-2">
              Backed by visionary corporate leaders and state athletic authorities.
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14">
            {sponsors.map((sponsor, idx) => (
              <div 
                key={idx} 
                className="group flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 hover:border-[#e5a823]/50 transition-all duration-300 w-52 sm:w-60"
              >
                <div className="w-24 h-24 mb-4 relative flex items-center justify-center p-2">
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                <h3 className="font-bold text-sm text-center text-[#1f2937] leading-snug group-hover:text-[#025928] transition-colors">{sponsor.name}</h3>
                {sponsor.type && (
                  <span className="text-[10px] text-gray-500 font-bold tracking-wide uppercase mt-1 text-center">{sponsor.type}</span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link 
              to="/club-register"
              className="bg-transparent border-2 border-[#025928] text-[#025928] hover:bg-[#025928] hover:text-white font-bold px-8 py-3 rounded-full transition-colors duration-300 text-sm uppercase tracking-wider inline-flex items-center gap-2"
            >
              Become a Sponsor / Partner
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 8. CALL TO ACTION SECTION                                      */}
      {/* ============================================================== */}
      <section className="py-20 bg-[#013618] relative overflow-hidden text-white border-t-4 border-[#e5a823]">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#00ff88_1px,transparent_1px)] [background-size:20px_20px]"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-black/30 backdrop-blur-md p-10 md:p-14 rounded-2xl border border-white/10 shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e5a823]/20 border border-[#e5a823]/40 text-[#e5a823] text-xs font-bold uppercase tracking-wider mb-4">
            <Award className="w-4 h-4" />
            Join The 2026 Season Intake
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight mb-4 leading-tight">
            Ready to Compete at the <span className="text-[#00ff88]">Highest Level?</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Register your club today and take your place in the league that is redefining grassroots football standards across Nigeria.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link 
              to="/club-register" 
              className="w-full sm:w-auto px-10 py-4 bg-[#e5a823] hover:bg-amber-400 text-[#013618] font-black text-base uppercase tracking-widest rounded-full transition-all duration-300 transform hover:-translate-y-1 shadow-[0_0_30px_rgba(229,168,35,0.4)] flex items-center justify-center gap-2"
            >
              Register Club for SmartCity
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/club-login" 
              className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white/30 hover:border-white text-white font-bold text-base uppercase tracking-wider rounded-full transition-all"
            >
              Existing Club Portal
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 9. FOOTER                                                      */}
      {/* ============================================================== */}
      <footer className="bg-[#0a0d0b] text-white border-t border-white/10 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

            {/* Brand Column */}
            <div className="space-y-6">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-[#e5a823] p-1 overflow-hidden shadow-md">
                  <img src="/smartCityImage.jpg" alt="Logo" className="w-full h-full object-contain rounded-full" />
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-2xl tracking-tight leading-none text-white uppercase">
                    Smart<span className="text-[#e5a823]">City</span>
                  </span>
                  <span className="text-[10px] font-bold text-[#00ff88] uppercase tracking-widest mt-0.5">
                    Osun Football League
                  </span>
                </div>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed">
                Official grassroots elite football competition powered by SmartCity PLC in active partnership with the Osun State Football Association (Osun FA).
              </p>
              <div className="flex gap-3">
                <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#00ff88] hover:text-black transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="https://x.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#00ff88] hover:text-black transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#00ff88] hover:text-black transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="https://www.youtube.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#00ff88] hover:text-black transition-colors">
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-base font-bold mb-6 text-white uppercase tracking-wider border-b border-white/10 pb-2">
                Quick Navigation
              </h4>
              <ul className="space-y-3">
                {[
                  { name: 'Home', href: '#home' },
                  { name: 'About League', href: '#about' },
                  { name: 'Match Center', href: '#matches' },
                  { name: 'Latest Features', href: '#features' },
                  { name: 'Partners & Sponsors', href: '#partners' }
                ].map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-gray-400 hover:text-[#00ff88] transition-colors flex items-center gap-2 group text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#025928] group-hover:bg-[#00ff88] transition-colors"></span>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Portals & Systems */}
            <div>
              <h4 className="text-base font-bold mb-6 text-white uppercase tracking-wider border-b border-white/10 pb-2">
                Portals & Hubs
              </h4>
              <ul className="space-y-3">
                {[
                  { name: 'Club Intake Registration', href: '/club-register' },
                  { name: 'Club Portal Access', href: '/club-login' },
                  { name: 'Tournament Hub & Live Scores', href: '/livescore' },
                  { name: 'Referee Match Reporting', href: '/referee' },
                  { name: 'Admin Supervision Panel', href: '/admin' }
                ].map((link) => (
                  <li key={link.name}>
                    <Link to={link.href} className="text-gray-400 hover:text-[#e5a823] transition-colors flex items-center gap-2 group text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#e5a823] group-hover:bg-[#00ff88] transition-colors"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="text-base font-bold mb-6 text-white uppercase tracking-wider border-b border-white/10 pb-2">
                Secretariat & Contact
              </h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#00ff88] flex-shrink-0 mt-0.5" />
                  <span>SmartCity Secretariat, Osogbo City Stadium, Osogbo, Osun State.</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#00ff88] flex-shrink-0" />
                  <span>+234 (0) 800 123 4567</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#00ff88] flex-shrink-0" />
                  <span>info@smartcityleague.ng</span>
                </li>
              </ul>
              <div className="pt-2">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Affiliation:</span>
                <span className="text-xs text-gray-300">Sanctioned by Osun State Football Association (Osun FA)</span>
              </div>
            </div>

          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            <p>&copy; {new Date().getFullYear()} SmartCity Osun State Football League. All Rights Reserved.</p>
            <div className="flex gap-6">
              <a href="#home" className="hover:text-white transition-colors">Back to Top</a>
              <Link to="/club-login" className="hover:text-[#00ff88] transition-colors">Club Portal</Link>
              <Link to="/admin" className="hover:text-[#e5a823] transition-colors">Admin Login</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
