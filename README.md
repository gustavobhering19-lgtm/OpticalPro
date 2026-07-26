# Optical Pro

> Software premium para óticas, consultores ópticos e laboratórios.

<img width="110" height="37" alt="Captura de Tela 2026-07-25 às 21 35 26" src="https://github.com/user-attachments/assets/47dca2f8-0673-498f-bde6-323750b8bd07" />

---

## Sobre o projeto

O **Optical Pro** é uma plataforma SaaS desenvolvida para modernizar e profissionalizar a rotina de óticas, consultores ópticos e laboratórios. Reúne em um único sistema as principais ferramentas técnicas do setor óptico — da calculadora de espessura à gestão de clientes — com uma interface de alto padrão, intuitiva e responsiva.

---

## O problema

O mercado óptico ainda depende fortemente de cálculos manuais, planilhas isoladas e sistemas desatualizados para tarefas do dia a dia. Consultores perdem tempo valioso tentando estimar espessuras, comparar lentes e localizar equivalências entre fabricantes sem nenhuma ferramenta centralizada. A falta de padronização gera erros, retrabalho e uma experiência de atendimento abaixo do potencial.

---

## A solução

O Optical Pro centraliza em uma única plataforma as ferramentas técnicas e de gestão que consultores e laboratórios precisam. Com uma interface moderna inspirada em softwares como HubSpot, Linear e Notion — mas adaptada à realidade do setor óptico —, o sistema permite calcular, comparar, converter e gerenciar com precisão e agilidade, elevando o padrão de atendimento e a confiança na recomendação técnica.

---

## Principais funcionalidades

### Calculadora óptica
- Cálculo estimado de espessura de centro e borda por olho (OD/OE)
- Suporte a lentes de visão simples, bifocal e multifocal
- Entrada de dados completa: grau esférico, cilíndrico, eixo, prisma, adição e DNP
- Seleção de índice de refração (1.49 a 1.74), fabricante, linha e diâmetro
- Seleção de tratamentos: antirreflexo, blue block e fotossensível
- Configuração da armação: horizontal, vertical, diagonal, ponte, curvatura, tipo, formato e material
- Ilustração SVG animada do corte transversal da lente com resultado visual
- Resultado com espessura de centro e borda, peso estimado, número de Abbe, índice recomendado, redução estimada e distorção lateral

### Análise de lentes
- Banco de lentes com mais de 2.000 registros
- Filtros por fabricante, índice, material, linha e tratamento
- Comparador lado a lado de duas lentes com destaque automático da melhor opção
- Comparação de: material, Abbe, peso, espessura, garantia, UV, blue block, campo visual, preço médio e compatibilidade
- Conversor de equivalências entre fabricantes com score de compatibilidade e similaridade
- Identificador de marcações de lentes por símbolo e por imagem (OCR com IA — roadmap)

### Ferramentas para consultores
- Receitas oftálmicas com histórico completo por cliente
- Cadastro de receitas com tipo de lente (visão simples, bifocal, multifocal)
- Ficha completa do paciente com histórico de prescrições
- Registro de observações clínicas por cliente

### Gestão e apoio à venda
- Cadastro e gestão completa de clientes
- Base de fabricantes com país de origem e quantidade de lentes
- Cadastro de laboratórios com status, cidade, contato e integrações
- Relatórios analíticos com gráficos de receitas, conversões, lentes e clientes por período e fabricante
- Dashboard com indicadores em tempo real: receitas calculadas, clientes ativos, conversões e lentes consultadas

### Interface e experiência do usuário
- Design premium com identidade visual azul-marinho e dourado
- Tipografia refinada com Cormorant Garamond nos títulos e Inter no corpo
- Sidebar recolhível com navegação animada
- Animações suaves com Framer Motion em todas as transições
- Feedback visual em tempo real: loading states, toasts, empty states e validações inline
- Layout totalmente responsivo para desktop, notebook, tablet e smartphone
- Autenticação com proteção de rotas e persistência de sessão

---

## Tecnologias utilizadas

| Categoria | Tecnologia |
|---|---|
| Framework | React 18 |
| Linguagem | TypeScript |
| Build tool | Vite |
| Estilização | Tailwind CSS |
| Componentes | Shadcn/UI + Radix UI |
| Roteamento | React Router DOM v6 |
| Formulários | React Hook Form + Zod |
| Data fetching | TanStack Query (React Query) |
| HTTP client | Axios |
| Animações | Framer Motion |
| Ícones | Lucide React |
| Gráficos | Recharts |

---

## Arquitetura do projeto

O projeto segue a arquitetura **Feature Based**, onde cada funcionalidade de negócio é isolada em seu próprio módulo com seus componentes, hooks e lógica específicos.

```
src/
├── app/                  # Configuração central (router, providers, App)
├── assets/               # Imagens e recursos estáticos
├── components/
│   ├── ui/               # Componentes reutilizáveis sem lógica de negócio
│   │   ├── Button
│   │   ├── Badge
│   │   ├── DataTable
│   │   ├── SearchInput
│   │   ├── StatCard
│   │   └── Pagination
│   ├── layout/           # Estrutura de layout (Navbar, Sidebar, PageHeader)
│   └── shared/           # Componentes compartilhados (EmptyState, PageLoader, ProtectedRoute)
├── features/             # Módulos de funcionalidade
│   ├── auth/             # Login e autenticação
│   ├── dashboard/        # Painel principal
│   ├── calculator/       # Calculadora óptica
│   ├── clients/          # Gestão de clientes
│   ├── recipes/          # Receitas oftálmicas
│   ├── lenses/           # Banco de lentes
│   ├── manufacturers/    # Fabricantes
│   ├── laboratories/     # Laboratórios
│   ├── converter/        # Conversor de equivalências
│   ├── comparison/       # Comparador de lentes
│   ├── markings/         # Identificador de marcações
│   ├── reports/          # Relatórios e gráficos
│   └── settings/         # Configurações do sistema
├── contexts/             # Contextos globais (AuthContext, SidebarContext)
├── hooks/                # Hooks reutilizáveis (useSidebar, useDebounce)
├── services/             # Configuração do Axios e chamadas à API
├── types/                # Tipos e interfaces globais do domínio óptico
├── utils/                # Funções utilitárias (formatadores, cn)
└── styles/               # CSS global e tokens de design
```

**Princípios adotados:**
- Componentes de UI sem lógica de negócio
- Lógica centralizada dentro das features
- Dados mock preparados para substituição direta por chamadas de API
- Autenticação desacoplada, pronta para integração com backend

---

## Como executar localmente

**Pré-requisitos:** Node.js 18 ou superior e npm.

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/optical-pro.git

# Entre na pasta do projeto
cd optical-pro

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse em: [http://localhost:5173](http://localhost:5173)

**Credenciais de acesso para demonstração:**
- E-mail: `ana@opticalpro.com.br`
- Senha: `123456`

---

## Scripts disponíveis

```bash
npm run dev      # Inicia o servidor de desenvolvimento com hot reload
npm run build    # Gera o build de produção
npm run preview  # Visualiza o build de produção localmente
```

---

## Roadmap

O Optical Pro está em desenvolvimento ativo. As próximas etapas planejadas são:

**Backend e dados reais**
- [ ] API REST com Fastify + Prisma + MySQL
- [ ] Autenticação real com JWT e refresh token
- [ ] Substituição dos dados mock por endpoints reais
- [ ] Integração com laboratórios via EDI

**Calculadora**
- [ ] Algoritmo real de cálculo de espessura por curva-base
- [ ] Exportação do resultado em PDF
- [ ] Histórico de cálculos por cliente

**Inteligência e automação**
- [ ] OCR para identificação de marcações de lentes por imagem
- [ ] IA para recomendação técnica de lentes por perfil de cliente
- [ ] Sugestão automática de índice ideal por receita e armação

**Gestão**
- [ ] Multi-usuário com controle de permissões por perfil
- [ ] Módulo financeiro e controle de pedidos
- [ ] Integração com WhatsApp Business para envio de receitas
- [ ] App mobile (React Native)

**Infraestrutura**
- [ ] Deploy automatizado com CI/CD via GitHub Actions
- [ ] Ambientes separados (desenvolvimento, staging, produção)
- [ ] Dark mode

---

<img width="486" height="658" alt="Captura de Tela 2026-07-25 às 21 30 21" src="https://github.com/user-attachments/assets/184c646a-fc47-4e97-a3c1-1a4e91cf20c0" />
<img width="1467" height="797" alt="Captura de Tela 2026-07-25 às 21 31 52" src="https://github.com/user-attachments/assets/555c6144-700b-4487-baf0-359fa5f511de" />
<img width="1468" height="796" alt="Captura de Tela 2026-07-25 às 21 32 27" src="https://github.com/user-attachments/assets/a5de13b7-dd07-432a-8571-94f50e59d6fc" />
<img width="1470" height="802" alt="Captura de Tela 2026-07-25 às 21 33 01" src="https://github.com/user-attachments/assets/b33d14d9-0f41-4350-9241-fce431d8d33f" />
<img width="1469" height="801" alt="Captura de Tela 2026-07-25 às 21 33 54" src="https://github.com/user-attachments/assets/7e63fedb-ffcd-47e7-b633-dca21f2cc39f" />


---

## Desenvolvedor

Desenvolvido por **Gustavo Bhering**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/gustavobhering07/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/gustavobhering19-lgtm)

---

<p align="center">
  Feito com dedicação para o mercado óptico brasileiro.
</p>
