"use strict";
export const TITLE = "Policies";

export async function before(){
  // Get All Policies
  let policies = await window.bridge("policies", {for:"getAllPolicies"}, "application/json");

  // Check If Data Exists
  if(!!policies["data"] === false){
    window.pageData.policiesHtml = `
      <tr>
        <td>No records to show</td>
      </tr>
    `;
    return;
  }

  window.pageData.policiesHtml = "";
  for(let policy of policies["data"]){
    let formToAgreeHtml = `
      <x-modal trigger="click" button type="text" value="Agree">
        <form action="policies" for="agreeOnPolicy" x-modal-action="hide">

          <h1 style="text-align:center;">${policy["name"]}</h1>

          <input type="hidden" name="id" value="${policy["id"]}">

          <label>
            <p for='readConfirm'>I have read and understood and agree to comply with the content of this policy.</p>
            <input type='checkbox' name='readConfirm'>
          </label>

          <label>
            <input class="btn btn-primary" type="submit" name="agreeOnPolicy" value="Submit">
            <p for="agreeOnPolicy"></p>
          </label>

        </form>
      </x-modal>
    `;

    window.pageData.policiesHtml += `
    <tr>
      <td>${policy["name"]}</td>
      <td><a href="/assets/${policy["file"]}" target="_blank">View policy</a></td>
      ${!!policy["user"] ? '<td style="background-color:var(--color-success)">Agreed</td>' : '<td>'+formToAgreeHtml+'</td>'}
    </tr>
    `;

  }
}

export default function content(){

  const dom = `
<container class="my-5">

  <row>

    <column class="w-auto surface-clean p-5">

      <row>${window.Lang.use("listOfAllPolicies")}</row>

      <row>

        <table class="x-default">

          <thead>
            <tr>
              <th>${window.Lang.use("name")}</th>
              <th>${window.Lang.use("file")}</th>
              <th>Agreed</th>
            </tr>
          </thead>

          <tbody>
            ${window.pageData.policiesHtml}
          </tbody>

        </table>

      </row>

    </column>

  </row>

</container>
  `;

  return dom;

}
