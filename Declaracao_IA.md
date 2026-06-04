# Declaração de Uso de Inteligência Artificial

**Projeto:** EuGaranto  
**Âmbito:** Etapa 3 - Interação Homem-Máquina (INTHOM)  

Em conformidade com os requisitos da entrega, declaramos abaixo a divisão de tarefas e a forma como as ferramentas de Inteligência Artificial foram utilizadas no desenvolvimento do protótipo funcional.

### 1. Ferramentas de IA Utilizadas
* **Google Gemini:** Utilizado como assistente de programação (pair-programming), depuração de erros e estruturação de documentação.
* **Claude:** Auxilio com a estética e frontend do projeto.

### 2. Trabalho Humano
Todo o planeamento, decisões arquiteturais e design do projeto foram realizados exclusivamente pela equipa, nomeadamente:
* **Conceção e Arquitetura:** Definição da lógica de funcionamento da aplicação (Offline First), estrutura de navegação e fluxos do utilizador.
* **UI/UX Design:** Criação da identidade visual, escolha do esquema de cores (ex: `#0A7A3E`), design de interface e tomada de decisão sobre padrões de usabilidade (ex: cabeçalhos minimalistas, *Empty States* e formato *Stepper*).
* **Gestão de Projeto e Controlo de Versões:** Orquestração do repositório no GitHub, resolução de conflitos de *merge* e gestão de *branches*.
* **Testes e Validação:** Execução e teste da aplicação em ambiente web, emuladores e dispositivos físicos Android (via depuração USB), garantindo que as funcionalidades correspondiam ao planeado.

### 3. Assistência da Inteligência Artificial
A IA foi utilizada estritamente como ferramenta de apoio à execução técnica e aceleração de desenvolvimento nas seguintes áreas:
* **Geração e Refatoração de Código:** Criação de blocos de código para componentes Angular/Ionic (TypeScript, HTML, SCSS), como a implementação da barra de pesquisa, ordenação de *arrays* e transição de dados fictícios (*hardcode*) para lógicas de *arrays* vazios.
* **Configuração de Ambiente Nativo (Android):** Assistência na resolução de problemas de compatibilidade e configuração do ecossistema nativo através do Capacitor (ex: sobrescrita do `styles.xml` para otimização do *Splash Screen* no Android 12+, resolução de erros do *Gradle* e de caminhos do *SDK local*).
* **Estruturação de Documentação:** Formatação e padronização do texto do "Diário de Desenvolvimento" para *Markdown*, mantendo a uniformidade estrutural das sessões redigidas pela equipa.