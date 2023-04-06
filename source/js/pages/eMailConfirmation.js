"use strict";

export const TITLE = window.Lang.use(["eMailConfirmation"]);

export default function content(){
  const dom = `
<container class="p-5">
  <row>
    <column class="w-50 box-default p-5">
      <form action="eMailConfirmation" for="eMailConfirmation">

        <p>${window.langDict["eMailConfirmationCodeHasBeenSent"][window.langCode]}</p>

        <label>
          <p for='verificationCode'></p>
          <input type='number' name='verificationCode'>
        </label>

        <label>
          <p for='eMailConfirmation'></p>
          <input type='submit' name='verify' value='${window.langDict["verifyEmail"][window.langCode]}'>
        </label>

      </form>

      <p>${window.langDict["didNotReceiveCode"][window.langCode]} <a href="/home">${window.langDict["resendAgain"][window.langCode]}</a></p>

    </column>
  </row>
</container>
  `;

  return dom;

}
