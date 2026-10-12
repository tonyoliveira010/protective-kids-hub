import { CATALOG_99_SPECIES, CatalogSpecies } from './speciesCatalog';
import { Animal } from './animals';

// Helper mapping for group to general category
function mapGroupToCategory(grupo: CatalogSpecies['grupo']): Animal['category'] {
  switch (grupo) {
    case 'Escorpiões':
    case 'Aranhas':
    case 'Carrapatos':
      return 'Aracnídeos';
    case 'Lacraias':
      return 'Miriápodes';
    case 'Serpentes':
      return 'Outros';
    case 'Outros pequenos animais':
    case 'Parasitas':
      return 'Outros';
    default:
      return 'Insetos';
  }
}

// Helper mapping for emoji by group
function getEmojiForSpecies(grupo: CatalogSpecies['grupo'], nomeCientifico: string): string {
  switch (grupo) {
    case 'Escorpiões': return '🦂';
    case 'Aranhas': 
      if (nomeCientifico.includes('Phoneutria')) return '🕸️';
      return '🕷️';
    case 'Serpentes': return '🐍';
    case 'Lagartas': return '🐛';
    case 'Abelhas e vespas': return '🐝';
    case 'Formigas': return '🐜';
    case 'Carrapatos': return '🪳';
    case 'Baratas': return '🪳';
    case 'Lacraias': return '🐛';
    case 'Mosquitos': return '🦟';
    case 'Barbeiros': return '🪲';
    case 'Parasitas': return '🔬';
    case 'Outros insetos': 
      if (nomeCientifico.includes('Paederus')) return '🪲';
      return '🪰';
    default: return '🐾';
  }
}

// Helper mapping for risk level
function mapRiskLevel(risco: CatalogSpecies['risco'], grupo: CatalogSpecies['grupo']): Animal['riskLevel'] {
  if (risco === 'alto' && (grupo === 'Escorpiões' || grupo === 'Aranhas' || grupo === 'Serpentes' || grupo === 'Lagartas')) {
    return 'Urgência pediátrica (Peçonhento)';
  }
  if (risco === 'alto' || risco === 'medio-alto') {
    if (grupo === 'Mosquitos' || grupo === 'Barbeiros' || grupo === 'Carrapatos') {
      return 'Vetor de doenças';
    }
    return 'Urgência pediátrica (Peçonhento)';
  }
  if (risco === 'medio') {
    return 'Atenção e cuidados';
  }
  return 'Baixo risco';
}

// Map curated high quality Unsplash photos
function getImageForSpecies(id: number): { imageUrl?: string; imageCaption?: string; sizeApprox?: string; visualTraits?: string[] } {
  switch (id) {
    case 1:
      return {
        imageUrl: 'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=800&auto=format&fit=crop&q=80',
        imageCaption: 'Tityus serrulatus (Escorpião-amarelo): tronco escuro com pernas e cauda amarelo-claras, serrilha na cauda e ferrão afiado com glândula de veneno.',
        sizeApprox: '6 a 7 cm de comprimento',
        visualTraits: [
          'Pernas e cauda amarelo-claras sem manchas',
          'Tronco castanho-escuro a preto',
          'Serrilha serrilhada nos anéis 3 e 4 da cauda',
          'Espinho subaculear embaixo do ferrão principal'
        ]
      };
    case 2:
      return {
        imageUrl: 'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=800&auto=format&fit=crop&q=80',
        imageCaption: 'Tityus bahiensis (Escorpião-marrom): coloração marrom-escura homogênea com manchas avermelhadas e pernas manchadas.',
        sizeApprox: '5 a 7 cm de comprimento',
        visualTraits: [
          'Pernas e pedipalpos com manchas escuras',
          'Coloração geral marrom-escura',
          'Sem serrilha pronunciada na cauda'
        ]
      };
    case 6:
    case 7:
    case 8:
      return {
        imageUrl: 'https://images.unsplash.com/photo-1582234033320-b49b3924f92b?w=800&auto=format&fit=crop&q=80',
        imageCaption: 'Loxosceles (Aranha-marrom): coloração marrom uniforme com mancha sutil em forma de violino no cefalotórax e pernas finas.',
        sizeApprox: '1 cm de corpo (até 3-4 cm com as pernas)',
        visualTraits: [
          'Coloração marrom uniforme e sem pelos vistosos',
          'Pequeno violino escuro desenhado no dorso do tórax',
          '6 olhos dispostos em 3 pares (díades)',
          'Postura achatada rente ao substrato'
        ]
      };
    case 19:
      return {
        imageUrl: 'https://images.unsplash.com/photo-1588636142475-a62d56692870?w=800&auto=format&fit=crop&q=80',
        imageCaption: 'Phoneutria (Aranha-armadeira): postura típica de ataque erguendo os dois pares de patas dianteiras e quelíceras com pelos avermelhados.',
        sizeApprox: '3 a 5 cm de corpo (até 15 cm com pernas)',
        visualTraits: [
          'Ergue patas dianteiras em sinal de defesa agressiva',
          'Quelíceras com cerdas alaranjadas ou vermelhas',
          'Corpo robusto marrom-acinzentado com espinhos nas pernas'
        ]
      };
    case 25:
      return {
        imageUrl: 'https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=800&auto=format&fit=crop&q=80',
        imageCaption: 'Bothrops jararaca (Jararaca): padrão de desenhos em V invertido / trapézio ao longo do dorso, fosseta loreal e cauda afilada.',
        sizeApprox: '80 a 120 cm de comprimento',
        visualTraits: [
          'Desenhos em "V" invertido ou ferraduras pelo dorso',
          'Fosseta loreal (orifício entre o olho e a narina)',
          'Cabeça triangular com escamas pequenas e pontudas'
        ]
      };
    case 36:
      return {
        imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
        imageCaption: 'Crotalus durissus (Cascavel): guizo / chocalho córneo na extremidade da cauda e desenhos em losangos claros e escuros.',
        sizeApprox: '100 a 150 cm de comprimento',
        visualTraits: [
          'Chocalho (guizo) característico na ponta da cauda',
          'Padrão dorsal de losangos com bordas claras',
          'Som de alerta característico emitido pelo chocalho'
        ]
      };
    case 38:
      return {
        imageUrl: 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?w=800&auto=format&fit=crop&q=80',
        imageCaption: 'Micrurus (Coral-verdadeira): anéis completos coloridos em vermelho, preto e branco/amarelo ao redor de todo o corpo e ventre.',
        sizeApprox: '60 a 90 cm de comprimento',
        visualTraits: [
          'Anéis completos que contornam também o ventre',
          'Olhos pretos pequenos e cabeça arredondada',
          'Dentição proteróglifa (presas anteriores fixas pequenas)'
        ]
      };
    case 46:
      return {
        imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
        imageCaption: 'Lonomia obliqua (Taturana-de-fogo): espinhos ramificados em formato de pequenos pinheiros verdes-acinzentados agrupados em troncos.',
        sizeApprox: '4 a 6 cm de comprimento',
        visualTraits: [
          'Espinhos pontiagudos ramificados em forma de pinheirinhos ("espinhas")',
          'Mancha em formato de "U" ou "V" branco no dorso',
          'Costumam agrupar-se em colônias nos troncos de árvores'
        ]
      };
    case 49:
      return {
        imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80',
        imageCaption: 'Apis mellifera (Abelha africanizada): corpo listrado em amarelo e preto com ferrão farpado que se desprende após a ferroada.',
        sizeApprox: '12 a 15 mm',
        visualTraits: [
          'Listras transversais castanho-douradas e pretas',
          'Corpo piloso que transporta pólen',
          'Ferrão com farpas que fica preso na pele'
        ]
      };
    case 54:
      return {
        imageUrl: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=800&auto=format&fit=crop&q=80',
        imageCaption: 'Solenopsis invicta (Formiga-de-fogo): coloração avermelhada/acobreada, picada dolorosa seguida por pústula estéril em 24h.',
        sizeApprox: '2 a 6 mm de comprimento',
        visualTraits: [
          'Coloração avermelhada a castanho-escura',
          'Comportamento agressivo em formigueiros de terra fofa',
          'Pica com as mandíbulas e ferroa repetidamente com o abdômen'
        ]
      };
    case 59:
      return {
        imageUrl: 'https://images.unsplash.com/photo-1535083783855-76ae62b2914e?w=800&auto=format&fit=crop&q=80',
        imageCaption: 'Amblyomma sculptum (Carrapato-estrela): escudo dorsal escuro com pontuações e linhas claras características (estrela).',
        sizeApprox: '3 a 5 mm (não ingurgitado) até 1,5 cm (fêmea ingurgitada)',
        visualTraits: [
          'Escudo dorsal rígido com desenhos e pontuações claras',
          'Corpo oval achatado dorso-ventralmente',
          'Fases jovens (micuins) minúsculas e muito numerosas'
        ]
      };
    case 70:
      return {
        imageUrl: 'https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?w=800&auto=format&fit=crop&q=80',
        imageCaption: 'Scolopendra (Lacraia): corpo alongado e achatado com múltiplos segmentos, cada um com 1 par de pernas e forcípulas venenosas na cabeça.',
        sizeApprox: '10 a 25 cm de comprimento',
        visualTraits: [
          'Corpo segmentado articulado marrom, verde ou avermelhado',
          'Um par de pernas por segmento locomotor',
          'Forcípulas fortes em formato de pinça modificada sob a cabeça'
        ]
      };
    case 76:
      return {
        imageUrl: 'https://images.unsplash.com/photo-1563281577-a7be47e20db9?w=800&auto=format&fit=crop&q=80',
        imageCaption: 'Aedes aegypti: pernas com escamas brancas nítidas em anéis e desenho de instrumento em lira branca no dorso do tórax.',
        sizeApprox: '5 a 7 mm de comprimento',
        visualTraits: [
          'Pernas pretas com faixas brancas bem contrastantes',
          'Desenho prateado em formato de lira/harpa no tórax',
          'Voo baixo, silencioso e hábitos diurnos (início da manhã e entardecer)'
        ]
      };
    case 87:
      return {
        imageUrl: 'https://images.unsplash.com/photo-1583301286816-f4f05e1e8b25?w=800&auto=format&fit=crop&q=80',
        imageCaption: 'Triatoma infestans (Barbeiro): percevejo hematófago com rostro reto que se dobra sob a cabeça e conexivo com manchas.',
        sizeApprox: '2,5 a 3 cm de comprimento',
        visualTraits: [
          'Rostro (tromba) reto e fino que não ultrapassa o 1º par de pernas',
          'Borda do abdômen (conexivo) com manchas pretas e amarelas',
          'Hábitos noturnos e abrigo em frestas de paredes'
        ]
      };
    case 93:
      return {
        imageUrl: 'https://images.unsplash.com/photo-1568644396922-5c3bfae12521?w=800&auto=format&fit=crop&q=80',
        imageCaption: 'Paederus (Potó): besouro esguio com cabeça e asas curtas pretas e tórax e abdômen alaranjados vibrantes.',
        sizeApprox: '7 a 13 mm de comprimento',
        visualTraits: [
          'Padrão bicolor alternado: cabeça preta, tórax laranja, asas pretas e abdômen laranja com ponta preta',
          'Corpo fino, alongado e flexível que lembra uma formiguinha alada',
          'Voa em direção a lâmpadas brancas e fluorescentes à noite'
        ]
      };
    default:
      return {};
  }
}

// Generate specialized clinical protocol for each group
function buildClinicalData(specie: CatalogSpecies): {
  isPeconhento: boolean;
  dangerLevel: Animal['dangerLevel'];
  riskText: string;
  whereText: string;
  symptomsText: string;
  alarmSignals: string[];
  prevention: string[];
  action: string;
  forbidden: string[];
} {
  const grupo = specie.grupo;
  const risco = specie.risco;
  const isHigh = risco === 'alto';
  const isMedHigh = risco === 'medio-alto';
  const isMed = risco === 'medio';

  let dangerLevel: Animal['dangerLevel'] = 'Baixo';
  if (isHigh) dangerLevel = 'Alto';
  else if (isMedHigh || isMed) dangerLevel = 'Médio';

  const isPeconhento = (
    grupo === 'Escorpiões' ||
    (grupo === 'Aranhas' && !['Lycosidae', 'Theraphosidae'].includes(specie.nome_cientifico)) ||
    (grupo === 'Serpentes' && !['Boa constrictor', 'Eunectes murinus'].includes(specie.nome_cientifico)) ||
    (grupo === 'Lagartas') ||
    grupo === 'Abelhas e vespas'
  );

  let whereText = 'Ambientes úmidos, frestas, entulhos, caixas de papelão e vegetação de quintal.';
  let symptomsText = 'Dor localizada, vermelhidão e inchaço no ponto do contato.';
  let alarmSignals: string[] = ['Dor intensa persistente', 'Inchaço progressivo', 'Alergia súbita'];
  let prevention: string[] = [
    'Manter o quarto e área de lazer das crianças limpos e arejados.',
    'Inspecionar calçados, roupas e toalhas antes de vestir.',
    'Vedar frestas em portas e ralos com telas protetoras.'
  ];
  let action = 'Lave a região com água corrente e sabão neutro. Mantenha a criança calma e acolhida.';
  let forbidden: string[] = [
    'NUNCA amarre torniquete no membro afetado.',
    'NUNCA corte, perfure ou tente sugar o veneno.',
    'NUNCA aplique café, álcool, ervas ou substâncias caseiras.'
  ];

  // Group-specific enrichments
  if (grupo === 'Escorpiões') {
    whereText = 'Frestas de paredes, caixas de gordura, redes de esgoto, entulhos, rodapés, calçados e roupas caídas no chão.';
    symptomsText = 'Dor local muito intensa e lancinante imediata, choro inconsolável na criança, sudorese profusa, salivação e vômitos.';
    alarmSignals = [
      'Vômitos repetidos e salivação abundante',
      'Suor frio, palidez e extremidades frias',
      'Agitação motora ou sonolência excessiva',
      'Dificuldade para respirar e taquicardia'
    ];
    prevention = [
      'Afaste berços e camas pelo menos 10 cm das paredes.',
      'Nunca deixe roupas de cama, mosquiteiros ou cortinas tocando o chão.',
      'Sacuda sapatos e roupas antes de vestir nas crianças.',
      'Mantenha ralos de pias e banheiros vedados com grelhas ou tampas.',
      'Controle baratas na residência (alimento principal dos escorpiões).'
    ];
    action = 'Lave o local com água e sabão e LEVE A CRIANÇA IMEDIATAMENTE ao pronto-socorro ou hospital polo de soro antiescorpiônico (SUS 192). Em crianças pequenas, o tempo é fator determinante.';
    forbidden = [
      'NUNCA faça torniquete ou garrote (aumenta o risco de necrose).',
      'NUNCA corte, fure ou sugue o veneno.',
      'NUNCA aplique gelo diretamente ou pomadas sem ordem médica.',
      'NUNCA perca tempo buscando receitas caseiras antes de ir ao hospital.'
    ];
  } else if (grupo === 'Aranhas') {
    if (specie.nome_cientifico.includes('Loxosceles')) {
      whereText = 'Habita locais escuros e secos dentro de casa: atrás de quadros, atrás de rodapés, armários, frestas de tijolos e roupas guardadas.';
      symptomsText = 'A picada costuma ser indolor no início. Horas depois (6 a 12h) surge dor em queimação, vermelhidão e mancha central pálida ou arroxeada (mancha marmórea).';
      alarmSignals = [
        'Escurecimento ou bolha escura na pele picada',
        'Urina escura cor de refrigerante de cola (sinal de hemólise)',
        'Febre alta, fraqueza pronunciada ou icterícia (olhos amarelos)'
      ];
      prevention = [
        'Bata e sacuda roupas e sapatos antes de usar.',
        'Limpe periodicamente atrás de quadros, cortinas e móveis pesados.',
        'Evite acumular caixas de papelão e roupas no chão do quarto infantil.'
      ];
      action = 'Lave com água e sabão e aplique compressa FRIA ou bolsa de gelo com pano fino (o frio diminui a ação das toxinas necróticas). Busque avaliação médica em unidade de saúde.';
      forbidden = [
        'NÃO aplique compressas quentes (o calor acelera o dano necrótico tecidual).',
        'NÃO esprema bolhas nem passe pomadas sem receita.',
        'NÃO subestime a picada caso não doa nas primeiras horas.'
      ];
    } else if (specie.nome_cientifico.includes('Phoneutria')) {
      whereText = 'Bananeiras, folhagens, entulhos, caixas de frutas, sapatos e cantos escuros de quintais e garagens.';
      symptomsText = 'Dor imediata violentíssima que irradia pelo membro, formigamento, sudorese, agitação e priapismo (ereção involuntária dolorosa) em meninos.';
      alarmSignals = [
        'Choro desesperado de dor intensa incontrolável',
        'Vômitos repetidos e sudorese fria generalizada',
        'Queda da pressão ou palpitações cardíacas aceleradas'
      ];
      prevention = [
        'Inspecione calçados antes de calçar as crianças.',
        'Mantenha quintais e gramados capinados sem acúmulo de madeira.',
        'Use botas e luvas em atividades de jardinagem.'
      ];
      action = 'Lave com água e sabão e procure hospital de referência de emergência pediátrica para analgesia e avaliação de soro antiaracnídico (SAMU 192).';
      forbidden = [
        'NUNCA garroteie o membro picado.',
        'NÃO tente perfurar ou queimar o local.',
        'NÃO tente capturar a aranha com as mãos nuas.'
      ];
    } else if (specie.nome_cientifico.includes('Latrodectus')) {
      whereText = 'Áreas litorâneas, dunas, sob pedras, cascas de árvores e frestas de alvenaria em regiões quentes.';
      symptomsText = 'Dor no local que se espalha para o corpo, tremores, rigidez muscular, dor no abdômen (que pode simular apendicite) e sudorese.';
      alarmSignals = ['Abdômen rígido e contraído', 'Espasmos musculares dolorosos', 'Dificuldade respiratória'];
      action = 'Lave o local e conduza a criança imediatamente a um serviço de urgência com CIATox e soro antilatrodéctico.';
    } else {
      whereText = 'Gramados, jardins, sob pedras e frestas de muros.';
      symptomsText = 'Dor localizada leve a moderada similar a uma picada de abelha. Pelos da caranguejeira podem causar coceira e irritação nos olhos/pele.';
      alarmSignals = ['Reação alérgica extensa', 'Coceira ocular intensa por contato com pelos'];
      action = 'Lave o local com água e sabão. Se houver cerdas urticantes na pele, retire-as com fita adesiva suavemente e lave com água fria.';
    }
  } else if (grupo === 'Serpentes') {
    if (specie.nome_cientifico.includes('Bothrops')) {
      whereText = 'Florestas, beiras de rios, áreas agrícolas, plantações, capoeiras e matagais periurbanos.';
      symptomsText = 'Dor intensa imediata, inchaço que sobe pelo membro, manchas arroxeadas (equimoses), sangramento no local da picada, gengivas ou urina.';
      alarmSignals = [
        'Edema que aumenta rapidamente de tamanho',
        'Sangramento espontâneo nas gengivas ou urina avermelhada',
        'Sonolência, tontura e palidez'
      ];
      prevention = [
        'Usar botas de cano alto ou perneiras em trilhas e áreas rurais (protege 80% das picadas).',
        'Não colocar as mãos em tocas, buracos ou sob troncos caídos.',
        'Manter arredores da casa livres de mato alto e lixo (que atrai ratos).'
      ];
      action = 'Mantenha a criança deitada e em REPOUSO ABSOLUTO (não a deixe correr ou caminhar). Lave o local apenas com água e sabão. Chame SAMU 192 ou transporte imediatamente ao hospital polo com soro antibotrópico.';
      forbidden = [
        'NUNCA amarre torniquete (causa gangrena e perda do membro).',
        'NUNCA corte a pele nem chupe o veneno.',
        'NUNCA coloque pó de café, fumo, fezes de animais ou folhas na ferida.'
      ];
    } else if (specie.nome_cientifico.includes('Crotalus')) {
      whereText = 'Campos abertos, cerrados, caatinga e áreas secas pedregosas.';
      symptomsText = 'Pouca dor no local da picada. Após horas: visão dupla ou embaçada, pálpebras caídas (fácies miastênica), dores musculares generalizadas e urina escura.';
      alarmSignals = ['Queda das pálpebras superiores', 'Visão dupla ou turva', 'Urina avermelhada ou cor de chá preto (rabdomiólise)'];
      action = 'Emergência absoluta. Mantenha em repouso e transporte com urgência para soroterapia anticrotálica no hospital do SUS.';
      forbidden = ['NUNCA faça torniquete.', 'NÃO dê analgésicos sem supervisão médica.'];
    } else if (specie.nome_cientifico.includes('Micrurus')) {
      whereText = 'Debaixo de troncos, folhiço úmido, terra fofa e buracos; raramente sai em campo aberto.';
      symptomsText = 'Dor discreta inicial. Evolui com pálpebras caídas, dificuldade para engolir, paralisia de membros e insuficiência respiratória grave.';
      alarmSignals = ['Dificuldade para engolir ou falar', 'Falta de ar ou respiração fraca', 'Queda das pálpebras'];
      action = 'Emergência máxima de suporte respiratório imediato e soro antielapídico no hospital polo.';
      forbidden = ['NUNCA perca tempo esperando sintomas aparecerem.'];
    } else {
      whereText = 'Matas, capoeiras e beiras de cursos d’água.';
      symptomsText = 'Marcas de dentes sem envenenamento peçonhento. Pode haver dor mecânica e sangramento local superficial.';
      alarmSignals = ['Sinais de infecção secundária na ferida'];
      action = 'Lave vigorosamente com água e sabão. Procure unidade básica para verificação da vacina antitetânica.';
    }
  } else if (grupo === 'Lagartas') {
    if (specie.nome_cientifico.includes('Lonomia')) {
      whereText = 'Troncos de árvores frutíferas (pessegueiro, ameixeira, abacateiro) agrupadas em colônias dezenas de espécimes.';
      symptomsText = 'Dor de queimação imediata violenta no ponto do contato. Após horas ou dias: sangramentos espontâneos nas gengivas, manchas roxas na pele, urina com sangue.';
      alarmSignals = [
        'Sangramento no nariz, boca ou gengivas',
        'Urina avermelhada ou com sangue',
        'Manchas escuras ou roxas pelo corpo'
      ];
      prevention = [
        'Inspecione os troncos de árvores antes de as crianças subirem ou brincarem.',
        'Ensine a não encostar as mãos espalmadas em cascas de árvores desconhecidas.'
      ];
      action = 'Lave com água fria abundante sem esfregar. Tire foto ou recolha a lagarta com pinça em recipiente seguro e leve a criança com urgência ao hospital para dosagem de coagulação e Soro Antilonômico do Butantan.';
      forbidden = [
        'NÃO esfregue a pele.',
        'NÃO esprema cerdas.',
        'NÃO ignore sangramentos tardios dias após o contato.'
      ];
    } else {
      whereText = 'Folhas de arbustos, jardins e árvores de quintal.';
      symptomsText = 'Dor aguda em queimação, vermelhidão e inchaço no formato do contato das cerdas.';
      alarmSignals = ['Dor extrema que não cede', 'Bolhas e infecção'];
      action = 'Lave com água fria e aplique compressa de gelo para aliviar a dor aguda.';
    }
  } else if (grupo === 'Abelhas e vespas') {
    whereText = 'Beirais de telhados, ocos de árvores, caixas de medição e jardins floridos.';
    symptomsText = 'Dor aguda, vermelhidão e inchaço no local da ferroada. Em ataques múltiplos, risco de choque anafilático ou envenenamento sistêmico.';
    alarmSignals = [
      'Inchaço nos lábios, língua ou olhos',
      'Chiado no peito ou dificuldade para respirar (Anafilaxia)',
      'Tontura, desmaio ou vômitos após múltiplas picadas'
    ];
    prevention = [
      'Não se aproximar de colmeias ou enxames em árvores/telhados.',
      'Não fazer movimentos bruscos nem bater em abelhas que se aproximam.',
      'Em caso de enxame alvoroçado, correr em linha reta para local fechado.'
    ];
    action = 'RASPE O FERRÃO horizontalmente com um cartão rígido ou a unha limpa. NÃO use pinça para puxar (ela espreme a bolsa de veneno). Aplique compressa fria.';
    forbidden = [
      'NUNCA aperte o ferrão com pinça ou dedos.',
      'NÃO demore para chamar o SAMU 192 se houver inchaço facial ou falta de ar.'
    ];
  } else if (grupo === 'Formigas') {
    whereText = 'Montículos de terra em gramados, jardins, calçadas e parques infantis.';
    symptomsText = 'Dor em queimação imediata, pápula vermelha que evolui em 24h para pequena pústula branca estéril.';
    alarmSignals = ['Placas vermelhas espalhadas pelo corpo', 'Inchaço na garganta e falta de ar'];
    prevention = [
      'Inspecione a grama antes de estender toalhas para bebês engatinharem.',
      'Calce meias e sapatos fechados em áreas com formigueiros visíveis.'
    ];
    action = 'Lave a pele com água corrente e sabão neutro. Aplique compressa fria no local. Mantenha as unhas da criança curtas para não coçar.';
    forbidden = [
      'NUNCA estoure as pústulas (o líquido é estéril; estourar causa infecção bacteriana secundária).',
      'NÃO aplique álcool puro sobre as bolhas.'
    ];
  } else if (grupo === 'Carrapatos') {
    whereText = 'Pastos, gramados de beira de rio, parques urbanos frequentados por capivaras, cavalos ou cães com carrapato.';
    symptomsText = 'Fixação indolor na pele. Risco de transmissão da Febre Maculosa Brasileira (Rickettsia rickettsii).';
    alarmSignals = [
      'Febre alta de início repentino de 2 a 14 dias após a picada',
      'Dor de cabeça forte e dores no corpo',
      'Pintas vermelhas que surgem nas palmas das mãos e solas dos pés'
    ];
    prevention = [
      'Coloque meias por cima da barra das calças em trilhas e parques.',
      'Use roupas claras para facilitar a visualização do carrapato.',
      'Examine o corpo da criança (axilas, virilha e couro cabeludo) logo após voltar do parque.'
    ];
    action = 'Retire o carrapato imediatamente com uma pinça fina, segurando o mais próximo possível da pele e puxando em linha reta com firmeza sem torcer. Lave com sabão e álcool 70%. Guarde a data da picada.';
    forbidden = [
      'NUNCA queime o carrapato com fósforo na pele.',
      'NUNCA aperte o corpo do carrapato com os dedos (faz ele injetar bactérias no sangue).',
      'NUNCA aplique óleo, esmalte ou vaselina para tentar sufocá-lo.'
    ];
  } else if (grupo === 'Mosquitos') {
    whereText = 'Pratos de plantas, pneus velhos, caixas d’água destampadas, poças de chuva e sombras dentro de casa.';
    symptomsText = 'Pápulas avermelhadas pruriginosas. Vetor de arboviroses graves: Dengue, Febre Amarela, Chikungunya, Zika e Malária.';
    alarmSignals = [
      'Febre alta e dores intensas atrás dos olhos',
      'Dor abdominal forte contínua ou vômitos persistentes (sinais de alarme da dengue)',
      'Manchas vermelhas na pele e sangramento em gengivas'
    ];
    prevention = [
      'Elimine todo e qualquer acúmulo de água parada no quintal.',
      'Instale telas mosquiteiras em janelas e use repelentes adequados à idade.',
      'Use roupas compridas em horários de maior atividade dos mosquitos.'
    ];
    action = 'Lave com água e sabão. Aplique compressa fria ou loção calmante pediátrica autorizada para aliviar a coceira. Ofereça bastante água.';
    forbidden = [
      'NÃO deixe a criança coçar a picada para não infectar a pele.',
      'NÃO utilize repelentes não aprovados pela Anvisa para a faixa etária da criança.'
    ];
  } else if (grupo === 'Barbeiros') {
    whereText = 'Frestas em paredes de taipa ou alvenaria sem reboco, galinheiros, depósitos de lenha e sob colchões.';
    symptomsText = 'Picada indolor durante a noite na face ou membros. O barbeiro defeca na pele durante o repasto; coçar introduz o protozoário Trypanosoma cruzi (Doença de Chagas).';
    alarmSignals = [
      'Inchaço avermelhado indolor em uma das pálpebras com gânglio aumentado (Sinal de Romaña)',
      'Febre prolongada, cansaço e inchaço nos pés'
    ];
    prevention = [
      'Rebocar paredes com frestas e inspecionar atrás de quadros e camas.',
      'Manter abrigos de animais afastados da residência.',
      'Utilizar telas em portas e janelas.'
    ];
    action = 'Lave o local imediatamente com água e sabão abundante sem esfregar os olhos. Se encontrar o inseto, capture-o vivo em recipiente fechado com furos e entregue à Vigilância Epidemiológica do município para exame laboratorial.';
    forbidden = [
      'NUNCA esmague o barbeiro com as mãos na pele.',
      'NUNCA esfregue os olhos ou a ferida após contato.'
    ];
  } else if (grupo === 'Lacraias') {
    whereText = 'Sob entulhos, vasos de plantas, folhas caídas, ralos, caixas de esgoto e pisos úmidos de banheiros.';
    symptomsText = 'Dor intensa imediata, vermelhidão local e inchaço que pode durar várias horas.';
    alarmSignals = ['Dor desproporcional que não cede com compressa', 'Inchaço acentuado do membro'];
    prevention = [
      'Coloque telas protetoras nos ralos de chuveiro e pias.',
      'Mantenha quintais e jardins livres de folhas acumuladas e tábuas.',
      'Vede frestas de portas que dão para áreas externas.'
    ];
    action = 'Lave com água morna e sabão. Aplique compressa MORNA no local (o calor ajuda a aliviar a dor da peçonha da lacraia).';
    forbidden = ['NÃO corte o local da picada.', 'NÃO utilize torniquete.'];
  } else if (specie.nome_cientifico.includes('Paederus')) {
    // Potó
    whereText = 'Áreas sob luz branca ou lâmpadas fluorescentes à noite em períodos de transição chuva-seca.';
    symptomsText = 'O inseto não pica nem ferroa. Ao ser esmagado ou friccionado contra a pele, libera pederina, substância cáustica que gera queimadura química com vermelhidão, bolhas e lesão linear ("chicotada").';
    alarmSignals = ['Lesão perto dos olhos (risco de conjuntivite grave)', 'Bolhas que estouram e infectam'];
    prevention = [
      'Evite lâmpadas fluorescentes brancas acesas perto das camas das crianças.',
      'Coloque telas nas janelas e feche as cortinas ao entardecer.',
      'Se o potó pousar na pele da criança, ASSOPRE-O para que voe, NUNCA dê tapa nem esmague.'
    ];
    action = 'Lave IMEDIATAMENTE com água abundante e sabão se houver suspeita de esmagamento do inseto na pele. Aplique compressa fria de soro fisiológico e procure orientação médica para pomada calmante.';
    forbidden = [
      'NUNCA esmague o potó sobre a pele.',
      'NÃO esfregue os olhos com as mãos que tocaram o inseto.'
    ];
  }

  return {
    isPeconhento,
    dangerLevel,
    riskText: specie.resumo,
    whereText,
    symptomsText,
    alarmSignals,
    prevention,
    action,
    forbidden
  };
}

// Build the full 99 species Animal array
export const ALL_99_ANIMALS: Animal[] = CATALOG_99_SPECIES.map((specie) => {
  const category = mapGroupToCategory(specie.grupo);
  const emoji = getEmojiForSpecies(specie.grupo, specie.nome_cientifico);
  const riskLevel = mapRiskLevel(specie.risco, specie.grupo);
  const clinical = buildClinicalData(specie);
  const photoMeta = getImageForSpecies(specie.id);

  const fallbackSource = specie.fonte || 'Ministério da Saúde — Guia de Vigilância em Saúde';
  const fallbackUrl = specie.fonte_url || 'https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/a/acidentes-por-animais-peconhentos';

  return {
    id: `especie-${specie.id}`,
    catalogId: specie.id,
    name: specie.nome_popular,
    scientific: specie.nome_cientifico,
    category,
    emoji,
    summary: specie.resumo,
    riskLevel,
    isPeconhento: clinical.isPeconhento,
    dangerLevel: clinical.dangerLevel,
    risk: clinical.riskText,
    where: clinical.whereText,
    symptoms: clinical.symptomsText,
    alarmSignals: clinical.alarmSignals,
    prevention: clinical.prevention,
    action: clinical.action,
    forbidden: clinical.forbidden,
    source: fallbackSource,
    url: fallbackUrl,
    imageUrl: photoMeta.imageUrl,
    imageCaption: photoMeta.imageCaption,
    sizeApprox: photoMeta.sizeApprox,
    visualTraits: photoMeta.visualTraits
  };
});
