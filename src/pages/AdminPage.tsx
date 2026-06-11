import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Shield, Key, AlertCircle, RefreshCw, Trash2, Printer, Search,
  LogOut, ChevronRight, Users, UserCheck, Building2,
  Trophy, TrendingUp, Eye, Zap, Clock, Share2,
  LayoutDashboard, Bell, FileText, Menu, X, Calendar, Settings, Megaphone
} from "lucide-react";
import { useRegistration } from "../context/RegistrationContext.js";
import { PrintCard } from "../components/PrintCard.js";
import { TournamentHub } from "../components/TournamentHub.js";
import { LiveMarquee } from "../components/LiveMarquee.js";
import { TournamentManager } from "../components/TournamentManager.js";
import { Modal } from "../components/Modal.js";
import { Team, Player, Official, Match } from "../types.js";

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

  // New Sidebar & Navigation State
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
        isOpen: true, title: "Link Copied",
        message: "The public livescore link has been copied to your clipboard.",
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
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || ""}/api/auth/admin-login`, {
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
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || ""}/api/admin/teams`, {
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
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || ""}/api/matches`, {
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
      isOpen: true, title: "Remove Player",
      message: "Are you absolutely sure you want to delete this player card? This action is irreversible.",
      type: "confirm", isDangerous: true,
      onConfirm: async () => {
        setDeletingPlayerId(playerId);
        try {
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || ""}/api/admin/players/${playerId}`, {
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
      isOpen: true, title: "Remove Official",
      message: "Are you sure you want to delete this official's badge?",
      type: "confirm", isDangerous: true,
      onConfirm: async () => {
        setDeletingOfficialId(officialId);
        try {
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || ""}/api/admin/officials/${officialId}`, {
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
      isOpen: true, title: "Delete Club",
      message: "WARNING: Deleting this Club/Team will instantly wipe their login, all player cards and officials. Are you absolutely certain?",
      type: "confirm", isDangerous: true,
      onConfirm: async () => {
        setDeletingTeamId(teamId);
        try {
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || ""}/api/admin/teams/${teamId}`, {
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

  const totalPlayers = fullTeamsList.reduce((s, t) => s + t.players.length, 0);
  const totalOfficials = fullTeamsList.reduce((s, t) => s + t.officials.length, 0);

  // ---------------------------------------------------------------------------
  // AUTH PROMPT VIEW
  // ---------------------------------------------------------------------------
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#071510] text-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03]" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0a3d0a] via-[#F59E0B] to-[#0a3d0a]" />

        <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 space-y-6">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <img src="/smartCityImage.jpg" alt="SmartCity U17" className="h-20 w-20 rounded-full border-4 border-[#F59E0B] object-cover shadow-[0_0_30px_rgba(245,158,11,0.3)]" />
            </div>
            <h2 className="font-bebas text-5xl tracking-widest text-white drop-shadow-md">ADMIN PORTAL</h2>
            <p className="mt-2 text-xs text-[#F59E0B] font-bold uppercase tracking-[0.2em]">Master Ledger Workspace</p>
          </div>

          <div className="bg-[#0f2d1a]/80 backdrop-blur-xl border border-emerald-800/40 p-8 shadow-2xl rounded-[2rem] space-y-6">
            {loginError && (
              <div className="flex items-start gap-3 bg-red-950/40 border border-red-800/40 p-4 rounded-2xl text-xs text-red-400 font-medium">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-500" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleAdminVerify} className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-2">
                  Master Administration Password
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
                    placeholder="Enter master password"
                    className="w-full text-sm py-3.5 pl-11 pr-4 border border-emerald-800/50 rounded-2xl focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] bg-[#071510] text-white placeholder-emerald-800 transition-all shadow-inner"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-4 bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:brightness-110 text-[#071510] font-black text-xs uppercase rounded-2xl tracking-[0.15em] shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isVerifying ? (
                  <><RefreshCw className="h-4 w-4 animate-spin" />Verifying access...</>
                ) : (
                  <><Shield className="h-4 w-4" />Verify Master Access</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // MAIN ADMIN DASHBOARD
  // ---------------------------------------------------------------------------
  const pendingRegistrationsCount = 3; // Mock for now, would be fetched

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "club-approvals", label: "Club Approvals", icon: Building2, ext: true, to: "/admin/clubs" },
    { id: "players", label: "Player Management", icon: Users },
    { id: "announcements", label: "Announcements", icon: Megaphone, ext: true, to: "/admin/clubs?tab=announcements" },
    { id: "documents", label: "Documents", icon: FileText, ext: true, to: "/admin/clubs?tab=documents" },
    { id: "tournament", label: "Tournament Hub", icon: Trophy },
    { id: "fixtures", label: "Fixtures", icon: Calendar },
    { id: "results", label: "Completed Matches", icon: Clock },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-br from-[#0a3d0a] to-[#071510] rounded-[2rem] p-8 shadow-xl relative overflow-hidden border border-emerald-900/50">
              <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#F59E0B] rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tight">Welcome back, Admin <span className="text-[#F59E0B]">👋</span></h2>
                  <p className="text-emerald-400 mt-2 font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link to="/admin/clubs" className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white text-xs font-bold uppercase tracking-wider transition-all backdrop-blur-sm flex items-center gap-2">
                    <Building2 className="h-4 w-4" /> Approvals
                  </Link>
                  <Link to="/admin/clubs?tab=documents" className="px-5 py-2.5 bg-[#F59E0B] hover:bg-amber-400 text-[#071510] rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Documents
                  </Link>
                </div>
              </div>
            </div>

            {/* Redesigned Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { label: "Registered Clubs", value: fullTeamsList.length, icon: Building2, color: "text-[#0a3d0a]", bg: "bg-emerald-50", border: "border-emerald-200/60" },
                { label: "Pending Approvals", value: "Review", icon: UserCheck, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200/60", link: "/admin/clubs" },
                { label: "Total Players", value: totalPlayers, icon: Users, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200/60" },
                { label: "Live Matches", value: matches.filter(m => m.status === 'Live').length, icon: Zap, color: "text-red-500", bg: "bg-red-50", border: "border-red-200/60" }
              ].map((stat, i) => (
                stat.link ? (
                  <Link to={stat.link} key={i} className={`${stat.bg} ${stat.border} border rounded-[1.5rem] p-5 flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-pointer shadow-sm`}>
                    <div className="p-3 bg-[#0a3d0a] rounded-2xl shadow-sm"><stat.icon className={`h-6 w-6 ${stat.color}`} /></div>
                    <div>
                      <div className={`text-2xl font-black ${stat.color} leading-none mb-1`}>{stat.value}</div>
                      <div className="text-[10px] text-white uppercase tracking-widest font-bold">{stat.label}</div>
                    </div>
                  </Link>
                ) : (
                  <div key={i} className={`${stat.bg} ${stat.border} border rounded-[1.5rem] p-5 flex items-center gap-4 hover:-translate-y-1 transition-transform shadow-sm`}>
                    <div className="p-3 bg-white rounded-2xl shadow-sm"><stat.icon className={`h-6 w-6 ${stat.color}`} /></div>
                    <div>
                      <div className={`text-2xl font-black ${stat.color} leading-none mb-1`}>{stat.value}</div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{stat.label}</div>
                    </div>
                  </div>
                )
              ))}
            </div>

            {/* Quick Access Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-[2rem] border border-slate-200/60 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bebas text-2xl text-[#0a3d0a] tracking-wider uppercase flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-[#F59E0B]" /> Live & Recent Matches
                  </h3>
                  <button onClick={() => setActiveTab("results")} className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest hover:underline">View All</button>
                  <button onClick={() => setActiveTab("results")} className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest hover:underline">View All</button>
                </div>
                <div className="space-y-3">
                  {matches.slice(0, 4).length === 0 ? (
                    <div className="py-8 text-center text-emerald-700 text-xs font-semibold bg-[#0a3d0a] rounded-xl border border-dashed border-emerald-800">No matches found.</div>
                  ) : matches.slice(0, 4).map(match => (
                    <div key={match._id} className="p-4 bg-[#0a3d0a] border border-emerald-900/30 rounded-2xl flex items-center justify-between hover:bg-[#0f2d1a] hover:shadow-md transition-all text-white">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-[#0a3d0a] rounded-xl shadow-sm border border-emerald-900/30">
                          {match.status === "Live" ? <Clock className="h-4 w-4 text-red-500 animate-pulse" /> : <CheckCircle className="h-4 w-4 text-emerald-600" />}
                        </div>
                        <div>
                        </div>
                      </div>
                      <button onClick={() => setViewingMatch(match)} className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 hover:border-[#F59E0B] hover:text-[#F59E0B] rounded-xl transition-colors text-slate-400">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-[2rem] border border-slate-200/60 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bebas text-2xl text-[#0a3d0a] tracking-wider uppercase flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-[#F59E0B]" /> Recent Clubs
                  </h3>
                  <button onClick={() => setActiveTab("players")} className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest hover:underline">Manage All</button>
                </div>
                <div className="space-y-3">
                  {fullTeamsList.slice(0, 4).length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs font-semibold bg-slate-50 rounded-xl border border-dashed border-slate-200">No clubs approved yet.</div>
                  ) : fullTeamsList.slice(0, 4).map(team => (
                    <div key={team.id} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between hover:bg-white hover:shadow-md transition-all">
                      <div className="flex items-center gap-3">
                        <img src={team.logoUrl} alt="Logo" className="w-10 h-10 rounded-full border border-slate-200 bg-white object-cover" />
                        <div>
                          <p className="text-xs font-black uppercase text-slate-800">{team.clubName}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{team.players.length} Players</p>
                        </div>
                      </div>
                      <button onClick={() => { setSelectedTeam(team); setActiveTab("players"); }} className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 hover:border-[#0a3d0a] hover:text-[#0a3d0a] rounded-xl transition-colors text-slate-400">
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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            {/* Sidebar Team Selection */}
            <div className="lg:col-span-1 bg-white border border-slate-200/60 rounded-[2rem] p-5 shadow-sm space-y-5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search clubs..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full text-xs py-3 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition-shadow"
                />
              </div>
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredTeams.map(team => (
                  <button
                    key={team.id}
                    onClick={() => setSelectedTeam(team)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${selectedTeam?.id === team.id ? 'bg-emerald-50 border-emerald-600 ring-1 ring-emerald-600/30' : 'bg-white border-slate-100 hover:border-emerald-300 hover:bg-slate-50'}`}
                  >
                    <img src={team.logoUrl} alt="" className="w-8 h-8 rounded-full border border-slate-200 object-cover bg-white" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold text-slate-800 uppercase truncate">{team.clubName}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{team.players.length} Players</p>
                    </div>
                  </button>
                ))}
                {filteredTeams.length === 0 && <p className="text-center py-4 text-xs text-slate-400 font-medium">No clubs found.</p>}
              </div>
            </div>

            {/* Main Detail Area */}
            <div className="lg:col-span-3 space-y-6">
              {!selectedTeam ? (
                <div className="bg-white border border-slate-200/60 rounded-[2rem] p-16 text-center shadow-sm">
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                    <Users className="h-10 w-10 text-emerald-600/50" />
                  </div>
                  <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest">Select a Club</h3>
                  <p className="text-xs text-slate-500 font-medium mt-2">Choose a club from the sidebar to view and manage their players and officials.</p>
                </div>
              ) : (
                <>
                  {/* Selected Team Header */}
                  <div className="bg-[#0a3d0a] rounded-[2rem] p-8 relative overflow-hidden shadow-xl border border-emerald-800">
                    <div className="absolute inset-0 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.05]"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-5">
                        <img src={selectedTeam.logoUrl} alt="" className="w-20 h-20 rounded-full border-4 border-[#F59E0B] bg-white object-cover shadow-lg" />
                        <div>
                          <h2 className="text-3xl font-bebas text-[#F59E0B] tracking-widest uppercase">{selectedTeam.clubName}</h2>
                          <div className="flex gap-4 mt-2">
                            <span className="text-[10px] bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-white font-bold uppercase tracking-widest flex items-center gap-1.5 border border-white/20"><Users className="h-3 w-3" /> {selectedTeam.players.length} Players</span>
                            <span className="text-[10px] bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-white font-bold uppercase tracking-widest flex items-center gap-1.5 border border-white/20"><UserCheck className="h-3 w-3" /> {selectedTeam.officials.length} Officials</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3 w-full md:w-auto">
                        <button onClick={() => window.print()} className="flex-1 md:flex-none py-2.5 px-5 bg-[#F59E0B] hover:bg-amber-400 text-[#0a3d0a] rounded-xl text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-lg">
                          <Printer className="h-4 w-4" /> Print Cards
                        </button>
                        <button onClick={() => handleRemoveTeam(selectedTeam.id)} className="flex-1 md:flex-none py-2.5 px-5 bg-red-600 hover:bg-red-500 text-white border border-red-500/50 rounded-xl text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-lg">
                          <Trash2 className="h-4 w-4" /> Delete Club
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Sub-tabs */}
                  <div className="flex gap-2">
                    {(["players", "officials", "tournament"] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setSubTab(tab)}
                        className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${subTab === tab ? 'bg-[#0a3d0a] text-[#F59E0B] shadow-md border border-[#0a3d0a]' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
                      >
                        {tab === "players" ? `Players (${selectedTeam.players.length})` : tab === "officials" ? `Officials (${selectedTeam.officials.length})` : "Manager Settings"}
                      </button>
                    ))}
                  </div>

                  {/* Sub-tab Content */}
                  {subTab === "players" && (
                    <div className="flex flex-wrap gap-5 justify-center sm:justify-start">
                      {selectedTeam.players.map((p: any) => (
                        <div key={p._id} className="relative group/card">
                          <PrintCard person={p} type="player" team={selectedTeam} />
                          <div className="absolute top-2 right-2 flex gap-1 bg-white/95 backdrop-blur-md rounded-xl p-1.5 shadow-lg border border-slate-200 opacity-0 group-hover/card:opacity-100 transition-all z-10">
                            <button onClick={(e) => handlePrintSingleCard(e, '.group\\/card')} className="p-2 text-[#0a3d0a] hover:bg-emerald-50 rounded-lg transition"><Printer className="h-4 w-4" /></button>
                            <button onClick={() => handleRemovePlayer(p._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </div>
                      ))}
                      {selectedTeam.players.length === 0 && <div className="w-full text-center py-16 text-slate-400 text-sm font-semibold border-2 border-dashed border-slate-200 rounded-[2rem] bg-white">No players registered.</div>}
                    </div>
                  )}

                  {subTab === "officials" && (
                    <div className="flex flex-wrap gap-5 justify-center sm:justify-start">
                      {selectedTeam.officials.map((o: any) => (
                        <div key={o._id} className="relative group/card">
                          <PrintCard person={o} type="official" team={selectedTeam} />
                          <div className="absolute top-2 right-2 flex gap-1 bg-white/95 backdrop-blur-md rounded-xl p-1.5 shadow-lg border border-slate-200 opacity-0 group-hover/card:opacity-100 transition-all z-10">
                            <button onClick={(e) => handlePrintSingleCard(e, '.group\\/card')} className="p-2 text-[#0a3d0a] hover:bg-emerald-50 rounded-lg transition"><Printer className="h-4 w-4" /></button>
                            <button onClick={() => handleRemoveOfficial(o._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </div>
                      ))}
                      {selectedTeam.officials.length === 0 && <div className="w-full text-center py-16 text-slate-400 text-sm font-semibold border-2 border-dashed border-slate-200 rounded-[2rem] bg-white">No officials registered.</div>}
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
        return <div>Section under construction</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#071510] text-white font-sans flex flex-col md:flex-row">

      {/* MOBILE HEADER */}
      <div className="md:hidden bg-[#071510] text-white p-4 flex items-center justify-between sticky top-0 z-40 shadow-lg border-b border-emerald-900">
        <div className="flex items-center gap-3">
          <img src="/smartCityImage.jpg" alt="Logo" className="w-8 h-8 rounded-full border-2 border-[#F59E0B]" />
          <h1 className="font-bebas text-xl text-[#F59E0B] tracking-widest">Admin Portal</h1>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 bg-emerald-900 rounded-lg text-emerald-400">
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* FIXED SIDEBAR */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#071510] border-r border-emerald-900/50 flex flex-col transform transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:static md:flex-shrink-0 shadow-2xl md:shadow-none`}>

        {/* Sidebar Logo */}
        <div className="p-6 flex items-center gap-4 border-b border-emerald-900/50">
          <img src="/smartCityImage.jpg" alt="Logo" className="w-12 h-12 rounded-full border-2 border-[#F59E0B] shadow-[0_0_15px_rgba(245,158,11,0.2)]" />
          <div>
            <h1 className="font-bebas text-2xl text-[#F59E0B] tracking-wider leading-none">SmartCity</h1>
            <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-[0.2em] mt-1">Admin Portal</p>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 custom-scrollbar">
          {navItems.map((item) => (
            item.ext ? (
              <Link key={item.id} to={item.to || "#"} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left text-emerald-400 hover:bg-[#0a3d0a] hover:text-[#F59E0B]">
                <item.icon className="h-5 w-5 opacity-70" />
                <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
              </Link>
            ) : (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id as any); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${activeTab === item.id ? 'bg-[#0a3d0a] text-[#F59E0B] shadow-inner border border-emerald-800' : 'text-emerald-400 hover:bg-[#0f2d1a] hover:text-[#F59E0B]'}`}
              >
                <item.icon className={`h-5 w-5 ${activeTab === item.id ? 'opacity-100' : 'opacity-70'}`} />
                <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
                {item.id === "club-approvals" && pendingRegistrationsCount > 0 && (
                  <span className="ml-auto bg-amber-500 text-[#071510] text-[9px] font-black px-2 py-0.5 rounded-full">{pendingRegistrationsCount}</span>
                )}
              </button>
            )
          ))}
        </div>

        {/* Sidebar Footer - Profile */}
        <div className="p-4 border-t border-emerald-900/50 bg-[#040c09]">
          <div className="flex items-center gap-3 p-3 bg-[#0a3d0a]/50 rounded-2xl border border-emerald-900 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center text-[#071510] font-black shadow-inner">SA</div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black text-white uppercase truncate">Super Admin</p>
              <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest truncate">System Root</p>
            </div>
          </div>
          <button onClick={handleAdminLogout} className="w-full flex items-center justify-center gap-2 py-3 bg-red-950/40 hover:bg-red-900 text-red-400 hover:text-white rounded-xl border border-red-900/50 transition-colors text-xs font-black uppercase tracking-widest">
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </div>

      {/* OVERLAY FOR MOBILE SIDEBAR */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header (Desktop) */}
        <header className="hidden md:flex items-center justify-between p-4 bg-[#071510] text-white sticky top-0 z-20 border-b border-emerald-900/50 shadow-lg">
          {/* Left side: Logo and titles */}
          <div className="flex items-center gap-3">
            <img src="/smartCityImage.jpg" alt="Logo" className="w-10 h-10 rounded-full border-2 border-[#F59E0B]" />
            <div className="flex flex-col">
              <h1 className="text-xl font-bebas text-[#F59E0B] tracking-widest">{navItems.find(i => i.id === activeTab)?.label || "Dashboard"}</h1>
              <p className="text-xs text-[#F59E0B] font-bold uppercase tracking-[0.2em]">Master Ledger Workspace</p>
            </div>
          </div>
          {/* Right side: Icons */}
          <div className="flex items-center gap-3">
            <button className="relative">
              <Bell className="h-5 w-5 text-[#F59E0B]" />
              <span className="absolute -top-1 -right-1 bg-amber-500 text-[#071510] text-xs rounded-full px-1">3</span>
            </button>
            <button onClick={loadAdminRecords} className="p-2.5 bg-[#0a3d0a]/30 hover:bg-[#0a3d0a]/50 text-[#F59E0B] rounded-xl border border-[#F59E0B]/30 transition-colors">
              <RefreshCw className={`h-4 w-4 ${loadingRecords ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={handleCopyLivescore} className="flex items-center gap-2 px-3 py-2 bg-[#0a3d0a] hover:bg-[#0f2d1a] text-[#F59E0B] rounded-xl text-xs font-black uppercase tracking-widest transition-colors shadow-md">
              <Share2 className="h-4 w-4" /> Copy Livescore
            </button>
            <div className="flex items-center gap-1 bg-[#0a3d0a] rounded-full px-2 py-1">
              <span className="text-xs font-black text-[#F59E0B]">SA</span>
            </div>
          </div>
        </header>

        {/* Live Ticker Area */}
        <div className="bg-[#0a3d0a] border-b-4 border-[#F59E0B] flex-shrink-0">
          <LiveMarquee matches={matches} />
        </div>

        {/* Main Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative">
          {errorOnRecords && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-600 font-bold flex items-center gap-2 shadow-sm">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{errorOnRecords}</span>
            </div>
          )}
          {renderContent()}
        </main>
      </div>

      {/* HIDDEN PRINT GRID */}
      {selectedTeam && (
        <div className="hidden print:block print-grid">
          {selectedTeam.players.map((player: any) => (
            <div key={player._id} className="p-1 flex items-center justify-center">
              <PrintCard person={player} type="player" team={selectedTeam} />
            </div>
          ))}
          {selectedTeam.officials.map((official: any) => (
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

// CheckCircle inline icon
const CheckCircle = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);
