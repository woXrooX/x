"use strict";

export const TITLE = "Sign Up";
export default function content() {
  let dom = `
<container class="p-5">
  <row>
    <column class="w-50 box-default p-5">

      <row>
        <h1>${window.Lang.use("signUp")}</h1>
      </row>

      <row>
        <form action="signUp" for='signUp'>

          <label>
              <p for='eMail'>${window.Lang.use("eMail")}</p>
              <input type='eMail' name='eMail'>
          </label>

          <label>
              <p for='password'>${window.Lang.use("password")}</p>
              <input type='password' name='password' minlength='${window.CONF["password"]["min_length"]}' maxlength='${window.CONF["password"]["max_length"]}'><br>
          </label>

          <label>
              <p for='signUp'></p>
              <input type='submit' name='signUp' value='${window.Lang.use("signUp")}'>
          </label>

        </form>
      </row>

      <row>
        <a href="/logIn">${window.Lang.use("haveAccountGoToLogIn")}</a>
      </row>

    </column>

  </row>
</container>
  `;

  return dom;

}
