Feature: 2. Login

  Background:
    Given que existe um usuário cadastrado via API

  Scenario: Deve fazer login com credenciais válidas
    Given que o usuário acessa a página de login
    When preenche as credenciais cadastradas
    And clica no botão Entrar
    Then é redirecionado para a página inicial
    And o menu de conta está visível

  Scenario: Deve exibir erro com credenciais inválidas
    Given que o usuário acessa a página de login
    When preenche e-mail "invalido@example.com" e senha "SenhaErrada123"
    And clica no botão Entrar
    Then vê a mensagem de erro de login
