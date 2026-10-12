import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { QUIZ_QUESTIONS, QuizQuestion } from '../data/animals';

export const QuizSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, boolean>>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const currentQ: QuizQuestion = QUIZ_QUESTIONS[currentIndex] ?? QUIZ_QUESTIONS[0]!;
  const total = QUIZ_QUESTIONS.length;
  const isAnswered = userAnswers[currentQ.id] !== undefined;

  const handleAnswer = (choice: boolean) => {
    if (isAnswered) return;
    const isCorrect = choice === currentQ.correctAnswer;
    if (isCorrect) setScore(s => s + 1);
    setUserAnswers(prev => ({ ...prev, [currentQ.id]: choice }));
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex(i => i + 1);
      setShowExplanation(false);
    }
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setUserAnswers({});
    setShowExplanation(false);
    setScore(0);
  };

  const isCompleted = Object.keys(userAnswers).length === total && showExplanation;

  return (
    <div className="bg-pk-card rounded-3xl p-5 sm:p-6 border border-[pk-border] space-y-4 shadow-xs">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[pk-primary]">
            Jogo Educativo
          </span>
          <h2 className="text-xl font-extrabold text-[pk-text] tracking-tight">
            Mito ou Verdade? 🧠
          </h2>
          <p className="text-xs text-[pk-muted]">
            Teste seus conhecimentos e aprenda condutas seguras que salvam vidas.
          </p>
        </div>
        <div className="text-xs font-bold px-2.5 py-1 rounded-xl bg-[pk-surface] text-[pk-primary] shrink-0">
          Questão {currentIndex + 1}/{total}
        </div>
      </div>

      {/* Progress pill */}
      <div className="w-full h-1.5 bg-[pk-surface] rounded-full overflow-hidden">
        <div 
          className="h-full bg-[pk-primary] transition-all duration-300" 
          style={{ width: `${((currentIndex + (isAnswered ? 1 : 0)) / total) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="p-4 sm:p-5 bg-[pk-bg] rounded-2xl border border-[#e5ebe0] space-y-3">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-pk-card border border-[pk-border] text-[11px] font-bold text-[#55604d]">
          <HelpCircle className="w-3.5 h-3.5 text-[pk-primary]" />
          <span>Tema: {currentQ.badge}</span>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-[pk-text] leading-snug">
          "{currentQ.question}"
        </h3>

        {/* Buttons Verdade / Mito */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => handleAnswer(true)}
            disabled={isAnswered}
            className={`py-3 px-4 rounded-xl font-extrabold text-sm transition-all flex items-center justify-center gap-2 ${
              isAnswered
                ? currentQ.correctAnswer === true
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : userAnswers[currentQ.id] === true
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-100 text-slate-400 opacity-60'
                : 'bg-pk-card border-2 border-[pk-primary] text-[pk-primary] hover:bg-[pk-surface] active:scale-95'
            }`}
          >
            <span>VERDADE</span>
          </button>

          <button
            onClick={() => handleAnswer(false)}
            disabled={isAnswered}
            className={`py-3 px-4 rounded-xl font-extrabold text-sm transition-all flex items-center justify-center gap-2 ${
              isAnswered
                ? currentQ.correctAnswer === false
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : userAnswers[currentQ.id] === false
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-100 text-slate-400 opacity-60'
                : 'bg-pk-card border-2 border-rose-500 text-rose-700 hover:bg-rose-50 active:scale-95'
            }`}
          >
            <span>MITO</span>
          </button>
        </div>
      </div>

      {/* Feedback Card */}
      {showExplanation && (
        <div className="p-4 rounded-2xl border space-y-3 animate-in fade-in duration-200 bg-pk-card">
          <div className="flex items-center gap-2">
            {userAnswers[currentQ.id] === currentQ.correctAnswer ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-sm font-extrabold text-emerald-700">Você acertou!</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span className="text-sm font-extrabold text-rose-700">Atenção à conduta médica:</span>
              </>
            )}
          </div>

          <p className="text-xs sm:text-sm text-[pk-text] leading-relaxed bg-[pk-bg] p-3 rounded-xl border border-[pk-surface]">
            {currentQ.explanation}
          </p>

          <div className="flex justify-end pt-1">
            {currentIndex < total - 1 ? (
              <button
                onClick={nextQuestion}
                className="px-4 py-2 rounded-xl bg-[pk-primary] text-white text-xs font-bold hover:bg-[pk-primary-strong] transition-colors"
              >
                Próxima pergunta →
              </button>
            ) : (
              <button
                onClick={restartQuiz}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[pk-primary] text-white text-xs font-bold hover:bg-[pk-primary-strong] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Refazer Quiz (Acertos: {score}/{total})</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
