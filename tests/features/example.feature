# language: pt
Funcionalidade: Login e Logout — Porto Bank

  Cenário: Acessar Área do Cliente, fazer login e validar home
    Dado que abri a página do Porto Bank
    Quando clico em "Área do Cliente"
    Então a tela exibe o heading "Conecte-se via Porto ID"
    Quando preencho o CPF e clico em Continuar
    E preencho a senha e clico em Fazer login
    Então a home exibe "Conte com nosso cuidado."

  Cenário: Fazer logout e voltar à tela de login
    Dado que estou logado na home
    Quando vou para a home do cliente
    E abro o menu da home
    E clico em "Sair da conta"
    E clico em "Sim" para confirmar saída
    Então a tela exibe o heading "Conecte-se via Porto ID"

  Cenário: Cancelar logout e permanecer na home
    Dado que estou logado na home
    Quando vou para a home do cliente
    E abro o menu da home
    E clico em "Sair da conta"
    E clico em "Não" para cancelar saída
    Então a home do cliente continua visível

  # Falha proposital para gerar evidência de teste falho no Allure (screenshot + vídeo)
  Cenário: Falha proposital para evidência no relatório
    Dado que abri a página do Porto Bank
    Quando clico em "Área do Cliente"
    Então a tela exibe o heading "Conecte-se via Porto ID"
    E a validação falha propositalmente para evidência
