import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ArrowLeft, Search, Navigation, Phone, MapPin, 
  List, Map as MapIcon, ShieldAlert, CheckCircle2, 
  ExternalLink, Sparkles, Filter, X, Heart, Clock,
  AlertTriangle, Crown, Share2, Compass
} from 'lucide-react';
import L from 'leaflet';
import { HEALTH_UNITS, HealthUnit, calculateDistanceKm } from '../data/hospitals';

interface SecurityMapViewProps {
  onBack: () => void;
  onOpenPremiumModal: () => void;
  isPremiumUser: boolean;
}

export const SecurityMapView: React.FC<SecurityMapViewProps> = ({
  onBack,
  onOpenPremiumModal,
  isPremiumUser
}) => {
  // User location state (default to Campinas/SP as reference pilot or Brasília)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; label: string }>({
    lat: -22.9056,
    lng: -47.0608,
    label: 'Campinas, SP (Localização de Referência)'
  });
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // View mode: 'map' or 'list'
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<'todos' | 'hospitais' | 'ciatox' | 'soro'>('todos');

  // Selected Unit for bottom card drawer and Detail Modal
  const [selectedUnit, setSelectedUnit] = useState<HealthUnit | null>(HEALTH_UNITS[0]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

  // Saved units (Premium perk)
  const [savedUnitIds, setSavedUnitIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem('pk-saved-units');
      return stored ? new Set(JSON.parse(stored)) : new Set(['hc-unicamp-campinas']);
    } catch {
      return new Set(['hc-unicamp-campinas']);
    }
  });

  // Leaflet map instance ref
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Sync saved units
  useEffect(() => {
    try {
      localStorage.setItem('pk-saved-units', JSON.stringify([...savedUnitIds]));
    } catch (e) {
      console.error(e);
    }
  }, [savedUnitIds]);

  const toggleSaveUnit = (id: string) => {
    if (!isPremiumUser) {
      onOpenPremiumModal();
      return;
    }
    setSavedUnitIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Request actual user location
  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocalização não suportada pelo seu navegador.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          label: 'Sua localização atual (GPS)'
        };
        setUserLocation(coords);
        setIsLocating(false);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([coords.lat, coords.lng], 13, { duration: 1.5 });
        }
      },
      (err) => {
        setIsLocating(false);
        setLocationError('Não foi possível obter a localização exata. Mantendo ponto padrão.');
        console.warn('Geolocation error:', err.message);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Preset location quick switch
  const handleSelectCity = (city: string, lat: number, lng: number) => {
    const loc = { lat, lng, label: city };
    setUserLocation(loc);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], 12, { duration: 1.2 });
    }
  };

  // Filtered & sorted units
  const filteredUnits = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return HEALTH_UNITS.filter(unit => {
      // Type filter
      if (activeFilter === 'hospitais' && unit.tipo !== 'hospital_referencia') return false;
      if (activeFilter === 'ciatox' && unit.tipo !== 'ciatox') return false;
      if (activeFilter === 'soro' && !unit.tem_soro_referencia) return false;

      // Text search
      if (q) {
        const matchesName = unit.nome.toLowerCase().includes(q);
        const matchesCity = unit.cidade.toLowerCase().includes(q);
        const matchesState = unit.estado.toLowerCase().includes(q);
        const matchesAddress = unit.endereco.toLowerCase().includes(q);
        const matchesIndicated = unit.atendimento_indicado.toLowerCase().includes(q);
        return matchesName || matchesCity || matchesState || matchesAddress || matchesIndicated;
      }

      return true;
    }).map(unit => ({
      ...unit,
      distanceKm: calculateDistanceKm(userLocation.lat, userLocation.lng, unit.latitude, unit.longitude)
    })).sort((a, b) => a.distanceKm - b.distanceKm);
  }, [searchQuery, activeFilter, userLocation]);

  // Initialize Leaflet Map with CartoDB Dark Matter tiles
  useEffect(() => {
    if (viewMode !== 'map' || !mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [userLocation.lat, userLocation.lng],
        zoom: 12,
        zoomControl: false
      });

      // CartoDB Dark Matter tile layer for a sleek dark aesthetic
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.invalidateSize();
    }

    // Call invalidateSize after mount and layout shifts
    const timer = setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 120);

    const resizeObserver = new ResizeObserver(() => {
      mapInstanceRef.current?.invalidateSize();
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
    };
  }, [viewMode]);

  // Update map markers with glowing dark theme pins
  useEffect(() => {
    if (viewMode !== 'map' || !mapInstanceRef.current || !markersLayerRef.current) return;

    const layer = markersLayerRef.current;
    layer.clearLayers();

    // 1. User Location Pin (Pulse glowing cyan/orange)
    const userIcon = L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div style="position:relative; display:flex; align-items:center; justify-content:center;">
          <div style="position:absolute; width:44px; height:44px; border-radius:50%; background:rgba(234, 88, 12, 0.35); animation:ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="background:#ea580c; width:34px; height:34px; border-radius:50%; border:2.5px solid #ffffff; box-shadow:0 0 16px rgba(234, 88, 12, 0.8); display:flex; align-items:center; justify-content:center; color:white; font-size:16px;">
            📍
          </div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22]
    });

    const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
      .bindTooltip(`<b>Sua posição GPS</b><br>${userLocation.label}`, { direction: 'top' });
    layer.addLayer(userMarker);

    // 2. Health Units Pins (Refined glowing badges for dark mode)
    filteredUnits.forEach(unit => {
      const isSelected = selectedUnit?.id === unit.id;
      const isCiatox = unit.tipo === 'ciatox';

      const iconEmoji = isCiatox ? '☎️' : '🏥';
      const bgColor = isCiatox ? '#16a34a' : '#2563eb';
      const glowColor = isCiatox ? 'rgba(22, 163, 74, 0.7)' : 'rgba(37, 99, 235, 0.7)';
      const borderColor = isSelected ? '#dfff55' : '#ffffff';

      const unitIcon = L.divIcon({
        className: 'custom-unit-marker',
        html: `
          <div style="background:${bgColor}; width:${isSelected ? '42px' : '34px'}; height:${isSelected ? '42px' : '34px'}; border-radius:14px; border:2.5px solid ${borderColor}; box-shadow:0 0 16px ${glowColor}; display:flex; align-items:center; justify-content:center; color:white; font-size:${isSelected ? '22px' : '16px'}; transition:all 0.2s cubic-bezier(0.4, 0, 0.2, 1); transform:${isSelected ? 'scale(1.15)' : 'scale(1)'}">
            ${iconEmoji}
          </div>
        `,
        iconSize: [42, 42],
        iconAnchor: [21, 21]
      });

      const marker = L.marker([unit.latitude, unit.longitude], { icon: unitIcon });
      marker.on('click', () => {
        setSelectedUnit(unit);
        setIsDetailModalOpen(true);
      });
      layer.addLayer(marker);
    });

  }, [filteredUnits, userLocation, selectedUnit, viewMode]);

  return (
    <div className="w-full flex-1 flex flex-col bg-[#0b100c] text-[#f1f5ee] relative h-full overflow-hidden animate-in fade-in duration-200">
      
      {/* VIEW 1: MAP VIEW - Full-page dark immersion */}
      {viewMode === 'map' && (
        <div className="relative w-full h-full flex-1 overflow-hidden bg-[#0a0f0b]">
          {/* Leaflet Canvas (Dark Matter Tile) */}
          <div ref={mapContainerRef} className="w-full h-full z-0" />

          {/* Floating Top Header & Search Bar (Dark Glassmorphism) */}
          <div className="absolute top-3 inset-x-3 sm:inset-x-6 z-[400] space-y-2 pointer-events-none">
            {/* Top Row: Back button, Title & Mode Switcher */}
            <div className="pointer-events-auto flex items-center justify-between gap-2 bg-[#121913]/90 backdrop-blur-md p-2 sm:p-2.5 rounded-2xl border border-[#233125] shadow-2xl">
              <div className="flex items-center gap-2 min-w-0">
                <button
                  onClick={onBack}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#1b261d] hover:bg-[#253628] text-[#dfff55] font-bold text-xs border border-[#2d3f30] transition-colors shadow-xs cursor-pointer active:scale-95 shrink-0"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden xs:inline">Voltar</span>
                </button>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-black text-white truncate">
                      Mapa de Atendimento SUS
                    </span>
                    <span className="text-[10px] bg-red-950/80 text-red-400 font-extrabold px-1.5 py-0.5 rounded-md border border-red-800/60 hidden sm:inline">
                      24h
                    </span>
                  </div>
                  <p className="text-[10px] text-[#8e9c89] truncate">
                    {userLocation.label}
                  </p>
                </div>
              </div>

              {/* View Switcher: Mapa | Lista */}
              <div className="p-0.5 bg-[#1b261d] rounded-xl flex text-xs font-bold shrink-0 border border-[#28382a]">
                <button
                  onClick={() => setViewMode('map')}
                  className="px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer bg-[#dfff55] text-[#121a13] font-extrabold shadow-xs"
                >
                  <MapIcon className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Mapa</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className="px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer text-[#8e9c89] hover:text-white"
                >
                  <List className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Lista</span>
                </button>
              </div>
            </div>

            {/* Floating Search Bar with Filter Chips */}
            <div className="pointer-events-auto bg-[#121913]/90 backdrop-blur-md p-2 rounded-2xl border border-[#233125] shadow-2xl space-y-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#19221b] rounded-xl border border-[#28382a] focus-within:border-[#a3e635] transition-colors">
                <Search className="w-4 h-4 text-[#8e9c89] shrink-0" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar hospital, cidade ou soro..."
                  className="w-full bg-transparent text-xs sm:text-sm text-white placeholder:text-[#6a7765] outline-none"
                  aria-label="Pesquisar unidades de saúde"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="p-1 text-[#8e9c89] hover:text-white cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Filter Chips Horizontal Scroll */}
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar items-center">
                <button
                  onClick={() => setActiveFilter('todos')}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeFilter === 'todos'
                      ? 'bg-[#dfff55] text-[#121a13]'
                      : 'bg-[#1b261d] text-[#8e9c89] hover:text-white border border-[#28382a]'
                  }`}
                >
                  Todos ({HEALTH_UNITS.length})
                </button>
                <button
                  onClick={() => setActiveFilter('soro')}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeFilter === 'soro'
                      ? 'bg-[#dfff55] text-[#121a13]'
                      : 'bg-[#1b261d] text-[#8e9c89] hover:text-white border border-[#28382a]'
                  }`}
                >
                  🐍 Soro Antiveneno
                </button>
                <button
                  onClick={() => setActiveFilter('ciatox')}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeFilter === 'ciatox'
                      ? 'bg-[#dfff55] text-[#121a13]'
                      : 'bg-[#1b261d] text-[#8e9c89] hover:text-white border border-[#28382a]'
                  }`}
                >
                  ☎️ CIATox
                </button>
                <button
                  onClick={() => setActiveFilter('hospitais')}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeFilter === 'hospitais'
                      ? 'bg-[#dfff55] text-[#121a13]'
                      : 'bg-[#1b261d] text-[#8e9c89] hover:text-white border border-[#28382a]'
                  }`}
                >
                  🏥 Hospitais
                </button>

                {/* Quick regional pole selector */}
                <select
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'campinas') handleSelectCity('Campinas, SP', -22.9056, -47.0608);
                    if (val === 'sp') handleSelectCity('São Paulo, SP', -23.5505, -46.6333);
                    if (val === 'brasilia') handleSelectCity('Brasília, DF', -15.7975, -47.8919);
                    if (val === 'bh') handleSelectCity('Belo Horizonte, MG', -19.9208, -43.9378);
                    if (val === 'curitiba') handleSelectCity('Curitiba, PR', -25.4284, -49.2733);
                    if (val === 'salvador') handleSelectCity('Salvador, BA', -12.9777, -38.5016);
                  }}
                  defaultValue="campinas"
                  className="bg-[#1b261d] border border-[#28382a] text-[#8e9c89] hover:text-white rounded-full px-2 py-0.5 text-[11px] font-bold outline-none cursor-pointer shrink-0 ml-auto"
                >
                  <option value="campinas">Polo Campinas (SP)</option>
                  <option value="sp">Polo São Paulo (SP)</option>
                  <option value="brasilia">Polo Brasília (DF)</option>
                  <option value="bh">Polo Belo Horizonte (MG)</option>
                  <option value="curitiba">Polo Curitiba (PR)</option>
                  <option value="salvador">Polo Salvador (BA)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Floating Floating GPS / Recenter Button */}
          <div className="absolute right-3 bottom-24 sm:bottom-6 z-[400] flex flex-col gap-2 pointer-events-auto">
            <button
              onClick={handleRequestLocation}
              disabled={isLocating}
              className="w-12 h-12 rounded-2xl bg-[#121913]/95 backdrop-blur-md border border-[#28382a] text-[#dfff55] shadow-xl flex items-center justify-center hover:bg-[#1b261d] transition-all cursor-pointer active:scale-95"
              title="Centralizar na minha localização GPS"
              aria-label="Minha localização"
            >
              <Navigation className={`w-5 h-5 ${isLocating ? 'animate-spin text-[#ea580c]' : 'text-[#dfff55]'}`} />
            </button>
          </div>

          {/* Bottom Floating Glance Card when a unit is selected */}
          {selectedUnit && (
            <div 
              onClick={() => setIsDetailModalOpen(true)}
              className="absolute bottom-3 inset-x-3 sm:inset-x-6 z-[400] bg-[#121913]/95 backdrop-blur-md rounded-2xl p-4 border border-[#28382a] shadow-2xl space-y-2 pointer-events-auto cursor-pointer transition-all hover:border-[#a3e635] group active:scale-[0.99]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#1d2a1f] text-[#dfff55] border border-[#2b3e2f]">
                      {selectedUnit.tipoLabel}
                    </span>
                    <span className="text-xs font-extrabold text-[#ea580c] tabular-nums">
                      ~{calculateDistanceKm(userLocation.lat, userLocation.lng, selectedUnit.latitude, selectedUnit.longitude)} km
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white truncate pt-1 group-hover:text-[#dfff55] transition-colors">
                    {selectedUnit.nome}
                  </h3>
                  <p className="text-xs text-[#8e9c89] truncate">
                    {selectedUnit.cidade} — {selectedUnit.estado} · Toque para ver detalhes completos
                  </p>
                </div>

                <span className="px-3 py-2 rounded-xl bg-[#dfff55] text-[#121a13] text-xs font-black shadow-md shrink-0 flex items-center gap-1 group-hover:scale-105 transition-transform">
                  Ver Ficha ↗
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: LIST VIEW (Dark Themed) */}
      {viewMode === 'list' && (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#0b100c]">
          {/* Header Bar */}
          <div className="flex items-center justify-between gap-2 bg-[#121913] p-3 rounded-2xl border border-[#233125]">
            <button
              onClick={onBack}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#1b261d] text-[#dfff55] font-bold text-xs border border-[#2d3f30]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>
            <div className="text-right">
              <span className="text-xs font-bold text-white block">{filteredUnits.length} unidades encontradas</span>
              <span className="text-[10px] text-[#8e9c89]">Ordenadas por proximidade</span>
            </div>
            <button
              onClick={() => setViewMode('map')}
              className="px-3 py-1.5 rounded-xl bg-[#dfff55] text-[#121a13] font-black text-xs flex items-center gap-1"
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Ver no Mapa</span>
            </button>
          </div>

          {filteredUnits.map(unit => {
            const isSaved = savedUnitIds.has(unit.id);
            return (
              <div
                key={unit.id}
                onClick={() => {
                  setSelectedUnit(unit);
                  setIsDetailModalOpen(true);
                }}
                className="bg-[#121913] rounded-2xl p-4 border border-[#233125] hover:border-[#a3e635] transition-all space-y-3 shadow-md cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#1b261d] text-[#dfff55] border border-[#2d3f30]">
                        {unit.tipoLabel}
                      </span>
                      <span className="text-xs font-extrabold text-[#ea580c] tabular-nums">
                        ~{unit.distanceKm} km
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-extrabold text-white group-hover:text-[#dfff55] transition-colors">
                      {unit.nome}
                    </h3>
                    <p className="text-xs text-[#8e9c89]">
                      {unit.endereco} · {unit.cidade} - {unit.estado}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaveUnit(unit.id);
                    }}
                    className="p-2 text-[#8e9c89] hover:text-rose-400 transition-colors"
                    aria-label="Salvar unidade"
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>

                <div className="text-xs text-[#cad5c6] bg-[#172119] p-3 rounded-xl border border-[#233125]">
                  <strong className="text-white">Indicação:</strong> {unit.atendimento_indicado}
                </div>

                <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#1f2c21]">
                  <a
                    href={`tel:${unit.telefone.replace(/\D/g, '')}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs font-bold text-[#dfff55] hover:underline flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Ligar ({unit.telefone})</span>
                  </a>

                  <span className="text-xs font-bold text-[#ea580c] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Ver detalhes ↗</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL DE DETALHE DA UNIDADE (Ao clicar no pin ou no card) - Dark Glass Theme */}
      {isDetailModalOpen && selectedUnit && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setIsDetailModalOpen(false)}
        >
          <div 
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#121913] text-[#f1f5ee] rounded-t-3xl sm:rounded-3xl border border-[#28382a] shadow-2xl p-5 sm:p-6 space-y-4 animate-in slide-in-from-bottom-6 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#1b261d] text-[#dfff55] border border-[#2d3f30]">
                    {selectedUnit.tipoLabel}
                  </span>
                  <span className="text-xs font-extrabold text-[#ea580c] tabular-nums">
                    ~{calculateDistanceKm(userLocation.lat, userLocation.lng, selectedUnit.latitude, selectedUnit.longitude)} km
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
                  {selectedUnit.nome}
                </h2>
                <p className="text-xs text-[#8e9c89]">
                  {selectedUnit.cidade} — {selectedUnit.estado} · CNES: {selectedUnit.cnes}
                </p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => toggleSaveUnit(selectedUnit.id)}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    savedUnitIds.has(selectedUnit.id)
                      ? 'bg-rose-950/60 border-rose-800 text-rose-400'
                      : 'bg-[#1b261d] border-[#28382a] text-[#8e9c89] hover:text-white'
                  }`}
                  aria-label="Salvar unidade"
                >
                  <Heart className={`w-4 h-4 ${savedUnitIds.has(selectedUnit.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>

                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="p-2 rounded-xl bg-[#1b261d] hover:bg-[#253628] text-white transition-colors cursor-pointer border border-[#28382a]"
                  aria-label="Fechar detalhes"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Aviso Obrigatório: Disponibilidade de soro sob consulta */}
            <div className="p-3.5 bg-orange-950/40 rounded-2xl border border-orange-800/60 text-xs text-orange-200 flex gap-2.5">
              <AlertTriangle className="w-5 h-5 text-[#ea580c] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="block font-extrabold text-sm text-[#fdba74]">
                  Disponibilidade de soro sob consulta:
                </strong>
                <p className="leading-relaxed">
                  A presença no mapa indica cadastro oficial de referência. Ligue para confirmar estoque do soro necessário, <strong>sem atrasar o deslocamento de emergência</strong>.
                </p>
              </div>
            </div>

            {/* Address & Operational Info */}
            <div className="space-y-2.5 text-xs text-[#d2dcce] bg-[#172119] p-4 rounded-2xl border border-[#233125]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#a3e635] shrink-0 mt-0.5" />
                <span className="font-medium">
                  {selectedUnit.endereco} {selectedUnit.bairro ? `— ${selectedUnit.bairro}` : ''}
                </span>
              </div>
              
              <div className="flex items-start gap-2 pt-2 border-t border-[#233125]">
                <CheckCircle2 className="w-4 h-4 text-[#a3e635] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Atendimento indicado:</strong> {selectedUnit.atendimento_indicado}
                </span>
              </div>

              {selectedUnit.observacao_seguranca && (
                <div className="text-[11px] text-[#cad5c6] p-2.5 rounded-xl bg-[#121913] border border-[#233125]">
                  💡 {selectedUnit.observacao_seguranca}
                </div>
              )}
            </div>

            {/* Emergency Action Buttons: Ligar & Como Chegar */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <a
                href={`tel:${selectedUnit.telefone.replace(/\D/g, '')}`}
                className="py-3 px-4 rounded-xl bg-[#dfff55] hover:bg-[#cbf033] text-[#121a13] text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <Phone className="w-4 h-4 text-[#121a13]" />
                <span>Ligar: {selectedUnit.telefone}</span>
              </a>

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedUnit.latitude},${selectedUnit.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <Navigation className="w-4 h-4" />
                <span>Como Chegar ↗</span>
              </a>
            </div>

            {/* Official Source & Verification Date */}
            <div className="flex items-center justify-between text-[11px] text-[#8e9c89] pt-2 border-t border-[#233125]">
              <span>Fonte: Ministério da Saúde & CNES</span>
              <span>Atualizado em: {selectedUnit.atualizado_em}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
