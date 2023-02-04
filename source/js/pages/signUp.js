"use strict";

export const TITLE = "Sign Up";
export default function content() {
  let dom = `
<container>
  <row>
    <column class="w-50 box p-5 bc-2">

      <row>
        <h1>${langDict["signUp"][langCode]}</h1>
      </row>

      <row>
        <form for='signUp' autocomplete='off'>

          <label>
              <p for='eMail'>${langDict["eMail"][langCode]}</p>
              <input type='text' name='eMail'>
          </label>

          <label>
              <p for='password'>${langDict["password"][langCode]}</p>
              <input type='password' name='password'><br>
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