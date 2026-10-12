import React from 'react';
import { ArrowLeft, ShieldCheck, Home, Info, Sparkles } from 'lucide-react';
import { ChecklistSection } from './ChecklistSection';

interface SafeHomeViewProps {
  onBack: () => void;
}

export const SafeHomeView: React.FC<SafeHomeViewProps> = ({ onBack }) => {
  return (
    <div className="space-y-5 animate-in fade-in duration-200 pb-12">
      {/* Back button */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white border border-[#e8ecdf] text-[#315321] font-bold text-xs hover:bg-[#edf4df] transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>
      </div>

      {/* Header */}
      <div className="space-y-1">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#537d37]">
          Prevenção no dia a dia
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#20251d] tracking-tight leading-tight">
          Ambiente Seguro:<br />Proteção no Lar 🌱
        </h1>
        <p className="text-xs sm:text-sm text-[#73796d] font-medium leading-relaxed max-w-md pt-0.5">
          Guia prático para eliminar esconderijos e proteger quartos, ralos e quintais de animais peçonhentos e transmissores de doenças.
        </p>
      </div>

      {/* Advice Card */}
      <div className="bg-[#f0f6e8] rounded-3xl p-5 border border-[#d8e8ca] space-y-2.5 shadow-xs">
        <div className="flex items-center gap-2 text-[#315321] font-bold text-sm">
          <Sparkles className="w-5 h-5 text-[#537d37]" />
          <h2>A regra de ouro da prevenção infantil</h2>
        </div>
        <p className="text-xs text-[#3f4a36] leading-relaxed">
          Animais peçonhentos como escorpiões e aranhas não atacam por vontade própria — acidentes acontecem quando são comprimidos sem querer (ao calçar sapatos, deitar na cama ou mexer em entulho).
        </p>
      </div>

      {/* Main Interactive Checklist Section */}
      <ChecklistSection />

      {/* Room by Room Summary Tips */}
      <div className="bg-white rounded-3xl p-5 border border-[#e8ecdf] space-y-3.5 shadow-xs">
        <h3 className="text-sm font-extrabold text-[#20251d]">
          Checklist rápido por cômodo:
        </h3>

        <div className="space-y-2.5 text-xs">
          <div className="p-3 rounded-2xl bg-[#f8faf4] border border-[#edf1e6] space-y-1">
            <strong className="block text-[#315321] font-bold">Quarto dos Bebês e Crianças</strong>
            <p className="text-[#55604e]">
              Afastar camas 10 cm da parede, evitar saias de cama que tocam o chão e sacudir travesseiros e cobertores antes de deitar.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-[#f8faf4] border border-[#edf1e6] space-y-1">
            <strong className="block text-[#315321] font-bold">Banheiros e Áreas Úmidas</strong>
            <p className="text-[#55604e]">
              Manter ralos fechados com tampas rotativas e conferir frestas de portas que dão para quintais ou áreas externas.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-[#f8faf4] border border-[#edf1e6] space-y-1">
            <strong className="block text-[#315321] font-bold">Quintal e Garagem</strong>
            <p className="text-[#55604e]">
              Evitar pilhas de telhas, madeira ou tijolos perto da casa; manter o gramado aparado e colocar areia nos pratos de plantas.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <p className="text-[11px] text-[#838a7a] text-center leading-relaxed">
        Seus itens marcados são salvos automaticamente neste aparelho.
      </p>
    </div>
  );
};
