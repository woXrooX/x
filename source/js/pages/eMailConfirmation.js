"use strict";

export const TITLE = "Confirm Email";
export default function content(){

  const dom = `
<container>
  <row>
    <column class="bc-2 p-5 bs radius">
      <form for="eMailConfirmation">
        <label>
          <p for='verificationCode'></p>
          <input type='number' name='verificationCode'>
        </label>

        <label>
          <p for='eMailConfirmation'></p>
          <input type='submit' name='eMailConfirmation' value='Confirm Email'>
        </label>
        
      </form>
    </column>
  </row>
</container>
  `;

  return dom;
}
