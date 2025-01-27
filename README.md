# html-aria

Utilities for creating accessible HTML based on the [latest ARIA 1.3 specs](https://www.w3.org/TR/wai-aria-1.3) and latest [HTML in ARIA](https://www.w3.org/TR/html-aria/) recommendations. Lightweight, performant, tree-shakeable, and 0 dependencies.

This is designed to be a better replacement for aria-query when working with HTML. The reasons are:

- aria-query neglects the critical specs [HTML Accessibility API Mappings](https://www.w3.org/TR/html-aam-1.0/) and [HTML to ARIA](https://www.w3.org/TR/html-aria). With just the ARIA spec alone, it’s insufficient for working with HTML.
- html-aria supports ARIA 1.3 while aria-query is still on ARIA 1.2

html-aria is also designed to be easier-to-use to prevent mistakes, smaller, is ESM tree-shakeable, and more performant (~100× faster than aria-query).

## Usage

### Setup

```sh
npm i html-aria
```

### Environments

This library works both in Node.js and the browser. But works best **when the DOM is accessible**, either the actual DOM or a virtualized one like JSDOM. The reason is the spec requires DOM traversal—identifying an element’s context in parents and children, as well as attributes of the element. In a DOM environment, html-aria will do all the work for you; in Node.js you must provide complete information about attributes, and sometimes ancestors.

### Examples

Though this library is NOT a lint plugin, it can do most of the work for you. You only need to traverse the AST of the language you’re using (e.g. HTML vs React vs Svelte), and html-aria can validate the nodes.

#### Node.js (ESLint + React plugin)

```ts
import { ESLintUtils, TSESTree } from "@typescript-eslint/utils";
import {
  getSupportedAttributes,
  type AriaAttribute,
  type TagName,
} from "html-aria";

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://example.com/rule/${name}`
);

export default createRule({
  name: "no-unsupported-aria",
  meta: {
    type: "problem",
    docs: { description: "Ensure that ARIA attributes match their role" },
    messages: {
      "not-allowed": "Attribute {{ name }} not allowed",
    },
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name.type !== TSESTree.AST_NODE_TYPES.JSXIdentifier) {
          return; // this is a React component; ignore
        }

        const tagName = node.name.name as TagName;

        // 1. assemble attributes into a map
        const attributes: Record<
          string,
          string | number | boolean | undefined | null
        > = {};
        for (const attr of node.attributes) {
          if (
            attr.type === TSESTree.JSXSpreadAttribute ||
            attr.name.type === TSESTree.JSXNamespacedName ||
            attr.value?.type === TSESTree.Literal
          ) {
            continue;
          }
          attributes[attr.name.name] = attr.value.value as
            | string
            | number
            | boolean
            | undefined
            | null;
        }

        // 2. get supported attributes from html-aria (which MUST include the attributes to work properly)
        const tag: VirtualElement = { tagName, attributes };
        const supportedAttributes = getSupportedAttributes(tag);

        // 3. validate
        for (const attr of node.attributes) {
          if (attr.type !== TSESTree.AST_NODE_TYPES.JSXAttribute) {
            continue;
          }
          const name =
            typeof attr.name.name === "string"
              ? attr.name.name
              : (attr.name.name.name as ARIAAttribute);
          if (name.startsWith("aria-") && !supportedAttributes.includes(name)) {
            context.report({
              node: name,
              messageId: "not-allowed",
              data: { name },
            });
          }
        }
      },
    };
  },
});
```

_Have an improvement to suggest? Please open a PR!_

## API

### getRole()

Determine which HTML maps to which default ARIA role.

```ts
import { getRole } from "html-aria";

// DOM
const el = document.querySelector('article')
getRole(el); // "article"

// Node.js (no DOM)
getRole({ tagName: "input", attributes: { type: "checkbox" } }); // "checkbox"
getRole({ tagName: "div", attributes: { role: "button" } }); // "button"
```

It’s important to note that inferring ARIA roles from HTML isn’t always straightforward! There are 3 types of role inference:

1. **Tag map**: 1 tag → 1 ARIA role.
2. **Tag + attribute map**: Tags + attributes are needed to determine the ARIA role (e.g. `input[type="radio"]` → `radio`)
3. **Tag + DOM tree**: Tags + DOM tree structure are needed to determine the ARIA role.

[See a list of all elements](#aria-roles-from-html).

### getSupportedRoles() / isSupportedRole()

The spec dictates that **certain elements may NOT receive certain roles.** For example, `<div role="button">` is allowed (not recommended, but allowed), but `<select role="button">` is not. `getSupportedRoles()` will return all valid roles for a given element + attributes.

```ts
import { getSupportedRoles } from "html-aria";

// DOM
const el = document.querySelector('img')
getSupportedRoles(el); // ["none", "presentation", "img"]

// Node.js (no DOM)
getSupportedRoles({ tagName: "img", attributes: { alt: "Image caption" } }); //  ["button", "checkbox", "link", (15 more)]
```

There is also a helper method `isSupportedRole()` to make individual assertions:

```ts
import { isSupportedRole } from "html-aria";

isSupportedRole({ tagName: "select" }, "combobox"); // true
isSupportedRole(
  { tagName: "select", attributes: { multiple: true } },
  "listbox"
); // true
isSupportedRole({ tagName: "select" }, "listbox"); // false
isSupportedRole({ tagName: "select" }, "button"); // false
```

### getSupportedAttributes() / isSupportedAttribute()

For any element, list all supported [aria-\* attributes](https://www.w3.org/TR/wai-aria-1.3/#states_and_properties), including attributes inherited from superclasses. This takes in an HTML element, not an ARIA role, because in some cases the HTML element actually affects the list ([see full list](#aria--attributes-from-html)).

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

### getElements()

Return all HTML elements that represent a given ARIA role, if any. If no HTML elements represent this role, `undefined` will be returned. This is essentially the inverse of [`getRole()`](#getrole).

```ts
import { getElements } from "html-aria";

getElements("button"); // [{ tagName: "button" }]
getElements("radio"); // [{ tagName: 'input', attributes: { type: "radio" } }]
getElements("rowheader"); // [{ tagName: "th", attributes: { scope: "row" } }]
getElements("tab"); // undefined
```

Worth noting that this is slightly-different from a [related concept](https://www.w3.org/TR/wai-aria-1.3/#relatedConcept) or [base concept](https://www.w3.org/TR/wai-aria-1.3/#baseConcept).

### isInteractive()

Return `true` if a given HTML tag may be interacted with or not.

```ts
isInteractive({ tagName: "button" }); // true
isInteractive({ tagName: "div" }); // false
isInteractive({ tagName: "div", attributes: { tabindex: 0 } }); // false
isInteractive({ tagName: "div", attributes: { role: "button", tabindex: 0 } }); // true
isInteractive({ tagName: "hr" }); // false
isInteractive({
  tagName: "hr",
  attributes: { tabindex: 0, "aria-valuenow": 10 },
}); // true (see https://www.w3.org/TR/wai-aria-1.3/#separator)
```

The methodology for this is somewhat complex to follow the complete ARIA specification:

1. If the role is a [widget](https://www.w3.org/TR/wai-aria-1.3/#widget_roles) or [window](https://www.w3.org/TR/wai-aria-1.3/#window_roles) subclass, then it is interactive
   - Note: if the element manually specifies `role`, and if it natively is NOT a widget or window role, `tabindex` must also be supplied
1. If the element is `disabled` or `aria-disabled`, then it is NOT interactive
1. Handle some explicit edge cases like [separator](https://www.w3.org/TR/wai-aria-1.3/#separator)

Note that `aria-hidden` elements may be interactive (even if it’s not best practice) as a part of [2.4.5 Multiple Ways](https://www.w3.org/WAI/WCAG21/Understanding/multiple-ways.html) if an alternative is made for screenreaders, etc.

### isNameRequired()

For a role, return whether or not an [accessible name](https://www.w3.org/TR/wai-aria-1.3/#namecalculation) is required for screenreaders.

```ts
import { isNameRequired } from "html-aria";

isNameRequired("link"); // true
isNameRequired("cell"); // false
```

_Note: this does NOT mean `aria-label` is required! Quite the opposite—if a name is required, it’s always best to have the name visible in content. See [ARIA 1.3 Accessible Name Calculation](https://www.w3.org/TR/wai-aria-1.3/#namecalculation) for more info._

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

// number attributes
isValidAttribute("aria-valuenow", "15"); // true
isValidAttribute("aria-valuenow", 15); // true
isValidAttribute("aria-valuenow", 0); // true
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

_Note: `—` = [no corresponding role](#whats-the-difference-between-no-corresponding-role-and-the-none-role)_

### aria-\* attributes from HTML

Further, a common mistake many simple accessibility libraries make is mapping aria-\* attributes to ARIA roles. While that _mostly_ works, there are a few exceptions where HTML information is needed. That is why [`getSupportedAttributes()`](#getsupportedattributes--issupportedattribute) takes an HTML element. Here is a full list:

| Element                  | Default Role | Notes                                                                                     |
| :----------------------- | :----------: | :---------------------------------------------------------------------------------------- |
| **audio**                |      —       | Accepts `application` aria-\* attributes by default                                       |
| **base**                 |  `generic`   | No aria-\* attributes allowed                                                             |
| **body**                 |  `generic`   | Does NOT allow `aria-hidden="true"`                                                       |
| **br**                   |  `generic`   | No aria-\* attributes allowed EXCEPT `aria-hidden`                                        |
| **col**                  |      —       | No aria-\* attributes allowed                                                             |
| **colgroup**             |      —       | No aria-\* attributes allowed                                                             |
| **datalist**             |  `listbox`   | No aria-\* attributes allowed                                                             |
| **head**                 |      —       | No aria-\* attributes allowed                                                             |
| **html**                 |      —       | No aria-\* attributes allowed                                                             |
| **img** (no `alt`)       |    `none`    | No aria-\* attributes allowed EXCEPT `aria-hidden`                                        |
| **input[type=checkbox]** |      —       | Forbids `aria-checked`                                                                    |
| **input[type=color]**    |      —       | Acts as a generic element but allows `aria-disabled`                                      |
| **input[type=files]**    |      —       | Acts as a generic element but allows `aria-disabled`, `aria-invalid`, and `aria-required` |
| **input[type=hidden]**   |      —       | No aria-\* attributes allowed                                                             |
| **input[type=radio]**    |      —       | Forbids `aria-checked`                                                                    |
| **link**                 |      —       | No aria-\* attributes allowed                                                             |
| **map**                  |      —       | No aria-\* attributes allowed                                                             |
| **meta**                 |      —       | No aria-\* attributes allowed                                                             |
| **noscript**             |      —       | No aria-\* attributes allowed                                                             |
| **picture**              |      —       | No aria-\* attributes allowed EXCEPT `aria-hidden`                                        |
| **script**               |      —       | No aria-\* attributes allowed                                                             |
| **slot**                 |      —       | No aria-\* attributes allowed                                                             |
| **source**               |      —       | No aria-\* attributes allowed                                                             |
| **style**                |      —       | No aria-\* attributes allowed                                                             |
| **summary**              |      —       | Allows `aria-disabled` and `aria-haspopup` regardless of role                             |
| **template**             |      —       | No aria-\* attributes allowed                                                             |
| **title**                |      —       | No aria-\* attributes allowed                                                             |
| **track**                |      —       | No aria-\* attributes allowed EXCEPT `aria-hidden`                                        |
| **video**                |      —       | Accepts `application` aria-\* attributes by default                                       |
| **wbr**                  |      —       | No aria-\* attributes allowed EXCEPT `aria-hidden`                                        |

_Note: `—` = [no corresponding role](#whats-the-difference-between-no-corresponding-role-and-the-none-role). Also worth pointing out that in other cases, [global aria-\* attributes](https://www.w3.org/TR/wai-aria-1.3/#global_states) are allowed, so this is unique to the element and NOT the ARIA role._

### Technical deviations from the spec

#### Mark

The `<mark>` tag gets the `mark` role. Seems logical, right? Well, not according to the spec. It’s [not listed in the HTML in ARIA spec](https://www.w3.org/TR/html-aria/#el-mark), and it’s worth noting that `<mark>` is a [_related concept_](https://www.w3.org/TR/wai-aria-1.3/#mark), not a base concept as elements usually are.

But despite the ARIA specs being pretty clear that `<mark>` and `mark` aren’t directly equivalent, all modern browsers today seem to think they are, and `<mark>` always gets a `mark` role. For that reason, html-aria has sided with practical browser implementation rather than the ARIA spec.

#### SVG

SVG is tricky. Though the [spec says](https://www.w3.org/TR/html-aria/#el-svg) `<svg>` should get the `graphics-document` role by default, browsers chose chaos. Firefox 134 displays `graphics-document`, Chrome 131 defaults to `image` (previously it returned nothing, or other roles), and Safari defaults to `generic` (which is one of the worst roles you could probably give it).

Since we have 1 spec and 1 browser agreeing, this library defaults to `graphics-document`. Though the best answer is _SVGs should ALWAYS get an explicit `role`_.

### Node.js vs DOM behavior

#### Node.js ignores necessary ancestor-based roles

There are 2 categories of context-dependent element usage: **necessary** and **conditional**.

“Necessary“ context elements require certain parents to use correctly, like table-based elements (`<tr>`, `<td>`, `<th>`, etc.) requiring table parents (`<table>`, `<table role="grid">`, etc.) and list-based elements `<li>` requiring list parents (`<ol>`, `<ul>`, `<menu>`, etc.). Without their parents, they have no purpose and their behavior is unpredictable, with some browsers even stripping elements out of the DOM. These elements will 99% of the time be used in their intended contexts.

The DOM environment follows the ARIA spec. But in a Node.js context, it’s likely we are statically analyzing a component where the parents aren’t immediatly reachable—they may be in another file. If we assume the elements are used correctly even when we can’t see the ancestors, we can show more accurate errors and warnings, rather than requiring the consumer to do work that is technically and computationally difficult.

So for the reasons above, assuming the elements are used out of context is more likely to result in less predictable behavior that could lead to mistakes. To treat elements as if they _are_ used out of their context in Node.js, pass an empty `ancestors` array as an explicit way to declare it.

```ts
import { getRole } from "html-aria";

getRole({ tagName: "td" }, { ancestors: [] }); // undefined
getRole({ tagName: "th" }, { ancestors: [] }); // undefined
getRole({ tagName: "li" }, { ancestors: [] }); // "generic"
```

These are all the elements that have assumed context (i.e. different behavior in Node.js): `<col>`, `<colgroup>`, `<caption>`, `<li>`, `<rowgroup>`, `<tbody>`, `<td>`, `<tfoot>`, `<th>`, `<thead>`, `<tr>`.

“Conditional” context elements may either have certain parents or not, all of which are valid. `<aside>` used in the body is a landmark `complementary` role; inside a `<section>` it’s `generic` (unless it has an accessible name, then it’s `complementary` again). `<header>` is a `banner` landmark itself, or inside another landmark is `generic`. Since there’s no “wrong” usage here,

In Node.js they behave as expected, so they don’t deviate from DOM behavior or the spec.

```ts
import { getRole } from "html-aria";

getRole({ tagName: "header" }); // "banner"
getRole({ tagName: "header" }, { ancestors: [{ tagName: "main" }]); // "generic"
getRole({ tagName: "aside" }); // "complementary"
getRole({ tagName: "aside" }, { ancestors: [{ tagName: "section" }] } }); // "generic"
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

As stated in [Project Goals](#about), html-aria aims to not conflate non-normative recommendations as normative guidelines. So in the API, [getSupportedRoles()](#getsupportedroles--issupportedrole) and [getSupportedAttributes()](#getsupportedattributes--issupportedattribute) will return 1 and 2, but not 3 or 4.

While there is a technical distinction between 3 and 4, for the purposees of html-aria they’re treated the same (because 3 specifically is not explicitly allowed, we can make a choice to read it as prohibited).

## About

### Project Goals

1. Implement _all_ ARIA spec docs, not just the roles specification
1. Stick to _normative_ guidelines (i.e. only implement “MUST” language, not “SHOULD”—the latter is the area of linters)
1. Reduce mistakes with explicit methods and user-friendly API design.
