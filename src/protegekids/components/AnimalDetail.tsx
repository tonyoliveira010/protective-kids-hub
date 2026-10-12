import React, { useState } from 'react';
import { 
  ArrowLeft, Heart, AlertTriangle, ShieldCheck, 
  MapPin, Activity, Stethoscope, Ban, ExternalLink,
  PhoneCall, CheckCircle2, Info, Camera, ZoomIn, 
  Ruler, Eye, X
} from 'lucide-react';
import { Animal } from '../data/animals';

interface AnimalDetailProps {
  animal: Animal;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onBack: () => void;
  onOpenEmergency: () => void;
}

export const AnimalDetail: React.FC<AnimalDetailProps> = ({
  animal,
  isSaved,
  onToggleSave,
  onBack,
  onOpenEmergency
}) => {
  const [activeTab, setActiveTab] = useState<'socorros' | 'risco' | 'prevencao' | 'fontes'>('socorros');
  const [isImageZoomed, setIsImageZoomed] = useState<boolean>(false);

  const getRiskBadge = (level: Animal['riskLevel']) => {
    switch (level) {
      case 'Urgência pediátrica (Peçonhento)':
        return {
          bg: 'bg-red-50 text-red-700 border-red-200',
          dot: 'bg-red-500',
          label: 'Alerta Alto · Peçonhento'
        };
      case 'Atenção e cuidados':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
          label: 'Atenção Pediátrica'
        };
      case 'Vetor de doenças':
        return {
          bg: 'bg-purple-50 text-purple-800 border-purple-200',
          dot: 'bg-purple-500',
          label: 'Vetor de Doenças'
        };
      default:
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-500',
          label: 'Baixo Risco'
        };
    }
  };

  const riskBadge = getRiskBadge(animal.riskLevel);

  return (
    <div className="space-y-5 animate-in fade-in duration-200 pb-12">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white border border-[#e8ecdf] text-[#315321] font-bold text-xs hover:bg-[#edf4df] transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Guia</span>
        </button>

        <button
          onClick={() => onToggleSave(animal.id)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all shadow-xs ${
            isSaved
              ? 'bg-rose-50 border-rose-200 text-rose-600'
              : 'bg-white border-[#e8ecdf] text-[#73796d] hover:text-[#20251d]'
          }`}
          aria-label={isSaved ? 'Remover dos salvos' : 'Salvar nos favoritos'}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
          <span>{isSaved ? 'Salvo ♡' : 'Salvar'}</span>
        </button>
      </div>

      {/* Card de Imagem do Animal / Inseto (Identificação Visual) */}
      <div className="bg-white rounded-3xl overflow-hidden border border-[#d8e3c9] shadow-sm space-y-0">
        {/* Photo Container with Macro View */}
        <div className="relative w-full bg-[#1b2216] overflow-hidden group">
          {animal.imageUrl ? (
            <img 
              src={animal.imageUrl} 
              alt={`Foto de identificação: ${animal.name} (${animal.scientific})`}
              className="w-full h-56 sm:h-64 object-cover object-center transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              onError={(e) => {
                // Fallback graceful display if network fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-[#253f19] to-[#14230d] flex flex-col items-center justify-center text-white">
              <span className="text-6xl mb-2">{animal.emoji}</span>
              <span className="text-xs font-semibold text-[#dfff55]">Ilustração Científica</span>
            </div>
          )}

          {/* Floating Badges */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-extrabold border border-white/20">
            <Camera className="w-3.5 h-3.5 text-[#dfff55]" />
            <span>Foto de Identificação</span>
          </div>

          {animal.sizeApprox && (
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold border border-white/20">
              <Ruler className="w-3 h-3 text-[#dfff55]" />
              <span>{animal.sizeApprox}</span>
            </div>
          )}

          {/* Zoom Trigger Button */}
          {animal.imageUrl && (
            <button
              onClick={() => setIsImageZoomed(true)}
              className="absolute bottom-3 right-3 z-10 p-2 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-white transition-all border border-white/20 cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title="Ampliar foto em tela cheia"
            >
              <ZoomIn className="w-3.5 h-3.5 text-[#dfff55]" />
              <span className="text-[11px]">Ampliar</span>
            </button>
          )}

          <div className="absolute bottom-3 left-3 z-10 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-semibold text-white/90">
            {animal.category} · Espécime adulto
          </div>
        </div>

        {/* Morphological Identification & Caption */}
        <div className="p-4 sm:p-5 space-y-3 bg-[#fbfdf9]">
          {animal.imageCaption && (
            <p className="text-xs text-[#3b4334] font-medium leading-relaxed">
              <strong className="text-[#20251d] font-bold">Morfologia de referência: </strong>
              {animal.imageCaption}
            </p>
          )}

          {/* Visual Traits Checklist */}
          {animal.visualTraits && animal.visualTraits.length > 0 && (
            <div className="space-y-1.5 pt-1 border-t border-[#edf1e6]">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#537d37] block">
                Como reconhecer visualmente:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {animal.visualTraits.map((trait, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-[#464f3f] bg-white p-2 rounded-xl border border-[#e8ecdf]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#537d37] shrink-0 mt-0.5" />
                    <span>{trait}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Photo Tip for Caregivers */}
          <div className="p-2.5 rounded-xl bg-[#edf4df] text-[11px] text-[#315321] font-semibold flex items-center gap-2">
            <Eye className="w-3.5 h-3.5 text-[#537d37] shrink-0" />
            <span>Não capture o animal com as mãos desprotegidas. Fotografe à distância para identificação médica no hospital.</span>
          </div>
        </div>
      </div>

      {/* Modal de Zoom da Imagem */}
      {isImageZoomed && animal.imageUrl && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsImageZoomed(false)}
        >
          <button
            onClick={() => setIsImageZoomed(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
            aria-label="Fechar ampliação"
          >
            <X className="w-6 h-6" />
          </button>
          <img 
            src={animal.imageUrl} 
            alt={animal.name} 
            className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="mt-4 text-center text-white max-w-md px-4" onClick={(e) => e.stopPropagation()}>
            <strong className="block text-base">{animal.name}</strong>
            <span className="text-xs text-white/70 italic">{animal.scientific}</span>
            <p className="text-xs text-white/90 mt-1">{animal.imageCaption}</p>
          </div>
        </div>
      )}

      {/* Hero Visual Card */}
      <div className="bg-gradient-to-br from-[#edf4df] via-[#f5f8ee] to-[#e4eed1] rounded-3xl p-6 border border-[#dfe7d2] relative overflow-hidden shadow-xs">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5 z-10 max-w-[280px]">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#537d37]">
              {animal.category} · Ficha Educativa
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#20251d] tracking-tight leading-tight">
              {animal.name}
            </h1>
            <p className="text-xs font-medium text-[#73796d] italic">
              {animal.scientific}
            </p>
          </div>

          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white/90 border border-white/60 shadow-md flex items-center justify-center text-5xl sm:text-6xl shrink-0">
            {animal.emoji}
          </div>
        </div>

        {/* Severity Banner */}
        <div className="mt-4 pt-3 border-t border-[#d8e3c9] flex flex-wrap items-center justify-between gap-2">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${riskBadge.bg}`}>
            <span className={`w-2 h-2 rounded-full ${riskBadge.dot}`} />
            <span>{riskBadge.label}</span>
          </div>

          {animal.isPeconhento && (
            <button
              onClick={onOpenEmergency}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#ea580c] hover:underline"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Plantão SAMU 192</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary quote */}
      <div className="p-4 bg-white rounded-2xl border border-[#e8ecdf] text-sm text-[#464c40] font-medium leading-relaxed">
        {animal.summary}
      </div>

      {/* Critical Medical Disclaimer */}
      <div className="p-4 bg-[#fff9ed] rounded-2xl border border-[#ffe4ad] text-xs text-[#8a5b14] flex gap-3">
        <Info className="w-5 h-5 text-[#d97706] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="block font-bold">Ficha demonstrativa e educativa:</strong>
          <span>
            As condutas aqui descritas seguem orientações gerais de saúde pública. Em caso de acidente com criança, priorize sempre avaliação presencial em serviço de saúde ou ligue 192.
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1.5 p-1 bg-[#edf1e6] rounded-2xl text-xs font-bold overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('socorros')}
          className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'socorros'
              ? 'bg-[#315321] text-white shadow-xs'
              : 'text-[#626a5b] hover:text-[#20251d]'
          }`}
        >
          Primeiros Socorros
        </button>
        <button
          onClick={() => setActiveTab('risco')}
          className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'risco'
              ? 'bg-[#315321] text-white shadow-xs'
              : 'text-[#626a5b] hover:text-[#20251d]'
          }`}
        >
          Sintomas & Riscos
        </button>
        <button
          onClick={() => setActiveTab('prevencao')}
          className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'prevencao'
              ? 'bg-[#315321] text-white shadow-xs'
              : 'text-[#626a5b] hover:text-[#20251d]'
          }`}
        >
          Prevenção no Lar
        </button>
        <button
          onClick={() => setActiveTab('fontes')}
          className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'fontes'
              ? 'bg-[#315321] text-white shadow-xs'
              : 'text-[#626a5b] hover:text-[#20251d]'
          }`}
        >
          Fontes
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'socorros' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* O que fazer */}
          <div className="bg-white rounded-2xl p-5 border border-[#e8ecdf] space-y-3">
            <div className="flex items-center gap-2 text-[#315321] font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-[#537d37]" />
              <h3>O que fazer imediatamente</h3>
            </div>
            <p className="text-sm text-[#383f32] leading-relaxed">
              {animal.action}
            </p>
          </div>

          {/* O que NUNCA fazer */}
          <div className="bg-[#fff5f5] rounded-2xl p-5 border border-[#fed7d7] space-y-3">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
              <Ban className="w-5 h-5 text-rose-600" />
              <h3>O que NUNCA fazer (Mitos perigosos)</h3>
            </div>
            <ul className="space-y-2 text-xs text-rose-950">
              {animal.forbidden.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Call SAMU */}
          <div className="p-4 bg-[#f8faf4] rounded-2xl border border-[#dfe5d5] flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[#20251d]">Dúvida na gravidade da criança?</div>
              <div className="text-xs text-[#73796d]">Atendimento gratuito 24 horas</div>
            </div>
            <button
              onClick={onOpenEmergency}
              className="px-4 py-2 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
            >
              Ligue 192 (SAMU)
            </button>
          </div>
        </div>
      )}

      {activeTab === 'risco' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Risco em resumo */}
          <div className="bg-white rounded-2xl p-5 border border-[#e8ecdf] space-y-2.5">
            <div className="flex items-center gap-2 text-[#315321] font-bold text-sm">
              <Activity className="w-5 h-5 text-[#537d37]" />
              <h3>Risco em resumo</h3>
            </div>
            <p className="text-sm text-[#464c40] leading-relaxed">
              {animal.risk}
            </p>
          </div>

          {/* Onde pode aparecer */}
          <div className="bg-white rounded-2xl p-5 border border-[#e8ecdf] space-y-2.5">
            <div className="flex items-center gap-2 text-[#315321] font-bold text-sm">
              <MapPin className="w-5 h-5 text-[#537d37]" />
              <h3>Onde pode aparecer</h3>
            </div>
            <p className="text-sm text-[#464c40] leading-relaxed">
              {animal.where}
            </p>
          </div>

          {/* Possíveis reações */}
          <div className="bg-white rounded-2xl p-5 border border-[#e8ecdf] space-y-2.5">
            <div className="flex items-center gap-2 text-[#315321] font-bold text-sm">
              <AlertTriangle className="w-5 h-5 text-[#537d37]" />
              <h3>Possíveis reações</h3>
            </div>
            <p className="text-sm text-[#464c40] leading-relaxed">
              {animal.symptoms}
            </p>
          </div>

          {/* Sinais de Alarme Vermelho */}
          <div className="bg-[#fff9f0] rounded-2xl p-5 border border-[#fedbb3] space-y-3">
            <div className="flex items-center gap-2 text-[#9a4b08] font-bold text-sm">
              <AlertTriangle className="w-5 h-5 text-[#ea580c]" />
              <h3>Sinais de Alerta de Emergência</h3>
            </div>
            <p className="text-xs text-[#6e390d]">
              Se a criança manifestar qualquer um destes sintomas, vá direto ao hospital ou ligue 192:
            </p>
            <ul className="space-y-2 text-xs font-medium text-[#7a4011]">
              {animal.alarmSignals.map((signal, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#ea580c] mt-1 shrink-0" />
                  <span>{signal}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'prevencao' && (
        <div className="bg-white rounded-2xl p-5 border border-[#e8ecdf] space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center gap-2 text-[#315321] font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-[#537d37]" />
            <h3>Como prevenir</h3>
          </div>
          <p className="text-xs text-[#73796d]">
            Medidas práticas no ambiente familiar para evitar contato e acidentes.
          </p>
          <div className="space-y-3">
            {animal.prevention.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-[#f8faf4] rounded-xl border border-[#edf1e6]">
                <span className="w-6 h-6 rounded-lg bg-[#dfff55] text-[#315321] font-extrabold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="text-xs text-[#383f32] font-medium leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'fontes' && (
        <div className="bg-white rounded-2xl p-5 border border-[#e8ecdf] space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center gap-2 text-[#315321] font-bold text-sm">
            <Stethoscope className="w-5 h-5 text-[#537d37]" />
            <h3>Referência Institucional</h3>
          </div>
          <p className="text-xs text-[#52594a]">
            {animal.source}
          </p>
          <div className="p-3 bg-[#f8faf4] rounded-xl border border-[#e8ecdf] text-xs text-[#73796d]">
            Esta referência aponta para o repositório institucional de saúde pública brasileiro. Para protocolos hospitalares específicos ou confirmação diagnóstica, consulte a equipe médica local.
          </div>
          <a
            href={animal.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#315321] hover:bg-[#243d18] text-white text-xs font-bold transition-colors"
          >
            <span>Consultar portal de saúde oficial</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </div>
  );
};
