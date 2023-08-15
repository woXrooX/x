"use strict";

export const TITLE = "App Is Down";
export default function content(){

  return `
    <container class="p-5">
      <row>
        <column class="w-50 surface-clean p-5">
          <x-icon name="${window.CONF["default"]["appIsDown"]["icon"]}"></x-icon>
          <h1>${window.CONF["default"]["appIsDown"]["title"]}</h1>
          <h3 class="color-text-secondary">${window.CONF["default"]["appIsDown"]["explanation"]}</h3>
        </column>
      </row>
    </container>
  `;

}
