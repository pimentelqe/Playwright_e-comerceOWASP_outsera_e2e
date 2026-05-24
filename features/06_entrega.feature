Feature: 6. Velocidade de entrega

  Background:
    Given que o usuário está autenticado com conta nova
    And que há "Banana Juice (1000ml)" no carrinho
    And que o usuário completou a seleção de endereço

  Scenario: Deve exibir as três opções de entrega disponíveis
    Then a opção de entrega "One Day Delivery" está disponível
    And a opção de entrega "Fast Delivery" está disponível
    And a opção de entrega "Standard Delivery" está disponível

  Scenario: Deve selecionar Standard Delivery e habilitar o botão Continue
    When seleciona a entrega "Standard Delivery"
    Then o botão Continuar está habilitado
