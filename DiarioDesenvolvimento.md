# Diario de Desenvolvimento - EuGaranto - Afonso

## Sessão 1
**Data:** 22/05/2026

### Objetivo
Criar a estrutura inicial do projeto "EuGaranto" em Ionic, Angular e Capacitor, definindo a base da aplicação e o primeiro ecrã principal.

### Atividades realizadas
Foi criado o projeto Ionic e configurada a estrutura base da aplicação. Desenvolveu-se o ecrã Home, pensado como ponto central de acesso às garantias do utilizador. Neste ecrã foram incluídos indicadores de resumo, nomeadamente garantias ativas e garantias a expirar em breve, permitindo ao utilizador perceber rapidamente o estado geral das suas garantias.

Também foi criada uma lista de cartões para apresentar as garantias de forma visual e organizada. Cada cartão foi pensado para mostrar informação essencial, como o nome do produto, categoria, estado da garantia e data de validade. Por fim, foi estruturada a navegação principal da aplicação, de modo a permitir a passagem entre os diferentes ecrãs de forma simples e coerente.

### Problemas
Nesta fase inicial, o principal desafio foi organizar a estrutura da aplicação de forma clara, garantindo que o ecrã Home não ficasse apenas como uma página estática, mas sim como um painel útil para o utilizador.

### Solução
A solução passou por criar uma página Home com conteúdo resumido e orientado para a consulta rápida. A organização por cartões permitiu separar visualmente cada garantia, tornando a informação mais fácil de ler e de interpretar.

### Decisões
Optou-se por apresentar logo no ecrã inicial o resumo das garantias ativas e das garantias a expirar em breve, porque estes dados representam as informações mais importantes para o utilizador. Em termos de UI/UX, a utilização de cartões facilita a leitura em dispositivos móveis e adapta-se bem ao estilo visual do Ionic. Tecnicamente, a estruturação inicial da navegação permitiu preparar a aplicação para a adição gradual de novas funcionalidades.

## Sessão 2
**Data:** 25/05/2026

### Objetivo
Implementar o registo de uma nova garantia, incluindo captura de imagens das faturas e persistência local dos dados.

### Atividades realizadas
Foi desenvolvido o ecrã de Nova Garantia, onde o utilizador pode introduzir os dados associados a uma garantia. Foram utilizados formulários reativos em Angular para controlar os campos, validar a informação introduzida e organizar melhor o estado do formulário.

Foi também integrada a biblioteca `@capacitor/camera`, permitindo ao utilizador tirar fotografias das faturas ou comprovativos de compra. Para garantir que as imagens podiam ser guardadas localmente, foi feita a conversão das fotografias para Base64. A persistência dos dados foi implementada com Ionic Storage, permitindo guardar localmente as garantias registadas.

### Problemas
Durante os testes em browser, verificou-se que a funcionalidade da câmara não funcionava corretamente, uma vez que alguns comportamentos nativos do Capacitor não estavam disponíveis diretamente no ambiente web.

### Solução
Para resolver o problema, foi usado o pacote `@ionic/pwa-elements`, que permite simular e suportar componentes relacionados com funcionalidades nativas, como a câmara, em ambiente web/PWA. Desta forma, tornou-se possível testar a captura de imagens no browser durante o desenvolvimento.

### Decisões
A escolha dos formulários reativos justificou-se pela necessidade de controlar melhor a validade dos dados e preparar o formulário para possíveis expansões futuras. A conversão das imagens para Base64 foi adotada por facilitar o armazenamento local juntamente com os restantes dados da garantia. A utilização de Ionic Storage foi adequada para esta fase do projeto, pois permitiu persistência local sem necessidade de backend.

## Sessão 3
**Data:** 27/05/2026

### Objetivo
Melhorar a organização das garantias através de categorias e implementar a lógica de criação e persistência de alertas associados a cada garantia.

### Atividades realizadas
Foram criadas categorias para classificar as garantias, tornando a aplicação mais organizada e facilitando a consulta por tipo de produto. Foi desenvolvido o ecrã `alert-new`, destinado à criação de novos alertas.

Este ecrã foi implementado num formato Stepper de 3 passos, utilizando `*ngIf` para controlar a apresentação progressiva de cada etapa. A interface foi desenvolvida com um tema claro e com a cor principal da marca, `#0A7A3E`, garantindo maior coerência visual com a identidade da aplicação.

Foi ainda implementada a persistência total dos alertas no ficheiro `warranty.service.ts`, associando cada alerta à respetiva garantia. Desta forma, os alertas passaram a fazer parte da estrutura de dados da aplicação e a manter-se guardados localmente.

### Problemas
O principal problema foi garantir que os alertas não ficassem isolados da garantia correspondente. Era necessário manter uma relação clara entre cada alerta e o produto a que dizia respeito.

### Solução
A solução passou por guardar os alertas diretamente através do serviço de garantias, garantindo que cada alerta era associado à garantia correta. Assim, a informação ficou centralizada e consistente dentro della lógica da aplicação.

### Decisões
A utilização de um Stepper de 3 passos foi uma decisão de UI/UX para reduzir a complexidade visual do formulário e orientar o utilizador durante a criação do alerta. O uso de `*ngIf` permitiu controlar de forma simples qual o passo apresentado em cada momento. A escolha do tema claro com a cor `#0A7A3E` reforçou a identidade visual do projeto e manteve uma aparência limpa e adequada a uma aplicação de gestão pessoal.

## Sessão 4
**Data:** 28/05/2026

### Objetivo
Preparar a aplicação para execução em ambiente Android nativo, fazendo a transição do desenvolvimento web para mobile.

### Atividades realizadas
Foi iniciado o processo de build nativo para Android, integrando o projeto com `@capacitor/android`. Configurou-se o Android Studio e foi preparado um emulador Pixel 7 para testar a aplicação num ambiente semelhante a um dispositivo real.

Depois da configuração inicial, procedeu-se ao empacotamento della aplicação e à abertura do projeto Android gerado pelo Capacitor. O objetivo foi validar se as funcionalidades desenvolvidas em ambiente web também funcionavam corretamente em ambiente mobile, especialmente as funcionalidades relacionadas com captura de imagem e armazenamento local.

### Problemas
Durante a compilação do projeto Android, surgiu um erro do Gradle no Windows. O problema estava relacionado com a existência de caracteres não-ASCII no caminho da pasta do projeto, nomeadamente o acento presente em "Projeto Teórica".

### Solução
Para resolver o erro, foi adicionada a configuração `android.overridePathCheck=true` no ficheiro `gradle.properties`. Esta alteração permitiu ultrapassar a verificação do caminho feita pelo Android/Gradle e concluir o processo de compilação.

### Decisões
A transição para Android foi uma decisão técnica importante, porque o projeto utiliza funcionalidades nativas através do Capacitor e precisava de ser testado num ambiente mobile realista. A escolha do emulador Pixel 7 permitiu validar a aplicação num dispositivo moderno e com dimensões comuns. A configuração adicionada ao `gradle.properties` foi uma solução prática para o ambiente Windows, evitando alterar toda a localização do projeto e permitindo continuar o desenvolvimento na estrutura de pastas existente.

## Sessão 5
**Data:** 01/06/2026

### Objetivo
Efetuar o deploy da aplicação num dispositivo físico Android, personalizar a identidade visual nativa (ícone e splash screen) e integrar o código desenvolvido em equipa.

### Atividades realizadas
Foi realizado o empacotamento do projeto web e a sua sincronização com o ambiente Android nativo. A aplicação foi instalada e executada diretamente num dispositivo físico (Xiaomi) através de depuração USB, validando o seu funcionamento num cenário real. Paralelamente, preparou-se a identidade visual da aplicação, utilizando o pacote `@capacitor/assets` para gerar automaticamente os ícones e os ecrãs de carregamento (splash screens) em múltiplas resoluções.

Por fim, procedeu-se à atualização do repositório local através de um pull da branch principal (`main`), efetuando o merge do trabalho da equipa, e foi aberto um Pull Request no GitHub para submeter as novas alterações da branch de trabalho.

### Problemas
Durante a instalação no dispositivo físico, surgiu o erro `INSTALL_FAILED_USER_RESTRICTED`, causado pelas políticas de segurança restritivas do sistema operativo do telemóvel. Mais tarde, no momento de atualizar o repositório, o Git bloqueou devido ao limite de caracteres do Windows ("Filename too long") e à presença de pastas de compilação temporárias (`build` e `.gradle`) e ficheiros locais (`local.properties`) que tinham sido indevidamente partilhados no GitHub, o que originou também um erro de "SDK location not found" na compilação.

### Solução
Para permitir a instalação física, foram ativadas as permissões explícitas de "Instalar via USB" e "Depuração USB (Definições de segurança)" nas definições de programador do telemóvel. Os problemas de versionamento foram solucionados configurando o Git para aceitar caminhos longos (`git config core.longpaths true`) e removendo os ficheiros e pastas de compilação do rastreio (`git rm --cached`). O ficheiro `.gitignore` foi atualizado para impedir que estes artefactos voltem a ser partilhados. O erro do SDK foi resolvido através da sincronização do projeto com o Gradle no Android Studio.

### Decisões
Para garantir a coerência visual do ícone no sistema Android, optou-se por aplicar um fundo branco sólido ao logótipo, evitando o preenchimento automático de fundos transparentes por parte do sistema operativo. Em termos de controlo de versões, a remoção das pastas de build e do ficheiro `local.properties` do repositório foi uma decisão estrutural importante. Esta medida isola o ambiente de desenvolvimento de cada membro do grupo, previne a sobreposição de caminhos de SDK locais e garante que o repositório se mantém limpo e livre de conflitos de integração.

## Sessão 6
**Data:** 02/06/2026

### Objetivo
Implementar a identidade visual nativa da aplicação móvel "EuGaranto", através da configuração de ícones adaptativos e do ecrã de carregamento (*splash screen*) no ambiente Android, garantindo total compatibilidade com as diretrizes do Android 12+.

### Atividades realizadas
Preparação e redimensionamento das imagens base (`icon.png` e `splash.png`) na raiz do projeto (`assets/`). Geração automática das resoluções para múltiplas densidades de ecrã utilizando o pacote `@capacitor/assets`. Instalação e integração do plugin `@capacitor/splash-screen`. Atualização das configurações de tempo de exibição e remoção de propriedades obsoletas (`bundledWebRuntime`) no ficheiro `capacitor.config.ts`. Atualização do ficheiro nativo `styles.xml` no projeto Android para suportar as novas regras de inicialização da Google. Sincronização (`npx cap sync android`), recompilação da aplicação no Android Studio e teste em dispositivo físico. Registo das alterações no controlo de versões (Git Commit) e integração na branch principal (Git Merge para a `main`).

### Problemas
Erro de Propriedade Desconhecida onde o TypeScript assinalou erro na propriedade `bundledWebRuntime` no `capacitor.config.ts`. Ocorreu também um desfasamento Web/Nativo (Ecrã Cinzento) onde após a configuração inicial, o *splash screen* não era exibido, sendo substituído por um ecrã cinzento durante o carregamento. Por fim, verificou-se incompatibilidade com Android 12+, dado que o sistema operativo ignorou a cor de fundo definida via webview/Capacitor, tentou aplicar o tema do *Dark Mode* do sistema e as antigas tags de fundo (`android:background`) não respeitavam a *Safe Zone*, resultando num comportamento visual indesejado.

### Solução
A linha obsoleta `bundledWebRuntime` foi removida do `capacitor.config.ts`. A imagem original do *splash screen* foi ajustada para uma tela gigante (2732x2732px) com o logo a ocupar apenas 1/3 do espaço central, garantindo uma "Safe Zone" para evitar cortes pelo sistema operativo. O ficheiro `android/app/src/main/res/values/styles.xml` foi reescrito, utilizando a propriedade `windowSplashScreenAnimatedIcon` para forçar o carregamento do ícone redondo nativo (`@mipmap/ic_launcher_round`) no centro do ecrã, e `windowSplashScreenBackground` para impor o fundo branco (`#FFFFFF`), anulando a interferência do *Dark Mode*.

### Decisões
Decidiu-se abandonar a abordagem de forçar uma imagem *fullscreen* tradicional para o *splash screen*, adotando o padrão moderno exigido pela Google a partir do Android 12 (ícone animado centrado com transição de tema). Isto garante estabilidade visual, fluidez na transição para o Angular e previne bugs de redimensionamento em diferentes formatos de ecrã. Foi decidido realizar o *merge* destas alterações para a branch `main` imediatamente após a validação no dispositivo, para garantir que o resto da equipa desenvolve a partir de um ambiente visualmente estabilizado.

## Sessão 7
**Data:** 03/06/2026

### Objetivo
Refinar a Interface de Utilizador (UI) nos ecrãs de categorias e perfil, transitar a aplicação de dados fictícios (*hardcode*) para dados reais de forma a suportar *Empty States*, implementar pesquisa e ordenação na página de Alertas, e integrar o código da equipa resolvendo conflitos de ambiente nativo.

### Atividades realizadas
Através da análise do histórico de commits, validou-se que as principais alterações desta etapa ocorreram de forma concentrada. Efetuou-se a correção de anomalias visuais no ecrã "Nova Categoria", ajustando o espaçamento superior e isolando o `<ion-input>` com variáveis CSS nativas para garantir a visibilidade da caixa de texto sobre fundos claros, anulando interferências do *Dark Mode*. Simplificou-se a navegação nos ecrãs de sub-perfil (Ajuda, Notificações, Privacidade), modernizando os cabeçalhos para manter apenas o título e a seta de retrocesso minimalista, suportados pela criação da classe reutilizável `.subprofile-header` no `global.scss`. Procedeu-se à limpeza completa de dados fictícios no `warranty.service.ts`, inicializando os serviços com *arrays* vazios para despoletar a renderização correta do estado de *Empty State*. Paralelamente, a página de "Alertas" evoluiu com a integração do componente `<ion-searchbar>` para permitir pesquisa por aparelho em tempo real, juntamente com a implementação da lógica de ordenação automática das listagens com base na proximidade da data de expiração. Concluiu-se com a sincronização do repositório local com as atualizações globais da equipa.

### Problemas
Retenção de Dados Fantasmas, dado que após a remoção do *hardcode* no TypeScript, o ecrã de "Empty State" não era renderizado no dispositivo de testes, uma vez que a aplicação continuava a priorizar as garantias antigas que tinham ficado retidas na memória local (*Preferences*) do Android. Surgiram também Erros de Ambiente no Android Studio onde, ao importar o código atualizado da branch `main`, a compilação foi interrompida com as falhas "SDK location not found" e "Invalid Gradle JDK configuration found" devido à divergência de caminhos de caminhos e ferramentas locais entre as máquinas da equipa.

### Solução
O problema de retenção de dados foi resolvido limpando fisicamente todos os dados associados à aplicação nas definições do sistema operativo Android, forçando uma inicialização totalmente a zeros. O erro de localização do SDK foi mitigado com a criação/atualização do ficheiro `local.properties` contendo o caminho absoluto do SDK local do utilizador. O erro do JDK foi contornado reconfigurando o Gradle para utilizar o *Embedded JDK* (embutido no próprio Android Studio), ignorando as dependências de caminhos externos declaradas nas máquinas de outros programadores.

### Decisões
A criação da classe `.subprofile-header` foi uma decisão arquitetural para respeitar o princípio *DRY* (Don't Repeat Yourself), centralizando o design dos cabeçalhos num único local e facilitando a manutenção futura da aplicação. A persistência da arquitetura de dados *Offline First*, assente no armazenamento local via Capacitor, foi validada e mantida como benéfica nesta fase, por garantir uma operação contínua sem necessidade de acesso à Internet e por assegurar a privacidade total da documentação do utilizador no próprio dispositivo.

---

# Diario de Desenvolvimento - EuGaranto - Tiago

## Sessão 1
**Data:** 27/05/2026

### Objetivo
Implementar o sistema de autenticação completo, abrangendo as funcionalidades de login, recuperação de palavra-passe e criação de conta.

### Atividades realizadas
Foi criado um Service (`AuthService`) para a gestão das contas de utilizador. Implementou-se a validação de credenciais no login, com apresentação de mensagem de erro quando os dados estão incorretos, bem como a funcionalidade de recuperação de palavra-passe (verificação de email e definição de nova palavra-passe) e a criação de conta. Procedeu-se à remoção do botão "Continuar com Google", reorganizando o espaço do ecrã de login, e corrigiu-se e melhorou-se a interface das páginas de autenticação.

### Problemas
Surgiu um erro de compilação devido a um caminho de import incorreto do `AuthService`. O ecrã de login ficou totalmente preto após as alterações efetuadas, e a mensagem de erro de credenciais não era apresentada com a cor devida.

### Solução
Corrigiu-se o caminho do import (de `../services/` para `../../services/`). O ficheiro de estilos que se encontrava em falta ou incompleto foi reescrito. Substituíram-se as variáveis CSS do Ionic por cores fixas na mensagem de erro para garantir a correta renderização.

### Decisões
Decidiu-se utilizar o `localStorage` para persistir os utilizadores registados. Optou-se também por limpar os campos do formulário ao entrar no login (via `ionViewWillEnter`), garantindo que, ao terminar sessão, não fiquem dados preenchidos indevidamente.

## Sessão 2
**Data:** 31/05/2026

### Objetivo
Tornar o painel de Categorias funcional e melhorar a respetiva interface gráfica.

### Atividades realizadas
Implementou-se a listagem de todas as categorias, incluindo aquelas que não contêm produtos associados. Adicionou-se a contagem de produtos de cada categoria entre parênteses e implementou-se a funcionalidade de expandir e colapsar o detalhe de cada categoria.

### Problemas
As categorias vazias apresentavam uma caixa de texto desnecessária a indicar o seu estado de vazio, prejudicando a limpeza visual do ecrã.

### Solução
Removeu-se a mensagem de categoria vazia, permitindo que o cabeçalho colapsasse de forma natural sem ocupar espaço visual desnecessário.

### Decisões
Decidiu-se expandir automaticamente as categorias com produtos e manter colapsadas as categorias que se encontram vazias, otimizando a navegação.

## Sessão 3
**Data:** 01/06/2026

### Objetivo
Melhorar a página de Categorias, tornar a edição de garantias funcional e separar as categorias de produto dos compartimentos da casa.

### Atividades realizadas
Ordenaram-se as categorias por ordem alfabética e os produtos foram tornados clicáveis para permitir a abertura direta da página de detalhe da garantia. Implementou-se a edição de garantias através de um botão que abre o formulário pré-preenchido. Adicionou-se a persistência das categorias no storage e separaram-se as categorias de produto dos compartimentos da casa em dois campos distintos.

### Problemas
Verificou-se a impossibilidade de fazer scroll na lista de categorias do formulário. Além disso, a categoria "Outros", criada de forma personalizada pelo utilizador, não era apresentada na lista.

### Solução
Trocou-se a interface do `ion-select` de *popover* para *alert*, que suporta scroll nativo no sistema operativo. Passou a guardar-se as categorias ativamente no storage, incluindo a inicialização de uma lista de categorias por defeito, garantindo a sua apresentação constante.

### Decisões
Optou-se por manter listas separadas para categorias de produto e compartimentos da casa, evitando a mistura conceptual de ambos na interface e na estrutura de dados.

## Sessão 4
**Data:** 03/06/2026

### Objetivo
Implementar a alternância entre Modo Claro e Modo Escuro em toda a aplicação.

### Atividades realizadas
Foi criado um Service (`ThemeService`) para gerir o tema visual da aplicação. Adicionou-se um botão de alternância de tema na página de Perfil e o modo escuro foi aplicado globalmente a todas as páginas, incluindo login, perfil, categorias, alertas e detalhe de garantia.

### Problemas
O botão de alternância não alterava efetivamente o tema e as variáveis CSS personalizadas da aplicação não sofriam alteração de cor. Adicionalmente, surgiram conflitos de merge críticos ao integrar este código com a branch principal.

### Solução
Removeu-se o import do `dark.system.css`, mantendo apenas o `dark.class.css` para garantir o controlo manual do tema. Utilizou-se o seletor `html.ion-palette-dark` (pela sua especificidade) e `:host-context` nas páginas para sobrepor corretamente as variáveis personalizadas. Os conflitos de merge foram solucionados através da análise e junção manual das alterações das duas branches.

### Decisões
Decidiu-se persistir a preferência de tema do utilizador no `localStorage` para que esta configuração seja lembrada entre diferentes sessões de utilização.

## Sessão 5
**Data:** 03/06/2026

### Objetivo
Melhorar o aspeto visual da aplicação (focando na página inicial e páginas de autenticação) e refinar a tipografia global.

### Atividades realizadas
Aplicou-se uma nova fonte (Poppins) à página inicial e equilibrou-se a hierarquia de tamanhos de texto da mesma (títulos, saudações, números dos cartões). Ajustou-se o título de boas-vindas para ocupar apenas uma linha limpa. O modo escuro foi parametrizado nas páginas de autenticação (login, registo e recuperação de palavra-passe) e nas caixas de garantias da página de Categorias. Por fim, igualou-se a cor do topo ao resto do ecrã em modo escuro na página inicial.

### Problemas
Nas páginas de autenticação, verificou-se a existência de texto escuro sobre fundo escuro, tornando a interface ilegível no modo noturno. Notou-se também uma diferença de cor visível entre o cabeçalho e o conteúdo. Voltaram a surgir conflitos de merge no Perfil ao integrar com a branch principal, resultando na corrupção da estrutura do ficheiro.

### Solução
Utilizou-se o seletor `:host-context(.ion-palette-dark)` para aplicar estilos escuros rigorosos e específicos, sem afetar a integridade do modo claro. Sobrepôs-se a cor do cabeçalho da página inicial para coincidir perfeitamente com o fundo do conteúdo. Os conflitos de merge foram novamente resolvidos juntando manualmente as lógicas das duas branches, restabelecendo o funcionamento do ecrã de perfil.

### Decisões
Optou-se por manter o modo claro intacto (como base) e aplicar o modo escuro exclusivamente através da classe de tema, garantindo uma consistência visual robusta e transversal a todas as páginas da aplicação.