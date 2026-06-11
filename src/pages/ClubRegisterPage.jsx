import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu, X, ChevronRight, CheckCircle, Phone, Mail,
  Facebook, Twitter, Instagram, Youtube, Upload, MessageCircle
} from 'lucide-react';

const OSUN_LGAS = [
  'Aiyedade', 'Aiyedire', 'Atakumosa East', 'Atakumosa West',
  'Boluwaduro', 'Boripe', 'Ede North', 'Ede South',
  'Egbedore', 'Ejigbo', 'Ifedayo', 'Ifelodun',
  'Ila', 'Ilesa East', 'Ilesa West', 'Irepodun',
  'Irewole', 'Isokan', 'Iwo', 'Obokun',
  'Odo-Otin', 'Ola-Oluwa', 'Olorunda', 'Oriade',
  'Orolu', 'Osogbo'
];

const initialForm = {
  // Section A
  clubName: '', foundedYear: '', lga: '', homeGround: '',
  clubColors: '', clubCategory: '', clubLogo: null,
  // Section B
  chairmanName: '', secretaryName: '', phone: '', whatsapp: '',
  email: '', websiteOrSocial: '',
  // Section C
  headCoach: '', coachLicense: '', numPlayers: '', ageRange: '',
  // Section D
  prevLeague: '', prevLeagueNames: '', prevTransfer: '',
  // Section E
  agreeRules: false, agreeData: false,
};

const inputClass =
  'w-full bg-white border-2 border-neutral-200 rounded-sm px-4 py-3 text-neutral-900 font-medium focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all placeholder:text-neutral-400 text-base';
const labelClass = 'block text-sm font-black text-emerald-950 uppercase tracking-widest mb-2';
const sectionTitleClass =
  'flex items-center gap-3 text-xl md:text-2xl font-black text-white uppercase tracking-wide mb-8 pb-4 border-b border-emerald-800';

export function ClubRegisterPage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/#about' },
    { name: 'Why Join', href: '/#why-join' },
    { name: 'How It Works', href: '/#how-it-works' },
    { name: 'Contact', href: '/#contact' },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      setForm((prev) => ({ ...prev, [name]: file }));
      if (file) setLogoPreview(URL.createObjectURL(file));
    } else if (type === 'checkbox') {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.clubName.trim()) e.clubName = 'Club name is required.';
    if (!form.lga) e.lga = 'Please select your LGA.';
    if (!form.clubCategory) e.clubCategory = 'Please select a club category.';
    if (!form.chairmanName.trim()) e.chairmanName = 'Chairman/President name is required.';
    if (!form.phone.trim()) e.phone = 'Phone number is required.';
    if (!form.email.trim()) e.email = 'Email address is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Please enter a valid email.';
    if (!form.headCoach.trim()) e.headCoach = 'Head coach name is required.';
    if (!form.coachLicense) e.coachLicense = 'Please select a coach license.';
    if (!form.prevLeague) e.prevLeague = 'Please answer this field.';
    if (!form.prevTransfer) e.prevTransfer = 'Please answer this field.';
    if (!form.agreeRules) e.agreeRules = 'You must agree to the rules.';
    if (!form.agreeData) e.agreeData = 'You must consent to data usage.';
    return e;
  };

  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const firstKey = Object.keys(errs)[0];
      const el = document.getElementById(firstKey);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);
    setServerError('');

    try {
      let clubLogoBase64 = '';
      if (form.clubLogo) {
        clubLogoBase64 = await toBase64(form.clubLogo);
      }

      const payload = {
        clubName: form.clubName,
        foundedYear: form.foundedYear,
        lga: form.lga,
        homeGround: form.homeGround,
        clubColors: form.clubColors,
        clubCategory: form.clubCategory,
        clubLogoBase64,
        chairmanName: form.chairmanName,
        secretaryName: form.secretaryName,
        phone: form.phone,
        whatsapp: form.whatsapp,
        email: form.email,
        websiteOrSocial: form.websiteOrSocial,
        headCoach: form.headCoach,
        coachLicense: form.coachLicense,
        numPlayers: form.numPlayers,
        ageRange: form.ageRange,
        prevLeague: form.prevLeague,
        prevLeagueNames: form.prevLeagueNames,
        prevTransfer: form.prevTransfer,
      };

      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
      const res = await fetch(`${BACKEND_URL}/api/club-registrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Submission failed. Please try again.');
      }

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setServerError(err.message || 'Network error. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Success Screen ───────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-emerald-950 flex flex-col items-center justify-center px-4 py-24 text-center">
        <div className="w-24 h-24 bg-amber-400/20 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-amber-400 animate-pulse">
          <CheckCircle size={48} className="text-amber-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
          Registration <span className="text-amber-400">Received!</span>
        </h1>
        <p className="text-xl text-emerald-100 max-w-xl mx-auto mb-10 font-medium">
          Thank you! Your club registration has been received. We will contact you within{' '}
          <span className="text-amber-400 font-bold">48 hours</span>.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-black px-8 py-4 rounded-sm uppercase tracking-widest transition-all duration-300 hover:-translate-y-1 shadow-[0_0_30px_rgba(245,158,11,0.4)] border-b-4 border-amber-700"
        >
          Back to Home <ChevronRight size={20} />
        </Link>
      </div>
    );
  }

  // ─── Main Page ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-amber-400 selection:text-emerald-950 flex flex-col overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-emerald-950/95 backdrop-blur-md shadow-xl py-3' : 'bg-emerald-950 py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-[0_0_15px_rgba(245,158,11,0.5)] border-2 border-amber-300 overflow-hidden p-1">
                <img src="/smartCityImage.jpg" alt="SmartCity Logo" className="w-full h-full object-contain rounded-full" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tighter text-white uppercase leading-none">
                  Smart<span className="text-amber-500">City</span>
                </span>
                <span className="text-[0.6rem] font-bold text-emerald-300 uppercase tracking-widest leading-none mt-0.5">
                  Osun State Football League
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link key={link.name} to={link.href} className="text-sm font-bold text-emerald-50 hover:text-amber-400 uppercase tracking-widest transition-colors relative group">
                  {link.name}
                  <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </div>

            {/* Mobile toggle */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden text-white hover:text-amber-400 p-2">
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden absolute top-full left-0 w-full bg-emerald-950 border-t border-emerald-900 transition-all duration-300 origin-top ${isMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'}`}>
          <div className="px-4 py-6 space-y-2 shadow-2xl">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.href} onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-base font-bold text-white hover:text-emerald-950 hover:bg-amber-400 uppercase tracking-widest rounded-sm transition-colors">
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* ── Hero Banner ── */}
      <section className="relative bg-emerald-950 pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #10b981 0, #10b981 2px, transparent 2px, transparent 12px)' }}></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-6">
            <Link to="/" className="hover:text-amber-400 transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-amber-400">Register Your Club</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <img src="/smartCityImage.jpg" alt="SmartCity Logo" className="w-20 h-20 object-contain bg-white rounded-full p-2 border-4 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.4)] flex-shrink-0" />
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight leading-[1.1]">
                Register Your Club for the{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">
                  SmartCity Osun State Football League
                </span>
              </h1>
              <p className="mt-4 text-emerald-100 text-lg font-medium max-w-2xl">
                Fill in your club details below to begin your registration. Our team will review and get back to you within{' '}
                <span className="text-amber-400 font-bold">48 hours</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Form Section ── */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-6">

            {/* ── Section A: Club Information ── */}
            <div className="bg-emerald-950 rounded-sm shadow-xl overflow-hidden">
              <div className="px-8 pt-8 pb-2">
                <h2 className={sectionTitleClass}>
                  <span className="w-9 h-9 bg-amber-500 text-emerald-950 rounded-sm flex items-center justify-center font-black text-sm flex-shrink-0">A</span>
                  Club Information
                </h2>
              </div>
              <div className="px-8 pb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Club Name */}
                <div className="md:col-span-2">
                  <label className={labelClass} style={{ color: '#d1fae5' }} htmlFor="clubName">Club Name <span className="text-amber-400">*</span></label>
                  <input id="clubName" name="clubName" type="text" value={form.clubName} onChange={handleChange} placeholder="e.g. Osogbo United FC" className={`${inputClass} ${errors.clubName ? 'border-red-500' : ''}`} />
                  {errors.clubName && <p className="mt-1 text-sm text-red-400 font-semibold">{errors.clubName}</p>}
                </div>

                {/* Founded Year */}
                <div>
                  <label className={labelClass} style={{ color: '#d1fae5' }} htmlFor="foundedYear">Club Founded Year</label>
                  <input id="foundedYear" name="foundedYear" type="number" min="1900" max="2026" value={form.foundedYear} onChange={handleChange} placeholder="e.g. 2010" className={inputClass} />
                </div>

                {/* LGA */}
                <div>
                  <label className={labelClass} style={{ color: '#d1fae5' }} htmlFor="lga">Club Home Town / LGA <span className="text-amber-400">*</span></label>
                  <select id="lga" name="lga" value={form.lga} onChange={handleChange} className={`${inputClass} ${errors.lga ? 'border-red-500' : ''}`}>
                    <option value="">-- Select LGA --</option>
                    {OSUN_LGAS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                  {errors.lga && <p className="mt-1 text-sm text-red-400 font-semibold">{errors.lga}</p>}
                </div>

                {/* Home Ground */}
                <div>
                  <label className={labelClass} style={{ color: '#d1fae5' }} htmlFor="homeGround">Club Home Ground / Venue</label>
                  <input id="homeGround" name="homeGround" type="text" value={form.homeGround} onChange={handleChange} placeholder="e.g. Osogbo Township Stadium" className={inputClass} />
                </div>

                {/* Club Colors */}
                <div>
                  <label className={labelClass} style={{ color: '#d1fae5' }} htmlFor="clubColors">Club Colors</label>
                  <input id="clubColors" name="clubColors" type="text" value={form.clubColors} onChange={handleChange} placeholder="e.g. Red and White" className={inputClass} />
                </div>

                {/* Category */}
                <div>
                  <label className={labelClass} style={{ color: '#d1fae5' }} htmlFor="clubCategory">Club Category <span className="text-amber-400">*</span></label>
                  <select id="clubCategory" name="clubCategory" value={form.clubCategory} onChange={handleChange} className={`${inputClass} ${errors.clubCategory ? 'border-red-500' : ''}`}>
                    <option value="">-- Select Category --</option>
                    <option>Senior Men</option>
                    <option>Under-17</option>
                    <option>Women's Team</option>
                    <option>Youth Academy</option>
                  </select>
                  {errors.clubCategory && <p className="mt-1 text-sm text-red-400 font-semibold">{errors.clubCategory}</p>}
                </div>

                {/* Logo Upload */}
                <div className="md:col-span-2">
                  <label className={labelClass} style={{ color: '#d1fae5' }} htmlFor="clubLogo">Club Logo (Optional)</label>
                  <div className={`relative border-2 border-dashed rounded-sm p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all hover:border-amber-400 ${logoPreview ? 'border-amber-400' : 'border-emerald-700'}`}>
                    <input id="clubLogo" name="clubLogo" type="file" accept="image/*" onChange={handleChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo preview" className="w-24 h-24 object-contain rounded-sm" />
                    ) : (
                      <>
                        <Upload size={32} className="text-emerald-400" />
                        <p className="text-emerald-300 font-medium text-sm text-center">Click or drag to upload your club logo<br /><span className="text-emerald-500 text-xs">PNG, JPG, SVG — Max 5MB</span></p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Section B: Contact Details ── */}
            <div className="bg-emerald-950 rounded-sm shadow-xl overflow-hidden">
              <div className="px-8 pt-8 pb-2">
                <h2 className={sectionTitleClass}>
                  <span className="w-9 h-9 bg-amber-500 text-emerald-950 rounded-sm flex items-center justify-center font-black text-sm flex-shrink-0">B</span>
                  Club Contact Details
                </h2>
              </div>
              <div className="px-8 pb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass} style={{ color: '#d1fae5' }} htmlFor="chairmanName">Chairman / President Name <span className="text-amber-400">*</span></label>
                  <input id="chairmanName" name="chairmanName" type="text" value={form.chairmanName} onChange={handleChange} placeholder="Full name" className={`${inputClass} ${errors.chairmanName ? 'border-red-500' : ''}`} />
                  {errors.chairmanName && <p className="mt-1 text-sm text-red-400 font-semibold">{errors.chairmanName}</p>}
                </div>

                <div>
                  <label className={labelClass} style={{ color: '#d1fae5' }} htmlFor="secretaryName">Club Secretary Name</label>
                  <input id="secretaryName" name="secretaryName" type="text" value={form.secretaryName} onChange={handleChange} placeholder="Full name" className={inputClass} />
                </div>

                <div>
                  <label className={labelClass} style={{ color: '#d1fae5' }} htmlFor="phone">Phone Number <span className="text-amber-400">*</span></label>
                  <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+234 800 000 0000" className={`${inputClass} ${errors.phone ? 'border-red-500' : ''}`} />
                  {errors.phone && <p className="mt-1 text-sm text-red-400 font-semibold">{errors.phone}</p>}
                </div>

                <div>
                  <label className={labelClass} style={{ color: '#d1fae5' }} htmlFor="whatsapp">WhatsApp Number</label>
                  <input id="whatsapp" name="whatsapp" type="tel" value={form.whatsapp} onChange={handleChange} placeholder="+234 800 000 0000" className={inputClass} />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass} style={{ color: '#d1fae5' }} htmlFor="email">Email Address <span className="text-amber-400">*</span></label>
                  <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="club@example.com" className={`${inputClass} ${errors.email ? 'border-red-500' : ''}`} />
                  {errors.email && <p className="mt-1 text-sm text-red-400 font-semibold">{errors.email}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass} style={{ color: '#d1fae5' }} htmlFor="websiteOrSocial">Website or Social Media Handle (Optional)</label>
                  <input id="websiteOrSocial" name="websiteOrSocial" type="text" value={form.websiteOrSocial} onChange={handleChange} placeholder="e.g. @clubname or www.clubname.com" className={inputClass} />
                </div>
              </div>
            </div>

            {/* ── Section C: Team & Coach ── */}
            <div className="bg-emerald-950 rounded-sm shadow-xl overflow-hidden">
              <div className="px-8 pt-8 pb-2">
                <h2 className={sectionTitleClass}>
                  <span className="w-9 h-9 bg-amber-500 text-emerald-950 rounded-sm flex items-center justify-center font-black text-sm flex-shrink-0">C</span>
                  Team & Coach Details
                </h2>
              </div>
              <div className="px-8 pb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass} style={{ color: '#d1fae5' }} htmlFor="headCoach">Head Coach Name <span className="text-amber-400">*</span></label>
                  <input id="headCoach" name="headCoach" type="text" value={form.headCoach} onChange={handleChange} placeholder="Full name" className={`${inputClass} ${errors.headCoach ? 'border-red-500' : ''}`} />
                  {errors.headCoach && <p className="mt-1 text-sm text-red-400 font-semibold">{errors.headCoach}</p>}
                </div>

                <div>
                  <label className={labelClass} style={{ color: '#d1fae5' }} htmlFor="coachLicense">Coach License / Qualification <span className="text-amber-400">*</span></label>
                  <select id="coachLicense" name="coachLicense" value={form.coachLicense} onChange={handleChange} className={`${inputClass} ${errors.coachLicense ? 'border-red-500' : ''}`}>
                    <option value="">-- Select License --</option>
                    <option>CAF A</option>
                    <option>CAF B</option>
                    <option>CAF C</option>
                    <option>None</option>
                  </select>
                  {errors.coachLicense && <p className="mt-1 text-sm text-red-400 font-semibold">{errors.coachLicense}</p>}
                </div>

                <div>
                  <label className={labelClass} style={{ color: '#d1fae5' }} htmlFor="numPlayers">Number of Registered Players</label>
                  <input id="numPlayers" name="numPlayers" type="number" min="0" value={form.numPlayers} onChange={handleChange} placeholder="e.g. 22" className={inputClass} />
                </div>

                <div>
                  <label className={labelClass} style={{ color: '#d1fae5' }} htmlFor="ageRange">Age Range of Players</label>
                  <input id="ageRange" name="ageRange" type="text" value={form.ageRange} onChange={handleChange} placeholder="e.g. 16–22" className={inputClass} />
                </div>
              </div>
            </div>

            {/* ── Section D: League History ── */}
            <div className="bg-emerald-950 rounded-sm shadow-xl overflow-hidden">
              <div className="px-8 pt-8 pb-2">
                <h2 className={sectionTitleClass}>
                  <span className="w-9 h-9 bg-amber-500 text-emerald-950 rounded-sm flex items-center justify-center font-black text-sm flex-shrink-0">D</span>
                  League History
                </h2>
              </div>
              <div className="px-8 pb-10 space-y-8">
                {/* Q1 */}
                <div>
                  <p className="text-emerald-100 font-bold mb-4">Has your club participated in any state or national league before? <span className="text-amber-400">*</span></p>
                  <div className="flex gap-6">
                    {['Yes', 'No'].map((opt) => (
                      <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded-sm border-2 flex items-center justify-center transition-all ${form.prevLeague === opt ? 'bg-amber-500 border-amber-500' : 'border-emerald-600 group-hover:border-amber-400'}`}>
                          {form.prevLeague === opt && <div className="w-2.5 h-2.5 bg-emerald-950 rounded-sm"></div>}
                        </div>
                        <input type="radio" name="prevLeague" value={opt} checked={form.prevLeague === opt} onChange={handleChange} className="sr-only" />
                        <span className="text-white font-bold uppercase tracking-wide">{opt}</span>
                      </label>
                    ))}
                  </div>
                  {errors.prevLeague && <p className="mt-2 text-sm text-red-400 font-semibold">{errors.prevLeague}</p>}
                </div>

                {/* If Yes */}
                {form.prevLeague === 'Yes' && (
                  <div>
                    <label className={labelClass} style={{ color: '#d1fae5' }} htmlFor="prevLeagueNames">If Yes, which league(s)?</label>
                    <textarea id="prevLeagueNames" name="prevLeagueNames" value={form.prevLeagueNames} onChange={handleChange} rows={3} placeholder="List the leagues your club has participated in..." className={`${inputClass} resize-none`} />
                  </div>
                )}

                {/* Q2 */}
                <div>
                  <p className="text-emerald-100 font-bold mb-4">Has any player from your club been transferred professionally? <span className="text-amber-400">*</span></p>
                  <div className="flex gap-6">
                    {['Yes', 'No'].map((opt) => (
                      <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded-sm border-2 flex items-center justify-center transition-all ${form.prevTransfer === opt ? 'bg-amber-500 border-amber-500' : 'border-emerald-600 group-hover:border-amber-400'}`}>
                          {form.prevTransfer === opt && <div className="w-2.5 h-2.5 bg-emerald-950 rounded-sm"></div>}
                        </div>
                        <input type="radio" name="prevTransfer" value={opt} checked={form.prevTransfer === opt} onChange={handleChange} className="sr-only" />
                        <span className="text-white font-bold uppercase tracking-wide">{opt}</span>
                      </label>
                    ))}
                  </div>
                  {errors.prevTransfer && <p className="mt-2 text-sm text-red-400 font-semibold">{errors.prevTransfer}</p>}
                </div>
              </div>
            </div>

            {/* ── Section E: Agreement & Submission ── */}
            <div className="bg-emerald-950 rounded-sm shadow-xl overflow-hidden">
              <div className="px-8 pt-8 pb-2">
                <h2 className={sectionTitleClass}>
                  <span className="w-9 h-9 bg-amber-500 text-emerald-950 rounded-sm flex items-center justify-center font-black text-sm flex-shrink-0">E</span>
                  Agreement & Submission
                </h2>
              </div>
              <div className="px-8 pb-10 space-y-6">
                {/* Checkbox 1 */}
                <label className="flex items-start gap-4 cursor-pointer group">
                  <div className={`mt-0.5 w-6 h-6 rounded-sm border-2 flex items-center justify-center flex-shrink-0 transition-all ${form.agreeRules ? 'bg-amber-500 border-amber-500' : 'border-emerald-600 group-hover:border-amber-400'}`}>
                    {form.agreeRules && <CheckCircle size={14} className="text-emerald-950" />}
                  </div>
                  <input type="checkbox" name="agreeRules" checked={form.agreeRules} onChange={handleChange} className="sr-only" />
                  <span className="text-emerald-100 font-medium leading-relaxed">
                    I confirm that all information provided is accurate and that our club agrees to abide by the rules and regulations of the{' '}
                    <span className="text-amber-400 font-bold">Osun State Football Association</span> and the{' '}
                    <span className="text-amber-400 font-bold">SmartCity Osun State Football League</span>.
                  </span>
                </label>
                {errors.agreeRules && <p className="text-sm text-red-400 font-semibold -mt-2">{errors.agreeRules}</p>}

                {/* Checkbox 2 */}
                <label className="flex items-start gap-4 cursor-pointer group">
                  <div className={`mt-0.5 w-6 h-6 rounded-sm border-2 flex items-center justify-center flex-shrink-0 transition-all ${form.agreeData ? 'bg-amber-500 border-amber-500' : 'border-emerald-600 group-hover:border-amber-400'}`}>
                    {form.agreeData && <CheckCircle size={14} className="text-emerald-950" />}
                  </div>
                  <input type="checkbox" name="agreeData" checked={form.agreeData} onChange={handleChange} className="sr-only" />
                  <span className="text-emerald-100 font-medium leading-relaxed">
                    I consent to our club's data being used for league administration and player analytics purposes.
                  </span>
                </label>
                {errors.agreeData && <p className="text-sm text-red-400 font-semibold -mt-2">{errors.agreeData}</p>}

                {/* Submit */}
                <div className="pt-4">
                  {serverError && (
                    <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-sm text-red-300 font-semibold text-sm flex items-start gap-3">
                      <span className="text-red-400 text-lg">⚠️</span>
                      <span>{serverError}</span>
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full sm:w-auto px-12 py-5 font-black text-lg md:text-xl uppercase tracking-widest rounded-sm transition-all duration-300 transform shadow-[0_0_40px_rgba(245,158,11,0.4)] flex items-center justify-center gap-3 border-b-4 group
                      ${isSubmitting
                        ? 'bg-amber-700 border-amber-900 text-amber-200 cursor-not-allowed translate-y-0'
                        : 'bg-amber-500 hover:bg-amber-400 text-emerald-950 hover:-translate-y-1 border-amber-700 active:border-b-0 active:translate-y-1'
                      }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Club Registration
                        <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* ── What Happens Next ── */}
      <section className="py-20 bg-white border-t border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center justify-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-widest mb-4">
              <div className="w-4 h-0.5 bg-amber-500"></div>After You Submit<div className="w-4 h-0.5 bg-amber-500"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-emerald-950 uppercase tracking-tight">What Happens Next?</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '✅', step: '01', title: 'Registration Submitted', desc: 'Your registration is successfully submitted and received by the Osun State Football Association.' },
              { icon: '📧', step: '02', title: 'Immediate Confirmation', desc: 'You will receive a confirmation email with details of your registration immediately.' },
              { icon: '🔍', step: '03', title: 'Application Reviewed', desc: 'Our team reviews your registration credentials and information within 48 hours.' },
              { icon: '🎉', step: '04', title: 'Approval & Details', desc: 'Once approved, you\'ll receive a congratulations email with your temporary login credentials.' },
              { icon: '🔑', step: '05', title: 'First Login & Reset', desc: 'Log in to the Club Portal and change your temporary password to secure your account.' },
              { icon: '⚽', step: '06', title: 'Conference & Squad', desc: 'Roster your squad and get assigned to your conference to prepare for the season kickoff!' },
            ].map((item) => (
              <div key={item.step} className="relative bg-emerald-950 p-8 rounded-sm shadow-xl border-b-4 border-amber-500 group hover:-translate-y-1 transition-transform duration-300">
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="absolute top-6 right-6 text-5xl font-black text-emerald-900 select-none">{item.step}</div>
                <h3 className="text-xl font-black text-white uppercase tracking-wide mb-3">{item.title}</h3>
                <p className="text-emerald-200 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Need Help? ── */}
      <section className="py-16 bg-neutral-100 border-t border-neutral-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-black text-emerald-950 uppercase tracking-tight mb-3">Need Help?</h3>
          <p className="text-neutral-600 font-medium mb-8">Have questions about registration? Reach out to our team:</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="mailto:info@smartcityleague.ng" className="flex items-center gap-3 bg-white border-2 border-neutral-200 hover:border-amber-400 px-6 py-4 rounded-sm font-bold text-neutral-800 hover:text-amber-600 transition-all">
              <Mail size={20} className="text-amber-500" />
              info@smartcityleague.ng
            </a>
            <a href="tel:+2348000000000" className="flex items-center gap-3 bg-white border-2 border-neutral-200 hover:border-amber-400 px-6 py-4 rounded-sm font-bold text-neutral-800 hover:text-amber-600 transition-all">
              <Phone size={20} className="text-amber-500" />
              +234 800 000 0000
            </a>
            <a href="https://wa.me/2348000000000" target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 px-6 py-4 rounded-sm font-bold text-white transition-all">
              <MessageCircle size={20} />
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-emerald-950 pt-16 pb-8 border-t-8 border-amber-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="lg:col-span-2 flex flex-col items-start gap-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center border-2 border-amber-300 overflow-hidden p-1">
                  <img src="/smartCityImage.jpg" alt="SmartCity Logo" className="w-full h-full object-contain rounded-full" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black tracking-tighter text-white uppercase leading-none">Smart<span className="text-amber-500">City</span></span>
                  <span className="text-[0.65rem] font-bold text-emerald-300 uppercase tracking-widest leading-none mt-1">Osun State Football League</span>
                </div>
              </div>
              <div className="space-y-1 mt-2">
                <p className="text-white font-bold tracking-widest text-xs flex items-center gap-2"><span className="w-2 h-2 bg-amber-500 rounded-full"></span>POWERED BY SMARTCITY PLC</p>
                <p className="text-emerald-400 font-bold tracking-widest text-xs flex items-center gap-2"><span className="w-2 h-2 bg-emerald-600 rounded-full"></span>IN PARTNERSHIP WITH OSUN STATE FA</p>
              </div>
            </div>

            <div>
              <h4 className="text-white font-black uppercase tracking-widest mb-5 border-b-2 border-emerald-800 pb-2 inline-block">Quick Links</h4>
              <ul className="space-y-3">
                {[['Home', '/'], ['About', '/#about'], ['Why Join', '/#why-join'], ['Register', '/club-register']].map(([name, href]) => (
                  <li key={name}><Link to={href} className="text-emerald-200 hover:text-amber-400 font-medium uppercase tracking-wide text-sm transition-colors flex items-center gap-2"><ChevronRight size={14} /> {name}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-black uppercase tracking-widest mb-5 border-b-2 border-emerald-800 pb-2 inline-block">Connect</h4>
              <div className="flex gap-3 flex-wrap">
                {[Twitter, Instagram, Facebook, Youtube].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-sm bg-emerald-900 border border-emerald-800 flex items-center justify-center text-emerald-400 hover:text-emerald-950 hover:bg-amber-500 hover:border-amber-400 hover:scale-110 transition-all duration-300">
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-emerald-900 flex flex-col md:flex-row justify-between items-center gap-4 text-emerald-600 text-xs font-bold uppercase tracking-widest">
            <p>© {new Date().getFullYear()} SmartCity Osun State Football League.</p>
            <p>All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
