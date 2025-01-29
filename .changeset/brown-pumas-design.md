---
"html-aria": minor
---

⚠️ Breaking API changes:

 - `getRole()` now returns full role data, rather than a string. To achieve the same result, access the `name` property:
     ```diff
     - getRole({ tagName: 'button' })
     + getRole({ tagName: 'button' })?.name
     ```
