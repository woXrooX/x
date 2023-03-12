"use strict";

export const TITLE = "Page Not Found";
export default function content(){

  const dom = `
<container>
  <row>
    <column class="w-25 bc-3 radius p-5 bs">
      <h1>404</h1>
      <h3 style="color: var(--color-text-secondary);">Page Not Found!</h3>
    </column>
  </row>
</container>
  `;

  return dom;

}
