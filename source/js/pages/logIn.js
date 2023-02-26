"use strict";

export const TITLE = "Log In";

export const CSS = ``;

export default function logIn(){

  let dom = `
<container>
  <row>
    <column class="w-50 bc-2 p-5 bs radius">

      <row>
        <h1>${window.langDict["logIn"][window.langCode]}</h1>
      </row>

      <row>
        <form endpoint="logIn" for="logIn">

          <label>
              <p for='eMail'>${window.langDict["eMail"][window.langCode]}</p>
              <input type='email' name='eMail'>
          </label>

          <label>
              <p for='password'>${window.langDict["password"][window.langCode]}</p>
              <input type='password' name='password' minlength='${window.CONF["password_min_length"]}' maxlength='${window.CONF["password_max_length"]}'><br>
          </label>

          <label>
              <p for='logIn'></p>
              <input type='submit' name='logIn' value='${window.langDict["logIn"][window.langCode]}'>
          </label>

        </form>
      </row>

      <row>
        <a href="/signUp">${window.langDict["dontHaveAccountGoToSignUp"][window.langCode]}</a>
      </row>

    </column>

  </row>
</container>
  `;

  return dom;

}
