Feature: 5. Endereço de entrega

  Background:
    Given que o usuário está autenticado com conta nova
    And que há "Banana Juice (1000ml)" no carrinho
    And que o usuário finalizou o carrinho e está na página de seleção de endereço

  Scenario: Deve criar e exibir novo endereço na lista
    When adiciona um novo endereço:
      | country | name        | mobile     | zip      | address             | city           | state |
      | Brazil  | Maria Souza | 1234567890 | 20040020 | Rua das Flores, 500 | Rio de Janeiro | RJ    |
    Then a notificação contém "successfully added"
    And a página exibe "Maria Souza"
    And a página exibe "Rio de Janeiro"

  Scenario: Não deve permitir envio com celular inválido
    When inicia o preenchimento de novo endereço:
      | country | name           | mobile      | zip      | address      | city      | state |
      | Brazil  | Teste Inválido | 99999999999 | 01310100 | Rua Teste, 1 | São Paulo | SP    |
    Then o botão Salvar endereço está desabilitado
