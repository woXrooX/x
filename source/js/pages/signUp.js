"use strict";

export const TITLE = "Sign Up";
export default function content() {
  let dom = `
<container>
  <row>
    <column class="w-50 box-default p-5 m-t-5">

      <row>
        <h1>${window.langDict["signUp"][window.langCode]}</h1>
      </row>

      <row>
        <form action="signUp" for='signUp'>

          <label>
              <p for='eMail'>${window.langDict["eMail"][window.langCode]}</p>
              <input type='eMail' name='eMail'>
          </label>

          <label>
              <p for='password'>${window.langDict["password"][window.langCode]}</p>
              <input type='password' name='password' minlength='${window.CONF["password"]["min_length"]}' maxlength='${window.CONF["password"]["max_length"]}'><br>
          </label>

          <label>
              <p for='signUp'></p>
              <input type='submit' name='signUp' value='${window.langDict["signUp"][window.langCode]}'>
          </label>

        </form>
      </row>

      <row>
        <a href="/logIn">${window.langDict["haveAccountGoToLogIn"][window.langCode]}</a>
      </row>

    </column>

  </row>
</container>
  `;

  return dom;

}
