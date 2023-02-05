"use strict";

export const TITLE = "Sign Up";
export default function content() {
  let dom = `
<container>
  <row>
    <column class="w-50 p-5 bc-2 bs radius">

      <row>
        <h1>${langDict["signUp"][langCode]}</h1>
      </row>

      <row>
        <form for='signUp'>

          <label>
              <p for='eMail'>${langDict["eMail"][langCode]}</p>
              <input type='eMail' name='eMail'>
          </label>

          <label>
              <p for='password'>${langDict["password"][langCode]}</p>
              <input type='password' name='password' minlength='${conf["password"]["min_length"]}' maxlength='${conf["password"]["max_length"]}'><br>
          </label>

          <label>
              <p for='signUp'></p>
              <input type='submit' name='signUp' value='${langDict["signUp"][langCode]}'>
          </label>

        </form>
      </row>

      <row>
        <a href="/logIn">${langDict["haveAccountGoToLogIn"][langCode]}</a>
      </row>

    </column>

  </row>
</container>
  `;

  return dom;

}
