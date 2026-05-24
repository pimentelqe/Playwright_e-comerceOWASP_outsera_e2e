Feature: 4. Fluxo de checkout completo

  Background:
    Given que o usuário está autenticado com conta nova
    And que há "Banana Juice (1000ml)" no carrinho

  Scenario: Deve completar checkout com Standard Delivery e cartão de crédito
    Given que o usuário está na página do carrinho
    Then o carrinho exibe o produto "Banana Juice (1000ml)"
    And o carrinho exibe o preço "1.99"

    When o usuário clica em Checkout
    And adiciona um novo endereço:
      | country | name       | mobile     | zip      | address                | city      | state |
      | Brazil  | João Silva | 9876543210 | 01310100 | Avenida Paulista, 1000 | São Paulo | SP    |
    And seleciona o primeiro endereço e avança para a entrega

    And seleciona a entrega "Standard Delivery" e avança para o pagamento

    And adiciona um novo cartão de crédito:
      | name       | number           | expiryMonth | expiryYear |
      | João Silva | 4111111111111111 | 12          | 2090       |
    And seleciona o primeiro cartão e avança para o resumo

    Then o resumo exibe cartão terminando em "1111"
    And o resumo exibe titular "João Silva"
    And o resumo exibe total "1.99"

    When confirma o pedido
    Then é redirecionado para a página de confirmação
    And vê a mensagem "Thank you for your purchase!"
