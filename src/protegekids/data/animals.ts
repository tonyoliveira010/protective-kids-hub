import { ALL_99_ANIMALS } from './allAnimalsData';

export interface Animal {
  id: string;
  name: string;
  scientific: string;
  category: 'Insetos' | 'Aracnídeos' | 'Miriápodes' | 'Outros';
  emoji: string;
  summary: string;
  riskLevel: 'Baixo risco' | 'Atenção e cuidados' | 'Urgência pediátrica (Peçonhento)' | 'Vetor de doenças';
  isPeconhento: boolean;
  dangerLevel: 'Baixo' | 'Médio' | 'Alto';
  risk: string;
  where: string;
  symptoms: string;
  alarmSignals: string[];
  prevention: string[];
  action: string;
  forbidden: string[];
  source: string;
  url: string;
  imageUrl?: string;
  imageCaption?: string;
  sizeApprox?: string;
  visualTraits?: string[];
  catalogId?: number;
}

// 99 Catalog Species integrated
export const ANIMALS_DATA: Animal[] = ALL_99_ANIMALS;

// Map legacy IDs used across the app to the 99 species catalog
export const LEGACY_ID_MAP: Record<string, string> = {
  'escorpiao': 'especie-1',
  'aranha-marrom': 'especie-6',
  'aranha-armadeira': 'especie-19',
  'serpente-jararaca': 'especie-25',
  'serpente-cascavel': 'especie-36',
  'taturana-lonomia': 'especie-46',
  'abelha-vespa': 'especie-49',
  'formiga-fogo': 'especie-54',
  'carrapato-estrela': 'especie-59',
  'lacraia': 'especie-70',
  'mosquito': 'especie-76',
  'barbeiro': 'especie-87',
  'besouro-poto': 'especie-93'
};

export function findAnimalById(id: string | null): Animal | null {
  if (!id) return null;
  const resolvedId = LEGACY_ID_MAP[id] || id;
  return ANIMALS_DATA.find(a => a.id === resolvedId) || null;
}

export interface ChecklistItem {
  id: string;
  room: 'Quarto & Berço' | 'Quintal & Jardim' | 'Passeios & Natureza' | 'Ralos & Encanamento';
  title: string;
  description: string;
  tip: string;
}

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'c1',
    room: 'Quarto & Berço',
    title: 'Afastar berço e camas da parede',
    description: 'Manter camas a pelo menos 10 cm das paredes evita que escorpiões e aranhas subam nos colchões.',
    tip: 'Verifique também se lençóis e cobertores não estão arrastando no chão.'
  },
  {
    id: 'c2',
    room: 'Quarto & Berço',
    title: 'Sacudir sapatos e roupas antes de vestir',
    description: 'Bater os calçados e virar as meias do avesso previne o contato com aranhas-marrons e escorpiões abrigados.',
    tip: 'Faça disso uma brincadeira divertida com as crianças antes de calçar o tênis.'
  },
  {
    id: 'c3',
    room: 'Ralos & Encanamento',
    title: 'Instalar protetores tipo grelha ou ralo abre-fecha',
    description: 'Veda a principal via de entrada de escorpiões e baratas vindos da rede de esgoto pública.',
    tip: 'Mantenha os ralos fechados especialmente durante a noite.'
  },
  {
    id: 'c4',
    room: 'Quintal & Jardim',
    title: 'Manter entulho, telhas e madeira longe do chão',
    description: 'Locais escuros e secos acumulam baratas e servem de abrigo ideal para escorpiões e aranhas.',
    tip: 'Se tiver horta ou lenha, use luvas grossas e botas para manusear.'
  },
  {
    id: 'c5',
    room: 'Passeios & Natureza',
    title: 'Barreiras em trilhas e gramados (meia por cima da calça)',
    description: 'Dificulta a fixação de carrapatos durante passeios em parques e chácaras.',
    tip: 'Inspecione a pele da criança (virilhas, axilas e couro cabeludo) logo ao voltar do parque.'
  },
  {
    id: 'c6',
    room: 'Quintal & Jardim',
    title: 'Eliminar pratos de plantas e recipientes com água',
    description: 'Combate o mosquito Aedes aegypti transmissor da dengue e chikungunya.',
    tip: 'Coloque areia até a borda nos pratos de plantas ou elimine os recipientes.'
  }
];

export interface QuizQuestion {
  id: number;
  question: string;
  correctAnswer: boolean;
  explanation: string;
  badge: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Devemos amarrar um torniquete no braço ou perna após picada de escorpião ou cobra?',
    correctAnswer: false,
    explanation: 'MITO PERIGOSO! O torniquete prende a circulação, causa necrose dos tecidos e pode levar à perda do membro. O correto é apenas lavar com água e sabão e correr ao hospital.',
    badge: 'Torniquete & Veneno'
  },
  {
    id: 2,
    question: 'Suspeita de ferroada de escorpião em criança menor de 10 anos exige socorro hospitalar imediato?',
    correctAnswer: true,
    explanation: 'VERDADE ABSOLUTA! O organismo de crianças e bebês absorve a toxina com maior intensidade, podendo causar parada respiratória ou choque. Deve ser levada imediatamente ao pronto-socorro.',
    badge: 'Urgência Pediátrica'
  },
  {
    id: 3,
    question: 'Espremer ou queimar o carrapato com fósforo na pele é o método recomendado para retirá-lo?',
    correctAnswer: false,
    explanation: 'MITO! Queimar ou sufocar com óleo faz o carrapato regurgitar a saliva e fezes infectadas no sangue da criança, aumentando o risco de Febre Maculosa. Remova com uma pinça fina puxando para cima.',
    badge: 'Remoção de Carrapatos'
  },
  {
    id: 4,
    question: 'Remover o ferrão de abelha com pinça apertando o local é melhor do que raspar com um cartão?',
    correctAnswer: false,
    explanation: 'MITO! Apertar com pinça espreme a bolsa de veneno do ferrão para dentro do corpo. O modo correto é raspar a superfície da pele com um cartão plástico ou a unha limpa.',
    badge: 'Ferrão de Abelha'
  },
  {
    id: 5,
    question: 'Afastar camas e berços da parede e sacudir calçados são hábitos comprovados que evitam acidentes graves?',
    correctAnswer: true,
    explanation: 'VERDADE! Escorpiões e aranhas sobem por paredes e lençóis caídos e se abrigam na ponta escura dos sapatos. Esses pequenos hábitos reduzem drasticamente os acidentes domésticos.',
    badge: 'Prevenção Diária'
  }
];
