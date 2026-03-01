# Como o framework de testes funciona (Porto Bank)

Este documento explica **o que está acontecendo** em cada camada do projeto: da escrita do cenário em linguagem natural até o relatório de evidências no Allure.

---

## Visão geral em uma frase

Você escreve **cenários em português** (Gherkin) nas **features**; o **playwright-bdd** gera código Playwright que chama os **steps**; os steps usam **objetos** e **dados** centralizados e gravam **evidências**; o **Playwright** executa no navegador e o **Allure** monta o relatório com vídeo, screenshots e anexos.

---

## 1. O que cada parte faz

| Parte | Onde fica | Função |
|-------|-----------|--------|
| **Feature** | `tests/features/*.feature` | Cenários em Gherkin (Dado/Quando/Então). É a “especificação” em português. |
| **Steps** | `tests/steps/*.steps.js` | Implementação de cada frase do Gherkin: o que rodar no navegador (cliques, preenchimentos, expectativas). |
| **Utils – objects** | `tests/utils/objects.js` | Locators e URLs: um lugar só para botões, campos, textos da tela. Steps e specs **só** usam isso, nunca seletores soltos. |
| **Utils – test-data** | `tests/utils/test-data.js` | Dados de teste (CPF, senha, etc.). Separa “o que testar” dos seletores. |
| **Utils – screenshot** | `tests/utils/screenshot.js` | Tira screenshot e anexa no Allure (e opcionalmente salva em pasta). |
| **Spec (gerado)** | `tests/.features-gen/` | Código Playwright **gerado** a partir das features. Você não edita; é resultado do `bddgen`. |
| **Spec (manual)** | `tests/example.spec.js` | Testes escritos direto em Playwright, espelhando os cenários, usando os mesmos utils. Útil para rodar sem BDD. |
| **Config BDD** | `playwright.config.js` | Diz ao Playwright: onde estão as features, os steps, onde gerar o spec, timeout, vídeo, Allure. |
| **Config Spec** | `playwright.specs.config.js` | Config só para os `.spec.js` (não usa features). |
| **Allure** | `allure-results/` → relatório | Durante a execução, o reporter **allure-playwright** grava resultados; depois o **Allure CLI** gera o HTML com evidências. |

---

## 2. Fluxo quando você roda os testes (BDD)

```
npm run test:e2e
```

### Passo a passo

1. **`bddgen` (playwright-bdd)**  
   - Lê todas as `tests/features/**/*.feature`.  
   - Para cada cenário, gera um `test()` em JavaScript que chama `Given`, `When`, `Then` com os textos exatos do Gherkin.  
   - Salva em `tests/.features-gen/` (ex.: `example.feature.spec.js`).  
   - Esse arquivo **não** contém lógica de tela; só “chama” os steps pelo texto.

2. **Playwright**  
   - Usa `playwright.config.js`.  
   - `testDir` aponta para o resultado do BDD (a pasta/objeto gerado), então ele “vê” os testes como arquivos `.spec.js` dentro de `.features-gen`.  
   - Para cada teste (cada cenário), o Playwright abre o navegador e executa o código gerado.

3. **Execução de um cenário**  
   - O código gerado faz algo como:  
     `await Given('que abri a página do Porto Bank', null, { page });`  
     `await When('clico em "Área do Cliente"', null, { page });`  
     etc.  
   - O **playwright-bdd** procura em `tests/steps/**/*.js` uma função cujo texto combine com a frase (ex.: `Given('que abri a página do Porto Bank', ...)`).  
   - Quando acha, chama essa função passando o `page`.  
   - Dentro do step você usa `objs.*` e `testUser`, dá `click()`, `fill()`, `expect()`, e chama `takeScreenshot(page, 'nome')`.

4. **Durante o teste**  
   - **Playwright**: grava vídeo, tira screenshot (conforme config), e envia eventos (início/fim de teste, steps, anexos) para os reporters.  
   - **allure-playwright**: escuta esses eventos e grava em `allure-results/` (JSON + anexos).  
   - **takeScreenshot**: além de salvar em pasta (se configurado), chama a API do **allure-js-commons** para anexar a imagem ao teste/step atual no Allure.

5. **Depois da execução**  
   - `allure-results/` contém tudo daquela run (e de runs anteriores se não limpou).  
   - Ao rodar `npm run report:allure`, o **Allure CLI** lê `allure-results/`, gera o HTML em `allure-report/` e abre no navegador.  
   - No relatório você vê: cenários, steps, status (passou/falhou), vídeo, screenshots e anexos que você adicionou nos steps.

Resumindo: **Feature (texto) → bddgen → spec que chama steps → steps usam objects + test-data + screenshot → Playwright roda no browser → Allure grava e depois gera o relatório.**

---

## 3. Fluxo quando você roda só os specs (sem BDD)

```
npm run test:spec
```

- Usa `playwright.specs.config.js`.  
- `testDir`: `./tests`, `testMatch`: `**/*.spec.js`.  
- Só os arquivos como `tests/example.spec.js` são executados.  
- Não usa `.feature` nem `.features-gen`; não roda `bddgen`.  
- Os testes são os `test()` que você escreveu à mão em `example.spec.js`, usando os mesmos `objs`, `testUser` e `takeScreenshot`.  
- O Allure funciona igual: vídeo, screenshot e anexos vão para `allure-results/` e depois para o relatório.

---

## 4. Por que existe `.features-gen` e não versionamos

- **`.features-gen`** é **código gerado**: um espelho em JS dos cenários que estão nas `.feature`.  
- Ele é produzido pelo `bddgen` a partir da fonte de verdade (as features).  
- Se você versionasse, poderia ficar dessincronizado com as features. Por isso costuma-se colocar `tests/.features-gen/` no `.gitignore` e gerar de novo a cada run (ou antes de rodar os testes).  
- O Playwright (com o config BDD) usa esse diretório como `testDir`, então “enxerga” os testes a partir daqui.

---

## 5. Como os steps são encontrados

- Cada frase do Gherkin (ex.: “Dado que abri a página do Porto Bank”) vira uma chamada no spec gerado.  
- O playwright-bdd faz **matching** por texto: procura em todos os steps registrados (`Given`, `When`, `Then`) um que corresponda à frase.  
- Parâmetros como `{string}` são preenchidos com os valores do cenário (ex.: “Área do Cliente”) e passados para a função do step.  
- Por isso a frase no step tem que ser **igual** (ou compatível com o padrão) ao que está na feature; senão o step não é encontrado e o teste quebra.

---

## 6. Papel do Allure

- **allure-playwright**: reporter do Playwright que, durante a execução, escreve em `allure-results/` (resultados, steps, anexos).  
- **allure-js-commons** (usado em `takeScreenshot`): API para anexar dados (ex.: imagem) ao teste/step atual. Esses anexos entram nos arquivos que o reporter grava.  
- **allure-commandline**: lê `allure-results/`, gera o site estático em `allure-report/` e pode abrir no browser.  
- No relatório você vê: quantos passaram/falharam, por suite/cenário, e dentro de cada teste os steps e as evidências (vídeo do Playwright, screenshots automáticos, screenshots dos steps).  

Ou seja: o framework **já está preparado** para que cada cenário (e cada step) deixe evidência no Allure; o cenário de “falha proposital” serve para ver como isso aparece quando o teste falha.

---

## 7. Resumo rápido

- **Feature** = cenário em português (Gherkin).  
- **bddgen** = gera código Playwright que chama steps pelo texto.  
- **Steps** = implementação que usa **objects** + **test-data** + **takeScreenshot**.  
- **Playwright** = executa no navegador, grava vídeo/screenshot e notifica o Allure.  
- **Allure** = junta tudo em `allure-results/` e depois gera o relatório em `allure-report/` para você ver cenários, steps e evidências.

Se quiser apenas rodar e ver evidência: `npm run test:e2e` e em seguida `npm run report:allure`.
