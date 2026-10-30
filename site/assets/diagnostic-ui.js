import {
  diagnosticQuestions,
  evaluateDiagnostic,
  getShareableAnswers
} from "/assets/diagnostic-engine.js";

const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const mobilePanel = document.querySelector("[data-mobile-panel]");
const menuIcon = document.querySelector(".menu-icon path");
const quoteModal = document.querySelector("[data-quote-modal]");
const quoteForm = document.querySelector("[data-quote-form]");
const quoteOpeners = document.querySelectorAll("[data-quote-open]");
const quoteClosers = document.querySelectorAll("[data-quote-close]");
const diagnosticBar = document.querySelector("[data-diagnostic-bar]");
const diagnosticMain = quoteModal.querySelector(".diagnostic-main");
const diagnosticIntro = quoteModal.querySelector("[data-diagnostic-intro]");
const diagnosticStart = quoteModal.querySelector("[data-diagnostic-start]");
const quoteProgress = quoteModal.querySelector("[data-quote-progress]");
const quoteStepLabel = quoteModal.querySelector("[data-step-label]");
const quoteStepName = quoteModal.querySelector("[data-step-name]");
const quoteProgressCount = quoteModal.querySelector("[data-progress-count]");
const stageIndicators = [...quoteModal.querySelectorAll("[data-stage-indicator]")];
const questionScreen = quoteForm.querySelector("[data-diagnostic-question]");
const questionTitle = quoteForm.querySelector("[data-question-title]");
const questionHelp = quoteForm.querySelector("[data-question-help]");
const questionOptions = quoteForm.querySelector("[data-question-options]");
const questionBack = quoteForm.querySelector("[data-question-back]");
const resultScreen = quoteForm.querySelector("[data-diagnostic-result]");
const resultTag = quoteForm.querySelector("[data-result-tag]");
const resultTitle = quoteForm.querySelector("[data-result-title]");
const resultDescription = quoteForm.querySelector("[data-result-description]");
const resultLayers = quoteForm.querySelector("[data-result-layers]");
const resultReasonsSection = quoteForm.querySelector("[data-reasons-section]");
const resultReasons = quoteForm.querySelector("[data-result-reasons]");
const resultAlerts = quoteForm.querySelector("[data-result-alerts]");
const resultRestart = quoteForm.querySelector("[data-diagnostic-restart]");
const resultCta = quoteForm.querySelector("[data-result-cta]");
const contactScreen = quoteForm.querySelector("[data-diagnostic-contact]");
const contactBack = quoteForm.querySelector("[data-contact-back]");
const resultSummary = quoteForm.querySelector("[data-result-summary]");
const summaryField = quoteForm.querySelector("[data-summary-field]");
const resultField = quoteForm.querySelector("[data-result-field]");
const reasonsField = quoteForm.querySelector("[data-reasons-field]");
const answersField = quoteForm.querySelector("[data-answers-field]");

let questionIndex = -1;
let answers = Array(diagnosticQuestions.length).fill(null);
let diagnosticResult = null;
let answerAdvanceTimer = null;

const pushDataLayer = (payload) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
};

const setMenu = (open) => {
  mobilePanel.classList.toggle("open", open);
  document.body.classList.toggle("menu-open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  menuIcon.setAttribute("d", open ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16");
};

menuButton.addEventListener("click", () => {
  setMenu(!mobilePanel.classList.contains("open"));
});

mobilePanel.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

const onScroll = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 16);
  const shouldShowDiagnostic = window.scrollY > Math.min(window.innerHeight * 0.75, 720);
  diagnosticBar.classList.toggle("visible", shouldShowDiagnostic);
  diagnosticBar.setAttribute("aria-hidden", String(!shouldShowDiagnostic));
};

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("visible", entry.isIntersecting);
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

const scrollDiagnosticTop = () => {
  diagnosticMain.scrollTo({ top: 0, behavior: "smooth" });
};

const setStage = (activeStage) => {
  const stageOrder = ["profile", "result", "contact"];
  const activeIndex = stageOrder.indexOf(activeStage);
  stageIndicators.forEach((indicator) => {
    const indicatorIndex = stageOrder.indexOf(indicator.dataset.stageIndicator);
    indicator.classList.toggle("active", indicatorIndex === activeIndex);
    indicator.classList.toggle("completed", indicatorIndex < activeIndex);
  });
};

const setScreen = (screen) => {
  questionScreen.hidden = screen !== "question";
  resultScreen.hidden = screen !== "result";
  contactScreen.hidden = screen !== "contact";
};

const showIntro = () => {
  window.clearTimeout(answerAdvanceTimer);
  answerAdvanceTimer = null;
  questionIndex = -1;
  answers = Array(diagnosticQuestions.length).fill(null);
  diagnosticResult = null;
  quoteForm.reset();
  summaryField.value = "";
  resultField.value = "";
  reasonsField.value = "";
  answersField.value = "";
  diagnosticIntro.hidden = false;
  quoteProgress.hidden = true;
  quoteForm.hidden = true;
  setScreen(null);
  setStage("profile");
  scrollDiagnosticTop();
};

const renderQuestion = () => {
  const question = diagnosticQuestions[questionIndex];
  const progress = Math.round(((questionIndex + 1) / diagnosticQuestions.length) * 100);
  diagnosticIntro.hidden = true;
  quoteForm.hidden = false;
  quoteProgress.hidden = false;
  setScreen("question");
  setStage("profile");
  quoteProgress.style.setProperty("--diagnostic-progress", `${progress}%`);
  quoteStepLabel.textContent = `Pergunta ${questionIndex + 1} de ${diagnosticQuestions.length}`;
  quoteStepName.textContent = "Seu perfil";
  quoteProgressCount.textContent = `${progress}%`;
  questionTitle.textContent = question.title;
  questionHelp.textContent = question.help;
  questionOptions.replaceChildren();

  question.options.forEach((option, optionIndex) => {
    const choice = document.createElement("button");
    const index = document.createElement("span");
    const copy = document.createElement("span");
    const label = document.createElement("strong");
    const indicator = document.createElement("span");
    choice.type = "button";
    choice.className = "diagnostic-choice";
    choice.dataset.answerIndex = String(optionIndex);
    choice.setAttribute("aria-pressed", String(answers[questionIndex] === optionIndex));
    choice.classList.toggle("selected", answers[questionIndex] === optionIndex);
    index.className = "diagnostic-choice-index";
    index.textContent = String.fromCharCode(65 + optionIndex);
    copy.className = "diagnostic-choice-copy";
    label.textContent = option.label;
    indicator.className = "diagnostic-choice-check";
    indicator.setAttribute("aria-hidden", "true");
    copy.append(label);
    choice.append(index, copy, indicator);
    choice.addEventListener("click", () => selectAnswer(optionIndex));
    questionOptions.append(choice);
  });

  scrollDiagnosticTop();
  window.setTimeout(() => questionOptions.querySelector("button")?.focus({ preventScroll: true }), 80);
};

const selectAnswer = (optionIndex) => {
  window.clearTimeout(answerAdvanceTimer);
  answers[questionIndex] = optionIndex;
  questionOptions.querySelectorAll(".diagnostic-choice").forEach((choice) => {
    const selected = Number(choice.dataset.answerIndex) === optionIndex;
    choice.classList.toggle("selected", selected);
    choice.setAttribute("aria-pressed", String(selected));
  });

  pushDataLayer({
    event: "diagnostic_step_complete",
    form_id: "cotacao_saude_internacional",
    step_index: questionIndex + 1,
    total_steps: diagnosticQuestions.length,
    service: "saude_internacional"
  });

  answerAdvanceTimer = window.setTimeout(() => {
    if (questionIndex === diagnosticQuestions.length - 1) {
      showResult();
      return;
    }
    questionIndex += 1;
    renderQuestion();
  }, 220);
};

const renderLayers = (layers) => {
  resultLayers.replaceChildren();
  resultLayers.hidden = layers.length === 0;
  layers.forEach((layer) => {
    const item = document.createElement("div");
    const title = document.createElement("strong");
    const text = document.createElement("span");
    item.className = "diagnostic-layer";
    title.textContent = layer.title;
    text.textContent = layer.text;
    item.append(title, text);
    resultLayers.append(item);
  });
};

const renderReasons = (reasons) => {
  resultReasons.replaceChildren();
  resultReasonsSection.hidden = reasons.length === 0;
  reasons.forEach((reason) => {
    const item = document.createElement("li");
    item.textContent = reason;
    resultReasons.append(item);
  });
};

const renderAlerts = (alerts) => {
  resultAlerts.replaceChildren();
  alerts.forEach((alert) => {
    const item = document.createElement("div");
    const title = document.createElement("strong");
    const text = document.createElement("span");
    item.className = "diagnostic-alert";
    title.textContent = alert.title;
    text.textContent = alert.text;
    item.append(title, text);
    resultAlerts.append(item);
  });
};

const showResult = ({ track = true } = {}) => {
  if (!diagnosticResult) diagnosticResult = evaluateDiagnostic(answers);
  const shareableAnswers = getShareableAnswers(answers);
  const answerSummary = shareableAnswers
    .map(({ question, answer }) => `${question}: ${answer}`)
    .join("\n");

  resultField.value = `${diagnosticResult.tag} — ${diagnosticResult.title}`;
  reasonsField.value = diagnosticResult.reasons.join(" | ");
  answersField.value = answerSummary;
  resultTag.textContent = diagnosticResult.tag;
  resultTitle.textContent = diagnosticResult.title;
  resultDescription.textContent = diagnosticResult.description;
  resultSummary.textContent = diagnosticResult.tag;
  resultCta.textContent = diagnosticResult.cta;
  renderLayers(diagnosticResult.layers);
  renderReasons(diagnosticResult.reasons);
  renderAlerts(diagnosticResult.alerts);
  diagnosticIntro.hidden = true;
  quoteForm.hidden = false;
  quoteProgress.hidden = false;
  setScreen("result");
  setStage("result");
  quoteProgress.style.setProperty("--diagnostic-progress", "100%");
  quoteStepLabel.textContent = "Seu resultado";
  quoteStepName.textContent = "Leitura do perfil";
  quoteProgressCount.textContent = "100%";
  scrollDiagnosticTop();

  if (track) {
    pushDataLayer({
      event: "diagnostic_result",
      form_id: "cotacao_saude_internacional",
      diagnostic_profile: diagnosticResult.key,
      service: "saude_internacional"
    });
  }
};

const showContact = () => {
  setScreen("contact");
  setStage("contact");
  quoteProgress.style.setProperty("--diagnostic-progress", "100%");
  quoteStepLabel.textContent = "Etapa final";
  quoteStepName.textContent = "Dados para cotação";
  quoteProgressCount.textContent = "100%";
  scrollDiagnosticTop();
  window.setTimeout(() => contactScreen.querySelector("input")?.focus({ preventScroll: true }), 80);
};

const startDiagnostic = () => {
  questionIndex = 0;
  renderQuestion();
  pushDataLayer({
    event: "begin_diagnostic",
    form_id: "cotacao_saude_internacional",
    total_steps: diagnosticQuestions.length,
    service: "saude_internacional"
  });
};

const setQuoteModal = (open) => {
  quoteModal.classList.toggle("open", open);
  quoteModal.setAttribute("aria-hidden", String(!open));
  document.body.classList.toggle("quote-open", open);
  document.body.style.overflow = open ? "hidden" : "";
  if (open) {
    showIntro();
    window.setTimeout(() => diagnosticStart.focus({ preventScroll: true }), 80);
  } else {
    window.clearTimeout(answerAdvanceTimer);
    answerAdvanceTimer = null;
  }
};

diagnosticStart.addEventListener("click", startDiagnostic);

questionBack.addEventListener("click", () => {
  window.clearTimeout(answerAdvanceTimer);
  if (questionIndex <= 0) {
    showIntro();
    return;
  }
  questionIndex -= 1;
  renderQuestion();
});

resultRestart.addEventListener("click", showIntro);
resultCta.addEventListener("click", showContact);
contactBack.addEventListener("click", () => showResult({ track: false }));

quoteOpeners.forEach((opener) => {
  opener.addEventListener("click", (event) => {
    event.preventDefault();
    setMenu(false);
    setQuoteModal(true);
  });
});

quoteClosers.forEach((closer) => {
  closer.addEventListener("click", () => setQuoteModal(false));
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && quoteModal.classList.contains("open")) {
    setQuoteModal(false);
  }
});

quoteForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const contactData = new FormData(quoteForm);
  const submitButton = quoteForm.querySelector("button[type='submit']");
  const shareableAnswers = getShareableAnswers(answers);
  const message = [
    "Olá, concluí o diagnóstico e gostaria de solicitar uma cotação.",
    "",
    `Perfil indicado: ${diagnosticResult?.tag || "Não identificado"}`,
    `Leitura: ${diagnosticResult?.title || ""}`,
    diagnosticResult?.reasons.length ? `Por que chegamos aqui: ${diagnosticResult.reasons.join(" | ")}` : "",
    "",
    "Respostas do diagnóstico:",
    ...shareableAnswers.map(({ question, answer }) => `${question}: ${answer}`),
    "",
    `Nome: ${contactData.get("nome") || ""}`,
    `E-mail: ${contactData.get("email") || ""}`,
    `WhatsApp: ${contactData.get("whatsapp") || ""}`,
    `Cidade: ${contactData.get("cidade") || ""}`,
    `Cotação para: ${contactData.get("cotacao_para") || ""}`,
    `Idades dos participantes: ${contactData.get("idades_participantes") || ""}`,
    `Plano ou seguro atual: ${contactData.get("plano_atual") || ""}`
  ].filter(Boolean).join("\n");

  summaryField.value = message;
  submitButton.disabled = true;
  submitButton.textContent = "Enviando...";

  try {
    const response = await fetch(quoteForm.action, {
      method: "POST",
      body: new FormData(quoteForm),
      headers: { Accept: "application/json" }
    });
    if (!response.ok) throw new Error("Formspree request failed");

    pushDataLayer({
      event: "generate_lead",
      form_id: "cotacao_saude_internacional",
      form_name: "Cotação Saúde Internacional",
      diagnostic_profile: diagnosticResult?.key || "nao_identificado",
      service: "saude_internacional"
    });
    window.open(`https://wa.me/5511938020789?text=${encodeURIComponent(message)}`, "_blank", "noopener");
    setQuoteModal(false);
  } catch {
    alert("Não foi possível enviar o formulário agora. Tente novamente ou fale pelo WhatsApp.");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Solicitar cotação";
  }
});

const openQuoteFromHash = () => {
  if (window.location.hash === "#cotacao") setQuoteModal(true);
};

window.addEventListener("hashchange", openQuoteFromHash);
openQuoteFromHash();
