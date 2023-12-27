"use strict";

export const TITLE = window.Lang.use("trainingsManagement");

export async function before(){
  window.pageData.trainingsHtml = "";

  // Get All Trainings
  let trainings = await window.bridge("trainingsManagement", {for:"getAllTrainings"});

  // Check If Data Is Retrived
  if(!!trainings["data"] === false) return;

  for(let training of trainings["data"]){

    // Training Roles
    let roles = "Not assigned";

    if(training["roles_list"] !== null){
      roles = "";

      let rolesList = training["roles_list"].split(", ");

      for(let i = 0; i < rolesList.length; i++){
        let comma = i != 0 ? ", " : "";
        roles += comma + window.Lang.use(rolesList[i]);

      }

    }


    //// Roles Checkboxes
    let rolesCheckboxes = "";
    for(const role in window.USER_ROLES){
      // Skip X Roles
      if([1, 2, 3].includes(window.USER_ROLES[role]["id"])) continue;

      rolesCheckboxes += `
        <label>
          <input type='checkbox' name="roles" value='${role}' ${training["roles_list"] !== null && training["roles_list"].includes(role) ? "checked" : ''}>
          ${window.Lang.use(role)}
        </label>
      `;

    }

    window.pageData.trainingsHtml += `
      <tr>
        <td><a href="${training["link"]}" target="_blank">${training["name"]}</a></td>
        <td>${training["validity_duration"]}</td>
        <td>${roles}</td>
        <td>
          <row class="gap-0-5">

            <x-modal trigger="click" button type="icon" icon-color="icon" value="vertical_dots">
              <form action="trainingsManagement" for="update" class="p-2" x-modal-action="hide">

                <label>
                  <p for='name'>${window.Lang.use("name")}</p>
                  <input type='text' name='name' value='${training["name"]}'>
                </label>

                <label>
                  <p for='link'>${window.Lang.use("link")}</p>
                  <input type='text' name='link' value='${training["link"]}'>
                </label>

                <label>
                  <p for='validityDuration'>Validity duration (Months)</p>
                  <input type='number' step="1" name='validityDuration' value='${training["validity_duration"]}'>
                </label>

                <fieldset for='roles'>
                  <legend>Whom</legend>
                  ${rolesCheckboxes}
                </fieldset>

                <input type="hidden" name="id" value="${training["id"]}">

                <label>
                  <input class="btn btn-primary" type='submit' name='update' value='${window.Lang.use("update")}'>
                  <p for='update'></p>
                </label>

              </form>
            </x-modal>

            <column>
              <form action="trainingsManagement" for="deleteTraining">
                <input type="hidden" name="id" value="${training["id"]}">
                <button class="btn btn-primary" type="submit"><x-icon name="trash" color="white"></x-icon></button>
              </form>
            </column>

          </row>
        </td>
      </tr>
    `;
  }

}

export default function content(){

  const dom = `
    <container class="my-5">
      <row>
        <column class="w-auto surface-clean p-5">

          <row>${window.Lang.use("createTraining")}</row>

          <row>

            <form action="trainingsManagement" for='createTraining'>

              <label>
                <p for='name'>${window.Lang.use("name")}</p>
                <input type='text' name='name'>
              </label>

              <label>
                <p for='link'>${window.Lang.use("link")}</p>
                <input type='text' name='link'>
              </label>

              <label>
                <p for='validityDuration'>Validity duration (Months)</p>
                <input type='number' step="1" name='validityDuration'>
              </label>

              <fieldset for='roles'>

                <legend>Whom</legend>

                <label>
                  <input type='checkbox' name="roles" value='administrative'>
                  Administrative
                </label>

                <label>
                  <input type='checkbox' name="roles" value='managerial'>
                  Managerial
                </label>

                <label>
                  <input type='checkbox' name="roles" value='clinical'>
                  Clinical
                </label>

              </fieldset>

              <label>
                <input class="btn btn-primary" type='submit' name='createTraining' value='${window.Lang.use("add")}'>
                <p for='createTraining'></p>
              </label>

            </form>

          </row>

        </column>
      </row>
    </container>

    <container>
      <row>
        <column class="w-auto surface-clean p-5 my-5">

          <row>${window.Lang.use("listOfAllTrainings")}</row>

          <row>

            <table class="x-default">

              <thead>
                <tr>
                  <th>${window.Lang.use("name")} / ${window.Lang.use("link")}</th>
                  <th>Validity duration (Months)</td>
                  <th>Roles</th>
                  <th>Actions</td>
                </tr>
              </thead>

              <tbody>
                ${window.pageData.trainingsHtml}
              </tbody>

            </table>

          </row>

        </column>
      </row>
    </container>
  `;

  return dom;

}
