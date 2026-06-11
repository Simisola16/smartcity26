import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ClipboardList, CheckCircle2, XCircle, Users, Settings,
  LogOut, Menu, X, Eye, Trash2, ThumbsUp, ThumbsDown, Search, Filter,
  RefreshCw, AlertTriangle, ChevronRight, ChevronDown, Mail, Phone,
  MapPin, Calendar, Shield, Star, BarChart3, Key, Copy, Check, Shuffle,
  Plus, Edit2, FileText, Bell, Trophy, BookOpen, Upload, ArrowUpRight
} from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const getAdminToken = () => localStorage.getItem('mko_token') || localStorage.getItem('adminToken');

const api = async (path, options = {}) => {
  const token = getAdminToken();
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

const StatusBadge = ({ status }) => {
  const cfg = {
    Pending: { bg: 'bg-amber-500/20 border-amber-500/40 text-amber-300', dot: 'bg-amber-400' },
    Approved: { bg: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300', dot: 'bg-emerald-400' },
    Rejected: { bg: 'bg-red-500/20 border-red-500/40 text-red-300', dot: 'bg-red-400' },
  }[status] || { bg: 'bg-neutral-700 text-neutral-300', dot: 'bg-neutral-400' };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-widest ${cfg.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
};

const fmtDate = (str) =>
  str
    ? new Date(str).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—';

const generatePassword = () => {
  const adj = ['Smart', 'Osun', 'Green', 'Gold', 'City', 'League'];
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${adj[Math.floor(Math.random() * adj.length)]}@${num}`;
};

// ─────────────────────────────────────────────────────────────────────────────
// Credentials Modal
// ─────────────────────────────────────────────────────────────────────────────
function CredentialsModal({ reg, onClose, onConfirm, loading }) {
  const [email, setEmail] = useState(reg?.email || '');
  const [password, setPassword] = useState(generatePassword());
  const [customPassword, setCustomPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPass, setShowPass] = useState(true);

  const handleCopy = () => {
    navigator.clipboard.writeText(password).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!reg) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0a1f14] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-emerald-800 bg-emerald-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center border border-amber-500/40">
              <Key size={20} className="text-amber-400" />
            </div>
            <div>
              <h2 className="font-black text-white text-sm uppercase tracking-widest">Set Login Credentials</h2>
              <p className="text-xs text-emerald-400 mt-0.5 truncate max-w-[200px]">{reg.clubName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-emerald-400 hover:text-white hover:bg-emerald-800 rounded-lg p-2 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
            <p className="text-xs text-amber-300 font-bold uppercase tracking-widest mb-1">⚠️ Before you confirm</p>
            <p className="text-xs text-amber-200/80">These credentials will be sent to the club. Once approved, the club can log in to their dashboard using these details.</p>
          </div>

          <div>
            <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-2">Email Address</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-emerald-950 border border-emerald-700 rounded-xl pl-9 pr-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-amber-500 placeholder:text-emerald-600 transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Temporary Password</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-[10px] text-emerald-400">Custom</span>
                <div
                  onClick={() => setCustomPassword(!customPassword)}
                  className={`w-9 h-5 rounded-full transition-colors cursor-pointer flex items-center px-0.5 ${customPassword ? 'bg-amber-500' : 'bg-emerald-800'}`}
                >
                  <span className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${customPassword ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
              </label>
            </div>

            {customPassword ? (
              <div className="relative">
                <Key size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-emerald-950 border border-emerald-700 rounded-xl pl-9 pr-20 py-3 text-white text-sm font-medium focus:outline-none focus:border-amber-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-emerald-400 hover:text-white font-bold"
                >
                  {showPass ? 'Hide' : 'Show'}
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <div className="flex-1 bg-emerald-950 border border-emerald-700 rounded-xl px-4 py-3 font-mono text-amber-300 text-sm tracking-wider flex items-center">
                  {password}
                </div>
                <button
                  type="button"
                  onClick={() => setPassword(generatePassword())}
                  className="p-3 bg-emerald-800 hover:bg-emerald-700 rounded-xl text-emerald-300 hover:text-white transition-colors"
                >
                  <Shuffle size={16} />
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  className={`p-3 rounded-xl transition-colors ${copied ? 'bg-emerald-600 text-white' : 'bg-emerald-800 hover:bg-emerald-700 text-emerald-300 hover:text-white'}`}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-emerald-800 bg-emerald-950/50 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 border border-emerald-700 text-emerald-300 rounded-xl font-bold uppercase text-sm">
            Cancel
          </button>
          <button
            onClick={() => onConfirm({ email, password })}
            disabled={loading || !email || !password}
            className="flex-2 flex-[2] py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black uppercase tracking-widest rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
          >
            {loading ? <RefreshCw size={16} className="animate-spin" /> : <ThumbsUp size={16} />}
            {loading ? 'Approving...' : 'Approve & Send Details'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Detail Modal
// ─────────────────────────────────────────────────────────────────────────────
function DetailModal({ reg, onClose, onRequestApprove, onReject, onDelete, loading }) {
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  const handleRejectSubmit = (e) => {
    e.preventDefault();
    if (!rejectReason.trim()) return;
    onReject(reg._id, rejectReason.trim());
  };

  const LabelVal = ({ label, val }) => (
    val ? (
      <div className="py-2.5 border-b border-emerald-900 last:border-0 flex justify-between gap-4 text-xs font-semibold">
        <span className="text-emerald-500 uppercase tracking-wider">{label}</span>
        <span className="text-white text-right break-words max-w-[240px]">{val}</span>
      </div>
    ) : null
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-[#0a1f14] border border-emerald-800 rounded-2xl shadow-2xl overflow-hidden mb-8 animate-scale-in">
        {/* Banner header */}
        <div className="p-6 bg-emerald-950 border-b border-emerald-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border border-emerald-700 bg-emerald-900 overflow-hidden flex items-center justify-center flex-shrink-0">
              {reg.clubLogoUrl
                ? <img src={reg.clubLogoUrl} alt="" className="w-full h-full object-cover" />
                : <Shield size={20} className="text-emerald-400" />
              }
            </div>
            <div>
              <h3 className="text-lg font-black text-white">{reg.clubName}</h3>
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-0.5">Registration Application</p>
            </div>
          </div>
          <button onClick={onClose} className="text-emerald-400 hover:text-white p-2 rounded-lg hover:bg-emerald-900 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Alert */}
          <div className="flex items-center justify-between p-4 bg-emerald-950/60 rounded-xl border border-emerald-900">
            <span className="text-xs text-emerald-500 uppercase tracking-widest font-black">Status</span>
            <StatusBadge status={reg.status} />
          </div>

          {reg.status === 'Rejected' && reg.rejectionReason && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 space-y-1">
              <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">❌ Rejection Reason</p>
              <p className="text-xs text-red-200/90 font-medium leading-relaxed">{reg.rejectionReason}</p>
            </div>
          )}

          {/* Table Data */}
          <div className="bg-emerald-950/40 rounded-2xl border border-emerald-900 p-4 divide-y divide-emerald-900">
            <LabelVal label="Club Name" val={reg.clubName} />
            <LabelVal label="LGA Location" val={reg.lga} />
            <LabelVal label="Founded Year" val={reg.foundedYear} />
            <LabelVal label="Home Ground" val={reg.homeGround} />
            <LabelVal label="Club Colors" val={reg.clubColors} />
            <LabelVal label="Club Category" val={reg.clubCategory} />
            <LabelVal label="Chairman / President" val={reg.chairmanName} />
            <LabelVal label="Secretary Name" val={reg.secretaryName} />
            <LabelVal label="Phone Number" val={reg.phone} />
            <LabelVal label="WhatsApp Number" val={reg.whatsapp} />
            <LabelVal label="Email Address" val={reg.email} />
            <LabelVal label="Website / Socials" val={reg.websiteOrSocial} />
            <LabelVal label="Head Coach Name" val={reg.headCoach} />
            <LabelVal label="Coach License" val={reg.coachLicense} />
            <LabelVal label="Estimated Players" val={reg.numPlayers} />
            <LabelVal label="Age Range" val={reg.ageRange} />
            <LabelVal label="Previous League" val={reg.prevLeague} />
            <LabelVal label="Previous League Info" val={reg.prevLeagueNames} />
            <LabelVal label="Previous Transfer System" val={reg.prevTransfer} />
            <LabelVal label="Submitted Date" val={fmtDate(reg.submittedAt)} />
          </div>

          {/* Reject Form Panel */}
          {showRejectForm && (
            <form onSubmit={handleRejectSubmit} className="bg-red-950/20 border border-red-900/40 rounded-2xl p-4 space-y-3">
              <label className="text-[10px] font-black text-red-400 uppercase tracking-widest block">Provide Reason for Rejection</label>
              <textarea
                required
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="E.g. Incomplete information, coach license is invalid..."
                className="w-full bg-emerald-950/80 border border-red-900/60 rounded-xl p-3 text-white text-xs font-semibold focus:outline-none placeholder:text-red-900/80"
                rows={3}
              />
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setShowRejectForm(false)} className="px-3 py-1.5 border border-red-900/50 text-red-400 font-bold text-xs uppercase rounded-lg">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase rounded-lg">Confirm Reject</button>
              </div>
            </form>
          )}
        </div>

        {/* Footer buttons */}
        <div className="p-6 border-t border-emerald-800 bg-emerald-950/50 flex flex-wrap gap-3 flex-shrink-0">
          {reg.status !== 'Approved' && (
            <button
              onClick={() => onRequestApprove(reg)}
              disabled={loading}
              className="flex-1 min-w-[120px] bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black uppercase tracking-widest py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <ThumbsUp size={16} /> Approve
            </button>
          )}
          {reg.status !== 'Rejected' && !showRejectForm && (
            <button
              onClick={() => setShowRejectForm(true)}
              disabled={loading}
              className="flex-1 min-w-[120px] bg-red-950/60 border border-red-700/40 text-red-400 hover:text-white font-bold uppercase tracking-widest py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <ThumbsDown size={16} /> Reject
            </button>
          )}
          <button
            onClick={() => onDelete(reg._id)}
            disabled={loading}
            className="p-3 bg-neutral-900 border border-neutral-800 hover:bg-red-950 hover:border-red-900 hover:text-red-300 rounded-lg text-neutral-400 transition-colors flex items-center justify-center"
            title="Delete Application"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin Player Modal
// ─────────────────────────────────────────────────────────────────────────────
function AdminPlayerModal({ player, onClose, onApprove, onReject, loading }) {
  const [reason, setReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  const handleReject = (e) => {
    e.preventDefault();
    if (!reason.trim()) return;
    onReject(player._id, reason.trim());
  };

  const LabelVal = ({ label, value }) => (
    value ? (
      <div className="py-2.5 border-b border-emerald-900/40 last:border-0 flex justify-between gap-4 text-xs font-semibold">
        <span className="text-emerald-500 uppercase tracking-wider">{label}</span>
        <span className="text-white text-right break-words max-w-[200px]">{value}</span>
      </div>
    ) : null
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0a1f14] border border-emerald-800 rounded-2xl shadow-2xl overflow-hidden mb-8 animate-scale-in">
        <div className="p-6 bg-emerald-950 border-b border-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="bg-emerald-800 text-emerald-200 border border-emerald-600 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
              {player.status}
            </span>
          </div>
          <button onClick={onClose} className="text-emerald-400 hover:text-white p-2 rounded-lg transition-colors">
            <X size={20} />
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
            <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mt-1">
              {player.clubName} · Jersey #{player.jerseyNumber}
            </p>
          </div>

          {player.status === 'Rejected' && player.rejectionReason && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-left">
              <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">❌ Rejection Reason</p>
              <p className="text-xs text-red-200/90 font-medium leading-relaxed">{player.rejectionReason}</p>
            </div>
          )}

          <div className="bg-emerald-950/40 border border-emerald-900 rounded-xl p-4 text-left divide-y divide-emerald-900/30">
            <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2">Player Info</h4>
            <LabelVal label="Primary Position" value={player.primaryPosition} />
            <LabelVal label="Secondary Position" value={player.secondaryPosition} />
            <LabelVal label="DOB" value={player.dob} />
            <LabelVal label="Age" value={player.age} />
            <LabelVal label="Gender" value={player.gender} />
            <LabelVal label="Origin LGA / State" value={`${player.lgaOfOrigin}, ${player.stateOfOrigin}`} />
            <LabelVal label="Preferred Foot" value={player.preferredFoot} />
            <LabelVal label="Height / Weight" value={`${player.height} cm / ${player.weight} kg`} />
            <LabelVal label="Experience" value={`${player.experience} Years`} />
            <LabelVal label="Previous Club" value={player.prevClub} />
            <LabelVal label="Emergency Contact" value={player.guardianName} />
            <LabelVal label="Relationship" value={player.guardianRelationship} />
            <LabelVal label="Guardian Phone" value={player.guardianPhone} />
          </div>

          <div className="flex flex-col gap-2 pt-1 text-left">
            {player.docUrl && (
              <a href={player.docUrl} target="_blank" rel="noreferrer" className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 text-emerald-200 hover:text-white font-bold rounded-xl text-xs uppercase tracking-wide transition-colors flex items-center justify-center gap-2">
                <FileText size={14} /> View NIN / DOB Certificate
              </a>
            )}
            {player.transferLetterUrl && (
              <a href={player.transferLetterUrl} target="_blank" rel="noreferrer" className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 text-emerald-200 hover:text-white font-bold rounded-xl text-xs uppercase tracking-wide transition-colors flex items-center justify-center gap-2">
                <FileText size={14} /> View Transfer Letter
              </a>
            )}
          </div>

          {showRejectForm && (
            <form onSubmit={handleReject} className="bg-red-950/20 border border-red-900/40 rounded-xl p-4 text-left space-y-3">
              <label className="text-[10px] font-black text-red-400 uppercase tracking-widest block">Rejection Reason</label>
              <textarea
                required value={reason} onChange={e => setReason(e.target.value)}
                placeholder="E.g. Age mismatch with DOB certificate..."
                className="w-full bg-emerald-950 border border-red-900/60 rounded-xl p-3 text-white text-xs font-semibold focus:outline-none"
                rows={2}
              />
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setShowRejectForm(false)} className="px-3 py-1 text-xs text-red-400 font-bold border border-red-900/40 rounded">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-1 text-xs bg-red-600 hover:bg-red-500 text-white font-bold rounded">Reject</button>
              </div>
            </form>
          )}

          <div className="flex gap-3 pt-2">
            {player.status !== 'Approved' && (
              <button
                onClick={() => onApprove(player._id)}
                disabled={loading}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black uppercase tracking-widest rounded-xl text-xs flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={15} /> Approve
              </button>
            )}
            {player.status !== 'Rejected' && !showRejectForm && (
              <button
                onClick={() => setShowRejectForm(true)}
                disabled={loading}
                className="flex-1 py-3 bg-red-950/50 border border-red-700/40 text-red-400 hover:text-white font-bold uppercase tracking-widest rounded-xl text-xs flex items-center justify-center gap-2"
              >
                <XCircle size={15} /> Reject
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Announcement Modal Form
// ─────────────────────────────────────────────────────────────────────────────
function AnnouncementModal({ announcement, clubs, onClose, onSave, loading }) {
  const [form, setForm] = useState({
    title: announcement?.title || '',
    category: announcement?.category || 'General',
    targetAudience: announcement?.targetAudience || 'All',
    targetClubId: announcement?.targetClubId || '',
    content: announcement?.content || '',
    pinned: announcement?.pinned || false,
    publishDate: announcement?.publishDate ? announcement.publishDate.substring(0, 16) : new Date().toISOString().substring(0, 16),
    status: announcement?.status || 'Published',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      publishDate: new Date(form.publishDate).toISOString()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#0a1f14] border border-emerald-800 rounded-2xl shadow-2xl overflow-hidden mb-8">
        <div className="flex items-center justify-between p-6 border-b border-emerald-800 bg-emerald-950">
          <div className="flex items-center gap-3">
            <Bell size={18} className="text-amber-400" />
            <h2 className="font-black text-white text-sm uppercase tracking-widest">
              {announcement ? 'Edit Announcement' : 'Create New Announcement'}
            </h2>
          </div>
          <button onClick={onClose} className="text-emerald-400 hover:text-white p-2 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Title *</label>
            <input
              type="text" required value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
              className="w-full bg-[#071510] border border-emerald-800 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Category *</label>
              <select
                value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                className="w-full bg-[#071510] border border-emerald-800 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none"
              >
                <option>General</option>
                <option>Urgent</option>
                <option>Fixtures</option>
                <option>League Updates</option>
                <option>Registration</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Target Audience *</label>
              <select
                value={form.targetAudience} onChange={e => setForm({...form, targetAudience: e.target.value})}
                className="w-full bg-[#071510] border border-emerald-800 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none"
              >
                <option value="All">All Clubs</option>
                <option value="Approved">Approved Only</option>
                <option value="Pending">Pending Only</option>
                <option value="Specific">Specific Club</option>
              </select>
            </div>
          </div>

          {form.targetAudience === 'Specific' && (
            <div>
              <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Select Club *</label>
              <select
                required value={form.targetClubId} onChange={e => setForm({...form, targetClubId: e.target.value})}
                className="w-full bg-[#071510] border border-emerald-800 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none"
              >
                <option value="">-- Choose Club --</option>
                {clubs.map(c => <option key={c._id} value={c._id}>{c.clubName}</option>)}
              </select>
            </div>
          )}

          <div>
            <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Message Body *</label>
            <textarea
              required value={form.content} rows={4}
              onChange={e => setForm({...form, content: e.target.value})}
              placeholder="Enter details..."
              className="w-full bg-[#071510] border border-emerald-800 rounded-xl p-4 text-white text-sm font-medium focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Publish Date *</label>
              <input
                type="datetime-local" required value={form.publishDate}
                onChange={e => setForm({...form, publishDate: e.target.value})}
                className="w-full bg-[#071510] border border-emerald-800 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Status</label>
              <select
                value={form.status} onChange={e => setForm({...form, status: e.target.value})}
                className="w-full bg-[#071510] border border-emerald-800 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none"
              >
                <option>Published</option>
                <option>Draft</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between py-2 border-t border-emerald-900/60">
            <label className="text-xs text-emerald-300 font-bold">📌 Pin this announcement to top</label>
            <div
              onClick={() => setForm({...form, pinned: !form.pinned})}
              className={`w-9 h-5 rounded-full cursor-pointer transition-colors flex items-center px-0.5 ${form.pinned ? 'bg-amber-500' : 'bg-emerald-800'}`}
            >
              <span className={`w-4 h-4 rounded-full bg-white transition-transform ${form.pinned ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-emerald-700 text-emerald-300 rounded-xl font-bold uppercase text-xs">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-[2] py-3 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-black uppercase tracking-widest rounded-xl text-xs flex items-center justify-center gap-1">
              <Save size={14} /> {loading ? 'Saving...' : 'Publish Notice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Document Modal Form
// ─────────────────────────────────────────────────────────────────────────────
function DocumentModal({ doc, clubs, onClose, onSave, loading }) {
  const [form, setForm] = useState({
    title: doc?.title || '',
    type: doc?.type || 'League Rules',
    description: doc?.description || '',
    targetAudience: doc?.targetAudience || 'All',
    targetClubId: doc?.targetClubId || '',
    visibility: doc?.visibility || 'Public',
  });

  const [fileName, setFileName] = useState('');
  const [fileBase64, setFileBase64] = useState('');

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    const base64 = await toBase64(file);
    setFileBase64(base64);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      fileBase64,
      fileName
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#0a1f14] border border-emerald-800 rounded-2xl shadow-2xl overflow-hidden mb-8">
        <div className="flex items-center justify-between p-6 border-b border-emerald-800 bg-emerald-950">
          <div className="flex items-center gap-3">
            <FileText size={18} className="text-amber-400" />
            <h2 className="font-black text-white text-sm uppercase tracking-widest">
              {doc ? 'Edit Document' : 'Upload Document'}
            </h2>
          </div>
          <button onClick={onClose} className="text-emerald-400 hover:text-white p-2 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Document Title *</label>
            <input
              type="text" required value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
              className="w-full bg-[#071510] border border-emerald-800 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Type *</label>
              <select
                value={form.type} onChange={e => setForm({...form, type: e.target.value})}
                className="w-full bg-[#071510] border border-emerald-800 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none"
              >
                <option>League Rules</option>
                <option>Fixture Schedule</option>
                <option>Registration Form</option>
                <option>Official Letter</option>
                <option>Code of Conduct</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Target Audience *</label>
              <select
                value={form.targetAudience} onChange={e => setForm({...form, targetAudience: e.target.value})}
                className="w-full bg-[#071510] border border-emerald-800 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none"
              >
                <option value="All">All Clubs</option>
                <option value="Approved">Approved Only</option>
                <option value="Specific">Specific Club</option>
              </select>
            </div>
          </div>

          {form.targetAudience === 'Specific' && (
            <div>
              <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Select Club *</label>
              <select
                required value={form.targetClubId} onChange={e => setForm({...form, targetClubId: e.target.value})}
                className="w-full bg-[#071510] border border-emerald-800 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none"
              >
                <option value="">-- Choose Club --</option>
                {clubs.map(c => <option key={c._id} value={c._id}>{c.clubName}</option>)}
              </select>
            </div>
          )}

          <div>
            <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Description</label>
            <textarea
              value={form.description} rows={2}
              onChange={e => setForm({...form, description: e.target.value})}
              className="w-full bg-[#071510] border border-emerald-800 rounded-xl p-3 text-white text-sm font-medium focus:outline-none"
            />
          </div>

          {/* File input */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">File Attachment *</label>
            <div className="border border-dashed border-emerald-850 rounded-xl p-5 text-center bg-emerald-950/40 relative">
              {fileName ? (
                <div className="space-y-1">
                  <FileText size={20} className="text-amber-400 mx-auto" />
                  <p className="text-xs text-white font-bold truncate max-w-[200px] mx-auto">{fileName}</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <Upload size={20} className="text-emerald-700 mx-auto" />
                  <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Select PDF/DOCX (Max 10MB)</p>
                </div>
              )}
              <input
                type="file" required={!doc}
                onChange={handleUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Visibility</label>
            <select
              value={form.visibility} onChange={e => setForm({...form, visibility: e.target.value})}
              className="w-full bg-[#071510] border border-emerald-800 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none"
            >
              <option>Public</option>
              <option>Private</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-emerald-700 text-emerald-300 rounded-xl font-bold uppercase text-xs">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-[2] py-3 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-black uppercase tracking-widest rounded-xl text-xs flex items-center justify-center gap-1">
              <Upload size={14} /> {loading ? 'Uploading...' : doc ? 'Save Changes' : 'Upload Document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export function ClubApprovalsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tabParam = searchParams.get('tab') || 'registrations';
  
  const [activeSection, setActiveSection] = useState(tabParam);

  useEffect(() => {
    const currentTab = new URLSearchParams(location.search).get('tab');
    if (currentTab) {
      setActiveSection(currentTab);
    }
  }, [location.search]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [registrations, setRegistrations] = useState([]);
  const [players, setPlayers] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [documents, setDocuments] = useState([]);

  // Counts
  const [counts, setCounts] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [playerCounts, setPlayerCounts] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Modals state
  const [selectedReg, setSelectedReg] = useState(null);
  const [credentialsForReg, setCredentialsForReg] = useState(null);
  const [selectedPlayerForView, setSelectedPlayerForView] = useState(null);
  const [editingAnn, setEditingAnn] = useState(null);
  const [showAnnModal, setShowAnnModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [showDocModal, setShowDocModal] = useState(false);

  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  
  // Player filters
  const [playerSearch, setPlayerSearch] = useState('');
  const [playerStatusFilter, setPlayerStatusFilter] = useState('All');
  const [playerPosFilter, setPlayerPosFilter] = useState('All');
  const [playerClubFilter, setPlayerClubFilter] = useState('All');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // ── Auth guard
  useEffect(() => {
    const token = getAdminToken();
    const isAdmin = localStorage.getItem('mko_is_admin') === 'true';
    if (!token || !isAdmin) navigate('/admin', { replace: true });
  }, [navigate]);

  // ── Fetch registrations & data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const regData = await api(`/api/admin/club-registrations`);
      setRegistrations(regData.registrations || []);
      setCounts(regData.counts || { total: 0, pending: 0, approved: 0, rejected: 0 });

      // Fetch players
      const playData = await api('/api/admin/players');
      setPlayers(playData.players || []);
      setPlayerCounts(playData.counts || { total: 0, pending: 0, approved: 0, rejected: 0 });

      // Fetch announcements
      const annData = await api('/api/admin/announcements');
      setAnnouncements(annData.announcements || []);

      // Fetch documents
      const docData = await api('/api/admin/documents');
      setDocuments(docData.documents || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Actions: Club Registrations
  const handleRequestApprove = (reg) => {
    setCredentialsForReg(reg);
  };

  const handleApproveWithCredentials = async ({ email, password }) => {
    if (!credentialsForReg) return;
    const id = credentialsForReg._id;
    setActionLoading(true);
    try {
      await api(`/api/admin/club-registrations/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'Approved', email, password }),
      });
      await fetchData();
      setSelectedReg(prev => prev?._id === id ? { ...prev, status: 'Approved' } : prev);
      setCredentialsForReg(null);
      showToast('Club approved and login credentials issued! ✨');
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id, reason) => {
    setActionLoading(true);
    try {
      await api(`/api/admin/club-registrations/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'Rejected', rejectionReason: reason }),
      });
      await fetchData();
      setSelectedReg(prev => prev?._id === id ? { ...prev, status: 'Rejected', rejectionReason: reason } : prev);
      showToast('Registration application has been rejected.');
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this registration? This cannot be undone.')) return;
    setActionLoading(true);
    try {
      await api(`/api/admin/club-registrations/${id}`, { method: 'DELETE' });
      setSelectedReg(null);
      await fetchData();
      showToast('Registration deleted successfully.');
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // ── Actions: Player Review
  const handlePlayerApprove = async (id) => {
    setActionLoading(true);
    try {
      await api(`/api/admin/players/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'Approved' })
      });
      await fetchData();
      setSelectedPlayerForView(prev => prev?._id === id ? { ...prev, status: 'Approved' } : prev);
      showToast('Player approved successfully! 🟢');
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePlayerReject = async (id, rejectionReason) => {
    setActionLoading(true);
    try {
      await api(`/api/admin/players/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'Rejected', rejectionReason })
      });
      await fetchData();
      setSelectedPlayerForView(prev => prev?._id === id ? { ...prev, status: 'Rejected', rejectionReason } : prev);
      showToast('Player has been rejected.');
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // ── Actions: Announcements CRUD
  const handleSaveAnn = async (annData) => {
    setActionLoading(true);
    try {
      if (editingAnn) {
        await api(`/api/admin/announcements/${editingAnn._id}`, {
          method: 'PUT',
          body: JSON.stringify(annData)
        });
        showToast('Announcement updated successfully! ✨');
      } else {
        await api(`/api/admin/announcements`, {
          method: 'POST',
          body: JSON.stringify(annData)
        });
        showToast('Announcement published successfully! 📢');
      }
      setShowAnnModal(false);
      setEditingAnn(null);
      await fetchData();
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePinAnn = async (ann) => {
    setActionLoading(true);
    try {
      await api(`/api/admin/announcements/${ann._id}`, {
        method: 'PUT',
        body: JSON.stringify({ pinned: !ann.pinned })
      });
      await fetchData();
      showToast(ann.pinned ? 'Announcement unpinned.' : 'Announcement pinned to top!');
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteAnn = async (id) => {
    if (!window.confirm('Delete this announcement notice?')) return;
    setActionLoading(true);
    try {
      await api(`/api/admin/announcements/${id}`, { method: 'DELETE' });
      await fetchData();
      showToast('Announcement deleted.');
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // ── Actions: Documents CRUD
  const handleSaveDoc = async (docData) => {
    setActionLoading(true);
    try {
      if (editingDoc) {
        await api(`/api/admin/documents/${editingDoc._id}`, {
          method: 'PUT',
          body: JSON.stringify(docData)
        });
        showToast('Document details updated! ✨');
      } else {
        await api(`/api/admin/documents`, {
          method: 'POST',
          body: JSON.stringify(docData)
        });
        showToast('Document uploaded successfully! 📁');
      }
      setShowDocModal(false);
      setEditingDoc(null);
      await fetchData();
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteDoc = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document from resources?')) return;
    setActionLoading(true);
    try {
      await api(`/api/admin/documents/${id}`, { method: 'DELETE' });
      await fetchData();
      showToast('Document removed.');
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // ── Filter registrations
  const filteredRegs = registrations.filter(r => {
    const matchSearch = !searchTerm ||
      r.clubName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.lga?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.chairmanName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  const registrationsList = activeSection === 'approved'
    ? registrations.filter(r => r.status === 'Approved')
    : activeSection === 'rejected'
    ? registrations.filter(r => r.status === 'Rejected')
    : filteredRegs;

  // ── Filter players
  const filteredPlayers = players.filter(p => {
    const matchSearch = !playerSearch ||
      p.name?.toLowerCase().includes(playerSearch.toLowerCase()) ||
      p.clubName?.toLowerCase().includes(playerSearch.toLowerCase());
    const matchStatus = playerStatusFilter === 'All' || p.status === playerStatusFilter;
    const matchPos = playerPosFilter === 'All' || p.primaryPosition === playerPosFilter;
    const matchClub = playerClubFilter === 'All' || p.clubId === playerClubFilter;

    return matchSearch && matchStatus && matchPos && matchClub;
  });

  // ── Sidebar nav items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'registrations', label: 'Club Registrations', icon: ClipboardList, badge: counts.pending || null },
    { id: 'players', label: 'Player Management', icon: Users, badge: playerCounts.pending || null },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'documents', label: 'Documents', icon: FileText },
  ];

  const handleNavClick = (id) => {
    setActiveSection(id);
    setSidebarOpen(false);
    if (id === 'approved') setFilterStatus('Approved');
    else if (id === 'rejected') setFilterStatus('Rejected');
    else if (id === 'registrations') setFilterStatus('Pending');
    else setFilterStatus('All');
  };

  const handleLogout = () => {
    localStorage.removeItem('mko_token');
    localStorage.removeItem('mko_is_admin');
    localStorage.removeItem('mko_team');
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  const approvedClubs = registrations.filter(c => c.status === 'Approved');

  // ── Stat cards for dashboard overview
  const statCards = [
    { label: 'Total Registrations', value: counts.total, icon: BarChart3, color: 'from-blue-600 to-blue-800', click: () => { setFilterStatus('All'); setActiveSection('registrations'); } },
    { label: 'Pending Approval', value: counts.pending, icon: ClipboardList, color: 'from-amber-500 to-amber-700', click: () => handleNavClick('registrations') },
    { label: 'Pending Players', value: playerCounts.pending, icon: Users, color: 'from-purple-600 to-purple-850', click: () => handleNavClick('players') },
    { label: 'Approved Clubs', value: counts.approved, icon: CheckCircle2, color: 'from-emerald-600 to-emerald-800', click: () => { setFilterStatus('Approved'); setActiveSection('registrations'); } },
  ];

  return (
    <div className="min-h-screen bg-[#071510] text-white font-sans flex flex-col md:flex-row">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/70 z-35 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-emerald-950 border-r border-emerald-800 z-40 flex flex-col
        transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:flex
      `}>
        {/* Brand */}
        <div className="p-6 border-b border-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-amber-400 overflow-hidden">
              <img src="/smartCityImage.jpg" alt="Logo" className="w-full h-full object-contain rounded-full" />
            </div>
            <div>
              <p className="font-black text-sm text-white uppercase tracking-tight">Smart<span className="text-amber-400">City</span></p>
              <p className="text-[0.6rem] text-emerald-400 uppercase tracking-widest font-bold leading-none">Admin Panel</p>
            </div>
          </div>
          <button className="md:hidden text-emerald-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ id, label, icon: Icon, badge }) => (
            <button
              key={id}
              onClick={() => handleNavClick(id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wide transition-all duration-200
                ${activeSection === id
                  ? 'bg-amber-500 text-emerald-950 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                  : 'text-emerald-200 hover:bg-emerald-800 hover:text-white'
                }`}
            >
              <span className="flex items-center gap-3">
                <Icon size={18} />
                {label}
              </span>
              {badge && (
                <span className={`text-xs font-black px-2 py-0.5 rounded-full ${activeSection === id ? 'bg-emerald-950 text-amber-400' : 'bg-amber-500 text-emerald-950'}`}>
                  {badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-emerald-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wide text-red-400 hover:bg-red-900/30 hover:text-white transition-all"
          >
            <LogOut size={18} /> Sign Out
          </button>
          <button
            onClick={() => navigate('/admin')}
            className="mt-2 w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wide text-emerald-400 hover:bg-emerald-800 hover:text-white transition-all"
          >
            <ChevronRight size={18} /> Main Admin Panel
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">

        <header className="sticky top-0 z-20 bg-emerald-950/95 backdrop-blur border-b border-emerald-800 px-4 md:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden text-emerald-300 hover:text-white p-2 rounded-lg hover:bg-emerald-800 transition-colors">
              <Menu size={22} />
            </button>
            <div>
              <h1 className="text-lg font-black text-white uppercase tracking-tight leading-none">
                {activeSection === 'dashboard' ? 'Dashboard Overview' :
                 activeSection === 'registrations' ? 'Club Registrations' :
                 activeSection === 'players' ? 'Player Squad Approval' :
                 activeSection === 'announcements' ? 'League Announcements' :
                 activeSection === 'documents' ? 'Resource Documents' : 'Supervision'}
              </h1>
              <p className="text-xs text-emerald-400 font-medium mt-0.5">SmartCity Football League</p>
            </div>
          </div>

          <button
            onClick={fetchData} disabled={loading}
            className="flex items-center gap-2 text-xs font-bold text-emerald-300 hover:text-white bg-emerald-800/50 hover:bg-emerald-800 px-3 py-2 rounded-lg transition-colors uppercase tracking-wide"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </header>

        <div className="flex-1 p-4 md:p-8">

          {/* ────────────────── TABS RENDER ────────────────── */}

          {/* Tab 1: Dashboard Overview */}
          {activeSection === 'dashboard' && (
            <div className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map(({ label, value, icon: Icon, color, click }) => (
                  <button
                    key={label} onClick={click}
                    className="bg-[#081a11] border border-emerald-900 rounded-2xl p-5 text-left hover:border-amber-500/50 transition-all shadow-lg group"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-md`}>
                      <Icon size={20} className="text-white" />
                    </div>
                    <p className="text-3xl font-black text-white mb-1">{value}</p>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{label}</p>
                  </button>
                ))}
              </div>

              {/* Recent club submissions */}
              <div className="bg-[#081a11] border border-emerald-900 rounded-2xl overflow-hidden shadow-lg">
                <div className="px-6 py-4 border-b border-emerald-900 flex items-center justify-between">
                  <h2 className="font-black text-white uppercase tracking-wide text-xs">Recent Registrations</h2>
                  <button onClick={() => handleNavClick('registrations')} className="text-xs text-amber-400 hover:text-amber-300 font-bold uppercase tracking-widest">
                    View All →
                  </button>
                </div>
                {registrations.slice(0, 5).map(reg => (
                  <div
                    key={reg._id} onClick={() => setSelectedReg(reg)}
                    className="px-6 py-4 border-b border-emerald-950 last:border-0 flex items-center justify-between hover:bg-emerald-900/10 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {reg.clubLogoUrl
                        ? <img src={reg.clubLogoUrl} alt="" className="w-9 h-9 rounded-full object-cover border border-emerald-700 flex-shrink-0" />
                        : <div className="w-9 h-9 rounded-full bg-emerald-800 flex items-center justify-center flex-shrink-0"><Shield size={14} className="text-emerald-400" /></div>
                      }
                      <div className="min-w-0">
                        <p className="font-bold text-white text-sm truncate">{reg.clubName}</p>
                        <p className="text-xs text-emerald-500 truncate">{reg.lga} · {fmtDate(reg.submittedAt)}</p>
                      </div>
                    </div>
                    <StatusBadge status={reg.status} />
                  </div>
                ))}
                {registrations.length === 0 && (
                  <div className="px-6 py-10 text-center text-emerald-700 font-medium">No registrations yet.</div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Club Registrations */}
          {activeSection === 'registrations' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                  <input
                    type="text" placeholder="Search by club name, LGA, chairman..." value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full bg-[#081a11] border border-emerald-900 rounded-xl pl-9 pr-4 py-3 text-white text-xs font-semibold focus:outline-none placeholder:text-emerald-700"
                  />
                </div>
              </div>

              {/* Table list view */}
              <div className="hidden md:block bg-[#081a11] border border-emerald-900 rounded-2xl overflow-hidden shadow-lg">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-emerald-950/80 border-b border-emerald-900 text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                      <th className="px-6 py-4">Club Name</th>
                      <th className="px-4 py-4">LGA</th>
                      <th className="px-4 py-4">Category</th>
                      <th className="px-4 py-4">Contact</th>
                      <th className="px-4 py-4">Submitted</th>
                      <th className="px-4 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrationsList.map(reg => (
                      <tr key={reg._id} className="border-b border-emerald-950 hover:bg-emerald-900/10 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {reg.clubLogoUrl
                              ? <img src={reg.clubLogoUrl} alt="" className="w-9 h-9 rounded-full object-cover border border-emerald-700 flex-shrink-0" />
                              : <div className="w-9 h-9 rounded-full bg-emerald-800 flex items-center justify-center flex-shrink-0"><Shield size={14} className="text-emerald-400" /></div>
                            }
                            <div>
                              <p className="font-bold text-white text-sm">{reg.clubName}</p>
                              <p className="text-[10px] text-emerald-500 font-medium">{reg.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-emerald-200 text-xs font-semibold">{reg.lga}</td>
                        <td className="px-4 py-4"><span className="text-[10px] bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded font-black uppercase">{reg.clubCategory}</span></td>
                        <td className="px-4 py-4">
                          <p className="text-xs text-white font-semibold">{reg.phone}</p>
                          <p className="text-[10px] text-emerald-500">{reg.chairmanName}</p>
                        </td>
                        <td className="px-4 py-4 text-[11px] text-emerald-500 font-bold">{fmtDate(reg.submittedAt)}</td>
                        <td className="px-4 py-4"><StatusBadge status={reg.status} /></td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedReg(reg)}
                              className="p-2 bg-emerald-800 hover:bg-emerald-700 rounded-lg text-emerald-300 hover:text-white transition-colors"
                              title="View Details"
                            >
                              <Eye size={14} />
                            </button>
                            {reg.status !== 'Approved' && (
                              <button
                                onClick={() => handleRequestApprove(reg)}
                                className="p-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white transition-colors"
                                title="Approve"
                              >
                                <ThumbsUp size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View */}
              <div className="md:hidden space-y-4">
                {registrationsList.map(reg => (
                  <div
                    key={reg._id} onClick={() => setSelectedReg(reg)}
                    className="bg-[#081a11] border border-emerald-900 rounded-2xl p-5 space-y-3 shadow-md"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center"><Shield size={16} className="text-emerald-400" /></div>
                        <div>
                          <p className="font-bold text-white text-sm">{reg.clubName}</p>
                          <p className="text-[10px] text-emerald-500 font-medium">{reg.lga} · {reg.clubCategory}</p>
                        </div>
                      </div>
                      <StatusBadge status={reg.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Player Management Review */}
          {activeSection === 'players' && (
            <div className="space-y-6 animate-fade-in">
              {/* Player stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-[#081a11] border border-emerald-900 rounded-2xl p-4 text-center">
                  <p className="text-2xl font-black text-white">{playerCounts.total}</p>
                  <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Total Submitted</p>
                </div>
                <div className="bg-[#081a11] border border-emerald-900 rounded-2xl p-4 text-center">
                  <p className="text-2xl font-black text-amber-400">{playerCounts.pending}</p>
                  <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Pending Review</p>
                </div>
                <div className="bg-[#081a11] border border-emerald-900 rounded-2xl p-4 text-center">
                  <p className="text-2xl font-black text-emerald-400">{playerCounts.approved}</p>
                  <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Approved Players</p>
                </div>
                <div className="bg-[#081a11] border border-emerald-900 rounded-2xl p-4 text-center">
                  <p className="text-2xl font-black text-red-400">{playerCounts.rejected}</p>
                  <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Rejected Players</p>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-[#081a11] border border-emerald-900 rounded-2xl p-4">
                <div>
                  <label className="text-[9px] font-black text-emerald-500 uppercase tracking-widest block mb-1">Search Players</label>
                  <input
                    type="text" placeholder="Name or club..." value={playerSearch}
                    onChange={e => setPlayerSearch(e.target.value)}
                    className="w-full bg-emerald-950 border border-emerald-900 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black text-emerald-500 uppercase tracking-widest block mb-1">Status</label>
                  <select
                    value={playerStatusFilter} onChange={e => setPlayerStatusFilter(e.target.value)}
                    className="w-full bg-emerald-950 border border-emerald-900 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-black text-emerald-500 uppercase tracking-widest block mb-1">Position</label>
                  <select
                    value={playerPosFilter} onChange={e => setPlayerPosFilter(e.target.value)}
                    className="w-full bg-emerald-950 border border-emerald-900 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="All">All Positions</option>
                    <option value="Goalkeeper">Goalkeeper</option>
                    <option value="Defender">Defender</option>
                    <option value="Midfielder">Midfielder</option>
                    <option value="Winger">Winger</option>
                    <option value="Forward">Forward</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-black text-emerald-500 uppercase tracking-widest block mb-1">Filter by Club</label>
                  <select
                    value={playerClubFilter} onChange={e => setPlayerClubFilter(e.target.value)}
                    className="w-full bg-emerald-950 border border-emerald-900 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="All">All Clubs</option>
                    {approvedClubs.map(c => <option key={c._id} value={c._id}>{c.clubName}</option>)}
                  </select>
                </div>
              </div>

              {/* Roster table */}
              <div className="bg-[#081a11] border border-emerald-900 rounded-2xl overflow-hidden shadow-lg">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-emerald-950 border-b border-emerald-900 text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                      <th className="px-6 py-4">Player Name</th>
                      <th className="px-4 py-4">Club Name</th>
                      <th className="px-4 py-4">Position</th>
                      <th className="px-4 py-4">Age</th>
                      <th className="px-4 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlayers.map(p => (
                      <tr key={p._id} className="border-b border-emerald-950 hover:bg-emerald-900/10 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full overflow-hidden border border-emerald-700 flex-shrink-0 bg-emerald-900">
                              {p.photoUrl ? <img src={p.photoUrl} alt="" className="w-full h-full object-cover" /> : <User className="text-emerald-500 m-auto mt-2" size={14} />}
                            </div>
                            <span className="font-bold text-white text-sm">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-xs font-semibold text-emerald-300">{p.clubName}</td>
                        <td className="px-4 py-4 text-xs font-semibold text-white">{p.primaryPosition}</td>
                        <td className="px-4 py-4 text-xs font-semibold text-emerald-500">{p.age} Yrs</td>
                        <td className="px-4 py-4">
                          <StatusBadge status={p.status} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedPlayerForView(p)}
                              className="p-2 bg-emerald-800 hover:bg-emerald-700 rounded-lg text-emerald-300 hover:text-white transition-colors"
                            >
                              <Eye size={14} />
                            </button>
                            {p.status !== 'Approved' && (
                              <button
                                onClick={() => handlePlayerApprove(p._id)}
                                className="p-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white transition-colors"
                              >
                                <CheckCircle2 size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredPlayers.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-16 text-center text-emerald-700 font-medium">No player squad registration rosters found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 4: Announcements */}
          {activeSection === 'announcements' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center bg-[#081a11] border border-emerald-900 rounded-2xl p-6 shadow-lg">
                <div>
                  <h2 className="text-lg font-black text-white uppercase tracking-tight">Announcements</h2>
                  <p className="text-xs text-emerald-500 font-medium">Broadcast notices and league deadlines directly to club dashboards.</p>
                </div>
                <button
                  onClick={() => { setEditingAnn(null); setShowAnnModal(true); }}
                  className="bg-amber-500 hover:bg-amber-400 text-emerald-950 font-black px-4 py-2.5 rounded-xl uppercase tracking-widest text-[10px] transition-colors flex items-center gap-1.5"
                >
                  <Plus size={14} /> Create Notice
                </button>
              </div>

              {/* Announcements List */}
              <div className="bg-[#081a11] border border-emerald-900 rounded-2xl overflow-hidden shadow-lg">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-emerald-950 border-b border-emerald-900 text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                      <th className="px-6 py-4">Notice Title</th>
                      <th className="px-4 py-4">Category</th>
                      <th className="px-4 py-4">Target Audience</th>
                      <th className="px-4 py-4">Publish Date</th>
                      <th className="px-4 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {announcements.map(ann => (
                      <tr key={ann._id} className="border-b border-emerald-950 hover:bg-emerald-900/10 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {ann.pinned && <span className="text-xs" title="Pinned to top">📌</span>}
                            <span className="font-bold text-white text-sm">{ann.title}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4"><span className="text-[10px] bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded font-black uppercase">{ann.category}</span></td>
                        <td className="px-4 py-4 text-xs font-semibold text-emerald-300">{ann.targetAudience}</td>
                        <td className="px-4 py-4 text-xs font-medium text-emerald-500">{new Date(ann.publishDate).toLocaleString()}</td>
                        <td className="px-4 py-4">
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 border rounded ${
                            ann.status === 'Published' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-neutral-800 border-neutral-700 text-neutral-400'
                          }`}>{ann.status}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handlePinAnn(ann)}
                              className={`p-2 rounded-lg transition-colors ${ann.pinned ? 'bg-amber-500 text-emerald-950' : 'bg-emerald-850 text-emerald-300'}`}
                              title={ann.pinned ? 'Unpin' : 'Pin to Top'}
                            >
                              📌
                            </button>
                            <button
                              onClick={() => { setEditingAnn(ann); setShowAnnModal(true); }}
                              className="p-2 bg-emerald-800 hover:bg-emerald-700 rounded-lg text-emerald-300 hover:text-white transition-colors"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteAnn(ann._id)}
                              className="p-2 bg-red-950/40 hover:bg-red-900 border border-red-900/30 text-red-400 hover:text-white rounded-lg transition-colors"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {announcements.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-16 text-center text-emerald-700 font-medium">No bulletins or announcements published yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 5: Documents */}
          {activeSection === 'documents' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center bg-[#081a11] border border-emerald-900 rounded-2xl p-6 shadow-lg">
                <div>
                  <h2 className="text-lg font-black text-white uppercase tracking-tight">Resource Center</h2>
                  <p className="text-xs text-emerald-500 font-medium">Upload rules, codes of conduct, and schedule forms for clubs.</p>
                </div>
                <button
                  onClick={() => { setEditingDoc(null); setShowDocModal(true); }}
                  className="bg-amber-500 hover:bg-amber-400 text-emerald-950 font-black px-4 py-2.5 rounded-xl uppercase tracking-widest text-[10px] transition-colors flex items-center gap-1.5"
                >
                  <Plus size={14} /> Upload File
                </button>
              </div>

              {/* Documents List */}
              <div className="bg-[#081a11] border border-emerald-900 rounded-2xl overflow-hidden shadow-lg">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-emerald-950 border-b border-emerald-900 text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                      <th className="px-6 py-4">Resource Name</th>
                      <th className="px-4 py-4">Type</th>
                      <th className="px-4 py-4">Audience</th>
                      <th className="px-4 py-4">Upload Date</th>
                      <th className="px-4 py-4">Size</th>
                      <th className="px-4 py-4">Visibility</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map(doc => (
                      <tr key={doc._id} className="border-b border-emerald-950 hover:bg-emerald-900/10 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-bold text-white text-sm">{doc.title}</span>
                          {doc.description && <p className="text-[10px] text-emerald-500 font-medium truncate max-w-[200px]">{doc.description}</p>}
                        </td>
                        <td className="px-4 py-4"><span className="text-[10px] bg-emerald-805 text-emerald-250 border border-emerald-700/60 px-2 py-0.5 rounded font-black uppercase">{doc.type}</span></td>
                        <td className="px-4 py-4 text-xs font-semibold text-emerald-300">{doc.targetAudience}</td>
                        <td className="px-4 py-4 text-xs font-medium text-emerald-500">{new Date(doc.uploadDate).toLocaleDateString()}</td>
                        <td className="px-4 py-4 text-xs font-semibold text-emerald-400">{doc.fileSize}</td>
                        <td className="px-4 py-4 text-xs font-bold text-white">{doc.visibility}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={doc.fileUrl} target="_blank" rel="noreferrer"
                              className="p-2 bg-emerald-800 hover:bg-emerald-700 rounded-lg text-emerald-300 hover:text-white transition-colors"
                            >
                              <ArrowUpRight size={13} />
                            </a>
                            <button
                              onClick={() => { setEditingDoc(doc); setShowDocModal(true); }}
                              className="p-2 bg-emerald-800 hover:bg-emerald-700 rounded-lg text-emerald-300 hover:text-white transition-colors"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteDoc(doc._id)}
                              className="p-2 bg-red-950/40 hover:bg-red-900 border border-red-900/30 text-red-400 hover:text-white rounded-lg transition-colors"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {documents.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-16 text-center text-emerald-700 font-medium">No official league resource documents uploaded yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Credentials Modal */}
      {credentialsForReg && (
        <CredentialsModal
          reg={credentialsForReg}
          onClose={() => setCredentialsForReg(null)}
          onConfirm={handleApproveWithCredentials}
          loading={actionLoading}
        />
      )}

      {/* Detail Modal */}
      {selectedReg && (
        <DetailModal
          reg={selectedReg}
          onClose={() => setSelectedReg(null)}
          onRequestApprove={handleRequestApprove}
          onReject={handleReject}
          onDelete={handleDelete}
          loading={actionLoading}
        />
      )}

      {/* Admin Player View Modal */}
      {selectedPlayerForView && (
        <AdminPlayerModal
          player={selectedPlayerForView}
          onClose={() => setSelectedPlayerForView(null)}
          onApprove={handlePlayerApprove}
          onReject={handlePlayerReject}
          loading={actionLoading}
        />
      )}

      {/* Announcement Modal Form */}
      {showAnnModal && (
        <AnnouncementModal
          announcement={editingAnn}
          clubs={registrations.filter(c => c.status === 'Approved')}
          onClose={() => { setShowAnnModal(false); setEditingAnn(null); }}
          onSave={handleSaveAnn}
          loading={actionLoading}
        />
      )}

      {/* Document Modal Form */}
      {showDocModal && (
        <DocumentModal
          doc={editingDoc}
          clubs={registrations.filter(c => c.status === 'Approved')}
          onClose={() => { setShowDocModal(false); setEditingDoc(null); }}
          onSave={handleSaveDoc}
          loading={actionLoading}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[70] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-xs font-black uppercase tracking-widest transition-all ${
          toast.type === 'error' ? 'bg-red-600 text-white border border-red-400' : 'bg-emerald-600 text-white border border-emerald-400'
        }`}>
          {toast.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
          {toast.message}
        </div>
      )}
    </div>
  );
}
