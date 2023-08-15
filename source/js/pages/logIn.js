"use strict";

export const TITLE = "Log In";

export const CSS = ``;

export default function logIn(){

  let dom = `
<container class="p-5">
  <row>
    <column class="w-50 surface-clean p-5">

      <row>
        <h1>${window.Lang.use("logIn")}</h1>
      </row>

      <row>
        <form action="logIn" for="logIn">

          <label>
            <p for='eMail'>${window.Lang.use("eMail")}</p>
            <input type='email' name='eMail'>
          </label>

          <label>
            <p for='password'>${window.Lang.use("password")}</p>
            <input type='password' name='password' minlength='${window.CONF["password_min_length"]}' maxlength='${window.CONF["password_max_length"]}'><br>
          </label>

          <label>
            <input type='submit' name='logIn' value='${window.Lang.use("logIn")}'>
            <p for='logIn'></p>
          </label>

        </form>
      </row>

      <row>
        <a href="/signUp">${window.Lang.use("dontHaveAccountGoToSignUp")}</a>
      </row>

    </column>

  </row>
</container>
  `;

  return dom;

}
