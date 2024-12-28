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

  const required = [];
  const supported = [];
  const prohibited = [];
  function pushAttrsToList(rowBody, list) {
    const links = rowBody.querySelectorAll('a');
    for (const link of links) {
      list.push(link.textContent);
    }
  }

  for (const rowHeading of rowHeadings) {
    const rowTitle = rowHeading.textContent.toLocaleLowerCase();
    const rowBody = rowHeading.closest('tr').querySelector('td:last-child');

    // required
    if (rowTitle.includes('required states and properties')) {
      pushAttrsToList(rowBody, required);
    }

    // note: before supported, we MUST push all required attrs to this as well
    supported.push(...required);

    // supported
    if (rowTitle.includes('inherited states and properties') || rowTitle.includes('supported states and properties')) {
      pushAttrsToList(rowBody, supported);
    }

    // prohibited
    if (rowTitle.includes('prohibited states and properties')) {
      pushAttrsToList(rowBody, prohibited);
    }

    // sort
    required.sort((a, b) => a.localeCompare(b));
    supported.sort((a, b) => a.localeCompare(b));
    prohibited.sort((a, b) => a.localeCompare(b));
  }

  console.log(`${role}: {
  required: [${required.map((v) => `'${v}'`).join(', ')}],
  supported: [${supported.map((v) => `'${v}'`).join(', ')}], // biome-ignore format: long list
  prohibited: [${prohibited.map((v) => `'${v}'`).join(', ')}],
}`);
}
