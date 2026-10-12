export type HospitalType = 'hospital_referencia' | 'ciatox' | 'upa_emergencia';

export interface HealthUnit {
  id: string;
  nome: string;
  cnes: string;
  tipo: HospitalType;
  tipoLabel: string;
  endereco: string;
  bairro?: string;
  cidade: string;
  estado: string;
  cep?: string;
  latitude: number;
  longitude: number;
  telefone: string;
  fonte_oficial: string;
  atualizado_em: string;
  atendimento_confirmado_em?: string;
  disponibilidade_soro: 'desconhecida' | 'confirmada' | 'sob_consulta';
  tem_soro_referencia: boolean;
  atendimento_indicado: string;
  plantao24h: boolean;
  observacao_seguranca?: string;
}

export const HEALTH_UNITS: HealthUnit[] = [
  // SÃO PAULO & CAMPINAS
  {
    id: 'hc-unicamp-campinas',
    nome: 'Hospital de Clínicas da Unicamp (CCI)',
    cnes: '2079792',
    tipo: 'hospital_referencia',
    tipoLabel: 'Hospital de Referência · Polo Toxicológico',
    endereco: 'Rua Vital Brasil, 251 - Cidade Universitária',
    bairro: 'Barão Geraldo',
    cidade: 'Campinas',
    estado: 'SP',
    cep: '13083-888',
    latitude: -22.8305,
    longitude: -47.0626,
    telefone: '(19) 3521-7555',
    fonte_oficial: 'Ministério da Saúde — Hospitais de Referência para Animais Peçonhentos & CNES',
    atualizado_em: '10/2026',
    atendimento_confirmado_em: '10/2026',
    disponibilidade_soro: 'sob_consulta',
    tem_soro_referencia: true,
    atendimento_indicado: 'Acidentes graves por escorpiões, aranhas-marrons, taturanas e serpentes peçonhentas. CCI 24h.',
    plantao24h: true,
    observacao_seguranca: 'Unidade com Centro de Informação Toxicológica (CCI) de referência estadual integrado ao pronto-socorro infantil e adulto.'
  },
  {
    id: 'mario-gatti-campinas',
    nome: 'Hospital Municipal Dr. Mário Gatti',
    cnes: '2080359',
    tipo: 'hospital_referencia',
    tipoLabel: 'Hospital Municipal de Urgência',
    endereco: 'Av. Prefeito Faria Lima, 340',
    bairro: 'Parque Itália',
    cidade: 'Campinas',
    estado: 'SP',
    cep: '13036-902',
    latitude: -22.9221,
    longitude: -47.0673,
    telefone: '(19) 3772-5700',
    fonte_oficial: 'Prefeitura Municipal de Campinas & CNES',
    atualizado_em: '09/2026',
    disponibilidade_soro: 'sob_consulta',
    tem_soro_referencia: true,
    atendimento_indicado: 'Pronto-socorro municipal 24h para traumas, picadas e urgências pediátricas.',
    plantao24h: true
  },
  {
    id: 'hospital-vital-brazil-sp',
    nome: 'Hospital Vital Brazil — Instituto Butantan',
    cnes: '2082262',
    tipo: 'hospital_referencia',
    tipoLabel: 'Hospital de Referência Especializado',
    endereco: 'Av. Vital Brasil, 1500',
    bairro: 'Butantã',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '05503-900',
    latitude: -23.5674,
    longitude: -46.7176,
    telefone: '(11) 2627-9529',
    fonte_oficial: 'Instituto Butantan & Ministério da Saúde',
    atualizado_em: '10/2026',
    atendimento_confirmado_em: '10/2026',
    disponibilidade_soro: 'sob_consulta',
    tem_soro_referencia: true,
    atendimento_indicado: 'Referência internacional para atendimento de envenenamentos por serpentes, aranhas, escorpiões e taturanas.',
    plantao24h: true,
    observacao_seguranca: 'Atendimento exclusivo a acidentes por animais peçonhentos 24 horas por dia.'
  },
  {
    id: 'hc-fmusp-sp',
    nome: 'Hospital das Clínicas da FMUSP (Instituto da Criança)',
    cnes: '207801X',
    tipo: 'hospital_referencia',
    tipoLabel: 'Hospital Terciário de Alta Complexidade',
    endereco: 'Rua Dr. Enéas Carvalho de Aguiar, 647',
    bairro: 'Cerqueira César',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '05403-000',
    latitude: -23.5574,
    longitude: -46.6698,
    telefone: '(11) 2661-0000',
    fonte_oficial: 'Secretaria de Estado da Saúde de SP & CNES',
    atualizado_em: '08/2026',
    disponibilidade_soro: 'sob_consulta',
    tem_soro_referencia: true,
    atendimento_indicado: 'Urgências pediátricas complexas e acidentes toxicológicos.',
    plantao24h: true
  },

  // DISTRITO FEDERAL & CENTRO-OESTE
  {
    id: 'hran-brasilia-ciatox',
    nome: 'Hospital Regional da Asa Norte (HRAN / CIATox-DF)',
    cnes: '0010499',
    tipo: 'ciatox',
    tipoLabel: 'CIATox Estadual & Hospital de Referência',
    endereco: 'SMHN Quadra 101, Lote 1',
    bairro: 'Asa Norte',
    cidade: 'Brasília',
    estado: 'DF',
    cep: '70710-100',
    latitude: -15.7876,
    longitude: -47.8867,
    telefone: '(61) 3325-4200',
    fonte_oficial: 'SES-DF & Ministério da Saúde',
    atualizado_em: '09/2026',
    atendimento_confirmado_em: '10/2026',
    disponibilidade_soro: 'sob_consulta',
    tem_soro_referencia: true,
    atendimento_indicado: 'Centro de Informação e Assistência Toxicológica do DF e pronto atendimento de envenenamentos.',
    plantao24h: true,
    observacao_seguranca: 'CIATox DF atende plantão 24h por telefone: 0800 722 6001 ou (61) 3325-4200.'
  },
  {
    id: 'hc-ufg-goiania',
    nome: 'Hospital das Clínicas da UFG / CIT-GO',
    cnes: '2338275',
    tipo: 'hospital_referencia',
    tipoLabel: 'Hospital Universitário de Referência',
    endereco: 'Primeira Avenida, S/N',
    bairro: 'Setor Leste Universitário',
    cidade: 'Goiânia',
    estado: 'GO',
    cep: '74605-020',
    latitude: -16.6749,
    longitude: -49.2435,
    telefone: '(62) 3269-8200',
    fonte_oficial: 'Ministério da Saúde — Hospitais de Referência & CNES',
    atualizado_em: '09/2026',
    disponibilidade_soro: 'sob_consulta',
    tem_soro_referencia: true,
    atendimento_indicado: 'Referência em acidentes peçonhentos e centro toxicológico de Goiás.',
    plantao24h: true
  },
  {
    id: 'hospital-cuiaba',
    nome: 'Hospital Municipal de Cuiabá (HMC Dr. Leony Palma de Carvalho)',
    cnes: '9653133',
    tipo: 'hospital_referencia',
    tipoLabel: 'Hospital e Pronto-Socorro Municipal',
    endereco: 'Rua Orivaldo M. de Souza, S/N',
    bairro: 'Ribeirão do Lipa',
    cidade: 'Cuiabá',
    estado: 'MT',
    cep: '78048-000',
    latitude: -15.5684,
    longitude: -56.1154,
    telefone: '(65) 3617-7600',
    fonte_oficial: 'Secretaria Municipal de Saúde de Cuiabá & CNES',
    atualizado_em: '08/2026',
    disponibilidade_soro: 'sob_consulta',
    tem_soro_referencia: true,
    atendimento_indicado: 'Urgências de acidentes com animais peçonhentos do Cerrado e Pantanal.',
    plantao24h: true
  },

  // MINAS GERAIS
  {
    id: 'joao-xxiii-bh',
    nome: 'Hospital João XXIII (FHEMIG / CIATox-MG)',
    cnes: '0026603',
    tipo: 'ciatox',
    tipoLabel: 'Hospital de Pronto-Socorro & CIATox Estadual',
    endereco: 'Alameda Ezequiel Dias, 225',
    bairro: 'Santa Efigênia',
    cidade: 'Belo Horizonte',
    estado: 'MG',
    cep: '30130-110',
    latitude: -19.9234,
    longitude: -43.9298,
    telefone: '(31) 3239-9200',
    fonte_oficial: 'FHEMIG & Ministério da Saúde',
    atualizado_em: '10/2026',
    atendimento_confirmado_em: '10/2026',
    disponibilidade_soro: 'sob_consulta',
    tem_soro_referencia: true,
    atendimento_indicado: 'Referência estadual absoluta em intoxicações agudas e acidentes graves por escorpiões e cobras.',
    plantao24h: true
  },

  // RIO DE JANEIRO
  {
    id: 'souza-aguiar-rj',
    nome: 'Hospital Municipal Souza Aguiar',
    cnes: '2269772',
    tipo: 'hospital_referencia',
    tipoLabel: 'Hospital Municipal de Emergência',
    endereco: 'Praça da República, 111',
    bairro: 'Centro',
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
    cep: '20211-350',
    latitude: -22.9079,
    longitude: -43.1905,
    telefone: '(21) 3111-2600',
    fonte_oficial: 'Secretaria Municipal de Saúde do RJ & CNES',
    atualizado_em: '09/2026',
    disponibilidade_soro: 'sob_consulta',
    tem_soro_referencia: true,
    atendimento_indicado: 'Urgência e emergência 24h, atendimento a picadas e envenenamentos.',
    plantao24h: true
  },

  // SUL
  {
    id: 'hc-ufpr-curitiba',
    nome: 'Complexo Hospital de Clínicas da UFPR (CIT-PR)',
    cnes: '0015520',
    tipo: 'ciatox',
    tipoLabel: 'Hospital Universitário & Centro de Toxicologia',
    endereco: 'Rua General Carneiro, 181',
    bairro: 'Alto da Glória',
    cidade: 'Curitiba',
    estado: 'PR',
    cep: '80060-150',
    latitude: -25.4263,
    longitude: -49.2612,
    telefone: '(41) 3360-1800',
    fonte_oficial: 'Secretaria de Saúde do Paraná & Ministério da Saúde',
    atualizado_em: '09/2026',
    disponibilidade_soro: 'sob_consulta',
    tem_soro_referencia: true,
    atendimento_indicado: 'Atendimento a acidentes com animais peçonhentos (Lonomia, aranhas-marrons e escorpiões).',
    plantao24h: true
  },
  {
    id: 'hps-porto-alegre',
    nome: 'Hospital de Pronto Socorro de Porto Alegre (HPS)',
    cnes: '2237609',
    tipo: 'hospital_referencia',
    tipoLabel: 'Hospital de Pronto Socorro',
    endereco: 'Largo Teodoro Herzl, S/N',
    bairro: 'Bom Fim',
    cidade: 'Porto Alegre',
    estado: 'RS',
    cep: '90040-190',
    latitude: -30.0381,
    longitude: -51.2155,
    telefone: '(51) 3289-7999',
    fonte_oficial: 'Secretaria Municipal de Saúde de Porto Alegre & CNES',
    atualizado_em: '09/2026',
    disponibilidade_soro: 'sob_consulta',
    tem_soro_referencia: true,
    atendimento_indicado: 'Urgência traumatológica e intoxicações agudas 24 horas.',
    plantao24h: true
  },

  // NORDESTE
  {
    id: 'roberto-santos-salvador',
    nome: 'Hospital Geral Roberto Santos (CIATOX-BA)',
    cnes: '0004162',
    tipo: 'ciatox',
    tipoLabel: 'Hospital Geral Estadual & CIATox',
    endereco: 'Estrada do Saboeiro, S/N',
    bairro: 'Cabula',
    cidade: 'Salvador',
    estado: 'BA',
    cep: '41180-780',
    latitude: -12.9602,
    longitude: -38.4556,
    telefone: '(71) 3117-7500',
    fonte_oficial: 'SESAB & Ministério da Saúde',
    atualizado_em: '08/2026',
    disponibilidade_soro: 'sob_consulta',
    tem_soro_referencia: true,
    atendimento_indicado: 'Polo de assistência toxicológica da Bahia para escorpiões e serpentes.',
    plantao24h: true
  },
  {
    id: 'hospital-restauracao-recife',
    nome: 'Hospital da Restauração (HR / CEATOX-PE)',
    cnes: '0000434',
    tipo: 'ciatox',
    tipoLabel: 'Hospital de Emergência & Centro Antiveneno',
    endereco: 'Av. Governador Agamenon Magalhães, S/N',
    bairro: 'Derby',
    cidade: 'Recife',
    estado: 'PE',
    cep: '52010-040',
    latitude: -8.0569,
    longitude: -34.8984,
    telefone: '(81) 3181-5400',
    fonte_oficial: 'SES-PE & Ministério da Saúde',
    atualizado_em: '09/2026',
    disponibilidade_soro: 'sob_consulta',
    tem_soro_referencia: true,
    atendimento_indicado: 'Maior polo de emergência e toxicologia de Pernambuco.',
    plantao24h: true
  },

  // NORTE
  {
    id: 'fmt-manaus',
    nome: 'Fundação de Medicina Tropical Dr. Heitor Vieira Dourado (FMT-HVD)',
    cnes: '0001090',
    tipo: 'hospital_referencia',
    tipoLabel: 'Centro de Doenças Tropicais e Peçonhentos',
    endereco: 'Av. Pedro Teixeira, 25',
    bairro: 'Dom Pedro',
    cidade: 'Manaus',
    estado: 'AM',
    cep: '69040-000',
    latitude: -3.0907,
    longitude: -60.0381,
    telefone: '(92) 2127-3555',
    fonte_oficial: 'Governo do Estado do Amazonas & Ministério da Saúde',
    atualizado_em: '10/2026',
    atendimento_confirmado_em: '10/2026',
    disponibilidade_soro: 'sob_consulta',
    tem_soro_referencia: true,
    atendimento_indicado: 'Referência pan-amazônica para acidentes ofídicos, escorpiônicos e lagartas da floresta.',
    plantao24h: true
  }
];

// Helper to compute haversine distance in kilometers
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}
