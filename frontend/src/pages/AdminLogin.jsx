import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { api } from "../services/api";

// Works whether services/api.js exports `api` (named), a default object,
// or exports login() directly. Authentication is unchanged: api.login({ email, password }).


// Fireflies: x/y in %, size in px, duration and delay in seconds.
const FIREFLIES = [
  { x: 6, y: 18, s: 3, d: 9, delay: 0 }, { x: 14, y: 62, s: 2, d: 11, delay: 2 },
  { x: 22, y: 36, s: 3, d: 8, delay: 4 }, { x: 31, y: 80, s: 2, d: 12, delay: 1 },
  { x: 38, y: 12, s: 2, d: 10, delay: 5 }, { x: 44, y: 55, s: 3, d: 9, delay: 3 },
  { x: 52, y: 88, s: 2, d: 13, delay: 6 }, { x: 58, y: 24, s: 3, d: 10, delay: 2 },
  { x: 66, y: 70, s: 2, d: 11, delay: 0 }, { x: 74, y: 8, s: 2, d: 12, delay: 4 },
  { x: 82, y: 46, s: 3, d: 9, delay: 1 }, { x: 90, y: 84, s: 2, d: 10, delay: 5 },
  { x: 95, y: 28, s: 3, d: 8, delay: 3 }, { x: 10, y: 90, s: 2, d: 12, delay: 6 },
];

export default function AdminLogin() {
  const navigate = useNavigate();
  const [lampOn, setLampOn] = useState(true);
  const [swing, setSwing] = useState(0); // 0 = never pulled; odd/even alternate two identical animations
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const pullCord = () => {
    setLampOn((on) => !on);
    setSwing((n) => n + 1);
  };

  const onCordKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); // stops Space from scrolling the page
      pullCord();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    setLoading(true);
    try {
      await api.login({ email: email.trim(), password });
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err?.message || 'Login failed. Check your email and password, then try again.');
    } finally {
      setLoading(false);
    }
  };

  const cordClass = swing === 0 ? '' : swing % 2 ? 'swing-a' : 'swing-b';

  return (
    <main className={`lamp-login ${lampOn ? 'is-on' : 'is-off'}`}>
      <style>{STYLES}</style>

      <div className="ll-fireflies" aria-hidden="true">
        {FIREFLIES.map((f, i) => (
          <span key={i} style={{ left: `${f.x}%`, top: `${f.y}%`, width: f.s, height: f.s,
            animationDuration: `${f.d}s`, animationDelay: `${f.delay}s` }} />
        ))}
      </div>

      <div className="ll-layout">
        {/* LEFT: lamp (its own column, clipped so light never reaches the card) */}
        <div className="ll-stage">
          <p className="ll-hint" aria-live="polite">
            {lampOn ? '' : 'Pull the string to turn on the login form'}
          </p>

          <svg className="ll-svg" width="400" height="440" viewBox="0 0 400 440"
            preserveAspectRatio="xMidYMax meet" role="img" aria-label="Desk lamp with a pull string">
            <defs>
              <linearGradient id="ll-beam" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#ffc83c" stopOpacity="0.6" />
                <stop offset="0.6" stopColor="#ffb820" stopOpacity="0.2" />
                <stop offset="1" stopColor="#ffb820" stopOpacity="0.04" />
              </linearGradient>
              <radialGradient id="ll-floor" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0" stopColor="#ffc83c" stopOpacity="0.36" />
                <stop offset="1" stopColor="#ffc83c" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="ll-halo" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0" stopColor="#ffd45a" stopOpacity="0.3" />
                <stop offset="1" stopColor="#ffd45a" stopOpacity="0" />
              </radialGradient>
              <filter id="ll-blur" x="-50%" y="-200%" width="200%" height="500%">
                <feGaussianBlur stdDeviation="4" />
              </filter>
            </defs>

            <g className="ll-light">
              <ellipse cx="200" cy="120" rx="170" ry="110" fill="url(#ll-halo)" />
              <polygon points="146,124 254,124 394,424 6,424" fill="url(#ll-beam)" />
              <ellipse cx="200" cy="424" rx="190" ry="26" fill="url(#ll-floor)" />
            </g>

            <rect x="198" y="124" width="4" height="294" fill="#1d1d22" />
            <ellipse cx="200" cy="420" rx="46" ry="8" fill="#141417" />
            <ellipse cx="200" cy="417" rx="46" ry="7" fill="#1c1c21" />

            <path d="M138 124 A62 54 0 0 1 262 124 Z" fill="#0c0c0f" />
            <path className="ll-rim" d="M142 120 A58 50 0 0 1 258 120" fill="none" strokeWidth="1.5" />
            <rect x="194" y="68" width="12" height="6" rx="2" fill="#0c0c0f" />
            <ellipse className="ll-bulb-glow" cx="200" cy="125" rx="52" ry="6" fill="#ffd45a" filter="url(#ll-blur)" />
            <ellipse className="ll-bulb" cx="200" cy="124" rx="46" ry="3.5" />

            {/* Pull string: click, tap, or press Enter / Space */}
            <g
              className={`ll-cord ${cordClass}`}
              role="button"
              tabIndex={0}
              aria-pressed={lampOn}
              aria-label={lampOn ? 'Pull the string to turn the lamp off' : 'Pull the string to turn the lamp on'}
              onClick={pullCord}
              onKeyDown={onCordKey}
              onMouseDown={(e) => e.preventDefault()}
            >
              <rect x="232" y="124" width="40" height="110" fill="transparent" />
              <line x1="252" y1="124" x2="252" y2="198" stroke="#4a4a50" strokeWidth="1.5" />
              <rect className="ll-bead" x="248.5" y="198" width="7" height="15" rx="3.5" fill="#e3b341" />
            </g>
          </svg>
        </div>

        {/* RIGHT: login card (never moves when the lamp toggles) */}
        <div className="ll-panel">
          <div className="ll-card" inert={!lampOn}>
            <h1 className="ll-title">Welcome Back</h1>
            <p className="ll-subtitle">Sign in to the K12 Hunar admin panel</p>

            <form className="ll-form" onSubmit={handleSubmit}>
              <div className="ll-field">
                <label htmlFor="admin-email" className="ll-sr">Email address</label>
                <Mail size={16} aria-hidden="true" />
                <input id="admin-email" type="email" autoComplete="email" placeholder="Email address"
                  value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className="ll-field">
                <label htmlFor="admin-password" className="ll-sr">Password</label>
                <Lock size={16} aria-hidden="true" />
                <input id="admin-password" type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password" placeholder="Password"
                  value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" className="ll-eye" onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {error && <p className="ll-error" role="alert">{error}</p>}

              <button type="submit" className="ll-submit" disabled={loading}>
                {loading ? (<><Loader2 size={18} className="ll-spin" aria-hidden="true" />Signing in…</>) : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

/* All styles are scoped under .lamp-login and live in this file, so they always load
   and cannot leak into other pages. Every rule re-declares the properties that global
   Vite/App styles commonly override (button, h1, input, svg, #root, body). */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');

.lamp-login{
  --gold:#ffd000; --text:#f4f4f5; --muted:#8a8a93;
  position:fixed; inset:0; z-index:1000;
  display:flex; padding:clamp(12px,3vw,28px);
  overflow-x:hidden; overflow-y:auto;
  box-sizing:border-box; margin:0; text-align:left;
  color:var(--text); font-family:'Outfit',system-ui,-apple-system,'Segoe UI',sans-serif; line-height:1.4;
  background:radial-gradient(ellipse 55% 55% at 28% 50%, rgba(255,190,50,.08), transparent 70%), #060608;
  transition:background .7s ease;
}
.lamp-login.is-off{ background:#060608; }
.lamp-login *,.lamp-login *::before,.lamp-login *::after{ box-sizing:border-box; }

.lamp-login .ll-fireflies{ position:fixed; inset:0; pointer-events:none; overflow:hidden; transition:opacity .7s ease; }
.lamp-login.is-off .ll-fireflies{ opacity:.35; }
.lamp-login .ll-fireflies span{
  position:absolute; border-radius:50%; background:#ffd45a; box-shadow:0 0 8px 2px rgba(255,212,90,.7);
  opacity:0; animation:ll-float ease-in-out infinite;
}
@keyframes ll-float{
  0%{opacity:0;transform:translate(0,0)} 20%{opacity:.9} 50%{opacity:.3;transform:translate(14px,-22px)}
  80%{opacity:.8} 100%{opacity:0;transform:translate(-10px,-40px)}
}

/* Two separate columns: lamp left, card right. margin:auto = safe vertical centering. */
.lamp-login .ll-layout{
  position:relative; z-index:1; margin:auto; width:100%; max-width:1000px;
  display:grid; grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);
  align-items:center; gap:clamp(16px,4vw,48px);
}
.lamp-login .ll-stage{
  position:relative; width:100%; height:clamp(260px,64vh,520px);
  overflow:hidden; /* beam can never reach the card */
}
.lamp-login .ll-svg{ display:block; width:100%; height:100%; max-width:none; }
.lamp-login .ll-hint{
  position:absolute; top:4%; left:0; right:0; margin:0; padding:0; text-align:center;
  font-size:.85rem; color:var(--muted); min-height:1.2em; pointer-events:none;
}

/* Light and bulb */
.lamp-login .ll-light,.lamp-login .ll-bulb-glow,.lamp-login .ll-bulb,.lamp-login .ll-rim{ transition:opacity .7s ease, fill .7s ease, stroke .7s ease; }
.lamp-login .ll-light{ opacity:0; }
.lamp-login .ll-bulb-glow{ opacity:0; }
.lamp-login .ll-bulb{ fill:#1a1a1e; }
.lamp-login .ll-rim{ stroke:#26262b; }
.lamp-login.is-on .ll-light{ opacity:1; animation:ll-flicker .9s ease-out 1, ll-breathe 6s ease-in-out 1s infinite; }
.lamp-login.is-on .ll-bulb-glow{ opacity:.9; }
.lamp-login.is-on .ll-bulb{ fill:#fff2c2; }
.lamp-login.is-on .ll-rim{ stroke:rgba(255,212,90,.55); }
@keyframes ll-flicker{ 0%{opacity:0} 10%{opacity:.85} 18%{opacity:.2} 32%{opacity:1} 44%{opacity:.55} 60%{opacity:1} 100%{opacity:1} }
@keyframes ll-breathe{ 0%,100%{opacity:1} 50%{opacity:.88} }

/* Pull string. Two identical animations alternate so every pull replays without remounting. */
.lamp-login .ll-cord{ cursor:pointer; outline:none; transform-box:fill-box; transform-origin:50% 0; touch-action:manipulation; -webkit-tap-highlight-color:transparent; }
.lamp-login .ll-cord:focus-visible .ll-bead{ stroke:#fff; stroke-width:1.5; }
.lamp-login .ll-cord.swing-a{ animation:ll-swing-a 1.4s ease-out 1; }
.lamp-login .ll-cord.swing-b{ animation:ll-swing-b 1.4s ease-out 1; }
@keyframes ll-swing-a{ 0%{transform:translateY(0)} 12%{transform:translateY(12px)} 30%{transform:rotate(-9deg)} 50%{transform:rotate(6deg)} 70%{transform:rotate(-3deg)} 100%{transform:rotate(0)} }
@keyframes ll-swing-b{ 0%{transform:translateY(0)} 12%{transform:translateY(12px)} 30%{transform:rotate(-9deg)} 50%{transform:rotate(6deg)} 70%{transform:rotate(-3deg)} 100%{transform:rotate(0)} }

/* Card */
.lamp-login .ll-panel{ display:flex; justify-content:center; padding:0; }
.lamp-login .ll-card{
  width:100%; max-width:380px; padding:32px 28px 28px; border-radius:20px;
  background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.09);
  box-shadow:0 24px 60px rgba(0,0,0,.5);
  -webkit-backdrop-filter:blur(10px); backdrop-filter:blur(10px);
  transition:opacity .6s ease, filter .6s ease;
}
.lamp-login.is-off .ll-card{ opacity:.18; filter:blur(6px); pointer-events:none; user-select:none; }
.lamp-login .ll-title{ margin:0; text-align:center; font-size:1.65rem; line-height:1.2; font-weight:700; letter-spacing:-.01em; color:var(--text); }
.lamp-login .ll-subtitle{ margin:6px 0 24px; text-align:center; font-size:.85rem; color:var(--muted); }
.lamp-login .ll-form{ display:flex; flex-direction:column; gap:12px; margin:0; }
.lamp-login .ll-field{ position:relative; display:flex; align-items:center; }
.lamp-login .ll-field > svg{ position:absolute; left:14px; color:var(--muted); pointer-events:none; }
.lamp-login .ll-field input{
  width:100%; height:46px; margin:0; padding:0 44px 0 40px; border-radius:12px;
  border:1px solid rgba(255,255,255,.08); background:rgba(0,0,0,.35);
  color:var(--text); font:inherit; font-size:16px; line-height:normal; box-shadow:none;
  transition:border-color .2s ease, box-shadow .2s ease;
}
.lamp-login .ll-field input::placeholder{ color:#6c6c75; }
.lamp-login .ll-field input:focus{ outline:none; border-color:rgba(255,208,0,.7); box-shadow:0 0 0 3px rgba(255,208,0,.15); }
.lamp-login .ll-field input:-webkit-autofill{ -webkit-text-fill-color:var(--text); box-shadow:0 0 0 100px #14141a inset; }
.lamp-login .ll-eye{
  position:absolute; right:5px; width:36px; height:36px; padding:0; display:grid; place-items:center;
  border:0; border-radius:8px; background:transparent; color:var(--muted); cursor:pointer;
}
.lamp-login .ll-eye:hover{ color:var(--text); border:0; }
.lamp-login .ll-eye:focus-visible{ outline:2px solid var(--gold); outline-offset:1px; }
.lamp-login .ll-error{ margin:0; padding:10px 12px; border-radius:10px; font-size:.85rem; color:#ffb4a8; background:rgba(255,90,70,.12); border:1px solid rgba(255,90,70,.3); }
.lamp-login .ll-submit{
  margin:6px 0 0; width:100%; height:46px; padding:0; display:flex; align-items:center; justify-content:center; gap:8px;
  border:0; border-radius:12px; background:var(--gold); color:#141000;
  font:inherit; font-size:.95rem; font-weight:600; cursor:pointer;
  transition:transform .15s ease, box-shadow .2s ease, opacity .2s ease;
}
.lamp-login .ll-submit:hover:not(:disabled){ border:0; box-shadow:0 6px 24px rgba(255,208,0,.35); transform:translateY(-1px); }
.lamp-login .ll-submit:focus-visible{ outline:2px solid #fff; outline-offset:2px; }
.lamp-login .ll-submit:disabled{ opacity:.7; cursor:progress; }
.lamp-login .ll-spin{ animation:ll-spin .8s linear infinite; }
@keyframes ll-spin{ to{ transform:rotate(360deg) } }
.lamp-login .ll-sr{ position:absolute; width:1px; height:1px; margin:-1px; padding:0; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }

/* Tablet / mobile: lamp on top, card below */
@media (max-width:820px){
  .lamp-login .ll-layout{ grid-template-columns:minmax(0,1fr); gap:4px; }
  .lamp-login .ll-stage{ height:clamp(180px,30vh,280px); }
  .lamp-login .ll-hint{ top:2%; font-size:.78rem; }
  .lamp-login .ll-card{ padding:26px 20px 22px; }
  .lamp-login .ll-subtitle{ margin-bottom:18px; }
}
@media (min-width:821px) and (max-height:640px){ .lamp-login .ll-stage{ height:78vh; min-height:240px; } }

@media (prefers-reduced-motion:reduce){
  .lamp-login *,.lamp-login *::before,.lamp-login *::after{ animation:none !important; transition-duration:.01ms !important; }
  .lamp-login .ll-fireflies span{ opacity:.5; }
}
`;
