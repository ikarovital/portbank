# Prompt: Como criar cenários BDD (Feature, Utils, Steps, Spec, Executor)

Use este texto como **exemplo e checklist** ao pedir (ou ao implementar) novos cenários BDD no projeto. O padrão segue: **Feature (Gherkin) → Utils (objetos + dados) → Steps → Spec (opcional) → Executor (Playwright + Allure)**. Ao configurar projeto novo ou novo fluxo, incluir também **.gitignore** com o que não deve ser versionado.

---

## Estrutura de pastas (o que versionar)

```
tests/
  features/          # .feature (Gherkin) — versionar
  steps/             # .steps.js — versionar
  utils/             # objects.js, test-data.js, screenshot.js — versionar
  pages/             # (opcional) page objects por tela — versionar se usar
  example.spec.js    # spec direto Playwright (espelho dos cenários) — versionar
  .features-gen/     # gerado pelo bddgen — NÃO versionar (no .gitignore)
playwright.config.js
playwright.specs.config.js
package.json
.gitignore           # sempre incluir artefatos de teste e evidências
```

**O que NÃO sobe no Git:** ver seção 7 (`.gitignore`).

---

## Regras gerais

- **Idioma:** Gherkin em português com `# language: pt` no topo da feature.
- **Locators:** Centralizados em `tests/utils/objects.js`; steps e specs **nunca** usam locators inline (ex.: `page.getByRole(...)` direto no step).
- **Dados sensíveis / de teste:** Em `tests/utils/test-data.js` (ex.: usuário, senha).
- **Evidências:** Cada step relevante chama `takeScreenshot(page, 'nome-etapa')`; relatório Allure com vídeo/screenshot já configurado.
- **Timeouts:** Usar constantes no arquivo de steps (ex.: `TIMEOUT_ESPERA`, `TIMEOUT_MODAL_ERRO`) e passar em `expect(..., { timeout: TIMEOUT_ESPERA })` onde a tela demora a carregar.
- **Executor:** Playwright + playwright-bdd; um único config BDD (`playwright.config.js`) com features em `tests/features/**/*.feature` e steps em `tests/steps/**/*.js`. Rodar com `npm run test:e2e` (ou `test:e2e:fresh` para limpar Allure antes).

---

## 1. Feature (Gherkin)

**Arquivo:** `tests/features/<nome>.feature`

- Primeira linha: `# language: pt`
- **Funcionalidade:** título curto do fluxo (ex.: "Login e Logout — Nome do Produto").
- **Cenários:** frases em português, passos reutilizáveis.
- **Dado/Quando/Então:** preferir passos parametrizados quando fizer sentido (ex.: `Quando clico em "Texto do botão"`, `Então a tela exibe o heading "Título"`).

**Exemplo de estrutura:**

```gherkin
# language: pt
Funcionalidade: Nome do fluxo — Produto

  Cenário: Nome do cenário (ação + resultado esperado)
    Dado <premissa>
    Quando <ação 1>
    E <ação 2>
    Então <resultado esperado>
```

---

## 2. Utils

### 2.1 Objetos da interface — `tests/utils/objects.js`

- **Uma função por elemento** (botão, campo, link, heading, etc.).
- Assinatura: `(page) => locator`; usar `page.getByRole`, `page.getByTestId`, `page.getByText` conforme o caso.
- **URLs** como constantes ou funções que retornam string (ex.: `urlBank(page)`, `urlHomeCliente`).
- **Textos esperados** em um objeto `textos` (ex.: `textos.conecteSeViaPortoId`) para evitar strings repetidas e erros de digitação.
- JSDoc com `@param {import('@playwright/test').Page} page` e descrição breve quando ajudar.
- Export default com todos os nomes para referência.

**Exemplo de padrão:**

```js
/** @param {import('@playwright/test').Page} page */
export function btnNomeDoBotao(page) {
  return page.getByRole('button', { name: 'Texto visível do botão' });
}

export const textos = {
  tituloTelaLogin: 'Conecte-se via Porto ID',
  // ...
};
```

### 2.2 Dados de teste — `tests/utils/test-data.js`

- Objetos exportados com dados reutilizados nos cenários (ex.: `testUser` com `cpf`, `senha`, `nomeExibido`).
- Não colocar locators aqui; apenas dados (strings, números, etc.).

---

## 3. Steps — `tests/steps/<nome>.steps.js`

- **Imports:** `createBdd` (playwright-bdd), `expect` (Playwright), `objs`, `testUser` (ou outros de test-data), `takeScreenshot`.
- **Constantes de timeout** no topo (ex.: `TIMEOUT_ESPERA = 60000`).
- **Um step por frase do Gherkin;** implementação usando apenas `objs` e dados de test-data.
- **Esperas explícitas** antes de interagir com elementos que podem demorar (ex.: `await expect(objs.textboxSenha(page)).toBeVisible({ timeout: TIMEOUT_ESPERA })` antes de `fill`).
- **Screenshot** em pelo menos um ponto por step relevante: `await takeScreenshot(page, 'nn-nome-etapa')`.
- **Parâmetros:** usar o segundo argumento do step (ex.: `async ({ page }, text)` para `{string}`).
- Para **Quando clico em "X"** com vários botões, usar um step com parâmetro e `if (name === '...')` chamando o objeto correspondente.
- **Then:** validar com `expect` + timeout; em cenários com mais de um resultado possível (ex.: sucesso OU modal de erro), usar `try/catch` ou checagem `isVisible` e `expect(A || B).toBeTruthy()`.

**Exemplo de esqueleto:**

```js
const { Given, When, Then } = createBdd();

Given('que <premissa>', async ({ page }) => {
  // usar objs e test-data; takeScreenshot se fizer sentido
});

When('clico em {string}', async ({ page }, name) => {
  if (name === 'Botão A') await objs.btnA(page).click();
  else if (name === 'Botão B') await objs.btnB(page).click();
  await takeScreenshot(page, '...');
});

Then('a tela exibe o heading {string}', async ({ page }, text) => {
  await expect(objs.heading(page)).toContainText(text, { timeout: TIMEOUT_ESPERA });
  await takeScreenshot(page, '...');
});
```

---

## 4. Executor

- **Config BDD:** `playwright.config.js` com `defineBddConfig`: `features`, `steps`, `outputDir: 'tests/.features-gen'`; reporter Allure com `outputFolder: 'allure-results'`.
- **Gerar specs:** após criar/alterar `.feature`, rodar `npx bddgen` (ou `npm run test:e2e`, que já chama bddgen).
- **Rodar cenários:** `npm run test:e2e` (Chromium por padrão); para limpar Allure e rodar: `npm run test:e2e:fresh`.
- **Relatório de evidências:** `npm run report:allure` após os testes.

Não é necessário criar um novo config para cada feature; todas as `.feature` em `tests/features/**` são executadas pelo mesmo config.

---

Não é necessário criar um novo config para cada feature; todas as `.feature` em `tests/features/**` são executadas pelo mesmo config.

---

## 5. Spec (testes diretos Playwright) — opcional

**Arquivo:** `tests/<nome>.spec.js` ou `tests/specs/<nome>.spec.js`

- Espelha os cenários da feature em código Playwright (sem Gherkin), usando os mesmos **utils** (`objects.js`, `test-data.js`) e `takeScreenshot`.
- Útil para rodar com `npm run test:spec` (config `playwright.specs.config.js`) sem depender do BDD.
- Um `test.describe` por funcionalidade; um `test()` por cenário; dentro, `step()` do Allure e chamadas a `objs` e `takeScreenshot`.

---

## 6. Page Objects (opcional)

**Pasta:** `tests/pages/`

- Se o projeto crescer e quiser separar por tela: um arquivo por página (ex.: `login.page.js`, `home.page.js`) exportando funções que retornam locators ou ações, recebendo `page`. Os steps e o spec importam desses pages em vez de (ou além de) `objects.js`. Não é obrigatório; `objects.js` único já atende.

---

## 7. .gitignore — o que não subir

Garantir que o repositório **não** inclua:

| Entrada | Motivo |
|--------|--------|
| `node_modules/` | Dependências |
| `.env`, `.env.local`, `*.pem` | Credenciais e segredos |
| `test-results/`, `playwright-report/`, `playwright/.cache/`, `playwright/.auth/` | Artefatos Playwright |
| `test-results/screenshots/` | Screenshots gerados nos testes |
| `tests/.features-gen/` | Arquivos gerados pelo `bddgen` |
| `allure-results/`, `allure-report/` | Resultados e relatório Allure |
| `.idea/`, `.vscode/` (se preferir) | Configurações locais da IDE |
| `*.log`, `.DS_Store`, `Thumbs.db` | Logs e arquivos de sistema |

**Versionar:** `tests/features/**/*.feature`, `tests/steps/**/*.js`, `tests/utils/**/*.js`, `tests/**/*.spec.js`, `tests/pages/**/*.js` (se existir), configs Playwright, `package.json`, `.gitignore`, e documentação (ex.: `PROMPT_BDD_EXEMPLO.md`).

---

## 8. Checklist ao criar um novo fluxo BDD

- [ ] **Feature:** arquivo em `tests/features/` com `# language: pt`, Funcionalidade e Cenários em português.
- [ ] **Objects:** novos locators/URLs/textos em `tests/utils/objects.js`; nenhum seletor inline nos steps.
- [ ] **Test data:** dados do cenário (usuário, etc.) em `tests/utils/test-data.js` se forem reutilizados.
- [ ] **Steps:** arquivo em `tests/steps/` (ou steps adicionados em um existente); uso de `objs`, timeouts, `takeScreenshot`; esperas antes de interações em telas lentas.
- [ ] **Executor:** rodar `npx bddgen` e `npm run test:e2e`; gerar Allure com `npm run report:allure`.

- [ ] **Feature:** arquivo em `tests/features/` com `# language: pt`, Funcionalidade e Cenários em português.
- [ ] **Objects:** novos locators/URLs/textos em `tests/utils/objects.js`; nenhum seletor inline nos steps.
- [ ] **Test data:** dados do cenário (usuário, etc.) em `tests/utils/test-data.js` se forem reutilizados.
- [ ] **Steps:** arquivo em `tests/steps/` (ou steps adicionados em um existente); uso de `objs`, timeouts, `takeScreenshot`; esperas antes de interações em telas lentas.
- [ ] **Spec (opcional):** atualizar `tests/example.spec.js` (ou criar novo `.spec.js`) com os mesmos cenários usando `objs` e `takeScreenshot`.
- [ ] **Executor:** rodar `npx bddgen` e `npm run test:e2e`; gerar Allure com `npm run report:allure`.
- [ ] **.gitignore:** garantir que `allure-results/`, `allure-report/`, `test-results/`, `tests/.features-gen/`, `.env` e `node_modules/` estejam ignorados.

---

## 9. Texto pronto para usar como prompt

Copie e adapte o bloco abaixo ao pedir a criação de um novo fluxo BDD:

```
Preciso criar um novo fluxo BDD no projeto, seguindo o padrão já usado (Feature → Utils → Steps → Spec → Executor).

Contexto do fluxo:
- [Descrever o fluxo: ex. "Login na área do cliente, depois acessar a home e fazer logout"]
- [URLs e telas envolvidas]
- [Dados necessários: ex. CPF, senha]

Regras:
1. Feature em português com # language: pt; cenários em Gherkin (Dado/Quando/Então).
2. Novos locators/URLs/textos em tests/utils/objects.js; dados em tests/utils/test-data.js.
3. Steps em tests/steps (criar ou atualizar arquivo existente); usar apenas objects.js e test-data.js; incluir takeScreenshot e timeouts (TIMEOUT_ESPERA) onde a tela demorar.
4. Atualizar ou criar tests/example.spec.js (ou outro .spec.js) com os mesmos cenários, usando objs e takeScreenshot.
5. Não usar locators inline nos steps nem no spec; não alterar playwright.config.js além do que já existe.
6. Garantir que .gitignore inclua: node_modules/, .env, test-results/, playwright-report/, playwright/.cache/, tests/.features-gen/, allure-results/, allure-report/, test-results/screenshots/. Ao final, rodar npx bddgen e garantir que os cenários rodam com npm run test:e2e.

Gerar/atualizar: a feature, os objetos em objects.js, os dados em test-data.js (se precisar), as step definitions, o spec (se aplicável) e o .gitignore (se algo faltando).
```

---

*Documento baseado na estrutura do projeto Porto Bank (Login + Logout BDD com Playwright e Allure).*
