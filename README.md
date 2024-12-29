# html-aria

WAI-ARIA utilities for HTML based on the [ARIA 1.3 spec](https://www.w3.org/TR/wai-aria-1.3) and latest [HTML in ARIA](https://www.w3.org/TR/html-aria/) recommendations (Dec 2024). Lightweight (5k gzip), performant, and zero dependencies.

⚠️ This is in beta and subject to change.

## VS other libraries

### aria-query

- aria-query is still on ARIA 1.2; this library supports ARIA 1.3
- html-aria is > 100× faster, due to aria-query rebuilding large arrays on almost every query.
- html-aria is smaller, weighing only ~5k gzip (aria-query is ~13k gzip)
- html-aria is more user-friendly, with APIs like `getRole()` rather than having to write boilerplate code
- html-aria respects more nuance in the spec such as [improved role detection from HTML](#getrole) and [HTML-aware aria-\* attributes](#aria-attributes-from-html)

## Setup

```sh
npm i html-aria
```

## API

### getRole()

Get a valid ARIA role from HTML. This is the core API.

```ts
import { getRole } from "html-aria";

getRole(document.createElement("article")); // "article"
getRole({ tagName: "input", attributes: { type: "checkbox" } }); // "checkbox"
getRole({ tagName: "div", attributes: { role: "button" } }); // "button"
```

In order to describe how this library follows the W3C spec more closely, it’s important to understand that inferring ARIA roles from HTML isn’t simple! There are essentially 3 categories of roles:

1. **Simple roles**: 1 HTML element = 1 default ARIA role.
2. **Attribute roles**: The proper ARIA role can only be determined from the HTML element’s attributes (e.g. `input[type="radio"]` → `radio`)
3. **Hierarchial roles**: The proper ARIA role can only be determined by knowing its parent roles.

The 1st type only requres a simple tag name. The 2nd requires a tag name and attributes. The 3rd requires knowing its immediate parent elements. To see a table of all types, see [3 types of roles](#aria-roles-from-html).

### getSupportedRoles()

The spec dictates that **certain elements may NOT receive certain roles.** For example, `<div role="button">` is allowed (not recommended, but allowed), but `<select role="button">` is not. `getSupportedRoles()` will return all valid roles for a given element (including attributes).

```ts
import { getSupportedRoles } from "html-aria";

getSupportedRoles(document.createElement("img")); // ["none", "presentation", "img"]
getSupportedRoles({ tagName: "img", attributes: { alt: "Image caption" } }); //  ["button", "checkbox", "link", (15 more)]
```

### getSupportedAttributes()

For any element, list all supported [aria-\* attributes](https://www.w3.org/TR/wai-aria-1.3/#states_and_properties), including attributes inherited from superclasses. This takes in an HTML element, not an ARIA role, because in some cases the HTML element actually affects the list ([see full list](#html-attributes)).

```ts
import { getSupportedAttributes } from "html-aria";

getSupportedAttributes({ tagName: "button" }); // ["aria-atomic", "aria-braillelabel", …]
```

If you want to look up by ARIA role instead, just pass in a placeholder element:

```ts
getSupportedAttributes({ tagName: "div", attributes: { role: "combobox" } });
```

There’s also a helper method `isSupportedAttribute()` to test individual attributes:

```ts
import { isSupportedAttribute } from "html-aria";

isSupportedAttribute({ tagName: "button" }, "aria-pressed"); // true
isSupportedAttribute({ tagName: "button" }, "aria-checked"); // false
```

It’s worth noting that **HTML elements may factor in** according to the spec. In other words, just providing the `role` isn’t enough. Here are a list of HTML elements where they support different attributes than their corresponding `role`s:

- `<b>`, `<code>`, `<i>`, `<samp>`, `<span>`, and `<small>` don’t allow `aria-label` or `aria-labelledby`
- `<col>`, `<colgroup>`, `<slot>`, `<source>`, and `<template>` don’t support any aria-\* attributes (whereas by default [global attributes](https://www.w3.org/TR/wai-aria-1.3/#global_states) are usually allowed)

### isValidAttributeValue()

Some aria-\* attributes require specific values. `isValidAttributeValue()` returns `false` if, given a specific aria-\* attribute, the value is invalid according to the spec.

```ts
import { isValidAttributeValue } from "html-aria";

// string attributes
// Note: string attributes will always return `true` except for an empty string
isValidAttributeValue("aria-label", "This is a label"); // true
isValidAttributeValue("aria-label", ""); // false

// boolean attributes
isValidAttributeValue("aria-disabled", true); // true
isValidAttributeValue("aria-disabled", false); // true
isValidAttributeValue("aria-disabled", "true"); // true
isValidAttributeValue("aria-disabled", 1); // false
isValidAttributeValue("aria-disabled", "disabled"); // false

// enum attributes
isValidAttributeValue("aria-checked", "true"); // true
isValidAttributeValue("aria-checked", "mixed"); // true
isValidAttributeValue("aria-checked", "checked"); // false
```

⚠️ _Be mindful of cases where a valid value may still be valid, but invoke different behavior according to the ARIA role, e.g. [`mixed` behavior for `radio`/`menuitemradio`/`switch`](https://www.w3.org/TR/wai-aria-1.3/#aria-checked)_

## Reference

### ARIA roles from HTML

This outlines the requirements to adhere to the [W3C spec](https://www.w3.org/TR/html-aria/#docconformance) when it comes to inferring the correct ARIA roles from HTML. There are 3 basic types:

1. **Simple roles**: 1 HTML element = 1 default ARIA role
2. **Attributes roles**: 1 HTML element = multiple possible ARIA roles, depending on attributes (`input[type="radio"]` → `radio` is a common example)
3. **Hierarchial roles**: 1 HTML element = multiple possible ARIA roles depending on its parents

Here are all the HTML elements where either attributes, hierarchy, or both are necessary to determine the correct role (all omitted elements follow a simple mapping pattern):

| Element     |                                                  Role                                                   | Attribute-based | Hierarchy-based |
| :---------- | :-----------------------------------------------------------------------------------------------------: | :-------------: | :-------------: |
| **a**       |                                           `generic` \| `link`                                           |       ✅        |                 |
| **area**    |                                           `generic` \| `link`                                           |       ✅        |                 |
| **footer**  |                                       `contentinfo` \| `generic`                                        |                 |       ✅        |
| **header**  |                                          `banner` \| `generic`                                          |                 |       ✅        |
| **input**   | `button` \| `checkbox` \| `combobox` \| `radio` \| `searchbox` \| `slider` \| `spinbutton` \| `textbox` |       ✅        |                 |
| **li**      |                                         `listitem` \| `generic`                                         |                 |       ✅        |
| **section** |                                          `generic` \| `region`                                          |       ✅        |                 |
| **select**  |                                         `combobox` \| `listbox`                                         |       ✅        |                 |
| **td**      |                                        `cell`\| `gridcell` \| —                                         |                 |       ✅        |
| **th**      |                                   `columnheader` \| `rowheader` \| —                                    |       ✅        |       ✅        |

_Note: `—` = [no corresponding role](#whats-the-difference-between-no-corresponding-role-and-the-none-role-)_

### aria-\* attributes from HTML

Further, a common mistake many simple accessibility libraries make is mapping aria-\* attributes to ARIA roles. While that _mostly_ works, there are a few exceptions where HTML information is needed. That is why [`getSupportedAttributes()`](#getsupportedattributes) takes an HTML element. Here is a full list:

| Element                | Default Role | Notes                                              |
| :--------------------- | :----------: | :------------------------------------------------- |
| **base**               |  `generic`   | No aria-\* attributes allowed                      |
| **body**               |  `generic`   | Does NOT allow `aria-hidden="true"`                |
| **br**                 |  `generic`   | No aria-\* attributes allowed EXCEPT `aria-hidden` |
| **col**                |      —       | No aria-\* attributes allowed                      |
| **colgroup**           |      —       | No aria-\* attributes allowed                      |
| **datalist**           |  `listbox`   | No aria-\* attributes allowed                      |
| **head**               |      —       | No aria-\* attributes allowed                      |
| **html**               |      —       | No aria-\* attributes allowed                      |
| **img** (no `alt`)     |    `none`    | No aria-\* attributes allowed EXCEPT `aria-hidden` |
| **input[type=hidden]** |      —       | No aria-\* attributes allowed                      |
| **link**               |      —       | No aria-\* attributes allowed                      |
| **map**                |      —       | No aria-\* attributes allowed                      |
| **meta**               |      —       | No aria-\* attributes allowed                      |
| **noscript**           |      —       | No aria-\* attributes allowed                      |
| **picture**            |      —       | No aria-\* attributes allowed EXCEPT `aria-hidden` |
| **script**             |      —       | No aria-\* attributes allowed                      |
| **slot**               |      —       | No aria-\* attributes allowed                      |
| **source**             |      —       | No aria-\* attributes allowed                      |
| **style**              |      —       | No aria-\* attributes allowed                      |
| **template**           |      —       | No aria-\* attributes allowed                      |
| **title**              |      —       | No aria-\* attributes allowed                      |
| **track**              |      —       | No aria-\* attributes allowed EXCEPT `aria-hidden` |
| **wbr**                |      —       | No aria-\* attributes allowed EXCEPT `aria-hidden` |

_Note: `—` = [no corresponding role](#whats-the-difference-between-no-corresponding-role-and-the-none-role-). Also worth pointing out that in other cases, [global aria-\* attributes](https://www.w3.org/TR/wai-aria-1.3/#global_states) are allowed, so this is unique to the element and NOT the ARIA role._

### Technical deviations from the spec

#### SVG

SVG is tricky. Though the [spec says](https://www.w3.org/TR/html-aria/#el-svg) `<svg>` should get the `graphics-document` role by default, browsers chose chaos. Firefox 134 displays `graphics-document`, Chrome 131 defaults to `image` (previously it returned nothing, or other roles), and Safari defaults to `generic` (which is one of the worst roles you could probably give it).

Since we have 1 spec and 1 browser agreeing, this library defaults to `graphics-document`. Though the best answer is _SVGs should ALWAYS get an explicit `role`_.

#### Ancestor-based roles

In regards to [ARIA roles in HTML](#aria-roles-in-html), the spec gives non-semantic roles to `<td>`, `<th>`, and `<li>` UNLESS they are used inside specific containers (`table`, `grid`, or `gridcell` for `<td>`/`<th>`; `list` or `menu` for `<li>`). This library assumes they’re being used in their proper containers without requiring the `ancestors` array. This is done to avoid the [footgun](https://en.wiktionary.org/wiki/footgun) of requiring missable configuration to produce accurate results, which is bad software design.

Instead, the non-semantic roles must be “opted in” by passing an explicitly-empty ancestors array:

```ts
import { getRole } from "html-aria";

getRole({ tagName: "td" }, { ancestors: [] }); // undefined
getRole({ tagName: "th" }, { ancestors: [] }); // undefined
getRole({ tagName: "li" }, { ancestors: [] }); // "generic"
```

### FAQ

#### Why the `{ tagName: string }` object syntax?

Most of the time this library will be used in a Node.js environment, likely outside the DOM (e.g. an ESLint plugin traversing an AST). While most methods also allow an [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) as input, the object syntax is universal and works in any context.

#### What’s the difference between “no corresponding role” and the `none` role?

From the [spec](https://www.w3.org/TR/html-aria/#dfn-no-corresponding-role):

**No corresponding role**

> The elements marked with _**No corresponding role**_, in the second column of the table do not have any [implicit ARIA semantics](https://www.w3.org/TR/wai-aria-1.2/#implicit_semantics), but they do have meaning and this meaning may be represented in roles, states and properties not provided by ARIA, and exposed to users of assistive technology via accessibility APIs. It is therefore recommended that authors add a `role` attribute to a semantically neutral element such as a [`div`](https://html.spec.whatwg.org/multipage/grouping-content.html#the-div-element) or [span](https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-span-element), rather than overriding the semantics of the listed elements.

**`none` role**

> An [element](https://dom.spec.whatwg.org/#concept-element) whose implicit native role semantics will not be mapped to the [accessibility API](https://www.w3.org/TR/wai-aria-1.3/#dfn-accessibility-api). See synonym [presentation](https://www.w3.org/TR/wai-aria-1.3/#presentation).

In other words, `none` is more of a decisive “this element is presentational and can be ignored” labeling, while “no corresponding role” means “this element doesn’t have predefined behavior that can be automatically determined, and the author should provide additional information such as explicit `role`s and ARIA states and properties.”

In this library, “no corresponding role” is represented as `undefined`.

## About

### Project Goals

1. Deliver correct, up-to-date information based on the [latest W3C recommendation](https://www.w3.org/TR/html-aria/)
1. Only provide normative (unopinionated) data

### Differences from aria-query

- Current with ARIA 1.3
- Simpler API.
- Ships TypeScript types for advanced usecases
