"use strict";

export function before(){
  window.pageData.dom = "";

  for(const keyword in window.langDict){
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

  <row>
    <column class="box-default left p-1">
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
