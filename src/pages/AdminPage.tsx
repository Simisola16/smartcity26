import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Shield, Key, AlertCircle, RefreshCw, Trash2, Printer, Search,
  LogOut, ChevronRight, Users, UserCheck, Building2,
  Trophy, TrendingUp, Eye, Zap, Clock, Share2,
  LayoutDashboard, Bell, FileText, Menu, X, Calendar, Settings, Megaphone, ArrowLeft,
  CheckCircle2, Award, Sparkles, Check
} from "lucide-react";
import { useRegistration } from "../context/RegistrationContext.js";
import { PrintCard } from "../components/PrintCard.js";
import { TournamentHub } from "../components/TournamentHub.js";
import { LiveMarquee } from "../components/LiveMarquee.js";
import { TournamentManager } from "../components/TournamentManager.js";
import { Modal } from "../components/Modal.js";
import { Team, Player, Official, Match } from "../types.js";
import { BACKEND_URL } from "../config.js";

export const AdminPage: React.FC = () => {
  const { authToken, isAdmin, loginAdmin, logout } = useRegistration();
  const navigate = useNavigate();

  // Password Verification State
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Admin Dashboard State
  const [fullTeamsList, setFullTeamsList] = useState<any[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<any | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [viewingMatch, setViewingMatch] = useState<Match | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [errorOnRecords, setErrorOnRecords] = useState<string | null>(null);

  // Sidebar & Navigation State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "players" | "tournament" | "fixtures" | "results" | "settings">("dashboard");
  const [subTab, setSubTab] = useState<"players" | "officials" | "tournament">("players");

  const [deletingPlayerId, setDeletingPlayerId] = useState<string | null>(null);
  const [deletingOfficialId, setDeletingOfficialId] = useState<string | null>(null);
  const [deletingTeamId, setDeletingTeamId] = useState<string | null>(null);

  // Time state for Welcome Banner
  const [currentTime, setCurrentTime] = useState(new Date());

  // Modal state
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean; title: string; message: string;
    type: "info" | "success" | "warning" | "error" | "confirm";
    onConfirm?: () => void; isDangerous?: boolean;
  }>({ isOpen: false, title: "", message: "", type: "info" });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyLivescore = () => {
    const url = `${window.location.origin}/#/livescore`;
    navigator.clipboard.writeText(url).then(() => {
      setModalConfig({
        isOpen: true, title: "Livescore Link Copied",
        message: "The public live match center URL has been copied to your clipboard.",
        type: "success"
      });
    });
  };

  useEffect(() => {
    if (isAdmin && authToken) {
      loadAdminRecords();
      loadMatches();
      const interval = setInterval(loadMatches, 20000);
      return () => clearInterval(interval);
    }
  }, [isAdmin, authToken]);

  const handleAdminVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsVerifying(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/admin-login`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Invalid administrative entry code key.");
      loginAdmin(data.token);
      setPasswordInput("");
    } catch (err: any) {
      setLoginError(err.message || "A verification timeout occurred.");
    } finally {
      setIsVerifying(false);
    }
  };

  const loadAdminRecords = async () => {
    setLoadingRecords(true);
    setErrorOnRecords(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/teams`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (!response.ok) throw new Error("Unable to retrieve rosters.");
      const data = await response.json();
      const teams = data.teams || [];
      setFullTeamsList(teams);
      setSelectedTeam((prev: any) => {
        if (prev) {
          const fresh = teams.find((t: any) => t.id === prev.id);
          return fresh || null;
        }
        return null;
      });
    } catch (err: any) {
      setErrorOnRecords(err.message || "Failure synchronizing ledger rosters.");
    } finally {
      setLoadingRecords(false);
    }
  };

  const loadMatches = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/matches`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMatches(data.matches || []);
      }
    } catch (err) {
      console.error("Match load error:", err);
    }
  };

  const handleRemovePlayer = (playerId: string) => {
    setModalConfig({
      isOpen: true, title: "Remove Player Record",
      message: "Are you absolutely sure you want to delete this player? This action cannot be undone.",
      type: "confirm", isDangerous: true,
      onConfirm: async () => {
        setDeletingPlayerId(playerId);
        try {
          const response = await fetch(`${BACKEND_URL}/api/admin/players/${playerId}`, {
            method: "DELETE", headers: { Authorization: `Bearer ${authToken}` }
          });
          if (!response.ok) throw new Error("Delete rejected.");
          await loadAdminRecords();
        } catch (err: any) {
          setModalConfig({ isOpen: true, title: "Error", message: err.message, type: "error" });
        } finally {
          setDeletingPlayerId(null);
        }
      }
    });
  };

  const handleRemoveOfficial = (officialId: string) => {
    setModalConfig({
      isOpen: true, title: "Remove Technical Official",
      message: "Are you sure you want to delete this official's badge credentials?",
      type: "confirm", isDangerous: true,
      onConfirm: async () => {
        setDeletingOfficialId(officialId);
        try {
          const response = await fetch(`${BACKEND_URL}/api/admin/officials/${officialId}`, {
            method: "DELETE", headers: { Authorization: `Bearer ${authToken}` }
          });
          if (!response.ok) throw new Error("Delete rejected.");
          await loadAdminRecords();
        } catch (err: any) {
          setModalConfig({ isOpen: true, title: "Error", message: err.message, type: "error" });
        } finally {
          setDeletingOfficialId(null);
        }
      }
    });
  };

  const handleRemoveTeam = (teamId: string) => {
    setModalConfig({
      isOpen: true, title: "Wipe Club Record",
      message: "WARNING: Deleting this Club will wipe their access, squad roster, and registered officials. Are you certain?",
      type: "confirm", isDangerous: true,
      onConfirm: async () => {
        setDeletingTeamId(teamId);
        try {
          const response = await fetch(`${BACKEND_URL}/api/admin/teams/${teamId}`, {
            method: "DELETE", headers: { Authorization: `Bearer ${authToken}` }
          });
          if (!response.ok) throw new Error("Action rejected.");
          await loadAdminRecords();
          setSelectedTeam(null);
        } catch (err: any) {
          setModalConfig({ isOpen: true, title: "Error", message: err.message, type: "error" });
        } finally {
          setDeletingTeamId(null);
        }
      }
    });
  };

  const handleAdminLogout = () => {
    logout();
    setFullTeamsList([]);
    setSelectedTeam(null);
  };

  const handlePrintSingleCard = (e: React.MouseEvent, cardClass: string) => {
    const cardEl = (e.currentTarget.closest(cardClass) as HTMLElement)?.querySelector('.print-card-container');
    if (!cardEl) return;
    const clone = cardEl.cloneNode(true) as HTMLElement;
    const target = document.createElement('div');
    target.id = 'print-single-target';
    target.appendChild(clone);
    document.body.appendChild(target);
    document.body.classList.add('print-single');
    window.print();
    document.body.classList.remove('print-single');
    document.body.removeChild(target);
  };

  const filteredTeams = fullTeamsList.filter(t =>
    t.clubName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPlayers = fullTeamsList.reduce((s, t) => s + (t.players ? t.players.length : 0), 0);
  const totalOfficials = fullTeamsList.reduce((s, t) => s + (t.officials ? t.officials.length : 0), 0);

  // ---------------------------------------------------------------------------
  // AUTH PROMPT VIEW (Admin Login)
  // ---------------------------------------------------------------------------
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#060e0a] text-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.04] pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-900 via-amber-400 to-emerald-900 shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 space-y-6">
          <div className="flex justify-start">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs text-emerald-400/80 hover:text-white bg-[#091710] border border-emerald-800/60 px-4 py-2 rounded-xl backdrop-blur-md transition-colors font-bold uppercase tracking-wider"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Public League</span>
            </Link>
          </div>

          <div className="text-center space-y-3">
            <div className="w-20 h-20 rounded-3xl border-2 border-amber-400/80 p-1 mx-auto bg-emerald-950 shadow-[0_0_30px_rgba(245,158,11,0.25)] flex items-center justify-center">
              <img src="/smartCityImage.jpg" alt="SmartCity" className="w-full h-full object-cover rounded-2xl" />
            </div>
            <div>
              <h1 className="font-bebas text-4xl sm:text-5xl tracking-widest text-white leading-none">
                SMARTCITY <span className="text-amber-400">COMMAND</span>
              </h1>
              <p className="mt-1 text-xs text-emerald-400 font-mono font-bold uppercase tracking-[0.25em]">
                Osun State FA Administrative Terminal
              </p>
            </div>
          </div>

          <div className="bg-[#091710] border border-emerald-700/60 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] rounded-3xl space-y-6">
            {loginError && (
              <div className="flex items-start gap-3 bg-red-950/40 border border-red-700/50 p-4 rounded-2xl text-xs text-red-300 font-medium animate-fadeIn">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleAdminVerify} className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-2">
                  Master Security Keycode
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-emerald-500">
                    <Key className="h-4 w-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter administrative master password"
                    className="w-full text-sm py-3.5 pl-11 pr-4 border border-emerald-800/80 rounded-2xl focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 bg-[#06120c] text-white placeholder-emerald-700/60 transition-all font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-[#071510] font-black text-xs uppercase rounded-2xl tracking-[0.15em] shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {isVerifying ? (
                  <><RefreshCw className="h-4 w-4 animate-spin" /> Authenticating Access...</>
                ) : (
                  <><Shield className="h-4 w-4" /> Unlock Admin Command Center</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // MAIN ADMIN COMMAND CENTER
  // ---------------------------------------------------------------------------
  const navItems = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "club-approvals", label: "Club Governance", icon: Building2, ext: true, to: "/admin/clubs" },
    { id: "players", label: "Team Rosters", icon: Users },
    { id: "announcements", label: "Bulletins & Notices", icon: Megaphone, ext: true, to: "/admin/clubs?tab=announcements" },
    { id: "documents", label: "Resource Library", icon: FileText, ext: true, to: "/admin/clubs?tab=documents" },
    { id: "tournament", label: "Tournament Hub", icon: Trophy },
    { id: "fixtures", label: "Fixtures & Schedule", icon: Calendar },
    { id: "results", label: "Match Records", icon: Clock },
    { id: "settings", label: "System Config", icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-8 animate-fade-in">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#0c2618] via-[#091a11] to-[#05100a] border border-emerald-700/60 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle,rgba(245,158,11,0.12)_0%,transparent_70%)] pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[radial-gradient(circle,rgba(16,185,129,0.15)_0%,transparent_70%)] pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-widest flex items-center gap-1">
                      <Sparkles size={11} className="text-amber-400" /> Osun FA Command Desk
                    </span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
                    Welcome, Administrator <span className="text-amber-400">⚽</span>
                  </h2>
                  <p className="text-emerald-400 mt-1 font-mono text-xs flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-amber-400" />
                    {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} · {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} WAT
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/admin/clubs"
                    className="px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-[#071510] rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(245,158,11,0.25)] flex items-center gap-2 cursor-pointer"
                  >
                    <Building2 className="h-4 w-4" />
                    <span>Review Club Intake</span>
                  </Link>
                  <Link
                    to="/admin/clubs?tab=documents"
                    className="px-5 py-3 bg-white/5 hover:bg-white/10 border border-emerald-700/60 rounded-2xl text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4 text-emerald-400" />
                    <span>League Resources</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* KPI Stat Bento */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { label: "Approved Clubs", value: fullTeamsList.length, sub: "In Competition", icon: Building2, color: "text-emerald-400", link: null, action: () => setActiveTab("players") },
                { label: "Pending Governance", value: "Review", sub: "Clubs & Squads", icon: UserCheck, color: "text-amber-400", link: "/admin/clubs", action: null },
                { label: "Accredited Players", value: totalPlayers, sub: "Official Ledger", icon: Users, color: "text-blue-400", link: null, action: () => setActiveTab("players") },
                { label: "Active Fixtures", value: matches.filter(m => m.status === 'Live').length || matches.length, sub: matches.some(m => m.status === 'Live') ? "Match Live" : "Scheduled", icon: Zap, color: "text-red-400", link: null, action: () => setActiveTab("fixtures") }
              ].map((stat, i) => {
                const Icon = stat.icon;
                const Content = (
                  <div className="bg-[#091710] border border-emerald-800/60 hover:border-emerald-600/80 rounded-3xl p-5 shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{stat.label}</span>
                      <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-800/60 group-hover:scale-105 transition-transform">
                        <Icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-white">{stat.value}</span>
                      <span className="text-[10px] text-emerald-600 font-mono font-bold uppercase">{stat.sub}</span>
                    </div>
                  </div>
                );

                return stat.link ? (
                  <Link to={stat.link} key={i}>{Content}</Link>
                ) : (
                  <div key={i} onClick={stat.action || undefined} className="cursor-pointer">{Content}</div>
                );
              })}
            </div>

            {/* Quick Access Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Matches Module */}
              <div className="bg-[#091710] rounded-3xl border border-emerald-800/60 p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
                  <h3 className="font-bebas text-2xl text-white tracking-wider uppercase flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-400" />
                    <span>Live & Recent Matches</span>
                  </h3>
                  <button onClick={() => setActiveTab("fixtures")} className="text-[10px] text-amber-400 font-bold uppercase tracking-widest hover:underline cursor-pointer">
                    All Fixtures →
                  </button>
                </div>
                <div className="space-y-3">
                  {matches.slice(0, 4).length === 0 ? (
                    <div className="py-10 text-center text-emerald-600 text-xs font-semibold bg-[#06120c] rounded-2xl border border-dashed border-emerald-800/60">
                      No matches registered yet.
                    </div>
                  ) : matches.slice(0, 4).map(match => (
                    <div key={match._id} className="p-4 bg-[#06120c] border border-emerald-800/50 rounded-2xl flex items-center justify-between hover:border-emerald-600/80 transition-all text-white">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2.5 bg-emerald-950 rounded-xl border border-emerald-800 flex-shrink-0">
                          {match.status === "Live" ? <Clock className="h-4 w-4 text-red-400 animate-pulse" /> : <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black uppercase text-white truncate">
                            {match.homeTeamName} <span className="text-amber-400 font-mono">({match.homeScore ?? 0})</span> vs <span className="text-amber-400 font-mono">({match.awayScore ?? 0})</span> {match.awayTeamName}
                          </p>
                          <p className="text-[10px] text-emerald-500 font-mono mt-0.5">
                            {match.stage} · {match.venue || 'Osogbo Stadium'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setViewingMatch(match)}
                        className="w-8 h-8 flex items-center justify-center bg-emerald-950 border border-emerald-800 hover:border-amber-400 hover:text-amber-400 rounded-xl transition-colors text-emerald-400 flex-shrink-0 cursor-pointer"
                        title="View Match Sheet"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clubs Spotlight */}
              <div className="bg-[#091710] rounded-3xl border border-emerald-800/60 p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
                  <h3 className="font-bebas text-2xl text-white tracking-wider uppercase flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-amber-400" />
                    <span>Registered Roster Clubs</span>
                  </h3>
                  <button onClick={() => setActiveTab("players")} className="text-[10px] text-amber-400 font-bold uppercase tracking-widest hover:underline cursor-pointer">
                    Manage Rosters →
                  </button>
                </div>
                <div className="space-y-3">
                  {fullTeamsList.slice(0, 4).length === 0 ? (
                    <div className="py-10 text-center text-emerald-600 text-xs font-semibold bg-[#06120c] rounded-2xl border border-dashed border-emerald-800/60">
                      No clubs registered yet.
                    </div>
                  ) : fullTeamsList.slice(0, 4).map(team => (
                    <div key={team.id} className="p-3.5 bg-[#06120c] border border-emerald-800/50 rounded-2xl flex items-center justify-between hover:border-emerald-600/80 transition-all">
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={team.logoUrl || "/placeholder-logo.png"} alt="Logo" className="w-10 h-10 rounded-xl border border-emerald-700 bg-emerald-950 object-cover flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-black uppercase text-white truncate">{team.clubName}</p>
                          <p className="text-[10px] font-mono text-emerald-400 mt-0.5">{team.players ? team.players.length : 0} Licensed Players</p>
                        </div>
                      </div>
                      <button
                        onClick={() => { setSelectedTeam(team); setActiveTab("players"); }}
                        className="w-8 h-8 flex items-center justify-center bg-emerald-950 border border-emerald-800 hover:border-amber-400 hover:text-amber-400 rounded-xl transition-colors text-emerald-400 flex-shrink-0 cursor-pointer"
                        title="Open Club Roster"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "players":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start animate-fade-in">
            {/* Sidebar Club Selection */}
            <div className="lg:col-span-1 bg-[#091710] border border-emerald-800/60 rounded-3xl p-5 shadow-xl space-y-4">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                <input
                  type="text"
                  placeholder="Filter club rosters..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full text-xs py-3 pl-10 pr-4 bg-[#06120c] border border-emerald-800 rounded-xl focus:outline-none focus:border-amber-400 text-white placeholder-emerald-700/60 transition-all font-medium"
                />
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
                {filteredTeams.map(team => (
                  <button
                    key={team.id}
                    onClick={() => setSelectedTeam(team)}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition-all text-left cursor-pointer ${
                      selectedTeam?.id === team.id
                        ? 'bg-emerald-950/80 border-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                        : 'bg-[#06120c] border-emerald-900/60 hover:border-emerald-700 hover:bg-emerald-950/40'
                    }`}
                  >
                    <img src={team.logoUrl || "/placeholder-logo.png"} alt="" className="w-9 h-9 rounded-xl border border-emerald-700 object-cover bg-emerald-950 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-black text-white uppercase truncate">{team.clubName}</p>
                      <p className="text-[10px] text-emerald-400 font-mono mt-0.5">{team.players ? team.players.length : 0} Players</p>
                    </div>
                  </button>
                ))}
                {filteredTeams.length === 0 && (
                  <p className="text-center py-8 text-xs text-emerald-600 font-medium">No matching clubs.</p>
                )}
              </div>
            </div>

            {/* Main Detail Area */}
            <div className="lg:col-span-3 space-y-6">
              {!selectedTeam ? (
                <div className="bg-[#091710] border border-emerald-800/60 rounded-3xl p-16 text-center shadow-xl space-y-3">
                  <div className="w-20 h-20 bg-emerald-950 rounded-3xl flex items-center justify-center mx-auto border border-emerald-800 text-emerald-500">
                    <Users className="h-10 w-10" />
                  </div>
                  <h3 className="text-lg font-black text-white uppercase tracking-wider">Select a Club from Ledger</h3>
                  <p className="text-xs text-emerald-500 max-w-sm mx-auto font-medium">
                    Choose a club from the left panel to inspect official player passes, technical officials, and print verification cards.
                  </p>
                </div>
              ) : (
                <>
                  {/* Selected Team Header */}
                  <div className="bg-gradient-to-br from-[#0c2618] via-[#091a11] to-[#05100a] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl border border-emerald-700/60">
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-5">
                        <img src={selectedTeam.logoUrl || "/placeholder-logo.png"} alt="" className="w-20 h-20 rounded-2xl border-2 border-amber-400 bg-emerald-950 object-cover shadow-xl flex-shrink-0" />
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-3xl font-bebas text-amber-400 tracking-widest uppercase">{selectedTeam.clubName}</h2>
                          </div>
                          <div className="flex gap-2.5 mt-2 flex-wrap">
                            <span className="text-[10px] bg-emerald-950/80 px-3 py-1 rounded-xl text-emerald-300 font-bold uppercase tracking-wider border border-emerald-800 flex items-center gap-1.5">
                              <Users className="h-3 w-3 text-amber-400" /> {selectedTeam.players?.length || 0} Players
                            </span>
                            <span className="text-[10px] bg-emerald-950/80 px-3 py-1 rounded-xl text-emerald-300 font-bold uppercase tracking-wider border border-emerald-800 flex items-center gap-1.5">
                              <UserCheck className="h-3 w-3 text-emerald-400" /> {selectedTeam.officials?.length || 0} Officials
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 w-full md:w-auto">
                        <button
                          onClick={() => window.print()}
                          className="flex-1 md:flex-none py-3 px-5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-[#071510] rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(245,158,11,0.25)] flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Printer className="h-4 w-4" /> Print Accreditation Passes
                        </button>
                        <button
                          onClick={() => handleRemoveTeam(selectedTeam.id)}
                          className="flex-1 md:flex-none py-3 px-4 bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-white border border-red-800/50 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" /> Delete Club
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Sub-tabs */}
                  <div className="flex gap-2 bg-[#091710] p-1.5 rounded-2xl border border-emerald-800/60 w-fit">
                    {(["players", "officials", "tournament"] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setSubTab(tab)}
                        className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                          subTab === tab
                            ? 'bg-amber-500 text-[#071510] shadow-md'
                            : 'text-emerald-400 hover:text-white hover:bg-emerald-950/60'
                        }`}
                      >
                        {tab === "players" ? `Players (${selectedTeam.players?.length || 0})` :
                         tab === "officials" ? `Officials (${selectedTeam.officials?.length || 0})` :
                         "Tournament Setup"}
                      </button>
                    ))}
                  </div>

                  {/* Sub-tab Content */}
                  {subTab === "players" && (
                    <div className="flex flex-wrap gap-5 justify-center sm:justify-start">
                      {selectedTeam.players?.map((p: any) => (
                        <div key={p._id} className="relative group/card">
                          <PrintCard person={p} type="player" team={selectedTeam} />
                          <div className="absolute top-2 right-2 flex gap-1 bg-[#091710]/95 backdrop-blur-md rounded-xl p-1.5 shadow-xl border border-emerald-700 opacity-0 group-hover/card:opacity-100 transition-all z-10">
                            <button
                              onClick={(e) => handlePrintSingleCard(e, '.group\\/card')}
                              className="p-1.5 text-amber-400 hover:text-white hover:bg-emerald-800 rounded-lg transition"
                              title="Print Card"
                            >
                              <Printer className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleRemovePlayer(p._id)}
                              className="p-1.5 text-red-400 hover:text-white hover:bg-red-900 rounded-lg transition"
                              title="Delete Record"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {(!selectedTeam.players || selectedTeam.players.length === 0) && (
                        <div className="w-full text-center py-16 text-emerald-600 text-xs font-bold border border-dashed border-emerald-800/60 rounded-3xl bg-[#091710]">
                          No players registered for this club yet.
                        </div>
                      )}
                    </div>
                  )}

                  {subTab === "officials" && (
                    <div className="flex flex-wrap gap-5 justify-center sm:justify-start">
                      {selectedTeam.officials?.map((o: any) => (
                        <div key={o._id} className="relative group/card">
                          <PrintCard person={o} type="official" team={selectedTeam} />
                          <div className="absolute top-2 right-2 flex gap-1 bg-[#091710]/95 backdrop-blur-md rounded-xl p-1.5 shadow-xl border border-emerald-700 opacity-0 group-hover/card:opacity-100 transition-all z-10">
                            <button
                              onClick={(e) => handlePrintSingleCard(e, '.group\\/card')}
                              className="p-1.5 text-amber-400 hover:text-white hover:bg-emerald-800 rounded-lg transition"
                              title="Print Badge"
                            >
                              <Printer className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleRemoveOfficial(o._id)}
                              className="p-1.5 text-red-400 hover:text-white hover:bg-red-900 rounded-lg transition"
                              title="Delete Official"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {(!selectedTeam.officials || selectedTeam.officials.length === 0) && (
                        <div className="w-full text-center py-16 text-emerald-600 text-xs font-bold border border-dashed border-emerald-800/60 rounded-3xl bg-[#091710]">
                          No officials registered for this club yet.
                        </div>
                      )}
                    </div>
                  )}

                  {subTab === "tournament" && (
                    <TournamentManager teams={[selectedTeam]} authToken={authToken || ""} onRefreshTeams={loadAdminRecords} onViewMatch={setViewingMatch} />
                  )}
                </>
              )}
            </div>
          </div>
        );

      case "tournament":
        return <TournamentHub authToken={authToken || ""} activeTab="tournament" />;
      case "fixtures":
        return <TournamentHub authToken={authToken || ""} activeTab="fixtures" />;
      case "results":
        return <TournamentHub authToken={authToken || ""} activeTab="results" />;

      default:
        return (
          <div className="bg-[#091710] border border-emerald-800/60 rounded-3xl p-12 text-center text-emerald-400">
            Section under maintenance.
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#060e0a] text-white font-sans flex flex-col md:flex-row selection:bg-amber-500 selection:text-black">

      {/* MOBILE HEADER */}
      <div className="md:hidden bg-[#09150e] text-white p-4 flex items-center justify-between sticky top-0 z-40 shadow-xl border-b border-emerald-800/60">
        <div className="flex items-center gap-3">
          <img src="/smartCityImage.jpg" alt="Logo" className="w-9 h-9 rounded-xl border border-amber-400" />
          <h1 className="font-bebas text-xl text-amber-400 tracking-widest leading-none">SmartCity Admin</h1>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 bg-emerald-950 rounded-xl text-emerald-400 border border-emerald-800">
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* FIXED SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#09150e] border-r border-emerald-800/60 flex flex-col transform transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:static md:flex-shrink-0 shadow-2xl`}>

        {/* Sidebar Logo */}
        <div className="p-6 flex items-center gap-3.5 border-b border-emerald-900/60 bg-[#07120c]">
          <div className="w-11 h-11 rounded-2xl border-2 border-amber-400/80 overflow-hidden bg-emerald-950 shadow-[0_0_15px_rgba(245,158,11,0.25)] flex items-center justify-center flex-shrink-0">
            <img src="/smartCityImage.jpg" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="font-bebas text-2xl text-amber-400 tracking-wider leading-none">SmartCity FA</h1>
            <p className="text-[9px] text-emerald-400 font-mono font-bold uppercase tracking-[0.2em] mt-1">Admin Command Desk</p>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 custom-scrollbar">
          {navItems.map((item) => (
            item.ext ? (
              <Link
                key={item.id}
                to={item.to || "#"}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left text-emerald-400 hover:bg-emerald-950/80 hover:text-amber-400 border border-transparent hover:border-emerald-800/40"
              >
                <item.icon className="h-4 w-4 opacity-80" />
                <span className="text-xs font-black uppercase tracking-wider">{item.label}</span>
                <ChevronRight size={13} className="ml-auto opacity-50" />
              </Link>
            ) : (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id as any); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-[#071510] shadow-[0_0_15px_rgba(245,158,11,0.2)] font-black'
                    : 'text-emerald-400 hover:bg-emerald-950/80 hover:text-white'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wider font-bold">{item.label}</span>
              </button>
            )
          ))}
        </div>

        {/* Sidebar Footer - Profile */}
        <div className="p-4 border-t border-emerald-900/60 bg-[#06100a]">
          <div className="flex items-center gap-3 p-3 bg-[#091710] rounded-2xl border border-emerald-800/60 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-[#071510] font-black shadow-md flex-shrink-0">
              FA
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black text-white uppercase truncate">Osun State FA</p>
              <p className="text-[9px] text-emerald-400 font-mono font-bold uppercase tracking-wider truncate">Master Admin</p>
            </div>
          </div>
          <button
            onClick={handleAdminLogout}
            className="w-full flex items-center justify-center gap-2 py-3 bg-red-950/30 hover:bg-red-900/50 text-red-300 hover:text-white rounded-xl border border-red-800/40 transition-colors text-xs font-black uppercase tracking-wider cursor-pointer"
          >
            <LogOut className="h-4 w-4" /> Exit Session
          </button>
        </div>
      </aside>

      {/* OVERLAY FOR MOBILE SIDEBAR */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header (Desktop) */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-[#09150e]/95 backdrop-blur-xl text-white sticky top-0 z-20 border-b border-emerald-800/60 shadow-xl">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bebas text-amber-400 tracking-widest leading-none">
                {navItems.find(i => i.id === activeTab)?.label || "Dashboard"}
              </h1>
              <p className="text-[10px] text-emerald-400 font-mono uppercase tracking-[0.2em] mt-0.5">
                SmartCity Football League Ledger
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAdminRecords}
              className="p-2.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-amber-400 rounded-xl transition-all cursor-pointer"
              title="Refresh Ledger"
            >
              <RefreshCw className={`h-4 w-4 ${loadingRecords ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleCopyLivescore}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-[#071510] rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)] cursor-pointer"
            >
              <Share2 className="h-4 w-4" /> Share Livescore
            </button>
          </div>
        </header>

        {/* Live Ticker Area */}
        <div className="bg-[#071510] border-b border-emerald-800/60 flex-shrink-0">
          <LiveMarquee matches={matches} />
        </div>

        {/* Main Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative">
          {errorOnRecords && (
            <div className="mb-6 p-4 bg-red-950/40 border border-red-700/60 rounded-2xl text-xs text-red-300 font-bold flex items-center gap-2 shadow-lg">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
              <span>{errorOnRecords}</span>
            </div>
          )}
          {renderContent()}
        </main>
      </div>

      {/* HIDDEN PRINT GRID */}
      {selectedTeam && (
        <div className="hidden print:block print-grid">
          {selectedTeam.players?.map((player: any) => (
            <div key={player._id} className="p-1 flex items-center justify-center">
              <PrintCard person={player} type="player" team={selectedTeam} />
            </div>
          ))}
          {selectedTeam.officials?.map((official: any) => (
            <div key={official._id} className="p-1 flex items-center justify-center">
              <PrintCard person={official} type="official" team={selectedTeam} />
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        isDangerous={modalConfig.isDangerous}
      />
    </div>
  );
};
