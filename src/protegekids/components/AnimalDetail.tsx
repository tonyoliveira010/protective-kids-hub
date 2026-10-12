import React, { useState } from 'react';
import {
  ArrowLeft, Heart, AlertTriangle, ShieldCheck,
  MapPin, Activity, Stethoscope, Ban, ExternalLink,
  PhoneCall, CheckCircle2, Info, Camera, ZoomIn,
  Ruler, Eye, X, CalendarDays, Bookmark, ChevronRight, Cross
} from 'lucide-react';
import { Animal } from '../data/animals';

interface AnimalDetailProps {
  animal: Animal;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onBack: () => void;
  onOpenEmergency: () => void;
  onOpenMap: () => void;
  onOpenChecklist: () => void;
}

export const AnimalDetail: React.FC<AnimalDetailProps> = ({
  animal,
  isSaved,
  onToggleSave,
  onBack,
  onOpenEmergency,
  onOpenMap,
  onOpenChecklist
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'sintomas' | 'prevencao' | 'fazer'>('info');
  const [isImageZoomed, setIsImageZoomed] = useState<boolean>(false);

  const getRiskBadge = (level: Animal['riskLevel']) => {
    switch (level) {
      case 'Urgência pediátrica (Peçonhento)':
        return {
          bg: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-900',
          dot: 'bg-red-500',
          label: 'Alerta Alto · Peçonhento'
        };
      case 'Atenção e cuidados':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900',
          dot: 'bg-amber-500',
          label: 'Atenção Pediátrica'
        };
      case 'Vetor de doenças':
        return {
          bg: 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-900',
          dot: 'bg-purple-500',
          label: 'Vetor de Doenças'
        };
      default:
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900',
          dot: 'bg-emerald-500',
          label: 'Baixo Risco'
        };
    }
  };

  const riskBadge = getRiskBadge(animal.riskLevel);

  const tabs: { id: typeof activeTab; label: string }[] = [
    { id: 'info', label: 'Principais informações' },
    { id: 'sintomas', label: 'Sintomas e reações' },
    { id: 'prevencao', label: 'Prevenção' },
    { id: 'fazer', label: 'O que fazer' }
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-200 pb-12">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-pk-card border border-pk-border text-pk-primary font-bold text-xs hover:bg-pk-surface transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Guia</span>
        </button>

        <button
          onClick={() => onToggleSave(animal.id)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all shadow-xs ${
            isSaved
              ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/50 dark:border-rose-900 dark:text-rose-300'
              : 'bg-pk-card border-pk-border text-pk-muted hover:text-pk-text'
          }`}
          aria-label={isSaved ? 'Remover dos salvos' : 'Salvar nos favoritos'}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
          <span>{isSaved ? 'Salvo ♡' : 'Salvar'}</span>
        </button>
      </div>

      {/* Card de Imagem do Animal / Inseto (Identificação Visual) */}
      <div className="bg-pk-card rounded-3xl overflow-hidden border border-pk-border shadow-sm space-y-0">
        {/* Photo Container with Macro View */}
        <div className="relative w-full bg-[#101418] overflow-hidden group">
          {animal.imageUrl ? (
            <img
              src={animal.imageUrl}
              alt={`Foto de identificação: ${animal.name} (${animal.scientific})`}
              className="w-full h-56 sm:h-64 object-cover object-center transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-pk-primary-strong to-[#0c1a18] flex flex-col items-center justify-center text-white">
              <span className="text-6xl mb-2">{animal.emoji}</span>
              <span className="text-xs font-semibold text-pk-accent">Ilustração Científica</span>
            </div>
          )}

          {/* Floating Badges */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-extrabold border border-white/20">
            <Camera className="w-3.5 h-3.5 text-pk-accent" />
            <span>Foto de Identificação</span>
          </div>

          {animal.sizeApprox && (
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold border border-white/20">
              <Ruler className="w-3 h-3 text-pk-accent" />
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
              <ZoomIn className="w-3.5 h-3.5 text-pk-accent" />
              <span className="text-[11px]">Ampliar</span>
            </button>
          )}

          <div className="absolute bottom-3 left-3 z-10 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-semibold text-white/90">
            {animal.category} · Espécime adulto
          </div>
        </div>

        {/* Título da Ficha + Morphological Identification & Caption */}
        <div className="p-4 sm:p-5 space-y-3">
          {/* Título da ficha (abaixo da imagem de capa) */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-pk-primary">
              {animal.category} · Ficha Educativa
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-pk-text tracking-tight leading-tight">
              {animal.name}
            </h1>
            <p className="text-xs font-medium text-pk-muted italic">
              {animal.scientific}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${riskBadge.bg}`}>
                <span className={`w-2 h-2 rounded-full ${riskBadge.dot}`} />
                <span>{riskBadge.label}</span>
              </div>
              {animal.isPeconhento && (
                <button
                  onClick={onOpenEmergency}
                  className="inline-flex items-center gap-1 text-xs font-bold text-pk-danger hover:underline"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Plantão SAMU 192</span>
                </button>
              )}
            </div>
          </div>

          {animal.imageCaption && (
            <p className="text-xs text-pk-text font-medium leading-relaxed pt-2 border-t border-pk-border">
              <strong className="text-pk-text font-bold">Morfologia de referência: </strong>
              {animal.imageCaption}
            </p>
          )}

          {/* Visual Traits Checklist */}
          {animal.visualTraits && animal.visualTraits.length > 0 && (
            <div className="space-y-1.5 pt-1 border-t border-pk-border">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-pk-primary block">
                Como reconhecer visualmente:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {animal.visualTraits.map((trait, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-pk-text bg-pk-surface p-2 rounded-xl border border-pk-border">
                    <CheckCircle2 className="w-3.5 h-3.5 text-pk-primary shrink-0 mt-0.5" />
                    <span>{trait}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Photo Tip for Caregivers */}
          <div className="p-2.5 rounded-xl bg-pk-surface text-[11px] text-pk-primary-strong dark:text-pk-primary font-semibold flex items-center gap-2">
            <Eye className="w-3.5 h-3.5 text-pk-primary shrink-0" />
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

      {/* Faixa de informações rápidas */}
      <div className="grid grid-cols-3 divide-x divide-pk-border bg-pk-surface rounded-2xl border border-pk-border overflow-hidden">
        <div className="p-3 sm:p-4 space-y-1">
          <div className="w-8 h-8 rounded-full bg-pk-card border border-pk-border flex items-center justify-center">
            <Ruler className="w-4 h-4 text-pk-primary" />
          </div>
          <span className="block text-[11px] font-bold text-pk-text">Tamanho</span>
          <span className="block text-[11px] text-pk-muted leading-snug">{animal.sizeApprox ?? 'Varia por espécie'}</span>
        </div>
        <div className="p-3 sm:p-4 space-y-1">
          <div className="w-8 h-8 rounded-full bg-pk-card border border-pk-border flex items-center justify-center">
            <MapPin className="w-4 h-4 text-pk-primary" />
          </div>
          <span className="block text-[11px] font-bold text-pk-text">Onde encontrar</span>
          <span className="block text-[11px] text-pk-muted leading-snug line-clamp-3">{animal.where}</span>
        </div>
        <div className="p-3 sm:p-4 space-y-1">
          <div className="w-8 h-8 rounded-full bg-pk-card border border-pk-border flex items-center justify-center">
            <CalendarDays className="w-4 h-4 text-pk-primary" />
          </div>
          <span className="block text-[11px] font-bold text-pk-text">Época de maior frequência</span>
          <span className="block text-[11px] text-pk-muted leading-snug">
            {animal.isPeconhento ? 'Primavera e verão (em algumas regiões)' : 'O ano todo, conforme a região'}
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 border-b border-pk-border overflow-x-auto no-scrollbar text-xs sm:text-sm font-bold">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2.5 whitespace-nowrap transition-all border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'border-pk-primary text-pk-primary'
                : 'border-transparent text-pk-muted hover:text-pk-text'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Alerta Importante */}
      <div className="p-4 bg-pk-danger-bg rounded-2xl border border-pk-danger-border flex gap-3">
        <AlertTriangle className="w-6 h-6 text-pk-danger shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="block font-extrabold text-pk-danger-text text-sm">Importante</strong>
          <p className="text-xs sm:text-sm text-pk-danger-text leading-relaxed">
            {animal.summary} Em caso de suspeita de picada, procure atendimento médico imediatamente, principalmente em crianças.
          </p>
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === 'info' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Possíveis manifestações */}
          <div className="bg-pk-card rounded-2xl p-5 border border-pk-border space-y-4">
            <div className="flex items-center gap-2 text-pk-text font-bold text-sm">
              <span className="w-9 h-9 rounded-full bg-pk-surface border border-pk-border flex items-center justify-center">
                <Activity className="w-4.5 h-4.5 text-pk-primary" />
              </span>
              <h3>Possíveis manifestações</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <strong className="block text-xs font-bold text-pk-text">No local da picada</strong>
                <p className="text-xs text-pk-muted leading-relaxed">{animal.symptoms}</p>
              </div>
              <div className="space-y-2 sm:border-l sm:border-pk-border sm:pl-4">
                <strong className="block text-xs font-bold text-pk-text">Em casos mais graves</strong>
                <span className="block text-[10px] text-pk-muted">(podem ocorrer principalmente em crianças)</span>
                <ul className="space-y-1.5 text-xs text-pk-text">
                  {animal.alarmSignals.map((signal, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-pk-danger mt-1.5 shrink-0" />
                      <span>{signal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Risco em resumo */}
          <div className="bg-pk-card rounded-2xl p-5 border border-pk-border space-y-2.5">
            <div className="flex items-center gap-2 text-pk-text font-bold text-sm">
              <Info className="w-5 h-5 text-pk-primary" />
              <h3>Risco em resumo</h3>
            </div>
            <p className="text-sm text-pk-muted leading-relaxed">{animal.risk}</p>
          </div>
        </div>
      )}

      {activeTab === 'sintomas' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="bg-pk-card rounded-2xl p-5 border border-pk-border space-y-2.5">
            <div className="flex items-center gap-2 text-pk-text font-bold text-sm">
              <Activity className="w-5 h-5 text-pk-primary" />
              <h3>Possíveis reações</h3>
            </div>
            <p className="text-sm text-pk-muted leading-relaxed">{animal.symptoms}</p>
          </div>

          <div className="bg-pk-card rounded-2xl p-5 border border-pk-border space-y-2.5">
            <div className="flex items-center gap-2 text-pk-text font-bold text-sm">
              <MapPin className="w-5 h-5 text-pk-primary" />
              <h3>Onde pode aparecer</h3>
            </div>
            <p className="text-sm text-pk-muted leading-relaxed">{animal.where}</p>
          </div>

          {/* Sinais de Alarme */}
          <div className="bg-pk-danger-bg rounded-2xl p-5 border border-pk-danger-border space-y-3">
            <div className="flex items-center gap-2 text-pk-danger-text font-bold text-sm">
              <AlertTriangle className="w-5 h-5 text-pk-danger" />
              <h3>Sinais de Alerta de Emergência</h3>
            </div>
            <p className="text-xs text-pk-danger-text">
              Se a criança manifestar qualquer um destes sintomas, vá direto ao hospital ou ligue 192:
            </p>
            <ul className="space-y-2 text-xs font-medium text-pk-danger-text">
              {animal.alarmSignals.map((signal, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-pk-danger mt-1 shrink-0" />
                  <span>{signal}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'prevencao' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="bg-pk-card rounded-2xl p-5 border border-pk-border space-y-4">
            <div className="flex items-center gap-2 text-pk-text font-bold text-sm">
              <span className="w-9 h-9 rounded-full bg-pk-surface border border-pk-border flex items-center justify-center">
                <ShieldCheck className="w-4.5 h-4.5 text-pk-primary" />
              </span>
              <h3>Como prevenir</h3>
            </div>
            <ul className="space-y-2.5">
              {animal.prevention.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-pk-text">
                  <CheckCircle2 className="w-4 h-4 text-pk-primary shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

            {/* Checklist card */}
            <button
              onClick={onOpenChecklist}
              className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-pk-surface border border-pk-border hover:border-pk-primary transition-all text-left group cursor-pointer"
            >
              <span className="w-9 h-9 rounded-full bg-pk-card border border-pk-border flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4.5 h-4.5 text-pk-primary" />
              </span>
              <span className="flex-1 min-w-0">
                <strong className="block text-xs font-extrabold text-pk-text">Checklist de exposição na sua região</strong>
                <span className="block text-[11px] text-pk-muted leading-snug">
                  Veja se o {animal.name.toLowerCase()} é comum na sua área e como se proteger.
                </span>
              </span>
              <ChevronRight className="w-4 h-4 text-pk-muted group-hover:text-pk-primary shrink-0 transition-colors" />
            </button>
          </div>
        </div>
      )}

      {activeTab === 'fazer' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* O que fazer */}
          <div className="bg-pk-card rounded-2xl p-5 border border-pk-border space-y-3">
            <div className="flex items-center gap-2 text-pk-text font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-pk-primary" />
              <h3>O que fazer imediatamente</h3>
            </div>
            <p className="text-sm text-pk-muted leading-relaxed">{animal.action}</p>
          </div>

          {/* O que NUNCA fazer */}
          <div className="bg-pk-danger-bg rounded-2xl p-5 border border-pk-danger-border space-y-3">
            <div className="flex items-center gap-2 text-pk-danger-text font-bold text-sm">
              <Ban className="w-5 h-5 text-pk-danger" />
              <h3>O que NUNCA fazer (Mitos perigosos)</h3>
            </div>
            <ul className="space-y-2 text-xs text-pk-danger-text">
              {animal.forbidden.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-pk-danger mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Call SAMU */}
          <div className="p-4 bg-pk-surface rounded-2xl border border-pk-border flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-pk-text">Dúvida na gravidade da criança?</div>
              <div className="text-xs text-pk-muted">Atendimento gratuito 24 horas</div>
            </div>
            <button
              onClick={onOpenEmergency}
              className="px-4 py-2 bg-pk-danger hover:bg-pk-danger-strong text-white text-xs font-bold rounded-xl transition-colors shadow-xs shrink-0"
            >
              Ligue 192 (SAMU)
            </button>
          </div>
        </div>
      )}

      {/* Saiba onde buscar atendimento */}
      <div className="bg-pk-card rounded-2xl p-4 sm:p-5 border border-pk-border flex items-center gap-3">
        <span className="w-10 h-10 rounded-full bg-pk-surface border border-pk-border flex items-center justify-center shrink-0">
          <Cross className="w-5 h-5 text-pk-primary" />
        </span>
        <div className="flex-1 min-w-0">
          <strong className="block text-sm font-extrabold text-pk-text">Saiba onde buscar atendimento</strong>
          <span className="block text-xs text-pk-muted leading-snug">
            Encontre os hospitais de referência mais próximos com base nas informações do Ministério da Saúde.
          </span>
        </div>
        <button
          onClick={onOpenMap}
          className="px-4 py-2.5 rounded-full bg-pk-primary-strong hover:bg-pk-primary text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Ver unidades</span>
        </button>
      </div>

      {/* Fontes confiáveis */}
      <div className="bg-pk-card rounded-2xl p-4 sm:p-5 border border-pk-border space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-9 h-9 rounded-full bg-pk-surface border border-pk-border flex items-center justify-center shrink-0">
              <Stethoscope className="w-4.5 h-4.5 text-pk-primary" />
            </span>
            <div className="min-w-0">
              <strong className="block text-sm font-extrabold text-pk-text">Fontes confiáveis</strong>
              <span className="block text-xs text-pk-muted truncate">{animal.source}</span>
            </div>
          </div>
          <a
            href={animal.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-pk-surface hover:bg-pk-border text-pk-text text-xs font-bold transition-colors shrink-0"
          >
            <span>Consultar</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
        <p className="text-[11px] text-pk-muted leading-relaxed border-t border-pk-border pt-2.5">
          Ficha educativa com referências de órgãos oficiais de saúde pública. Para protocolos hospitalares ou confirmação diagnóstica, consulte a equipe médica local.
        </p>
      </div>

      {/* Salvar nos favoritos */}
      <button
        onClick={() => onToggleSave(animal.id)}
        className={`w-full py-4 rounded-full text-sm font-extrabold flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] ${
          isSaved
            ? 'bg-pk-surface text-pk-text border border-pk-border'
            : 'bg-pk-primary-strong hover:bg-pk-primary text-white'
        }`}
      >
        <Bookmark className={`w-4.5 h-4.5 ${isSaved ? 'fill-pk-primary text-pk-primary' : ''}`} />
        <span>{isSaved ? 'Salvo nos meus favoritos' : 'Salvar nos meus favoritos'}</span>
      </button>
    </div>
  );
};
