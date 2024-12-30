# html-aria

WAI-ARIA utilities for HTML based on the [ARIA 1.3 spec](https://www.w3.org/TR/wai-aria-1.3) and latest [HTML in ARIA](https://www.w3.org/TR/html-aria/) recommendations (Dec 2024). Lightweight (5k gzip), performant, and zero dependencies.

⚠️ This is in beta and subject to change.

## VS other libraries

### aria-query

- html-aria supports ARIA 1.3 while aria-query is still on ARIA 1.2
- html-aria is designed to reduce effort and minimize error for common tasks (e.g. determining ARIA roles from HTML). aria-query is a general purpose replication of the ARIA spec that requires more understanding and more boilerplate code.
- html-aria is more performant (100× faster) due to aria-query [constantly redoing work](https://github.com/A11yance/aria-query/issues/560).
- html-aria is smaller, weighing only ~5k gzip (aria-query is ~13k gzip)
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

It’s important to note that inferring ARIA roles from HTML isn’t always straightforward! There are 3 types of role inference:

1. **Tag map**: 1 tag → 1 ARIA role.
2. **Tag + attribute map**: Tags + attributes are needed to determine the ARIA role (e.g. `input[type="radio"]` → `radio`)
3. **Tag + DOM tree**: Tags + DOM tree structure are needed to determine the ARIA role.

[Learn more](#aria-roles-from-html).

### getSupportedRoles()

The spec dictates that **certain elements may NOT receive certain roles.** For example, `<div role="button">` is allowed (not recommended, but allowed), but `<select role="button">` is not. `getSupportedRoles()` will return all valid roles for a given element + attributes.

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

It’s worth noting that **HTML elements may factor in** according to the spec—providing the `role` isn’t enough. [See aria-\* attributes from HTML](#aria--attributes-from-html).

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

This outlines the requirements to adhere to the [W3C spec](https://www.w3.org/TR/html-aria/#docconformance) when it comes to inferring the correct ARIA roles from HTML. Essentially, there are 3 types of inference:

1. **Tag map**: 1 tag → 1 ARIA role.
2. **Tag + attribute map**: Tags + attributes are needed to determine the ARIA role (e.g. `input[type="radio"]` → `radio`)
3. **Tag + DOM tree**: Tags + DOM tree structure are needed to determine the ARIA role.

Here are all the HTML elements where either attributes, hierarchy, or both are necessary to determine the correct role. Any HTML elements not listed here follow the simple “tag map” approach (keep in mind that [aria-\* attributes may not follow the same rules](#aria--attributes-from-html)!).

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

In html-aria, “no corresponding role” is represented as `undefined`.

#### What is the difference between “unsupported attributes” and “prohibited attributes?”

In the spec, you’ll find language describing both roles and attributes in 4 categories:

1. **Supported and recommended:** valid and recommended to use
2. **Supported but not recommended:** valid, but may [cause unpredictable behavior](https://www.w3.org/TR/html-aria/#author-guidance-to-avoid-incorrect-use-of-aria)
3. **Unsupported, but not prohibited:** these are omitted both from supported and prohibited lists
4. **Unsupported and prohibited:** explicitly [prohibited](https://www.w3.org/TR/wai-aria-1.3/#prohibitedattributes)

As stated in [Project Goals](#about), html-aria aims to not conflate non-normative recommendations as normative guidelines. So in the API, [getSupportedRoles()](#getsupportedroles--) and [getSupportedAttributes()](#getsupportedattributes--) will return 1 and 2, but not 3 or 4.

While there is a technical distinction between 3 and 4, for the purposees of html-aria they’re treated the same.

## About

### Project Goals

1. Get annoyingly-close to the WAI-ARIA specification while remaining user-friendly
1. Don’t be opinionated
