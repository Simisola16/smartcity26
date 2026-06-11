import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LogOut, User, CheckCircle2, Clock, ChevronRight, Bell, FileText,
  Phone, Mail, Globe, MapPin, Users, Edit2, X, Save, Upload,
  AlertCircle, RefreshCw, Shield, Calendar, Trophy, Star, Plus,
  Eye, Trash2, BookOpen, AlertTriangle, ArrowLeft, ArrowUpRight
} from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

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
    { label: 'Registration Submitted', done: true, icon: FileText },
    { label: 'Reviewed by Osun FA', done: true, icon: Shield },
    { label: 'Approved', done: true, icon: CheckCircle2, highlight: true },
    { label: 'Conference Assignment', done: hasConference, pending: !hasConference, icon: Trophy,
      sub: hasConference ? club.conference : 'Pending confirmation' },
    { label: 'Season Kickoff', done: false, pending: true, icon: Calendar },
  ];
  return (
    <div className="space-y-0">
      {steps.map((step, idx) => {
        const Icon = step.icon;
        return (
          <div key={idx} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all ${
                step.highlight
                  ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.4)]'
                  : step.done
                  ? 'bg-emerald-700 border-emerald-600'
                  : 'bg-[#071510] border-emerald-900'
              }`}>
                {step.done
                  ? <Icon size={14} className={step.highlight ? 'text-white' : 'text-emerald-300'} />
                  : <Clock size={14} className="text-emerald-700" />
                }
              </div>
              {idx < steps.length - 1 && (
                <div className={`w-0.5 h-8 ${step.done ? 'bg-emerald-700' : 'bg-emerald-950'}`} />
              )}
            </div>
            <div className="pb-4 flex-1 min-w-0">
              <p className={`text-sm font-bold mt-1 ${step.done ? 'text-white' : 'text-emerald-700'}`}>
                {step.done ? '✅' : '⏳'} {step.label}
              </p>
              {step.sub && (
                <p className={`text-xs mt-0.5 font-medium ${step.done ? 'text-amber-400' : 'text-emerald-600'}`}>
                  {step.sub}
                </p>
              )}
            </div>
          </div>
        );
      })}
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

  const Field = ({ label, id, type = 'text', value, onChange, icon: Icon }) => (
    <div>
      <label htmlFor={id} className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1.5">{label}</label>
      <div className="relative">
        {Icon && <Icon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600" />}
        <input
          id={id}
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          className={`w-full bg-[#071510] border border-emerald-800 rounded-xl py-3 text-white text-sm font-medium focus:outline-none focus:border-amber-500 placeholder:text-emerald-700 transition-colors ${Icon ? 'pl-9 pr-4' : 'px-4'}`}
        />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#0a1f14] border border-emerald-800 rounded-2xl shadow-2xl overflow-hidden mb-8">
        <div className="flex items-center justify-between p-6 border-b border-emerald-800 bg-emerald-950 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-500/20 rounded-xl flex items-center justify-center">
              <Edit2 size={16} className="text-amber-400" />
            </div>
            <h2 className="font-black text-white text-sm uppercase tracking-widest">Edit Profile</h2>
          </div>
          <button onClick={onClose} className="text-emerald-400 hover:text-white hover:bg-emerald-800 rounded-lg p-2 transition-colors">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-2">Club Logo</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full border-2 border-emerald-700 overflow-hidden bg-emerald-900 flex items-center justify-center flex-shrink-0">
                {logoPreview
                  ? <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                  : <Shield size={24} className="text-emerald-600" />
                }
              </div>
              <label className="cursor-pointer flex items-center gap-2 bg-emerald-800 hover:bg-emerald-700 text-emerald-300 hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-colors">
                <Upload size={14} />
                Change Logo
                <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
              </label>
            </div>
          </div>

          <Field label="Chairman / President" id="chairman" value={form.chairmanName} onChange={v => setForm(f => ({...f, chairmanName: v}))} icon={User} />
          <Field label="Secretary" id="secretary" value={form.secretaryName} onChange={v => setForm(f => ({...f, secretaryName: v}))} icon={User} />
          <Field label="Phone" id="phone" type="tel" value={form.phone} onChange={v => setForm(f => ({...f, phone: v}))} icon={Phone} />
          <Field label="WhatsApp" id="whatsapp" type="tel" value={form.whatsapp} onChange={v => setForm(f => ({...f, whatsapp: v}))} icon={Phone} />
          <Field label="Email" id="email" type="email" value={form.email} onChange={v => setForm(f => ({...f, email: v}))} icon={Mail} />
          <Field label="Website / Social Link" id="social" value={form.websiteOrSocial} onChange={v => setForm(f => ({...f, websiteOrSocial: v}))} icon={Globe} />

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-emerald-700 text-emerald-300 rounded-xl hover:border-emerald-500 transition-colors font-bold text-sm uppercase tracking-wide">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-[2] py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-emerald-950 font-black uppercase tracking-widest rounded-xl transition-colors flex items-center justify-center gap-2 text-sm font-bold">
              {saving ? <RefreshCw size={15} className="animate-spin" /> : <Save size={15} />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Player Form Modal (Add / Edit) ──────────────────────────────────────────
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
      setPrev(file.name); // document name for pdf
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
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-[#0a1f14] border border-emerald-800 rounded-2xl shadow-2xl overflow-hidden mb-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-emerald-800 bg-emerald-950 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-500/20 rounded-xl flex items-center justify-center">
              <Plus size={16} className="text-amber-400" />
            </div>
            <h2 className="font-black text-white text-sm uppercase tracking-widest">
              {player ? 'Edit Player Details' : 'Add New Player'}
            </h2>
          </div>
          <button onClick={onClose} className="text-emerald-400 hover:text-white hover:bg-emerald-800 rounded-lg p-2 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* A: Personal Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-amber-400 uppercase tracking-widest border-b border-emerald-800/60 pb-2">
              Section A: Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Full Name *</label>
                <input
                  type="text" required value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full bg-[#071510] border border-emerald-800 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">DOB *</label>
                  <input
                    type="date" required value={form.dob}
                    onChange={e => setForm({...form, dob: e.target.value})}
                    className="w-full bg-[#071510] border border-emerald-800 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Age (Auto)</label>
                  <input
                    type="text" disabled value={age}
                    className="w-full bg-emerald-950/60 border border-emerald-900 rounded-xl px-4 py-3 text-emerald-500 text-sm font-bold text-center"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Gender *</label>
                <select
                  value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}
                  className="w-full bg-[#071510] border border-emerald-800 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-amber-500"
                >
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Nationality</label>
                <input
                  type="text" value={form.nationality}
                  onChange={e => setForm({...form, nationality: e.target.value})}
                  className="w-full bg-[#071510] border border-emerald-800 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">State of Origin *</label>
                <select
                  required value={form.stateOfOrigin}
                  onChange={e => setForm({...form, stateOfOrigin: e.target.value})}
                  className="w-full bg-[#071510] border border-emerald-800 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-amber-500"
                >
                  <option value="">Select State</option>
                  {nigerianStates.map(st => <option key={st} value={st}>{st}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">LGA of Origin *</label>
                <input
                  type="text" required value={form.lgaOfOrigin}
                  onChange={e => setForm({...form, lgaOfOrigin: e.target.value})}
                  className="w-full bg-[#071510] border border-emerald-800 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Home Address *</label>
                <textarea
                  required value={form.homeAddress} rows={2}
                  onChange={e => setForm({...form, homeAddress: e.target.value})}
                  className="w-full bg-[#071510] border border-emerald-800 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-amber-500 placeholder:text-emerald-800"
                  placeholder="Street Address, City"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Phone Number *</label>
                <input
                  type="tel" required value={form.phone}
                  onChange={e => setForm({...form, phone: e.target.value})}
                  className="w-full bg-[#071510] border border-emerald-800 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* B: Football Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-amber-400 uppercase tracking-widest border-b border-emerald-800/60 pb-2">
              Section B: Football Information
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Jersey Number *</label>
                <input
                  type="number" required value={form.jerseyNumber}
                  onChange={e => setForm({...form, jerseyNumber: e.target.value})}
                  className="w-full bg-[#071510] border border-emerald-800 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Primary Position *</label>
                <select
                  required value={form.primaryPosition}
                  onChange={e => setForm({...form, primaryPosition: e.target.value})}
                  className="w-full bg-[#071510] border border-emerald-800 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-amber-500"
                >
                  <option>Goalkeeper</option>
                  <option>Defender</option>
                  <option>Midfielder</option>
                  <option>Winger</option>
                  <option>Forward</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Secondary Position</label>
                <select
                  value={form.secondaryPosition}
                  onChange={e => setForm({...form, secondaryPosition: e.target.value})}
                  className="w-full bg-[#071510] border border-emerald-800 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-amber-500"
                >
                  <option value="">None</option>
                  <option>Goalkeeper</option>
                  <option>Defender</option>
                  <option>Midfielder</option>
                  <option>Winger</option>
                  <option>Forward</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Preferred Foot *</label>
                <select
                  required value={form.preferredFoot}
                  onChange={e => setForm({...form, preferredFoot: e.target.value})}
                  className="w-full bg-[#071510] border border-emerald-800 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-amber-500"
                >
                  <option>Left</option>
                  <option>Right</option>
                  <option>Both</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Height (cm) *</label>
                <input
                  type="number" required value={form.height}
                  onChange={e => setForm({...form, height: e.target.value})}
                  className="w-full bg-[#071510] border border-emerald-800 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Weight (kg) *</label>
                <input
                  type="number" required value={form.weight}
                  onChange={e => setForm({...form, weight: e.target.value})}
                  className="w-full bg-[#071510] border border-emerald-800 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="col-span-2 md:col-span-3">
                <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Years of Playing Experience *</label>
                <input
                  type="number" required value={form.experience}
                  onChange={e => setForm({...form, experience: e.target.value})}
                  className="w-full bg-[#071510] border border-emerald-800 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* C: Documents & Media */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-amber-400 uppercase tracking-widest border-b border-emerald-800/60 pb-2">
              Section C: Documents & Media
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Photo Upload */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">Passport Photo *</label>
                <div className="border border-dashed border-emerald-800 rounded-xl p-4 text-center bg-emerald-950/40 relative">
                  {photoPreview ? (
                    <div className="space-y-2">
                      <img src={photoPreview} alt="" className="w-16 h-16 object-cover rounded-lg mx-auto border border-emerald-700" />
                      <p className="text-[10px] text-emerald-500 truncate">Passport Selected</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload size={18} className="text-emerald-700 mx-auto" />
                      <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Choose Image</p>
                    </div>
                  )}
                  <input
                    type="file" accept="image/*" required={!player}
                    onChange={e => handleFile(e, setPhotoPreview, setPhotoBase64)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* DOB / NIN Upload */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">Birth Cert / NIN *</label>
                <div className="border border-dashed border-emerald-800 rounded-xl p-4 text-center bg-emerald-950/40 relative">
                  {docPreview ? (
                    <div className="space-y-2">
                      <FileText size={18} className="text-amber-500 mx-auto" />
                      <p className="text-[10px] text-emerald-500 truncate max-w-[120px] mx-auto">{docPreview.slice(-20)}</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload size={18} className="text-emerald-700 mx-auto" />
                      <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Choose Doc</p>
                    </div>
                  )}
                  <input
                    type="file" accept="image/*,application/pdf" required={!player}
                    onChange={e => handleFile(e, setDocPreview, setDocBase64)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Prev Club Letter Upload */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">Transfer Letter (Optional)</label>
                <div className="border border-dashed border-emerald-800 rounded-xl p-4 text-center bg-emerald-950/40 relative">
                  {transferPreview ? (
                    <div className="space-y-2">
                      <FileText size={18} className="text-amber-500 mx-auto" />
                      <p className="text-[10px] text-emerald-500 truncate max-w-[120px] mx-auto">{transferPreview.slice(-20)}</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload size={18} className="text-emerald-700 mx-auto" />
                      <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Choose Doc</p>
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
            <div>
              <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Previous Club Name (If any)</label>
              <input
                type="text" value={form.prevClub}
                onChange={e => setForm({...form, prevClub: e.target.value})}
                placeholder="E.g. Sunshine Stars Academy"
                className="w-full bg-[#071510] border border-emerald-800 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* D: Emergency Contact */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-amber-400 uppercase tracking-widest border-b border-emerald-800/60 pb-2">
              Section D: Emergency Contact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Guardian Name *</label>
                <input
                  type="text" required value={form.guardianName}
                  onChange={e => setForm({...form, guardianName: e.target.value})}
                  className="w-full bg-[#071510] border border-emerald-800 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Relationship *</label>
                <select
                  required value={form.guardianRelationship}
                  onChange={e => setForm({...form, guardianRelationship: e.target.value})}
                  className="w-full bg-[#071510] border border-emerald-800 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-amber-500"
                >
                  <option>Parent</option>
                  <option>Sibling</option>
                  <option>Spouse</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Guardian Phone *</label>
                <input
                  type="tel" required value={form.guardianPhone}
                  onChange={e => setForm({...form, guardianPhone: e.target.value})}
                  className="w-full bg-[#071510] border border-emerald-800 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-emerald-700 text-emerald-300 rounded-xl hover:border-emerald-500 transition-colors font-bold text-sm uppercase tracking-wide">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-[2] py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-emerald-950 font-black uppercase tracking-widest rounded-xl transition-colors flex items-center justify-center gap-2 text-sm font-bold">
              {saving ? <RefreshCw size={15} className="animate-spin" /> : <Save size={15} />}
              {saving ? 'Submitting...' : player ? 'Save Changes' : 'Add Player to Squad'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Player View Modal ───────────────────────────────────────────────────────
function PlayerViewModal({ player, onClose }) {
  const cfg = {
    Pending: { badge: 'bg-amber-500/20 border-amber-500/40 text-amber-300', dot: 'bg-amber-400' },
    Approved: { badge: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300', dot: 'bg-emerald-400' },
    Rejected: { badge: 'bg-red-500/20 border-red-500/40 text-red-300', dot: 'bg-red-400' },
  }[player.status] || { badge: 'bg-neutral-800 border-neutral-700 text-neutral-300', dot: 'bg-neutral-400' };

  const LabelVal = ({ label, value }) => (
    value ? (
      <div className="py-2.5 border-b border-emerald-900/40 last:border-0 flex justify-between gap-4 text-xs font-medium">
        <span className="text-emerald-500 uppercase tracking-wide">{label}</span>
        <span className="text-white text-right break-words max-w-[200px]">{value}</span>
      </div>
    ) : null
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0a1f14] border border-emerald-800 rounded-2xl shadow-2xl overflow-hidden mb-8">
        <div className="p-6 bg-emerald-950 border-b border-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${cfg.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
              {player.status}
            </span>
          </div>
          <button onClick={onClose} className="text-emerald-400 hover:text-white p-2 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 text-center space-y-4">
          <div className="w-24 h-24 rounded-full border-4 border-amber-500/40 mx-auto overflow-hidden bg-emerald-900 shadow-lg">
            {player.photoUrl
              ? <img src={player.photoUrl} alt="" className="w-full h-full object-cover" />
              : <User size={40} className="text-emerald-700 m-auto mt-6" />
            }
          </div>
          <div>
            <h3 className="text-lg font-black text-white">{player.name}</h3>
            <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mt-1">Jersey #{player.jerseyNumber} · {player.primaryPosition}</p>
          </div>

          {player.status === 'Rejected' && player.rejectionReason && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-left">
              <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">❌ Rejection Reason</p>
              <p className="text-xs text-red-200/90 leading-relaxed font-medium">{player.rejectionReason}</p>
            </div>
          )}

          <div className="bg-emerald-950/40 border border-emerald-900 rounded-xl p-4 text-left divide-y divide-emerald-900/30">
            <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2">Player Profile</h4>
            <LabelVal label="DOB" value={player.dob} />
            <LabelVal label="Age" value={player.age} />
            <LabelVal label="Gender" value={player.gender} />
            <LabelVal label="Nationality" value={player.nationality} />
            <LabelVal label="Origin LGA / State" value={`${player.lgaOfOrigin}, ${player.stateOfOrigin}`} />
            <LabelVal label="Home Address" value={player.homeAddress} />
            <LabelVal label="Phone" value={player.phone} />
            <LabelVal label="Preferred Foot" value={player.preferredFoot} />
            <LabelVal label="Height / Weight" value={`${player.height} cm / ${player.weight} kg`} />
            <LabelVal label="Playing Experience" value={`${player.experience} Years`} />
            <LabelVal label="Previous Club" value={player.prevClub} />
            <LabelVal label="Emergency Contact" value={player.guardianName} />
            <LabelVal label="Relationship" value={player.guardianRelationship} />
            <LabelVal label="Guardian Phone" value={player.guardianPhone} />
          </div>

          {/* Document download buttons */}
          <div className="flex flex-col gap-2 pt-2">
            {player.docUrl && (
              <a href={player.docUrl} target="_blank" rel="noreferrer" className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 text-emerald-200 hover:text-white font-bold rounded-xl text-xs uppercase tracking-wide transition-colors flex items-center justify-center gap-2">
                <FileText size={14} /> View Birth Cert / NIN
              </a>
            )}
            {player.transferLetterUrl && (
              <a href={player.transferLetterUrl} target="_blank" rel="noreferrer" className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 text-emerald-200 hover:text-white font-bold rounded-xl text-xs uppercase tracking-wide transition-colors flex items-center justify-center gap-2">
                <FileText size={14} /> View Transfer Letter
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
      showToast('Profile updated successfully! ✨');
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
        // Edit player
        const res = await clubApi(`/api/club-auth/players/${editingPlayer._id}`, {
          method: 'PUT',
          body: JSON.stringify(playerData)
        });
        showToast(res.message || 'Player updated successfully! ✨');
      } else {
        // Add player
        const res = await clubApi('/api/club-auth/players', {
          method: 'POST',
          body: JSON.stringify(playerData)
        });
        showToast(res.message || 'Player added successfully! ✨');
      }
      setShowPlayerModal(false);
      setEditingPlayer(null);
      
      // Refresh players
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
      // Refresh players
      const { players: playerList } = await clubApi('/api/club-auth/players');
      setPlayers(playerList || []);
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const handleAnnouncementRead = async (id) => {
    try {
      await clubApi(`/api/club-auth/announcements/${id}/read`, { method: 'POST' });
      // Update local unread state immediately
      setAnnouncements(ann => ann.map(a => a._id === id ? { ...a, isRead: true } : a));
    } catch {}
  };

  const handleLogout = () => {
    localStorage.removeItem('club_token');
    localStorage.removeItem('club_info');
    navigate('/club-login', { replace: true });
  };

  // Unread announcements badge count
  const unreadAnnouncementsCount = announcements.filter(a => !a.isRead).length;

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-[#071510] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-800 border-t-amber-400 rounded-full animate-spin mx-auto" />
          <p className="text-emerald-400 text-sm font-bold uppercase tracking-widest">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error || !club) {
    return (
      <div className="min-h-screen bg-[#071510] flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-sm">
          <AlertCircle size={48} className="text-red-400 mx-auto" />
          <p className="text-white font-bold">{error || 'Failed to load dashboard'}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={fetchProfile} className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm uppercase tracking-wide">Retry</button>
            <button onClick={handleLogout} className="px-5 py-2.5 border border-emerald-700 text-emerald-300 font-bold rounded-xl text-sm uppercase tracking-wide">Login Again</button>
          </div>
        </div>
      </div>
    );
  }

  const InfoRow = ({ icon: Icon, label, value }) => (
    value ? (
      <div className="flex items-start gap-3 py-3 border-b border-emerald-900/40 last:border-0 text-sm">
        <Icon size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-[10px] text-emerald-600 uppercase tracking-widest font-bold">{label}</p>
          <p className="text-white font-medium mt-0.5 break-words">{value}</p>
        </div>
      </div>
    ) : null
  );

  return (
    <div className="min-h-screen bg-[#071510] text-white font-sans flex flex-col">

      {/* Top accent */}
      <div className="h-1 bg-gradient-to-r from-emerald-900 via-amber-500 to-emerald-900" />

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-30 bg-[#0a1f14]/95 backdrop-blur border-b border-emerald-800/40 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full border-2 border-amber-400/60 overflow-hidden bg-emerald-900 flex-shrink-0">
              {club.clubLogoUrl
                ? <img src={club.clubLogoUrl} alt="Logo" className="w-full h-full object-cover" />
                : <Shield size={20} className="text-emerald-400 m-auto mt-2" />
              }
            </div>
            <div className="min-w-0">
              <p className="font-black text-white text-sm uppercase tracking-wider truncate">{club.clubName}</p>
              <p className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">SmartCity League Portal</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            id="club-logout-btn"
            className="flex items-center gap-2 px-4 py-2 bg-red-600/10 hover:bg-red-600/30 border border-red-600/30 text-red-400 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wide transition-all"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>

      {/* ── Sub Navigation Tabs ── */}
      <div className="bg-[#081a11] border-b border-emerald-900/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex overflow-x-auto gap-2 py-2.5 custom-scrollbar">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: User },
            { id: 'squad', label: 'My Squad', icon: Users, badge: players.length || null },
            { id: 'announcements', label: 'Announcements', icon: Bell, badge: unreadAnnouncementsCount || null },
            { id: 'documents', label: 'Documents', icon: FileText, badge: documents.length || null },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  active
                    ? 'bg-amber-500 text-emerald-950 shadow-md shadow-amber-500/10'
                    : 'bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/40 hover:text-white border border-emerald-900/30'
                }`}
              >
                <Icon size={14} />
                {tab.label}
                {tab.badge && (
                  <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-black ${
                    active ? 'bg-emerald-950 text-amber-400' : 'bg-amber-500 text-emerald-950'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Content ── */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">

        {/* ── Tab 1: Dashboard Overview ── */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-950 to-[#071510] border border-emerald-800/40 rounded-2xl p-6 sm:p-8">
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                      Approved
                    </span>
                    {club.conference && (
                      <span className="inline-flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                        <Trophy size={11} />
                        {club.conference}
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    Welcome, {club.clubName} ⚽
                  </h1>
                  <p className="text-emerald-400 text-sm font-medium">
                    Manage your player roster, review communications, and download templates.
                  </p>
                </div>
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-amber-400/40 overflow-hidden bg-emerald-800 flex-shrink-0 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                  {club.clubLogoUrl
                    ? <img src={club.clubLogoUrl} alt="Logo" className="w-full h-full object-cover" />
                    : <Shield size={36} className="text-emerald-400 m-auto mt-6" />
                  }
                </div>
              </div>
            </div>

            {/* Profile + Timeline Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Profile Card */}
              <div className="lg:col-span-3 bg-emerald-950/60 border border-emerald-900/60 rounded-2xl overflow-hidden shadow-lg">
                <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-900/60">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-amber-400" />
                    <h2 className="font-black text-white text-sm uppercase tracking-widest">Club Profile</h2>
                  </div>
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-amber-400 uppercase tracking-widest transition-colors"
                  >
                    <Edit2 size={13} />
                    Edit
                  </button>
                </div>
                <div className="px-6 py-2 divide-y divide-emerald-900/30">
                  <InfoRow icon={Trophy} label="Club Name" value={club.clubName} />
                  <InfoRow icon={MapPin} label="LGA" value={club.lga} />
                  <InfoRow icon={MapPin} label="Home Ground" value={club.homeGround} />
                  <InfoRow icon={Star} label="Founded Year" value={club.foundedYear} />
                  <InfoRow icon={Star} label="League Category" value={club.clubCategory} />
                  <InfoRow icon={Star} label="Colors" value={club.clubColors} />
                  <InfoRow icon={Users} label="Chairman" value={club.chairmanName} />
                  <InfoRow icon={Users} label="Secretary" value={club.secretaryName} />
                  <InfoRow icon={Users} label="Head Coach" value={club.headCoach} />
                  <InfoRow icon={Phone} label="Phone" value={club.phone} />
                  <InfoRow icon={Phone} label="WhatsApp" value={club.whatsapp} />
                  <InfoRow icon={Mail} label="Email Address" value={club.email} />
                  <InfoRow icon={Globe} label="Website / Social" value={club.websiteOrSocial} />
                </div>
              </div>

              {/* Status Timeline */}
              <div className="lg:col-span-2 bg-emerald-950/60 border border-emerald-900/60 rounded-2xl overflow-hidden shadow-lg">
                <div className="flex items-center gap-2 px-6 py-4 border-b border-emerald-900/60">
                  <CheckCircle2 size={16} className="text-amber-400" />
                  <h2 className="font-black text-white text-sm uppercase tracking-widest">Status Timeline</h2>
                </div>
                <div className="px-6 py-6">
                  <StatusTimeline club={club} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab 2: My Squad (Player Management) ── */}
        {activeTab === 'squad' && (
          <div className="space-y-6 animate-fade-in">
            {/* Squad Stats Bar */}
            <div className="bg-emerald-950/40 border border-emerald-900/60 rounded-2xl p-6 shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-white uppercase tracking-tight">Squad Management</h2>
                  <p className="text-xs text-emerald-500 font-medium">Add, update, and manage your club players.</p>
                </div>
                <button
                  onClick={() => { setEditingPlayer(null); setShowPlayerModal(true); }}
                  className="bg-amber-500 hover:bg-amber-400 text-emerald-950 font-black px-5 py-3 rounded-xl uppercase tracking-widest text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={16} />
                  Add New Player
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="bg-emerald-950 border border-emerald-900 rounded-xl p-4 text-center">
                  <p className="text-2xl font-black text-white">{players.length}</p>
                  <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-1">Total Players</p>
                </div>
                <div className="bg-emerald-950 border border-emerald-900 rounded-xl p-4 text-center">
                  <p className="text-2xl font-black text-emerald-400">{players.filter(p => p.status === 'Approved').length}</p>
                  <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-1">Active / Approved</p>
                </div>
                <div className="bg-emerald-950 border border-emerald-900 rounded-xl p-4 text-center">
                  <p className="text-2xl font-black text-amber-400">30</p>
                  <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-1">Max Roster Size</p>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1.5">
                  <span>Squad Cap Capacity</span>
                  <span>{Math.round((players.length / 30) * 100)}% ({players.length}/30)</span>
                </div>
                <div className="h-2 bg-[#071510] border border-emerald-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((players.length / 30) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Squad List View */}
            {players.length === 0 ? (
              <div className="bg-emerald-950/40 border border-emerald-900/60 rounded-2xl py-16 text-center space-y-4 shadow-lg">
                <div className="w-16 h-16 bg-emerald-900/40 rounded-full flex items-center justify-center mx-auto border border-emerald-800">
                  <Users size={24} className="text-emerald-500" />
                </div>
                <div className="max-w-sm mx-auto space-y-1">
                  <p className="font-bold text-white uppercase tracking-wider text-sm">Squad Roster is Empty</p>
                  <p className="text-xs text-emerald-600 font-medium">Click the Add New Player button above to start adding players to your State League squad roster.</p>
                </div>
              </div>
            ) : (
              <>
                {/* Desktop View */}
                <div className="hidden md:block bg-[#081a11] border border-emerald-900/60 rounded-2xl overflow-hidden shadow-lg">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-emerald-950 border-b border-emerald-900 text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                        <th className="px-6 py-4">Player</th>
                        <th className="px-4 py-4">Position</th>
                        <th className="px-4 py-4">Age / DOB</th>
                        <th className="px-4 py-4">Jersey</th>
                        <th className="px-4 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {players.map(p => (
                        <tr key={p._id} className="border-b border-emerald-900/60 last:border-0 hover:bg-emerald-900/20 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full border border-emerald-700 bg-emerald-900 overflow-hidden flex-shrink-0">
                                {p.photoUrl
                                  ? <img src={p.photoUrl} alt="" className="w-full h-full object-cover" />
                                  : <User className="text-emerald-500 m-auto mt-2.5" size={14} />
                                }
                              </div>
                              <div>
                                <p className="font-bold text-white text-sm">{p.name}</p>
                                {p.status === 'Rejected' && p.rejectionReason && (
                                  <p className="text-[10px] text-red-400 font-bold mt-0.5">Reason: {p.rejectionReason}</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-xs font-bold text-emerald-300">{p.primaryPosition}</span>
                          </td>
                          <td className="px-4 py-4 text-xs font-medium text-emerald-400">
                            {p.age} Yrs <span className="opacity-40">({p.dob})</span>
                          </td>
                          <td className="px-4 py-4 text-sm font-bold text-white">#{p.jerseyNumber}</td>
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
                                className="p-2 bg-emerald-800 hover:bg-emerald-700 rounded-lg text-emerald-300 hover:text-white transition-colors"
                                title="View Details"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                onClick={() => { setEditingPlayer(p); setFormFromPlayer(p); setShowPlayerModal(true); }}
                                className="p-2 bg-emerald-800 hover:bg-emerald-700 rounded-lg text-emerald-300 hover:text-white transition-colors"
                                title="Edit Player"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => handlePlayerRemove(p._id)}
                                className="p-2 bg-red-950/40 hover:bg-red-900 border border-red-900/30 text-red-400 hover:text-white rounded-lg transition-colors"
                                title="Remove Player"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden grid grid-cols-1 gap-4">
                  {players.map(p => (
                    <div key={p._id} className="bg-[#081a11] border border-emerald-900/60 rounded-2xl p-5 space-y-4 shadow-md">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full border border-emerald-700 bg-emerald-900 overflow-hidden flex-shrink-0">
                            {p.photoUrl
                              ? <img src={p.photoUrl} alt="" className="w-full h-full object-cover" />
                              : <User className="text-emerald-500 m-auto mt-3.5" size={16} />
                            }
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm">{p.name}</p>
                            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">{p.primaryPosition} · #{p.jerseyNumber}</p>
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
                        <p className="text-xs text-red-400 bg-red-950/20 border border-red-950/50 p-2.5 rounded-xl font-medium leading-relaxed">
                          <span className="font-bold uppercase tracking-wide text-[9px] block mb-0.5">Reason for rejection:</span>
                          {p.rejectionReason}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-xs text-emerald-500 font-medium">
                        <span>Age: {p.age} Yrs</span>
                        <span>DOB: {p.dob}</span>
                      </div>

                      <div className="flex gap-2 pt-2 border-t border-emerald-900/60">
                        <button
                          onClick={() => setSelectedPlayerForView(p)}
                          className="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-emerald-300 font-bold rounded-xl text-xs uppercase tracking-wide flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Eye size={13} /> View
                        </button>
                        <button
                          onClick={() => { setEditingPlayer(p); setShowPlayerModal(true); }}
                          className="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-emerald-300 font-bold rounded-xl text-xs uppercase tracking-wide flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Edit2 size={13} /> Edit
                        </button>
                        <button
                          onClick={() => handlePlayerRemove(p._id)}
                          className="py-2.5 px-3 bg-red-950/40 hover:bg-red-900 border border-red-900/30 text-red-400 font-bold rounded-xl text-xs uppercase tracking-wide transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Tab 3: Announcements ── */}
        {activeTab === 'announcements' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-emerald-950/40 border border-emerald-900/60 rounded-2xl p-6 shadow-lg">
              <h2 className="text-lg font-black text-white uppercase tracking-tight">Osun FA Communications</h2>
              <p className="text-xs text-emerald-500 font-medium">League announcements, fixtures deadlines, and bulletins.</p>
            </div>

            {announcements.length === 0 ? (
              <div className="bg-emerald-950/40 border border-emerald-900/60 rounded-2xl py-16 text-center space-y-4 shadow-lg">
                <div className="w-16 h-16 bg-emerald-900/40 rounded-full flex items-center justify-center mx-auto border border-emerald-800">
                  <Bell size={24} className="text-emerald-500" />
                </div>
                <p className="font-bold text-white uppercase tracking-wider text-sm">No announcements published yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {announcements.map(ann => {
                  const urgent = ann.category === 'Urgent';
                  return (
                    <div
                      key={ann._id}
                      onClick={() => handleAnnouncementRead(ann._id)}
                      className={`border rounded-2xl p-6 shadow-md transition-all relative overflow-hidden group cursor-pointer ${
                        !ann.isRead
                          ? 'bg-emerald-950/70 border-emerald-500/50 hover:border-emerald-400'
                          : 'bg-emerald-950/20 border-emerald-900/60 hover:border-emerald-800'
                      }`}
                    >
                      {ann.pinned && (
                        <div className="absolute top-0 right-0 bg-amber-500 text-emerald-950 px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-bl-xl flex items-center gap-1">
                          📌 Pinned
                        </div>
                      )}
                      
                      <div className="flex items-start gap-4 pr-12">
                        {/* Status Icon */}
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                          urgent
                            ? 'bg-red-600/20 border-red-500/40 text-red-400'
                            : 'bg-emerald-800/40 border-emerald-700/40 text-emerald-300'
                        }`}>
                          <Bell size={15} />
                        </div>

                        <div className="space-y-2 flex-1 min-w-0">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide border ${
                              urgent
                                ? 'bg-red-600/20 border-red-500/40 text-red-300'
                                : 'bg-emerald-800/30 border-emerald-700/30 text-emerald-300'
                            }`}>
                              {ann.category}
                            </span>
                            {!ann.isRead && (
                              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" title="Unread Notice" />
                            )}
                          </div>
                          
                          <h3 className="font-bold text-white text-base leading-snug">{ann.title}</h3>
                          <div className="text-sm text-emerald-300/90 leading-relaxed font-medium whitespace-pre-wrap">
                            {ann.content}
                          </div>
                          
                          <div className="flex items-center gap-2 pt-2 text-[10px] text-emerald-600 font-bold uppercase tracking-widest">
                            <span>Published:</span>
                            <span>{new Date(ann.publishDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Tab 4: Documents ── */}
        {activeTab === 'documents' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-emerald-950/40 border border-emerald-900/60 rounded-2xl p-6 shadow-lg">
              <h2 className="text-lg font-black text-white uppercase tracking-tight">League Resources</h2>
              <p className="text-xs text-emerald-500 font-medium">Download official forms, rulebooks, and schedules.</p>
            </div>

            {documents.length === 0 ? (
              <div className="bg-emerald-950/40 border border-emerald-900/60 rounded-2xl py-16 text-center space-y-4 shadow-lg">
                <div className="w-16 h-16 bg-emerald-900/40 rounded-full flex items-center justify-center mx-auto border border-emerald-800">
                  <FileText size={24} className="text-emerald-500" />
                </div>
                <div className="space-y-1 max-w-xs mx-auto">
                  <p className="font-bold text-white uppercase tracking-wider text-sm">No documents shared yet</p>
                  <p className="text-xs text-emerald-600 font-medium">No documents have been shared with your club yet.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {documents.map(doc => (
                  <div key={doc._id} className="bg-[#081a11] border border-emerald-900/60 rounded-2xl p-5 flex items-start gap-4 hover:border-emerald-700 transition-colors shadow-md">
                    <div className="w-11 h-11 bg-amber-500/10 border border-amber-500/25 text-amber-400 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileText size={18} />
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <div>
                        <span className="bg-emerald-950 text-emerald-300 border border-emerald-900 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                          {doc.type}
                        </span>
                      </div>
                      <h3 className="font-bold text-white text-sm leading-tight truncate">{doc.title}</h3>
                      {doc.description && (
                        <p className="text-xs text-emerald-400 font-medium leading-relaxed line-clamp-2">{doc.description}</p>
                      )}
                      
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-[10px] text-emerald-600 font-medium">{doc.fileSize} · {new Date(doc.uploadDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</span>
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-amber-500 hover:bg-amber-400 text-emerald-950 font-black px-3.5 py-1.5 rounded-lg text-[10px] uppercase tracking-widest transition-colors flex items-center gap-1 shadow-md shadow-amber-500/10"
                        >
                          Download <ArrowUpRight size={10} />
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
            : 'bg-emerald-600 text-white border border-emerald-400'
        }`}>
          {toast.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
          {toast.message}
        </div>
      )}
    </div>
  );
}
