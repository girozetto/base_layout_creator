# Dashboard Layout Constructor

![Dashboard Layout Constructor](https://img.shields.io/badge/Dashboard-Layout%20Constructor-blue?style=for-the-badge&logo=javascript)

## 📋 Visão Geral

O Dashboard Layout Constructor é uma ferramenta interativa que permite aos usuários criar, personalizar e gerenciar layouts de dashboards de forma visual e intuitiva. Com uma interface de arrastar e soltar, os usuários podem adicionar, redimensionar e reorganizar widgets para criar dashboards personalizados sem necessidade de conhecimentos de programação.

![Dashboard Demo](https://img.shields.io/badge/Interactive-Dashboard-success?style=flat-square&logo=javascript)

## ✨ Funcionalidades

- 🧩 **Widgets Pré-configurados**: Gráficos, tabelas, métricas, calendários e mais
- 🔄 **Arrastar e Soltar**: Interface intuitiva para organização de elementos
- 📱 **Layout Responsivo**: Adaptação a diferentes tamanhos de tela
- 💾 **Salvar e Carregar**: Persistência de layouts personalizados
- 🔄 **Dois Modos de Visualização**: Modo de edição e modo de visualização

## 🚀 Versões Disponíveis

O projeto possui duas versões principais:

### 1. Versão Básica (`index.html`)

- Foco na edição de layout usando GridStack
- Interface simples com funcionalidades essenciais
- Ideal para usuários que precisam apenas criar layouts

### 2. Versão Avançada (`index-2-ways.html`)

- Implementa dois modos distintos: edição e visualização
- Transição suave entre os modos
- Melhor experiência para usuários finais

## 🛠️ Tecnologias Utilizadas

- ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) **HTML5**: Estrutura base
- ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) **CSS3**: Estilização e layout responsivo
- ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) **JavaScript**: Lógica e interatividade
- ![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=flat-square&logo=bootstrap&logoColor=white) **Bootstrap 5**: Framework CSS para interface
- ![Lit](https://img.shields.io/badge/Lit-324FFF?style=flat-square&logo=lit&logoColor=white) **Lit**: Componentes web reutilizáveis
- ![GridStack](https://img.shields.io/badge/GridStack-2F7BEE?style=flat-square&logo=javascript&logoColor=white) **GridStack**: Biblioteca para layout de grade interativo

## 🎨 Widgets Disponíveis

| Widget              | Descrição                               | Ícone |
| ------------------- | --------------------------------------- | ----- |
| Gráfico de Linha    | Visualização de dados em série temporal | 📈    |
| Gráfico de Barras   | Comparação entre categorias             | 📊    |
| Gráfico de Pizza    | Distribuição proporcional               | 🥧    |
| Tabela de Dados     | Visualização tabular de informações     | 🗃️    |
| Perfil do Usuário   | Informações do usuário atual            | 👤    |
| Métricas Principais | KPIs e números importantes              | 📌    |
| Calendário          | Visualização de eventos e datas         | 📅    |
| Notificações        | Lista de alertas e notificações         | 🔔    |

## 🚦 Como Usar

1. **Modo de Edição**:

   - Clique em "Editar Dashboard" para entrar no modo de edição
   - Arraste widgets da barra de ferramentas para o grid
   - Redimensione e reposicione os widgets conforme necessário
   - Clique no "×" para remover um widget

2. **Salvar Layout**:

   - Clique em "Salvar Layout" para persistir suas alterações
   - O layout será salvo no armazenamento local do navegador

3. **Carregar Layout**:

   - Clique em "Carregar Layout" para restaurar um layout salvo anteriormente

4. **Limpar Layout**:
   - Use "Limpar Layout" para remover todos os widgets e começar do zero

## 🎯 Casos de Uso

- 📊 **Dashboards Analíticos**: Visualização de KPIs e métricas de negócio
- 📱 **Painéis de Controle**: Monitoramento de sistemas e aplicações
- 🏢 **Intranets Corporativas**: Centralização de informações relevantes
- 🛒 **E-commerce**: Acompanhamento de vendas e comportamento do cliente

## 🔮 Melhorias Futuras

- 🌈 **Temas Personalizados**: Opções de cores e estilos
- 🔐 **Controle de Acesso**: Permissões por usuário ou grupo
- 📱 **Aplicativo Móvel**: Versão otimizada para dispositivos móveis
- 🔌 **Conectores de Dados**: Integração com fontes de dados externas
- 🌐 **Compartilhamento**: Opções para compartilhar dashboards

## 💻 Começando

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/dashboard-layout-creator.git
```

2. Abra um dos arquivos HTML em seu navegador:

```bash
cd dashboard-layout-creator
open index.html
```

3. Para a versão avançada com dois modos:

```bash
open index-2-ways.html
```

## 📝 Notas de Implementação

- O projeto utiliza armazenamento local (localStorage) para persistência
- Em um ambiente de produção, recomenda-se implementar persistência no servidor
- Os componentes de widget são implementados usando Lit para melhor encapsulamento
- A versão de dois modos carrega o GridStack sob demanda para melhor performance

---

![Made with ❤️](https://img.shields.io/badge/Made%20with-%E2%9D%A4%EF%B8%8F-red?style=for-the-badge)
