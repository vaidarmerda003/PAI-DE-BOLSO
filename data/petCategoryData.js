// data/petCategoryData.js
//
// Conteúdo da categoria "Pet" para o Pai de Bolso.
// Siga este mesmo formato (schema) para preencher as outras categorias
// (Elétrica, Hidráulica, Carro, Casa, Segurança, Finanças) e depois
// junte tudo num único array CATEGORIES, como no exemplo lá embaixo.

export const petCategory = {
  id: 'pet',
  nome: 'Pet',
  emoji: '🐶',
  cor: '#FF9F43', // cor do selo/etiqueta desta categoria
  descricao:
    'Encontre informações, dicas e tutoriais sobre cuidados com animais de estimação.',

  // ---- Tutoriais em formato de passo a passo ----
  tutoriais: [
    {
      id: 'pet-alimentacao-correta',
      titulo: 'Como alimentar seu pet corretamente',
      duracaoMin: 5,
      passos: [
        'Lave e higienize a vasilha antes de cada refeição.',
        'Escolha uma ração adequada para a idade e o porte do animal.',
        'Sirva a quantidade recomendada pelo fabricante ou pelo veterinário.',
        'Deixe sempre água limpa e fresca disponível.',
        'Após a alimentação, lave a vasilha novamente.',
      ],
    },
  ],

  // ---- Área de dúvidas (perguntas e respostas da comunidade) ----
  // "respostas" começa vazio: é preenchido quando outros usuários respondem.
  duvidas: [
    'Qual é a melhor ração para filhotes?',
    'Quantas vezes por dia devo alimentar meu cachorro?',
    'Como ensinar meu gato a usar a caixa de areia?',
    'Meu cachorro está sem apetite. O que pode ser?',
    'Quais vacinas são obrigatórias para cães e gatos?',
    'Como remover pulgas e carrapatos de forma segura?',
    'Com que frequência devo dar banho no meu pet?',
    'Meu gato arranha os móveis. Como posso evitar isso?',
    'Como viajar com meu animal de estimação?',
    'Quais alimentos são proibidos para cães e gatos?',
    'Como saber se meu pet está doente?',
    'Como acostumar um filhote a ficar sozinho em casa?',
    'Qual é a melhor forma de escovar os dentes do meu pet?',
    'Como cortar as unhas do meu cachorro sem machucá-lo?',
    'Meu pet está acima do peso. O que devo fazer?',
  ].map((texto, i) => ({
    id: `pet-duvida-${i + 1}`,
    texto,
    autor: null, // preencher com o usuário logado ao publicar de verdade
    selo: 'pet',
    respostas: [],
    criadoEm: null,
  })),

  // ---- Publicações (posts livres da comunidade) ----
  publicacoes: [],

  // ---- Vídeos relacionados ao tema ----
  videos: [],

  // ---- Dicas úteis ----
  dicas: [
    'Leve seu pet ao veterinário periodicamente, mesmo sem sintomas visíveis.',
    'Mantenha a carteira de vacinação sempre atualizada.',
    'Ofereça água limpa e fresca durante todo o dia.',
    'Evite trocar a ração de forma brusca; faça a transição aos poucos.',
  ],

  // ---- Ferramentas ou recursos recomendados ----
  ferramentas: [
    'Calculadora de idade do pet (idade humana x idade animal)',
    'Checklist de vacinas obrigatórias',
    'Lista de contatos de veterinários e clínicas 24h',
  ],
};

// ---------------------------------------------------------------
// Estrutura compartilhada de TODAS as categorias (selos/etiquetas).
// Use esse array no seletor de selo da tela "Nova Pergunta" e no
// Home. Preencha duvidas/tutoriais/publicacoes/videos/dicas/ferramentas
// das outras categorias seguindo o mesmo schema da "pet" acima.
// ---------------------------------------------------------------
export const CATEGORIES = [
  { id: 'eletrica', nome: 'Elétrica', emoji: '⚡', cor: '#00E5FF', descricao: 'Consertos elétricos do dia a dia.' },
  { id: 'hidraulica', nome: 'Hidráulica', emoji: '💧', cor: '#22C1DC', descricao: 'Reparos em canos e torneiras.' },
  { id: 'carro', nome: 'Carro', emoji: '🚗', cor: '#B24BF3', descricao: 'Manutenção básica do veículo.' },
  { id: 'casa', nome: 'Casa', emoji: '🏠', cor: '#2ECC71', descricao: 'Reparos e melhorias em casa.' },
  { id: 'seguranca', nome: 'Segurança', emoji: '🛡️', cor: '#FF5C7A', descricao: 'Dicas de segurança pessoal.' },
  { id: 'financas', nome: 'Finanças', emoji: '💰', cor: '#F5C518', descricao: 'Controle financeiro básico.' },
  { id: 'pet', nome: 'Pet', emoji: '🐶', cor: '#FF9F43', descricao: petCategory.descricao },
];

// Helper: acha os dados completos de uma categoria pelo id.
// Hoje só "pet" tem o conteúdo completo — as demais retornam
// apenas o cabeçalho (nome/emoji/cor/descricao) até você preenchê-las.
const FULL_CATEGORY_DATA = {
  pet: petCategory,
};

export function getCategoryData(categoryId) {
  const header = CATEGORIES.find((c) => c.id === categoryId);
  if (!header) return null;
  const full = FULL_CATEGORY_DATA[categoryId];
  return {
    ...header,
    tutoriais: full?.tutoriais ?? [],
    duvidas: full?.duvidas ?? [],
    publicacoes: full?.publicacoes ?? [],
    videos: full?.videos ?? [],
    dicas: full?.dicas ?? [],
    ferramentas: full?.ferramentas ?? [],
  };
}
