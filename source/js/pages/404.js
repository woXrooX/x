"use strict";

export const TITLE = "Page Not Found";
export default function content(){

  const dom = `
<container class="p-5">
  <row>
    <column class="w-50 surface-clean p-5">
      <h1>404</h1>
      <h3 style="color: var(--color-text-secondary);">Page Not Found!</h3>
    </column>
  </row>
</container>
  `;

  return dom;

}
