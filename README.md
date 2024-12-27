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

Follows the [W3C Recommendation](https://www.w3.org/TR/html-aria/) (Dec 2024).

### getValidRoles()

Get valid ARIA roles for a given element.

```ts
import { getValidRoles } from "html-aria";

getValidRoles(document.createElement("img")); // ["none", "presentation", "img"]
getValidRoles({ tagName: "img", attributes: { alt: "Image caption" } }); //  ["button", "checkbox", "link", (15 more)]
```

> ![NOTE]
>
> The [spec](https://www.w3.org/TR/html-aria/#docconformance) does prohibit some roles to be set based on the element, and based on other attributes that element has.

## About

### Project Goals

1. Deliver correct, up-to-date information based on the [latest W3C recommendation](https://www.w3.org/TR/html-aria/)
1. Only provide normative (unopinionated) data

### Differences from aria-query

- Current with ARIA 1.3
- Simpler API.
- Ships TypeScript types for advanced usecases
