import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, Layout, Box, Copy, Columns, 
  ChevronLeft, ChevronRight, Sparkles, 
  RefreshCw, Palette, Type, Loader2, Quote,
  Plus, Minus, AlertCircle, Menu, X, Home,
  Layers, Palette as PaletteIcon, FileText, Mail,
  CreditCard, ArrowLeft, Check, Instagram, Twitter, Facebook, ArrowUp,
  LayoutDashboard, Image as ImageIcon, History, User, Zap, Search, Bell,
  PenTool, Download, BrainCircuit, Megaphone, Tag, Volume2, Monitor, Smartphone,
  Maximize2, Trash2, Wand2, ShieldAlert, Lightbulb, Camera, Upload, Save, Edit2,
  Sun, Moon
} from 'lucide-react';
import axios from 'axios';

const App = () => {
  // --- GLOBÁLNÍ KONSTANTY & DESIGN ---
  const brandGradient = 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 33%, #14b8a6 66%, #10b981 100%)';
  const imaginatorBgDark = 'radial-gradient(circle at top left, #082f49, #0f172a, #020617)';
  const imaginatorBgLight = 'linear-gradient(135deg, #f0fdfa 0%, #ffffff 100%)'; 
  
  const footerGradient = 'linear-gradient(90deg, #0ea5e9 0%, #06b6d4 33%, #14b8a6 66%, #10b981 100%)';
  const toggleSectionGradient = 'linear-gradient(135deg, #e0fcfc 0%, #e0f7e9 100%)';
  const tokyoSunsetGradient = 'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)';

  // --- STAV STRÁNEK ---
  const [theme, setTheme] = useState('dark'); 
  const [deviceMode, setDeviceMode] = useState('desktop');
  const [currentPage, setCurrentPage] = useState('home'); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // --- STAV IMAGINATOR WORKSPACE ---
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState('generator');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [imaginatorPrompt, setImaginatorPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // --- STAV CONTENTU ---
  const [heroData, setHeroData] = useState({
    title: 'Imaginator Studio',
    subtitle: 'Vize se stává realitou skrze AI',
    description: 'Vstupte do světa, kde hranice mezi fantazií a digitálním uměním mizí. STAX a F-Studio spojují síly, aby vám přinesli nejvýkonnější kreativní nástroje současnosti.',
    videoUrl: '/videos/video_fimaginator.mp4',
    logoUrl: 'https://stax.organicthemes.com/wp-content/uploads/2021/11/stax-logo-white.png',
    overlayColor: '#0f172a',
    overlayOpacity: 0.65,
    btnGradient: brandGradient
  });

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isToggleOpen, setIsToggleOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
    const [aiPrompt, setAiPrompt] = useState("");
  const [aiStatus, setAiStatus] = useState("");
    const [isAiLoading, setIsAiLoading] = useState(false);


  const slides = [
    { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop', title: 'Imaginator Branding', category: 'Design' },
    { url: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1000&auto=format&fit=crop', title: 'F-Studio Identity', category: 'Branding' },
    { url: 'https://images.unsplash.com/photo-1551288049-bbbda546697c?q=80&w=1000&auto=format&fit=crop', title: 'Glassmorphism UI', category: 'UI/UX' }
  ];

  // --- DYNAMICKÉ STYLY DLE TÉMATU ---
  const currentBg = theme === 'dark' ? imaginatorBgDark : imaginatorBgLight;
  const textColor = theme === 'dark' ? 'text-white' : 'text-[#0f172a]';
  const secondaryTextColor = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';
  const glassPanel = theme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.6)';
  const glassBorder = theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.1)';
  const cardBg = theme === 'dark' ? 'bg-white/5' : 'bg-white/80';
  
  const iconGlow = theme === 'dark' ? '0 0 50px rgba(14, 165, 233, 0.6)' : '0 0 50px rgba(16, 185, 129, 0.4)';

  // --- LOGIKA ---
  const nextSlide = () => { setImgError(false); setCurrentSlide((prev) => (prev + 1) % slides.length); };
  const prevSlide = () => { setImgError(false); setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length); };

  const callGemini = async (prompt: string, systemInstruction: string) => {
    const response = await axios.post('http://localhost:3001/api/gemini', {
      prompt,
      systemInstruction
    });
    return response.data;
  };

  const handleAiAction = async (type: string) => {
    if (!aiPrompt) return;
    setIsAiLoading(true);
    setAiStatus(type === 'text' ? "Generuji texty..." : "Navrhuji barvy...");
    try {
      const prompt = type === 'text' 
        ? `Vygeneruj JSON s poli: title, subtitle, description pro hero sekci na téma: ${aiPrompt}` 
        : `Navrhni design v JSON (overlayColor, gradientStart, gradientEnd) pro vibe: ${aiPrompt}`;
      const system = `Jsi profesionální webdesignér. Odpovídej pouze platným JSONem v češtině.`;
      const data = await callGemini(prompt, system);
      if (type === 'text') setHeroData(prev => ({ ...prev, ...data }));
      setAiStatus("✨ Hotovo!");
    } catch (e) { setAiStatus("Chyba AI."); }
    setIsAiLoading(false);
  };

  // --- SUB-KOMPONENTY ---
  const PricingCard = ({ title, price, description, features, gradient, isPremium }: {title: string, price: string, description: string, features: string[], gradient?: string, isPremium?: boolean}) => (
    <div className={`relative rounded-3xl overflow-hidden flex flex-col transition-all duration-500 hover:shadow-2xl ${isPremium ? 'scale-100 lg:scale-[1.08] z-10 shadow-xl' : 'scale-100 z-0'}`} style={{ background: glassPanel, border: `1px solid ${glassBorder}`, backdropFilter: 'blur(20px)' }}>
      <div className="p-8 text-center" style={{ background: gradient || (theme === 'dark' ? 'rgba(15, 23, 42, 0.5)' : 'rgba(241, 245, 249, 0.8)') }}>
        <h6 className="uppercase tracking-widest text-xs font-bold mb-2" style={{ color: '#d0adf1' }}>{title}</h6>
        <p className={`${textColor} text-5xl font-black mb-2 tracking-tighter`}>{price}<sub className="text-sm font-normal align-bottom ml-1 opacity-50">/mo</sub></p>
        <hr className={`${theme === 'dark' ? 'border-white/5' : 'border-slate-200'} my-4`} />
        <p className="text-[10px] uppercase tracking-widest text-cyan-400 font-black">{description}</p>
      </div>
      <div className="p-8 flex-grow">
        <ul className="space-y-4">
          {features.map((f, i) => (
            <li key={i} className={`flex items-center gap-3 ${secondaryTextColor} text-sm font-medium`}>
              <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0"><Check size={12} /></div> <span className="text-left text-balance">{f}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-8 pt-0">
        <button className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${isPremium ? 'text-white shadow-lg' : `border border-white/10 ${textColor} hover:bg-black/5`}`} style={isPremium ? { background: brandGradient } : {}}>Vybrat</button>
      </div>
    </div>
  );

  const WorkspaceStatCard = ({ label, value, icon: Icon }: {label: string, value: string, icon: React.ElementType}) => (
    <div className={`${cardBg} border border-white/10 p-6 rounded-[24px] flex items-start justify-between hover:scale-[1.02] transition-all shadow-sm`}>
      <div className="text-left">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</p>
        <h3 className={`text-2xl font-bold ${textColor}`}>{value}</h3>
      </div>
      <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
        <Icon size={20} />
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-all duration-700 ease-in-out ${deviceMode === 'mobile' ? 'flex items-center justify-center bg-[#020617] p-4 lg:p-10' : ''}`}>
      
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop stopColor="#00ff9d" offset="0%" />
            <stop stopColor="#00f2fe" offset="100%" />
          </linearGradient>
        </defs>
      </svg>

      {/* FRAME ZAŘÍZENÍ */}
      <div className={`relative transition-all duration-700 ease-in-out shadow-2xl overflow-hidden ${deviceMode === 'mobile' ? 'w-[375px] h-[812px] rounded-[48px] border-[12px] border-slate-900 bg-black' : 'w-full h-full min-h-screen'}`}>
        
        {deviceMode === 'mobile' && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-slate-900 rounded-b-3xl z-[120] pointer-events-none"></div>}

        <div className="h-full overflow-y-auto custom-scroll relative flex flex-col" style={{ background: currentBg }}>
          
          {/* HLAVNÍ NAVIGACE TRIGGER */}
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="fixed top-6 right-6 z-[100] p-3 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-110 active:scale-90 border border-white/20"
            style={{ background: brandGradient }}
          >
            <Menu className="w-6 h-6 text-white" />
          </button>

          {/* SIDEBAR MENU */}
          <div className={`fixed inset-0 z-[150] transition-opacity duration-500 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsMenuOpen(false)}></div>
            <div className={`absolute top-0 right-0 h-full w-full max-w-[320px] ${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-white'} border-l border-white/10 transition-transform duration-500 ease-out flex flex-col ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
              <div className="p-8 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl brand-gradient flex items-center justify-center font-black text-white shadow-lg shadow-cyan-500/20">F</div>
                   <span className={`font-black ${textColor} uppercase text-lg tracking-tighter`}>Imaginator</span>
                </div>
                <button onClick={() => setIsMenuOpen(false)} className={`p-2 bg-white/5 rounded-xl hover:text-cyan-500 transition-colors ${secondaryTextColor}`}><X size={20} /></button>
              </div>
              
              <nav className="flex-1 p-8 space-y-2 overflow-y-auto custom-scroll">
                {[
                  { label: 'Domů', icon: Home, id: 'home' },
                  { label: 'F-IMAGINATOR', icon: Sparkles, id: 'imaginator', pro: true },
                  { label: 'Předplatné', icon: CreditCard, id: 'pricing' }
                ].map((item, idx) => {
                  const IconComp = item.icon;
                  return (
                    <button 
                      key={idx}
                      onClick={() => { setCurrentPage(item.id); setIsMenuOpen(false); }}
                      className={`flex items-center gap-4 w-full p-4 rounded-2xl transition-all ${currentPage === item.id ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-lg' : `${secondaryTextColor} hover:text-cyan-500 hover:bg-black/5`}`}
                    >
                      <IconComp size={20} className={item.pro ? 'text-emerald-400' : ''} />
                      <span className="font-bold text-sm tracking-tight uppercase">{item.label}</span>
                      {item.pro && <span className="ml-auto text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-black uppercase">PRO</span>}
                    </button>
                  );
                })}

                <hr className="my-6 border-white/5" />

                <div className={`p-4 rounded-3xl border ${theme === 'dark' ? 'border-white/5 bg-white/5' : 'border-slate-200 bg-slate-50'} space-y-6`}>
                  <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 text-center">Režim barev</p>
                    <div className="flex gap-2">
                      <button onClick={() => setTheme('light')} className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${theme === 'light' ? 'bg-white text-cyan-500 border-cyan-500 shadow-lg' : 'border-transparent text-slate-500 hover:bg-black/5'}`}>
                        <Sun size={16}/> <span className="text-[9px] font-black uppercase">Light</span>
                      </button>
                      <button onClick={() => setTheme('dark')} className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${theme === 'dark' ? 'bg-slate-800 border-cyan-500 text-cyan-400 shadow-lg' : 'border-transparent text-slate-500 hover:bg-black/5'}`}>
                        <Moon size={16}/> <span className="text-[9px] font-black uppercase">Dark</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 text-center">Zobrazení</p>
                    <div className="flex gap-2">
                      <button onClick={() => setDeviceMode('mobile')} className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${deviceMode === 'mobile' ? 'bg-cyan-500 text-white border-cyan-500 shadow-lg' : 'border-transparent text-slate-500 hover:bg-black/5'}`}>
                        <Smartphone size={16}/> <span className="text-[9px] font-black uppercase">Mobile</span>
                      </button>
                      <button onClick={() => setDeviceMode('desktop')} className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${deviceMode === 'desktop' ? 'bg-cyan-500 text-white border-cyan-500 shadow-lg' : 'border-transparent text-slate-500 hover:bg-black/5'}`}>
                        <Monitor size={16}/> <span className="text-[9px] font-black uppercase">PC</span>
                      </button>
                    </div>
                  </div>
                </div>
              </nav>
            </div>
          </div>

          {/* HLAVNÍ OBSAH ROUTING */}
          <div className="flex-1 flex flex-col">
            {currentPage === 'home' && (
              <div className="animate-fade-in flex flex-col min-h-screen">
                {/* HERO MARKETING */}
                <section 
                  className="relative overflow-hidden w-full flex items-center justify-center text-white min-h-screen" 
                  style={{ 
                    background: imaginatorBgDark,
                    clipPath: 'polygon(0% 0%, 100% 0%, 100% 92%, 50% 100%, 0% 92%)'
                  }}
                >
                  <div className="absolute inset-0 z-0 opacity-30">
                    <video autoPlay muted loop playsInline className="w-full h-full object-cover">
                      <source src={heroData.videoUrl} type="video/mp4" />
                    </video>
                  </div>
                  <div className="absolute inset-0 z-10 transition-all duration-1000" style={{ backgroundColor: theme === 'dark' ? heroData.overlayColor : '#ffffff', opacity: theme === 'dark' ? heroData.overlayOpacity : 0.8 }}></div>
                  <div className="relative z-20 w-full max-w-[1100px] px-6 pt-20 pb-48 flex flex-col items-center text-center">
                    
                    {/* IKONKA F SE ZÁŘÍ */}
                    <div 
                      className="p-1 rounded-[28px] bg-gradient-to-tr from-cyan-400 to-emerald-500 mb-10 animate-pulse transition-all duration-700"
                      style={{ boxShadow: iconGlow }}
                    >
                      <div className={`w-20 h-20 rounded-[26px] ${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-white'} flex items-center justify-center`}>
                        <div className={`${theme === 'dark' ? 'text-white' : 'text-cyan-600'} font-black text-5xl`}>F</div>
                      </div>
                    </div>

                    <h1 className={`${textColor} text-5xl md:text-9xl font-black mb-6 tracking-tighter text-balance uppercase leading-[0.85]`}>{heroData.title}</h1>
                    <h2 className="text-xl md:text-3xl font-bold mb-10 text-cyan-400 tracking-[0.3em] uppercase">{heroData.subtitle}</h2>
                    <p className={`max-w-3xl text-lg md:text-xl ${secondaryTextColor} leading-relaxed mb-12 font-medium opacity-80`}>{heroData.description}</p>
                    
                    <div className="flex flex-col sm:flex-row gap-6">
                      <button onClick={() => setCurrentPage('imaginator')} className="px-14 py-6 rounded-[24px] text-white font-black text-sm tracking-widest shadow-2xl hover:scale-105 transition-all uppercase border border-white/20" style={{ background: brandGradient }}>Spustit Workspace</button>
                      <button onClick={() => setCurrentPage('pricing')} className={`px-14 py-6 rounded-[24px] ${textColor} font-black text-sm tracking-widest border border-current opacity-40 hover:opacity-100 transition-all uppercase backdrop-blur-md`}>Zobrazit tarify</button>
                    </div>
                  </div>
                </section>

                {/* AI FEATURES - POSUNUTO NAHORU (-mt-28) ABY VÍCE VYSTUPOVALY NAD HERO */}
                <section className="relative z-30 -mt-28 max-w-[1300px] mx-auto px-6 mb-40">
                  <div className={`grid gap-8 ${deviceMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
                    {['Ateliér', 'Archiv', 'Analýza'].map((title, idx) => (
                      <div key={idx} className={`${cardBg} backdrop-blur-2xl border border-white/10 rounded-[40px] p-10 flex flex-col items-center text-center transition-all hover:-translate-y-6 hover:border-emerald-500/50 hover:shadow-[0_20px_80px_rgba(16,185,129,0.2)] group cursor-pointer shadow-lg`} onClick={()=>setCurrentPage('imaginator')}>
                        <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 transition-transform shadow-inner">
                           <Zap className="w-8 h-8 text-emerald-400" fill="currentColor" />
                        </div>
                        <h3 className={`text-3xl font-black mb-4 uppercase tracking-tighter ${textColor}`}>{title}</h3>
                        <p className={`${secondaryTextColor} text-base leading-relaxed opacity-70`}>Profesionální nástroje pro vaši vizi s využitím AI technologií.</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* SLIDESHOW */}
                <section className={`w-full py-40 ${theme === 'dark' ? 'bg-[#020617]' : 'bg-slate-50'} border-y border-white/5 relative`}>
                   <div className="max-w-[1300px] mx-auto px-6 flex flex-col lg:flex-row items-center gap-24 text-left">
                      <div className="w-full lg:w-1/2 relative h-[500px] md:h-[650px] rounded-[50px] overflow-hidden border border-white/10 bg-black shadow-2xl">
                         <img src={slides[currentSlide].url} className="w-full h-full object-cover opacity-60 animate-fade-in" alt="Slide" />
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
                      <div className="w-full lg:w-1/2 space-y-10">
                         <h6 className="text-emerald-500 font-black uppercase tracking-[0.4em] text-sm">Portfolio <strong>Kvality</strong></h6>
                         <h2 className={`text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] ${textColor}`}>Tvořte jako <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400">Mistři.</span></h2>
                         <p className={`text-xl ${secondaryTextColor} leading-relaxed font-medium opacity-80`}>Naše platforma propojuje lidskou kreativitu s neomezeným výpočetním výkonem umělé inteligence.</p>
                         <button onClick={() => setCurrentPage('imaginator')} className="px-12 py-6 rounded-[24px] font-black text-xs uppercase tracking-widest border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-all shadow-emerald-500/5 shadow-2xl">Vstoupit do Ateliéru</button>
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
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="absolute inset-0 opacity-20" style={{ background: theme === 'dark' ? brandGradient : 'transparent' }}></div>
                  <div className="max-w-[800px] mx-auto px-6 relative z-10">
                      <div className={`${theme === 'dark' ? 'bg-[#0f172a]/80 border-white/10' : 'bg-white border-slate-200'} backdrop-blur-xl rounded-[40px] shadow-3xl overflow-hidden border`}>
                        <div 
                            onClick={() => setIsToggleOpen(!isToggleOpen)} 
                            className="p-12 flex items-center justify-between cursor-pointer transition-all hover:brightness-110"
                            style={{ background: brandGradient }}
                        >
                            <p className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white drop-shadow-lg">Proč je obloha modrá?</p>
                            <div className="p-4 bg-white/20 rounded-3xl border border-white/20 shadow-lg">
                              {isToggleOpen ? (
                                  <Minus stroke="url(#neonGradient)" size={24} style={{ filter: 'drop-shadow(0 0 5px rgba(0, 255, 157, 0.8))' }} />
                              ) : (
                                  <Plus stroke="url(#neonGradient)" size={24} style={{ filter: 'drop-shadow(0 0 5px rgba(0, 255, 157, 0.8))' }} />
                              )}
                            </div>
                        </div>
                        {isToggleOpen && (
                            <div className={`p-12 border-t ${theme === 'dark' ? 'border-white/5 text-slate-300' : 'border-slate-100 text-slate-700'} text-lg md:text-xl leading-relaxed animate-fade-in font-medium`}>
                              Modrá barva oblohy je způsobena tzv. Rayleighovým rozptylem. Když sluneční světlo vstoupí do zemské atmosféry, narazí na molekuly plynu, které rozptýlí světlo s kratší vlnovou délkou (modrá a fialová) mnohem více než ostatní barvy spektra.
                            </div>
                        )}
                      </div>
                  </div>
                </section>

                {/* REFERENCE SECTION */}
                <section className={`py-40 ${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-white'}`}>
                  <div className="max-w-[1300px] mx-auto px-6 flex flex-col lg:flex-row items-center gap-24">
                    <div className="w-full lg:w-[40%] flex justify-center relative">
                        <div className="absolute inset-0 bg-cyan-500/20 blur-[100px] rounded-full opacity-40"></div>
                        <img src="https://stax.organicthemes.com/wp-content/uploads/2021/12/portrait-lady-cutout-01-887x1024.png" alt="Portrait" className="relative z-10 w-full max-w-[450px] h-auto object-contain drop-shadow-2xl" />
                    </div>
                    <div className="flex-1 text-left space-y-10">
                        <h2 className={`text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none ${textColor}`}>Miluji <em className="italic text-slate-500 font-serif font-light tracking-normal uppercase">systém</em> <br/><strong className="brand-text uppercase">IMAGINATOR</strong></h2>
                        <blockquote className="space-y-6">
                          <p className={`text-2xl md:text-3xl ${secondaryTextColor} italic font-light leading-relaxed opacity-90`}>"Děkuji vám. Máte ty nejvýkonnější a nejkrásnější nástroje, jaké jsem kdy v AI prostoru viděla. Práce v Ateliéru je čirá radost."</p>
                          <cite className="block text-cyan-500 font-black uppercase tracking-[0.2em] text-sm">— Lynn Sheldon, Creative Director</cite>
                        </blockquote>
                    </div>
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
                    <PricingCard title="Základ" price="$9" description="Pro začínající tvůrce" features={["100 AI Generací", "Osobní Galerie", "Standard podpora"]} />
                    <PricingCard title="Standard" price="$12" description="Pro freelancery" features={["500 AI Generací", "Editace předloh", "Analýza stylu"]} />
                    <PricingCard title="Premium" price="$15" description="Nejoblíbenější PRO" isPremium gradient={tokyoSunsetGradient} features={["Neomezené texty", "1000 Obrázků", "Gemini Pro", "24/7 VIP Support"]} />
                    <PricingCard title="Deluxe" price="$22" description="Pro herní studia" features={["Vše bez limitů", "Vlastní AI modely", "Týmový prostor"]} />
                  </div>
                </div>
              </div>
            )}

            {currentPage === 'imaginator' && (
              <div className="animate-fade-in flex flex-col lg:flex-row h-screen overflow-hidden bg-[#020617] relative">
                <aside className={`${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-white'} border-r ${theme === 'dark' ? 'border-white/5' : 'border-slate-200'} transition-all duration-500 flex flex-col p-5 z-20 ${isSidebarCollapsed ? 'w-24' : 'w-80'}`}>
                  <div className={`flex items-center gap-4 mb-14 mt-4 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                    <div 
                      className="w-12 h-12 rounded-2xl brand-gradient flex items-center justify-center font-black text-white shrink-0"
                      style={{ boxShadow: iconGlow.replace('50px', '20px') }}
                    >F</div>
                    {!isSidebarCollapsed && <div className="flex flex-col text-left"><span className={`font-black ${textColor} text-xl tracking-tighter leading-none uppercase`}>Imaginator</span><span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mt-1">Workspace v8.0</span></div>}
                  </div>
                  <nav className="flex-1 space-y-3">
                    {[
                      { id: 'dashboard', label: 'Nástěnka', icon: LayoutDashboard },
                      { id: 'generator', label: 'AI Ateliér', icon: ImageIcon },
                      { id: 'gallery', label: 'Archiv', icon: History },
                      { id: 'profile', label: 'Můj Profil', icon: User }
                    ].map(tab => {
                      const TabIcon = tab.icon;
                      return (
                        <button key={tab.id} onClick={() => setActiveWorkspaceTab(tab.id)} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${activeWorkspaceTab === tab.id ? 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 shadow-lg' : `${secondaryTextColor} hover:text-cyan-500 hover:bg-black/5`}`}>
                          <TabIcon size={20} className="shrink-0" />
                          {!isSidebarCollapsed && <span className="font-black text-sm uppercase tracking-tight">{tab.label}</span>}
                        </button>
                      );
                    })}
                  </nav>
                </aside>

                <div className="flex-1 flex flex-col overflow-hidden relative" style={{ background: currentBg }}>
                  <header className={`h-24 border-b ${theme === 'dark' ? 'border-white/5' : 'border-slate-200'} flex items-center justify-between px-10 backdrop-blur-2xl relative z-10`}>
                     <h2 className={`text-2xl font-black uppercase tracking-tighter ${textColor}`}>{activeWorkspaceTab}</h2>
                     <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-3 px-6 py-3 bg-white/5 rounded-2xl border border-white/10 shadow-inner">
                           <Zap size={16} className="text-emerald-400" fill="currentColor" />
                           <span className={`text-xs font-black tracking-widest uppercase ${textColor}`}>2,480 TOKENS</span>
                        </div>
                        <Bell className={`${secondaryTextColor} hover:text-cyan-500 cursor-pointer`}/>
                     </div>
                  </header>

                  <div className="flex-1 overflow-y-auto custom-scroll p-10 relative z-10 text-slate-200">
                    {activeWorkspaceTab === 'dashboard' && (
                      <div className={`grid gap-8 ${deviceMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'} animate-fade-in`}>
                        <WorkspaceStatCard label="Vygenerováno" value="156" icon={ImageIcon} />
                        <WorkspaceStatCard label="Doba práce" value="42h" icon={History} />
                        <WorkspaceStatCard label="Stav" value="OPTIMAL" icon={Sparkles} />
                      </div>
                    )}
                    {activeWorkspaceTab === 'generator' && (
                      <div className={`flex gap-10 h-full animate-fade-in ${deviceMode === 'mobile' ? 'flex-col' : 'flex-col lg:flex-row'}`}>
                        <div className={`w-full ${deviceMode === 'mobile' ? '' : 'lg:w-[450px]'} space-y-8 text-left`}>
                           <div className={`${cardBg} border border-white/10 rounded-[40px] p-10 space-y-6 shadow-2xl relative overflow-hidden`}>
                              <div className="absolute top-0 left-0 w-1 h-full brand-gradient opacity-50"></div>
                              <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] block">Kreativní Prompt</label>
                              <textarea 
                                value={imaginatorPrompt}
                                onChange={(e) => setImaginatorPrompt(e.target.value)}
                                className={`w-full h-48 bg-black/5 border border-white/10 rounded-[24px] p-6 text-base focus:border-cyan-500/50 outline-none resize-none transition-all ${textColor} placeholder:text-slate-500`}
                                placeholder="Co si přejete stvořit?..."
                              />
                              <button onClick={() => { setIsGenerating(true); setTimeout(() => setIsGenerating(false), 2000); }} className="w-full py-6 brand-gradient text-white rounded-[24px] font-black text-sm tracking-[0.2em] shadow-lg shadow-cyan-500/30 active:scale-95 transition-all uppercase">Materializovat</button>
                           </div>
                        </div>
                        <div className={`flex-1 bg-black/5 border-2 ${theme === 'dark' ? 'border-white/5' : 'border-slate-300'} border-dashed rounded-[50px] flex flex-col items-center justify-center text-slate-500 p-20 min-h-[400px]`}>
                           {isGenerating ? <Loader2 className="text-cyan-500 animate-spin" size={64}/> : <ImageIcon size={80} className="opacity-20"/>}
                           <p className="text-sm font-black uppercase tracking-[0.4em] opacity-30 mt-6">{isGenerating ? 'Generování...' : 'Ateliér připraven'}</p>
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
                <div className="flex justify-center mb-20 scale-100 md:scale-125">
                  <img src="https://stax.organicthemes.com/wp-content/uploads/2021/12/photographer-logo-04.png" alt="Logo" style={{ width: '160px' }} className="h-auto brightness-0 invert opacity-80" />
                </div>
                <div className="flex justify-center items-center gap-10 md:gap-16 mb-20 text-white">
                  {[Facebook, Instagram, Twitter].map((Soc, i) => {
                    const SocIcon = Soc;
                    return <a key={i} href="#" className="text-white hover:text-black transition-all hover:scale-150 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"><SocIcon size={32} /></a>
                  })}
                </div>
                <nav className="mb-20">
                  <ul className="flex flex-wrap justify-center gap-x-10 md:gap-x-16 gap-y-6 text-white">
                    {['Domů', 'F-IMAGINATOR', 'Předplatné', 'Zásady', 'FAQ'].map((link, i) => (
                      <li key={i}><button onClick={()=>setCurrentPage(link === 'Domů' ? 'home' : link === 'F-IMAGINATOR' ? 'imaginator' : 'pricing')} className="text-sm font-black uppercase tracking-[0.3em] hover:text-black transition-all">{link}</button></li>
                    ))}
                  </ul>
                </nav>
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="mb-20 p-6 rounded-[24px] border border-white/40 text-white hover:bg-white/10 transition-all shadow-2xl"><ArrowUp size={32} /></button>
                <div className="pt-16 border-t border-white/20 text-[11px] font-black uppercase tracking-[0.5em] flex flex-col md:flex-row justify-center gap-8 md:gap-16 opacity-60">
                  <p>© {new Date().getFullYear()} IMAGINATOR STUDIO INT.</p>
                  <p className="flex items-center gap-3 justify-center"><Box size={14}/> PREMIUM AI BLOCKS</p>
                  <p className="flex items-center gap-3 justify-center"><Columns size={14}/> RESPONSIVE V8</p>
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
