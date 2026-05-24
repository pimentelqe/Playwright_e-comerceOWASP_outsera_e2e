# Playwright OWASP Juice Shop — Automação de Testes E2E

Suite de testes end-to-end para a aplicação [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/), construída com **Playwright** + **BDD (Cucumber/Gherkin)** + **Page Object Model**, com relatórios gerados pelo **Allure**.

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Stack de Tecnologia](#2-stack-de-tecnologia)
3. [Arquitetura do Projeto](#3-arquitetura-do-projeto)
4. [Pré-requisitos](#4-pré-requisitos)
5. [Como Executar Localmente](#5-como-executar-localmente)
6. [Cenários de Teste](#6-cenários-de-teste)
7. [Relatórios de Teste](#7-relatórios-de-teste)

---

## 1. Visão Geral

Este projeto valida os principais fluxos funcionais do Juice Shop — uma aplicação web intencionalmente vulnerável usada como referência para testes de segurança e qualidade. Os testes cobrem desde o cadastro de usuário até a confirmação de pedido, passando por carrinho, endereço, entrega e pagamento.

A suite foi desenhada com dois pilares:

| Pilar | Objetivo |
|---|---|
| **BDD** | Cenários legíveis por todas as partes — QA, Dev, Produto |
| **Page Object Model** | Encapsular seletores e ações, facilitando manutenção |

---

## 2. Stack de Tecnologia

| Ferramenta | Versão | Papel |
|---|---|---|
| [Playwright](https://playwright.dev) | 1.60 | Engine de automação de browser |
| [playwright-bdd](https://github.com/vitalets/playwright-bdd) | 8.5 | Integração Gherkin com Playwright Test runner |
| [@cucumber/cucumber](https://github.com/cucumber/cucumber-js) | 12.9 | Parser Gherkin e tipo `DataTable` |
| [allure-playwright](https://allurereport.org) | 3.9 | Reporter Allure para Playwright |
| [allure-commandline](https://www.npmjs.com/package/allure-commandline) | 2.41 | CLI para geração do HTML do relatório |
| TypeScript | (via @types/node) | Tipagem estática em todos os arquivos |
| Docker | — | Sobe o Juice Shop em ambiente isolado |

---

## 3. Arquitetura do Projeto

```
.
├── features/                        # Cenários em linguagem Gherkin
│   ├── 01_registro.feature
│   ├── 02_login.feature
│   ├── 03_carrinho.feature
│   ├── 04_checkout.feature
│   ├── 05_endereco.feature
│   ├── 06_entrega.feature
│   ├── 07_cartao.feature
│   └── 08_confirmacao.feature
│
├── tests/
│   ├── pages/                       # Page Objects (um por página da aplicação)
│   │   ├── BasePage.ts              # Classe base: dismissWelcomeBanner()
│   │   ├── RegisterPage.ts
│   │   ├── LoginPage.ts
│   │   ├── HomePage.ts
│   │   ├── BasketPage.ts
│   │   ├── AddressSelectPage.ts
│   │   ├── AddressCreatePage.ts
│   │   ├── DeliveryMethodPage.ts
│   │   ├── PaymentPage.ts
│   │   ├── OrderSummaryPage.ts
│   │   └── OrderConfirmationPage.ts
│   │
│   ├── steps/                       # Step definitions (Given / When / Then)
│   │   ├── common.steps.ts          # Steps reutilizados entre features
│   │   ├── registro.steps.ts
│   │   ├── login.steps.ts
│   │   └── carrinho.steps.ts
│   │
│   └── support/
│       └── fixtures.ts              # Fixtures Playwright + World compartilhado
│
├── .features-gen/                   # Gerado automaticamente pelo playwright-bdd (gitignore)
├── allure-results/                  # Gerado pelos testes (gitignore)
├── allure-report/                   # Gerado pelo CLI Allure (gitignore)
└── playwright.config.ts             # Configuração central do Playwright
```

### Page Object Model

Cada página da aplicação tem sua própria classe que encapsula seletores e ações. Isso garante que, se um seletor mudar na aplicação, a correção é feita em **um único arquivo**.

```
BasePage  ←  RegisterPage, LoginPage, HomePage, BasketPage ...
```

`BasePage` fornece `dismissWelcomeBanner()`, que é chamado automaticamente no `goto()` de cada página para fechar o modal inicial do Juice Shop — evitando que ele bloqueie interações.

### BDD com playwright-bdd

O `playwright-bdd` conecta os arquivos `.feature` diretamente ao Playwright Test runner, preservando todos os seus recursos nativos (fixtures, trace, screenshot, retry, paralelismo).

```
features/*.feature
    ↓  bddgen (pré-processamento)
.features-gen/*.spec.js
    ↓  playwright test
resultado com Allure + HTML report
```

### Fixtures e World

O arquivo `fixtures.ts` centraliza:
- **Page Objects como fixtures** — injetados automaticamente em cada step pelo Playwright
- **World** — objeto mutável `{ email, password }` compartilhado entre steps do mesmo cenário, permitindo que um `Given` crie um usuário e um `When` use o e-mail sem variáveis globais



## 4. Pré-requisitos

- **Node.js** 18+ e **npm**
- **Docker** (para subir o Juice Shop localmente)
- Java 17+ (apenas para gerar o relatório Allure localmente — não necessário para rodar os testes)

---

## 5. Como Executar Localmente

### 1. Instalar dependências

```bash
npm ci
npx playwright install --with-deps chromium
```

### 2. Subir o Juice Shop com Docker

```bash
docker run --rm -d -p 3006:3000 -e HOST=0.0.0.0 --name juice-shop bkimminich/juice-shop
```

Aguarde até a aplicação e a API de produtos estarem prontas:

```bash
curl -s http://127.0.0.1:3006/api/Products | grep -q '"status":"success"' && echo "Pronto"
```

### 3. Executar os testes

```bash
# Todos os cenários BDD
npx playwright test

# Com saída detalhada no terminal
npx playwright test --reporter=list

# Um único feature
npx playwright test --grep "Carrinho"

# Um cenário específico
npx playwright test --grep "Deve adicionar Banana Juice"

# Com interface gráfica (debug visual)
npx playwright test --headed
```

### 4. Gerar o relatório Allure

```bash
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report
```

### 5. Parar o Juice Shop

```bash
docker stop juice-shop
```

---

## 6. Cenários de Teste

| # | Feature | Cenários | Técnica de Setup |
|---|---|---|---|
| 1 | Registro de usuário | Sucesso · E-mail duplicado · Senhas diferentes | UI |
| 2 | Login | Credenciais válidas · Credenciais inválidas | API (`POST /api/Users/`) |
| 3 | Carrinho de compras | Adicionar produto · Visualizar carrinho | API + UI |
| 4 | Checkout completo (E2E) | Endereço + entrega + pagamento + confirmação | API + UI |
| 5 | Endereço de entrega | Criar endereço · Celular inválido | API + UI |
| 6 | Velocidade de entrega | Listar opções · Habilitar botão | API + UI |
| 7 | Cartão de crédito | Adicionar cartão · Sem pagamento selecionado | API + UI |
| 8 | Confirmação do pedido | Fluxo completo até confirmação | API + UI |

**Total: 15 cenários, 15 testes automatizados**

### Estratégia de independência

Cada cenário cria seu próprio usuário via API REST (`POST /api/Users/`) antes de iniciar. Isso garante:

- Zero dependência entre testes
- Execução paralela segura (`fullyParallel: true`)
- Nenhum cenário falha por herdar estado corrompido de outro

---

## 7. Relatórios de Teste

O projeto gera dois relatórios complementares após cada execução.

### Allure Report

O Allure é o relatório principal, projetado especificamente para BDD. Ele apresenta os resultados organizados por Feature e Cenário — exatamente como foram escritos nos arquivos `.feature`.

```bash
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report
```

**Overview — dashboard de resultado geral:**

![Allure Report Overview](report.png)

**Suites — navegação por Feature > Cenário > Step (visão Gherkin):**

![Allure Report Gherkin](report-gherkin.png)

**O que o relatório mostra:**

```
Allure Report
├── Overview          — dashboard com pizza de status (passed/failed/broken)
├── Suites            — organizado por Feature > Cenário > Step
│   ├── 1. Registro de usuário
│   │   ├── ✅ Deve registrar um novo usuário com sucesso
│   │   │   ├── Given que o usuário acessa a página de registro
│   │   │   ├── When preenche o formulário com um e-mail único...
│   │   │   ├── And seleciona uma pergunta de segurança
│   │   │   └── Then é redirecionado para a página de login
│   │   └── ...
│   └── ...
├── Graphs            — tendências de execução ao longo do tempo
├── Timeline          — visualização paralela dos workers
└── Behaviors         — organizado por épico/história/cenário (BDD view)
```

**Em caso de falha**, o Allure anexa automaticamente:
- Screenshot do momento da falha
- Vídeo da execução
- Trace do Playwright (inspeção passo a passo)

### Playwright HTML Report

Relatório nativo do Playwright.

```bash
npx playwright show-report playwright-report
```

Útil para inspecionar o **trace viewer** integrado: reproduz cada step como um vídeo com DOM snapshot, network e console.

---

## Decisões de Design

**Por que playwright-bdd e não @cucumber/cucumber standalone?**
Manter o Playwright Test como runner preserva todos os seus recursos nativos: fixtures, paralelismo configurável, trace, retry automático, screenshot on failure. O `playwright-bdd` adiciona apenas a camada Gherkin por cima.

**Por que criar usuários via API nos `Background`?**
Testes que dependem de UI para criar pré-condições são lentos e frágeis. Usar a API do Juice Shop para criar o usuário antes da navegação reduz o tempo de setup e elimina a dependência entre cenários.

**Por que o `World` como fixture mutável?**
O `World` (`{ email, password }`) é reinicializado para cada cenário pelo Playwright, garantindo isolamento. Dentro de um cenário, os steps podem compartilhar estado sem variáveis globais — seguindo o padrão da comunidade Cucumber.
