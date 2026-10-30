import assert from "node:assert/strict";
import {
  diagnosticQuestions,
  evaluateDiagnostic,
  getShareableAnswers
} from "../site/assets/diagnostic-engine.js";

const scenarios = {
  longStay: [0, 1, 0, 0, 1, 1, 3, 1, 0, 0],
  travel: [3, 0, 0, 0, 0, 0, 3, 0, 1, 0],
  combination: [1, 2, 0, 0, 1, 2, 0, 1, 0, 0],
  national: [2, 2, 0, 0, 0, 0, 1, 0, 1, 0],
  international: [0, 2, 0, 1, 2, 1, 3, 1, 0, 0]
};

assert.equal(diagnosticQuestions.length, 10, "O diagnóstico deve ter dez perguntas.");

Object.entries(scenarios).forEach(([expectedProfile, answers]) => {
  const result = evaluateDiagnostic(answers);
  assert.equal(result.key, expectedProfile, `O cenário deve resultar em ${expectedProfile}.`);
  assert.ok(result.reasons.length <= 4, "O resultado não deve exibir mais de quatro leituras.");
});

const tie = evaluateDiagnostic([0, 2, 0, 0, 0, 1, 3, 0, 0, 0]);
assert.equal(tie.scores.international, tie.scores.national, "O cenário de desempate deve permanecer empatado.");
assert.equal(tie.key, "international", "Empates devem favorecer Saúde Internacional.");
assert.ok(tie.alerts.some((alert) => alert.id === "divided"), "Um perfil dividido deve gerar alerta.");

const abroad = evaluateDiagnostic([1, 2, 0, 2, 1, 2, 0, 1, 0, 0]);
assert.ok(abroad.scores.combination >= 4, "O cenário deve ter pontuação suficiente para combinação.");
assert.notEqual(abroad.key, "combination", "Viver entre países deve bloquear o resultado de combinação.");

const singleSolution = evaluateDiagnostic([1, 2, 0, 0, 1, 2, 3, 1, 0, 0]);
assert.ok(singleSolution.scores.combination >= 4, "O cenário deve ter pontuação suficiente para combinação.");
assert.notEqual(singleSolution.key, "combination", "Preferir uma solução única deve bloquear a combinação.");

const alerts = evaluateDiagnostic([1, 2, 1, 0, 1, 0, 0, 1, 1, 1]);
assert.equal(alerts.key, "combination");
assert.deepEqual(
  alerts.alerts.map((alert) => alert.id),
  ["requirement", "totalCost", "currentPlan", "preexisting", "exchange"],
  "Os alertas condicionais devem respeitar a ordem definida."
);
assert.equal(alerts.alerts.find((alert) => alert.id === "preexisting")?.sensitive, true);

const moving = evaluateDiagnostic([0, 1, 0, 3, 1, 1, 3, 1, 0, 0]);
assert.equal(moving.key, "longStay");
assert.ok(moving.alerts.some((alert) => alert.id === "moving"), "Mudança de país deve gerar alerta na estadia longa.");

const shareable = getShareableAnswers([0, 2, 0, 1, 2, 1, 3, 1, 0, 1]);
assert.equal(shareable.length, 9, "A resposta sensível deve ser excluída dos dados compartilháveis.");
assert.ok(
  shareable.every(({ question }) => !question.toLowerCase().includes("doença já diagnosticada")),
  "A pergunta sensível não pode aparecer nos dados compartilháveis."
);

assert.throws(
  () => evaluateDiagnostic(Array(9).fill(0)),
  /exige uma resposta para cada pergunta/,
  "Respostas incompletas devem ser recusadas."
);

console.log("Diagnostic engine: all scenarios passed.");
