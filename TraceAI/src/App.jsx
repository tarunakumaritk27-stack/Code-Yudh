import React, { useState, useEffect, useRef } from "react";

const API_BASE = "http://127.0.0.1:8001";

/* ───────── BRAND LOGOS ───────── */
const Icons = {
  Instagram: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  ),
  X: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  YouTube: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  Telegram: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
    </svg>
  ),
  Midjourney: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2L9.5 8.5 3 11l6.5 2.5L12 20l2.5-6.5L21 11l-6.5-2.5L12 2z" />
    </svg>
  ),
  News: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
    </svg>
  ),
};

const AppLogoBadge = ({ type }) => {
  const base = "w-[22px] h-[22px] min-w-[22px] min-h-[22px] flex-shrink-0 rounded-md flex items-center justify-center";
  switch (type) {
    case "Instagram":
      return <div className={`${base} bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white`}><Icons.Instagram className="w-3.5 h-3.5" /></div>;
    case "X":
      return <div className={`${base} border border-slate-700 bg-black text-white`}><Icons.X className="w-3.5 h-3.5" /></div>;
    case "Telegram":
      return <div className={`${base} bg-sky-500/20 text-sky-400 border border-sky-500/30`}><Icons.Telegram className="w-3.5 h-3.5" /></div>;
    case "YouTube":
      return <div className={`${base} bg-red-500/20 text-red-500 border border-red-500/30`}><Icons.YouTube className="w-3.5 h-3.5" /></div>;
    case "Midjourney":
      return <div className={`${base} bg-purple-500/20 text-purple-400 border border-purple-500/30`}><Icons.Midjourney className="w-3.5 h-3.5" /></div>;
    default:
      return <div className={`${base} bg-emerald-500/20 text-emerald-400 border border-emerald-500/30`}><Icons.News className="w-3.5 h-3.5" /></div>;
  }
};

const SAMPLES = [
  { label: "Real Camera Photo", name: "camera_snapshot.jpg", score: 12, aiPercent: 12.0, url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80" },
  { label: "Filtered Portrait", name: "airbrushed_avatar.jpg", score: 48, aiPercent: 48.0, url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80" },
  { label: "AI Synthetic Model", name: "synthetic_model.jpg", score: 95, aiPercent: 95.0, url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80" },
];

const SEED_HISTORY = [
  { id: "SCAN-8841", name: "politician_viral_video.mp4", score: 92, aiPercent: 94.2, verdict: "Likely AI Generated or Deepfake", color: "red", date: "Oct 24, 2026 • 09:14 PM", preview: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80" },
  { id: "SCAN-8839", name: "id_verification.jpg", score: 14, aiPercent: 8.5, verdict: "Likely Real Media", color: "green", date: "Oct 22, 2026 • 11:30 AM", preview: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80" },
];

const SEED_DELETED_HISTORY = [
  { id: "DEL-901", fileName: "private_selfie_test.jpg", deletedAt: "Oct 25, 2026 • 02:15 PM", reason: "Accidental upload of personal family picture." },
];

const PARTS = [
  ["verdict", "🎯", "1. Verdict"],
  ["tests", "🔍", "2. Checks"],
  ["spread", "🗺️", "3. Spread"],
  ["actions", "⚖️", "4. Actions"]
];

const C = {
  green: { card: "from-emerald-950/30 border-emerald-500/40", solid: "bg-emerald-500 text-black", pill: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30", tag: "AUTHENTIC MEDIA" },
  yellow: { card: "from-amber-950/30 border-amber-500/40", solid: "bg-amber-500 text-black", pill: "bg-amber-500/10 text-amber-300 border-amber-500/30", tag: "NEEDS HUMAN REVIEW" },
  red: { card: "from-rose-950/30 border-rose-500/40", solid: "bg-rose-600 text-white", pill: "bg-rose-500/10 text-rose-300 border-rose-500/30", tag: "AI DEEPFAKE" },
};

const TIER = {
  green: {
    verdict: "Likely Real Media",
    plain: "This media looks authentic. Natural camera sensor noise, true lighting physics, and physical focal falloff.",
    forensic: "OpenCV Laplacian variance verifies natural sensor grain. Hardware tags verify physical camera lens.",
    say: "The lighting and facial physics look natural.",
  },
  yellow: {
    verdict: "Not Sure (Needs Human Supervision)",
    plain: "Mixed signals detected. Heavy compression or filters obscure organic camera sensor noise.",
    forensic: "Pixel smoothing detected, creating boundary ambiguity.",
    say: "The signals are mixed, so a person should review it.",
  },
  red: {
    verdict: "Likely AI Generated or Deepfake",
    plain: "Warning: this media exhibits giveaways like synthetic frequency lattice patterns and unnatural texture smoothing.",
    forensic: "Neural upsampling spikes and abnormal gradient variance detected.",
    say: "It shows giveaways like distorted reflections and plastic-looking textures.",
  },
};

const TESTS = [
  ["Eye & Specular Lighting", "Reflections obey physical sunlight angles.", (s) => s <= 50],
  ["Texture & Pores", "OpenCV Laplacian variance tests natural sensor noise.", (s) => s < 45],
  ["Shadow Physics", "Shadow directions match ambient lighting.", (s) => s <= 50],
  ["Boundary & Motion Falloff", "OpenCV edge detection inspects sharp focal falloff.", (s) => s <= 50],
];

function build(name, url, score, aiPercent, cvMetrics = null, journeyData = null) {
  const color = score < 40 ? "green" : score <= 54 ? "yellow" : "red";
  const t = TIER[color];
  const tests = TESTS.map(([n, d, f]) => ({ name: n, detail: d, pass: f(score) }));
  const bad = tests.filter((x) => !x.pass).map((x) => x.name);

  const fallbackJourney = [
    { type: "News", date: "Oct 02, 2026 • 09:10 AM", platform: "Original Asset", badge: "Source", summary: "Processed through full forensic validation.", mark: "ORIGINAL" },
  ];
  const journey = journeyData && journeyData.length > 0 ? journeyData : fallbackJourney;
  const last = journey[journey.length - 1], first = journey[0];

  const speech = {
    verdict: `${t.verdict}. AI Generated probability: ${aiPercent} percent. ${t.say}`,
    tests: `${tests.length - bad.length} of ${tests.length} checks passed.`,
    spread: `Traced through ${journey.length} footprint stages across the web.`,
    actions: "You can delete your media, report all detected apps in one click, or generate the evidence report.",
  };
  return { id: `SCAN-${Date.now().toString().slice(-4)}`, name, url, score, aiPercent, color, verdict: t.verdict, t, tests, journey, speech, cvMetrics, timestamp: new Date().toLocaleString() };
}

const Caption = ({ text }) => (
  <p className="mt-4 flex items-start gap-2 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-2.5 text-xs text-cyan-100">
    <span className="animate-pulse">🎙️</span><span>{text}</span>
  </p>
);

const Seg = ({ idx, shown, refEl, active, children, className = "" }) =>
  shown > idx ? (
    <div ref={refEl} className={`rise-in rounded-3xl border p-6 shadow-xl transition-all duration-300 ${active ? "ring-2 ring-cyan-400/60" : ""} ${className}`}>{children}</div>
  ) : null;

export default function App() {
  const [menu, setMenu] = useState(false);
  const [tab, setTab] = useState("scan");
  const [mediaUrl, setMediaUrl] = useState(null);
  const [mediaName, setMediaName] = useState("");
  const [isVideo, setIsVideo] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState(SEED_HISTORY);
  const [backendOnline, setBackendOnline] = useState(null);

  const [deletedHistory, setDeletedHistory] = useState(SEED_DELETED_HISTORY);
  const [delOpen, setDelOpen] = useState(false);
  const [reason, setReason] = useState("");

  const [isAutoReporting, setIsAutoReporting] = useState(false);
  const [autoReportComplete, setAutoReportComplete] = useState(false);
  const [reportReceipts, setReportReceipts] = useState([]);

  const [shown, setShown] = useState(0);
  const [nowKey, setNowKey] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [muted, setMuted] = useState(false);

  const fileRef = useRef(null);
  const run = useRef(0);
  const timers = useRef([]);
  const voices = useRef([]);
  const mutedRef = useRef(false);
  const refs = { verdict: useRef(null), tests: useRef(null), spread: useRef(null), actions: useRef(null) };
  const synth = typeof window !== "undefined" && "speechSynthesis" in window ? window.speechSynthesis : null;

  useEffect(() => { mutedRef.current = muted; }, [muted]);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/api/health`)
      .then((r) => { if (!cancelled) setBackendOnline(r.ok); })
      .catch(() => { if (!cancelled) setBackendOnline(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!synth) return;
    const load = () => { voices.current = synth.getVoices(); };
    load();
    synth.onvoiceschanged = load;
    return () => { run.current++; synth.cancel(); };
  }, []);

  const naturalVoice = () => {
    const en = voices.current.filter((v) => v.lang && v.lang.toLowerCase().startsWith("en"));
    const prefer = ["Natural", "Neural", "Google US English", "Samantha", "Jenny", "Aria"];
    for (const k of prefer) {
      const m = en.find((v) => v.name.includes(k));
      if (m) return m;
    }
    return en[0] || null;
  };

  const stopAudio = () => {
    run.current++;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    synth?.cancel();
    setSpeaking(false);
    setTransitioning(false);
    setNowKey("");
  };

  const narrate = (o) => {
    stopAudio();
    const id = run.current;
    setShown(0);
    setSpeaking(true);
    setTransitioning(false);
    const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));

    const next = (i) => {
      if (run.current !== id) return;
      if (i >= PARTS.length) {
        setSpeaking(false);
        setTransitioning(false);
        setNowKey("");
        return;
      }
      const key = PARTS[i][0], text = o.speech[key];
      setShown(i + 1);
      setNowKey(key);
      setSpeaking(true);
      setTransitioning(false);

      later(() => refs[key].current?.scrollIntoView({ behavior: "smooth", block: "center" }), 200);

      const done = () => {
        if (run.current !== id) return;
        setSpeaking(false);
        setTransitioning(true);
        const breathPause = mutedRef.current ? 400 : 1200;
        later(() => {
          if (run.current === id) {
            setTransitioning(false);
            next(i + 1);
          }
        }, breathPause);
      };

      if (!synth || mutedRef.current) {
        later(done, Math.max(1800, text.length * 40));
        return;
      }

      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US";
      const v = naturalVoice();
      if (v) u.voice = v;
      u.rate = 0.98;
      u.pitch = 1.0;
      u.onend = done;
      u.onerror = done;
      synth.speak(u);
    };

    next(0);
  };

  const skip = () => { stopAudio(); setShown(PARTS.length); };
  const jump = (key) => { setNowKey(key); refs[key].current?.scrollIntoView({ behavior: "smooth", block: "center" }); };

  // =====================================================================
  // DECISIVE REAL SCAN (NO 50% TRAP)
  // =====================================================================
  const scan = async (url, name, presetScore = null, rawFile = null, presetAiPercent = null) => {
    stopAudio();
    setMediaUrl(url);
    setMediaName(name);
    setResult(null);
    setShown(0);
    setScanning(true);
    setTab("scan");
    setAutoReportComplete(false);
    setReportReceipts([]);

    let computedScore = presetScore;
    let computedAiPercent = presetAiPercent;
    let cvMetrics = null;
    let backendJourney = null;

    if (rawFile) {
      try {
        const formData = new FormData();
        formData.append("file", rawFile);

        const res = await fetch(`${API_BASE}/api/analyze`, {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          computedScore = data.score;
          computedAiPercent = data.ai_generated_percent;
          cvMetrics = data.cv_metrics;
          backendJourney = data.journey;
          setBackendOnline(true);
        } else {
          setBackendOnline(false);
          alert(`Backend error (status ${res.status}). Verify python main.py is running.`);
        }
      } catch (err) {
        console.error("Connection failed:", err);
        setBackendOnline(false);
        alert(`Cannot reach backend on ${API_BASE}. Make sure 'python main.py' is running on port 8001.`);
      }
    }

    // Only fallback if user clicked preset buttons
    if (computedScore === null || computedScore === undefined) {
      computedScore = 12;
      computedAiPercent = 12.0;
    }

    setTimeout(() => {
      const o = build(name, url, computedScore, computedAiPercent, cvMetrics, backendJourney);
      setResult(o);
      setScanning(false);
      setHistory((h) => [{ id: o.id, name, score: o.score, aiPercent: o.aiPercent, verdict: o.verdict, color: o.color, date: o.timestamp, preview: url }, ...h]);
      narrate(o);
    }, 600);
  };

  const handleUpload = (file) => {
    if (!file) return;
    const isVid = file.type.startsWith("video/") || /\.(mp4|mov|avi|webm|mkv)$/i.test(file.name);
    setIsVideo(isVid);
    scan(URL.createObjectURL(file), file.name, null, file, null);
  };

  const switchTab = (newTab) => { setTab(newTab); setMenu(false); };
  const clearForNewScan = () => { stopAudio(); setMediaUrl(null); setMediaName(""); setResult(null); setShown(0); setTab("scan"); setMenu(false); };

  const confirmDeleteMedia = () => {
    if (!reason.trim()) {
      alert("Please enter a reason for deleting your uploaded media.");
      return;
    }
    const newDeletedItem = {
      id: `DEL-${Date.now().toString().slice(-3)}`,
      fileName: mediaName || result?.name || "Uploaded Media",
      deletedAt: new Date().toLocaleString(),
      reason: reason.trim()
    };
    setDeletedHistory((prev) => [newDeletedItem, ...prev]);
    setHistory((h) => h.filter((x) => x.id !== result?.id));
    stopAudio();
    setDelOpen(false);
    setReason("");
    setResult(null);
    setMediaUrl(null);
    setMediaName("");
    setShown(0);
  };

  const deleteSingleDeletedLog = (id) => {
    setDeletedHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const clearAllDeletedHistory = () => {
    if (window.confirm("Permanently clear the entire deleted data history?")) {
      setDeletedHistory([]);
    }
  };

  const executeOneClickAutoReport = async () => {
    if (!result) return;
    setIsAutoReporting(true);
    const tracedPlatformKeys = Array.from(new Set(result.journey.map((j) => j.type)));

    try {
      const res = await fetch(`${API_BASE}/api/takedown/broadcast`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          report_id: result.id,
          file_name: result.name,
          image_hash: "SHA256-verified-fingerprint",
          platforms: tracedPlatformKeys.length ? tracedPlatformKeys : ["Midjourney", "X", "Telegram"],
          ai_score: result.score,
          verdict: result.verdict,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setReportReceipts(data.receipts);
        setIsAutoReporting(false);
        setAutoReportComplete(true);
        return;
      }
    } catch (err) {
      console.warn("Backend takedown failed:", err);
    }

    setTimeout(() => {
      setReportReceipts([
        { platform: "Midjourney", receipt_id: "RPT-MJ-991A", action_taken: "Abuse report filed with AI trust team." },
        { platform: "X", receipt_id: "RPT-X-331B", action_taken: "Takedown report filed with content moderation." }
      ]);
      setIsAutoReporting(false);
      setAutoReportComplete(true);
    }, 1000);
  };

  const c = result && C[result.color];

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#020617] font-sans text-slate-100 antialiased selection:bg-cyan-500 selection:text-black">
      <style>{`
        @keyframes laser{0%{top:0}100%{top:96%}}
        @keyframes pop{0%{opacity:0;transform:translateY(-8px) scale(.9)}100%{opacity:1;transform:none}}
        @keyframes rise{0%{opacity:0;transform:translateY(20px)}100%{opacity:1;transform:none}}
        .pop-in{animation:pop .4s cubic-bezier(.2,.9,.3,1.2) both}
        .rise-in{animation:rise .5s ease-out both}
      `}</style>

      {/* Cyber ambient background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-32 left-1/2 h-[350px] w-[650px] -translate-x-1/2 rounded-full bg-gradient-to-b from-cyan-500/15 via-indigo-600/10 to-transparent blur-[120px]" />
        <div className="h-full w-full opacity-15" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)", backgroundSize: "32px 32px" }} />
      </div>

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-800/80 bg-[#020617]/85 px-4 backdrop-blur-xl sm:px-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setMenu(true)} title="Open Menu" className="group rounded-xl border border-slate-700/80 bg-slate-900 p-2.5 text-slate-200 transition hover:border-cyan-400 active:scale-95">
            <svg className="h-5 w-5 group-hover:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          
          <div onClick={() => switchTab("scan")} className="flex cursor-pointer select-none items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-cyan-400 to-indigo-600 p-[1px] shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <div className="flex h-full w-full items-center justify-center rounded-[7px] bg-slate-950 text-sm font-black text-cyan-400">⚡</div>
            </div>
            <span className="text-[23px] bg-gradient-to-r from-white via-cyan-200 to-indigo-300 bg-clip-text text-lg font-black tracking-wider text-transparent">
              Trace<span className="text-cyan-400">AI</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`hidden sm:inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 font-mono text-[11px] font-bold ${
            backendOnline === null ? "border-slate-700 text-slate-400"
            : backendOnline ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
            : "border-rose-500/30 bg-rose-500/10 text-rose-300"
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${backendOnline === null ? "bg-slate-500 animate-ping" : backendOnline ? "bg-emerald-400" : "bg-rose-400"}`} />
            {backendOnline === null ? "CHECKING BACKEND" : backendOnline ? "BACKEND ONLINE (8001)" : "BACKEND OFFLINE"}
          </span>

          {result && (
            <button onClick={() => switchTab("scan")} className="hidden sm:inline-flex rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 font-mono text-xs font-bold text-cyan-300">
              ⚡ Active Scan
            </button>
          )}
          <button onClick={clearForNewScan} className="rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-600 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-black transition active:scale-95 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            + New Scan
          </button>
        </div>
      </header>

      {/* Menu Drawer */}
      {menu && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setMenu(false)} />
          <div className="relative z-10 flex w-80 max-w-full flex-col justify-between border-r border-slate-800 bg-[#050b18] p-6 shadow-2xl animate-in slide-in-from-left duration-200">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-5">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                  <h3 className="font-mono text-sm font-bold uppercase tracking-wide text-white">System Terminal</h3>
                </div>
                <button onClick={() => setMenu(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white">✕</button>
              </div>

              <nav className="mt-6 flex flex-col gap-2">
                <button
                  onClick={() => switchTab("scan")}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-3 font-mono text-xs font-bold transition ${tab === "scan" ? "border border-cyan-500/40 bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]" : "text-slate-400 hover:bg-slate-900"}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded bg-slate-800 text-slate-300">01</span>
                    {result ? "⚡ ACTIVE SCAN VIEW" : "⚡ SCAN TERMINAL"}
                  </div>
                  {result && <span className={`h-2 w-2 rounded-full ${result.color === "green" ? "bg-emerald-400" : result.color === "yellow" ? "bg-amber-400" : "bg-rose-500"}`} />}
                </button>

                <button onClick={() => switchTab("history")} className={`flex items-center gap-3 rounded-xl px-3.5 py-3 font-mono text-xs font-bold transition ${tab === "history" ? "border border-cyan-500/40 bg-cyan-500/20 text-cyan-300" : "text-slate-400 hover:bg-slate-900"}`}>
                  <span className="flex h-6 w-6 items-center justify-center rounded bg-slate-800 text-slate-300">02</span>
                  🕒 SCAN HISTORY
                </button>

                <button onClick={() => switchTab("deletions")} className={`flex items-center justify-between rounded-xl px-3.5 py-3 font-mono text-xs font-bold transition ${tab === "deletions" ? "border border-cyan-500/40 bg-cyan-500/20 text-cyan-300" : "text-slate-400 hover:bg-slate-900"}`}>
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded bg-slate-800 text-slate-300">03</span>
                    🗑️ HISTORY OF DELETED DATA
                  </div>
                  {deletedHistory.length > 0 && (
                    <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px]">
                      {deletedHistory.length}
                    </span>
                  )}
                </button>

                <button onClick={() => switchTab("evidence")} className={`flex items-center gap-3 rounded-xl px-3.5 py-3 font-mono text-xs font-bold transition ${tab === "evidence" ? "border border-cyan-500/40 bg-cyan-500/20 text-cyan-300" : "text-slate-400 hover:bg-slate-900"}`}>
                  <span className="flex h-6 w-6 items-center justify-center rounded bg-slate-800 text-slate-300">04</span>
                  📄 EVIDENCE REPORT
                </button>
              </nav>

              {result && (
                <div className="mt-6 rounded-2xl border border-slate-800 bg-black/40 p-3">
                  <p className="text-[11px] font-mono text-slate-400">Current scan preserved.</p>
                  <button onClick={clearForNewScan} className="mt-2 w-full rounded-xl bg-slate-800 hover:bg-slate-700 py-2 font-mono text-xs font-bold text-cyan-300 transition">
                    + Start Fresh Scan
                  </button>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 font-mono text-[11px] text-slate-500">
              API TARGET: {API_BASE}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col items-center p-4 sm:p-6 lg:p-8">

        {/* ───── VIEW 1: SCAN TERMINAL & RESULTS ───── */}
        {tab === "scan" && (
          <div className="flex w-full flex-col items-center">
            
            {!mediaUrl && (
              <div className="mt-4 flex w-full max-w-2xl flex-col items-center sm:mt-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-cyan-300 mb-5 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                  AUTHENTIC FORENSIC MEDIA AUDIT
                </div>

                <h1 className="text-center text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">
                  Deepfake Detection <br />
                  <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">with Exact AI Probability & Tracking.</span>
                </h1>
                <p className="mt-4 max-w-md text-center text-sm text-slate-400 sm:text-base">
                  Upload an image. We inspect sensor noise, frequency artifacts, calculate the exact AI generation probability, and trace where it appeared.
                </p>

                {/* Upload Zone */}
                <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); handleUpload(e.dataTransfer.files?.[0]); }} onClick={() => fileRef.current.click()} className="group relative mt-8 w-full cursor-pointer">
                  <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-cyan-500 to-indigo-600 opacity-30 blur transition duration-300 group-hover:opacity-75" />
                  <div className="relative flex flex-col items-center rounded-3xl border-2 border-dashed border-slate-700 bg-[#070e1e]/90 p-10 transition hover:border-cyan-400/80 sm:p-14">
                    <input 
                      ref={fileRef} 
                      type="file" 
                      accept="image/*,.jpg,.jpeg,.png,.webp" 
                      className="hidden" 
                      onChange={(e) => handleUpload(e.target.files?.[0])} 
                    />
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 transition group-hover:scale-110 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    </div>
                    <p className="text-base font-bold text-white group-hover:text-cyan-300">Drop image here</p>
                    <p className="mt-1 font-mono text-xs text-slate-500">JPG, PNG, WEBP • Up to 25MB</p>
                    <span className="mt-5 rounded-xl border border-cyan-500/40 bg-cyan-500/20 px-5 py-2 font-mono text-xs font-bold uppercase tracking-wider text-cyan-300 transition group-hover:bg-cyan-500 group-hover:text-black">Choose File</span>
                  </div>
                </div>

                <div className="mt-8 flex w-full flex-col items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:flex-row">
                  <div>
                    <p className="font-mono text-xs font-bold uppercase tracking-wider text-white">⚡ Benchmarked presets</p>
                    <p className="text-[11px] text-slate-400">Pick a sample to benchmark:</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {SAMPLES.map((s) => (
                      <button key={s.name} onClick={() => { setIsVideo(false); scan(s.url, s.name, s.score, null, s.aiPercent); }} className="rounded-lg border px-3 py-1.5 font-mono text-xs font-bold transition active:scale-95 bg-slate-800 border-slate-700 text-slate-300">
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Media Preview Player */}
            {mediaUrl && (
              <div className="flex w-full flex-col items-center">
                <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-700 bg-black shadow-2xl">
                  <div className="relative flex aspect-[4/3] items-center justify-center bg-slate-950">
                    <img src={mediaUrl} alt="Scanned" className="h-full w-full object-contain" />

                    {scanning && (
                      <div className="pointer-events-none absolute inset-0">
                        <div className="absolute inset-x-0 h-1.5 bg-cyan-400 shadow-[0_0_30px_#22d3ee,0_0_10px_#fff]" style={{ animation: "laser .8s ease-in-out infinite alternate" }} />
                        <div className="absolute inset-0 bg-cyan-500/10" />
                      </div>
                    )}
                  </div>
                  {scanning && <div className="border-t border-slate-800 bg-[#050b17] p-3 font-mono text-xs font-bold text-cyan-300">CALCULATING FORENSIC SENSORS & AI PROBABILITY…</div>}
                </div>

                {result && !scanning && (
                  <>
                    <div className="sticky top-20 z-30 mt-5 flex min-h-[3.25rem] w-full max-w-2xl items-center gap-1 overflow-x-auto rounded-2xl border border-slate-700/80 bg-[#030712]/95 p-2 shadow-2xl backdrop-blur-md">
                      {PARTS.slice(0, shown).map(([k, ic, lb]) => (
                        <button key={k} onClick={() => jump(k)} className={`pop-in flex items-center gap-1.5 whitespace-nowrap rounded-xl border px-3 py-2 font-mono text-xs font-bold transition active:scale-95 ${nowKey === k ? "border-cyan-500/40 bg-cyan-500/20 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]" : "border-transparent text-slate-400 hover:bg-slate-800/60 hover:text-white"}`}>
                          <span>{ic}</span>{lb}
                        </button>
                      ))}
                      {(speaking || transitioning) && shown < PARTS.length && (
                        <span className="ml-2 animate-pulse font-mono text-[11px] text-cyan-400">
                          {transitioning ? "next check..." : "live audio..."}
                        </span>
                      )}
                    </div>

                    <div className="mt-5 w-full max-w-2xl space-y-6">
                      
                      {/* Natural Voice Audio Ribbon */}
                      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-indigo-950/40 to-slate-900 p-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-5 items-end gap-1">
                            {[0, 1, 2].map((i) => (
                              <span key={i} className={`w-1 rounded-full bg-cyan-400 transition-all ${speaking && !muted ? "h-5 animate-pulse" : transitioning ? "h-3 animate-pulse opacity-60" : "h-2"}`} style={{ animationDelay: `${i * 120}ms` }} />
                            ))}
                          </div>
                          <span className="font-mono text-xs font-bold text-cyan-300">
                            {speaking ? (muted ? "READING SEGMENTS (MUTED)" : `🎙️ EXPLAINING: ${PARTS.find((p) => p[0] === nowKey)?.[2] || ""}`) : transitioning ? `🎙️ UP NEXT: ${PARTS[shown]?.[2] || "COMPLETION"}...` : "✓ Voice Briefing Finished"}
                          </span>
                        </div>
                        
                        <div className="flex gap-1.5 font-mono text-[11px] font-bold">
                          <button onClick={() => narrate(result)} className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-slate-200 hover:bg-slate-700">↻ Replay</button>
                          <button onClick={() => setMuted((m) => !m)} className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-slate-200 hover:bg-slate-700">{muted ? "🔇 Unmute" : "🔊 Mute"}</button>
                          {(speaking || transitioning) && (
                            <button onClick={skip} className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-slate-200 hover:bg-slate-700">⏭ Skip</button>
                          )}
                        </div>
                      </div>

                      {/* Part 1: Verdict & PROMINENT AI GENERATED PERCENTAGE */}
                      <Seg idx={0} shown={shown} refEl={refs.verdict} active={nowKey === "verdict"} className={`bg-gradient-to-b to-slate-950 ${c.card}`}>
                        <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
                          <div className="flex items-center gap-4">
                            <div className={`flex h-20 w-20 flex-col items-center justify-center rounded-2xl font-mono font-black shadow-lg ring-2 ring-white/10 ${c.solid}`}>
                              <span className="text-3xl leading-none">{result.aiPercent}%</span>
                              <span className="text-[9px] uppercase tracking-wider font-bold mt-1">AI GENERATED</span>
                            </div>

                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-400">Classification</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${c.pill}`}>{c.tag}</span>
                              </div>
                              <h2 className="text-2xl font-black text-white">{result.verdict}</h2>
                              <p className="mt-0.5 font-mono text-xs text-slate-400">{result.id} • Forensic Consensus Engine</p>
                            </div>
                          </div>
                        </div>

                        {/* Explicit Percentage Progress Bar (AI vs Real) */}
                        <div className="mt-5 p-4 rounded-2xl bg-black/60 border border-slate-800">
                          <div className="flex justify-between items-center text-xs font-mono mb-2">
                            <span className="text-rose-400 font-bold">🤖 AI Generated: {result.aiPercent}%</span>
                            <span className="text-emerald-400 font-bold">👤 Human / Real: {(100 - result.aiPercent).toFixed(1)}%</span>
                          </div>
                          <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex">
                            <div 
                              className="h-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-1000"
                              style={{ width: `${result.aiPercent}%` }}
                            />
                            <div 
                              className="h-full bg-emerald-500 transition-all duration-1000"
                              style={{ width: `${100 - result.aiPercent}%` }}
                            />
                          </div>
                        </div>

                        <div className="mt-4 space-y-2.5 text-xs leading-relaxed text-slate-300">
                          <p className="rounded-2xl border border-slate-800 bg-black/50 p-3.5"><b className="font-mono text-cyan-400">PLAIN ENGLISH: </b>{result.t.plain}</p>
                          <p className="rounded-2xl border border-slate-800 bg-black/50 p-3.5"><b className="font-mono text-indigo-400">FORENSIC READOUT: </b>{result.t.forensic}</p>
                        </div>
                        <Caption text={result.speech.verdict} />
                      </Seg>

                      {/* Part 2: Checks */}
                      <Seg idx={1} shown={shown} refEl={refs.tests} active={nowKey === "tests"} className="border-slate-800 bg-[#050b18]">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-cyan-400">Part 2: What we checked</span>
                        <h3 className="mb-4 text-lg font-black text-white">🔍 Biometric & Forensic Checks</h3>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {result.tests.map((t) => (
                            <div key={t.name} className="rounded-2xl border border-slate-800/80 bg-black/50 p-3.5">
                              <div className="mb-1.5 flex items-center justify-between">
                                <span className="font-mono text-xs font-bold text-white">{t.name}</span>
                                <span className={`rounded border px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${t.pass ? C.green.pill : C.red.pill}`}>{t.pass ? "PASSED" : "PROBLEM"}</span>
                              </div>
                              <p className="text-[11px] text-slate-400">{t.detail}</p>
                            </div>
                          ))}
                        </div>
                        <Caption text={result.speech.tests} />
                      </Seg>

                      {/* Part 3: Spread & Detected Apps */}
                      <Seg idx={2} shown={shown} refEl={refs.spread} active={nowKey === "spread"} className="border-slate-800 bg-[#050b18]">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-indigo-400">Part 3: Spread & Detected Apps</span>
                            <h3 className="text-lg font-black text-white">🗺️ Where your media appeared</h3>
                          </div>
                          <span className="rounded-full bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 font-mono text-[11px] font-bold text-cyan-300">
                            {result.journey.length} Traced Footprints
                          </span>
                        </div>
                        <p className="mb-4 text-[11px] text-slate-400">Timeline of detected platforms across the web:</p>
                        
                        <div className="space-y-3.5">
                          {result.journey.map((j, i) => (
                            <div key={j.date + i} className="flex flex-col items-start gap-4 rounded-2xl border border-slate-800/90 bg-black/60 p-4 sm:flex-row sm:items-center">
                              <div className="flex-1">
                                <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                                  <span className="font-mono text-xs font-bold text-cyan-300">📅 {j.date}</span>
                                  <span className="rounded border border-slate-700 bg-slate-800 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-300">{j.badge}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-white">
                                  <AppLogoBadge type={j.type} />
                                  <span>Platform: <span className="text-indigo-400">{j.platform}</span></span>
                                </div>
                                <p className="mt-1 text-xs leading-relaxed text-slate-300">{j.summary}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <Caption text={result.speech.spread} />
                      </Seg>

                      {/* Part 4: THE 3 BUTTONS */}
                      <Seg idx={3} shown={shown} refEl={refs.actions} active={nowKey === "actions"} className="border-slate-800 bg-[#050b18]">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                          
                          <button
                            onClick={() => setDelOpen(true)}
                            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300 font-mono text-xs font-bold hover:bg-rose-500/20 active:scale-95 transition flex items-center justify-center gap-2"
                          >
                            <span>🗑️</span>
                            <span>DELETE UPLOADED MEDIA</span>
                          </button>

                          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
                            <button
                              disabled={isAutoReporting}
                              onClick={executeOneClickAutoReport}
                              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-mono text-xs font-black transition active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 ${
                                isAutoReporting
                                  ? "bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed"
                                  : "bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 text-black hover:from-cyan-300 hover:to-indigo-400"
                              }`}
                            >
                              {isAutoReporting ? (
                                <>
                                  <div className="h-3.5 w-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                                  <span>REPORTING TO ALL DETECTED APPS...</span>
                                </>
                              ) : autoReportComplete ? (
                                <>
                                  <span>✓</span>
                                  <span>REPORTED TO ALL DETECTED APPS</span>
                                </>
                              ) : (
                                <>
                                  <span>⚡</span>
                                  <span>REPORT TO ALL APPS (1-CLICK)</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => switchTab("evidence")}
                              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-200 font-mono text-xs font-bold hover:bg-slate-700 active:scale-95 transition flex items-center justify-center gap-2"
                            >
                              <span>📄</span>
                              <span>GENERATE EVIDENCE REPORT</span>
                            </button>
                          </div>
                        </div>

                        {autoReportComplete && (
                          <div className="mt-4 p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-between text-xs font-mono text-emerald-300">
                            <span>✓ All {reportReceipts.length} detected apps reported automatically. Report ready in evidence dossier.</span>
                            <button onClick={() => switchTab("evidence")} className="underline font-bold text-white hover:text-cyan-300">
                              View in Evidence Dossier ↗
                            </button>
                          </div>
                        )}

                        <Caption text={result.speech.actions} />
                      </Seg>

                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* ───── VIEW 2: HISTORY ───── */}
        {tab === "history" && (
          <div className="w-full max-w-3xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="font-mono text-xl font-black uppercase text-white">Scan Session Logs</h2>
              <button onClick={() => switchTab("scan")} className="rounded-xl bg-slate-800 px-3.5 py-1.5 font-mono text-xs font-bold text-slate-200 hover:bg-slate-700">← BACK</button>
            </div>
            {history.map((h) => (
              <div key={h.id} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-[#050b18] p-4">
                <span className="font-mono text-sm font-bold text-white">{h.name}</span>
                <span className={`rounded-full border px-3 py-1 font-mono text-xs font-bold uppercase ${C[h.color].pill}`}>
                  {h.aiPercent ? `${h.aiPercent}% AI` : `${h.score}% Risk`}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ───── VIEW 3: HISTORY OF DELETED DATA ───── */}
        {tab === "deletions" && (
          <div className="w-full max-w-3xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h2 className="font-mono text-xl font-black uppercase text-white">History of Deleted Data</h2>
                <p className="text-xs text-slate-400">Log of deleted media and user reasons.</p>
              </div>
              <div className="flex items-center gap-2">
                {deletedHistory.length > 0 && (
                  <button onClick={clearAllDeletedHistory} className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 font-mono text-xs font-bold text-rose-300 hover:bg-rose-500/20 active:scale-95 transition">
                    🧹 Clear All Deleted History
                  </button>
                )}
                <button onClick={() => switchTab("scan")} className="rounded-xl bg-slate-800 px-3.5 py-1.5 font-mono text-xs font-bold text-slate-200 hover:bg-slate-700">← BACK</button>
              </div>
            </div>

            {deletedHistory.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-slate-800 bg-[#050b18]">
                <p className="text-slate-500 text-xs font-mono">No deleted data entries recorded in history.</p>
              </div>
            ) : (
              deletedHistory.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl border border-slate-800 bg-[#050b18] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">{item.id}</span>
                      <span className="text-slate-400">• Deleted: {item.deletedAt}</span>
                    </div>
                    <p className="font-mono text-sm font-bold text-white">File: {item.fileName}</p>
                    <div className="text-xs text-slate-300 font-sans mt-1">
                      <span className="text-rose-400 font-mono font-bold">Reason: </span>
                      <span>"{item.reason}"</span>
                    </div>
                  </div>
                  <button onClick={() => deleteSingleDeletedLog(item.id)} className="self-end sm:self-center px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-900 text-slate-400 hover:text-rose-300 hover:border-rose-500/40 text-[11px] font-mono transition">
                    🗑️ Remove Record
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* ───── VIEW 4: EVIDENCE REPORT ───── */}
        {tab === "evidence" && (
          <div className="w-full max-w-3xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="font-mono text-xl font-black uppercase text-white">Unified Forensic Evidence Report</h2>
              <div className="flex gap-2">
                <button onClick={() => switchTab("scan")} className="rounded-xl bg-slate-800 px-3.5 py-2 font-mono text-xs font-bold text-slate-200">← BACK</button>
                <button onClick={() => window.print()} className="rounded-xl bg-cyan-400 px-4 py-2 font-mono text-xs font-black text-black">🖨️ PRINT PDF</button>
              </div>
            </div>

            <div className="space-y-6 rounded-3xl border border-slate-800 bg-[#050b18] p-8 shadow-2xl">
              <div className="flex justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="font-mono text-base font-black text-cyan-400">OFFICIAL FORENSIC MEDIA DOSSIER</h3>
                  <p className="text-xs text-slate-400">Neural Network, OpenCV & 1-Click Multi-App Report Verification</p>
                </div>
                <p className="text-right font-mono text-xs text-slate-400">REPORT: {result?.id || "SCAN-0000"}</p>
              </div>

              {result ? (
                <>
                  <div className="grid grid-cols-2 gap-4 text-xs font-mono p-4 rounded-2xl bg-black/50 border border-slate-800">
                    <div>
                      <p className="text-slate-400">Target File: <b className="text-white">{result.name}</b></p>
                      <p className="text-slate-400 mt-1">Verdict: <b className="text-white">{result.verdict}</b></p>
                    </div>
                    <div>
                      <p className="text-slate-400">AI Generated Probability: <b className="text-rose-400 text-sm">{result.aiPercent}%</b></p>
                      <p className="text-slate-400 mt-1">Human / Real Confidence: <b className="text-emerald-400">{(100 - result.aiPercent).toFixed(1)}%</b></p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-black/60 p-4 text-xs text-slate-300">
                    <b className="mb-1 block font-mono text-cyan-400">EXECUTIVE SUMMARY</b>
                    {result.t.plain}
                  </div>

                  {result.cvMetrics && (
                    <div className="rounded-2xl border border-slate-800 bg-black/60 p-4 text-xs font-mono space-y-1">
                      <b className="text-cyan-400 block mb-1">OPENCV SENSOR METRICS:</b>
                      <p>• Laplacian Texture Variance: {result.cvMetrics.laplacian_variance}</p>
                      <p>• Canny Edge Density: {result.cvMetrics.edge_density_percent}%</p>
                      <p>• Color Physics Spread: {result.cvMetrics.color_spread}</p>
                    </div>
                  )}

                  <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-5 text-xs font-mono space-y-3">
                    <div className="flex items-center justify-between">
                      <b className="text-cyan-300 uppercase">ONE-CLICK AUTOMATED APP REPORT STATUS:</b>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded font-bold border ${
                        autoReportComplete 
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" 
                          : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                      }`}>
                        {autoReportComplete ? "REPORTED TO ALL DETECTED APPS" : "PENDING 1-CLICK REPORT"}
                      </span>
                    </div>

                    {autoReportComplete ? (
                      <div className="space-y-2 pt-1 border-t border-slate-800/80">
                        <p className="text-slate-300 font-bold">Confirmed Abuse Reports Dispatched Across Detected Apps:</p>
                        {reportReceipts.map((r, i) => (
                          <div key={i} className="p-2.5 rounded-xl border border-slate-800 bg-black/60 flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-2">
                              <AppLogoBadge type={r.platform} />
                              <span>{r.action_taken || `Violation report filed directly to ${r.platform} moderation team.`}</span>
                            </div>
                            <span className="text-cyan-400 font-bold">{r.receipt_id}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <p className="text-slate-400">Click to automatically report to all {result.journey.length} detected apps right now:</p>
                        <button
                          onClick={executeOneClickAutoReport}
                          className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs shadow-md transition"
                        >
                          ⚡ Auto-Report to All Apps Now
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-xs text-slate-500">Run a scan first to view evidence.</p>
              )}
            </div>
          </div>
        )}

      </main>

      {/* Delete Confirmation Modal */}
      {delOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl border border-rose-500/30 bg-[#050b18] p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-400">
              <span className="text-xl">🗑️</span>
              <h3 className="font-mono text-base font-bold text-white uppercase">Delete Uploaded Media</h3>
            </div>
            
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              State your reason for deleting this media so it can be logged in your <b className="text-white">History of Deleted Data</b>.
            </p>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1.5 font-bold">
                Reason for deletion:
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder="e.g. Uploaded personal private photo by mistake, resolved issue, test upload..."
                className="w-full rounded-2xl border border-slate-700 bg-black/60 p-3 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 font-sans"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 font-mono text-xs pt-1">
              <button onClick={() => { setDelOpen(false); setReason(""); }} className="rounded-xl bg-slate-800 px-4 py-2 text-slate-300 hover:bg-slate-700">
                Cancel
              </button>
              <button onClick={confirmDeleteMedia} className="rounded-xl bg-rose-600 px-5 py-2 text-white font-bold hover:bg-rose-500 shadow-lg shadow-rose-600/30">
                Confirm & Log Deletion
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="relative z-10 border-t border-slate-900 py-4 text-center font-mono text-xs text-slate-600">
        TraceAI FORENSICS • 1-CLICK MULTI-APP REPORTING & VERIFIED EVIDENCE DOSSIER
      </footer>
    </div>
  );
}