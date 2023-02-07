"use strict";

export const TITLE = "Log In";

export const CSS = ``;

export default function logIn(){

  let dom = `
<container>
  <row>
    <column class="w-50 bc-2 p-5 bs radius">

      <row>
        <h1>${langDict["logIn"][langCode]}</h1>
      </row>

      <row>
        <form for='logIn'>

          <label>
              <p for='eMail'>${langDict["eMail"][langCode]}</p>
              <input type='email' name='eMail'>
          </label>

          <label>
              <p for='password'>${langDict["password"][langCode]}</p>
              <input type='password' name='password' minlength='${conf["password_min_length"]}' maxlength='${conf["password_max_length"]}'><br>
          </label>

          <label>
              <p for='logIn'></p>
              <input type='submit' name='logIn' value='${langDict["logIn"][langCode]}'>
          </label>

        </form>
      </row>

      <row>
        <a href="/signUp">${langDict["dontHaveAccountGoToSignUp"][langCode]}</a>
      </row>

    </column>

  </row>
</container>
  `;

  return dom;

}
