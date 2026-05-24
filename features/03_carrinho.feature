Feature: 3. Carrinho de compras

  Background:
    Given que o usuário está autenticado com conta nova
    And que o usuário está na página inicial

  Scenario: Deve adicionar Banana Juice ao carrinho
    When adiciona "Banana Juice (1000ml)" ao carrinho
    Then a notificação contém "Placed Banana Juice (1000ml) into basket"
    And o ícone do carrinho exibe quantidade "1"

  Scenario: Deve exibir o produto correto no carrinho
    When adiciona "Banana Juice (1000ml)" ao carrinho
    And clica no ícone do carrinho
    Then é redirecionado para a página do carrinho
    And o carrinho exibe o produto "Banana Juice (1000ml)"
    And o carrinho exibe o preço "1.99"
