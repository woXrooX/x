"use strict";

export const TITLE = "App Is Down";
export default function content(){

  return `
<container class="p-5">
  <row>
    <column class="w-50 box-default p-5">
      <h1>${window.CONF["default"]["appIsDown"]["reason"]}</h1>
      <h3 style="color: var(--color-text-secondary);">${window.CONF["default"]["appIsDown"]["explanation"]}</h3>
    </column>
  </row>
</container>
  `;

}
