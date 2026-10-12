import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Heart, ArrowRight, ArrowLeft, ShieldAlert, PhoneCall,
  CheckCircle2, AlertTriangle, BookOpen, User, 
  ExternalLink, ChevronRight, X, Sparkles, Home,
  FileText, ShieldCheck, HelpCircle, Compass
} from 'lucide-react';
import { ANIMALS_DATA, Animal, findAnimalById } from './data/animals';
import { CATALOG_99_SPECIES, CatalogSpecies } from './data/speciesCatalog';
import { AnimalDetail } from './components/AnimalDetail';
import { EmergencyModal } from './components/EmergencyModal';
import { SourcesView } from './components/SourcesView';
import { RegionalView } from './components/RegionalView';
import { MythsView } from './components/MythsView';
import { SafeHomeView } from './components/SafeHomeView';
import { SecurityMapView } from './components/SecurityMapView';
import { PremiumModal } from './components/PremiumModal';

type Screen = 'inicio' | 'explorar' | 'guia' | 'orientacoes' | 'salvos' | 'perfil' | 'fontes' | 'detalhe' | 'mitos' | 'checklist' | 'regional' | 'mapa';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('inicio');
  const [previousScreen, setPreviousScreen] = useState<Screen>('inicio');
  const [selectedAnimalId, setSelectedAnimalId] = useState<string | null>(null);
  
  // Search & Filter state for the 99 Species Guide
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [activeRiskFilter, setActiveRiskFilter] = useState<string>('Todos');
  const [onlyPeconhentos, setOnlyPeconhentos] = useState<boolean>(false);
  const [onlyVerifiedSources, setOnlyVerifiedSources] = useState<boolean>(false);

  // Saved animals bookmarks
  const [savedIds, setSavedIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem('pk-saved');
      return stored ? new Set(JSON.parse(stored)) : new Set(['escorpiao', 'mosquito']);
    } catch {
      return new Set(['escorpiao', 'mosquito']);
    }
  });

  // Emergency Modal
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);

  // Premium State (persisted in localStorage for demo testing)
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(() => {
    try {
      return localStorage.getItem('pk-is-premium') === 'true';
    } catch {
      return false;
    }
  });
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState<boolean>(false);

  const togglePremiumUser = () => {
    setIsPremiumUser(prev => {
      const next = !prev;
      try {
        localStorage.setItem('pk-is-premium', String(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Sync saved bookmarks with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pk-saved', JSON.stringify([...savedIds]));
    } catch (e) {
      console.error(e);
    }
  }, [savedIds]);

  const toggleSave = (id: string) => {
    setSavedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const navigateTo = (screen: Screen) => {
    setPreviousScreen(currentScreen === 'detalhe' ? 'guia' : currentScreen);
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAnimalDetail = (id: string) => {
    setSelectedAnimalId(id);
    setPreviousScreen(currentScreen);
    setCurrentScreen('detalhe');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const catalogMap = useMemo(() => {
    const map = new Map<number, CatalogSpecies>();
    CATALOG_99_SPECIES.forEach(s => map.set(s.id, s));
    return map;
  }, []);

  const selectedAnimal = useMemo(() => {
    return findAnimalById(selectedAnimalId);
  }, [selectedAnimalId]);

  // Filtered animals list covering all 99 catalog species
  const filteredAnimals = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return ANIMALS_DATA.filter(animal => {
      const catItem = animal.catalogId ? catalogMap.get(animal.catalogId) : null;

      // Group or category match
      let matchGroup = true;
      if (activeCategory !== 'Todos') {
        if (catItem) {
          if (activeCategory === 'Outros') {
            matchGroup = catItem.grupo === 'Parasitas' || catItem.grupo === 'Outros pequenos animais' || catItem.grupo === 'Outros insetos' || animal.category === 'Outros';
          } else {
            matchGroup = catItem.grupo === activeCategory || animal.category === activeCategory;
          }
        } else {
          matchGroup = animal.category === activeCategory;
        }
      }

      // Risk match
      let matchRisk = true;
      if (activeRiskFilter !== 'Todos') {
        if (catItem) {
          matchRisk = catItem.risco === activeRiskFilter;
        } else {
          matchRisk = animal.riskLevel.toLowerCase().includes(activeRiskFilter.toLowerCase());
        }
      }

      // Peçonhento match
      const matchPeconhento = onlyPeconhentos ? animal.isPeconhento : true;

      // Verified sources match
      const matchVerified = onlyVerifiedSources 
        ? (catItem ? catItem.status_validacao === 'fonte_localizada' : true)
        : true;

      // Search match
      const matchSearch = !q || (
        animal.name.toLowerCase().includes(q) ||
        animal.scientific.toLowerCase().includes(q) ||
        animal.summary.toLowerCase().includes(q) ||
        animal.where.toLowerCase().includes(q) ||
        (catItem && catItem.grupo.toLowerCase().includes(q))
      );

      return matchGroup && matchRisk && matchPeconhento && matchVerified && matchSearch;
    });
  }, [searchQuery, activeCategory, activeRiskFilter, onlyPeconhentos, onlyVerifiedSources, catalogMap]);

  const savedAnimalsList = useMemo(() => {
    return ANIMALS_DATA.filter(a => savedIds.has(a.id) || (a.catalogId && savedIds.has(`especie-${a.catalogId}`)));
  }, [savedIds]);

  const groupsList = [
    { label: 'Todos (99)', value: 'Todos' },
    { label: '🦂 Escorpiões', value: 'Escorpiões' },
    { label: '🕷️ Aranhas', value: 'Aranhas' },
    { label: '🐍 Serpentes', value: 'Serpentes' },
    { label: '🐛 Lagartas', value: 'Lagartas' },
    { label: '🐝 Abelhas & Vespas', value: 'Abelhas e vespas' },
    { label: '🐜 Formigas', value: 'Formigas' },
    { label: '🪳 Carrapatos', value: 'Carrapatos' },
    { label: '🦟 Mosquitos', value: 'Mosquitos' },
    { label: '🪲 Barbeiros', value: 'Barbeiros' },
    { label: '🐛 Lacraias', value: 'Lacraias' },
    { label: '🪳 Baratas', value: 'Baratas' },
    { label: '🔬 Parasitas & Outros', value: 'Outros' }
  ];

  const getScreenTitle = (screen: Screen) => {
    switch (screen) {
      case 'explorar': return 'Explorar Categorias';
      case 'guia': return 'Guia de Animais';
      case 'orientacoes': return 'Como Agir com Calma';
      case 'salvos': return 'Meus Salvos';
      case 'perfil': return 'Perfil da Família';
      case 'fontes': return 'Fontes Oficiais';
      case 'mitos': return 'Mitos e Verdades';
      case 'checklist': return 'Ambiente Seguro';
      case 'regional': return 'Regional & Épocas';
      case 'mapa': return 'Mapa de Atendimento SUS';
      case 'detalhe': return selectedAnimal?.name || 'Ficha Educativa';
      default: return '';
    }
  };

  const handleHeaderBack = () => {
    if (currentScreen === 'detalhe') {
      navigateTo(previousScreen === 'detalhe' ? 'guia' : previousScreen);
    } else if (previousScreen && previousScreen !== currentScreen) {
      navigateTo(previousScreen);
    } else {
      navigateTo('inicio');
    }
  };

  return (
    <div className={`min-h-screen ${currentScreen === 'mapa' ? 'bg-[#0b100c] overflow-hidden' : 'bg-[#f8faf4]'} text-[#20251d] font-sans flex flex-col justify-between antialiased`}>
      {/* Top Main Application Shell */}
      <div className={`w-full ${currentScreen === 'mapa' ? 'max-w-none h-screen overflow-hidden pb-14' : 'max-w-xl mx-auto min-h-screen pb-28 sm:pb-32 sm:border-x sm:border-[#e8ecdf] sm:shadow-lg bg-[#f8faf4]'} flex flex-col relative`}>
        
        {/* Top Header — Exibido na página de início */}
        {currentScreen === 'inicio' && (
          <header className="sticky top-0 z-30 bg-[#f8faf4]/90 backdrop-blur-md border-b border-[#e8ecdf]/80 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
            <button 
              onClick={() => navigateTo('inicio')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-2xl bg-[#dfff55] flex items-center justify-center font-black text-lg text-[#315321] shadow-xs group-hover:scale-105 transition-transform">
                ✳
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-[#20251d]">
                  protege<span className="text-[#537d37]">kids</span>
                </span>
                <span className="block text-[10px] text-[#73796d] font-semibold -mt-1">
                  Guia de cuidado infantil
                </span>
              </div>
            </button>

            <div className="flex items-center gap-2">
              {/* Direct Emergency Button */}
              <button
                onClick={() => setIsEmergencyModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#ffedd5] hover:bg-[#fed7aa] text-[#c2410c] text-xs font-bold transition-all border border-[#fdba74]/60 active:scale-95 cursor-pointer"
                title="Abrir canais de emergência (SAMU 192)"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#ea580c]" />
                <span className="hidden xs:inline">SOS</span>
                <span>192</span>
              </button>

              {/* Profile trigger */}
              <button
                onClick={() => navigateTo('perfil')}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors text-sm font-bold cursor-pointer bg-[#edf1e6] text-[#444c3e] hover:bg-[#e1e7d8]"
                aria-label="Meu perfil e fontes"
              >
                <User className="w-4 h-4" />
              </button>
            </div>
          </header>
        )}

        {/* Top Header — Exibido em TODAS as outras telas (exceto início e mapa que possui HUD próprio de tela cheia) */}
        {currentScreen !== 'inicio' && currentScreen !== 'mapa' && (
          <header className="sticky top-0 z-30 bg-[#f8faf4]/95 backdrop-blur-md border-b border-[#e8ecdf]/80 px-3.5 sm:px-6 py-2.5 flex items-center justify-between gap-2.5 shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Componente de voltar no canto superior esquerdo */}
              <button
                onClick={handleHeaderBack}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#edf4df] text-[#315321] font-bold text-xs transition-all border border-[#e8ecdf] shadow-xs cursor-pointer active:scale-95 shrink-0"
                aria-label="Voltar à tela anterior"
              >
                <ArrowLeft className="w-4 h-4 text-[#315321]" />
                <span>Voltar</span>
              </button>

              <span className="text-xs sm:text-sm font-extrabold text-[#20251d] tracking-tight truncate">
                {getScreenTitle(currentScreen)}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setIsEmergencyModalOpen(true)}
                className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-[#ffedd5] hover:bg-[#fed7aa] text-[#c2410c] text-[11px] sm:text-xs font-bold transition-all border border-[#fdba74]/60 active:scale-95 cursor-pointer"
                title="SAMU 192"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#ea580c]" />
                <span className="hidden xs:inline">SOS</span>
                <span>192</span>
              </button>

              <button
                onClick={() => navigateTo('perfil')}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors text-xs font-bold cursor-pointer bg-[#edf1e6] text-[#444c3e] hover:bg-[#e1e7d8]"
                aria-label="Meu perfil"
              >
                <User className="w-3.5 h-3.5" />
              </button>
            </div>
          </header>
        )}

        {/* Main Body Content Screens */}
        <main className={`flex-1 ${currentScreen === 'mapa' ? 'p-0 w-full h-full flex flex-col overflow-hidden' : 'px-4 sm:px-6 py-4'}`}>

          {/* SCREEN: INICIO (HOME) */}
          {currentScreen === 'inicio' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Hero Banner */}
              <div className="space-y-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#537d37]">
                  Cuidado com tranquilidade
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#20251d] tracking-tight leading-tight">
                  Pequenos cuidados,<br />mais segurança. 🌱
                </h1>
                <p className="text-xs sm:text-sm text-[#73796d] font-medium leading-relaxed max-w-md pt-0.5">
                  Informação médica e preventiva clara para cuidar de quem você mais ama — sem alarmismo.
                </p>
              </div>

              {/* Main Interactive Hero Card */}
              <div className="bg-[#dfff55] rounded-3xl p-5 sm:p-6 relative overflow-hidden shadow-xs border border-[#cfe94b]">
                {/* Decorative background shape */}
                <div className="absolute -right-8 -bottom-10 w-40 h-40 rounded-full bg-[#bade33] pointer-events-none" />
                <div className="absolute right-4 bottom-3 text-7xl select-none filter drop-shadow-md z-10">
                  🐞
                </div>

                <div className="relative z-20 max-w-[240px] sm:max-w-xs space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#3d5b1f] px-2 py-0.5 rounded-md bg-[#c7eb3b]">
                    Seu guia de bolso
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#20251d] tracking-tight leading-tight">
                    Conheça antes de se preocupar.
                  </h2>
                  <p className="text-xs text-[#404b27] font-medium leading-relaxed">
                    Aprenda a reconhecer pequenos animais, evitar acidentes e agir com segurança.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => navigateTo('guia')}
                      className="px-4 py-2.5 rounded-full bg-[#315321] hover:bg-[#253f19] text-white text-xs font-bold transition-all shadow-md active:scale-95 inline-flex items-center gap-1.5"
                    >
                      <span>Explorar o guia</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Category / Action Grid: 2x4 Horizontal Scroll */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-extrabold text-[#20251d]">
                      O que você procura?
                    </h2>
                    <span className="text-[11px] text-[#73796d]">
                      Deslize para ver os 8 tópicos essenciais ➔
                    </span>
                  </div>
                  <button
                    onClick={() => navigateTo('guia')}
                    className="text-xs font-bold text-[#537d37] hover:underline shrink-0"
                  >
                    Ver tudo →
                  </button>
                </div>

                <div className="overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
                  <div className="grid grid-rows-2 grid-flow-col gap-2.5 w-max">
                    {/* Item 1: Insetos */}
                    <button
                      onClick={() => {
                        setActiveCategory('Insetos');
                        navigateTo('guia');
                      }}
                      className="w-[160px] sm:w-[172px] p-3.5 bg-white rounded-2xl border border-[#e8ecdf] hover:border-[#ccd7be] text-left transition-all hover:shadow-xs group shrink-0 cursor-pointer"
                    >
                      <span className="text-2xl block mb-1 group-hover:scale-110 transition-transform">🦋</span>
                      <strong className="block text-xs sm:text-sm font-bold text-[#20251d]">Insetos</strong>
                      <span className="text-[11px] text-[#73796d] truncate block">Abelhas, mosquitos</span>
                    </button>

                    {/* Item 2: Aracnídeos */}
                    <button
                      onClick={() => {
                        setActiveCategory('Aracnídeos');
                        navigateTo('guia');
                      }}
                      className="w-[160px] sm:w-[172px] p-3.5 bg-white rounded-2xl border border-[#e8ecdf] hover:border-[#ccd7be] text-left transition-all hover:shadow-xs group shrink-0 cursor-pointer"
                    >
                      <span className="text-2xl block mb-1 group-hover:scale-110 transition-transform">🕷️</span>
                      <strong className="block text-xs sm:text-sm font-bold text-[#20251d]">Aracnídeos</strong>
                      <span className="text-[11px] text-[#73796d] truncate block">Aranhas e escorpiões</span>
                    </button>

                    {/* Item 3: Como agir */}
                    <button
                      onClick={() => navigateTo('orientacoes')}
                      className="w-[160px] sm:w-[172px] p-3.5 bg-white rounded-2xl border border-[#e8ecdf] hover:border-[#ccd7be] text-left transition-all hover:shadow-xs group shrink-0 cursor-pointer"
                    >
                      <span className="text-2xl block mb-1 group-hover:scale-110 transition-transform">🩹</span>
                      <strong className="block text-xs sm:text-sm font-bold text-[#20251d]">Como agir</strong>
                      <span className="text-[11px] text-[#73796d] truncate block">Primeiros socorros</span>
                    </button>

                    {/* Item 4: Meus salvos */}
                    <button
                      onClick={() => navigateTo('salvos')}
                      className="w-[160px] sm:w-[172px] p-3.5 bg-white rounded-2xl border border-[#e8ecdf] hover:border-[#ccd7be] text-left transition-all hover:shadow-xs group shrink-0 cursor-pointer"
                    >
                      <span className="text-2xl block mb-1 group-hover:scale-110 transition-transform">♡</span>
                      <strong className="block text-xs sm:text-sm font-bold text-[#20251d]">Meus salvos</strong>
                      <span className="text-[11px] text-[#73796d] truncate block">{savedIds.size} fichas guardadas</span>
                    </button>

                    {/* Item 5: Mito ou Verdade */}
                    <button
                      onClick={() => navigateTo('mitos')}
                      className="w-[160px] sm:w-[172px] p-3.5 bg-white rounded-2xl border border-[#e8ecdf] hover:border-[#ccd7be] text-left transition-all hover:shadow-xs group shrink-0 cursor-pointer"
                    >
                      <span className="text-2xl block mb-1 group-hover:scale-110 transition-transform">🧠</span>
                      <strong className="block text-xs sm:text-sm font-bold text-[#20251d]">Mito ou Verdade</strong>
                      <span className="text-[11px] text-[#73796d] truncate block">Fatos que salvam vidas</span>
                    </button>

                    {/* Item 6: Ambiente Seguro */}
                    <button
                      onClick={() => navigateTo('checklist')}
                      className="w-[160px] sm:w-[172px] p-3.5 bg-white rounded-2xl border border-[#e8ecdf] hover:border-[#ccd7be] text-left transition-all hover:shadow-xs group shrink-0 cursor-pointer"
                    >
                      <span className="text-2xl block mb-1 group-hover:scale-110 transition-transform">🏡</span>
                      <strong className="block text-xs sm:text-sm font-bold text-[#20251d]">Ambiente Seguro</strong>
                      <span className="text-[11px] text-[#73796d] truncate block">Checklist no lar 🌱</span>
                    </button>

                    {/* Item 7: Regional e Épocas */}
                    <button
                      onClick={() => navigateTo('regional')}
                      className="w-[160px] sm:w-[172px] p-3.5 bg-white rounded-2xl border border-[#e8ecdf] hover:border-[#ccd7be] text-left transition-all hover:shadow-xs group shrink-0 cursor-pointer"
                    >
                      <span className="text-2xl block mb-1 group-hover:scale-110 transition-transform">🌦️</span>
                      <strong className="block text-xs sm:text-sm font-bold text-[#20251d]">Regional</strong>
                      <span className="text-[11px] text-[#73796d] truncate block">Hábitos e épocas</span>
                    </button>

                    {/* Item 8: Fontes Oficiais */}
                    <button
                      onClick={() => navigateTo('fontes')}
                      className="w-[160px] sm:w-[172px] p-3.5 bg-white rounded-2xl border border-[#e8ecdf] hover:border-[#ccd7be] text-left transition-all hover:shadow-xs group shrink-0 cursor-pointer"
                    >
                      <span className="text-2xl block mb-1 group-hover:scale-110 transition-transform">📚</span>
                      <strong className="block text-xs sm:text-sm font-bold text-[#20251d]">Fontes Oficiais</strong>
                      <span className="text-[11px] text-[#73796d] truncate block">Ministério & Fiocruz</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Emergency Fast Banner with direct action to Mapa */}
              <div className="bg-gradient-to-br from-[#fff7ed] via-[#fff4e8] to-[#feebda] rounded-3xl p-4 sm:p-5 border border-[#fed7aa] space-y-3.5 shadow-xs">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#ea580c] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <ShieldAlert className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#ea580c] block">
                        Urgência & Referência Oficial
                      </span>
                      <h3 className="text-sm sm:text-base font-extrabold text-[#9a3412]">
                        Picada ou Suspeita de Acidente?
                      </h3>
                      <p className="text-xs text-[#7c2d12]">
                        Encontre hospitais de referência para soro e centros toxicológicos perto de você.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <button
                    onClick={() => navigateTo('mapa')}
                    className="py-3 px-3 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer active:scale-95"
                  >
                    <span>🚨 Atendimento Próximo</span>
                  </button>

                  <button
                    onClick={() => setIsEmergencyModalOpen(true)}
                    className="py-3 px-3 rounded-xl bg-white hover:bg-orange-50 text-[#c2410c] border border-[#fdba74] text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer active:scale-95"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-[#ea580c]" />
                    <span>Ligar SAMU 192</span>
                  </button>
                </div>
              </div>

              {/* Featured Animals List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-extrabold text-[#20251d]">
                    Para começar a conhecer
                  </h2>
                  <button
                    onClick={() => navigateTo('guia')}
                    className="text-xs font-bold text-[#537d37] hover:underline"
                  >
                    Ver guia completo →
                  </button>
                </div>

                <div className="space-y-2.5">
                  {ANIMALS_DATA.slice(0, 4).map(animal => (
                    <button
                      key={animal.id}
                      onClick={() => openAnimalDetail(animal.id)}
                      className="w-full text-left p-3.5 bg-white rounded-2xl border border-[#e8ecdf] hover:border-[#ccd7be] transition-all flex items-center gap-3 group shadow-xs"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-[#edf4df] flex items-center justify-center text-3xl shrink-0 group-hover:scale-105 transition-transform">
                        {animal.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <strong className="text-sm font-bold text-[#20251d] truncate">
                            {animal.name}
                          </strong>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            animal.isPeconhento
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : 'bg-[#f0f4ea] text-[#537d37]'
                          }`}>
                            {animal.category}
                          </span>
                        </div>
                        <p className="text-xs text-[#73796d] truncate mt-0.5">
                          {animal.summary}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#8b9481] group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer Educational Note */}
              <p className="text-[11px] text-[#838a7a] text-center leading-relaxed pt-2">
                Conteúdo educativo. Em casos clínicos reais de bebês e crianças, consulte sempre um serviço de saúde ou ligue 192.
              </p>
            </div>
          )}

          {/* SCREEN: EXPLORAR */}
          {currentScreen === 'explorar' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="space-y-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#537d37]">
                  Descubra com tranquilidade
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#20251d] tracking-tight leading-tight">
                  Explore o mundo<br />dos pequenos animais. 🌿
                </h1>
                <p className="text-xs sm:text-sm text-[#73796d] font-medium leading-relaxed max-w-md pt-0.5">
                  Conhecimento prático para reconhecer, prevenir e saber quando procurar ajuda.
                </p>
              </div>

              {/* Section: Explore por categoria */}
              <div className="space-y-3 pt-2">
                <h2 className="text-lg font-extrabold text-[#20251d]">
                  Explore por categoria
                </h2>

                <div className="grid gap-3.5">
                  {/* Category Card 1: Insetos */}
                  <button
                    onClick={() => {
                      setActiveCategory('Insetos');
                      setOnlyPeconhentos(false);
                      setSearchQuery('');
                      navigateTo('guia');
                    }}
                    className="w-full min-h-[140px] rounded-3xl p-4 sm:p-5 flex items-center text-left gap-3.5 sm:gap-4 overflow-hidden text-[#20251d] bg-[#dfff55] border border-[#cfe94b] transition-all hover:shadow-md hover:scale-[1.01] active:scale-[0.99] group cursor-pointer"
                  >
                    <span className="w-20 h-24 sm:w-24 sm:h-28 shrink-0 rounded-2xl bg-white/70 backdrop-blur-xs flex items-center justify-center text-5xl group-hover:scale-105 transition-transform shadow-xs" aria-hidden="true">
                      🦋
                    </span>
                    <span className="flex flex-col items-start min-w-0 flex-1">
                      <b className="text-lg sm:text-xl font-extrabold tracking-tight text-[#20251d]">
                        Insetos
                      </b>
                      <small className="text-xs sm:text-sm leading-snug text-[#4e5945] my-1 font-medium">
                        Mosquitos, abelhas, formigas, besouros e lagartas
                      </small>
                      <span className="text-xs font-extrabold text-[#315321] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Explorar categoria ↗
                      </span>
                    </span>
                  </button>

                  {/* Category Card 2: Aracnídeos */}
                  <button
                    onClick={() => {
                      setActiveCategory('Aracnídeos');
                      setOnlyPeconhentos(false);
                      setSearchQuery('');
                      navigateTo('guia');
                    }}
                    className="w-full min-h-[140px] rounded-3xl p-4 sm:p-5 flex items-center text-left gap-3.5 sm:gap-4 overflow-hidden text-[#20251d] bg-[#f5d9c5] border border-[#ebd0be] transition-all hover:shadow-md hover:scale-[1.01] active:scale-[0.99] group cursor-pointer"
                  >
                    <span className="w-20 h-24 sm:w-24 sm:h-28 shrink-0 rounded-2xl bg-white/70 backdrop-blur-xs flex items-center justify-center text-5xl group-hover:scale-105 transition-transform shadow-xs" aria-hidden="true">
                      🕷️
                    </span>
                    <span className="flex flex-col items-start min-w-0 flex-1">
                      <b className="text-lg sm:text-xl font-extrabold tracking-tight text-[#20251d]">
                        Aracnídeos
                      </b>
                      <small className="text-xs sm:text-sm leading-snug text-[#4e5945] my-1 font-medium">
                        Aranhas, escorpiões amarelos e carrapatos
                      </small>
                      <span className="text-xs font-extrabold text-[#315321] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Explorar categoria ↗
                      </span>
                    </span>
                  </button>

                  {/* Category Card 3: Miriápodes & Rastejantes */}
                  <button
                    onClick={() => {
                      setActiveCategory('Miriápodes');
                      setOnlyPeconhentos(false);
                      setSearchQuery('');
                      navigateTo('guia');
                    }}
                    className="w-full min-h-[140px] rounded-3xl p-4 sm:p-5 flex items-center text-left gap-3.5 sm:gap-4 overflow-hidden text-[#20251d] bg-[#fef08a] border border-[#fde047] transition-all hover:shadow-md hover:scale-[1.01] active:scale-[0.99] group cursor-pointer"
                  >
                    <span className="w-20 h-24 sm:w-24 sm:h-28 shrink-0 rounded-2xl bg-white/70 backdrop-blur-xs flex items-center justify-center text-5xl group-hover:scale-105 transition-transform shadow-xs" aria-hidden="true">
                      🐛
                    </span>
                    <span className="flex flex-col items-start min-w-0 flex-1">
                      <b className="text-lg sm:text-xl font-extrabold tracking-tight text-[#20251d]">
                        Miriápodes & Rastejantes
                      </b>
                      <small className="text-xs sm:text-sm leading-snug text-[#4e5945] my-1 font-medium">
                        Lacraias, centopeias e piolhos-de-cobra no chão
                      </small>
                      <span className="text-xs font-extrabold text-[#315321] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Explorar categoria ↗
                      </span>
                    </span>
                  </button>

                  {/* Category Card 4: Alerta: Peçonhentos */}
                  <button
                    onClick={() => {
                      setActiveCategory('Todos');
                      setOnlyPeconhentos(true);
                      setSearchQuery('');
                      navigateTo('guia');
                    }}
                    className="w-full min-h-[140px] rounded-3xl p-4 sm:p-5 flex items-center text-left gap-3.5 sm:gap-4 overflow-hidden text-[#20251d] bg-[#fed7aa] border border-[#fdba74] transition-all hover:shadow-md hover:scale-[1.01] active:scale-[0.99] group cursor-pointer"
                  >
                    <span className="w-20 h-24 sm:w-24 sm:h-28 shrink-0 rounded-2xl bg-white/70 backdrop-blur-xs flex items-center justify-center text-5xl group-hover:scale-105 transition-transform shadow-xs" aria-hidden="true">
                      ⚠️
                    </span>
                    <span className="flex flex-col items-start min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <b className="text-lg sm:text-xl font-extrabold tracking-tight text-[#9a3412]">
                          Peçonhentos de Alerta
                        </b>
                        <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded-full">
                          Soro
                        </span>
                      </div>
                      <small className="text-xs sm:text-sm leading-snug text-[#7c2d12] my-1 font-medium">
                        Escorpiões, aranhas-marrons e taturanas com veneno
                      </small>
                      <span className="text-xs font-extrabold text-[#c2410c] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Ver animais peçonhentos ↗
                      </span>
                    </span>
                  </button>

                  {/* Category Card 5: Mosquitos & Arboviroses */}
                  <button
                    onClick={() => {
                      setActiveCategory('Todos');
                      setOnlyPeconhentos(false);
                      setSearchQuery('mosquito');
                      navigateTo('guia');
                    }}
                    className="w-full min-h-[140px] rounded-3xl p-4 sm:p-5 flex items-center text-left gap-3.5 sm:gap-4 overflow-hidden text-[#20251d] bg-[#d1fae5] border border-[#a7f3d0] transition-all hover:shadow-md hover:scale-[1.01] active:scale-[0.99] group cursor-pointer"
                  >
                    <span className="w-20 h-24 sm:w-24 sm:h-28 shrink-0 rounded-2xl bg-white/70 backdrop-blur-xs flex items-center justify-center text-5xl group-hover:scale-105 transition-transform shadow-xs" aria-hidden="true">
                      🦟
                    </span>
                    <span className="flex flex-col items-start min-w-0 flex-1">
                      <b className="text-lg sm:text-xl font-extrabold tracking-tight text-[#065f46]">
                        Mosquitos & Vetores
                      </b>
                      <small className="text-xs sm:text-sm leading-snug text-[#047857] my-1 font-medium">
                        Aedes aegypti, pernilongos e prevenção da Dengue
                      </small>
                      <span className="text-xs font-extrabold text-[#065f46] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Explorar vetores ↗
                      </span>
                    </span>
                  </button>

                  {/* Category Card 6: Ferrões & Ninhos */}
                  <button
                    onClick={() => {
                      setActiveCategory('Todos');
                      setOnlyPeconhentos(false);
                      setSearchQuery('abelha');
                      navigateTo('guia');
                    }}
                    className="w-full min-h-[140px] rounded-3xl p-4 sm:p-5 flex items-center text-left gap-3.5 sm:gap-4 overflow-hidden text-[#20251d] bg-[#e0f2fe] border border-[#bae6fd] transition-all hover:shadow-md hover:scale-[1.01] active:scale-[0.99] group cursor-pointer"
                  >
                    <span className="w-20 h-24 sm:w-24 sm:h-28 shrink-0 rounded-2xl bg-white/70 backdrop-blur-xs flex items-center justify-center text-5xl group-hover:scale-105 transition-transform shadow-xs" aria-hidden="true">
                      🐝
                    </span>
                    <span className="flex flex-col items-start min-w-0 flex-1">
                      <b className="text-lg sm:text-xl font-extrabold tracking-tight text-[#0369a1]">
                        Animais com Ferrão
                      </b>
                      <small className="text-xs sm:text-sm leading-snug text-[#0284c7] my-1 font-medium">
                        Abelhas, vespas e cuidados com choque alérgico
                      </small>
                      <span className="text-xs font-extrabold text-[#0369a1] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Explorar ferroadas ↗
                      </span>
                    </span>
                  </button>

                  {/* Category Card 7: Lagartas Urticantes */}
                  <button
                    onClick={() => {
                      setActiveCategory('Todos');
                      setOnlyPeconhentos(false);
                      setSearchQuery('taturana');
                      navigateTo('guia');
                    }}
                    className="w-full min-h-[140px] rounded-3xl p-4 sm:p-5 flex items-center text-left gap-3.5 sm:gap-4 overflow-hidden text-[#20251d] bg-[#d9f99d] border border-[#bef264] transition-all hover:shadow-md hover:scale-[1.01] active:scale-[0.99] group cursor-pointer"
                  >
                    <span className="w-20 h-24 sm:w-24 sm:h-28 shrink-0 rounded-2xl bg-white/70 backdrop-blur-xs flex items-center justify-center text-5xl group-hover:scale-105 transition-transform shadow-xs" aria-hidden="true">
                      🌿
                    </span>
                    <span className="flex flex-col items-start min-w-0 flex-1">
                      <b className="text-lg sm:text-xl font-extrabold tracking-tight text-[#365314]">
                        Lagartas & Taturanas
                      </b>
                      <small className="text-xs sm:text-sm leading-snug text-[#3f6212] my-1 font-medium">
                        Lonomia em árvores, cerdas urticantes e queimaduras
                      </small>
                      <span className="text-xs font-extrabold text-[#365314] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Explorar lagartas ↗
                      </span>
                    </span>
                  </button>

                  {/* Category Card 8: Outros Animais & Parasitas */}
                  <button
                    onClick={() => {
                      setActiveCategory('Outros');
                      setOnlyPeconhentos(false);
                      setSearchQuery('');
                      navigateTo('guia');
                    }}
                    className="w-full min-h-[140px] rounded-3xl p-4 sm:p-5 flex items-center text-left gap-3.5 sm:gap-4 overflow-hidden text-[#20251d] bg-[#dfead2] border border-[#d2dfc4] transition-all hover:shadow-md hover:scale-[1.01] active:scale-[0.99] group cursor-pointer"
                  >
                    <span className="w-20 h-24 sm:w-24 sm:h-28 shrink-0 rounded-2xl bg-white/70 backdrop-blur-xs flex items-center justify-center text-5xl group-hover:scale-105 transition-transform shadow-xs" aria-hidden="true">
                      🍃
                    </span>
                    <span className="flex flex-col items-start min-w-0 flex-1">
                      <b className="text-lg sm:text-xl font-extrabold tracking-tight text-[#20251d]">
                        Outros Animais & Parasitas
                      </b>
                      <small className="text-xs sm:text-sm leading-snug text-[#4e5945] my-1 font-medium">
                        Carrapatos, fauna do solo, quintal e prevenção domiciliar
                      </small>
                      <span className="text-xs font-extrabold text-[#315321] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Explorar outros ↗
                      </span>
                    </span>
                  </button>

                  {/* Category Card 9: Besouros & Queimaduras de Contato (Potó) */}
                  <button
                    onClick={() => {
                      setActiveCategory('Todos');
                      setOnlyPeconhentos(false);
                      setSearchQuery('potó');
                      navigateTo('guia');
                    }}
                    className="w-full min-h-[140px] rounded-3xl p-4 sm:p-5 flex items-center text-left gap-3.5 sm:gap-4 overflow-hidden text-[#20251d] bg-[#ffedd5] border border-[#fed7aa] transition-all hover:shadow-md hover:scale-[1.01] active:scale-[0.99] group cursor-pointer"
                  >
                    <span className="w-20 h-24 sm:w-24 sm:h-28 shrink-0 rounded-2xl bg-white/70 backdrop-blur-xs flex items-center justify-center text-5xl group-hover:scale-105 transition-transform shadow-xs" aria-hidden="true">
                      🪲
                    </span>
                    <span className="flex flex-col items-start min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <b className="text-lg sm:text-xl font-extrabold tracking-tight text-[#9a3412]">
                          Besouros & Contato
                        </b>
                        <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                          Potó
                        </span>
                      </div>
                      <small className="text-xs sm:text-sm leading-snug text-[#7c2d12] my-1 font-medium">
                        Potó (Paederus), secreções cáusticas na pele e luz branca
                      </small>
                      <span className="text-xs font-extrabold text-[#c2410c] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Explorar besouros cáusticos ↗
                      </span>
                    </span>
                  </button>

                  {/* Category Card 10: Formigas & Mordidas em Crianças */}
                  <button
                    onClick={() => {
                      setActiveCategory('Todos');
                      setOnlyPeconhentos(false);
                      setSearchQuery('formiga');
                      navigateTo('guia');
                    }}
                    className="w-full min-h-[140px] rounded-3xl p-4 sm:p-5 flex items-center text-left gap-3.5 sm:gap-4 overflow-hidden text-[#20251d] bg-[#fee2e2] border border-[#fecaca] transition-all hover:shadow-md hover:scale-[1.01] active:scale-[0.99] group cursor-pointer"
                  >
                    <span className="w-20 h-24 sm:w-24 sm:h-28 shrink-0 rounded-2xl bg-white/70 backdrop-blur-xs flex items-center justify-center text-5xl group-hover:scale-105 transition-transform shadow-xs" aria-hidden="true">
                      🐜
                    </span>
                    <span className="flex flex-col items-start min-w-0 flex-1">
                      <b className="text-lg sm:text-xl font-extrabold tracking-tight text-[#991b1b]">
                        Formigas & Ferroadas
                      </b>
                      <small className="text-xs sm:text-sm leading-snug text-[#b91c1c] my-1 font-medium">
                        Formiga-de-fogo, lava-pés em gramados e pústulas em bebês
                      </small>
                      <span className="text-xs font-extrabold text-[#991b1b] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Explorar formigas ↗
                      </span>
                    </span>
                  </button>

                  {/* Category Card 11: Carrapatos & Febre Maculosa */}
                  <button
                    onClick={() => {
                      setActiveCategory('Todos');
                      setOnlyPeconhentos(false);
                      setSearchQuery('carrapato');
                      navigateTo('guia');
                    }}
                    className="w-full min-h-[140px] rounded-3xl p-4 sm:p-5 flex items-center text-left gap-3.5 sm:gap-4 overflow-hidden text-[#20251d] bg-[#fef3c7] border border-[#fde68a] transition-all hover:shadow-md hover:scale-[1.01] active:scale-[0.99] group cursor-pointer"
                  >
                    <span className="w-20 h-24 sm:w-24 sm:h-28 shrink-0 rounded-2xl bg-white/70 backdrop-blur-xs flex items-center justify-center text-5xl group-hover:scale-105 transition-transform shadow-xs" aria-hidden="true">
                      🪳
                    </span>
                    <span className="flex flex-col items-start min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <b className="text-lg sm:text-xl font-extrabold tracking-tight text-[#92400e]">
                          Carrapatos & Pastos
                        </b>
                        <span className="text-[10px] bg-amber-200 text-amber-950 font-bold px-2 py-0.5 rounded-full">
                          Maculosa
                        </span>
                      </div>
                      <small className="text-xs sm:text-sm leading-snug text-[#78350f] my-1 font-medium">
                        Carrapato-estrela em gramados, capivaras e parques
                      </small>
                      <span className="text-xs font-extrabold text-[#92400e] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Explorar carrapatos ↗
                      </span>
                    </span>
                  </button>
                </div>
              </div>

              {/* Footer Note */}
              <p className="text-[11px] text-[#838a7a] text-center leading-relaxed pt-2">
                A ocorrência varia conforme o local e as condições ambientais.
              </p>
            </div>
          )}

          {/* SCREEN: GUIA (BIBLIOTECA EDUCATIVA - 99 ESPÉCIES) */}
          {currentScreen === 'guia' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#537d37]">
                    Biblioteca Educativa
                  </span>
                  <span className="text-[10px] bg-[#dfff55] text-[#20251d] font-black px-2 py-0.5 rounded-full shadow-xs">
                    99 Espécies
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#20251d] tracking-tight">
                  Guia de Animais & Insetos 🐾
                </h1>
                <p className="text-xs text-[#73796d] leading-relaxed">
                  Catálogo completo com 99 espécies brasileiras de importância médica e urbana. Identificação morfológica, risco e primeiros socorros.
                </p>
              </div>

              {/* Search input with live clear */}
              <div className="relative">
                <div className="flex items-center gap-2.5 bg-white border border-[#e8ecdf] focus-within:border-[#537d37] rounded-2xl px-4 py-3 shadow-xs transition-colors">
                  <Search className="w-4 h-4 text-[#73796d] shrink-0" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Buscar espécie por nome popular, científico ou sintomas..."
                    className="w-full bg-transparent text-sm text-[#20251d] placeholder:text-[#9ea498] outline-none"
                    aria-label="Buscar espécie no guia"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="p-1 rounded-full text-[#73796d] hover:text-[#20251d] cursor-pointer"
                      aria-label="Limpar busca"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Filter Section: Groups & Risks */}
              <div className="space-y-2.5">
                {/* Horizontal Biological Groups */}
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
                  {groupsList.map(grp => (
                    <button
                      key={grp.value}
                      onClick={() => setActiveCategory(grp.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        activeCategory === grp.value
                          ? 'bg-[#315321] text-white shadow-xs'
                          : 'bg-white border border-[#dfe5d5] text-[#56604e] hover:bg-[#f1f6ea]'
                      }`}
                    >
                      {grp.label}
                    </button>
                  ))}
                </div>

                {/* Risk Level Filter Chips */}
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar items-center text-xs">
                  <span className="text-[11px] font-bold text-[#73796d] mr-1 shrink-0">Risco:</span>
                  {[
                    { label: 'Todos os riscos', val: 'Todos' },
                    { label: '🔴 Alto', val: 'alto' },
                    { label: '🟠 Médio-Alto', val: 'medio-alto' },
                    { label: '🟡 Médio', val: 'medio' },
                    { label: '🟢 Baixo', val: 'baixo' }
                  ].map(r => (
                    <button
                      key={r.val}
                      onClick={() => setActiveRiskFilter(r.val)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                        activeRiskFilter === r.val
                          ? 'bg-[#20251d] text-white'
                          : 'bg-white border border-[#e8ecdf] text-[#60695a] hover:bg-[#edf2e6]'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>

                {/* Quick Toggles & Active Results Count */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                  <span className="text-[#73796d] font-semibold text-[11px]">
                    Exibindo <strong className="text-[#20251d] font-black">{filteredAnimals.length}</strong> de <strong className="text-[#20251d]">99</strong> espécies catalogadas
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setOnlyPeconhentos(prev => !prev)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer ${
                        onlyPeconhentos
                          ? 'bg-red-50 text-red-700 border-red-300'
                          : 'bg-white text-[#636c5c] border-[#e8ecdf]'
                      }`}
                    >
                      <span>⚠️ Peçonhentos</span>
                    </button>

                    <button
                      onClick={() => setOnlyVerifiedSources(prev => !prev)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer ${
                        onlyVerifiedSources
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-white text-[#636c5c] border-[#e8ecdf]'
                      }`}
                    >
                      <span>🏛️ Fonte Oficial</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 99 Animals Cards List */}
              <div className="space-y-3">
                {filteredAnimals.length === 0 ? (
                  <div className="bg-white rounded-3xl p-8 border border-[#e8ecdf] text-center space-y-3 shadow-xs">
                    <div className="text-4xl">🔍</div>
                    <strong className="block text-sm text-[#20251d]">Nenhuma espécie encontrada</strong>
                    <p className="text-xs text-[#73796d] max-w-xs mx-auto">
                      Tente pesquisar por outro termo ou limpe os filtros para visualizar todas as 99 espécies.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setActiveCategory('Todos');
                        setActiveRiskFilter('Todos');
                        setOnlyPeconhentos(false);
                        setOnlyVerifiedSources(false);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#315321] text-white text-xs font-bold cursor-pointer"
                    >
                      Ver todas as 99 espécies
                    </button>
                  </div>
                ) : (
                  filteredAnimals.map(animal => {
                    const isSaved = savedIds.has(animal.id);
                    const catItem = animal.catalogId ? catalogMap.get(animal.catalogId) : null;
                    const risco = catItem?.risco || (animal.isPeconhento ? 'alto' : 'baixo');

                    // Badge formatting for risk
                    let riskBadgeStyle = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                    let riskLabel = 'Baixo Risco';
                    if (risco === 'alto') {
                      riskBadgeStyle = 'bg-red-50 text-red-700 border-red-200 font-extrabold';
                      riskLabel = 'Alto Risco · Peçonhento';
                    } else if (risco === 'medio-alto') {
                      riskBadgeStyle = 'bg-orange-50 text-orange-800 border-orange-200 font-bold';
                      riskLabel = 'Médio-Alto Risco';
                    } else if (risco === 'medio') {
                      riskBadgeStyle = 'bg-amber-50 text-amber-800 border-amber-200 font-bold';
                      riskLabel = 'Médio Risco';
                    } else if (risco === 'baixo-medio') {
                      riskBadgeStyle = 'bg-lime-50 text-lime-800 border-lime-200 font-medium';
                      riskLabel = 'Baixo-Médio Risco';
                    }

                    return (
                      <div
                        key={animal.id}
                        className="p-3.5 sm:p-4 bg-white rounded-2xl border border-[#e8ecdf] hover:border-[#b8c9a5] hover:shadow-md transition-all flex items-start sm:items-center gap-3.5 group cursor-pointer"
                        onClick={() => openAnimalDetail(animal.id)}
                      >
                        {/* Avatar & ID */}
                        <div className="relative shrink-0">
                          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#edf4df] flex items-center justify-center text-3xl sm:text-4xl group-hover:scale-105 transition-transform">
                            {animal.emoji}
                          </div>
                          {animal.catalogId && (
                            <span className="absolute -bottom-1 -right-1 text-[9px] font-black px-1.5 py-0.5 rounded-md bg-[#20251d] text-[#dfff55]">
                              #{String(animal.catalogId).padStart(2, '0')}
                            </span>
                          )}
                        </div>

                        {/* Card Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h3 className="text-sm sm:text-base font-extrabold text-[#20251d] truncate group-hover:text-[#315321] transition-colors">
                                {animal.name}
                              </h3>
                              <p className="text-[11px] text-[#73796d] italic truncate">
                                {animal.scientific}
                              </p>
                            </div>

                            {/* Bookmark Heart Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSave(animal.id);
                              }}
                              className="p-1.5 rounded-lg text-[#8b9481] hover:text-rose-600 transition-colors shrink-0 cursor-pointer"
                              title={isSaved ? 'Remover dos salvos' : 'Salvar'}
                              aria-label={isSaved ? 'Remover dos salvos' : 'Salvar'}
                            >
                              <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                            </button>
                          </div>

                          {/* Summary Snippet */}
                          <p className="text-xs text-[#52594a] line-clamp-2 mt-1 leading-snug">
                            {animal.summary}
                          </p>

                          {/* Badges Row */}
                          <div className="flex flex-wrap items-center gap-1.5 mt-2">
                            {/* Group Badge */}
                            {catItem?.grupo && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#f0f4ea] text-[#315321]">
                                {catItem.grupo}
                              </span>
                            )}

                            {/* Risk Badge */}
                            <span className={`text-[10px] px-2 py-0.5 rounded-md border ${riskBadgeStyle}`}>
                              {riskLabel}
                            </span>

                            {/* Official Source Badge */}
                            {catItem?.fonte && (
                              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-700 hidden sm:inline truncate max-w-[150px]">
                                🏛️ {catItem.fonte}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Arrow */}
                        <ChevronRight className="w-5 h-5 text-[#8b9481] group-hover:translate-x-1 transition-transform shrink-0 self-center hidden xs:block" />
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* SCREEN: ORIENTACOES (CARE & FIRST AID) */}
          {currentScreen === 'orientacoes' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#537d37]">
                  Informação Prática
                </span>
                <h1 className="text-2xl font-extrabold text-[#20251d] tracking-tight">
                  Como Agir com Calma 🩹
                </h1>
                <p className="text-xs text-[#73796d]">
                  Diretrizes de segurança para pais e cuidadores. Em acidentes, manter a tranquilidade protege a criança.
                </p>
              </div>

              {/* Red Alert Banner */}
              <div className="p-4 bg-[#fff1f1] rounded-2xl border border-[#fed7d7] flex gap-3 text-xs text-rose-950">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="block text-sm font-bold text-rose-900">
                    Sinais de Emergência Imediata (SAMU 192):
                  </strong>
                  <p>
                    Dificuldade para respirar, inchaço rápido na boca ou olhos, salivação intensa, vômitos repetidos, suor frio ou desmaio. Nesses casos, ligue 192 ou vá imediatamente ao hospital.
                  </p>
                </div>
              </div>

              {/* Passo a Passo: Se encontrar um animal */}
              <div className="bg-white rounded-3xl p-5 border border-[#e8ecdf] space-y-4 shadow-xs">
                <h2 className="text-base font-extrabold text-[#20251d] flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-[#edf4df] text-[#315321] flex items-center justify-center text-xs font-bold">1</span>
                  Se encontrar um animal suspeito
                </h2>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-[#f8faf4] rounded-xl border border-[#edf1e6] flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#dfff55] text-[#315321] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">A</span>
                    <div>
                      <strong className="block text-[#20251d] font-bold">Mantenha distância imediata:</strong>
                      Não toque, não esmague e nunca tente capturar o animal com as mãos desprotegidas.
                    </div>
                  </div>

                  <div className="p-3 bg-[#f8faf4] rounded-xl border border-[#edf1e6] flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#dfff55] text-[#315321] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">B</span>
                    <div>
                      <strong className="block text-[#20251d] font-bold">Afaste a criança com calma:</strong>
                      Explique à criança que ela deve se afastar sem gritar ou fazer movimentos bruscos.
                    </div>
                  </div>

                  <div className="p-3 bg-[#f8faf4] rounded-xl border border-[#edf1e6] flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#dfff55] text-[#315321] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">C</span>
                    <div>
                      <strong className="block text-[#20251d] font-bold">Registre com foto (se for seguro):</strong>
                      Fotografar com o celular à distância segura ajuda muito os médicos a identificarem a espécie exata no hospital.
                    </div>
                  </div>
                </div>
              </div>

              {/* Passo a Passo: Se houver picada */}
              <div className="bg-white rounded-3xl p-5 border border-[#e8ecdf] space-y-4 shadow-xs">
                <h2 className="text-base font-extrabold text-[#20251d] flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-[#edf4df] text-[#315321] flex items-center justify-center text-xs font-bold">2</span>
                  Se houver picada ou ferroada
                </h2>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-[#f8faf4] rounded-xl border border-[#edf1e6] flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#537d37] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[#20251d] font-bold">Lave o local suavemente:</strong>
                      Use apenas água corrente e sabão neutro para evitar infecções bacterianas secundárias.
                    </div>
                  </div>

                  <div className="p-3 bg-[#f8faf4] rounded-xl border border-[#edf1e6] flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#537d37] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[#20251d] font-bold">Mantenha a criança calma e hidratada:</strong>
                      O pânico acelera os batimentos e a circulação sanguínea. Acalme a criança no colo.
                    </div>
                  </div>

                  <div className="p-3 bg-[#f8faf4] rounded-xl border border-[#edf1e6] flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#537d37] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[#20251d] font-bold">Procure assistência médica imediata:</strong>
                      Especialmente em bebês e crianças pequenas, ou se o animal for escorpião, aranha ou lagarta.
                    </div>
                  </div>
                </div>
              </div>

              {/* O que NUNCA fazer (receitas caseiras e mitos perigosos) */}
              <div className="bg-[#fff5f5] rounded-3xl p-5 border border-[#fed7d7] space-y-3 shadow-xs">
                <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                  <span className="text-lg">🚫</span>
                  <h2>Evite receitas caseiras e mitos perigosos</h2>
                </div>
                <p className="text-xs text-rose-950 leading-relaxed">
                  Nunca amarre torniquete, não corte ou fure a pele, não tente chupar o veneno e nunca aplique borra de café, querosene, álcool ou esterco. Essas práticas aumentam o risco de infecções graves e necrose tecidual.
                </p>
                <div className="pt-1">
                  <button
                    onClick={() => navigateTo('mitos')}
                    className="text-xs font-bold text-rose-700 hover:text-rose-900 underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Ver guia de mitos e verdades comprovados →</span>
                  </button>
                </div>
              </div>

              {/* Emergência e Hospitais Próximos */}
              <div className="bg-white rounded-3xl p-5 border border-[#e8ecdf] space-y-3.5 shadow-xs">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#ea580c]">
                    Canais de Atendimento
                  </span>
                  <h2 className="text-base font-extrabold text-[#20251d]">
                    Onde buscar ajuda em emergências
                  </h2>
                  <p className="text-xs text-[#73796d]">
                    Em sinais graves ou piora rápida, acione o serviço de emergência ou desloque-se ao hospital mais próximo. Não espere a identificação do animal.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <button
                    onClick={() => navigateTo('mapa')}
                    className="p-3.5 rounded-2xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-extrabold flex items-center justify-between transition-colors shadow-xs cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <span>🚨</span>
                      <span>Encontrar Hospital no Mapa</span>
                    </span>
                    <span>→</span>
                  </button>

                  <button
                    onClick={() => setIsEmergencyModalOpen(true)}
                    className="p-3.5 rounded-2xl bg-[#315321] hover:bg-[#253f19] text-white text-xs font-extrabold flex items-center justify-between transition-colors shadow-xs cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <PhoneCall className="w-4 h-4" />
                      <span>SAMU 192 & CIATox</span>
                    </span>
                    <span>Ligar</span>
                  </button>
                </div>
              </div>

              {/* Fontes institucionais para consultar */}
              <div className="bg-white rounded-3xl p-5 border border-[#e8ecdf] space-y-2.5 shadow-xs">
                <h3 className="text-sm font-extrabold text-[#20251d]">Fontes institucionais para consultar</h3>
                <div className="space-y-1.5 text-xs">
                  <div>
                    <a className="text-[#315321] font-bold hover:underline inline-flex items-center gap-1" href="https://www.gov.br/saude/" target="_blank" rel="noopener noreferrer">
                      <span>Ministério da Saúde</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div>
                    <a className="text-[#315321] font-bold hover:underline inline-flex items-center gap-1" href="https://portal.fiocruz.br/" target="_blank" rel="noopener noreferrer">
                      <span>Fiocruz</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div>
                    <a className="text-[#315321] font-bold hover:underline inline-flex items-center gap-1" href="https://bvsms.saude.gov.br/" target="_blank" rel="noopener noreferrer">
                      <span>Biblioteca Virtual em Saúde</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Footer Note */}
              <p className="text-[11px] text-[#838a7a] text-center leading-relaxed pt-1">
                Esta tela não substitui avaliação médica nem protocolo clínico presencial.
              </p>
            </div>
          )}

          {/* SCREEN: SALVOS (BOOKMARKS) */}
          {currentScreen === 'salvos' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="space-y-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#537d37]">
                  Sua Biblioteca Pessoal
                </span>
                <h1 className="text-2xl font-extrabold text-[#20251d] tracking-tight">
                  Meus Salvos ♡
                </h1>
                <p className="text-xs text-[#73796d]">
                  Fichas guardadas para consulta rápida sem precisar pesquisar novamente.
                </p>
              </div>

              {savedAnimalsList.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 border border-[#e8ecdf] text-center space-y-3">
                  <div className="text-4xl">🌿</div>
                  <strong className="block text-sm text-[#20251d]">Nenhuma ficha salva ainda</strong>
                  <p className="text-xs text-[#73796d] max-w-xs mx-auto">
                    Abra qualquer animal no guia e toque no ícone de coração para mantê-lo salvo aqui.
                  </p>
                  <button
                    onClick={() => navigateTo('guia')}
                    className="px-5 py-2.5 rounded-xl bg-[#315321] text-white text-xs font-bold hover:bg-[#243d18] transition-colors"
                  >
                    Explorar o guia
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedAnimalsList.map(animal => (
                    <div
                      key={animal.id}
                      className="p-4 bg-white rounded-2xl border border-[#e8ecdf] hover:border-[#ccd7be] transition-all flex items-center gap-3.5 group shadow-xs cursor-pointer"
                      onClick={() => openAnimalDetail(animal.id)}
                    >
                      <div className="w-14 h-14 rounded-2xl bg-[#edf4df] flex items-center justify-center text-3xl shrink-0 group-hover:scale-105 transition-transform">
                        {animal.emoji}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <strong className="text-sm font-bold text-[#20251d] truncate">
                            {animal.name}
                          </strong>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSave(animal.id);
                            }}
                            className="p-1 text-rose-500 hover:text-rose-700"
                            aria-label="Remover dos salvos"
                          >
                            <Heart className="w-4 h-4 fill-rose-500" />
                          </button>
                        </div>
                        <p className="text-xs text-[#73796d] truncate mt-0.5">
                          {animal.summary}
                        </p>
                        <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#edf4df] text-[#315321] mt-1.5">
                          {animal.category}
                        </span>
                      </div>

                      <ChevronRight className="w-5 h-5 text-[#8b9481] group-hover:translate-x-1 transition-transform shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SCREEN: PERFIL */}
          {currentScreen === 'perfil' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="space-y-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#537d37]">
                  Seu Espaço
                </span>
                <h1 className="text-2xl font-extrabold text-[#20251d] tracking-tight">
                  Perfil da Família 🌱
                </h1>
                <p className="text-xs text-[#73796d]">
                  Preferências, dados e informações sobre o aplicativo.
                </p>
              </div>

              {/* Profile Card */}
              <div className="p-4 bg-white rounded-3xl border border-[#e8ecdf] flex items-center gap-3.5 shadow-xs">
                <div className="w-14 h-14 rounded-2xl bg-[#dfff55] flex items-center justify-center text-2xl font-bold text-[#315321]">
                  🌱
                </div>
                <div>
                  <strong className="block text-base font-bold text-[#20251d]">Família Protege Kids</strong>
                  <span className="text-xs text-[#73796d]">Modo Visitante · Dados salvos no dispositivo</span>
                </div>
              </div>

              {/* Sobre Card */}
              <div className="p-5 bg-white rounded-3xl border border-[#e8ecdf] space-y-2 shadow-xs">
                <h2 className="text-sm font-bold text-[#20251d]">Sobre a Iniciativa Protege Kids</h2>
                <p className="text-xs text-[#52594a] leading-relaxed">
                  Uma experiência educativa desenvolvida para ajudar famílias com bebês e crianças a conhecerem a fauna urbana e silvestre, prevenirem acidentes domésticos e encontrarem fontes e contatos oficiais de saúde pública de forma simples e acolhedora.
                </p>
              </div>

              {/* Quick links */}
              <div className="space-y-2.5">
                <button
                  onClick={() => navigateTo('orientacoes')}
                  className="w-full p-4 bg-white rounded-2xl border border-[#e8ecdf] hover:border-[#ccd7be] text-left transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#edf4df] text-[#315321] flex items-center justify-center text-lg">
                      🩹
                    </div>
                    <div>
                      <strong className="block text-sm font-bold text-[#20251d]">Orientações Gerais</strong>
                      <span className="text-xs text-[#73796d]">O que fazer e condutas seguras</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8b9481] group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => navigateTo('fontes')}
                  className="w-full p-4 bg-white rounded-2xl border border-[#e8ecdf] hover:border-[#ccd7be] text-left transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#edf4df] text-[#315321] flex items-center justify-center text-lg">
                      📚
                    </div>
                    <div>
                      <strong className="block text-sm font-bold text-[#20251d]">Fontes Confiáveis</strong>
                      <span className="text-xs text-[#73796d]">Ministério da Saúde, Fiocruz e CIATox</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8b9481] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Privacy and Local Storage Note */}
              <div className="p-4 bg-[#f8faf4] rounded-2xl border border-[#e8ecdf] text-[11px] text-[#73796d] leading-relaxed">
                🔒 <strong>Privacidade Garantida:</strong> Este aplicativo não coleta dados pessoais, não possui rastreadores e não envia dados para servidores externos. Suas preferências de checklist e salvos permanecem estritamente no seu navegador.
              </div>
            </div>
          )}

          {/* SCREEN: FONTES (INSTITUTIONAL SOURCES) */}
          {currentScreen === 'fontes' && (
            <SourcesView 
              onBack={() => navigateTo('perfil')} 
              onOpenEmergency={() => setIsEmergencyModalOpen(true)}
            />
          )}

          {/* SCREEN: MITOS E VERDADES (DEDICATED PAGE) */}
          {currentScreen === 'mitos' && (
            <MythsView 
              onBack={() => navigateTo('inicio')} 
            />
          )}

          {/* SCREEN: AMBIENTE SEGURO / CHECKLIST (DEDICATED PAGE) */}
          {currentScreen === 'checklist' && (
            <SafeHomeView 
              onBack={() => navigateTo('inicio')} 
            />
          )}

          {/* SCREEN: REGIONAL (DEDICATED PAGE) */}
          {currentScreen === 'regional' && (
            <RegionalView 
              onBack={() => navigateTo('inicio')} 
            />
          )}

          {/* SCREEN: MAPA DE SEGURANÇA (HOSPITAIS & CIATOX) */}
          {currentScreen === 'mapa' && (
            <SecurityMapView 
              onBack={() => navigateTo('inicio')} 
              onOpenPremiumModal={() => setIsPremiumModalOpen(true)}
              isPremiumUser={isPremiumUser}
            />
          )}

          {/* SCREEN: DETALHE (ANIMAL DETAIL SHEET) */}
          {currentScreen === 'detalhe' && selectedAnimal && (
            <AnimalDetail
              animal={selectedAnimal}
              isSaved={savedIds.has(selectedAnimal.id)}
              onToggleSave={toggleSave}
              onBack={() => navigateTo(previousScreen === 'detalhe' ? 'guia' : previousScreen)}
              onOpenEmergency={() => setIsEmergencyModalOpen(true)}
            />
          )}
        </main>

        {/* Fixed Ergonomic Bottom Navigation Bar */}
        {/* Fixed Ergonomic Bottom Navigation Bar */}
        <nav 
          className={`fixed bottom-0 left-0 right-0 z-40 ${
            currentScreen === 'mapa' 
              ? 'bg-[#0b100c]/95 border-t border-[#1e2c21] text-white shadow-2xl' 
              : 'bg-white/95 border-t border-[#e8ecdf]'
          } backdrop-blur-md pb-[max(12px,env(safe-area-inset-bottom))]`}
          aria-label="Navegação Principal"
        >
          <div className="max-w-xl mx-auto px-2 pt-2 grid grid-cols-5 items-center gap-0.5">
            {/* Tab: Início */}
            <button
              onClick={() => navigateTo('inicio')}
              className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-2xl transition-all cursor-pointer ${
                currentScreen === 'inicio'
                  ? 'text-[#315321] font-extrabold'
                  : (currentScreen === 'mapa' ? 'text-[#8e9c89] hover:text-white font-semibold' : 'text-[#8b9284] hover:text-[#20251d] font-semibold')
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${currentScreen === 'inicio' ? 'bg-[#dfff55] text-[#121a13]' : ''}`}>
                <Home className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight truncate">Início</span>
            </button>

            {/* Tab: Explorar (ANTES DO GUIA) */}
            <button
              onClick={() => navigateTo('explorar')}
              className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-2xl transition-all cursor-pointer ${
                currentScreen === 'explorar'
                  ? 'text-[#315321] font-extrabold'
                  : (currentScreen === 'mapa' ? 'text-[#8e9c89] hover:text-white font-semibold' : 'text-[#8b9284] hover:text-[#20251d] font-semibold')
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${currentScreen === 'explorar' ? 'bg-[#dfff55] text-[#121a13]' : ''}`}>
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight truncate">Explorar</span>
            </button>

            {/* Tab: Guia */}
            <button
              onClick={() => navigateTo('guia')}
              className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-2xl transition-all cursor-pointer ${
                currentScreen === 'guia' || (currentScreen === 'detalhe' && previousScreen === 'guia')
                  ? 'text-[#315321] font-extrabold'
                  : (currentScreen === 'mapa' ? 'text-[#8e9c89] hover:text-white font-semibold' : 'text-[#8b9284] hover:text-[#20251d] font-semibold')
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${(currentScreen === 'guia' || (currentScreen === 'detalhe' && previousScreen === 'guia')) ? 'bg-[#dfff55] text-[#121a13]' : ''}`}>
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight truncate">Guia</span>
            </button>

            {/* Tab: Como agir */}
            <button
              onClick={() => navigateTo('orientacoes')}
              className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-2xl transition-all cursor-pointer ${
                currentScreen === 'orientacoes'
                  ? 'text-[#315321] font-extrabold'
                  : (currentScreen === 'mapa' ? 'text-[#8e9c89] hover:text-white font-semibold' : 'text-[#8b9284] hover:text-[#20251d] font-semibold')
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${currentScreen === 'orientacoes' ? 'bg-[#dfff55] text-[#121a13]' : ''}`}>
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight truncate">Como agir</span>
            </button>

            {/* Tab: Salvos */}
            <button
              onClick={() => navigateTo('salvos')}
              className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-2xl transition-all relative cursor-pointer ${
                currentScreen === 'salvos'
                  ? 'text-[#315321] font-extrabold'
                  : (currentScreen === 'mapa' ? 'text-[#8e9c89] hover:text-white font-semibold' : 'text-[#8b9284] hover:text-[#20251d] font-semibold')
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${currentScreen === 'salvos' ? 'bg-[#dfff55] text-[#121a13]' : ''}`}>
                <Heart className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight truncate">Salvos</span>
              {savedIds.size > 0 && (
                <span className="absolute top-1 right-2 sm:right-3 w-4 h-4 bg-[#537d37] text-white rounded-full text-[9px] font-extrabold flex items-center justify-center">
                  {savedIds.size}
                </span>
              )}
            </button>
          </div>
        </nav>

        {/* Emergency Triage Modal */}
        <EmergencyModal
          isOpen={isEmergencyModalOpen}
          onClose={() => setIsEmergencyModalOpen(false)}
        />

        {/* Premium Plan Modal */}
        <PremiumModal
          isOpen={isPremiumModalOpen}
          onClose={() => setIsPremiumModalOpen(false)}
          isPremiumUser={isPremiumUser}
          onTogglePremium={togglePremiumUser}
        />
      </div>
    </div>
  );
}
