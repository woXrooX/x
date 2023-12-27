"use strict";

import {trainingExpiryUIBuilder} from "../modules/helpers.js";

export const TITLE = window.Lang.use("trainings");

export async function before(){
  // Get All Trainings
  let trainings = await window.bridge("trainings", {for:"getAllTrainings"});

  // Check If Data Exists
  if(!!trainings["data"] === false){
    window.pageData.trainingsHtml = `
      <tr>
        <td>No records to show</td>
      </tr>
    `;
    return;
  }

  window.pageData.trainingsHtml = "";

  console.log(trainings);

  for(let training of trainings["data"]){
    let formToPassHtml = `
      <h1 style="text-align:center;">${training["name"]}</h1>

      <input type="hidden" name="id" value="${training["id"]}">

      <label>
        <p for="certificateCompletionDate">Enter training completion date</p>
        <input type="date" name="certificateCompletionDate">
      </label>

      <label>
        <p for="certificate">Upload training certificate</p>
        <input type="file" name="certificate">
      </label>

      <label>
        <input class="btn btn-primary" type="submit" name="passTraining" value="upload">
        <p for="passTraining"></p>
      </label>
    `;

    let formToPassHtmlModal = `
      <x-modal trigger="click" button type="icon" icon-color="white" value="upload">
        <form action="trainings" for="passTraining" enctype="multipart/form-data" class="p-2" x-modal-action="hide">
          ${formToPassHtml}
        </form>
      </x-modal>
    `;

    let formToRePassHtmlModal = `
      <x-modal trigger="click" button type="icon" icon-color="white" value="refresh">
        <form action="trainings" for="passTraining" enctype="multipart/form-data" class="p-2" x-modal-action="hide">
          <input type="hidden" name="rePass">
          ${formToPassHtml}
        </form>
      </x-modal>
    `;

    window.pageData.trainingsHtml += `
      <tr>
        <td><a href="${training["link"]}" target="_blank">${training["name"]}</a></td>
        <td><b>Training valid for: </b>${training["validity_duration"]} month(s)</td>
        ${trainingExpiryUIBuilder(training["user_passed_certificate_date"], training["validity_duration"], training["user"], training["user_passed_certificate"])}
        <td>${!!training["user"] ? formToRePassHtmlModal : formToPassHtmlModal}</td>
      </tr>
    `;
  }
}

export default function content(){

  return `
    <form action="trainings" for="passTraining" id="formPassTraining"></form>

    <container class="my-5">

      <row>

        <column class="w-auto surface-clean p-5">

          <row>${window.Lang.use("listOfAllTrainings")}</row>

          <row>

            <table class="x-default">

              <thead>
                <tr>
                  <th>${window.Lang.use("name")} / Link</th>
                  <th>Frequency</th>
                  <th>Status</th>
                  <th>Action</th>
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
}
