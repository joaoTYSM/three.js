<div align="center">

<img src="preview.svg" alt="Toggle alternando entre desligado e ligado, com o X virando um check" width="320">

# Discord Checkbox

**O checkbox que você já escreveu em CSS, desenhado por three.js.**

Lê tamanho, cor, cantos, transformações e animações direto do DOM e reproduz tudo numa cena WebGL.
Nenhum keyframe reescrito.

[![Licença MIT](https://img.shields.io/badge/licen%C3%A7a-MIT-blue.svg)](LICENSE)
[![three.js](https://img.shields.io/badge/three.js-%E2%89%A5%20r160-000000.svg)](https://threejs.org)
[![ES Modules](https://img.shields.io/badge/m%C3%B3dulo-ESM-f7df1e.svg)](#início-rápido)
[![Sem build](https://img.shields.io/badge/build-n%C3%A3o%20necess%C3%A1rio-43b581.svg)](#início-rápido)

[Início rápido](#início-rápido) · [Como funciona](#como-funciona) · [API](#api) · [Limitações](#limitações)

</div>

---

## Por que existe

Animar um toggle em CSS é simples. Levar o mesmo toggle para dentro do three.js costuma significar refazer tudo: geometrias, cores, easing, keyframes, estados.

O Checkbox3D faz o caminho inverso. O navegador continua sendo a fonte da verdade e o three.js só desenha o resultado. Você mantém o HTML, o CSS e o JavaScript que já tem e ganha um render em WebGL por cima.

## Início rápido

**1. Seu markup, como já está**

```html
<div class="checkbox">
  <div class="knob">
    <div class="line1"></div>
    <div class="line2"></div>
  </div>
</div>
```

**2. Declare o three.js e monte**

```html
<script type="importmap">
{ "imports": { "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js" } }
</script>

<script type="module">
  import { mount } from './checkbox3d.js';
  mount();
</script>
```

Todo elemento `.checkbox` da página passa a ser renderizado pelo three.js. O clique, as classes `checked` e `unchecked` e o seu script continuam funcionando sem alteração.

> Módulos ES não carregam via `file://`. Abra a página por um servidor local:
> `npx serve` ou `python3 -m http.server`.

## Como funciona

```mermaid
flowchart LR
  A[CSS e animações no DOM] --> B[getComputedStyle a cada frame]
  B --> C[Camadas: trilho, bolinha, linhas]
  C --> D[WebGLRenderer compartilhado]
  D --> E[Canvas sobre o elemento original]
```

1. O elemento original fica invisível, mas continua na página: recebe cliques, aplica classes e executa as transições e animações do CSS.
2. A cada frame, o Checkbox3D percorre a árvore de filhos e lê o valor calculado de cada elemento.
3. Cada elemento vira uma camada no three.js, desenhada por um shader que gera retângulos arredondados com borda suavizada, em qualquer tamanho e rotação.
4. Um único `WebGLRenderer` atende todos os checkboxes, o que evita o limite de contextos WebGL do navegador. O resultado é copiado para um canvas posicionado sobre o elemento.
5. Se nada mudou desde o último frame, nada é desenhado.

Como o valor lido é o que o navegador está calculando naquele instante, tudo o que o CSS faz aparece igual no render: `@keyframes` com várias etapas, `animation-direction: reverse`, `transition` de cor e interrupções no meio do clique.

### O que é lido

| Propriedade | Uso |
| --- | --- |
| `width`, `height`, `box-sizing` | Tamanho de cada camada |
| `background-color`, `opacity` | Cor e transparência, com opacidade acumulada dos pais |
| `border-*-radius` | Cantos em `px` ou `%`, com a mesma redução proporcional do CSS |
| `left`, `top` | Posição relativa ao pai |
| `transform`, `transform-origin` | Rotação, escala e translação, incluindo `matrix3d` |
| `display: none` | Oculta a camada e todos os filhos |

## API

```js
const checkboxes = mount(selector, options);
```

| Parâmetro | Padrão | Descrição |
| --- | --- | --- |
| `selector` | `'.checkbox'` | Seletor CSS dos elementos que serão renderizados |
| `options.observe` | `true` | Monitora o DOM e passa a renderizar checkboxes adicionados depois |
| `options.pixelRatio` | `devicePixelRatio` | Resolução do canvas. Acompanha também o `zoom` do CSS |

O retorno é um objeto com:

- `instances`: `Map` de elemento para instância ativa
- `destroy()`: restaura os elementos originais e libera os recursos da GPU

## Limitações

- Só `background-color` é desenhado. Bordas, `box-shadow`, gradientes, imagens e texto não são.
- Raios em porcentagem são tratados como circulares. Em elementos não quadrados, o CSS desenharia uma elipse.
- Os filhos são lidos na montagem. Elementos adicionados depois dentro de um checkbox já montado não são acompanhados.
- O elemento original recebe `visibility: hidden` enquanto o render está ativo. Se a acessibilidade importa no seu caso, adicione um `<input type="checkbox">` real com os atributos ARIA adequados.
- Requer WebGL2, como o three.js a partir da r160.

## Rodando a demonstração

```bash
git clone https://github.com/SEU-USUARIO/checkbox3d.git
cd checkbox3d
npx serve
```

Abra o endereço indicado no terminal. O `index.html` é o checkbox original sem nenhuma alteração, apenas com o módulo carregado no final.

## Estrutura

```
checkbox3d/
├── assets/
│   └── preview.svg
├── checkbox3d.js
├── index.html
├── package.json
├── LICENSE
└── README.md
```

## Contribuindo

Issues e pull requests são bem-vindos. Para mudanças maiores, abra primeiro uma issue descrevendo o que você pretende alterar.

## Licença

[MIT](LICENSE)
