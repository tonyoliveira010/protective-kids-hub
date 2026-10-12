import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, HelpCircle, RotateCcw, BookOpen } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/animals';

interface MythsViewProps {
  onBack: () => void;
}

interface MythFact {
  id: number;
  category: 'Peçonhentos' | 'Primeiros Socorros' | 'Bebês e Crianças' | 'Mitos Populares';
  myth: string;
  isTrue: boolean;
  medicalFact: string;
  dangerLevel: 'Crítico (Risco de vida)' | 'Alto risco' | 'Falso e ineficaz' | 'Conduta recomendada';
  source: string;
}

const DETAILED_MYTHS: MythFact[] = [
  {
    id: 1,
    category: 'Peçonhentos',
    myth: 'Fazer torniquete ou amarrar pano apertado no membro impede o veneno de se espalhar.',
    isTrue: false,
    medicalFact: 'MITO PERIGOSO! O torniquete prende o fluxo sanguíneo, acumula a toxina no local e provoca necrose (morte) dos tecidos, aumentando drasticamente o risco de amputação. Além disso, quando solto, pode causar colapso circulatório.',
    dangerLevel: 'Crítico (Risco de vida)',
    source: 'Ministério da Saúde — Manual de Diagnóstico e Tratamento de Acidentes'
  },
  {
    id: 2,
    category: 'Bebês e Crianças',
    myth: 'Picada de escorpião em criança menor de 10 anos exige socorro hospitalar imediato.',
    isTrue: true,
    medicalFact: 'VERDADE ABSOLUTA! Devido ao menor peso corporal e rápida absorção do veneno escorpiônico, crianças pequenas têm risco elevado de insuficiência cardíaca e edema pulmonar. A administração de soro antiescorpiônico nas primeiras horas salva vidas.',
    dangerLevel: 'Conduta recomendada',
    source: 'Sociedade Brasileira de Pediatria & CIATox Nacional'
  },
  {
    id: 3,
    category: 'Primeiros Socorros',
    myth: 'Chupar o veneno da picada com a boca ou fazer pequenos cortes na pele ajuda a drenar a toxina.',
    isTrue: false,
    medicalFact: 'MITO PERIGOSO! A boca humana contém bilhões de bactérias anaeróbias que infectam a ferida. O veneno é absorvido pelos tecidos em segundos, impossibilitando sua remoção por sucção. Quem suga também se intoxica caso tenha microlesões na mucosa.',
    dangerLevel: 'Crítico (Risco de vida)',
    source: 'Instituto Butantan & Ministério da Saúde'
  },
  {
    id: 4,
    category: 'Mitos Populares',
    myth: 'Passar borra de café, querosene, álcool, alho ou esterco na picada neutraliza a peçonha.',
    isTrue: false,
    medicalFact: 'MITO GRAVÍSSIMO! Essas substâncias contaminam o local com esporos de bactérias (como tétano e infecções de pele graves), além de causar queimaduras químicas. O único procedimento correto e seguro é lavar com bastante água e sabão neutro.',
    dangerLevel: 'Alto risco',
    source: 'Centros de Informação e Assistência Toxicológica (CIATox)'
  },
  {
    id: 5,
    category: 'Primeiros Socorros',
    myth: 'Para retirar ferrão de abelha, deve-se usar uma pinça apertando bem a ponta.',
    isTrue: false,
    medicalFact: 'MITO! Apertar com pinça ou dedos pressiona a bolsa de veneno acoplada ao ferrão, injetando todo o veneno restante na corrente sanguínea. O método médico correto é raspar a superfície com a borda de um cartão plástico ou a unha limpa.',
    dangerLevel: 'Alto risco',
    source: 'Sociedade Brasileira de Pediatria (SBP)'
  },
  {
    id: 6,
    category: 'Primeiros Socorros',
    myth: 'Queimar o carrapato com fósforo aceso ou sufocá-lo com vaselina faz ele se soltar com segurança.',
    isTrue: false,
    medicalFact: 'MITO PERIGOSO! O estresse térmico ou químico faz o carrapato regurgitar seu conteúdo gástrico e saliva diretamente no sangue da criança, aumentando exponencialmente o contágio por Febre Maculosa Brasileira. Use uma pinça reta puxando para cima.',
    dangerLevel: 'Alto risco',
    source: 'Ministério da Saúde — Vigilância da Febre Maculosa'
  },
  {
    id: 7,
    category: 'Bebês e Crianças',
    myth: 'Afastar o berço pelo menos 10 cm das paredes e sacudir calçados previne acidentes domésticos.',
    isTrue: true,
    medicalFact: 'VERDADE COMPROVADA! Escorpiões e aranhas não voam nem saltam alto; eles sobem por tecidos caídos e se abrigam na ponta escura de sapatos e frestas de rodapés. Esse hábito simples elimina grande parte dos acidentes no quarto infantil.',
    dangerLevel: 'Conduta recomendada',
    source: 'Instituto Butantan — Guia de Prevenção de Acidentes'
  },
  {
    id: 8,
    category: 'Bebês e Crianças',
    myth: 'Bebês menores de 6 meses podem usar qualquer repelente comum de mosquito em aerosol.',
    isTrue: false,
    medicalFact: 'MITO! A pele dos recém-nascidos e bebês até 6 meses absorve substâncias com facilidade e seus rins/fígado ainda são imaturos para metabolizar ativos como DEET ou Icaridina. Para eles, use apenas barreiras físicas: mosquiteiro e roupas de manga longa.',
    dangerLevel: 'Alto risco',
    source: 'Consenso de Pediatria da SBP & Anvisa'
  }
];

export const MythsView: React.FC<MythsViewProps> = ({ onBack }) => {
  const [mode, setMode] = useState<'guia' | 'quiz'>('guia');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  // Quiz state
  const [currentQuizIdx, setCurrentQuizIdx] = useState<number>(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, boolean>>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  const categories = ['Todos', 'Peçonhentos', 'Primeiros Socorros', 'Bebês e Crianças', 'Mitos Populares'];

  const filteredMyths = selectedCategory === 'Todos'
    ? DETAILED_MYTHS
    : DETAILED_MYTHS.filter(m => m.category === selectedCategory);

  const currentQ = QUIZ_QUESTIONS[currentQuizIdx];
  const isQAnswered = quizAnswers[currentQ?.id] !== undefined;

  const handleQuizAnswer = (choice: boolean) => {
    if (isQAnswered) return;
    const isCorrect = choice === currentQ.correctAnswer;
    if (isCorrect) setQuizScore(s => s + 1);
    setQuizAnswers(prev => ({ ...prev, [currentQ.id]: choice }));
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentQuizIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuizIdx(i => i + 1);
      setShowExplanation(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuizIdx(0);
    setQuizAnswers({});
    setShowExplanation(false);
    setQuizScore(0);
  };

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
          Conhecimento que salva vidas
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#20251d] tracking-tight leading-tight">
          Mitos e Verdades: Primeiros Socorros 🧠
        </h1>
        <p className="text-xs sm:text-sm text-[#73796d] font-medium leading-relaxed max-w-md pt-0.5">
          Conteúdo 100% autêntico e embasado em consensos do Ministério da Saúde, CIATox, Instituto Butantan e Sociedade Brasileira de Pediatria.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="p-1 bg-[#edf1e6] rounded-2xl flex text-xs font-bold gap-1 shadow-inner">
        <button
          onClick={() => setMode('guia')}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            mode === 'guia'
              ? 'bg-[#315321] text-white shadow-xs'
              : 'text-[#626a5b] hover:text-[#20251d]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Guia Completo de Fatos</span>
        </button>
        <button
          onClick={() => setMode('quiz')}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            mode === 'quiz'
              ? 'bg-[#315321] text-white shadow-xs'
              : 'text-[#626a5b] hover:text-[#20251d]'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Desafio Interativo (Quiz)</span>
        </button>
      </div>

      {/* VIEW: GUIA COMPLETO */}
      {mode === 'guia' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Category Filter Chips */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#315321] text-white shadow-xs'
                    : 'bg-white border border-[#dfe5d5] text-[#56604e] hover:bg-[#f1f6ea]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="text-xs text-[#73796d] font-semibold">
            Mostrando <strong className="text-[#20251d]">{filteredMyths.length}</strong> orientações médicas verificadas
          </div>

          {/* Cards List */}
          <div className="space-y-3.5">
            {filteredMyths.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-5 border border-[#e8ecdf] space-y-3 shadow-xs"
              >
                {/* Header Tag */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#edf4df] text-[#315321]">
                    {item.category}
                  </span>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                    item.isTrue
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {item.isTrue ? 'VERDADE CIENTÍFICA' : 'MITO PERIGOSO'}
                  </span>
                </div>

                {/* The statement */}
                <h2 className="text-base font-extrabold text-[#20251d] leading-snug">
                  "{item.myth}"
                </h2>

                {/* Medical Fact Box */}
                <div className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed border ${
                  item.isTrue
                    ? 'bg-[#f4faf0] border-[#d8edd0] text-[#274f19]'
                    : 'bg-[#fff5f5] border-[#fcdada] text-[#5a1a1a]'
                }`}>
                  <strong className="block font-bold mb-1">
                    {item.isTrue ? '✅ Por que é verdade:' : '❌ Por que é contraindicado:'}
                  </strong>
                  <p>{item.medicalFact}</p>
                </div>

                {/* Source */}
                <div className="text-[11px] text-[#73796d] flex items-center justify-between pt-1 border-t border-[#f0f3ec]">
                  <span>Fonte médica oficial:</span>
                  <span className="font-bold text-[#315321]">{item.source}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: QUIZ INTERATIVO */}
      {mode === 'quiz' && currentQ && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#e8ecdf] space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#537d37]">
                Tema: {currentQ.badge}
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-[#edf4df] text-[#315321] tabular-nums">
                Pergunta {currentQuizIdx + 1} de {QUIZ_QUESTIONS.length}
              </span>
            </div>

            {/* Question */}
            <div className="p-4 sm:p-5 bg-[#f8faf4] rounded-2xl border border-[#e5ebe0] space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[#20251d] leading-snug">
                "{currentQ.question}"
              </h2>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handleQuizAnswer(true)}
                  disabled={isQAnswered}
                  className={`py-3 px-4 rounded-xl font-extrabold text-sm transition-all flex items-center justify-center gap-2 ${
                    isQAnswered
                      ? currentQ.correctAnswer === true
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : quizAnswers[currentQ.id] === true
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-100 text-slate-400 opacity-60'
                      : 'bg-white border-2 border-[#537d37] text-[#315321] hover:bg-[#edf4df] active:scale-95'
                  }`}
                >
                  <span>VERDADE</span>
                </button>

                <button
                  onClick={() => handleQuizAnswer(false)}
                  disabled={isQAnswered}
                  className={`py-3 px-4 rounded-xl font-extrabold text-sm transition-all flex items-center justify-center gap-2 ${
                    isQAnswered
                      ? currentQ.correctAnswer === false
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : quizAnswers[currentQ.id] === false
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-100 text-slate-400 opacity-60'
                      : 'bg-white border-2 border-rose-500 text-rose-700 hover:bg-rose-50 active:scale-95'
                  }`}
                >
                  <span>MITO</span>
                </button>
              </div>
            </div>

            {/* Answer feedback */}
            {showExplanation && (
              <div className="p-4 rounded-2xl border space-y-3 animate-in fade-in duration-200 bg-white">
                <div className="flex items-center gap-2">
                  {quizAnswers[currentQ.id] === currentQ.correctAnswer ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span className="text-sm font-extrabold text-emerald-700">Resposta Correta!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      <span className="text-sm font-extrabold text-rose-700">Atenção ao risco:</span>
                    </>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-[#383f32] leading-relaxed bg-[#f8faf4] p-3 rounded-xl border border-[#edf1e6]">
                  {currentQ.explanation}
                </p>

                <div className="flex justify-end pt-1">
                  {currentQuizIdx < QUIZ_QUESTIONS.length - 1 ? (
                    <button
                      onClick={nextQuestion}
                      className="px-4 py-2 rounded-xl bg-[#315321] text-white text-xs font-bold hover:bg-[#243d18] transition-colors"
                    >
                      Próxima questão →
                    </button>
                  ) : (
                    <button
                      onClick={resetQuiz}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#315321] text-white text-xs font-bold hover:bg-[#243d18] transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Refazer Teste (Acertos: {quizScore}/{QUIZ_QUESTIONS.length})</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
