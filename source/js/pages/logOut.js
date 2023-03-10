"use strict";

export const TITLE = "Log Out";
export default function content(){

  const dom = `
<container>
  <row>
    <p for='logOut'>${window.Lang.use("ifLogOutWontBeAbleTo")}</p>
  </row>

  <row>
    <column class="bc-2 p-5 bs radius">
      <form action="logOut" for="logOut">
        <label>
            <p for='logOut'></p>
            <input type='submit' name='logOut' value='${langDict["logOut"][langCode]}'>
        </label>
      </form>
    </column>
  </row>
</container>
  `;

  return dom;
}
