Feature: 7. Cartão de crédito

  Background:
    Given que o usuário está autenticado com conta nova
    And que há "Banana Juice (1000ml)" no carrinho
    And que o usuário completou a seleção de endereço
    And que selecionou a entrega "Standard Delivery"

  Scenario: Deve adicionar novo cartão de crédito
    When adiciona um novo cartão de crédito:
      | name       | number           | expiryMonth | expiryYear |
      | João Silva | 4111111111111111 | 12          | 2090       |
    Then a notificação contém "Your card ending with 1111 has been saved"
    And a página exibe "************1111"

  Scenario: Não deve habilitar Continue sem selecionar forma de pagamento
    Then o botão Continuar para o resumo está desabilitado
