import path from 'path';
import fs from 'fs';

const PASTA_SCREENSHOTS = path.join(process.cwd(), 'test-results', 'screenshots');

/**
 * Tira screenshot e anexa ao Allure Report como evidência.
 * Também salva em test-results/screenshots/ quando necessário.
 * @param {import('@playwright/test').Page} page
 * @param {string} nome - Nome da etapa/evidência (ex.: '01-tela-inicial')
 * @returns {Promise<string|undefined>} - Caminho do arquivo salvo, se aplicável
 */
export async function takeScreenshot(page, nome) {
  const buffer = await page.screenshot();
  const safeName = nome.replace(/[<>:"/\\|?*]/g, '-');

  try {
    const { attachment } = await import('allure-js-commons');
    await attachment(safeName, buffer, { contentType: 'image/png' });
  } catch (_) {
    // Allure não disponível ou outro reporter
  }

  try {
    fs.mkdirSync(PASTA_SCREENSHOTS, { recursive: true });
    const arquivo = path.join(PASTA_SCREENSHOTS, `${safeName}.png`);
    fs.writeFileSync(arquivo, buffer);
    return arquivo;
  } catch (_) {
    return undefined;
  }
}

export default takeScreenshot;
