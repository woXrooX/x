"use strict";

export const TITLE = "Log In";
export default function logIn(){

  let dom = `
<container>
  <column class="w-50">
    <row>
      <h1>${langDict["logIn"][langCode]}</h1>
    </row>
    <form for='logIn' autocomplete='off'>

    <label>
        <p for='username'>${langDict["username"][langCode]}</p>
        <input type='text' name='username' minlength='${conf["username_min_length"]}' maxlength='${conf["username_max_length"]}' autofocus>
    </label>

    <label>
        <p for='password'>${langDict["password"][langCode]}</p>
        <input type='password' name='password' minlength='${conf["password_min_length"]}' maxlength='${conf["password_max_length"]}' autocomplete='on'><br>
    </label>

    <label>
        <p for='logIn'></p>
        <input type='submit' name='logIn' value='${langDict["logIn"][langCode]}'>
    </label>

    </form>

    <row>
      <a href="{url_for('signUp')}">${langDict["dontHaveAccountGoToSignUp"][langCode]}</a>
    </row>
  </column>
</container>
  `;

  return dom;

}
