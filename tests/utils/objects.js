/**
 * Objetos da interface — Porto Bank (Área do Cliente).
 * Centraliza locators para spec e BDD; use com page do Playwright.
 * Em CI (GitHub Actions) usa mock local para não depender do site real.
 */

/** Em CI usa mock em localhost; fora usa site real. */
const MOCK_BASE = 'http://localhost:3000';

/** @param {import('@playwright/test').Page} page */
export function urlBank(page) {
  if (process.env.CI) return `${MOCK_BASE}/`;
  return 'https://www.portoseguro.com.br/bank';
}

/** URL da home do cliente (após login). Em CI usa mock. */
export const urlHomeCliente = process.env.CI
  ? `${MOCK_BASE}/home-cliente.html`
  : 'https://cliente.portoseguro.com.br/home';

/** @param {import('@playwright/test').Page} page */
export function btnAreaCliente(page) {
  return page.getByRole('button', { name: 'Área do Cliente' });
}

/** @param {import('@playwright/test').Page} page */
export function heading(page) {
  return page.getByRole('heading');
}

/** @param {import('@playwright/test').Page} page */
export function textboxCpf(page) {
  return page.getByRole('textbox', { name: 'Insira seu CPF ou CNPJ' });
}

/** @param {import('@playwright/test').Page} page */
export function btnContinuar(page) {
  return page.getByRole('button', { name: 'Continuar' });
}

/** @param {import('@playwright/test').Page} page */
export function textboxSenha(page) {
  return page.getByRole('textbox', { name: 'Digite sua senha para acessar' });
}

/** @param {import('@playwright/test').Page} page */
export function btnFazerLogin(page) {
  return page.getByRole('button', { name: 'Fazer login' });
}

/** @param {import('@playwright/test').Page} page */
export function main(page) {
  return page.getByRole('main');
}

/** Modal de erro "Ops, algo deu errado" (login inválido, etc.) */
/** @param {import('@playwright/test').Page} page */
export function modalErroLogin(page) {
  return page.getByText('Ops, algo deu errado').first();
}

/** Botão do menu (ícone) na home do cliente */
/** @param {import('@playwright/test').Page} page */
export function btnMenuHome(page) {
  return page.getByTestId('home-header-menu-controller-test-id');
}

/** Botão "Sair da conta" no menu */
/** @param {import('@playwright/test').Page} page */
export function btnSairConta(page) {
  return page.getByRole('button', { name: 'Sair da conta' });
}

/** Botão "Sim" no modal de confirmação de logout */
/** @param {import('@playwright/test').Page} page */
export function btnSimLogout(page) {
  return page.getByRole('button', { name: 'Sim' });
}

/** Botão "Não" no modal de confirmação de logout (cancela e permanece na tela) */
/** @param {import('@playwright/test').Page} page */
export function btnNaoLogout(page) {
  return page.getByRole('button', { name: 'Não' });
}

/** Textos esperados na UI */
export const textos = {
  conecteSeViaPortoId: 'Conecte-se via Porto ID',
  conteComNossoCuidado: 'Conte com nosso cuidado.',
  ola: 'Olá!',
  opsAlgoDeuErrado: 'Ops, algo deu errado',
};

export default {
  urlBank,
  btnAreaCliente,
  heading,
  textboxCpf,
  btnContinuar,
  textboxSenha,
  btnFazerLogin,
  main,
  modalErroLogin,
  urlHomeCliente,
  btnMenuHome,
  btnSairConta,
  btnSimLogout,
  btnNaoLogout,
  textos,
};
