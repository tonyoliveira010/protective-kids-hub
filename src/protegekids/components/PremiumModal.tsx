import React from 'react';
import { X, Check, Crown, ShieldAlert, Sparkles, Heart, Bell, MapPin, Download, Navigation } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPremiumUser: boolean;
  onTogglePremium: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  isPremiumUser,
  onTogglePremium
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#e8ecdf] overflow-hidden max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="premium-title"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#dfff55] to-[#cfe94b] p-5 sm:p-6 flex items-start justify-between border-b border-[#c4dc3c]">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-[#315321] bg-white/70 px-2.5 py-0.5 rounded-full">
              <Crown className="w-3.5 h-3.5 text-[#315321]" /> Protege Kids Família
            </span>
            <h2 id="premium-title" className="text-xl sm:text-2xl font-extrabold text-[#20251d] tracking-tight">
              Prevenção Ampliada & Conveniência 🛡️
            </h2>
            <p className="text-xs text-[#354326] font-medium leading-relaxed">
              Recursos adicionais para o dia a dia da família, sem nunca bloquear informações de emergência.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#20251d] flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-sm">
          {/* Ethical Guarantee Box */}
          <div className="p-4 bg-[#f8faf4] rounded-2xl border border-[#e2ebd6] text-xs text-[#4c5544] space-y-1.5">
            <div className="font-bold text-[#315321] text-xs sm:text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#537d37]" /> Nosso Compromisso Ético:
            </div>
            <p className="leading-relaxed">
              O acesso a números de emergência (SAMU 192, CIATox 0800), primeiros socorros imediatos e à lista básica de hospitais públicos é e sempre será <strong>100% gratuito</strong> para toda a sociedade.
            </p>
          </div>

          {/* Comparison Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#73796d]">
              Comparativo de Recursos
            </h3>

            <div className="border border-[#e8ecdf] rounded-2xl overflow-hidden divide-y divide-[#edf1e6] text-xs">
              {/* Row 1 */}
              <div className="p-3 bg-[#fbfdf9] flex items-center justify-between">
                <span className="font-semibold text-[#20251d]">Guia educativo e fichas de animais</span>
                <span className="text-emerald-700 font-bold">Gratuito & Premium</span>
              </div>
              {/* Row 2 */}
              <div className="p-3 flex items-center justify-between">
                <span className="font-semibold text-[#20251d]">Contatos de emergência (SAMU e CIATox)</span>
                <span className="text-emerald-700 font-bold">Gratuito & Premium</span>
              </div>
              {/* Row 3 */}
              <div className="p-3 bg-[#fbfdf9] flex items-center justify-between">
                <span className="font-semibold text-[#20251d]">Consulta de hospitais públicos de referência</span>
                <span className="text-emerald-700 font-bold">Gratuito & Premium</span>
              </div>
              {/* Row 4 (Premium exclusive) */}
              <div className="p-3 flex items-center justify-between bg-amber-50/50">
                <span className="font-bold text-[#20251d] flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-500" /> Salvar hospitais favoritos da família
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[#dfff55] text-[#2c4717] font-extrabold text-[10px]">
                  Exclusivo Premium
                </span>
              </div>
              {/* Row 5 */}
              <div className="p-3 flex items-center justify-between bg-amber-50/50">
                <span className="font-bold text-[#20251d] flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-[#ea580c]" /> Traçado rápido de rotas com 1 toque
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[#dfff55] text-[#2c4717] font-extrabold text-[10px]">
                  Exclusivo Premium
                </span>
              </div>
              {/* Row 6 */}
              <div className="p-3 flex items-center justify-between bg-amber-50/50">
                <span className="font-bold text-[#20251d] flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-amber-600" /> Alertas sazonais de picadas por região
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[#dfff55] text-[#2c4717] font-extrabold text-[10px]">
                  Exclusivo Premium
                </span>
              </div>
              {/* Row 7 */}
              <div className="p-3 flex items-center justify-between bg-amber-50/50">
                <span className="font-bold text-[#20251d] flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5 text-[#315321]" /> Modo offline para viagens e sítios
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[#dfff55] text-[#2c4717] font-extrabold text-[10px]">
                  Exclusivo Premium
                </span>
              </div>
            </div>
          </div>

          {/* Plan simulation card */}
          <div className="p-4 bg-gradient-to-br from-[#f8faf4] to-[#edf4df] rounded-2xl border border-[#dfe7d2] flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-[#537d37] uppercase">Simulação de Demonstração</span>
              <strong className="block text-sm font-extrabold text-[#20251d]">Status da sua conta:</strong>
              <span className="text-xs text-[#73796d]">
                {isPremiumUser ? '⭐ Plano Premium Ativo (Modo Teste)' : 'Acesso Padrão Gratuito'}
              </span>
            </div>

            <button
              onClick={() => {
                onTogglePremium();
              }}
              className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all shadow-xs cursor-pointer ${
                isPremiumUser
                  ? 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                  : 'bg-[#315321] hover:bg-[#253f19] text-white'
              }`}
            >
              {isPremiumUser ? 'Desativar Premium' : 'Ativar Modo Premium'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
};
