import React, { useState, useEffect } from 'react';
import { ShieldCheck, Check, Sparkles, RotateCcw } from 'lucide-react';
import { CHECKLIST_ITEMS, ChecklistItem } from '../data/animals';

export const ChecklistSection: React.FC = () => {
  const [completed, setCompleted] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem('pk-checklist');
      return stored ? new Set(JSON.parse(stored)) : new Set(['c1', 'c2']);
    } catch {
      return new Set(['c1', 'c2']);
    }
  });

  const [selectedRoom, setSelectedRoom] = useState<string>('Todos');

  useEffect(() => {
    try {
      localStorage.setItem('pk-checklist', JSON.stringify([...completed]));
    } catch (e) {
      console.error(e);
    }
  }, [completed]);

  const toggleItem = (id: string) => {
    setCompleted(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const resetChecklist = () => {
    setCompleted(new Set());
  };

  const rooms = ['Todos', 'Quarto & Berço', 'Ralos & Encanamento', 'Quintal & Jardim', 'Passeios & Natureza'];

  const filteredItems = selectedRoom === 'Todos'
    ? CHECKLIST_ITEMS
    : CHECKLIST_ITEMS.filter(item => item.room === selectedRoom);

  const total = CHECKLIST_ITEMS.length;
  const done = completed.size;
  const percentage = Math.round((done / total) * 100);

  return (
    <div className="bg-pk-card rounded-3xl p-5 sm:p-6 border border-pk-border space-y-5 shadow-xs">
      {/* Title & Progress Header */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-pk-primary">
              Ambiente Seguro
            </span>
            <h2 className="text-xl font-extrabold text-pk-text tracking-tight">
              Checklist de Proteção no Lar 🌱
            </h2>
            <p className="text-xs text-pk-muted mt-0.5">
              Hábitos simples que eliminam até 80% das chances de acidentes com animais peçonhentos.
            </p>
          </div>

          <button
            onClick={resetChecklist}
            className="p-2 rounded-xl text-[#8b9284] hover:text-pk-text hover:bg-pk-surface transition-colors shrink-0"
            title="Recomeçar checklist"
            aria-label="Recomeçar checklist"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="bg-[#f2f6eb] rounded-2xl p-3.5 border border-[#e2ebd4] space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-pk-primary">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-pk-primary" />
              Progresso de Segurança
            </span>
            <span className="tabular-nums font-extrabold">{done} de {total} ({percentage}%)</span>
          </div>
          <div className="w-full h-2.5 bg-[#dbe6cb] rounded-full overflow-hidden">
            <div 
              className="h-full bg-pk-primary rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
          {percentage === 100 && (
            <div className="text-[11px] font-bold text-[#2d521c] flex items-center gap-1 pt-1">
              <Sparkles className="w-3.5 h-3.5 text-pk-danger" />
              Parabéns! Sua casa está super preparada e protegida!
            </div>
          )}
        </div>
      </div>

      {/* Room Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {rooms.map(room => (
          <button
            key={room}
            onClick={() => setSelectedRoom(room)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedRoom === room
                ? 'bg-pk-primary text-white shadow-xs'
                : 'bg-[#f4f7ee] text-[#555e4e] hover:bg-[#ebf0e2]'
            }`}
          >
            {room}
          </button>
        ))}
      </div>

      {/* Items list */}
      <div className="space-y-2.5">
        {filteredItems.map((item: ChecklistItem) => {
          const isDone = completed.has(item.id);
          return (
            <button
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3.5 group ${
                isDone 
                  ? 'bg-[#f9fbf7] border-[#d7e4c7]' 
                  : 'bg-pk-card border-pk-border hover:border-pk-border'
              }`}
            >
              {/* Checkbox circle */}
              <div 
                className={`w-6 h-6 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                  isDone 
                    ? 'bg-pk-primary text-white shadow-xs' 
                    : 'border-2 border-[#ccd4c0] group-hover:border-pk-primary'
                }`}
              >
                {isDone && <Check className="w-4 h-4 stroke-[3]" />}
              </div>

              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-sm font-bold ${isDone ? 'line-through text-pk-muted' : 'text-pk-text'}`}>
                    {item.title}
                  </span>
                  <span className="text-[10px] font-semibold text-[#8b9284] px-2 py-0.5 rounded-md bg-pk-surface shrink-0">
                    {item.room}
                  </span>
                </div>
                <p className="text-xs text-pk-muted leading-relaxed">
                  {item.description}
                </p>
                <div className="text-[11px] text-pk-primary font-semibold pt-0.5">
                  💡 Dica prática: {item.tip}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
