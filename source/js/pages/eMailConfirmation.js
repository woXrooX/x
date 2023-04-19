"use strict";

export const TITLE = window.Lang.use(["eMailConfirmation"]);

export default function content(){
  const dom = `
<container class="p-5">
  <row>
    <column class="w-50 box-default p-5">
      <form action="eMailConfirmation" for="eMailConfirmation">

        <p>${window.Lang.use("eMailConfirmationCodeHasBeenSent")}</p>

        <label>
          <p for='verificationCode'></p>
          <input type='number' name='verificationCode'>
        </label>

        <label>
          <p for='eMailConfirmation'></p>
          <input type='submit' name='verify' value='${window.Lang.use("verifyEmail")}'>
        </label>

      </form>

      <p>${window.Lang.use("didNotReceiveCode")} <a href="/home">${window.Lang.use("resendAgain")}</a></p>

    </column>
  </row>
</container>
  `;

  return dom;

}
