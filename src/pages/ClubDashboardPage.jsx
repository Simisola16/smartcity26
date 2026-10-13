import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LogOut, User, CheckCircle2, Clock, ChevronRight, Bell, FileText,
  Phone, Mail, Globe, MapPin, Users, Edit2, X, Save, Upload,
  AlertCircle, RefreshCw, Shield, Calendar, Trophy, Star, Plus,
  Eye, Trash2, BookOpen, AlertTriangle, ArrowLeft, ArrowUpRight,
  Share2, Award, Zap, Check, Sparkles, Filter, Search, LayoutGrid, List
} from 'lucide-react';
import { BACKEND_URL } from '../config';

const getClubToken = () => localStorage.getItem('club_token');

const clubApi = async (path, options = {}) => {
  const token = getClubToken();
  const res = await fetch(`${BACKEND_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(err.message);
  }
  return res.json();
};

const toBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

// ─────────────────────────────────────────────────────────────────────────────
// Sub-Components
// ─────────────────────────────────────────────────────────────────────────────

function StatusTimeline({ club }) {
  const hasConference = !!club.conference;
  const steps = [
    { label: 'Registration Submitted', done: true, icon: FileText, date: 'Completed' },
    { label: 'Osun FA Verification', done: true, icon: Shield, date: 'Verified' },
    { label: 'Official License Approved', done: true, icon: CheckCircle2, highlight: true, date: 'Active' },
    {
      label: 'Conference Allocation',
      done: hasConference,
      pending: !hasConference,
      icon: Trophy,
      sub: hasConference ? club.conference : 'Awaiting draw allocation'
    },
    { label: 'State League Kickoff', done: false, pending: true, icon: Calendar, sub: 'Oct 2026 Season' },
  ];

  return (
    <div className="relative pl-2 py-2">
      <div className="space-y-6">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={idx} className="flex items-start gap-4 group">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border transition-all duration-300 ${
                  step.highlight
                    ? 'bg-gradient-to-br from-emerald-500 to-emerald-700 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.35)]'
                    : step.done
                    ? 'bg-emerald-950/80 border-emerald-600/60 text-emerald-300'
                    : 'bg-[#09150e] border-emerald-900/60 text-emerald-800'
                }`}>
                  <Icon size={16} />
                </div>
                {idx < steps.length - 1 && (
                  <div className={`w-0.5 h-8 my-1 rounded-full transition-colors ${
                    step.done ? 'bg-gradient-to-b from-emerald-600 to-emerald-900' : 'bg-emerald-950'
                  }`} />
                )}
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-xs font-black uppercase tracking-wider ${
                    step.done ? 'text-white' : 'text-emerald-700'
                  }`}>
                    {step.label}
                  </p>
                  {step.date && (
                    <span className="text-[10px] text-emerald-500 font-mono font-bold uppercase tracking-widest">
                      {step.date}
                    </span>
                  )}
                </div>
                {step.sub && (
                  <p className={`text-xs mt-0.5 font-medium ${
                    step.done ? 'text-amber-400 font-bold' : 'text-emerald-600'
                  }`}>
                    {step.sub}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EditProfileModal({ club, onClose, onSave, saving }) {
  const [form, setForm] = useState({
    chairmanName: club.chairmanName || '',
    secretaryName: club.secretaryName || '',
    phone: club.phone || '',
    whatsapp: club.whatsapp || '',
    email: club.email || '',
    websiteOrSocial: club.websiteOrSocial || '',
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(club.clubLogoUrl || '');

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let clubLogoBase64;
    if (logoFile) clubLogoBase64 = await toBase64(logoFile);
    onSave({ ...form, ...(clubLogoBase64 ? { clubLogoBase64 } : {}) });
  };

  const Field = ({ label, id, type = 'text', value, onChange, icon: Icon, placeholder = '' }) => (
    <div>
      <label htmlFor={id} className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1.5">{label}</label>
      <div className="relative">
        {Icon && <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500" />}
        <input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
          className={`w-full bg-[#081710] border border-emerald-800/80 rounded-xl py-3 text-white text-sm font-medium focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 placeholder:text-emerald-700/60 transition-all ${Icon ? 'pl-10 pr-4' : 'px-4'}`}
        />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 overflow-y-auto">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#0a1c12] border border-emerald-700/60 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden mb-10 animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-emerald-800/80 bg-gradient-to-r from-emerald-950 via-[#0d2317] to-emerald-950 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/20 border border-amber-500/30 rounded-xl flex items-center justify-center text-amber-400 shadow-inner">
              <Edit2 size={18} />
            </div>
            <div>
              <h2 className="font-black text-white text-sm uppercase tracking-widest">Update Club Dossier</h2>
              <p className="text-[10px] text-emerald-400 font-mono">Official State FA Record</p>
            </div>
          </div>
          <button onClick={onClose} className="text-emerald-400 hover:text-white hover:bg-emerald-800/50 rounded-xl p-2 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-2">Club Emblem / Logo</label>
            <div className="flex items-center gap-4 bg-[#081710] p-3.5 rounded-2xl border border-emerald-800/60">
              <div className="w-16 h-16 rounded-2xl border-2 border-amber-400/40 overflow-hidden bg-emerald-950 flex items-center justify-center flex-shrink-0 shadow-lg">
                {logoPreview
                  ? <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                  : <Shield size={24} className="text-emerald-600" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white font-bold mb-1">High-Resolution Crest</p>
                <p className="text-[10px] text-emerald-500 mb-2">PNG or JPG, transparent recommended.</p>
                <label className="cursor-pointer inline-flex items-center gap-2 bg-emerald-800 hover:bg-emerald-700 text-emerald-200 hover:text-white px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors">
                  <Upload size={12} />
                  Choose File
                  <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          <Field label="Chairman / Club President" id="chairman" value={form.chairmanName} onChange={v => setForm(f => ({...f, chairmanName: v}))} icon={User} placeholder="Full legal name" />
          <Field label="Club General Secretary" id="secretary" value={form.secretaryName} onChange={v => setForm(f => ({...f, secretaryName: v}))} icon={User} placeholder="Full legal name" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Phone Contact" id="phone" type="tel" value={form.phone} onChange={v => setForm(f => ({...f, phone: v}))} icon={Phone} placeholder="+234..." />
            <Field label="Official WhatsApp" id="whatsapp" type="tel" value={form.whatsapp} onChange={v => setForm(f => ({...f, whatsapp: v}))} icon={Phone} placeholder="+234..." />
          </div>
          <Field label="Official Club Email" id="email" type="email" value={form.email} onChange={v => setForm(f => ({...f, email: v}))} icon={Mail} placeholder="club@domain.com" />
          <Field label="Social Profile / Website" id="social" value={form.websiteOrSocial} onChange={v => setForm(f => ({...f, websiteOrSocial: v}))} icon={Globe} placeholder="https://instagram.com/..." />

          <div className="flex gap-3 pt-3">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-emerald-800 text-emerald-300 rounded-xl hover:bg-emerald-900/40 transition-colors font-bold text-xs uppercase tracking-wider">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-[2] py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 disabled:opacity-50 text-[#071510] font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.25)] flex items-center justify-center gap-2 text-xs">
              {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
              {saving ? 'Saving...' : 'Commit Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PlayerFormModal({ player, onClose, onSave, saving }) {
  const [form, setForm] = useState({
    name: player?.name || '',
    dob: player?.dob || '',
    gender: player?.gender || 'Male',
    nationality: player?.nationality || 'Nigerian',
    stateOfOrigin: player?.stateOfOrigin || '',
    lgaOfOrigin: player?.lgaOfOrigin || '',
    homeAddress: player?.homeAddress || '',
    phone: player?.phone || '',
    jerseyNumber: player?.jerseyNumber || '',
    primaryPosition: player?.primaryPosition || 'Forward',
    secondaryPosition: player?.secondaryPosition || '',
    preferredFoot: player?.preferredFoot || 'Right',
    height: player?.height || '',
    weight: player?.weight || '',
    experience: player?.experience || '',
    prevClub: player?.prevClub || '',
    guardianName: player?.guardianName || '',
    guardianRelationship: player?.guardianRelationship || 'Parent',
    guardianPhone: player?.guardianPhone || '',
  });

  const [photoPreview, setPhotoPreview] = useState(player?.photoUrl || '');
  const [photoBase64, setPhotoBase64] = useState('');
  const [docPreview, setDocPreview] = useState(player?.docUrl || '');
  const [docBase64, setDocBase64] = useState('');
  const [transferPreview, setTransferPreview] = useState(player?.transferLetterUrl || '');
  const [transferBase64, setTransferBase64] = useState('');

  const [activeStep, setActiveStep] = useState(1);

  // Auto-calculated age
  const [age, setAge] = useState(player?.age || '');
  useEffect(() => {
    if (!form.dob) return;
    const birthDate = new Date(form.dob);
    const today = new Date();
    let computed = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      computed--;
    }
    setAge(computed >= 0 ? computed : '');
  }, [form.dob]);

  const handleFile = async (e, setPrev, setBase) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type.startsWith('image/')) {
      setPrev(URL.createObjectURL(file));
    } else {
      setPrev(file.name);
    }
    const base64 = await toBase64(file);
    setBase(base64);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      photoBase64,
      docBase64,
      transferLetterBase64: transferBase64
    });
  };

  const nigerianStates = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", "Delta",
    "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi",
    "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba",
    "Yobe", "Zamfara", "FCT"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-[#0a1c12] border border-emerald-700/60 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden mb-10 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-emerald-800/80 bg-gradient-to-r from-emerald-950 via-[#0d2317] to-emerald-950 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/20 border border-amber-500/30 rounded-xl flex items-center justify-center text-amber-400">
              <Plus size={18} />
            </div>
            <div>
              <h2 className="font-black text-white text-sm uppercase tracking-widest">
                {player ? 'Edit Player Record' : 'Player License Registration'}
              </h2>
              <p className="text-[10px] text-emerald-400 font-mono">SmartCity League 2026 Roster Intake</p>
            </div>
          </div>
          <button onClick={onClose} className="text-emerald-400 hover:text-white hover:bg-emerald-800/50 rounded-xl p-2 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Step Tabs */}
        <div className="bg-[#081710] border-b border-emerald-900/60 px-6 py-2.5 flex gap-2">
          {[
            { step: 1, label: '1. Personal Bio' },
            { step: 2, label: '2. Technical Profile' },
            { step: 3, label: '3. Credentials & Files' },
            { step: 4, label: '4. Guardian / Emergency' },
          ].map(s => (
            <button
              key={s.step}
              type="button"
              onClick={() => setActiveStep(s.step)}
              className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                activeStep === s.step
                  ? 'bg-amber-500 text-[#071510] shadow-sm'
                  : 'bg-emerald-950/40 text-emerald-400 hover:text-white'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* STEP 1: Bio */}
          {activeStep === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-xs font-black text-amber-400 uppercase tracking-widest border-b border-emerald-800/60 pb-2">
                Section A: Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Full Legal Name *</label>
                  <input
                    type="text" required value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    placeholder="Surname First E.g. ADEYEMI Tunde"
                    className="w-full bg-[#081710] border border-emerald-800/80 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Date of Birth *</label>
                    <input
                      type="date" required value={form.dob}
                      onChange={e => setForm({...form, dob: e.target.value})}
                      className="w-full bg-[#081710] border border-emerald-800/80 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Computed Age</label>
                    <input
                      type="text" readOnly value={age ? `${age} Yrs` : '—'}
                      className="w-full bg-[#06120c] border border-emerald-900 rounded-xl px-4 py-3 text-amber-400 font-bold text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Gender *</label>
                  <select
                    value={form.gender}
                    onChange={e => setForm({...form, gender: e.target.value})}
                    className="w-full bg-[#081710] border border-emerald-800/80 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-amber-400"
                  >
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">State of Origin *</label>
                  <select
                    required value={form.stateOfOrigin}
                    onChange={e => setForm({...form, stateOfOrigin: e.target.value})}
                    className="w-full bg-[#081710] border border-emerald-800/80 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-amber-400"
                  >
                    <option value="">Select State</option>
                    {nigerianStates.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">LGA of Origin *</label>
                  <input
                    type="text" required value={form.lgaOfOrigin}
                    onChange={e => setForm({...form, lgaOfOrigin: e.target.value})}
                    placeholder="E.g. Osogbo, Ife East"
                    className="w-full bg-[#081710] border border-emerald-800/80 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Residential Address *</label>
                  <input
                    type="text" required value={form.homeAddress}
                    onChange={e => setForm({...form, homeAddress: e.target.value})}
                    placeholder="Residential address in Osun State"
                    className="w-full bg-[#081710] border border-emerald-800/80 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Player Direct Phone</label>
                  <input
                    type="tel" value={form.phone}
                    onChange={e => setForm({...form, phone: e.target.value})}
                    placeholder="+234..."
                    className="w-full bg-[#081710] border border-emerald-800/80 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  Next: Technical Profile →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Football Profile */}
          {activeStep === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-xs font-black text-amber-400 uppercase tracking-widest border-b border-emerald-800/60 pb-2">
                Section B: Football & Position Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Jersey Number *</label>
                  <input
                    type="number" min="1" max="99" required value={form.jerseyNumber}
                    onChange={e => setForm({...form, jerseyNumber: e.target.value})}
                    placeholder="1 - 99"
                    className="w-full bg-[#081710] border border-emerald-800/80 rounded-xl px-4 py-3 text-white text-sm font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Primary Position *</label>
                  <select
                    required value={form.primaryPosition}
                    onChange={e => setForm({...form, primaryPosition: e.target.value})}
                    className="w-full bg-[#081710] border border-emerald-800/80 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-amber-400"
                  >
                    <option>Goalkeeper</option>
                    <option>Center Back</option>
                    <option>Full Back (Left)</option>
                    <option>Full Back (Right)</option>
                    <option>Defensive Midfielder</option>
                    <option>Central Midfielder</option>
                    <option>Attacking Midfielder</option>
                    <option>Winger (Left)</option>
                    <option>Winger (Right)</option>
                    <option>Striker / Center Forward</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Preferred Foot *</label>
                  <select
                    required value={form.preferredFoot}
                    onChange={e => setForm({...form, preferredFoot: e.target.value})}
                    className="w-full bg-[#081710] border border-emerald-800/80 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-amber-400"
                  >
                    <option>Right</option>
                    <option>Left</option>
                    <option>Both (Ambidextrous)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Height (cm)</label>
                  <input
                    type="number" value={form.height}
                    onChange={e => setForm({...form, height: e.target.value})}
                    placeholder="E.g. 178"
                    className="w-full bg-[#081710] border border-emerald-800/80 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Weight (kg)</label>
                  <input
                    type="number" value={form.weight}
                    onChange={e => setForm({...form, weight: e.target.value})}
                    placeholder="E.g. 72"
                    className="w-full bg-[#081710] border border-emerald-800/80 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Experience (Years)</label>
                  <input
                    type="number" value={form.experience}
                    onChange={e => setForm({...form, experience: e.target.value})}
                    placeholder="Years playing"
                    className="w-full bg-[#081710] border border-emerald-800/80 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Previous Club (If any)</label>
                <input
                  type="text" value={form.prevClub}
                  onChange={e => setForm({...form, prevClub: e.target.value})}
                  placeholder="E.g. Sunshine Stars Academy / Free Agent"
                  className="w-full bg-[#081710] border border-emerald-800/80 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className="px-4 py-2 border border-emerald-800 text-emerald-300 rounded-xl text-xs font-bold"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  Next: Upload Documents →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Document Uploads */}
          {activeStep === 3 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-xs font-black text-amber-400 uppercase tracking-widest border-b border-emerald-800/60 pb-2">
                Section C: Player Portrait & Verification Dossier
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Photo Upload */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">
                    Passport Photo *
                  </label>
                  <div className="border border-dashed border-emerald-700/80 rounded-2xl p-4 text-center bg-[#081710] relative group hover:border-amber-400 transition-colors">
                    {photoPreview ? (
                      <div className="space-y-2">
                        <img src={photoPreview} alt="" className="w-16 h-16 rounded-full object-cover mx-auto border-2 border-amber-400 shadow-md" />
                        <p className="text-[10px] text-emerald-400 font-bold">Photo Attached</p>
                      </div>
                    ) : (
                      <div className="space-y-2 py-3">
                        <Upload size={22} className="text-emerald-600 mx-auto" />
                        <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Upload Portrait</p>
                      </div>
                    )}
                    <input
                      type="file" accept="image/*"
                      onChange={e => handleFile(e, setPhotoPreview, setPhotoBase64)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Birth Cert / NIN */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">
                    Birth Cert / NIN *
                  </label>
                  <div className="border border-dashed border-emerald-700/80 rounded-2xl p-4 text-center bg-[#081710] relative group hover:border-amber-400 transition-colors">
                    {docPreview ? (
                      <div className="space-y-2 py-2">
                        <FileText size={24} className="text-amber-400 mx-auto" />
                        <p className="text-[10px] text-emerald-300 font-bold truncate max-w-[140px] mx-auto">{docPreview.slice(-20)}</p>
                      </div>
                    ) : (
                      <div className="space-y-2 py-3">
                        <Upload size={22} className="text-emerald-600 mx-auto" />
                        <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Birth Cert / NIN</p>
                      </div>
                    )}
                    <input
                      type="file" accept="image/*,application/pdf"
                      onChange={e => handleFile(e, setDocPreview, setDocBase64)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Transfer Letter */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">
                    Transfer Letter (Opt)
                  </label>
                  <div className="border border-dashed border-emerald-700/80 rounded-2xl p-4 text-center bg-[#081710] relative group hover:border-amber-400 transition-colors">
                    {transferPreview ? (
                      <div className="space-y-2 py-2">
                        <FileText size={24} className="text-amber-400 mx-auto" />
                        <p className="text-[10px] text-emerald-300 font-bold truncate max-w-[140px] mx-auto">{transferPreview.slice(-20)}</p>
                      </div>
                    ) : (
                      <div className="space-y-2 py-3">
                        <Upload size={22} className="text-emerald-600 mx-auto" />
                        <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Clearance / Letter</p>
                      </div>
                    )}
                    <input
                      type="file" accept="image/*,application/pdf"
                      onChange={e => handleFile(e, setTransferPreview, setTransferBase64)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="px-4 py-2 border border-emerald-800 text-emerald-300 rounded-xl text-xs font-bold"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(4)}
                  className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  Next: Guardian Info →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Emergency Contacts */}
          {activeStep === 4 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-xs font-black text-amber-400 uppercase tracking-widest border-b border-emerald-800/60 pb-2">
                Section D: Emergency Contact & Next of Kin
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Guardian Name *</label>
                  <input
                    type="text" required value={form.guardianName}
                    onChange={e => setForm({...form, guardianName: e.target.value})}
                    placeholder="Full name"
                    className="w-full bg-[#081710] border border-emerald-800/80 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Relationship *</label>
                  <select
                    required value={form.guardianRelationship}
                    onChange={e => setForm({...form, guardianRelationship: e.target.value})}
                    className="w-full bg-[#081710] border border-emerald-800/80 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-amber-400"
                  >
                    <option>Parent</option>
                    <option>Sibling</option>
                    <option>Spouse</option>
                    <option>Legal Guardian</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Guardian Phone *</label>
                  <input
                    type="tel" required value={form.guardianPhone}
                    onChange={e => setForm({...form, guardianPhone: e.target.value})}
                    placeholder="+234..."
                    className="w-full bg-[#081710] border border-emerald-800/80 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className="px-4 py-2 border border-emerald-800 text-emerald-300 rounded-xl text-xs font-bold"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-[#071510] font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center gap-2 text-xs"
                >
                  {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                  {saving ? 'Submitting...' : player ? 'Save Changes' : 'Submit Player to Roster'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

function PlayerViewModal({ player, onClose }) {
  const cfg = {
    Pending: { badge: 'bg-amber-500/20 border-amber-500/40 text-amber-300', dot: 'bg-amber-400' },
    Approved: { badge: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300', dot: 'bg-emerald-400' },
    Rejected: { badge: 'bg-red-500/20 border-red-500/40 text-red-300', dot: 'bg-red-400' },
  }[player.status] || { badge: 'bg-neutral-800 border-neutral-700 text-neutral-300', dot: 'bg-neutral-400' };

  const LabelVal = ({ label, value }) => (
    value ? (
      <div className="py-2.5 border-b border-emerald-900/30 last:border-0 flex justify-between items-center gap-4 text-xs font-medium">
        <span className="text-emerald-500 uppercase tracking-wider text-[10px] font-bold">{label}</span>
        <span className="text-white text-right break-words max-w-[200px]">{value}</span>
      </div>
    ) : null
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0a1c12] border border-emerald-700/60 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden mb-8 animate-scale-in">
        <div className="p-6 bg-gradient-to-r from-emerald-950 via-[#0d2317] to-emerald-950 border-b border-emerald-800/80 flex items-center justify-between">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest ${cfg.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
            {player.status}
          </span>
          <button onClick={onClose} className="text-emerald-400 hover:text-white p-2 rounded-xl hover:bg-emerald-800/50 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 text-center space-y-4">
          <div className="relative w-24 h-24 rounded-2xl border-2 border-amber-400/50 mx-auto overflow-hidden bg-emerald-950 shadow-xl">
            {player.photoUrl
              ? <img src={player.photoUrl} alt="" className="w-full h-full object-cover" />
              : <User size={40} className="text-emerald-700 m-auto mt-6" />
            }
          </div>
          <div>
            <h3 className="text-lg font-black text-white tracking-tight">{player.name}</h3>
            <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mt-0.5">
              Jersey #{player.jerseyNumber} · {player.primaryPosition}
            </p>
          </div>

          {player.status === 'Rejected' && player.rejectionReason && (
            <div className="bg-red-950/40 border border-red-700/50 rounded-2xl p-3.5 text-left">
              <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                <AlertTriangle size={12} /> FA Reviewer Feedback
              </p>
              <p className="text-xs text-red-200/90 leading-relaxed font-medium">{player.rejectionReason}</p>
            </div>
          )}

          <div className="bg-[#081710] border border-emerald-900/60 rounded-2xl p-4 text-left divide-y divide-emerald-900/40">
            <h4 className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Award size={12} /> Player Dossier
            </h4>
            <LabelVal label="DOB" value={player.dob} />
            <LabelVal label="Age" value={player.age ? `${player.age} Years` : null} />
            <LabelVal label="Gender" value={player.gender} />
            <LabelVal label="Nationality" value={player.nationality} />
            <LabelVal label="Origin LGA / State" value={`${player.lgaOfOrigin || '—'}, ${player.stateOfOrigin || '—'}`} />
            <LabelVal label="Home Address" value={player.homeAddress} />
            <LabelVal label="Phone" value={player.phone} />
            <LabelVal label="Preferred Foot" value={player.preferredFoot} />
            <LabelVal label="Physical" value={`${player.height ? player.height + ' cm' : ''} ${player.weight ? '/ ' + player.weight + ' kg' : ''}`} />
            <LabelVal label="Experience" value={player.experience ? `${player.experience} Years` : null} />
            <LabelVal label="Previous Club" value={player.prevClub} />
            <LabelVal label="Emergency Contact" value={player.guardianName} />
            <LabelVal label="Relationship" value={player.guardianRelationship} />
            <LabelVal label="Guardian Phone" value={player.guardianPhone} />
          </div>

          <div className="flex flex-col gap-2 pt-1">
            {player.docUrl && (
              <a href={player.docUrl} target="_blank" rel="noreferrer" className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 text-emerald-200 hover:text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2">
                <FileText size={14} /> View Birth Certificate / NIN
              </a>
            )}
            {player.transferLetterUrl && (
              <a href={player.transferLetterUrl} target="_blank" rel="noreferrer" className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 text-emerald-200 hover:text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2">
                <FileText size={14} /> View Transfer Document
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export function ClubDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [club, setClub] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Squad Filters
  const [squadSearch, setSquadSearch] = useState('');
  const [squadStatusFilter, setSquadStatusFilter] = useState('All');
  const [squadPosFilter, setSquadPosFilter] = useState('All');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'

  // Modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [selectedPlayerForView, setSelectedPlayerForView] = useState(null);
  
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await clubApi('/api/club-auth/me');
      setClub(data.club);

      // Fetch announcements
      const { announcements: annList } = await clubApi('/api/club-auth/announcements');
      setAnnouncements(annList || []);

      // Fetch documents
      const { documents: docList } = await clubApi('/api/club-auth/documents');
      setDocuments(docList || []);

      // Fetch players
      const { players: playerList } = await clubApi('/api/club-auth/players');
      setPlayers(playerList || []);
    } catch (e) {
      if (e.message.includes('forbidden') || e.message.includes('expired') || e.message.includes('invalid')) {
        navigate('/club-login', { replace: true });
      } else {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const token = getClubToken();
    if (!token) {
      navigate('/club-login', { replace: true });
      return;
    }
    fetchProfile();
  }, [fetchProfile, navigate]);

  const handleSaveProfile = async (formData) => {
    setSaving(true);
    try {
      const data = await clubApi('/api/club-auth/profile', {
        method: 'PUT',
        body: JSON.stringify(formData),
      });
      setClub(data.club);
      setShowEditModal(false);
      showToast('Club Dossier updated successfully! ✨');
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handlePlayerSave = async (playerData) => {
    setSaving(true);
    try {
      if (editingPlayer) {
        const res = await clubApi(`/api/club-auth/players/${editingPlayer._id}`, {
          method: 'PUT',
          body: JSON.stringify(playerData)
        });
        showToast(res.message || 'Player updated successfully! ✨');
      } else {
        const res = await clubApi('/api/club-auth/players', {
          method: 'POST',
          body: JSON.stringify(playerData)
        });
        showToast(res.message || 'Player added successfully! ✨');
      }
      setShowPlayerModal(false);
      setEditingPlayer(null);
      
      const { players: playerList } = await clubApi('/api/club-auth/players');
      setPlayers(playerList || []);
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handlePlayerRemove = async (id) => {
    if (!window.confirm('Are you sure you want to remove this player from the squad?')) return;
    try {
      const res = await clubApi(`/api/club-auth/players/${id}`, { method: 'DELETE' });
      showToast(res.message || 'Player removed successfully.');
      const { players: playerList } = await clubApi('/api/club-auth/players');
      setPlayers(playerList || []);
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const handleAnnouncementRead = async (id) => {
    try {
      await clubApi(`/api/club-auth/announcements/${id}/read`, { method: 'POST' });
      setAnnouncements(ann => ann.map(a => a._id === id ? { ...a, isRead: true } : a));
    } catch {}
  };

  const handleLogout = () => {
    localStorage.removeItem('club_token');
    localStorage.removeItem('club_info');
    navigate('/club-login', { replace: true });
  };

  const unreadAnnouncementsCount = announcements.filter(a => !a.isRead).length;

  // Filter squad players
  const filteredPlayers = players.filter(p => {
    const matchSearch = !squadSearch ||
      p.name?.toLowerCase().includes(squadSearch.toLowerCase()) ||
      p.primaryPosition?.toLowerCase().includes(squadSearch.toLowerCase()) ||
      String(p.jerseyNumber).includes(squadSearch);
    const matchStatus = squadStatusFilter === 'All' || p.status === squadStatusFilter;
    const matchPos = squadPosFilter === 'All' || p.primaryPosition === squadPosFilter;
    return matchSearch && matchStatus && matchPos;
  });

  const approvedPlayersCount = players.filter(p => p.status === 'Approved').length;
  const pendingPlayersCount = players.filter(p => p.status === 'Pending').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060e0a] flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <div className="w-16 h-16 border-4 border-emerald-900 border-t-amber-400 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Shield size={20} className="text-emerald-500 animate-pulse" />
            </div>
          </div>
          <p className="text-emerald-400 text-xs font-black uppercase tracking-[0.2em]">Synchronizing Team Portal...</p>
        </div>
      </div>
    );
  }

  if (error || !club) {
    return (
      <div className="min-h-screen bg-[#060e0a] flex items-center justify-center px-4 font-sans">
        <div className="text-center space-y-4 max-w-sm bg-[#0a1c12] border border-red-800/40 p-8 rounded-3xl shadow-2xl">
          <AlertCircle size={44} className="text-red-400 mx-auto" />
          <p className="text-white font-bold text-sm">{error || 'Failed to authenticate team portal session'}</p>
          <div className="flex gap-3 justify-center pt-2">
            <button onClick={fetchProfile} className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs uppercase tracking-wide">
              Retry
            </button>
            <button onClick={handleLogout} className="px-5 py-2.5 border border-emerald-700 text-emerald-300 font-bold rounded-xl text-xs uppercase tracking-wide">
              Sign In Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const InfoRow = ({ icon: Icon, label, value }) => (
    value ? (
      <div className="flex items-start gap-3 py-3 border-b border-emerald-900/30 last:border-0 text-xs">
        <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-900 text-emerald-400 flex-shrink-0">
          <Icon size={14} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] text-emerald-500 uppercase tracking-widest font-black">{label}</p>
          <p className="text-white font-bold mt-0.5 break-words">{value}</p>
        </div>
      </div>
    ) : null
  );

  return (
    <div className="min-h-screen bg-[#060e0a] text-white font-sans flex flex-col selection:bg-amber-500 selection:text-black">
      {/* Top Gold Horizon Accent */}
      <div className="h-1 bg-gradient-to-r from-emerald-900 via-amber-400 to-emerald-900 shadow-[0_0_15px_rgba(245,158,11,0.5)]" />

      {/* ── Brand Header & Navbar ── */}
      <nav className="sticky top-0 z-30 bg-[#09150e]/95 backdrop-blur-xl border-b border-emerald-800/50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-2xl border-2 border-amber-400/60 overflow-hidden bg-emerald-950 flex-shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              {club.clubLogoUrl
                ? <img src={club.clubLogoUrl} alt="Logo" className="w-full h-full object-cover" />
                : <Shield size={22} className="text-amber-400 m-auto mt-2.5" />
              }
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-black text-white text-sm sm:text-base uppercase tracking-wider truncate">
                  {club.clubName}
                </p>
                <span className="hidden sm:inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                  <Check size={10} /> Verified
                </span>
              </div>
              <p className="text-[10px] text-amber-400/90 font-mono uppercase tracking-widest mt-0.5">
                SmartCity Osun State Football League
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/livescore"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-700/60 rounded-xl text-emerald-300 text-xs font-bold uppercase tracking-wider transition-all"
            >
              <Zap size={13} className="text-amber-400" />
              <span>Live Match Center</span>
            </Link>

            <button
              onClick={handleLogout}
              id="club-logout-btn"
              className="flex items-center gap-2 px-3.5 py-2 bg-red-950/30 hover:bg-red-900/40 border border-red-800/40 text-red-300 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Sub Navigation Tabs Bar ── */}
      <div className="bg-[#081710] border-b border-emerald-900/60 sticky top-[69px] z-20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex overflow-x-auto gap-2 py-2.5 custom-scrollbar">
          {[
            { id: 'dashboard', label: 'Overview', icon: LayoutGrid },
            { id: 'squad', label: 'My Squad Roster', icon: Users, badge: players.length || null },
            { id: 'announcements', label: 'League Notices', icon: Bell, badge: unreadAnnouncementsCount || null },
            { id: 'documents', label: 'Resources & Library', icon: FileText, badge: documents.length || null },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-[#071510] shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                    : 'bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/40 hover:text-white border border-emerald-800/30'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-black ${
                    active ? 'bg-[#071510] text-amber-400' : 'bg-amber-500 text-[#071510]'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Main Workspace ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">

        {/* ── Tab 1: Dashboard Overview ── */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            {/* Hero Banner */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#0c2618] via-[#091a11] to-[#05100a] border border-emerald-700/60 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle,rgba(245,158,11,0.12)_0%,transparent_70%)] pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[radial-gradient(circle,rgba(16,185,129,0.15)_0%,transparent_70%)] pointer-events-none" />

              <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6 z-10">
                <div className="space-y-4 max-w-2xl">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-widest shadow-sm">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                      Status: Officially Licensed
                    </span>
                    {club.conference ? (
                      <span className="inline-flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-widest">
                        <Trophy size={12} className="text-amber-400" />
                        {club.conference}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                        Conference Draw Pending
                      </span>
                    )}
                  </div>
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight leading-none">
                      {club.clubName}
                    </h1>
                    <p className="text-emerald-400 text-sm font-medium mt-2 leading-relaxed">
                      Welcome to your dedicated Club Operations Workspace. Manage your official matchday roster, submit verified players, and stay informed on State FA regulations.
                    </p>
                  </div>
                </div>

                {/* Quick Action Badges */}
                <div className="flex flex-row lg:flex-col gap-3">
                  <button
                    onClick={() => { setActiveTab('squad'); setShowPlayerModal(true); }}
                    className="flex-1 lg:flex-none px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-[#071510] font-black rounded-2xl text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2"
                  >
                    <Plus size={15} />
                    <span>Register Player</span>
                  </button>
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="flex-1 lg:flex-none px-5 py-3 bg-white/5 hover:bg-white/10 border border-emerald-700/60 rounded-2xl text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                  >
                    <Edit2 size={14} className="text-amber-400" />
                    <span>Edit Dossier</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick KPI Stat Bento */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Squad Roster', value: players.length, max: '30 Cap', icon: Users, color: 'text-amber-400' },
                { label: 'Licensed Players', value: approvedPlayersCount, max: 'Verified', icon: CheckCircle2, color: 'text-emerald-400' },
                { label: 'Under Review', value: pendingPlayersCount, max: 'Pending FA', icon: Clock, color: 'text-yellow-400' },
                { label: 'Official Documents', value: documents.length, max: 'Available', icon: FileText, color: 'text-blue-400' },
              ].map((kpi, idx) => {
                const Icon = kpi.icon;
                return (
                  <div key={idx} className="bg-[#091710] border border-emerald-800/60 rounded-2xl p-5 relative overflow-hidden shadow-lg group hover:border-emerald-600 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-emerald-500 uppercase tracking-widest font-black">{kpi.label}</span>
                      <Icon size={16} className={kpi.color} />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-white">{kpi.value}</span>
                      <span className="text-[10px] text-emerald-600 font-mono font-bold uppercase">{kpi.max}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Profile Dossier + League Progress Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Profile Card */}
              <div className="lg:col-span-3 bg-[#091710] border border-emerald-800/60 rounded-3xl overflow-hidden shadow-xl">
                <div className="flex items-center justify-between px-6 py-4.5 border-b border-emerald-900/60 bg-emerald-950/40">
                  <div className="flex items-center gap-2.5">
                    <User size={16} className="text-amber-400" />
                    <h2 className="font-black text-white text-xs uppercase tracking-widest">Official Club Record</h2>
                  </div>
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-amber-400 uppercase tracking-widest transition-colors cursor-pointer"
                  >
                    <Edit2 size={13} />
                    Edit Record
                  </button>
                </div>
                <div className="p-6 divide-y divide-emerald-900/40">
                  <InfoRow icon={Trophy} label="Club Name" value={club.clubName} />
                  <InfoRow icon={MapPin} label="Local Government Area (LGA)" value={club.lga} />
                  <InfoRow icon={MapPin} label="Official Home Ground" value={club.homeGround} />
                  <InfoRow icon={Star} label="Founded Year" value={club.foundedYear} />
                  <InfoRow icon={Award} label="League Category" value={club.clubCategory} />
                  <InfoRow icon={Sparkles} label="Traditional Colors" value={club.clubColors} />
                  <InfoRow icon={User} label="Chairman / President" value={club.chairmanName} />
                  <InfoRow icon={User} label="General Secretary" value={club.secretaryName} />
                  <InfoRow icon={Phone} label="Official Contact" value={club.phone} />
                  <InfoRow icon={Mail} label="Club Email" value={club.email} />
                </div>
              </div>

              {/* Status Timeline */}
              <div className="lg:col-span-2 bg-[#091710] border border-emerald-800/60 rounded-3xl p-6 shadow-xl space-y-5">
                <div className="flex items-center gap-2.5 border-b border-emerald-900/60 pb-4">
                  <Calendar size={16} className="text-amber-400" />
                  <h2 className="font-black text-white text-xs uppercase tracking-widest">Season Verification Path</h2>
                </div>
                <StatusTimeline club={club} />
              </div>
            </div>
          </div>
        )}

        {/* ── Tab 2: Squad Management ── */}
        {activeTab === 'squad' && (
          <div className="space-y-6 animate-fade-in">
            {/* Squad Header Bar */}
            <div className="bg-[#091710] border border-emerald-800/60 rounded-3xl p-6 shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-white uppercase tracking-tight">Matchday Squad Roster</h2>
                  <p className="text-xs text-emerald-400 font-medium mt-0.5">
                    Register up to 30 players for the Osun State Football League. All players require FA license approval.
                  </p>
                </div>
                <button
                  onClick={() => { setEditingPlayer(null); setShowPlayerModal(true); }}
                  className="px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-[#071510] font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(245,158,11,0.25)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus size={16} />
                  <span>Add New Player</span>
                </button>
              </div>

              {/* Squad Cap Capacity */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                  <span>Squad Allocation</span>
                  <span>{players.length} / 30 Players Registered ({Math.round((players.length / 30) * 100)}%)</span>
                </div>
                <div className="h-2 bg-[#05100a] border border-emerald-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((players.length / 30) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col md:flex-row items-center gap-3 pt-2">
                <div className="relative flex-1 w-full">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500" />
                  <input
                    type="text"
                    value={squadSearch}
                    onChange={e => setSquadSearch(e.target.value)}
                    placeholder="Search player name, position, or jersey number..."
                    className="w-full bg-[#06120c] border border-emerald-800/80 rounded-xl pl-10 pr-4 py-2.5 text-white text-xs font-medium focus:outline-none focus:border-amber-400 placeholder:text-emerald-700/60"
                  />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <select
                    value={squadStatusFilter}
                    onChange={e => setSquadStatusFilter(e.target.value)}
                    className="bg-[#06120c] border border-emerald-800/80 rounded-xl px-3 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-amber-400"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                    <option value="Rejected">Rejected</option>
                  </select>

                  <select
                    value={squadPosFilter}
                    onChange={e => setSquadPosFilter(e.target.value)}
                    className="bg-[#06120c] border border-emerald-800/80 rounded-xl px-3 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-amber-400"
                  >
                    <option value="All">All Positions</option>
                    <option value="Goalkeeper">Goalkeeper</option>
                    <option value="Center Back">Center Back</option>
                    <option value="Full Back (Left)">Full Back (Left)</option>
                    <option value="Full Back (Right)">Full Back (Right)</option>
                    <option value="Defensive Midfielder">Defensive Midfielder</option>
                    <option value="Central Midfielder">Central Midfielder</option>
                    <option value="Attacking Midfielder">Attacking Midfielder</option>
                    <option value="Winger (Left)">Winger (Left)</option>
                    <option value="Winger (Right)">Winger (Right)</option>
                    <option value="Striker / Center Forward">Striker</option>
                  </select>

                  <div className="flex border border-emerald-800 rounded-xl overflow-hidden bg-[#06120c]">
                    <button
                      onClick={() => setViewMode('cards')}
                      className={`p-2 transition-colors ${viewMode === 'cards' ? 'bg-amber-500 text-[#071510]' : 'text-emerald-400 hover:text-white'}`}
                      title="Cards View"
                    >
                      <LayoutGrid size={15} />
                    </button>
                    <button
                      onClick={() => setViewMode('table')}
                      className={`p-2 transition-colors ${viewMode === 'table' ? 'bg-amber-500 text-[#071510]' : 'text-emerald-400 hover:text-white'}`}
                      title="Table View"
                    >
                      <List size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Squad Content */}
            {filteredPlayers.length === 0 ? (
              <div className="bg-[#091710] border border-emerald-800/60 rounded-3xl py-16 text-center space-y-4 shadow-xl">
                <div className="w-16 h-16 bg-emerald-950 rounded-2xl flex items-center justify-center mx-auto border border-emerald-800 text-emerald-500">
                  <Users size={28} />
                </div>
                <div className="max-w-sm mx-auto space-y-1">
                  <p className="font-bold text-white uppercase tracking-wider text-sm">No players matched your criteria</p>
                  <p className="text-xs text-emerald-600 font-medium">Try clearing your filters or register a new player using the button above.</p>
                </div>
              </div>
            ) : viewMode === 'cards' ? (
              /* Visual Cards Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredPlayers.map(p => (
                  <div
                    key={p._id}
                    className="bg-[#091710] border border-emerald-800/60 hover:border-emerald-600/80 rounded-2xl p-5 space-y-4 shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-14 h-14 rounded-2xl border-2 border-amber-400/50 bg-emerald-950 overflow-hidden flex-shrink-0 shadow-md">
                          {p.photoUrl ? (
                            <img src={p.photoUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <User className="text-emerald-600 m-auto mt-4" size={20} />
                          )}
                          <span className="absolute bottom-0 right-0 bg-[#071510] text-amber-400 font-mono font-black text-[9px] px-1.5 py-0.5 rounded-tl-md border-t border-l border-emerald-800">
                            #{p.jerseyNumber}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-white text-sm truncate">{p.name}</p>
                          <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mt-0.5">
                            {p.primaryPosition}
                          </p>
                          <p className="text-[10px] text-emerald-600 font-mono mt-0.5">
                            {p.age} Yrs · {p.preferredFoot} Foot
                          </p>
                        </div>
                      </div>

                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider ${
                        p.status === 'Approved' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' :
                        p.status === 'Rejected' ? 'bg-red-500/20 border-red-500/40 text-red-300' :
                        'bg-amber-500/20 border-amber-500/40 text-amber-300'
                      }`}>
                        {p.status}
                      </span>
                    </div>

                    {p.status === 'Rejected' && p.rejectionReason && (
                      <div className="bg-red-950/30 border border-red-800/40 p-2.5 rounded-xl text-[10px] text-red-300">
                        <span className="font-bold uppercase tracking-widest block text-red-400">FA Reason:</span>
                        {p.rejectionReason}
                      </div>
                    )}

                    <div className="flex gap-2 pt-2 border-t border-emerald-900/40">
                      <button
                        onClick={() => setSelectedPlayerForView(p)}
                        className="flex-1 py-2 bg-emerald-950 hover:bg-emerald-800/70 border border-emerald-800/60 text-emerald-300 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Eye size={13} /> Dossier
                      </button>
                      <button
                        onClick={() => { setEditingPlayer(p); setShowPlayerModal(true); }}
                        className="p-2 bg-emerald-950 hover:bg-emerald-800/70 border border-emerald-800/60 text-amber-400 hover:text-white rounded-xl transition-colors cursor-pointer"
                        title="Edit Details"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handlePlayerRemove(p._id)}
                        className="p-2 bg-red-950/30 hover:bg-red-900/60 border border-red-800/40 text-red-400 hover:text-white rounded-xl transition-colors cursor-pointer"
                        title="Remove Player"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Table View */
              <div className="bg-[#091710] border border-emerald-800/60 rounded-3xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-emerald-950/60 border-b border-emerald-800 text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                        <th className="px-6 py-4">Player</th>
                        <th className="px-4 py-4">Position</th>
                        <th className="px-4 py-4">Age / Foot</th>
                        <th className="px-4 py-4">Jersey</th>
                        <th className="px-4 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-900/40">
                      {filteredPlayers.map(p => (
                        <tr key={p._id} className="hover:bg-emerald-950/40 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl border border-emerald-700 bg-emerald-900 overflow-hidden flex-shrink-0">
                                {p.photoUrl
                                  ? <img src={p.photoUrl} alt="" className="w-full h-full object-cover" />
                                  : <User className="text-emerald-500 m-auto mt-2.5" size={14} />
                                }
                              </div>
                              <div>
                                <p className="font-bold text-white text-sm">{p.name}</p>
                                <p className="text-[10px] text-emerald-600 font-mono">{p.lgaOfOrigin}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-xs font-bold text-emerald-300">{p.primaryPosition}</td>
                          <td className="px-4 py-4 text-xs font-mono text-emerald-400">{p.age} Yrs · {p.preferredFoot}</td>
                          <td className="px-4 py-4 text-sm font-black text-amber-400 font-mono">#{p.jerseyNumber}</td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black border uppercase tracking-wider ${
                              p.status === 'Approved' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' :
                              p.status === 'Rejected' ? 'bg-red-500/20 border-red-500/40 text-red-300' :
                              'bg-amber-500/20 border-amber-500/40 text-amber-300'
                            }`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setSelectedPlayerForView(p)}
                                className="p-2 bg-emerald-950 hover:bg-emerald-800 border border-emerald-800 text-emerald-300 rounded-xl"
                                title="View Dossier"
                              >
                                <Eye size={13} />
                              </button>
                              <button
                                onClick={() => { setEditingPlayer(p); setShowPlayerModal(true); }}
                                className="p-2 bg-emerald-950 hover:bg-emerald-800 border border-emerald-800 text-amber-400 rounded-xl"
                                title="Edit"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => handlePlayerRemove(p._id)}
                                className="p-2 bg-red-950/30 hover:bg-red-900 border border-red-800/40 text-red-400 rounded-xl"
                                title="Remove"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Tab 3: Announcements ── */}
        {activeTab === 'announcements' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-[#091710] border border-emerald-800/60 rounded-3xl p-6 shadow-xl">
              <h2 className="text-xl font-black text-white uppercase tracking-tight">Osun State FA Bulletins</h2>
              <p className="text-xs text-emerald-400 font-medium mt-0.5">
                Official notices, tournament memos, and compliance requirements direct from the league commissioner.
              </p>
            </div>

            {announcements.length === 0 ? (
              <div className="bg-[#091710] border border-emerald-800/60 rounded-3xl py-16 text-center space-y-4 shadow-xl">
                <div className="w-16 h-16 bg-emerald-950 rounded-2xl flex items-center justify-center mx-auto border border-emerald-800 text-emerald-500">
                  <Bell size={26} />
                </div>
                <div className="space-y-1 max-w-xs mx-auto">
                  <p className="font-bold text-white uppercase tracking-wider text-sm">No bulletins posted</p>
                  <p className="text-xs text-emerald-600 font-medium">No announcements have been dispatched by the league yet.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {announcements.map(ann => (
                  <div
                    key={ann._id}
                    onClick={() => handleAnnouncementRead(ann._id)}
                    className={`bg-[#091710] border rounded-3xl p-6 transition-all duration-300 shadow-xl cursor-pointer ${
                      ann.isRead
                        ? 'border-emerald-900/60 opacity-80 hover:opacity-100'
                        : 'border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.1)]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {ann.pinned && (
                            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1">
                              📌 Pinned Bulletin
                            </span>
                          )}
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                            ann.priority === 'High' ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
                            ann.priority === 'Medium' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                            'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          }`}>
                            {ann.priority || 'Normal'} Priority
                          </span>
                          {!ann.isRead && (
                            <span className="bg-amber-400 text-[#071510] text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full animate-pulse">
                              New
                            </span>
                          )}
                        </div>
                        <h3 className="font-black text-white text-base leading-snug">{ann.title}</h3>
                        <p className="text-emerald-200/90 text-xs leading-relaxed font-medium">{ann.content}</p>
                      </div>
                      <span className="text-[10px] text-emerald-600 font-mono font-bold whitespace-nowrap">
                        {new Date(ann.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Tab 4: Documents & Resources ── */}
        {activeTab === 'documents' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-[#091710] border border-emerald-800/60 rounded-3xl p-6 shadow-xl">
              <h2 className="text-xl font-black text-white uppercase tracking-tight">Official League Library</h2>
              <p className="text-xs text-emerald-400 font-medium mt-0.5">
                Download tournament regulations, match protocol sheets, transfer forms, and medical waivers.
              </p>
            </div>

            {documents.length === 0 ? (
              <div className="bg-[#091710] border border-emerald-800/60 rounded-3xl py-16 text-center space-y-4 shadow-xl">
                <div className="w-16 h-16 bg-emerald-950 rounded-2xl flex items-center justify-center mx-auto border border-emerald-800 text-emerald-500">
                  <FileText size={26} />
                </div>
                <div className="space-y-1 max-w-xs mx-auto">
                  <p className="font-bold text-white uppercase tracking-wider text-sm">Library is empty</p>
                  <p className="text-xs text-emerald-600 font-medium">No official resources have been published yet.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {documents.map(doc => (
                  <div key={doc._id} className="bg-[#091710] border border-emerald-800/60 hover:border-emerald-600/80 rounded-3xl p-6 flex items-start gap-4 transition-all duration-300 shadow-xl group">
                    <div className="w-12 h-12 bg-amber-500/15 border border-amber-500/30 text-amber-400 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                      <FileText size={20} />
                    </div>
                    <div className="flex-1 min-w-0 space-y-2.5">
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                          {doc.type}
                        </span>
                      </div>
                      <h3 className="font-bold text-white text-sm leading-tight truncate">{doc.title}</h3>
                      {doc.description && (
                        <p className="text-xs text-emerald-400/90 font-medium leading-relaxed line-clamp-2">{doc.description}</p>
                      )}
                      <div className="flex items-center justify-between pt-2 border-t border-emerald-900/40">
                        <span className="text-[10px] text-emerald-600 font-mono">{doc.fileSize} · {new Date(doc.uploadDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</span>
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-amber-500 hover:bg-amber-400 text-[#071510] font-black px-3.5 py-1.5 rounded-xl text-[10px] uppercase tracking-widest transition-colors flex items-center gap-1 shadow-md"
                        >
                          Download <ArrowUpRight size={11} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          club={club}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveProfile}
          saving={saving}
        />
      )}

      {/* Player Form Modal */}
      {showPlayerModal && (
        <PlayerFormModal
          player={editingPlayer}
          onClose={() => { setShowPlayerModal(false); setEditingPlayer(null); }}
          onSave={handlePlayerSave}
          saving={saving}
        />
      )}

      {/* Player View Modal */}
      {selectedPlayerForView && (
        <PlayerViewModal
          player={selectedPlayerForView}
          onClose={() => setSelectedPlayerForView(null)}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[70] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-xs font-black uppercase tracking-widest transition-all ${
          toast.type === 'error'
            ? 'bg-red-600 text-white border border-red-400'
            : 'bg-emerald-600 text-white border border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.4)]'
        }`}>
          {toast.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
          {toast.message}
        </div>
      )}
    </div>
  );
}
