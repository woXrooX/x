"use strict";

export function before(){
  window.pageData.dom = "";
  window.pageData.count = 0;

  for(const keyword in window.langDict){
    // Counter
    window.pageData.count++;

    window.pageData.dom += `
<tr>
  <td>${keyword}</td>
  <td>${window.Lang.translate(keyword, "en")}</td>
  <td>${window.Lang.translate(keyword, "ru")}</td>
  <td>${window.Lang.translate(keyword, "uz")}</td>
</tr>
    `;
  }

}

// Title
export const TITLE = window.Lang.use("languagesLibrary");

export default function content(){
  let dom = `
<container class="p-5">
  <row><h1>${window.Lang.use("languagesLibrary")}</h1></row>
  <row class="p-2"><p>This app supports ${window.pageData.count} keywords</p></row>

  <row>
    <column class="w-95 box-default p-5 m-t-5">
      <table>
        <thead>
          <tr>
            <th>Keyword</th>
            <th>EN</th>
            <th>RU</th>
            <th>UZ</th>
          </tr>
        </thead>
        <tbody>${window.pageData.dom}</tbody>
      </table>
    </column>
  </row>
</container>
  `;

  return dom;

}
