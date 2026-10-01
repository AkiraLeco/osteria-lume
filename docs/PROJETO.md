# Osteria Lume — Cardápio Digital

> Documento de definição do projeto (premissas, escopo e decisões).
> Criado em 29/09/2026. Atualize este arquivo sempre que uma decisão mudar.

---

## 1. Visão geral

Aplicação web de **cardápio digital** para um restaurante italiano **fictício**, desenvolvida como
**projeto de portfólio** (publicado no GitHub).

- **O que é:** um cardápio *vitrine*. O cliente vê pratos, fotos, descrições e preços.
  O pedido continua sendo feito com o garçom.
- **O que não é:** não tem carrinho, pedido online, delivery nem pagamento.
- **Como o cliente chega:** por um **QR Code na mesa** e por um **link** divulgado no Instagram, no Google Maps etc.
- **Quem mantém o conteúdo:** o próprio restaurante, por meio de um **painel administrativo** com login.

### Objetivos do projeto
1. Mostrar no portfólio um app completo e bem acabado (front público + painel admin + banco de dados).
2. Funcionar muito bem **em qualquer tamanho de tela**, com prioridade para o celular (*mobile-first*).
3. Visual **moderno e sofisticado**, à altura de um restaurante de alto padrão.

---

## 2. Público e contexto de uso

| Perfil | Contexto | Necessidade principal |
|---|---|---|
| Cliente na mesa | Celular, escaneou o QR Code, às vezes com internet fraca | Achar rápido o que comer e quanto custa |
| Cliente em casa | Celular ou computador, veio do Instagram ou do Google | Conhecer o cardápio, os preços, o endereço e o horário |
| Turista | Celular, não fala português | Ler o cardápio em inglês |
| Administrador do restaurante | Computador ou celular | Atualizar preços, pratos e itens esgotados sem ajuda técnica |

---

## 3. Premissas (decisões tomadas)

| # | Tema | Decisão |
|---|---|---|
| P1 | Tipo de app | Cardápio vitrine, **sem pedidos nem pagamento** |
| P2 | Acesso | QR Code na mesa + link público (redes sociais/Google) |
| P3 | Atualização do conteúdo | Painel administrativo com login |
| P4 | Usuários do painel | **Um único login** de administrador |
| P5 | Idiomas | **Português (padrão) + inglês** |
| P6 | Estilo visual | Moderno/sofisticado |
| P7 | Identidade visual | Não existe; será criada uma identidade própria para o projeto |
| P8 | Conteúdo | Não há cardápio real; será usado um **cardápio de exemplo** (seção 9) |
| P9 | Stack | Next.js + Supabase + Vercel (seção 7) |
| P10 | Custo | **Zero**: apenas planos gratuitos |
| P11 | Contexto | Portfólio/estudo, sem cliente real e sem prazo fixo |
| P12 | Responsividade | Deve funcionar de 320px (celulares pequenos) até monitores largos |
| P13 | Nome | **Osteria Lume** |
| P14 | Demonstração do painel | Acesso completo com credenciais públicas e dados restaurados todo dia |
| P15 | Tema escuro | Entra no MVP |
| P16 | PWA/offline | Fica fora do MVP |

---

## 4. Escopo

### 4.1 Cardápio público (cliente)

**Estrutura do cardápio**
- Categorias sugeridas (o painel permite criar, renomear e reordenar):
  1. **Entradas** (Antipasti)
  2. **Sopas** (Zuppe e minestre)
  3. **Massas e Risotos** (Primi)
  4. **Pratos Principais** (Secondi)
  5. **Acompanhamentos** (Contorni)
  6. **Pizzas e Pães** (Pizze e focacce)
  7. **Sobremesas** (Dolci)
  8. **Bebidas** (Bevande: vinhos, drinks, sem álcool, cafés)
- Nome da categoria no idioma escolhido, com o nome italiano como subtítulo (ex.: "Massas e Risotos · Primi" / "Pasta & Risotto · Primi").

**Cada prato mostra**
- Nome, descrição (ingredientes) e foto.
- Preço, ou **todos os tamanhos com seus preços** no próprio card (ex.: `Taça R$ 32 · Garrafa R$ 140`, `Broto R$ 48 · Grande R$ 72`).
- **Selos alimentares**: vegetariano, vegano, sem glúten, sem lactose, picante.
- **Destaques**: "Sugestão do chef", "Mais pedido", "Novidade".
- Estado **esgotado**: o prato aparece esmaecido com a etiqueta "Esgotado" (o admin também pode ocultá-lo).

**Navegação e recursos**
- Menu de categorias fixo no topo, com rolagem horizontal no celular, que destaca a seção atual durante a rolagem.
- **Busca** por nome ou ingrediente.
- **Filtros** por selo (vegetariano, sem glúten etc.).
- **Detalhe do prato**: foto grande e descrição completa (modal/bottom sheet no celular).
- **Menu do dia / por horário**: itens ou seções que só aparecem em certos dias e horários
  (ex.: "Almoço executivo, seg–sex, 11h30–15h").
- **Troca de idioma** PT/EN, com a escolha lembrada no navegador.

**Informações do restaurante**
- Endereço com link para o Google Maps (mapa incorporado é opcional).
- Horário de funcionamento, com indicação "Aberto agora" / "Fechado".
- Telefone, WhatsApp e Instagram.

### 4.2 Painel administrativo

- Login com e-mail e senha (um único usuário).
- CRUD de **categorias**: criar, editar, excluir, reordenar e ativar/desativar.
- CRUD de **pratos**: nome e descrição em PT e EN, foto (upload), preço ou tamanhos, selos, destaques e categoria.
- **Botão rápido "Esgotado"** direto na lista de pratos, pensado para uso no celular durante o expediente.
- Reordenar pratos dentro da categoria.
- Configurar **disponibilidade por dia/horário** (menu do dia).
- Editar **informações do restaurante**: nome, endereço, horários, contatos e redes.
- Gerar e baixar o **QR Code** que aponta para o cardápio.
- Pré-visualizar o cardápio público.

### 4.3 Fora do escopo (por enquanto)
- Pedidos, carrinho, delivery, pedido via WhatsApp.
- Pagamentos.
- Chamar garçom, senha do Wi-Fi, taxa de serviço.
- Página "Sobre nós" / história do restaurante.
- Lista de alérgenos detalhada (só os selos da seção 4.1).
- Vários usuários ou níveis de permissão no painel.
- Idioma italiano.
- Múltiplos restaurantes/unidades.

---

## 5. Requisitos não funcionais

**Responsividade (requisito central)**
- Abordagem *mobile-first*.
- Breakpoints de referência:
  - **Celular:** < 640px. Uma coluna, cards compactos, detalhe do prato em bottom sheet.
  - **Tablet:** 640–1024px. Duas colunas.
  - **Desktop:** > 1024px. Três colunas ou lista com categorias em barra lateral; largura máxima do conteúdo em torno de 1200px.
- Alvos de toque de pelo menos 44×44px. Sem rolagem horizontal da página.
- Testar em: iPhone SE (375px), Android médio (~390–412px), tablet e desktop (1440px+).

**Desempenho**
- Carregamento rápido mesmo em 4G fraco: meta de Lighthouse ≥ 90 em performance no celular.
- Imagens otimizadas (WebP/AVIF, tamanhos responsivos, *lazy loading*).
- Cardápio público renderizado no servidor ou estático, com revalidação quando o admin salva.

**Acessibilidade**
- Contraste AA, textos alternativos nas fotos e navegação por teclado.
- Selos com ícone **e** texto, nunca só cor.
- Meta: Lighthouse ≥ 90 em acessibilidade.

**Outros**
- SEO básico: título, descrição e Open Graph, para ficar bonito quando o link é compartilhado no Instagram/WhatsApp.
- Preços formatados em Real (`R$ 1.234,00`).
- Segurança: rotas do painel protegidas; regras de acesso no banco (RLS no Supabase) permitindo leitura pública e escrita só para o admin.
- Opcional (PWA): funcionar offline depois do primeiro acesso.

---

## 6. Identidade visual (proposta inicial)

O restaurante não tem marca, então será criada uma identidade para o portfólio:

- **Nome fictício:** **Osteria Lume**, com o slogan "Cucina italiana, con calma." (seção 11).
- **Estilo:** moderno e sofisticado, minimalista, com fotos grandes e bastante espaço em branco.
- **Paleta:** fundo off-white (`#FAF8F5`), texto grafite (`#1C1C1C`), acento terracota (`#B5542D`),
  verde-oliva (`#5B6B3A`) para os selos vegetarianos e cinzas neutros.
  **Tema escuro** (entra no MVP): fundo preto quente (`#141312`) e texto off-white.
  Todas as cores são definidas como variáveis CSS, para trocar de tema com facilidade.
- **Tipografia:** *Cormorant Garamond* nos títulos e *Inter* no texto.
- **Fotos:** banco de imagens gratuito (Unsplash/Pexels), com créditos registrados no README.

---

## 7. Stack técnica

| Camada | Tecnologia | Motivo |
|---|---|---|
| Front-end + painel | **Next.js** (App Router) + **TypeScript** | Renderização no servidor (rápido e bom para SEO), um único projeto para cardápio e painel |
| Estilo | **Tailwind CSS** | Responsividade prática com breakpoints |
| Banco de dados | **Supabase** (PostgreSQL) | Plano gratuito, com login e armazenamento de fotos incluídos |
| Autenticação | Supabase Auth (e-mail/senha) | Atende ao requisito de login único |
| Imagens | Supabase Storage + `next/image` | Upload no painel e otimização automática |
| Internacionalização | `next-intl` (ou similar) | PT/EN para a interface; o conteúdo do cardápio fica traduzido no banco |
| QR Code | biblioteca `qrcode` | Geração no painel |
| Hospedagem | **Vercel** (plano gratuito) | Deploy automático a partir do GitHub |
| Versionamento | Git + GitHub (repositório público) | Portfólio |

---

## 8. Modelo de dados (rascunho)

```
restaurant_info  (registro único)
  name, tagline_pt, tagline_en, address, maps_url, phone, whatsapp, instagram,
  opening_hours (json: dia -> [abre, fecha])

categories
  id, name_pt, name_en, subtitle_pt, subtitle_en, position, is_active,
  available_days (int[] | null), available_from (time | null), available_to (time | null)

dishes
  id, category_id -> categories, name_pt, name_en, description_pt, description_en,
  image_url, position, is_available (esgotado = false), is_hidden,
  tags (text[]: vegetarian | vegan | gluten_free | lactose_free | spicy),
  highlight (null | chef_suggestion | best_seller | new),
  available_days, available_from, available_to   -- menu do dia no nível do prato

dish_prices
  id, dish_id -> dishes, label_pt, label_en (null quando o preço é único), price_cents, position
```

- Preço guardado em **centavos (inteiro)** para evitar erros de arredondamento.
- Um prato com preço único tem uma linha em `dish_prices`, sem rótulo.

---

## 9. Cardápio de exemplo (dados iniciais)

Serve para popular o banco (seed) e deixar o portfólio realista. Preços fictícios.
Os dados completos estão em `src/data/menu.ts`.

- **80 pratos regionais**, baseados no "Guia de 80 pratos da cozinha italiana" (setembro de 2026), do Valle d'Aosta à Sicília.
- Organizados por tipo: Entradas (16), Sopas (11), Massas e Risotos (27), Pratos Principais (12), Acompanhamentos (4), Pizzas e Pães (8) e Sobremesas (2).
- Cada prato traz a **região de origem**, que aparece no card e entra na busca.
- Continuam o **Almoço Executivo** (seg–sex, 11h30–15h, R$ 69) e as **bebidas** (vinhos, drinks, água e cafés).

**Regras dos selos**
- Os selos valem para a versão servida no restaurante. Quando o guia marca "depende da receita" (*), a descrição do prato diz qual é a versão da casa, e o selo só entra se valer para ela.
- "Vegano" implica vegetariano e sem lactose, e os filtros tratam assim.
- Algumas classificações do guia foram corrigidas para a receita tradicional: Risotto alla Milanese e Lasagne verdi não são vegetarianos; Risi e bisi não é vegano nem sem lactose; Sarde in saor, Baccalà alla vicentina e Saltimbocca não são sem glúten (são enfarinhados); Gnocco fritto e Crescia sfogliata levam banha; Cacio e pepe e Gricia usam pimenta-do-reino, não peperoncino; Tiramisù é do Vêneto/Friuli.
- Um aviso sob os filtros lembra que a cozinha manipula trigo, leite e frutos do mar (contaminação cruzada).

---

## 10. Critérios de pronto (MVP)

- [ ] Cardápio público com todas as categorias, pratos, fotos, preços e selos do exemplo.
- [ ] Layout validado em celular (375px), tablet e desktop (1440px), sem quebras.
- [ ] Busca e filtros funcionando.
- [ ] Troca PT/EN funcionando em toda a interface e no conteúdo.
- [ ] Menu do dia aparecendo e sumindo conforme dia e horário.
- [ ] Painel: login, CRUD de categorias e pratos, upload de foto, botão "Esgotado", informações do restaurante, QR Code.
- [ ] Mudanças no painel aparecem no cardápio público sem novo deploy.
- [ ] Tema claro e escuro funcionando, seguindo a preferência do sistema e com botão para alternar.
- [ ] Modo demonstração: credenciais públicas, faixa de aviso no painel e restauração diária dos dados via cron.
- [ ] Deploy público em `osteria-lume.vercel.app`.
- [ ] README com prints, GIF do painel, link da demo, credenciais de demo, stack e instruções para rodar localmente.

---

## 11. Decisões complementares

Estas decisões ficaram em aberto na primeira versão deste documento e foram resolvidas depois.

1. **Nome: Osteria Lume.**
   - *Osteria* é o restaurante italiano tradicional e acolhedor. *Lume* significa "luz" e combina com o estilo moderno e sofisticado.
   - O nome é curto, fácil de lembrar e funciona bem em URL (`osteria-lume.vercel.app`) e no repositório (`osteria-lume`).
   - Slogan: "Cucina italiana, con calma." / "Italian cooking, unhurried."
   - Paleta: off-white, grafite e terracota (seção 6). O verde-oliva fica como cor de apoio nos selos vegetarianos.
   - Fontes: *Cormorant Garamond* nos títulos e *Inter* no texto.
2. **Demonstração do painel: acesso completo com dados restaurados todo dia.**
   - As credenciais de demo ficam publicadas no README, e o painel mostra a faixa "Modo demonstração — os dados são restaurados diariamente".
   - Um *cron job* diário (Vercel Cron, disponível no plano gratuito) chama uma rota protegida que apaga os dados, roda o *seed* da seção 9 e limpa as fotos enviadas.
   - Os uploads no modo demo ficam limitados a 2 MB por arquivo, e só são aceitas imagens.
   - O README também terá um GIF curto do painel, para quem não quiser fazer login.
   - Motivo: um recrutador consegue testar tudo de verdade, e qualquer bagunça some no dia seguinte.
3. **Tema escuro: entra no MVP.**
   - Segue a preferência do sistema e tem um botão para alternar.
   - Motivo: se as cores forem definidas como variáveis desde o início, o custo é baixo; adaptar depois dá bem mais trabalho. Também combina com salão de luz baixa e valoriza o portfólio.
4. **PWA/offline: fica fora do MVP.**
   - Motivo: o primeiro acesso pelo QR Code sempre precisa de internet, então o offline traz pouco ganho real. Vai para a seção 12.
5. **Fuso horário do menu do dia:** fixo em `America/Sao_Paulo`.
6. **Domínio:** usar o subdomínio gratuito `osteria-lume.vercel.app`.

---

## 12. Ideias para versões futuras

- PWA com funcionamento offline e opção de instalar no celular.
- Pedido via WhatsApp (carrinho que gera a mensagem pronta).
- Idioma italiano.
- Alérgenos detalhados.
- Harmonização sugerida (vinho para cada prato).
- Página "Sobre nós" e galeria do salão.
- Estatísticas simples: pratos mais visualizados.
- Vários usuários no painel, com permissões.
