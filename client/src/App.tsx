
import React, { useState } from 'react';
import {
  Menu, X, Home, Sparkles, CreditCard,
  Sun, Moon, Smartphone, Monitor,
  ArrowLeft, ArrowUp, ChevronLeft, ChevronRight,
  Zap, Facebook, Instagram, Twitter, Check,
  LayoutDashboard, Image as ImageIcon, History, User, Settings as SettingsIcon,
  Bell, Loader2, Palette as PaletteIcon, Hash, Quote, Download,
  Plus, Minus, Shuffle, BookOpen, Box, Columns
} from 'lucide-react';

// Typy pro data
interface GeneratedEntry {
  id: number;
  url: string;
  prompt: string;
  style: string;
  ratio: string;
}

interface AiOutput {
  story: string | null;
  artTitle: string | null;
  palette: string[] | null;
  socialData: string | null;
}

interface UserProfile {
  name: string;
  role: string;
  plan: string;
  bio: string;
  avatar: string | null;
}

// --- DATA: STYLY PRO GENERÁTOR ---
const STYLES = [
  { id: 'none', label: 'Bez stylu', prompt: '' },
  { id: 'photorealistic', label: 'Fotorealismus', prompt: 'photorealistic, 8k, highly detailed, cinematic lighting' },
  { id: 'minimalist', label: 'Minimalismus', prompt: 'minimalist, clean lines, simple, elegant' },
  { id: 'cyberpunk', label: 'Cyberpunk', prompt: 'cyberpunk aesthetic, neon lights, futuristic, high-tech' },
  { id: 'abstract', label: 'Abstraktní', prompt: 'abstract, fluid shapes, artistic, creative' },
  { id: 'sketch', label: 'Skica', prompt: 'hand drawn sketch, pencil, artistic lines' },
  { id: '3d-render', label: '3D Render', prompt: '3d render, octane render, unreal engine 5 style' },
];

const PaginationDots: React.FC<{ count: number; current: number; onClick: (i: number) => void }> = ({ count, current, onClick }) => (
  <div className="flex justify-center gap-2 mt-6">
    {Array.from({ length: count }).map((_, i) => (
      <button
        key={i}
        onClick={() => onClick(i)}
        className={`w-2 h-2 rounded-full transition-all duration-300 ${
          current === i
            ? 'bg-cyan-400 w-6 shadow-[0_0_8px_rgba(34,211,238,0.8)]'
            : 'bg-white/20 hover:bg-white/40'
        }`}
      />
    ))}
  </div>
);

const PricingCard: React.FC<{
  title: string;
  price: string;
  description: string;
  features: string[];
  gradient?: string;
  isPremium?: boolean;
  textColor: string;
  secondaryTextColor: string;
  brandGradient: string;
  theme: 'light' | 'dark';
}> = ({ title, price, description, features, gradient, isPremium, textColor, secondaryTextColor, brandGradient, theme }) => (
  <div
    className={`relative rounded-3xl overflow-hidden flex flex-col transition-all duration-500 hover:shadow-2xl ${
      isPremium ? 'scale-100 lg:scale-[1.08] z-10 shadow-xl' : 'scale-100 z-0'
    }`}
    style={{
      background: theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.6)',
      border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.1)'}`,
      backdropFilter: 'blur(20px)'
    }}
  >
    <div
      className="p-8 text-center"
      style={{ background: gradient || (theme === 'dark' ? 'rgba(15, 23, 42, 0.5)' : 'rgba(241, 245, 249, 0.8)') }}
    >
      <h6 className="uppercase tracking-widest text-xs font-bold mb-2" style={{ color: '#d0adf1' }}>{title}</h6>
      <p className={`${textColor} text-5xl font-black mb-2 tracking-tighter`}>
        {price}
        <sub className="text-sm font-normal align-bottom ml-1 opacity-50">/mo</sub>
      </p>
      <hr className={`${theme === 'dark' ? 'border-white/5' : 'border-slate-200'} my-4`} />
      <p className="text-[10px] uppercase tracking-widest text-cyan-500 font-black">{description}</p>
    </div>
    <div className="p-8 flex-grow">
      <ul className="space-y-4">
        {features.map((f, i) => (
          <li key={i} className={`flex items-center gap-3 ${secondaryTextColor} text-sm font-medium`}>
            <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0"><Check size={12} /></div> <span className="text-left">{f}</span>
          </li>
        ))}
      </ul>
    </div>
    <div className="p-8 pt-0">
      <button
        className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
          isPremium ? 'text-white shadow-lg' : `border border-white/10 ${textColor} hover:bg-black/5`
        }`}
        style={isPremium ? { background: brandGradient } : {}}
      >
        Vybrat
      </button>
    </div>
  </div>
);

const WorkspaceStat: React.FC<{ label: string; value: string; icon: React.ElementType; cardBg: string; textColor: string }> = ({ label, value, icon: Icon, cardBg, textColor }) => (
  <div className={`${cardBg} border border-white/10 p-6 rounded-[24px] flex items-start justify-between shadow-sm`}>
    <div className="text-left">
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</p>
      <h3 className={`text-2xl font-bold ${textColor}`}>{value}</h3>
    </div>
    <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"><Icon size={20} /></div>
  </div>
);
const App: React.FC = () => {
  // --- KONFIGURACE API ---
  const GEMINI_MODEL = 'gemini-2.5-flash-preview-09-2025';
  const [apiKey, setApiKey] = useState<string>(localStorage.getItem('gemini_api_key') ?? '');

  // --- GLOBÁLNÍ STAVY STRÁNEK ---
  const [currentPage, setCurrentPage] = useState<'home' | 'imaginator' | 'pricing'>('home');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // --- STAV WORKSPACE ---
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'dashboard' | 'generator' | 'gallery' | 'profile' | 'settings'>('generator');
  const [history, setHistory] = useState<GeneratedEntry[]>([]);
  const [user] = useState<UserProfile>({
    name: 'David Kozák',
    role: 'Creative Director',
    plan: 'PRO PLAN',
    bio: 'Digitální umělec a nadšenec do AI technologií.',
    avatar: null
  });

  // --- STAV GENERÁTORU ---
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('none');
  const [aspectRatio, setAspectRatio] = useState<'portrait' | 'landscape' | 'square'>('landscape');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<GeneratedEntry | null>(null);
  const [imgLoading, setImgLoading] = useState(false);
  const [aiOutput, setAiOutput] = useState<AiOutput>({ story: null, artTitle: null, palette: null, socialData: null });
  const [isThinking, setIsThinking] = useState(false);

  // --- CONTENT HERO SEKCE ---
  const [heroData] = useState({
    title: 'Imaginator Studio',
    subtitle: 'Vize se stává realitou skrze AI',
    description: 'Vstupte do světa, kde hranice mezi fantazií a digitálním uměním mizí. STAX a F-Studio spojují síly, aby vám přinesli nejvýkonnější kreativní nástroje současnosti.',
    videoUrl: 'SEM VLOZIT CESTU K VIDEU',
    logoUrl: 'https://stax.organicthemes.com/wp-content/uploads/2021/11/stax-logo-white.png',
    overlayColor: '#0f172a',
    overlayOpacity: 0.65,
  });

  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [openFaqIds, setOpenFaqIds] = useState<number[]>([]);
  const [imgError, setImgError] = useState(false);

  const slides = [
    { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop', title: 'Imaginator Branding', category: 'Design' },
    { url: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1000&auto=format&fit=crop', title: 'F-Studio Identity', category: 'Branding' },
    { url: 'https://images.unsplash.com/photo-1551288049-bbbda546697c?q=80&w=1000&auto=format&fit=crop', title: 'Glassmorphism UI', category: 'UI/UX' }
  ];

  const testimonials = [
    { 
      id: 1, 
      name: 'Lynn Sheldon', 
      role: 'Creative Director', 
      quote: 'Máte ty nejvýkonnější a nejkrásnější nástroje, jaké jsem kdy v AI prostoru viděla. Práce v Ateliéru je čirá radost.',
      image: 'https://stax.organicthemes.com/wp-content/uploads/2021/12/portrait-lady-cutout-01-887x1024.png'
    },
    { 
      id: 2, 
      name: 'Jakub Svoboda', 
      role: 'Freelance Artist', 
      quote: 'Rychlost, s jakou mohu materializovat své myšlenky, úplně změnila můj workflow. Imaginator je pro mě nepostradatelný nástroj.',
      image: 'https://stax.organicthemes.com/wp-content/uploads/2021/12/portrait-lady-cutout-01-887x1024.png'
    },
    { 
      id: 3, 
      name: 'Alena Vránová', 
      role: 'Marketing Lead', 
      quote: 'Funkce Lore a generování sloganů nám ušetřily hodiny copywritingu. Vizuály jsou na světové úrovni.',
      image: 'https://stax.organicthemes.com/wp-content/uploads/2021/12/portrait-lady-cutout-01-887x1024.png'
    }
  ];

  const faqData = [
    { id: 1, q: 'Jak funguje AI generování?', a: 'Využíváme pokročilé modely Pollinations a Gemini pro analýzu a tvorbu obsahu v reálném čase přímo ve vašem prohlížeči.' },
    { id: 2, q: 'Potřebuji vlastní API klíč?', a: 'V demo verzi nikoliv, ale pro plný výkon funkcí Lore (Příběhy) a AI analýzu doporučujeme vložit vlastní Gemini klíč v nastavení.' },
    { id: 3, q: 'Jaké formáty jsou podporovány?', a: 'Můžete generovat čtvercové (1:1), portrétní (9:16) i širokoúhlé (16:9) formáty v rozlišení optimalizovaném pro digitální média.' },
    { id: 4, q: 'Je moje galerie soukromá?', a: 'Ano, vaše vygenerované artefakty se ukládají lokálně v mezipaměti prohlížeče a v rámci vašeho profilu v této relaci.' }
  ];

  // --- DESIGN TOKENY ---
  const brandGradient = 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 33%, #14b8a6 66%, #10b981 100%)';
  const imaginatorBgDark = 'radial-gradient(circle at top left, #082f49, #0f172a, #020617)';
  const imaginatorBgLight = 'linear-gradient(135deg, #f0fdfa 0%, #ffffff 100%)';
  const footerGradient = 'linear-gradient(90deg, #0ea5e9 0%, #06b6d4 33%, #14b8a6 66%, #10b981 100%)';
  const tokyoSunsetGradient = 'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)';
  
  const currentBg = theme === 'dark' ? imaginatorBgDark : imaginatorBgLight;
  const textColor = theme === 'dark' ? 'text-white' : 'text-[#0f172a]';
  const secondaryTextColor = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';
  const cardBg = theme === 'dark' ? 'bg-white/5' : 'bg-white/80';
  const iconGlow = theme === 'dark' ? '0 0 50px rgba(14, 165, 233, 0.6)' : '0 0 50px rgba(16, 185, 129, 0.4)';
  // --- API LOGIKA ---
  const callGeminiText = async (promptText: string, systemInstruction: string) => {
    if (!apiKey) return null;
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
            systemInstruction: { parts: [{ text: systemInstruction }] },
          })
        }
      );
      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text as string | undefined;
      return text ?? null;
    } catch (error) {
      return null;
    }
  };

  const handleGenerate = () => {
    if (!prompt) return;
    setIsGenerating(true);
    setImgLoading(true);
    setGeneratedImage(null);
    setAiOutput({ story: null, artTitle: null, palette: null, socialData: null });

    const seed = Math.floor(Math.random() * 1_000_000);
    const styleText = selectedStyle !== 'none' ? STYLES.find((s) => s.id === selectedStyle)?.prompt ?? '' : '';
    const ratioParams = aspectRatio === 'portrait'
      ? 'width=768&height=1344'
      : aspectRatio === 'landscape'
        ? 'width=1280&height=720'
        : 'width=1024&height=1024';

    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(`${prompt}, ${styleText}`)}?${ratioParams}&seed=${seed}&nologo=true`;

    const newEntry: GeneratedEntry = { id: Date.now(), url, prompt, style: selectedStyle, ratio: aspectRatio };
    setGeneratedImage(newEntry);
    setHistory((prev) => [newEntry, ...prev]);
    setIsGenerating(false);
  };

  const handleAiLore = async (type: 'story' | 'name' | 'palette' | 'social' | 'enhance' | 'remix') => {
    if (!prompt) return;
    if ((type !== 'enhance' && type !== 'remix') && !apiKey) {
      alert('Zadejte API klíč v nastavení!');
      return;
    }
    setIsThinking(true);
    let system = '';
    switch (type) {
      case 'story':
        system = 'Napiš ultra-krátký magický příběh (max 2 věty) v češtině k tomuto obrazu.';
        break;
      case 'name':
        system = 'Vymysli unikátní umělecký název (max 3 slova) v češtině.';
        break;
      case 'palette':
        system = 'Vrať 5 hex kódů barev oddělených čárkou, které se hodí k tomuto obrazu.';
        break;
      case 'social':
        system = 'Napiš popisek na Instagram v češtině včetně 5 hashtagů.';
        break;
      case 'enhance':
        system = 'Jsi prompt engineer. Vylepši tento prompt pro generátor obrázků do angličtiny. Odpověz POUZE vylepšeným textem.';
        break;
      case 'remix':
        system = 'Vytvoř kreativní variaci tohoto promptu v angličtině. Odpověz POUZE textem.';
        break;
    }

    const res = await callGeminiText(prompt, system);
    if (!res) {
      setIsThinking(false);
      return;
    }

    if (type === 'enhance' || type === 'remix') {
      setPrompt(res);
    } else if (type === 'palette') {
      const matches = res.match(/#[0-9A-Fa-f]{6}/g) ?? null;
      setAiOutput((p) => ({ ...p, palette: matches }));
    } else if (type === 'story') {
      setAiOutput((p) => ({ ...p, story: res }));
    } else if (type === 'name') {
      setAiOutput((p) => ({ ...p, artTitle: res.replace(/"/g, '') }));
    } else if (type === 'social') {
      setAiOutput((p) => ({ ...p, socialData: res }));
    }
    setIsThinking(false);
  };

  const toggleFaq = (id: number) => {
    setOpenFaqIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const nextSlide = () => {
    setImgError(false);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };
  const prevSlide = () => {
    setImgError(false);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };
  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };
  return (
    <div className={`min-h-screen transition-all duration-700 ${deviceMode === 'mobile' ? 'flex items-center justify-center bg-[#020617] p-4 lg:p-10' : ''}`}>
      {/* SVG NEON GRADIENT */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop stopColor="#0ea5e9" offset="0%" />
            <stop stopColor="#06b6d4" offset="33%" />
            <stop stopColor="#14b8a6" offset="66%" />
            <stop stopColor="#10b981" offset="100%" />
          </linearGradient>
        </defs>
      </svg>

      {/* FRAME ZAŘÍZENÍ */}
      <div className={`relative transition-all duration-700 shadow-2xl overflow-hidden ${deviceMode === 'mobile' ? 'w-[375px] h-[812px] rounded-[48px] border-[12px] border-slate-900 bg-black' : 'w-full h-full min-h-screen'}`}>
        <div className="h-full overflow-y-auto custom-scroll relative flex flex-col" style={{ background: currentBg }}>
          {/* NAV TRIGGER */}
          <button onClick={() => setIsMenuOpen(true)} className="fixed top-6 right-6 z-[100] p-3 rounded-2xl shadow-2xl border border-white/20" style={{ background: brandGradient }}>
            <Menu className="w-6 h-6 text-white" />
          </button>

          {/* SIDEBAR MENU */}
          <div className={`fixed inset-0 z-[150] transition-opacity duration-500 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsMenuOpen(false)}></div>
            <div className={`absolute top-0 right-0 h-full w-full max-w-[320px] ${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-white'} border-l border-white/10 flex flex-col ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-500`}>
              <div className="p-8 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl brand-gradient flex items-center justify-center font-black text-white shadow-lg">F</div>
                   <span className={`font-black ${textColor} uppercase text-lg tracking-tighter`}>Imaginator</span>
                </div>
                <X className="w-6 h-6 cursor-pointer text-slate-400 hover:text-white" onClick={() => setIsMenuOpen(false)} />
              </div>
              <nav className="flex-1 p-8 space-y-2">
                {[
                  { label: 'Domů', icon: Home, id: 'home' },
                  { label: 'F-IMAGINATOR', icon: Sparkles, id: 'imaginator', pro: true },
                  { label: 'Předplatné', icon: CreditCard, id: 'pricing' }
                ].map((item) => (
                  <button key={item.id} onClick={() => { setCurrentPage(item.id as 'home' | 'imaginator' | 'pricing'); setIsMenuOpen(false); }} className={`flex items-center gap-4 w-full p-4 rounded-2xl transition-all ${currentPage === item.id ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-lg' : `${secondaryTextColor} hover:text-cyan-500 hover:bg-black/5`}`}>
                    <item.icon size={20} className={item.pro ? 'text-emerald-400' : ''} />
                    <span className="font-bold text-sm uppercase">{item.label}</span>
                  </button>
                ))}
                <hr className="my-6 border-white/5" />
                <div className={`p-4 rounded-3xl border ${theme === 'dark' ? 'border-white/5 bg-white/5' : 'border-slate-200 bg-slate-50'} space-y-6`}>
                  <div className="flex flex-col gap-2">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest text-center">Téma & Zařízení</p>
                    <div className="flex gap-2">
                      <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="flex-1 p-2 rounded-xl bg-black/10 flex justify-center text-cyan-400">{theme === 'dark' ? <Sun size={16}/> : <Moon size={16}/>}</button>
                      <button onClick={() => setDeviceMode(deviceMode === 'desktop' ? 'mobile' : 'desktop')} className="flex-1 p-2 rounded-xl bg-black/10 flex justify-center text-cyan-400">{deviceMode === 'desktop' ? <Smartphone size={16}/> : <Monitor size={16}/>}</button>
                    </div>
                  </div>
                </div>
              </nav>
            </div>
          </div>

          {/* HLAVNÍ CONTENT */}
          <div className="flex-1">
            {currentPage === 'home' && (
              <div className="animate-fade-in flex flex-col">
                {/* HERO MARKETING */}
                <section className="relative overflow-hidden w-full flex items-center justify-center text-white min-h-screen" style={{ background: imaginatorBgDark, clipPath: 'polygon(0% 0%, 100% 0%, 100% 92%, 50% 100%, 0% 92%)' }}>
                  <div className="absolute inset-0 z-0 opacity-30">
                    <video autoPlay muted loop playsInline className="w-full h-full object-cover">
                      <source src={heroData.videoUrl} type="video/mp4" />
                    </video>
                  </div>
                  <div className="absolute inset-0 z-10 transition-all duration-1000" style={{ backgroundColor: theme === 'dark' ? heroData.overlayColor : '#ffffff', opacity: theme === 'dark' ? heroData.overlayOpacity : 0.8 }}></div>
                  <div className="relative z-20 w-full max-w-[1100px] px-6 py-20 flex flex-col items-center text-center">
                    <div className="p-1 rounded-[28px] bg-gradient-to-tr from-cyan-400 to-emerald-500 mb-10 animate-pulse shadow-2xl" style={{ boxShadow: iconGlow }}>
                      <div className={`${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-white'} w-20 h-20 rounded-[26px] flex items-center justify-center`}>
                        <div className={`${theme === 'dark' ? 'text-white' : 'text-cyan-600'} font-black text-5xl`}>F</div>
                      </div>
                    </div>
                    <h1 className={`${textColor} text-5xl md:text-9xl font-black mb-6 tracking-tighter text-balance uppercase leading-[0.85]`}>{heroData.title}</h1>
                    <h2 className="text-xl md:text-3xl font-bold mb-10 text-cyan-500 tracking-[0.3em] uppercase">{heroData.subtitle}</h2>
                    <p className={`max-w-3xl text-lg md:text-xl ${secondaryTextColor} leading-relaxed mb-12 font-medium opacity-80`}>{heroData.description}</p>
                    <div className="flex flex-col sm:flex-row gap-6 mb-20">
                      <button onClick={() => setCurrentPage('imaginator')} className="px-14 py-6 rounded-[24px] text-white font-black text-sm tracking-widest shadow-2xl hover:scale-105 transition-all uppercase border border-white/20" style={{ background: brandGradient }}>Spustit Workspace</button>
                      <button onClick={() => setCurrentPage('pricing')} className={`px-14 py-6 rounded-[24px] ${textColor} font-black text-sm tracking-widest border border-current opacity-40 hover:opacity-100 transition-all uppercase backdrop-blur-md`}>Zobrazit tarify</button>
                    </div>
                  </div>
                </section>

                {/* FEATURE CARDS */}
                <section className="relative z-30 -mt-28 max-w-[1300px] mx-auto px-6 mb-40">
                  <div className={`grid gap-8 ${deviceMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
                    {['Ateliér', 'Archiv', 'Analýza'].map((title, idx) => (
                      <div key={idx} className={`${cardBg} backdrop-blur-2xl border border-white/10 rounded-[40px] p-10 flex flex-col items-center text-center transition-all hover:-translate-y-6 hover:border-emerald-500/50 hover:shadow-[0_20px_80px_rgba(16,185,129,0.2)] group cursor-pointer shadow-lg`} onClick={()=>setCurrentPage('imaginator')}>
                        <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 transition-transform shadow-inner"><Zap className="w-8 h-8 text-emerald-400" fill="currentColor" /></div>
                        <h3 className={`text-3xl font-black mb-4 uppercase tracking-tighter ${textColor}`}>{title}</h3>
                        <p className={`${secondaryTextColor} text-base leading-relaxed opacity-70`}>Profesionální nástroje pro vaši vizi s využitím AI technologií.</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* SLIDESHOW WITH DOTS */}
                <section className={`w-full py-40 ${theme === 'dark' ? 'bg-[#020617]' : 'bg-slate-50'} border-y border-white/5 relative`}>
                   <div className="max-w-[1300px] mx-auto px-6 flex flex-col lg:flex-row items-center gap-24 text-left">
                      <div className="w-full lg:w-1/2 relative">
                        <div className="relative h-[500px] md:h-[650px] rounded-[50px] overflow-hidden border border-white/10 bg-black shadow-2xl">
                          <img key={slides[currentSlide].url} src={slides[currentSlide].url} className="w-full h-full object-cover opacity-60 animate-fade-in" alt="Slide" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent"></div>
                          <div className="absolute bottom-16 left-16 right-16">
                              <span className="text-[10px] font-black bg-cyan-500 text-white px-4 py-1.5 rounded-full uppercase tracking-widest mb-6 inline-block shadow-lg">{slides[currentSlide].category}</span>
                              <h4 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white leading-none">{slides[currentSlide].title}</h4>
                          </div>
                          <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-8">
                              <button onClick={prevSlide} className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all backdrop-blur-md text-white"><ChevronLeft/></button>
                              <button onClick={nextSlide} className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all backdrop-blur-md text-white"><ChevronRight/></button>
                          </div>
                        </div>
                        <PaginationDots count={slides.length} current={currentSlide} onClick={setCurrentSlide} />
                      </div>
                      <div className="w-full lg:w-1/2 space-y-10">
                         <h6 className="text-emerald-500 font-black uppercase tracking-[0.4em] text-sm">Portfolio <strong>Kvality</strong></h6>
                         <h2 className={`text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] ${textColor}`}>Budoucnost <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400">Designu.</span></h2>
                         <p className={`text-xl ${secondaryTextColor} leading-relaxed font-medium opacity-80`}>Naše platforma propojuje lidskou kreativitu s neomezeným výpočetním výkonem umělé inteligence.</p>
                         <button onClick={() => setCurrentPage('imaginator')} className="px-12 py-6 rounded-[24px] font-black text-xs uppercase tracking-widest border border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 transition-all shadow-emerald-500/5 shadow-2xl">Vstoupit do Ateliéru</button>
                      </div>
                   </div>
                </section>

                {/* FAQ SECTION */}
                <section
                  className="py-40 relative overflow-hidden transition-all duration-700"
                  style={{
                    backgroundImage: theme === 'dark'
                      ? `linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.85)), url('https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?q=80&w=2560&auto=format&fit=crop')`
                      : `linear-gradient(rgba(255, 255, 255, 0.96), rgba(255, 255, 255, 0.96)), url('https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?q=80&w=2560&auto=format&fit=crop')`,
                    backgroundSize: 'cover', backgroundPosition: 'center'
                  }}
                >
                  <div className="absolute inset-0 opacity-20" style={{ background: theme === 'dark' ? brandGradient : 'transparent' }}></div>
                  <div className="max-w-[1200px] mx-auto px-6 relative z-10">
                      <div className="text-center mb-16">
                        <h2 className={`text-4xl md:text-6xl font-black uppercase tracking-tighter ${textColor}`}>Časté dotazy</h2>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start text-left">
                        {faqData.map((item) => (
                          <div key={item.id} className={`${theme === 'dark' ? 'bg-[#0f172a]/80 border-white/10' : 'bg-white border-slate-200'} backdrop-blur-xl rounded-[32px] shadow-xl overflow-hidden border`}>
                            <div
                                onClick={() => toggleFaq(item.id)}
                                className="p-8 flex items-center justify-between cursor-pointer transition-all hover:brightness-110"
                                style={{ background: brandGradient }}
                            >
                                <p className="text-lg font-black uppercase tracking-tight text-white drop-shadow-md">{item.q}</p>
                                <div className="p-2 bg-white/20 rounded-xl border border-white/20 shadow-lg">
                                  {openFaqIds.includes(item.id) ? (
                                      <Minus stroke="white" size={20} />
                                  ) : (
                                      <Plus stroke="white" size={20} />
                                  )}
                                </div>
                            </div>
                            {openFaqIds.includes(item.id) && (
                                <div className={`p-8 border-t ${theme === 'dark' ? 'border-white/5 text-slate-300' : 'border-slate-100 text-slate-700'} text-base leading-relaxed animate-fade-in font-medium text-left`}>
                                  {item.a}
                                </div>
                            )}
                          </div>
                        ))}
                      </div>
                  </div>
                </section>

                {/* REFERENCE SECTION WITH SLIDESHOW CONTROLS & DOTS */}
                <section className={`py-40 ${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-white'} border-t border-white/5 relative`}>
                  <div className="max-w-[1300px] mx-auto px-6 relative">
                    <div className="flex flex-col lg:flex-row items-center gap-24 text-left">
                      <div className="w-full lg:w-[40%] flex justify-center relative">
                          <div className="absolute inset-0 bg-cyan-500/20 blur-[100px] rounded-full opacity-40 animate-pulse"></div>
                          <img
                            key={testimonials[currentTestimonial].image}
                            src={testimonials[currentTestimonial].image}
                            alt="Portrait"
                            className="relative z-10 w-full max-w-[450px] h-auto object-contain drop-shadow-2xl animate-fade-in"
                          />
                      </div>

                      <div className="flex-1 text-left space-y-10 relative">
                          <h2 className={`text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none ${textColor}`}>
                            Miluji <em className="italic text-slate-500 font-serif font-light tracking-normal uppercase">systém</em> <br/>
                            <strong className="brand-text uppercase">IMAGINATOR</strong>
                          </h2>

                          <blockquote className="space-y-6 relative">
                            <Quote className="absolute -top-8 -left-8 w-12 h-12 text-cyan-500 opacity-20" />
                            <p className={`text-2xl md:text-3xl ${secondaryTextColor} italic font-light leading-relaxed opacity-90 transition-all duration-500`}>
                              "{testimonials[currentTestimonial].quote}"
                            </p>
                            <div className="animate-fade-in">
                              <cite className="block text-cyan-500 font-black uppercase tracking-[0.2em] text-sm not-italic">
                                — {testimonials[currentTestimonial].name}
                              </cite>
                              <span className={`block text-xs uppercase font-bold tracking-widest mt-1 opacity-50 ${textColor}`}>
                                {testimonials[currentTestimonial].role}
                              </span>
                            </div>
                          </blockquote>

                          <div className="flex gap-4">
                            <button onClick={prevTestimonial} className={`p-4 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100'}`}>
                              <ChevronLeft size={24} />
                            </button>
                            <button onClick={nextTestimonial} className={`p-4 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100'}`}>
                              <ChevronRight size={24} />
                            </button>
                          </div>
                      </div>
                    </div>
                    <PaginationDots count={testimonials.length} current={currentTestimonial} onClick={setCurrentTestimonial} />
                  </div>
                </section>
              </div>
            )}
            {currentPage === 'pricing' && (
              <div className="animate-fade-in py-40 px-6 min-h-screen relative overflow-hidden" style={{ background: currentBg }}>
                <div className="max-w-[1300px] mx-auto relative z-10 text-center">
                  <button onClick={() => setCurrentPage('home')} className={`mb-16 flex items-center gap-3 ${secondaryTextColor} hover:text-cyan-500 font-black transition-colors uppercase text-xs tracking-widest group`}><ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform"/> Zpět domů</button>
                  <div className="text-center mb-24">
                    <h2 className={`${textColor} text-5xl md:text-9xl font-black uppercase tracking-tighter mb-8 leading-[0.85]`}>Cena za <span className="brand-text uppercase">Úspěch.</span></h2>
                    <p className={`${secondaryTextColor} max-w-2xl mx-auto text-xl font-medium opacity-80`}>Flexibilní předplatné pro jednotlivce i globální studia.</p>
                  </div>
                  <div className={`grid gap-8 items-center ${deviceMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
                    <PricingCard title="Základ" price="$9" description="Pro začínající tvůrce" features={["100 AI Generací", "Osobní Galerie", "Standard podpora"]} textColor={textColor} secondaryTextColor={secondaryTextColor} brandGradient={brandGradient} theme={theme} />
                    <PricingCard title="Standard" price="$12" description="Pro freelancery" features={["500 AI Generací", "Editace předloh", "Analýza stylu"]} textColor={textColor} secondaryTextColor={secondaryTextColor} brandGradient={brandGradient} theme={theme} />
                    <PricingCard title="Premium" price="$15" description="Nejoblíbenější PRO" isPremium gradient={tokyoSunsetGradient} features={["Neomezené texty", "1000 Obrázků", "Gemini Pro", "24/7 VIP Support"]} textColor={textColor} secondaryTextColor={secondaryTextColor} brandGradient={brandGradient} theme={theme} />
                    <PricingCard title="Deluxe" price="$22" description="Pro herní studia" features={["Vše bez limitů", "Vlastní AI modely", "Týmový prostor"]} textColor={textColor} secondaryTextColor={secondaryTextColor} brandGradient={brandGradient} theme={theme} />
                  </div>
                </div>
              </div>
            )}

            {currentPage === 'imaginator' && (
              /* --- WORKSPACE --- */
              <div className="animate-fade-in flex flex-col lg:flex-row h-screen overflow-hidden bg-[#020617] relative">
                <aside className={`${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-white'} border-r ${theme === 'dark' ? 'border-white/5' : 'border-slate-200'} transition-all duration-500 flex flex-col p-5 z-20 ${isSidebarCollapsed ? 'w-24' : 'w-80'}`}>
                  <div className={`flex items-center gap-4 mb-14 mt-4 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                    <div className="w-12 h-12 rounded-2xl brand-gradient flex items-center justify-center font-black text-white shrink-0 shadow-lg">F</div>
                    {!isSidebarCollapsed && <div className="flex flex-col text-left"><span className={`font-black ${textColor} text-xl tracking-tighter leading-none uppercase`}>Imaginator</span><span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mt-1">Workspace v8.0</span></div>}
                    <button onClick={() => setIsSidebarCollapsed(v => !v)} className={`ml-auto p-2 rounded-xl border ${theme === 'dark' ? 'border-white/10 bg-white/5 text-white' : 'border-slate-200 bg-slate-50 text-slate-700'} hover:opacity-80 transition-all`}>
                      {isSidebarCollapsed ? <ChevronRight size={16}/> : <ChevronLeft size={16}/>}
                    </button>
                  </div>
                  <nav className="flex-1 space-y-3">
                    {[
                      { id: 'dashboard', label: 'Nástěnka', icon: LayoutDashboard },
                      { id: 'generator', label: 'AI Ateliér', icon: ImageIcon },
                      { id: 'gallery', label: 'Archiv', icon: History },
                      { id: 'profile', label: 'Můj Profil', icon: User },
                      { id: 'settings', label: 'Nastavení', icon: SettingsIcon }
                    ].map(tab => {
                      const TabIcon = tab.icon;
                      return (<button key={tab.id} onClick={() => setActiveWorkspaceTab(tab.id as typeof activeWorkspaceTab)} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${activeWorkspaceTab === tab.id ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-lg' : `${secondaryTextColor} hover:text-cyan-500 hover:bg-black/5`}`}><TabIcon size={20} className="shrink-0" />{!isSidebarCollapsed && <span className="font-black text-sm uppercase tracking-tight">{tab.label}</span>}</button>);
                    })}
                  </nav>
                </aside>

                <div className="flex-1 flex flex-col overflow-hidden relative" style={{ background: currentBg }}>
                  <header className={`h-24 border-b ${theme === 'dark' ? 'border-white/5' : 'border-slate-200'} flex items-center justify-between px-10 backdrop-blur-2xl relative z-10 shrink-0`}>
                     <h2 className={`text-2xl font-black uppercase tracking-tighter ${textColor}`}>{activeWorkspaceTab}</h2>
                     <div className="flex items-center gap-6"><div className="hidden md:flex items-center gap-3 px-6 py-3 bg-white/5 rounded-2xl border border-white/10 shadow-inner"><Zap size={16} className="text-emerald-400" fill="currentColor" /><span className={`text-xs font-black tracking-widest uppercase ${textColor}`}>2,480 TOKENS</span></div><Bell className={`${secondaryTextColor} hover:text-cyan-500 cursor-pointer`}/></div>
                  </header>

                  <div className="flex-1 overflow-y-auto custom-scroll p-6 md:p-10 relative z-10">
                    {activeWorkspaceTab === 'dashboard' && (
                      <div className="max-w-6xl mx-auto space-y-10 animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          <WorkspaceStat label="Vygenerováno" value={`${history.length + 156}`} icon={ImageIcon} cardBg={cardBg} textColor={textColor} />
                          <WorkspaceStat label="Doba práce" value="42h" icon={History} cardBg={cardBg} textColor={textColor} />
                          <WorkspaceStat label="Stav systému" value="OPTIMAL" icon={Sparkles} cardBg={cardBg} textColor={textColor} />
                        </div>
                        <div className={`${cardBg} border border-white/10 rounded-[40px] p-8 backdrop-blur-xl text-left`}>
                          <h3 className={`text-xl font-black uppercase mb-6 ${textColor}`}>Poslední aktivita</h3>
                          <div className="space-y-4">
                            {['Cyberpunk City', 'Abstract Flow', 'Logo Concept'].map((item, i) => (
                              <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all cursor-pointer">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-xl brand-gradient flex items-center justify-center"><ImageIcon size={18}/></div>
                                  <span className={`font-bold text-sm ${textColor}`}>{item}</span>
                                </div>
                                <span className="text-[10px] font-bold opacity-40 uppercase">Před 2 hod</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeWorkspaceTab === 'generator' && (
                      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 h-full animate-fade-in text-left">
                        <div className={`w-full lg:w-[450px] space-y-6 shrink-0`}>
                           <div className={`${cardBg} border border-white/10 rounded-[40px] p-8 space-y-6 shadow-2xl relative overflow-hidden backdrop-blur-xl`}>
                              <div className="absolute top-0 left-0 w-1 h-full brand-gradient opacity-50"></div>
                              <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em]">Vize & Prompt</label>
                                <div className="flex gap-2">
                                  <button onClick={()=>handleAiLore('remix')} className="p-2 bg-white/5 hover:bg-cyan-500/20 text-cyan-400 rounded-lg transition-all" title="Remix"><Shuffle size={14}/></button>
                                  <button onClick={()=>handleAiLore('enhance')} className="p-2 bg-white/5 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-all" title="Vylepšit"><Sparkles size={14}/></button>
                                </div>
                              </div>
                              <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className={`w-full h-32 bg-black/20 border border-white/10 rounded-[20px] p-4 text-sm focus:border-cyan-500/50 outline-none resize-none transition-all ${textColor} placeholder:text-slate-500`} placeholder="Popište svou vizi..." />
                              <div className="grid grid-cols-2 gap-4">
                                <select value={selectedStyle} onChange={e=>setSelectedStyle(e.target.value)} className="bg-black/40 text-xs p-3 rounded-xl border border-white/10 outline-none text-white">
                                  {STYLES.map(s => <option key={s.id} value={s.id} className="bg-[#0f172a]">{s.label}</option>)}
                                </select>
                                <div className="flex gap-1 p-1 bg-black/40 rounded-xl border border-white/10">
                                  {['1:1','16:9','9:16'].map(r => {
                                    const selected = (r==='1:1' && aspectRatio==='square') || (r==='16:9' && aspectRatio==='landscape') || (r==='9:16' && aspectRatio==='portrait');
                                    return (
                                      <button key={r} onClick={()=>setAspectRatio(r==='1:1'?'square':r==='16:9'?'landscape':'portrait')} className={`flex-1 text-[9px] font-bold rounded-lg transition-all ${selected?'bg-white/10 text-white':'text-slate-500'}`}>{r}</button>
                                    );
                                  })}
                                </div>
                              </div>
                              <button onClick={handleGenerate} disabled={isGenerating} className="w-full py-5 brand-gradient text-white rounded-[24px] font-black text-sm tracking-[0.2em] shadow-lg active:scale-95 transition-all uppercase">{isGenerating ? <Loader2 className="animate-spin mx-auto" size={20}/> : 'Materializovat'}</button>
                           </div>
                        </div>
                        <div className={`flex-1 bg-black/20 border-2 ${theme === 'dark' ? 'border-white/5' : 'border-slate-300'} border-dashed rounded-[50px] flex flex-col items-center justify-center p-8 min-h-[500px] relative`}>
                           {imgLoading ? <Loader2 className="text-cyan-500 animate-spin" size={64}/> : generatedImage ? (
                             <div className="w-full h-full flex flex-col items-center gap-8">
                                <img src={generatedImage.url} className="max-w-full max-h-[550px] rounded-[30px] shadow-2xl animate-fade-in" onLoad={()=>setImgLoading(false)} onError={()=>setImgError(true)} alt="Preview"/>
                                <div className="flex gap-4 p-3 bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
                                  <button onClick={()=>handleAiLore('story')} className="p-3 bg-white/5 hover:bg-emerald-500/20 text-emerald-400 rounded-2xl transition-all" title="Příběh"><BookOpen size={20}/></button>
                                  <button onClick={()=>handleAiLore('name')} className="p-3 bg-white/5 hover:bg-cyan-500/20 text-cyan-400 rounded-2xl transition-all" title="Název"><Quote size={20}/></button>
                                  <button onClick={()=>handleAiLore('palette')} className="p-3 bg-white/5 hover:bg-purple-500/20 text-purple-400 rounded-2xl transition-all" title="Paleta"><PaletteIcon size={20}/></button>
                                  <button onClick={()=>handleAiLore('social')} className="p-3 bg-white/5 hover:bg-pink-500/20 text-pink-400 rounded-2xl transition-all" title="Sociální"><Hash size={20}/></button>
                                  <a href={generatedImage.url} download className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all"><Download size={20}/></a>
                                </div>
                                {(aiOutput.story || aiOutput.artTitle || aiOutput.socialData) && (
                                  <div className="w-full bg-white/5 p-8 rounded-[40px] border border-white/10 text-left animate-in slide-in-from-bottom-4">
                                    <h3 className="text-2xl font-black brand-text mb-4 uppercase">{aiOutput.artTitle}</h3>
                                    <p className="text-sm italic opacity-70 mb-4">{aiOutput.story}</p>
                                    {aiOutput.socialData && <div className="p-4 bg-white/5 rounded-2xl text-[11px] opacity-60 font-mono whitespace-pre-line">{aiOutput.socialData}</div>}
                                    {aiOutput.palette && <div className="flex gap-2 mt-4">{aiOutput.palette.map((c,i)=><div key={i} className="w-8 h-8 rounded-full border border-white/20" style={{backgroundColor:c}}/> )}</div>}
                                  </div>
                                )}
                                {isThinking && <div className="text-xs uppercase tracking-[0.3em] text-cyan-400">AI přemýšlí…</div>}
                                {imgError && <div className="text-xs text-red-400">Nepodařilo se načíst náhled.</div>}
                             </div>
                           ) : <div className="opacity-20 flex flex-col items-center"><ImageIcon size={80}/><p className="mt-4 font-black uppercase tracking-[0.4em]">Ateliér připraven</p></div>}
                        </div>
                      </div>
                    )}

                    {activeWorkspaceTab === 'settings' && (
                      <div className="max-w-2xl mx-auto space-y-8 animate-fade-in text-left">
                        <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] backdrop-blur-xl">
                          <h3 className="text-xl font-bold mb-4 flex items-center gap-3"><SettingsIcon size={20} className="text-cyan-400" /> API Klíč</h3>
                          <input type="password" value={apiKey} onChange={e=>{setApiKey(e.target.value); localStorage.setItem('gemini_api_key', e.target.value);}} className="w-full bg-black/20 border border-white/10 p-4 rounded-2xl text-sm font-mono outline-none text-white" placeholder="AIza..." />
                          <div className="flex items-center gap-2 p-3 mt-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[10px] font-black text-emerald-400 uppercase tracking-widest"><Check size={14}/> Automaticky uloženo</div>
                        </div>
                      </div>
                    )}
                    
                    {activeWorkspaceTab === 'gallery' && (
                       <div className={`grid gap-8 pb-20 animate-fade-in ${deviceMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-4'}`}>
                        {history.map((s, i) => (
                          <div key={i} className="aspect-square rounded-[40px] overflow-hidden border border-white/10 hover:border-cyan-500/50 transition-all cursor-pointer relative group shadow-2xl">
                             <img src={s.url} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000" alt={s.prompt}/>
                             <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Download className="text-white" size={32}/></div>
                          </div>
                        ))}
                        {history.length === 0 && <p className="text-sm text-center text-slate-500 col-span-full">Zatím zde nic není – vygenerujte první obraz.</p>}
                      </div>
                    )}

                    {activeWorkspaceTab === 'profile' && (
                      <div className="max-w-3xl mx-auto animate-fade-in text-left space-y-6">
                        <div className={`${cardBg} border border-white/10 rounded-[32px] p-8 flex items-center gap-6`}>
                          <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black text-lg">
                            {user.name.split(' ').map(n=>n[0]).join('')}
                          </div>
                          <div>
                            <p className={`text-lg font-black ${textColor}`}>{user.name}</p>
                            <p className="text-sm text-cyan-400 font-semibold">{user.role} · {user.plan}</p>
                            <p className={`${secondaryTextColor} mt-2 text-sm`}>{user.bio}</p>
                          </div>
                        </div>
                        <div className={`${cardBg} border border-white/10 rounded-[32px] p-8`}>
                          <p className="text-sm text-slate-400">Profil je zatím pouze pro čtení. Budoucí verze umožní sdílení a týmovou spolupráci.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* GLOBÁLNÍ FOOTER */}
          {currentPage !== 'imaginator' && (
            <footer style={{ background: footerGradient }} className="relative pt-40 pb-20 overflow-hidden text-center border-t border-white/10 mt-auto">
              <div className="relative z-10 max-w-[1300px] mx-auto px-6 text-white text-center">
                <div className="flex justify-center mb-20 scale-100 md:scale-125"><img src="https://stax.organicthemes.com/wp-content/uploads/2021/12/photographer-logo-04.png" alt="Logo" style={{ width: '160px' }} className="h-auto brightness-0 invert opacity-80" /></div>
                <div className="flex justify-center items-center gap-10 md:gap-16 mb-20 text-white"><Facebook size={32}/><Instagram size={32}/><Twitter size={32}/></div>
                <nav className="mb-20"><ul className="flex flex-wrap justify-center gap-x-10 md:gap-x-16 gap-y-6 text-white">{['Domů', 'F-IMAGINATOR', 'Předplatné', 'Zásady', 'FAQ'].map((link) => (<li key={link}><button onClick={()=>setCurrentPage(link==='Domů'?'home':link==='F-IMAGINATOR'?'imaginator':'pricing')} className="text-sm font-black uppercase tracking-[0.3em] hover:text-black transition-all">{link}</button></li>))}</ul></nav>
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="mb-20 p-6 rounded-[24px] border border-white/40 text-white hover:bg-white/10 transition-all shadow-2xl"><ArrowUp size={32} /></button>
                <div className="pt-16 border-t border-white/20 text-[11px] font-black uppercase tracking-[0.5em] flex flex-col md:flex-row justify-center gap-8 md:gap-16 opacity-60">
                  <p>© {new Date().getFullYear()} IMAGINATOR STUDIO INT.</p><p className="flex items-center gap-3 justify-center"><Box size={14}/> PREMIUM AI BLOCKS</p><p className="flex items-center gap-3 justify-center"><Columns size={14}/> RESPONSIVE V8</p>
                </div>
              </div>
              <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/5 blur-[180px] rounded-full"></div>
            </footer>
          )}

        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #020617; margin: 0; }
        .animate-fade-in { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .custom-scroll::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 20px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.15); }
        .brand-text { background: ${brandGradient}; -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0,0,0,0.8); }
        .text-balance { text-wrap: balance; }
      `}} />
    </div>
  );
};

export default App;
