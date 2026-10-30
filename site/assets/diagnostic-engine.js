export const diagnosticQuestions = [
  {
    id: "motivo",
    title: "O que mais trouxe você até aqui?",
    help: "Escolha a razão que melhor representa o que você procura hoje.",
    options: [
      { label: "Quero acesso ao que existe de mais avançado em medicina, no Brasil ou fora", scores: { international: 3 }, reading: "Você busca acesso a medicina de referência sem ficar limitado ao que existe no país." },
      { label: "Quero me proteger de um evento de saúde grave e muito caro", scores: { international: 3, combination: 2 }, reading: "Seu foco é proteção contra o alto risco, que é justamente onde o seguro internacional mais entrega." },
      { label: "Quero um plano melhor do que o meu, de preferência pagando menos", scores: { national: 3 }, reading: "Seu objetivo principal é custo e qualidade no dia a dia, terreno onde o plano nacional costuma ganhar." },
      { label: "Preciso de um seguro para viagem, visto ou exigência de outro país", scores: { travel: 4 }, reading: "Você precisa de uma cobertura ligada a viagem ou a uma exigência formal, o que normalmente se resolve com seguro viagem." }
    ]
  },
  {
    id: "duracao",
    title: "Por quanto tempo você precisa dessa cobertura?",
    help: "O prazo é um dos critérios que mais muda o tipo de proteção indicado.",
    options: [
      { label: "Por pouco tempo, até 3 meses", scores: { travel: 6 }, flags: { shortStay: true }, reading: "A necessidade é de curto prazo, exatamente o que o seguro viagem foi feito para cobrir." },
      { label: "Por uma estadia longa, de 3 a 12 meses", scores: { travel: 6 }, flags: { longStay: true }, reading: "Você vai ficar fora por meses. Nesse prazo, boa parte dos seguros viagem comuns já não cobre, e a escolha precisa ser feita com mais critério." },
      { label: "De forma contínua, por mais de 1 ano", scores: { international: 1, national: 1 } },
      { label: "Ainda não sei" }
    ]
  },
  {
    id: "exigencia",
    title: "Seu seguro precisa atender alguma exigência formal?",
    help: "Consulados, universidades e empresas podem exigir valor mínimo, prazo e até tipo de seguradora.",
    options: [
      { label: "Não, a escolha é só minha" },
      { label: "Sim, para visto ou residência em outro país", scores: { travel: 1 }, flags: { requirement: "visto ou residência" } },
      { label: "Sim, de universidade ou programa de intercâmbio", scores: { travel: 1 }, flags: { requirement: "universidade ou intercâmbio" } },
      { label: "Sim, de empresa ou contrato de trabalho", flags: { requirement: "empresa ou contrato de trabalho" } }
    ]
  },
  {
    id: "residencia",
    title: "Onde você vive e onde pretende se tratar?",
    help: "Considere onde acontece sua rotina e onde você gostaria de ter liberdade de atendimento.",
    options: [
      { label: "Moro no Brasil e quero me tratar aqui na maior parte das vezes", scores: { national: 2 }, reading: "Seu uso do dia a dia será quase todo no Brasil, o que favorece uma boa rede nacional." },
      { label: "Moro no Brasil, mas quero a liberdade de me tratar fora quando fizer sentido", scores: { international: 3 }, reading: "Você quer liberdade para escolher onde se tratar, inclusive fora do país." },
      { label: "Divido meu tempo entre o Brasil e outros países", scores: { international: 3 }, flags: { abroad: true }, reading: "Você vive entre países, e precisa de uma cobertura que funcione onde você estiver." },
      { label: "Estou de mudança para outro país", scores: { international: 2 }, flags: { abroad: true, moving: true }, reading: "Você está mudando de país, e a cobertura precisa acompanhar essa transição." }
    ]
  },
  {
    id: "preocupacao",
    title: "Qual preocupação com saúde pesa mais para você hoje?",
    help: "Isso ajuda a diferenciar o uso frequente da proteção para eventos graves.",
    options: [
      { label: "Consultas, exames e emergências do dia a dia", scores: { national: 3 }, reading: "Sua prioridade é o uso frequente e previsível, que o plano nacional atende bem." },
      { label: "Uma doença grave, como câncer, doença do coração ou neurológica, e ter acesso aos melhores especialistas", scores: { international: 3 }, reading: "Você pensa em doenças graves e em acesso aos especialistas de referência." },
      { label: "Tratamentos que ainda não chegaram ao Brasil ou não são cobertos pelos planos daqui", scores: { international: 4 }, reading: "Você quer acesso a tratamentos que o rol dos planos brasileiros não cobre ou que ainda não estão disponíveis aqui." },
      { label: "Histórico de doença grave na família e quero estar preparado", scores: { international: 2 }, reading: "O histórico familiar faz você querer estar preparado para o cenário mais pesado." }
    ]
  },
  {
    id: "custo",
    title: "Como você enxerga o custo dessa decisão?",
    help: "Escolha o critério que mais se aproxima de como você decide.",
    options: [
      { label: "Preço é o meu principal critério", scores: { national: 4 }, flags: { pricePriority: true }, reading: "Preço é o critério principal. Nesse caso, o plano nacional costuma ser a decisão mais coerente." },
      { label: "Pago mais se a cobertura fizer sentido para o meu risco", scores: { international: 2 }, reading: "Você aceita pagar mais quando a cobertura conversa com o seu risco real." },
      { label: "Quero proteger meu patrimônio de uma conta médica muito alta", scores: { international: 3, combination: 1 }, reading: "Você enxerga o seguro como blindagem do patrimônio contra uma conta médica que poderia chegar a milhões." }
    ]
  },
  {
    id: "plano_brasil",
    title: "Você tem ou quer ter um plano de saúde no Brasil?",
    help: "Esta resposta ajuda a identificar quando duas camadas podem fazer mais sentido.",
    options: [
      { label: "Tenho e quero manter para o dia a dia. Busco uma proteção a mais para os casos graves", scores: { international: 1, combination: 4 }, flags: { hasCurrentPlan: true }, reading: "Você quer manter o plano nacional para o uso frequente e somar uma camada separada para o alto risco." },
      { label: "Tenho, mas quero trocar por algo melhor", scores: { national: 1 } },
      { label: "Não tenho, mas gostaria de um plano aqui para o dia a dia e uma proteção internacional para o que é grave", scores: { combination: 4 }, reading: "Você já pensa em duas camadas: uma para o uso frequente e outra para o evento grave." },
      { label: "Não tenho e prefiro uma solução só", flags: { singleSolution: true } }
    ]
  },
  {
    id: "franquia",
    title: "Como você se sente em relação a franquia?",
    help: "Franquia é o valor pago antes de o seguro começar a cobrir, parecido com o seguro do carro.",
    options: [
      { label: "Prefiro não pagar nada além da mensalidade", scores: { national: 2 }, reading: "Você prefere não ter franquia, formato mais comum nos planos nacionais." },
      { label: "Aceito uma franquia se isso me deixar protegido no que é grave", scores: { international: 2, combination: 2 }, reading: "Você aceita franquia em troca de proteção forte nos eventos graves." },
      { label: "Ainda não tenho opinião sobre isso" }
    ]
  },
  {
    id: "moeda",
    title: "E sobre pagar em dólar?",
    help: "A maioria dos seguros internacionais é cobrada em dólar.",
    options: [
      { label: "Tranquilo. Tenho renda, reserva ou despesas em dólar", scores: { international: 2 }, reading: "Pagar em dólar não é um problema para você." },
      { label: "Prefiro pagar em reais, sem variação de câmbio", scores: { national: 2 }, flags: { exchangeConcern: true }, reading: "Você prefere previsibilidade em reais, sem exposição ao câmbio." },
      { label: "Depende do valor final", flags: { exchangeConcern: true } }
    ]
  },
  {
    id: "preexistencia",
    sensitive: true,
    title: "Alguém que entraria no seguro tem doença já diagnosticada ou em tratamento?",
    help: "Não precisa dizer qual. Esta resposta não será enviada nem armazenada.",
    options: [
      { label: "Não" },
      { label: "Sim", flags: { preexistingCondition: true } },
      { label: "Prefiro não responder" }
    ]
  }
];

export const diagnosticProfiles = {
  international: {
    tag: "Perfil Saúde Internacional",
    title: "O seguro saúde internacional faz sentido para o seu momento.",
    description: "Suas respostas apontam para quem quer acesso a medicina de referência, liberdade de escolha e proteção contra o alto risco. O próximo passo é entender qual seguradora e qual desenho de cobertura combinam com você.",
    cta: "Quero entender minhas opções"
  },
  combination: {
    tag: "Perfil Nacional + Internacional",
    title: "O seu caso pede duas camadas: um plano nacional para o dia a dia e um seguro internacional para o grande risco.",
    description: "Esse é um desenho comum entre quem tem família e patrimônio a proteger. O plano nacional cuida do uso frequente, em reais e com rede perto de você. O seguro internacional entra para o evento grave e caro, com acesso a centros de referência no Brasil e fora. Com uma franquia mais alta no internacional, a mensalidade dele fica bem menor, e o que fica abaixo da franquia já é coberto pelo plano nacional. O segredo está em desenhar as duas camadas juntas, para não pagar duas vezes pela mesma coisa nem deixar espaços entre elas.",
    cta: "Quero desenhar as duas camadas",
    layers: [
      { title: "Plano nacional", text: "Consultas, exames, pronto atendimento e uso frequente, em reais." },
      { title: "Seguro internacional", text: "Doença grave, cirurgia complexa e tratamento de alto custo, no Brasil ou fora." }
    ]
  },
  national: {
    tag: "Perfil Plano Nacional",
    title: "Um bom plano nacional deve resolver melhor o que você busca.",
    description: "Pelo que você respondeu, um seguro internacional seria pagar por algo que você pouco vai usar. Um plano nacional bem escolhido, com a rede e o formato certos, tende a entregar mais valor. A Hirayama faz essa análise com você, sem achismo.",
    cta: "Falar com a consultoria de planos nacionais"
  },
  travel: {
    tag: "Perfil Seguro Viagem",
    title: "O que você precisa é de um seguro viagem.",
    description: "Seguro saúde é uma relação de longo prazo. Para uma viagem ou um período curto fora, o seguro viagem é o produto certo e custa bem menos. Também cotamos para você.",
    cta: "Cotar seguro viagem"
  },
  longStay: {
    tag: "Perfil Estadia Longa",
    title: "Você precisa de uma cobertura para estadia longa fora do país.",
    description: "Aqui mora um cuidado importante. A maioria dos seguros viagem do mercado tem limite de dias por viagem e não cobre uma estadia de vários meses. Existem poucas opções feitas para esse prazo, e vale escolher com calma para não descobrir o limite na hora de usar. Analisamos o seu caso e indicamos o que realmente cobre o período inteiro.",
    cta: "Analisar minha estadia longa"
  }
};

const alertDefinitions = {
  requirement: (type) => ({ id: "requirement", title: `Exigência de ${type}`, text: "A exigência vem antes da escolha do produto. Ela costuma definir valor mínimo de cobertura, moeda, prazo e, em alguns casos, quais seguradoras são aceitas. Separe o documento com essas regras. A cotação parte dele, e não o contrário." }),
  moving: { id: "moving", title: "Mudança de país", text: "Se a mudança passar de 1 ano, vale reavaliar. Nesse caso, o seguro internacional volta a fazer sentido, e é melhor planejar a transição antes de o seguro viagem vencer." },
  divided: { id: "divided", title: "Seu perfil ficou dividido", text: "Suas respostas ficaram próximas entre o nacional e o internacional. Uma conversa curta resolve isso melhor do que qualquer questionário." },
  totalCost: { id: "totalCost", title: "Custo total", text: "Você terá duas mensalidades. O que equilibra a conta é escolher a franquia certa no internacional e, às vezes, ajustar o plano nacional. Vale ver o número final das duas camadas juntas antes de decidir." },
  currentPlan: { id: "currentPlan", title: "Seu plano atual", text: "Antes de somar a camada internacional, vale verificar se o seu plano nacional está bem dimensionado. Às vezes é possível ajustar a categoria dele e liberar parte do orçamento para a proteção do grande risco." },
  preexisting: { id: "preexisting", sensitive: true, title: "Doença já diagnosticada", text: "Seguros internacionais podem excluir ou aceitar com condições quem já tem diagnóstico. Isso precisa ser analisado antes da proposta para evitar surpresa na utilização." },
  exchange: { id: "exchange", title: "Câmbio", text: "Como o pagamento costuma ser em dólar, vale simular o custo com o câmbio oscilando, e não apenas com o valor de hoje." }
};

const unique = (items) => [...new Set(items)];

export function evaluateDiagnostic(answerIndexes) {
  if (!Array.isArray(answerIndexes) || answerIndexes.length !== diagnosticQuestions.length) {
    throw new Error("O diagnóstico exige uma resposta para cada pergunta.");
  }

  const scores = { international: 0, national: 0, travel: 0, combination: 0 };
  const readings = { international: [], national: [], travel: [], combination: [] };
  const flags = {};

  answerIndexes.forEach((answerIndex, questionIndex) => {
    const question = diagnosticQuestions[questionIndex];
    const option = question.options[answerIndex];
    if (!option) throw new Error(`Resposta inválida na pergunta ${questionIndex + 1}.`);
    Object.entries(option.scores || {}).forEach(([profile, points]) => {
      scores[profile] += points;
      if (option.reading) readings[profile].push(option.reading);
    });
    Object.assign(flags, option.flags || {});
  });

  const durationOption = diagnosticQuestions[1].options[answerIndexes[1]];
  let profileKey;
  if (flags.longStay) {
    profileKey = "longStay";
  } else if (flags.shortStay || (scores.travel >= 5 && !durationOption.scores?.international)) {
    profileKey = "travel";
  } else if (scores.combination >= 4 && !flags.singleSolution && !flags.abroad) {
    profileKey = "combination";
  } else {
    profileKey = scores.international >= scores.national ? "international" : "national";
  }

  const readingPool = profileKey === "combination"
    ? [...readings.combination, ...readings.international, ...readings.national]
    : readings[{ international: "international", national: "national", travel: "travel", longStay: "travel" }[profileKey]];

  const alerts = [];
  if (flags.requirement) alerts.push(alertDefinitions.requirement(flags.requirement));
  if ((profileKey === "travel" || profileKey === "longStay") && flags.moving) alerts.push(alertDefinitions.moving);
  if ((profileKey === "international" || profileKey === "national") && Math.abs(scores.international - scores.national) <= 2) alerts.push(alertDefinitions.divided);
  if (profileKey === "combination" && flags.pricePriority) alerts.push(alertDefinitions.totalCost);
  if (profileKey === "combination" && flags.hasCurrentPlan) alerts.push(alertDefinitions.currentPlan);
  if ((profileKey === "international" || profileKey === "combination") && flags.preexistingCondition) alerts.push(alertDefinitions.preexisting);
  if ((profileKey === "international" || profileKey === "combination") && flags.exchangeConcern) alerts.push(alertDefinitions.exchange);

  return {
    key: profileKey,
    ...diagnosticProfiles[profileKey],
    scores,
    reasons: unique(readingPool).slice(0, 4),
    alerts,
    layers: diagnosticProfiles[profileKey].layers || []
  };
}

export function getShareableAnswers(answerIndexes) {
  return diagnosticQuestions.flatMap((question, index) => {
    if (question.sensitive) return [];
    const option = question.options[answerIndexes[index]];
    return option ? [{ question: question.title, answer: option.label }] : [];
  });
}
