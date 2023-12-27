"use strict";

export const TITLE = window.Lang.use("competencyPortfolio_addReflectiveAccount");

export default function content(){
  return `
<container class="py-5">
  <row>
    <column class="w-70 p-5 surface-clean">

      <h1>${window.Lang.use("reflective_account")}</h1>

      <form action="/competencyPortfolio/addReflectiveAccount" for="addReflectiveAccount">

        <label>
          <p for='title'>Title of reflective account</p>
          <input type='text' name='title'>
        </label>

        <label>
          <p for='description'>Description of how you meet the standard</p>
          <textarea name="description" rows="5"></textarea>
        </label>

        <label>
          <input class="btn btn-primary" type='submit' name='addReflectiveAccount' value='Save'>
          <p for='addReflectiveAccount'></p>
        </label>

      </form>

    </column>
  </row>
</container>
  `;
}
