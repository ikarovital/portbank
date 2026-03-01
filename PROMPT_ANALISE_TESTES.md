Atue como Analista de Testes Sênior especializado em automação E2E com Playwright e BDD.

Sua tarefa é criar cenários BDD em Gherkin prontos para automação, com base nos objetos reais mapeados da interface.

## CONTEXTO DO TESTE
- Sistema: Área do cliente — Porto Bank
- Tipo: Aplicação web autenticada
- Usuário já autenticado
- Objetos da interface foram capturados no arquivo login.js
- Os seletores devem ser considerados confiáveis
- Dados de teste (CPF/senha modelo): tests/utils/test-data.js

## REGRAS OBRIGATÓRIAS
- Escreva em português
- Use Dado / Quando / E / Então
- Um cenário deve ser automatizável do início ao fim
- Use ações claras baseadas em elementos da UI
- Inclua validações observáveis
- Não escrever explicações fora do Gherkin
- Evitar cenários genéricos ou não testáveis

## COBERTURA OBRIGATÓRIA — ÁREA DO CLIENTE

Gerar cenários para:

### Acesso à área autenticada
- Carregamento da home após login
- Exibição do nome do cliente
- Menu principal visível

### Navegação
- Acesso aos módulos disponíveis
- Redirecionamentos corretos
- Links quebrados ou inacessíveis

### Segurança e sessão
- Expiração de sessão
- Logout manual
- Acesso direto por URL sem autenticação

### Dados do cliente
- Exibição de informações pessoais
- Consistência dos dados apresentados

## OBJETOS DISPONÍVEIS
import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.portoseguro.com.br/bank');
  await page.getByRole('button', { name: 'Área do Cliente' }).click();
  await expect(page.getByRole('heading')).toContainText('Conecte-se via Porto ID');
  await page.getByRole('textbox', { name: 'Insira seu CPF ou CNPJ' }).click();
  await page.getByRole('textbox', { name: 'Insira seu CPF ou CNPJ' }).fill('371.543.158-06');
  await page.getByRole('button', { name: 'Continuar' }).click();
  await page.getByRole('textbox', { name: 'Digite sua senha para acessar' }).click();
  await page.getByRole('textbox', { name: 'Digite sua senha para acessar' }).fill('48276250');
  await page.getByRole('button', { name: 'Fazer login' }).click();
  await page.getByText('Senha inválida. Verifique e').click();
  await page.getByRole('button', { name: 'Esqueceu a senha' }).click();
  await expect(page.getByLabel('Método de verificação utilizando E-mail')).toContainText('E-mail');
  await expect(page.getByLabel('Método de verificação utilizando SMS')).toContainText('SMS');
  await page.getByRole('button', { name: 'Método de verificação utilizando SMS' }).click();
  await page.getByRole('textbox', { name: 'Dígito 1 do código OTP' }).fill('5');
  await page.getByRole('textbox', { name: 'Dígito 2 do código OTP' }).fill('0');
  await page.getByRole('textbox', { name: 'Dígito 3 do código OTP' }).fill('7');
  await page.getByRole('textbox', { name: 'Dígito 4 do código OTP' }).fill('8');
  await page.getByRole('textbox', { name: 'Dígito 5 do código OTP' }).fill('9');
  await page.getByRole('textbox', { name: 'Dígito 6 do código OTP' }).fill('2');
  await page.getByRole('textbox', { name: 'Dígito 7 do código OTP' }).fill('5');
  await page.goto('https://cliente.portoseguro.com.br/auth/forgot-password/register');
  await page.getByRole('textbox', { name: 'Senha', exact: true }).click();
  await page.getByRole('textbox', { name: 'Senha', exact: true }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Senha', exact: true }).fill('S');
  await page.getByRole('textbox', { name: 'Senha', exact: true }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Senha', exact: true }).fill('Sakop@123');
  await page.getByRole('textbox', { name: 'Senha', exact: true }).press('Tab');
  await page.getByRole('textbox', { name: 'Repita sua senha' }).click();
  await page.getByRole('textbox', { name: 'Repita sua senha' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Repita sua senha' }).fill('S');
  await page.getByRole('textbox', { name: 'Repita sua senha' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Repita sua senha' }).fill('Sakop@123');
  await page.getByRole('button', { name: 'Salvar' }).click();
  await page.goto('https://cliente.portoseguro.com.br/auth/login/password');
  await page.getByRole('textbox', { name: 'Digite sua senha para acessar' }).click();
  await page.getByRole('textbox', { name: 'Digite sua senha para acessar' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Digite sua senha para acessar' }).fill('Sakop@123');
  await page.getByRole('button', { name: 'Fazer login' }).click();
  await page.goto('https://cliente.portoseguro.com.br/auth/acceptance-terms');
  await page.getByRole('checkbox', { name: 'Selecionar para indicar se' }).check();
  await page.getByRole('button', { name: 'Entrar' }).click();
  await page.goto('https://cliente.portoseguro.com.br/home');
  await page.getByTestId('home-header-menu-controller-test-id').click();
  await page.getByRole('button', { name: 'Sair da conta' }).click();
  await expect(page.locator('html')).toContainText('Sair da conta');
  await page.getByRole('button', { name: 'Sim' }).click();
  await expect(page.getByRole('heading')).toContainText('Conecte-se via Porto ID');
});

## FORMATO DE SAÍDA
- Apenas Gherkin
- Organizado por funcionalidade
- Iniciar com "Funcionalidade:"