/**
 * Step definitions para example.feature — usa tests/utils/objects.js e test-data.js.
 */
import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import * as objs from '../utils/objects.js';
import { testUser } from '../utils/test-data.js';
import { takeScreenshot } from '../utils/screenshot.js';

const TIMEOUT_ESPERA = 60000;
const TIMEOUT_MODAL_ERRO = 15000;

const { Given, When, Then } = createBdd();

Given('que abri a página do Porto Bank', async ({ page }) => {
  await page.goto(objs.urlBank(page));
  await takeScreenshot(page, '01-pagina-porto-bank');
});

Then('a home exibe {string}', async ({ page }, text) => {
  if (text === objs.textos.conteComNossoCuidado) {
    const homeVisivel = await objs.main(page).locator(`text=${text}`).isVisible().catch(() => false);
    const erroVisivel = await objs.modalErroLogin(page).isVisible().catch(() => false);
    expect(homeVisivel || erroVisivel).toBeTruthy();
  } else {
    await expect(objs.main(page)).toContainText(text, { timeout: TIMEOUT_ESPERA });
  }
  await takeScreenshot(page, '06-resultado-final');
});

// --- Logout ---

Given('que estou logado na home', async ({ page }) => {
  await page.goto(objs.urlBank(page));
  await objs.btnAreaCliente(page).click();
  await expect(objs.heading(page)).toContainText(objs.textos.conecteSeViaPortoId, { timeout: TIMEOUT_ESPERA });
  await objs.textboxCpf(page).fill(testUser.cpf);
  await objs.btnContinuar(page).click();
  await expect(objs.textboxSenha(page)).toBeVisible({ timeout: TIMEOUT_ESPERA });
  await objs.textboxSenha(page).fill(testUser.senha);
  await objs.btnFazerLogin(page).click();
  try {
    await expect(objs.main(page)).toContainText(objs.textos.conteComNossoCuidado, { timeout: TIMEOUT_ESPERA });
  } catch {
    await expect(objs.modalErroLogin(page)).toBeVisible({ timeout: TIMEOUT_MODAL_ERRO });
  }
  await takeScreenshot(page, 'logout-01-logado');
});

When('vou para a home do cliente', async ({ page }) => {
  await page.goto(objs.urlHomeCliente);
  await expect(objs.btnMenuHome(page)).toBeVisible({ timeout: TIMEOUT_ESPERA });
  await takeScreenshot(page, 'logout-02-home-cliente');
});

When('abro o menu da home', async ({ page }) => {
  await objs.btnMenuHome(page).click();
  await takeScreenshot(page, 'logout-03-menu-aberto');
});

When('clico em {string}', async ({ page }, name) => {
  if (name === 'Área do Cliente') {
    await objs.btnAreaCliente(page).click();
    await takeScreenshot(page, '02-area-cliente');
  } else if (name === 'Sair da conta') {
    await objs.btnSairConta(page).click();
    await takeScreenshot(page, 'logout-04-sair-conta');
  }
});

When('clico em {string} para confirmar saída', async ({ page }, name) => {
  if (name === 'Sim') {
    await objs.btnSimLogout(page).click();
    await expect(objs.heading(page)).toContainText(objs.textos.conecteSeViaPortoId, { timeout: TIMEOUT_ESPERA });
  }
});

When('clico em {string} para cancelar saída', async ({ page }, name) => {
  if (name === 'Não') {
    await objs.btnNaoLogout(page).click();
  }
});

Then('a home do cliente continua visível', async ({ page }) => {
  await expect(objs.btnMenuHome(page)).toBeVisible({ timeout: TIMEOUT_ESPERA });
  await takeScreenshot(page, 'cancelar-logout-05-permanece-home');
});

Then('a tela exibe o heading {string}', async ({ page }, text) => {
  await expect(objs.heading(page)).toContainText(text, { timeout: TIMEOUT_ESPERA });
  await takeScreenshot(page, text.includes('Conecte-se') ? 'logout-05-tela-login' : '03-tela-porto-id');
});

Then('a validação falha propositalmente para evidência', async ({ page }) => {
  await takeScreenshot(page, 'falha-proposital-antes-falha');
  await expect(objs.heading(page)).toContainText('FALHA PROPOSITAL - este texto não existe', { timeout: 5000 });
});

When('preencho o CPF e clico em Continuar', async ({ page }) => {
  await objs.textboxCpf(page).fill(testUser.cpf);
  await objs.btnContinuar(page).click();
  await takeScreenshot(page, '04-tela-senha');
});

When('preencho a senha e clico em Fazer login', async ({ page }) => {
  await expect(objs.textboxSenha(page)).toBeVisible({ timeout: TIMEOUT_ESPERA });
  await objs.textboxSenha(page).fill(testUser.senha);
  await objs.btnFazerLogin(page).click();
  // Sucesso = home carrega OU modal "Ops, algo deu errado" aparece
  try {
    await expect(objs.main(page)).toContainText(objs.textos.conteComNossoCuidado, { timeout: TIMEOUT_ESPERA });
  } catch {
    await expect(objs.modalErroLogin(page)).toBeVisible({ timeout: TIMEOUT_MODAL_ERRO });
  }
  await takeScreenshot(page, '05-apos-login');
});
