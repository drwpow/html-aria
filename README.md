# html-aria

Access WAI ARIA data for HTML based on the [W3C Recommendation](https://www.w3.org/TR/html-aria/) (Dec 2024).

## Setup

```sh
npm i html-aria
```

## API

### getRole()

Get a valid ARIA role from either an actual HTML element (if in browser), or an object with (`tagName`, `attributes`) properties:

```ts
import { getRole } from "html-aria";

getRole(document.createElement("article")); // "article"
getRole({ tagName: "input", attributes: { type: "checkbox" } }); // "checkbox"
getRole({ tagName: "div", attributes: { role: "button" } }); // "button"
```

To ensure accuracy, there are 2 very important rules to follow:

1. Always pass in all `attributes`, because their values affect the returned role

- e.g. `<th>` → `columnheader` / `<th scope="row">` → `rowheader`
- `role` always wins if specified

2. For `li`, `td`, `th`, `header`, and `footer`, provide `ancestors` to get an accurate value.

Follows the [W3C Recommendation](https://www.w3.org/TR/html-aria/) (Dec 2024), with [a couple exceptions](#deviations-from-the-spec).

#### Note on `ancestors`

This library **DOES NOT** scan the full HTML document (which may not always be possible, as this may be used in lint rules, testing components, etc.). And in most cases, this isn’t needed anyway, save for a few exceptions: `td`, `th`, `li`, `header`, and `footer`:

```ts
// <td>
getRole({ tagName: "td" }); // "cell"
getRole({ tagName: "td" }, { ancestors: [] }); // "generic"
getRole(
  { tagName: "td" },
  { ancestors: [{ tagName: "table", attributes: { role: "grid" } }] }
); // "gridcell"
getRole(
  { tagName: "td" },
  { ancestors: [{ tagName: "table", attributes: { role: "treegrid" } }] }
); // "gridcell"

// <th>
getRole({ tagName: "th" }); // "columnheader"
getRole({ tagName: "th" }, { ancestors: [] }); // "generic"

// <li>
getRole({ tagName: "li" }); // "listitem"
getRole({ tagName: "li" }, { ancestors: [] }); // listitem

// <header> and <footer>
getRole({ tagName: "header" }); // "banner" (or "contentinfo" for footer)
getRole({ tagName: "header" }, { ancestors: [{ tagName: "article" }] }); // generic
```

_Note: for `<header>` and `<footer>` tags, any `article`, `region`, `complementary`, `main`, or `navigation` ancestors will cause it to inherit a `generic` role by default._

### getSupportedAttributes()

For any element, list all supported attributes (including attributes inherited from superclasses).

```ts
getSupportedAttributes({ tagName: "button" }); // ["aria-atomic", "aria-braillelabel", …]
```

There’s also a helper method `isSupportedAttribute()` to test individual attributes:

```ts
isSupportedAttribute({ tagName: "button" }, "aria-pressed"); // true
isSupportedAttribute({ tagName: "button" }, "aria-checked"); // false
```

It’s worth noting that **HTML elements may factor in** according to the spec. In other words, just providing the `role` isn’t enough. Here are a list of HTML elements where they support different attributes than their corresponding `role`s:

- `<b>`, `<code>`, `<i>`, `<samp>`, `<span>`, and `<small>` don’t allow `aria-label` or `aria-labelledby`
- `<col>`, `<colgroup>`, `<slot>`, `<source>`, and `<template>` don’t support any ARIA attributes (whereas by default [global attributes](https://www.w3.org/TR/wai-aria-1.3/#global_states) are usually allowed)

### getSupportedRoles()

Get supported ARIA roles for a given HTML element, given its attributes and [Accessibility Child Roles](https://www.w3.org/TR/wai-aria-1.3/#mustContain). Like [getRole](#getrole), you can also pass in an HTMLElement or object of values

```ts
import { getSupportedRoles } from "html-aria";

getSupportedRoles(document.createElement("img")); // ["none", "presentation", "img"]
getSupportedRoles({ tagName: "img", attributes: { alt: "Image caption" } }); //  ["button", "checkbox", "link", (15 more)]
```

### Deviations from the spec

The following minor deviations were made from the spec.

- `<td>`, `<tr>`, and `<th>` elements only have table-related roles (`cell`, `row`, `columnheader`, etc.) if placed inside a `table`, `grid`, or `treegrid` container. Otherwise they have no role. This library assumes you are using these only in a `table`, `grid`, or `treegrid` without having to specify so. To override this behavior, pass an empty `ancestor` array, e.g.:

  ```ts
  getRole({ tagName: "td" }, { ancestors: [] }); // `undefined`
  ```

- `<li>` is similar—it will assume you are using it inside a list-like container (`<ol>`, `<ul>`, `<menu>`, etc.). To use it as a generic element, give it an empty `ancestor` array.

## About

### Project Goals

1. Deliver correct, up-to-date information based on the [latest W3C recommendation](https://www.w3.org/TR/html-aria/)
1. Only provide normative (unopinionated) data

### Differences from aria-query

- Current with ARIA 1.3
- Simpler API.
- Ships TypeScript types for advanced usecases
