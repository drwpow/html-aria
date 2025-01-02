/**
 * This is a browser snippet. How fun! Copy + paste in your console to get a
 * printout of code. You then copy + paste into the appropriate file. This
 * encourages manual review, which is often better than “just trust it”
 * layers and layers of automation where mistakes are harder to spot.
 */
const roleContainers = document.querySelectorAll('#role_definitions section[id].role');
for (const roleContainer of roleContainers) {
  const role = roleContainer.getAttribute('id');
  const table = roleContainer.querySelector('table');

  if (!table) {
    console.warn(`${role} skipped: no data`);
    continue;
  }
  if (roleContainer.querySelector('.role-description')?.textContent.includes('abstract role')) {
    console.warn(`${role} skipped: abstract`);
    continue;
  }

  const rowHeadings = table.querySelectorAll('tbody th');
  const attrList = {};
  const hierarchy = {};
  let nameRequired = false;

  for (const rowHeading of rowHeadings) {
    const rowTitle = rowHeading.textContent.toLocaleLowerCase().trim().replace(/\:$/, '');
    const rowBody = rowHeading.closest('tr').querySelector('td:last-child');

    // nameRequired
    if (rowTitle.includes('accessible name required')) {
      nameRequired = rowBody.textContent.includes('True');
    }

    // superclass
    if (rowTitle.includes('superclass role') || rowTitle.includes('subclass roles')) {
      const key = rowTitle.includes('superclass') ? 'superclasses' : 'subclasses';
      const list = [];
      for (const role of rowBody.querySelectorAll('a.role-reference')) {
        list.push(role.textContent);
      }
      list.sort((a, b) => a.localeCompare(b));
      hierarchy[key] = list;
    }

    // attributes
    else if (rowTitle.endsWith('states and properties')) {
      const list = new Set();
      for (const attr of rowBody.querySelectorAll('li')) {
        if (attr.textContent.includes('deprecated')) {
          continue;
        }
        const link = attr.querySelector('a');
        if (link) {
          list.add(link.textContent);
        }
      }

      let key;
      if (rowTitle.includes('required')) {
        key = 'required';
      } else if (rowTitle.includes('inherited') || rowTitle.includes('supported')) {
        key = 'supported';
      } else if (rowTitle.includes('prohibited')) {
        key = 'prohibited';
      }
      if (key) {
        attrList[key] = [...(attrList[key] ?? []), ...list];
        attrList[key] = dedupeArray(attrList[key]);
        attrList[key].sort((a, b) => a.localeCompare(b));
        if (key === 'required') {
          attrList.supported = [...(attrList.supported ?? []), ...list];
          attrList.supported = dedupeArray(attrList.supported);
          attrList.supported.sort((a, b) => a.localeCompare(b));
        }
      }
    }
  }

  console.log(`${role}: {
  ${Object.entries(hierarchy)
    .map(([k, v]) => `${k}: ${printArray(v)},`)
    .join('\n  ')}
  nameRequired: ${nameRequired},
  ${Object.entries(attrList)
    .map(([k, v]) => `${k}: ${printArray(v)}, // biome-ignore format: long list`)
    .join('\n  ')}
}`);
}

function dedupeArray(arr) {
  return arr.filter((v, i) => arr.indexOf(v) === i);
}

function printArray(arr) {
  return `[${arr.map((v) => `'${v}'`).join(', ')}]`;
}
