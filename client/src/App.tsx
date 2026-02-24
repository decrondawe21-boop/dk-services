
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
