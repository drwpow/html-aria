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

#### Attribute-aware roles

Attribute-aware roles use their explicit attributes in addition to their element to determine the role. Many are commonly-known, such as `<input type="checkbox" />` being a `checkbox`. But some may be unexpected, such as `<a>` having no role if missing `href`. All of these come directly [from the spec](https://www.w3.org/TR/html-aria/#docconformance).

The importance of attributes are why we require those to determine the proper role.

| Element     | Condition                                                                    | Role           |
| :---------- | :--------------------------------------------------------------------------- | :------------- |
| **a**       | `type="href"`                                                                | `link`         |
| **a**       | (no `href`)                                                                  | none           |
| **input**   | `type="button"`                                                              | `button`       |
| **input**   | `type="checkbox"`                                                            | `checkbox`     |
| **input**   | `type="email"` (no `list`)                                                   | `textbox`      |
| **input**   | `type="image"`                                                               | `button`       |
| **input**   | `type="radio"`                                                               | `radio`        |
| **input**   | `type="range"`                                                               | `slider`       |
| **input**   | `type="reset"`                                                               | `button`       |
| **input**   | `type="search"`                                                              | `searchbox`    |
| **input**   | `type="submit"`                                                              | `button`       |
| **input**   | `type="tel"` (no `list`)                                                     | `textbox`      |
| **input**   | `type="text"` (no `list`)                                                    | `textbox`      |
| **input**   | `type="url"` (no `list`)                                                     | `textbox`      |
| **input**   | `list="*"` set                                                               | `combobox`     |
| **input**   | (other)                                                                      | none           |
| **section** | [accessible name](https://www.w3.org/TR/accname-1.2/#dfn-accessible-name)    | `region`       |
| **section** | no [accessible name](https://www.w3.org/TR/accname-1.2/#dfn-accessible-name) | `generic`      |
| **th**      | `scope="col"` (or default)                                                   | `columnheader` |
| **th**      | `scope="row"`                                                                | `rowheader`    |

#### Accessibility Tree-aware roles

When it comes to the [accessibility tree](https://developer.mozilla.org/en-US/docs/Glossary/Accessibility_tree), there are 2 relevant concepts. The 1st is [Allowed Child Roles](https://www.w3.org/TR/wai-aria-1.3/#mustContain), which require specific roles to only be used in specific containers (e.g. an `option` must have a `listbox` parent somewhere). The 2nd concept is related but slightly different, where the inferred role _may vary_ based on the parent’s role (with the implication that multiple possibilities are all valid, but we want to know which role appears in the final accessibility tree).

Here are a list of all elements where the role may change based on the parent:

| Element    | Possible Role                                                                                                                                                            |
| :--------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **header** | `banner` if inside a [landmark region](https://www.w3.org/TR/wai-aria-1.3/#landmark); `generic` otherwise.                                                               |
| **li**     | `listitem` if inside `<ol>`, `<ul>`, `<menu>`; `generic` otherwise.                                                                                                      |
| **td**     | `cell` if inside `<table>`, `gridcell` if inside a `role="grid"` or `role="treegrid"`, or `none` otherwise.                                                              |
| **th**     | `columnheader` or `rowheader` if inside a `role="table"`, `role="grid"`, or `role="treegrid"` (see [Attribute-aware roles](#attribute-aware-roles)) or `none` otherwise. |

Follows the [W3C Recommendation](https://www.w3.org/TR/html-aria/) (Dec 2024).

### getSupportedAttributes()

For any ARIA role, list all supported attributes (including attributes inherited from superclasses).

```ts
getSupportedAttributes("menuitem"); // ["aria-activedescendent", "aria-atomic", …]
```

There’s also a helper method `isSupportedAttribute()` to test individual attributes:

```ts
isSupportedAttribute("menuitem", "aria-valuenow"); // true
isSupportedAttribute("menuitem", "aria-checked"); // false
```

### getSupportedRoles()

Get supported ARIA roles for a given HTML element, given its attributes and [Accessibility Child Roles](https://www.w3.org/TR/wai-aria-1.3/#mustContain). Like [getRole](#getrole), you can also pass in an HTMLElement or object of values

```ts
import { getSupportedRoles } from "html-aria";

getSupportedRoles(document.createElement("img")); // ["none", "presentation", "img"]
getSupportedRoles({ tagName: "img", attributes: { alt: "Image caption" } }); //  ["button", "checkbox", "link", (15 more)]
getSupportedRoles({ tagName: "td" }, { lineage: ["table"] }); // ["cell"]
getSupportedRoles({ tagName: "td" }); // (all roles supported)
```

## About

### Project Goals

1. Deliver correct, up-to-date information based on the [latest W3C recommendation](https://www.w3.org/TR/html-aria/)
1. Only provide normative (unopinionated) data

### Differences from aria-query

- Current with ARIA 1.3
- Simpler API.
- Ships TypeScript types for advanced usecases
