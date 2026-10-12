import React from 'react';
import { PhoneCall, AlertTriangle, X, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-pk-card rounded-t-3xl sm:rounded-3xl shadow-2xl border border-pk-border overflow-hidden max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="emergency-title"
      >
        {/* Header */}
        <div className="bg-pk-danger-bg border-b border-pk-danger-border p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-pk-danger text-white flex items-center justify-center font-bold">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-pk-danger">Atendimento de Urgência</span>
              <h2 id="emergency-title" className="text-lg font-bold text-pk-danger-text">Canais Oficiais Imediatos</h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/80 hover:bg-pk-card text-pk-danger-text flex items-center justify-center transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200/70 text-sm text-amber-900 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold mb-1">Mantenha a calma e observe a criança:</strong>
              Se houver <strong>dificuldade respiratória</strong>, <strong>vômitos repetidos</strong>, <strong>desmaio</strong> ou suspeita de <strong>escorpião em bebê ou criança</strong>, procure socorro médico agora mesmo.
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-pk-muted">Ligue gratuitamente (Brasil)</h3>

            {/* SAMU 192 */}
            <a 
              href="tel:192" 
              className="flex items-center justify-between p-4 bg-pk-danger hover:bg-pk-danger-strong text-white rounded-2xl transition-all shadow-md group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  <PhoneCall className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white/80">Emergência Médica / Resgate</div>
                  <div className="text-xl font-extrabold tracking-tight">Ligar para o SAMU 192</div>
                  <div className="text-xs text-white/90">Ambulância e orientação médica por telefone</div>
                </div>
              </div>
              <span className="text-lg font-bold bg-white/20 px-3 py-1 rounded-lg">192</span>
            </a>

            {/* CIATox Anvisa */}
            <a 
              href="tel:08007226001" 
              className="flex items-center justify-between p-4 bg-pk-primary hover:bg-pk-primary-strong text-white rounded-2xl transition-all shadow-md group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  <PhoneCall className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white/80">Disque-Intoxicação Nacional (Anvisa)</div>
                  <div className="text-base font-extrabold">0800 722 6001</div>
                  <div className="text-xs text-white/90">Especialistas em picadas e plantas tóxicas</div>
                </div>
              </div>
              <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-lg">Gratuito</span>
            </a>

            {/* Bombeiros 193 */}
            <a 
              href="tel:193" 
              className="flex items-center justify-between p-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pk-card flex items-center justify-center text-slate-700">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">Corpo de Bombeiros</div>
                  <div className="text-sm font-bold text-slate-900">Resgate de ninhos / Colmeias (193)</div>
                </div>
              </div>
              <span className="text-sm font-bold text-slate-600">193</span>
            </a>
          </div>

          {/* O que informar na ligação */}
          <div className="p-4 bg-pk-bg border border-pk-border rounded-2xl space-y-2 text-xs text-pk-muted">
            <div className="font-bold text-pk-primary text-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Ao falar com o médico regulador:
            </div>
            <ul className="list-disc pl-4 space-y-1">
              <li>Informe a idade exata e peso aproximado da criança.</li>
              <li>Diga há quanto tempo o acidente aconteceu.</li>
              <li>Descreva se viu o animal (ou tire foto com segurança, sem tentar capturá-lo).</li>
              <li>Relate sinais: dor intensa, vômitos, suor frio ou dificuldade de respirar.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-sm transition-colors"
          >
            Fechar Janela
          </button>
        </div>
      </div>
    </div>
  );
};
