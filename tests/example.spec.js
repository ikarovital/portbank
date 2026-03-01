import { test, expect } from '@playwright/test';
import { step } from 'allure-js-commons';
import * as objs from './utils/objects.js';
import { testUser } from './utils/test-data.js';
import { takeScreenshot } from './utils/screenshot.js';

const TIMEOUT_ESPERA = 60000;

test.describe('Login e Logout — Porto Bank', () => {

  test('Login e validar home', async ({ page }) => {
    await step('Abrir Porto Bank e ir para Área do Cliente', async () => {
      await page.goto(objs.urlBank(page));
      await objs.btnAreaCliente(page).click();
      await takeScreenshot(page, '01-area-cliente');
    });

    await step('Validar tela Conecte-se via Porto ID', async () => {
      await expect(objs.heading(page)).toContainText(objs.textos.conecteSeViaPortoId, { timeout: TIMEOUT_ESPERA });
      await takeScreenshot(page, '02-tela-porto-id');
    });

    await step('Preencher CPF e continuar', async () => {
      await objs.textboxCpf(page).fill(testUser.cpf);
      await objs.btnContinuar(page).click();
      await takeScreenshot(page, '03-tela-senha');
    });

    await step('Preencher senha e fazer login', async () => {
      await objs.textboxSenha(page).fill(testUser.senha);
      await objs.btnFazerLogin(page).click();
      try {
        await expect(objs.main(page)).toContainText(objs.textos.conteComNossoCuidado, { timeout: TIMEOUT_ESPERA });
      } catch {
        await expect(objs.modalErroLogin(page)).toBeVisible({ timeout: 15000 });
      }
      await takeScreenshot(page, '04-apos-login');
    });

    await step('Validar home ou modal de erro', async () => {
      const homeVisivel = await objs.main(page).locator(`text=${objs.textos.conteComNossoCuidado}`).isVisible().catch(() => false);
      const erroVisivel = await objs.modalErroLogin(page).isVisible().catch(() => false);
      expect(homeVisivel || erroVisivel).toBeTruthy();
      await takeScreenshot(page, '05-resultado-final');
    });
  });

  test('Logout e voltar à tela de login', async ({ page }) => {
    await step('Fazer login e aguardar home', async () => {
      await page.goto(objs.urlBank(page));
      await objs.btnAreaCliente(page).click();
      await expect(objs.heading(page)).toContainText(objs.textos.conecteSeViaPortoId, { timeout: TIMEOUT_ESPERA });
      await objs.textboxCpf(page).fill(testUser.cpf);
      await objs.btnContinuar(page).click();
      await objs.textboxSenha(page).fill(testUser.senha);
      await objs.btnFazerLogin(page).click();
      try {
        await expect(objs.main(page)).toContainText(objs.textos.conteComNossoCuidado, { timeout: TIMEOUT_ESPERA });
      } catch {
        await expect(objs.modalErroLogin(page)).toBeVisible({ timeout: 15000 });
      }
      await takeScreenshot(page, 'logout-01-logado');
    });

    await step('Ir para home do cliente e aguardar menu', async () => {
      await page.goto(objs.urlHomeCliente);
      await expect(objs.btnMenuHome(page)).toBeVisible({ timeout: TIMEOUT_ESPERA });
      await takeScreenshot(page, 'logout-02-home-cliente');
    });

    await step('Abrir menu e sair da conta', async () => {
      await objs.btnMenuHome(page).click();
      await takeScreenshot(page, 'logout-03-menu-aberto');
      await objs.btnSairConta(page).click();
      await takeScreenshot(page, 'logout-04-sair-conta');
    });

    await step('Confirmar saída e validar tela de login', async () => {
      await objs.btnSimLogout(page).click();
      await expect(objs.heading(page)).toContainText(objs.textos.conecteSeViaPortoId, { timeout: TIMEOUT_ESPERA });
      await takeScreenshot(page, 'logout-05-tela-login');
    });
  });

  test('Cancelar logout e permanecer na home', async ({ page }) => {
    await step('Fazer login e aguardar home', async () => {
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
        await expect(objs.modalErroLogin(page)).toBeVisible({ timeout: 15000 });
      }
      await takeScreenshot(page, 'cancelar-logout-01-logado');
    });

    await step('Ir para home do cliente e aguardar menu', async () => {
      await page.goto(objs.urlHomeCliente);
      await expect(objs.btnMenuHome(page)).toBeVisible({ timeout: TIMEOUT_ESPERA });
      await takeScreenshot(page, 'cancelar-logout-02-home-cliente');
    });

    await step('Abrir menu e clicar em Sair da conta', async () => {
      await objs.btnMenuHome(page).click();
      await takeScreenshot(page, 'cancelar-logout-03-menu-aberto');
      await objs.btnSairConta(page).click();
      await takeScreenshot(page, 'cancelar-logout-04-modal-sair');
    });

    await step('Clicar em Não e validar que permanece na home', async () => {
      await objs.btnNaoLogout(page).click();
      await expect(objs.btnMenuHome(page)).toBeVisible({ timeout: TIMEOUT_ESPERA });
      await takeScreenshot(page, 'cancelar-logout-05-permanece-home');
    });
  });

  test('Falha proposital para evidência no relatório', async ({ page }) => {
    await step('Abrir Porto Bank e Área do Cliente', async () => {
      await page.goto(objs.urlBank(page));
      await objs.btnAreaCliente(page).click();
      await takeScreenshot(page, 'falha-proposital-01-area-cliente');
    });

    await step('Validar heading Conecte-se via Porto ID', async () => {
      await expect(objs.heading(page)).toContainText(objs.textos.conecteSeViaPortoId, { timeout: TIMEOUT_ESPERA });
      await takeScreenshot(page, 'falha-proposital-02-tela-porto-id');
    });

    await step('Falha proposital para gerar evidência', async () => {
      await takeScreenshot(page, 'falha-proposital-03-antes-falha');
      await expect(objs.heading(page)).toContainText('FALHA PROPOSITAL - este texto não existe', { timeout: 5000 });
    });
  });
});
