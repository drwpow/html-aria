# html-aria

## 0.4.0

### Minor Changes

- [#49](https://github.com/drwpow/html-aria/pull/49) [`1f90a50`](https://github.com/drwpow/html-aria/commit/1f90a50a1d5f213158792f510991d9c0f3cc3035) Thanks [@jlp-craigmorten](https://github.com/jlp-craigmorten)! - Role fixes

## 0.3.0

### Minor Changes

- [#46](https://github.com/drwpow/html-aria/pull/46) [`e49b399`](https://github.com/drwpow/html-aria/commit/e49b399fe29fdd0ef9f71df33879f2a406a4a83e) Thanks [@jlp-craigmorten](https://github.com/jlp-craigmorten)! - Add digital publishing (dpub) extensions roles

## 0.2.0

### Minor Changes

- [#38](https://github.com/drwpow/html-aria/pull/38) [`047714d`](https://github.com/drwpow/html-aria/commit/047714d6f1ca2b792927bf5a3a39c7425be8641a) Thanks [@drwpow](https://github.com/drwpow)! - ⚠️ Breaking API changes:

  - `getRole()` now returns full role data, rather than a string. To achieve the same result, access the `name` property:
    ```diff
    - getRole({ tagName: 'button' })
    + getRole({ tagName: 'button' })?.name
    ```

- [#38](https://github.com/drwpow/html-aria/pull/38) [`047714d`](https://github.com/drwpow/html-aria/commit/047714d6f1ca2b792927bf5a3a39c7425be8641a) Thanks [@drwpow](https://github.com/drwpow)! - ⚠️ Breaking change: Node API now requires all attributes.

  **Attributes**

  In the previous version, `<a>` and `<area>` would assume `href` was set, unless you passed in an explicit `attributes: {}` object. However, in expanding the DOM API this inconsistency in behavior led to problems. Now both versions behave the same way in regards to attributes: an attribute is assumed **NOT** to exist unless passed in.

  **Ancestors**

  This behavior is largely-unchanged, however, some small improvements have been made.

  _Note: the DOM version will automatically traverse the DOM for you, and automatically reads all attributes. This change only affects the Node API where the DOM is unavailable._

- [#42](https://github.com/drwpow/html-aria/pull/42) [`c000339`](https://github.com/drwpow/html-aria/commit/c0003399d88047b80b53cea357408cac499a68cd) Thanks [@drwpow](https://github.com/drwpow)! - ⚠️ Breaking change: aria- attribute data now matches ARIA spec, e.g. `enum` (unique type) replaced with `token` (described in ARIA 1.3).

- [#40](https://github.com/drwpow/html-aria/pull/40) [`eedfa8f`](https://github.com/drwpow/html-aria/commit/eedfa8f222ca0281ab1854fde1ac315bbf9dbaba) Thanks [@drwpow](https://github.com/drwpow)! - Bugfix: aria-roledescription and aria-brailleroledescription removed from “naming prohibited” attributes

### Patch Changes

- [#42](https://github.com/drwpow/html-aria/pull/42) [`c000339`](https://github.com/drwpow/html-aria/commit/c0003399d88047b80b53cea357408cac499a68cd) Thanks [@drwpow](https://github.com/drwpow)! - Incorporate the [SVG AAM spec](https://www.w3.org/TR/svg-aam-1.0) and add tests.

- [#40](https://github.com/drwpow/html-aria/pull/40) [`eedfa8f`](https://github.com/drwpow/html-aria/commit/eedfa8f222ca0281ab1854fde1ac315bbf9dbaba) Thanks [@drwpow](https://github.com/drwpow)! - Bugfix: more AAM mappings were incorporated

  - `<dd>` now maps to `definition`
  - `<dt>` now maps to `term`
  - `<figcaption>` now maps to `caption`

- [#38](https://github.com/drwpow/html-aria/pull/38) [`047714d`](https://github.com/drwpow/html-aria/commit/047714d6f1ca2b792927bf5a3a39c7425be8641a) Thanks [@drwpow](https://github.com/drwpow)! - fix: Performance improvements for DOM API

- [#38](https://github.com/drwpow/html-aria/pull/38) [`047714d`](https://github.com/drwpow/html-aria/commit/047714d6f1ca2b792927bf5a3a39c7425be8641a) Thanks [@drwpow](https://github.com/drwpow)! - feat: Add presentationalChildren property to RoleData

- [#40](https://github.com/drwpow/html-aria/pull/40) [`eedfa8f`](https://github.com/drwpow/html-aria/commit/eedfa8f222ca0281ab1854fde1ac315bbf9dbaba) Thanks [@drwpow](https://github.com/drwpow)! - Add support for custom elements

- [#38](https://github.com/drwpow/html-aria/pull/38) [`047714d`](https://github.com/drwpow/html-aria/commit/047714d6f1ca2b792927bf5a3a39c7425be8641a) Thanks [@drwpow](https://github.com/drwpow)! - Fix: all methods are now runnable in a DOM or DOM-like environment

## 0.1.9

### Patch Changes

- [#33](https://github.com/drwpow/html-aria/pull/33) [`c257353`](https://github.com/drwpow/html-aria/commit/c25735370dd5abdc72d46fb1cdab78f119dd835f) Thanks [@jlp-craigmorten](https://github.com/jlp-craigmorten)! - Fix role for th element in context

## 0.1.8

### Patch Changes

- [#30](https://github.com/drwpow/html-aria/pull/30) [`b6219e8`](https://github.com/drwpow/html-aria/commit/b6219e85d13f2f2eb74d066714e5fd11bc5f6b4e) Thanks [@jlp-craigmorten](https://github.com/jlp-craigmorten)! - Fix role for aside element when nested within sectioning content

## 0.1.7

### Patch Changes

- [#28](https://github.com/drwpow/html-aria/pull/28) [`bbd21ac`](https://github.com/drwpow/html-aria/commit/bbd21ac5174138008ad480484df552eb743a9213) Thanks [@jlp-craigmorten](https://github.com/jlp-craigmorten)! - Fix role for section element with no accessible name

## 0.1.6

### Patch Changes

- [#18](https://github.com/drwpow/html-aria/pull/18) [`11a9fae`](https://github.com/drwpow/html-aria/commit/11a9fae4d65280cd35cfb6a1b68abd50cee299e8) Thanks [@drwpow](https://github.com/drwpow)! - Add missing aria-orientation attribute to toolbar

## 0.1.5

### Patch Changes

- [#15](https://github.com/drwpow/html-aria/pull/15) [`245f463`](https://github.com/drwpow/html-aria/commit/245f463fe25b9176f0a56d3a468f9137151041a9) Thanks [@drwpow](https://github.com/drwpow)! - Fix getSupportedAttributes behavior

## 0.1.4

### Patch Changes

- [#13](https://github.com/drwpow/html-aria/pull/13) [`1012427`](https://github.com/drwpow/html-aria/commit/1012427a59c0ce9f189e0d323984084232cf3796) Thanks [@drwpow](https://github.com/drwpow)! - Fix package.json export types

## 0.1.3

### Patch Changes

- [#11](https://github.com/drwpow/html-aria/pull/11) [`669cb9b`](https://github.com/drwpow/html-aria/commit/669cb9b332b4cf335279f7c9b89afc09e2d8fd67) Thanks [@drwpow](https://github.com/drwpow)! - Build with unbuild

## 0.1.2

### Patch Changes

- [#6](https://github.com/drwpow/html-aria/pull/6) [`68edcf8`](https://github.com/drwpow/html-aria/commit/68edcf89df4d2a6c5595091194bf1b834f6f9db1) Thanks [@drwpow](https://github.com/drwpow)! - Improve types for CJS imports
