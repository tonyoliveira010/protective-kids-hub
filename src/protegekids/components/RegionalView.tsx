import React, { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink, Info, MapPin, Calendar, CheckSquare, RotateCcw } from 'lucide-react';

interface RegionalViewProps {
  onBack: () => void;
}

const REGION_DATA: Record<string, { title: string; desc: string; emoji: string }> = {
  'Sudeste': {
    title: 'Sudeste do Brasil',
    desc: 'A ocorrência varia entre municípios, bairros, clima e condições do ambiente. Não há previsão local sem dados oficiais específicos.',
    emoji: '🗺️'
  },
  'Sul': {
    title: 'Sul do Brasil',
    desc: 'O clima subtropical apresenta variações marcantes de temperatura. No inverno a atividade de alguns insetos diminui, mas aranhas e animais abrigados em locais fechados continuam presentes.',
    emoji: '🌲'
  },
  'Centro-Oeste': {
    title: 'Centro-Oeste do Brasil',
    desc: 'Com alternância entre períodos muito secos e chuvosos, áreas com vegetação de cerrado e margens de rios exigem atenção quanto a carrapatos, abelhas e animais peçonhentos.',
    emoji: '🌾'
  },
  'Nordeste': {
    title: 'Nordeste do Brasil',
    desc: 'Clima predominantemente quente o ano todo. A vigilância contra o mosquito Aedes aegypti e escorpiões em áreas urbanas é prioritária continuamente.',
    emoji: '☀️'
  },
  'Norte': {
    title: 'Norte do Brasil',
    desc: 'Região com grande biodiversidade e clima quente e úmido. Atenção especial a lagartas urticantes, formigas, mosquitos vetores e contato com áreas de mata.',
    emoji: '🌿'
  }
};

const SEASONS = [
  { name: 'Verão', emoji: '☀️', tip: 'Observe água parada e condições do ambiente.' },
  { name: 'Outono', emoji: '🍂', tip: 'Revise áreas de abrigo e materiais guardados.' },
  { name: 'Inverno', emoji: '🌤️', tip: 'Confira roupas, calçados e locais pouco usados.' },
  { name: 'Primavera', emoji: '🌼', tip: 'Observe jardins e vegetação sem tocar nos animais.' },
];

const REGIONAL_CHECKLIST = [
  { id: 'r1', title: 'Eliminar água parada', desc: 'Revise recipientes, vasos, calhas e reservatórios.' },
  { id: 'r2', title: 'Organizar quintal e áreas de armazenamento', desc: 'Evite acúmulo de entulho, folhas e materiais sem uso.' },
  { id: 'r3', title: 'Verificar calçados e roupas guardadas', desc: 'Sacuda antes de vestir, especialmente itens pouco usados.' },
  { id: 'r4', title: 'Usar telas e barreiras físicas quando possível', desc: 'Confira portas, janelas e mosquiteiros.' },
  { id: 'r5', title: 'Supervisionar crianças ao ar livre', desc: 'Ensine a observar sem tocar em insetos, lagartas ou ninhos.' },
  { id: 'r6', title: 'Examinar corpo e roupas após vegetação', desc: 'Verifique também itens levados para dentro de casa.' },
  { id: 'r7', title: 'Deixar contatos de saúde acessíveis', desc: 'Saiba onde buscar orientação local em caso de acidente.' },
];

export const RegionalView: React.FC<RegionalViewProps> = ({ onBack }) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('Centro-Oeste');
  const [selectedSeason, setSelectedSeason] = useState<string>('Verão');
  const [checkedItems, setCheckedItems] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem('pk-regional-checklist');
      return stored ? new Set(JSON.parse(stored)) : new Set(['r1']);
    } catch {
      return new Set(['r1']);
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('pk-regional-checklist', JSON.stringify([...checkedItems]));
    } catch (e) {
      console.error(e);
    }
  }, [checkedItems]);

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const resetChecklist = () => {
    setCheckedItems(new Set());
  };

  const total = REGIONAL_CHECKLIST.length;
  const done = checkedItems.size;
  const percent = Math.round((done / total) * 100);

  const currentRegionInfo = REGION_DATA[selectedRegion] || REGION_DATA['Centro-Oeste'];

  const getFeedbackText = () => {
    if (done === total) return 'Ótimo! Você revisou todos os cuidados desta lista.';
    if (done === 0) return 'Comece por um cuidado de cada vez.';
    return `Você marcou ${done} cuidado(s). Continue quando puder.`;
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200 pb-12">
      {/* Top back button */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white border border-[#e8ecdf] text-[#315321] font-bold text-xs hover:bg-[#edf4df] transition-colors shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>
      </div>

      {/* Header */}
      <div className="space-y-1">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#537d37]">
          Prevenção contextual
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#20251d] tracking-tight leading-tight">
          Regional: hábitos<br />e épocas 🌦️
        </h1>
        <p className="text-xs sm:text-sm text-[#73796d] font-medium leading-relaxed max-w-md pt-0.5">
          Escolha a região manualmente e marque os cuidados que você já fez. Esta versão não acessa sua localização precisa.
        </p>
      </div>

      {/* Unified Region Card Banner with Integrated Switcher */}
      <div className="rounded-3xl bg-[#e4edda] border border-[#d3dfc7] p-5 sm:p-6 space-y-4 relative overflow-hidden shadow-xs">
        {/* Selector & prompt */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#537d37]">
                Consulta Geográfica
              </span>
              <h2 className="text-base font-extrabold text-[#20251d]">
                Qual região você quer consultar?
              </h2>
            </div>
            <span className="text-3xl shrink-0 select-none" aria-hidden="true">
              {currentRegionInfo.emoji}
            </span>
          </div>

          <p className="text-xs text-[#52594a] leading-relaxed">
            Para dados específicos, consulte fontes oficiais do seu município ou estado.
          </p>

          <div className="pt-1">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full border border-[#c5d5b7] bg-white rounded-2xl px-3.5 py-3 text-sm font-extrabold text-[#20251d] outline-none focus:ring-2 focus:ring-[#537d37]/30 transition-all cursor-pointer shadow-xs"
              aria-label="Selecionar Região do Brasil"
            >
              <option value="Centro-Oeste">Centro-Oeste</option>
              <option value="Sudeste">Sudeste</option>
              <option value="Sul">Sul</option>
              <option value="Nordeste">Nordeste</option>
              <option value="Norte">Norte</option>
            </select>
          </div>
        </div>

        {/* Dynamic Regional Banner Details */}
        <div className="pt-3 border-t border-[#d3dfc7] space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl" aria-hidden="true">{currentRegionInfo.emoji}</span>
            <h3 className="text-base sm:text-lg font-extrabold text-[#20251d]">
              {currentRegionInfo.title}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[#384330] leading-relaxed font-medium">
            {currentRegionInfo.desc}
          </p>
        </div>
      </div>

      {/* Seasons */}
      <div className="space-y-2.5">
        <div>
          <h2 className="text-base font-extrabold text-[#20251d]">
            Épocas do ano
          </h2>
          <p className="text-xs text-[#73796d] mt-0.5">
            Escolha a estação para ver cuidados gerais. A estação, sozinha, não confirma maior frequência de uma espécie.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {SEASONS.map(season => {
            const isActive = selectedSeason === season.name;
            return (
              <button
                key={season.name}
                onClick={() => setSelectedSeason(season.name)}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  isActive
                    ? 'border-[#537d37] bg-[#f2f7e9] ring-2 ring-[#537d37]/20 shadow-xs'
                    : 'border-[#e8ecdf] bg-white hover:border-[#ccd7be]'
                }`}
              >
                <span className="text-2xl block mb-1.5">{season.emoji}</span>
                <b className="text-xs font-bold text-[#20251d] block">{season.name}</b>
                <small className="text-[11px] text-[#73796d] block leading-tight mt-1">
                  {season.tip}
                </small>
              </button>
            );
          })}
        </div>
      </div>

      {/* Notice */}
      <div className="bg-[#fff0dc] rounded-2xl p-4 border border-[#fedbb3] flex gap-3 text-xs text-[#7c4818]">
        <Info className="w-5 h-5 text-[#ea580c] shrink-0 mt-0.5" />
        <div>
          <b className="block text-sm font-bold text-[#8a4e16] mb-0.5">Sem previsões não verificadas</b>
          <span>Frequência regional e sazonal só deve ser exibida com fonte confiável, específica e atualizada da vigilância em saúde local.</span>
        </div>
      </div>

      {/* Prevention Checklist */}
      <div className="bg-white rounded-3xl p-5 border border-[#e8ecdf] space-y-4 shadow-xs" id="checklist">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-[#20251d]">
            Checklist de prevenção
          </h2>
          <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-[#edf4df] text-[#315321] tabular-nums">
            {done} de {total}
          </span>
        </div>
        <p className="text-xs text-[#73796d] -mt-2">
          Marque os cuidados realizados em casa ou antes de uma atividade ao ar livre.
        </p>

        <div className="space-y-3 pt-1">
          {REGIONAL_CHECKLIST.map((item) => {
            const isChecked = checkedItems.has(item.id);
            return (
              <label
                key={item.id}
                className="flex items-start gap-3 py-2.5 border-b border-[#f0f3eb] last:border-b-0 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleCheck(item.id)}
                  className="w-5 h-5 rounded-md accent-[#537d37] mt-0.5 shrink-0 cursor-pointer"
                />
                <span className="flex-1 min-w-0">
                  <b className={`text-xs block font-bold ${isChecked ? 'line-through text-[#8b9284]' : 'text-[#20251d]'}`}>
                    {item.title}
                  </b>
                  <small className="text-[11px] text-[#73796d] block leading-snug mt-0.5">
                    {item.desc}
                  </small>
                </span>
              </label>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5 pt-2">
          <div className="w-full h-2 bg-[#e9eee1] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#537d37] rounded-full transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="text-[11px] font-semibold text-[#55604e] flex items-center justify-between">
            <span>{getFeedbackText()}</span>
            <span className="tabular-nums font-bold">{percent}%</span>
          </div>
        </div>

        <button
          onClick={resetChecklist}
          className="w-full py-3 rounded-xl bg-[#315321] hover:bg-[#253f19] text-white font-extrabold text-xs transition-colors shadow-xs"
        >
          Desmarcar checklist
        </button>
      </div>

      {/* Official Sources Card */}
      <div className="bg-white rounded-3xl p-5 border border-[#e8ecdf] space-y-2.5 shadow-xs">
        <h3 className="text-sm font-bold text-[#20251d]">Consultar fontes oficiais</h3>
        <p className="text-xs text-[#73796d] leading-relaxed">
          Para dados de ocorrência, sazonalidade e alertas, consulte a vigilância em saúde local.
        </p>
        <div className="space-y-1 pt-1 text-xs">
          <div>
            <a
              href="https://www.gov.br/saude/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#315321] font-bold hover:underline inline-flex items-center gap-1"
            >
              <span>Ministério da Saúde</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div>
            <a
              href="https://portal.fiocruz.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#315321] font-bold hover:underline inline-flex items-center gap-1"
            >
              <span>Fiocruz</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Footer disclaimer */}
      <p className="text-[11px] text-[#838a7a] text-center leading-relaxed">
        Checklist educativo, não é previsão de infestação nem substitui recomendações oficiais locais.
      </p>
    </div>
  );
};
