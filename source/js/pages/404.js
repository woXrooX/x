"use strict";

export const TITLE = "Page Not Found";
export default function content(){

  const dom = `
<container class="m-t-5">
  <row>
    <column class="w-50 box-default p-5 m-t-5">
      <h1>404</h1>
      <h3 style="color: var(--color-text-secondary);">Page Not Found!</h3>
    </column>
  </row>
</container>
  `;

  return dom;

}
