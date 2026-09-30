# Osteria Lume · Cardápio Digital

**Demo:** https://osteria-lume.vercel.app

Cardápio digital de um restaurante italiano **fictício**, feito como projeto de portfólio.
Funciona em qualquer tamanho de tela, com prioridade para o celular (o cliente chega pelo QR Code da mesa).

> A definição completa do projeto (premissas, escopo e decisões) está em [docs/PROJETO.md](docs/PROJETO.md).

## Funcionalidades

- Cardápio por categorias (Antipasti, Primi, Secondi, Pizze, Dolci, Bevande), com foto, descrição e preço.
- Preços por tamanho exibidos no card (ex.: `Taça R$ 38 · Garrafa R$ 180`).
- Selos alimentares com ícone e texto: vegetariano, vegano, sem glúten, sem lactose, picante.
- Destaques: sugestão do chef, mais pedido, novidade.
- Itens esgotados aparecem esmaecidos.
- Busca por nome ou ingrediente, que ignora acentos.
- Filtros por selo.
- Menu do dia: o "Pranzo Esecutivo" só aparece de segunda a sexta, das 11h30 às 15h (horário de São Paulo, independente do fuso de quem acessa).
- Português e inglês (`/pt` e `/en`); quem acessa `/` é enviado para o idioma do navegador ou para o último escolhido.
- Tema claro e escuro: segue o sistema, com botão para alternar e sem "piscar" ao carregar.
- Indicador "Aberto agora" e horário de funcionamento com o dia atual destacado.
- Detalhe do prato em `<dialog>` nativo, que abre como bottom sheet no celular.
- Páginas geradas de forma estática, com imagens otimizadas pelo `next/image`.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4 · lucide-react

Supabase (banco, login e fotos) e o painel administrativo são a próxima etapa (veja o roadmap).

## Rodando localmente

Requer Node.js 20.9+.

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

## Estrutura

```
src/
  app/[lang]/         layout e página do cardápio (pt/en)
  components/         hero, cardápio, card e detalhe do prato, informações
  data/menu.ts        cardápio de exemplo (vira o seed do banco)
  data/image-credits.json
  lib/                tipos, traduções, formatação, horários, leitura do cardápio
  proxy.ts            redireciona "/" para o idioma certo
scripts/
  fetch-images.mjs    baixa as fotos livres do Wikimedia Commons e registra os créditos
```

Todo o cardápio é lido por `getMenu()` em `src/lib/menu-repository.ts`. Ao ligar o Supabase, só essa função muda.

## Fotos

As fotos vêm do [Wikimedia Commons](https://commons.wikimedia.org), com licenças CC0, domínio público, CC BY ou CC BY-SA.
O autor, a licença e a fonte de cada foto estão em `src/data/image-credits.json` e aparecem no rodapé do site.

Para trocar a foto de um prato, edite a entrada correspondente em `scripts/fetch-images.mjs` e rode:

```bash
node scripts/fetch-images.mjs --list <slug>   # lista as opções
node scripts/fetch-images.mjs <slug>          # baixa a escolhida
```

## Roadmap

- [x] Cardápio público responsivo, PT/EN, busca, filtros, menu do dia, tema escuro
- [ ] Supabase: tabelas, regras de acesso (RLS) e seed a partir de `src/data/menu.ts`
- [ ] Painel admin: login, CRUD de categorias e pratos, upload de fotos, botão "Esgotado", QR Code
- [ ] Modo demonstração com dados restaurados diariamente (Vercel Cron)
- [x] Deploy em [`osteria-lume.vercel.app`](https://osteria-lume.vercel.app)
