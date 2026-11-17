# Clima App

Aplicativo de previsão do tempo desenvolvido com **Ionic** e **Angular (standalone)** para a disciplina de Desenvolvimento Mobile. O app consulta a API pública Open-Meteo, que não exige chave de acesso, e permite pesquisar cidades, ver a previsão por hora, a previsão de 7 dias com alertas e ajustar as unidades de medida.

## Sumário

1. [Tecnologias](#tecnologias)
2. [Funcionalidades](#funcionalidades)
3. [Como executar](#como-executar)
4. [Estrutura do projeto](#estrutura-do-projeto)
5. [API utilizada](#api-utilizada)
6. [Requisitos do trabalho e onde encontrá-los](#requisitos-do-trabalho-e-onde-encontrá-los)
7. [Fluxo de passagem de parâmetro por rota](#fluxo-de-passagem-de-parâmetro-por-rota)
8. [Testes](#testes)
9. [Limitações conhecidas](#limitações-conhecidas)
10. [Equipe](#equipe)

## Tecnologias

| Tecnologia | Versão |
|---|---|
| Angular (componentes standalone) | 22.2.5 |
| Ionic Angular | 9.x |
| RxJS | 7.8 |
| Capacitor | 8.x |
| TypeScript | 6.0 |
| Vitest (testes unitários) | 5.x |

Pré-requisito: **Node.js** em versão LTS recente e **npm**.

## Funcionalidades

O app possui cinco telas, todas estilizadas com componentes do Ionic e CSS próprio:

- **Home**: clima atual de Recife em destaque, busca de cidades com consulta à API enquanto o usuário digita, atalhos para as demais telas e histórico das últimas cidades pesquisadas.
- **Cidades**: lista de cidades salvas com o clima atual de cada uma, busca para adicionar novas cidades, remoção de cidades e botão para atualizar os dados. Ao clicar em uma cidade, abre a tela de Detalhes.
- **Detalhes**: previsão das próximas 8 horas e métricas atuais (temperatura, sensação térmica, umidade, precipitação e vento) da cidade escolhida.
- **Alertas (7 dias)**: previsão diária de uma semana, com máxima, mínima, chuva, vento, índice UV, nascer e pôr do sol, e filtro para exibir apenas os dias com alerta.
- **Configurações**: escolha da unidade de temperatura (Celsius ou Fahrenheit), da unidade de vento (km/h ou mph) e modo escuro. As preferências ficam salvas no navegador.

Critérios usados para marcar um dia como alerta: chuva acumulada acima de 5 mm, índice UV máximo acima de 7, ou código meteorológico de pancada forte ou tempestade.

## Como executar

```bash
# 1. Entrar na pasta do projeto
cd clima-app

# 2. Instalar as dependências (apenas na primeira vez)
npm install

# 3. Iniciar o servidor de desenvolvimento
npm start
```

Depois, abra `http://localhost:4200` no navegador. Para simular a tela de um celular, abra as ferramentas do desenvolvedor (F12) e ative o modo de dispositivo.

Também é possível usar `ionic serve`, caso o Ionic CLI esteja instalado (`npm install -g @ionic/cli`).

O app depende de conexão com a internet para consultar a API.

### Outros comandos

| Comando | Função |
|---|---|
| `npm run build` | Gera a versão de produção na pasta `www` |
| `npm run test:unit` | Executa os testes unitários |
| `npm run lint` | Executa a verificação de estilo de código |

## Estrutura do projeto

```
src/app/
  home/                 Página inicial
  cidades/              Lista de cidades salvas
  detalhes/             Detalhes e previsão horária da cidade
  alertas/              Previsão de 7 dias e alertas
  configuracoes/        Unidades e modo escuro
  services/
    clima.service.ts          Acesso à API (HttpClient)
    configuracoes.service.ts  Preferências do usuário (localStorage)
    historico.ts              Histórico de pesquisas (localStorage)
  pipes/
    descricao-clima.pipe.ts   Código do tempo para texto
    nivel-uv.pipe.ts          Índice UV para nível de risco
    temperatura.pipe.ts       Conversão de Celsius para Fahrenheit
    vento.pipe.ts             Conversão de km/h para mph
  directives/
    faixa-temperatura.directive.ts  Cor conforme a faixa de temperatura
    destaque-alerta.directive.ts    Destaque visual para dias com alerta
  app.routes.ts         Definição das rotas
```

## API utilizada

**Open-Meteo**, gratuita e sem chave de acesso:

- Previsão: `https://api.open-meteo.com/v1/forecast`
- Geocodificação: `https://geocoding-api.open-meteo.com/v1/search`

Os quatro métodos GET estão em `src/app/services/clima.service.ts`:

| Método | Uso |
|---|---|
| `getClimaAtual(lat, lon)` | Condições atuais |
| `getPrevisaoHoraria(lat, lon)` | Previsão das próximas horas |
| `getPrevisaoDiaria(lat, lon)` | Previsão de 7 dias |
| `buscarCidades(nome)` | Pesquisa de cidades por nome |

O service mantém um cache de 5 minutos por coordenada para evitar requisições repetidas, e o botão de atualizar limpa esse cache.

## Requisitos do trabalho e onde encontrá-los

| Requisito | Onde está no código | Onde ver em tela |
|---|---|---|
| Pelo menos 3 páginas além da Home | `app.routes.ts` e pastas `cidades`, `detalhes`, `alertas`, `configuracoes` | Barra de navegação inferior |
| API com pelo menos 3 métodos GET | `services/clima.service.ts` | Home (clima e busca), Detalhes, Alertas |
| 2 pipes personalizadas | `pipes/` (`descricaoClima`, `nivelUv`, `temperatura`, `vento`) | Descrição do clima na Home, nível de UV em Alertas, temperatura ao trocar a unidade em Configurações |
| 2 pipes built-in | `date`, `number` e `uppercase` nos arquivos `.html` das páginas | Data no topo da Home e valores numéricos formatados |
| Service com HttpClient | `services/clima.service.ts` | Qualquer tela que carrega dados da API |
| Segundo service com outra funcionalidade | `services/configuracoes.service.ts` e `services/historico.ts` | Configurações (unidades) e histórico na Home |
| 2 diretivas personalizadas | `directives/faixa-temperatura.directive.ts` e `directives/destaque-alerta.directive.ts` | Cartões de Cidades e Alertas com borda e cor conforme a temperatura e o alerta |
| Diretiva estrutural `@if` | Todos os arquivos `.html` das páginas | Estados de carregamento, erro e resultado da busca |
| Diretiva estrutural `@for` | Todos os arquivos `.html` das páginas | Lista de cidades, horas e dias da semana |
| Extra: parâmetro por rota | `cidades.page.ts`, `detalhes.page.ts` e `home.page.ts` | Cidades, clique em uma cidade, abre Detalhes |

O projeto usa apenas a sintaxe de controle de fluxo nova do Angular (`@if` e `@for`), sem `*ngIf` nem `*ngFor`.

## Fluxo de passagem de parâmetro por rota

1. Na tela **Cidades**, o clique no cartão chama o método `abrirDetalhesCidade()` em `cidades.page.ts`.
2. Esse método usa `router.navigate(['/detalhes'], { queryParams: { lat, lon, cidade } })` e envia latitude, longitude e nome da cidade pela URL.
3. Em `detalhes.page.ts`, o `ngOnInit` lê os valores com `ActivatedRoute.queryParams`, converte para número e busca o clima daquela cidade na API.
4. A tela de **Detalhes** exibe o nome da cidade e os dados correspondentes.

O mesmo mecanismo é usado na **Home**, no método `selecionarCidade()`, ao escolher um resultado da busca. Se a tela de Detalhes for aberta diretamente pela barra de navegação, nenhum parâmetro chega e a cidade padrão (Recife) é exibida.

## Testes

```bash
npm run test:unit
```

O projeto possui testes unitários para as páginas, os services e as pipes de temperatura e vento.

## Limitações conhecidas

- Os controles de notificações e de idioma em Configurações são apenas visuais e ainda não alteram o comportamento do app.
- A lista de cidades salvas em Cidades não é persistida: ao recarregar a página, volta à lista inicial. Apenas o histórico de pesquisas da Home e as preferências de Configurações ficam salvos no navegador.
- Ao navegar pela barra inferior a partir de telas que não têm uma cidade selecionada, as telas de Detalhes e Alertas exibem a cidade padrão (Recife).

## Equipe

| Integrante | Responsabilidade |
|---|---|
| (nome) | (requisito) |
| (nome) | (requisito) |
| (nome) | (requisito) |
| (nome) | (requisito) |
| (nome) | (requisito) |
| (nome) | Extra: passagem de parâmetro por rota |

Disciplina: Desenvolvimento Mobile. Professor: (nome).
