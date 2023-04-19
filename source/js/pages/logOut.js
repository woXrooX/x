"use strict";

export const TITLE = window.Lang.use("logOut");
export default function content(){

  const dom = `
<container class="p-5">
  <row>
    <p>${window.Lang.use("ifLogOutWontBeAbleTo")}</p>
  </row>

  <row>
    <column class="w-50 box-default p-5">
      <form action="logOut" for="logOut">
        <label>
            <p for='logOut'>${window.Lang.use("areYouSure")}</p>
            <input type='submit' name='logOut' value='${window.Lang.use("logOut")}'>
        </label>
      </form>
    </column>
  </row>
</container>
  `;

  return dom;
}
