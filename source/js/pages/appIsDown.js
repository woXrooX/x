"use strict";

export const TITLE = "App Is Down";
export default function content(){

  return `
<container>
  <row>
    <column class="w-25 box-default p-5">
      <h1>${window.CONF["default"]["appIsDown"]["reason"]}</h1>
      <h3 style="color: var(--color-text-secondary);">${window.CONF["default"]["appIsDown"]["explanation"]}</h3>
    </column>
  </row>
</container>
  `;;

}
