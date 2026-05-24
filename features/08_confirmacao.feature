Feature: 8. Confirmação do pedido

  Scenario: Deve exibir mensagem de confirmação após finalizar o pedido
    Given que o usuário está autenticado com conta nova
    And que há "Banana Juice (1000ml)" no carrinho
    And que o usuário completou a seleção de endereço
    And que selecionou a entrega "Standard Delivery"
    And que adicionou e selecionou um cartão terminando em "1111"
    When confirma o pedido
    Then é redirecionado para a página de confirmação
    And vê a mensagem "Thank you for your purchase!"
    And a página exibe "Your order has been placed and is being processed"
