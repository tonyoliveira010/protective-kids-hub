import React from 'react';
import { ExternalLink, ShieldAlert, BookOpen, Building2, PhoneCall } from 'lucide-react';

interface SourcesViewProps {
  onBack?: () => void;
  onOpenEmergency: () => void;
}

export const SourcesView: React.FC<SourcesViewProps> = ({ onOpenEmergency }) => {
  const sources = [
    {
      title: 'Ministério da Saúde do Brasil',
      desc: 'Diretrizes nacionais de vigilância em saúde, guias clínicos e manuais de diagnóstico e tratamento de acidentes por animais peçonhentos.',
      tag: 'Governo Federal',
      url: 'https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/a/acidentes-por-animais-peconhentos'
    },
    {
      title: 'Instituto Butantan',
      desc: 'Centro pioneiro em pesquisa de venenos, produção de soros antipeçonhentos e educação científica sobre serpentes, aranhas e escorpiões.',
      tag: 'Pesquisa & Soros',
      url: 'https://butantan.gov.br/'
    },
    {
      title: 'Fundação Oswaldo Cruz (Fiocruz)',
      desc: 'Pesquisa científica em saúde pública, arboviroses (dengue, zika, chikungunya) e informações toxicológicas.',
      tag: 'Saúde Pública',
      url: 'https://portal.fiocruz.br/'
    },
    {
      title: 'Sociedade Brasileira de Pediatria (SBP)',
      desc: 'Recomendações e consensos pediátricos oficiais sobre primeiros socorros em acidentes domésticos e uso de repelentes em bebês e crianças.',
      tag: 'Pediatria Oficial',
      url: 'https://www.sbp.com.br/'
    },
    {
      title: 'CIATox — Centros de Informação e Assistência Toxicológica',
      desc: 'Rede nacional de auxílio médico 24h para intoxicações, envenenamentos e acidentes biológicos (0800 722 6001).',
      tag: 'Plantão Toxicológico',
      url: 'https://www.gov.br/anvisa/pt-br/assuntos/agrotoxicos/ciatox'
    },
    {
      title: 'Organização Mundial da Saúde (OMS)',
      desc: 'Estatísticas e diretrizes internacionais sobre envenenamento e controle de vetores de enfermidades tropicais.',
      tag: 'Internacional',
      url: 'https://www.who.int/'
    }
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-200 pb-12">
      <div>
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[pk-primary]">
          Informação Verificável
        </span>
        <h1 className="text-2xl font-extrabold text-[pk-text] tracking-tight">
          Fontes Oficiais & Referências 📚
        </h1>
        <p className="text-xs text-[pk-muted] mt-1">
          A plataforma Protege Kids foi concebida para aproximar famílias das recomendações da comunidade científica e de saúde pública brasileira.
        </p>
      </div>

      {/* Emergency fast card */}
      <div className="bg-[#fff3eb] rounded-3xl p-5 border border-[#ffd5bf] space-y-3">
        <div className="flex items-center gap-2.5 text-[pk-danger-text] font-bold text-sm">
          <PhoneCall className="w-5 h-5 text-[pk-danger]" />
          <h3>Centrais de Urgência no Brasil</h3>
        </div>
        <p className="text-xs text-[pk-danger-text]">
          Em caso de picada com sintomas preocupantes ou dúvida sobre a espécie do animal:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <a
            href="tel:192"
            className="flex items-center justify-between p-3 bg-pk-card rounded-xl border border-[pk-danger-border] text-xs font-bold text-[pk-danger-strong] hover:bg-orange-50 transition-colors"
          >
            <span>SAMU (Ambulância 24h)</span>
            <span className="bg-[pk-danger] text-white px-2 py-0.5 rounded-md">192</span>
          </a>
          <a
            href="tel:08007226001"
            className="flex items-center justify-between p-3 bg-pk-card rounded-xl border border-[pk-danger-border] text-xs font-bold text-[pk-primary] hover:bg-green-50 transition-colors"
          >
            <span>CIATox (Disque-Intoxicação)</span>
            <span className="bg-[pk-primary] text-white px-2 py-0.5 rounded-md">0800 722 6001</span>
          </a>
        </div>
      </div>

      {/* Sources list */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-[pk-primary] uppercase tracking-wide">
          Portais e Repositórios
        </h2>

        {sources.map((item, idx) => (
          <div key={idx} className="bg-pk-card rounded-2xl p-4 sm:p-5 border border-[pk-border] space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[pk-primary] px-2 py-0.5 bg-[pk-surface] rounded-md inline-block">
                  {item.tag}
                </span>
                <h3 className="text-base font-bold text-[pk-text]">
                  {item.title}
                </h3>
              </div>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-[pk-bg] border border-[#e2ebd6] text-[pk-primary] hover:bg-[pk-surface] transition-colors shrink-0"
                aria-label={`Abrir ${item.title}`}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <p className="text-xs text-[pk-muted] leading-relaxed">
              {item.desc}
            </p>

            <div className="pt-1">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[pk-primary] hover:underline inline-flex items-center gap-1"
              >
                <span>Acessar portal oficial</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Transparency Note */}
      <div className="p-4 bg-pk-card rounded-2xl border border-[pk-border] text-xs text-[pk-muted] space-y-1.5">
        <strong className="block text-[pk-text] font-bold">Nota de Transparência:</strong>
        <p>
          Os links listados direcionam para instituições oficiais governamentais e de pesquisa. O Protege Kids é uma ferramenta complementar de apoio à educação em saúde e não substitui a triagem clínica individual de um médico.
        </p>
      </div>
    </div>
  );
};
