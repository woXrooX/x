"use strict";

export const TITLE = "Log Out";
export default function content(){

  const dom = `
<container>
  <row>
    <p for='logOut'>${window.Lang.use("ifLogOutWontBeAbleTo")}</p>
  </row>

  <row>
    <column class="w-50 box-default p-5 m-t-5">
      <form action="logOut" for="logOut">
        <label>
            <p for='logOut'>${window.Lang.use("areYouSure")}</p>
            <input type='submit' name='logOut' value='${langDict["logOut"][langCode]}'>
        </label>
      </form>
    </column>
  </row>
</container>
  `;

  return dom;
}
