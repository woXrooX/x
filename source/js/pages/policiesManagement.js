"use strict";

export async function before(){
  // Get All Policies
  let policies = await window.bridge("policiesManagement", {for:"getAllPolicies"}, "application/json");

  window.pageData.policiesHtml = "";

  // Check policies["data"]
  if(!!policies["data"] === false) return;

  for(let policy of policies["data"])
    window.pageData.policiesHtml += `
  <tr>
    <td>${policy["name"]}</td>
    <td><a href="/assets/${policy["file"]}" target="_blank">${policy["file"]}</a></td>
    <td>
      <form action="policiesManagement" for="deletePolicy">
        <input type="hidden" name="id" value="${policy["id"]}">
        <button class="btn btn-primary" type="submit"><x-icon name="trash"></x-icon></button>
      </form>
    </td>
  </tr>
    `;

}

export const TITLE = window.Lang.use("policiesManagement");
export default function content(){

  const dom = `
<container class="my-5">
  <row>
    <column class="w-auto surface-clean p-5">

      <row>${window.Lang.use("createPolicy")}</row>

      <row>

        <form action="policiesManagement" for='createPolicy'>

          <label>
            <p for='name'>${window.Lang.use("name")}</p>
            <input type='text' name='name'>
          </label>

          <label>
            <p for='file'>${window.Lang.use("file")}</p>
            <input type='file' name='file'>
          </label>

          <label>
            <input class="btn btn-primary" type='submit' name='createPolicy' value='${window.Lang.use("save")}'>
            <p for='createPolicy'></p>
          </label>

        </form>

      </row>

    </column>
  </row>
</container>

<container class="py-5">
  <row>
    <column class="w-auto surface-clean p-5">

      <row>${window.Lang.use("listOfAllPolicies")}</row>

      <row>

        <table class="x-default">

          <thead>
            <tr>
              <th>${window.Lang.use("name")}</th>
              <th>${window.Lang.use("file")}</th>
              <th>Actions</th>
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
