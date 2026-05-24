Feature: 1. Registro de usuário

  Scenario: Deve registrar um novo usuário com sucesso
    Given que o usuário acessa a página de registro
    When preenche o formulário com um e-mail único e a senha "Test@1234"
    And seleciona uma pergunta de segurança
    And clica no botão Registrar
    Then é redirecionado para a página de login
    And a notificação contém "Registration completed successfully"

  Scenario: Não deve registrar com e-mail já existente
    Given que existe um usuário cadastrado via API
    And que o usuário acessa a página de registro
    When preenche o formulário com o e-mail já cadastrado
    And seleciona uma pergunta de segurança
    And clica no botão Registrar
    Then vê a mensagem de erro "Email must be unique"

  Scenario: Não deve registrar com senhas diferentes
    Given que o usuário acessa a página de registro
    When preenche o e-mail único com senha "Test@1234" e confirmação "OutraSenha@999"
    Then o botão Registrar está desabilitado
