"use strict";


export async function before(){
  const competencyAreas = await window.bridge("competencyPortfolios", {for:"getAllCompetencyAreas"});

  window.pageData.competencyAreasOptions = "";

  // If No "competencyAreas"  In Response Exit
  if(!("competencyAreas" in competencyAreas.data)) return;

  for(const cell of competencyAreas.data.competencyAreas)
    window.pageData.competencyAreasOptions += `<option value="${cell["name"]}">${cell["name"]}</option>`;

}

export const TITLE = window.Lang.use("competencyPortfolio_addTrainingRecord");
export default function content(){

  return `
<container class="py-5">
  <row>
    <column class="w-70 p-5 surface-clean">

      <h1>${window.Lang.use("training_record")}</h1>

      <form action="/competencyPortfolio/addTrainingRecord" for="addTrainingRecord">

        <label>
          <p for='title'>Title of training record</p>
          <input type='text' name='title'>
        </label>

        <label>
          <p for='file'>File</p>
          <input type='file' name='file'>
        </label>

        <container>
          <row class="gap-1">

            <column class="w-50">
              <label>
                <p for='date'>Start date</p>
                <input type='date' name='startDate'>
              </label>
            </column>

            <column class="w-50">
              <label>
                <p for='date'>End date</p>
                <input type='date' name='endDate'>
              </label>
            </column>

          </row>
        </container>

        <label>
          <p for='number'>Number of hours</p>
          <input type='number' name='numberOfHours'>
        </label>

        <label>
          <p for='provider'>Training provider</p>
          <input type='text' name='provider'>
        </label>

        <label>
          <p for='competencyAreas'>Areas of competence</p>
          <select name="competencyAreas">${window.pageData.competencyAreasOptions}</select>
        </label>

        <label>
          <p for='level'>
            Level of competency
            <info id="tooltip_LevelOfCompetency"></info>
            <x-tooltip selector="info#tooltip_LevelOfCompetency">
              <b>Expert</b> - being able to educate others and lead on local or national policy development<br><br>
              <b>Decision maker</b> - making autonomous clinical decisions, including independent prescribing<br><br>
              <b>Literate</b> - able to hold your own in a clinical discussion with a decision-maker<br><br>
              <b>Aware</b> - understands the basics and context of how products are used or conditions managed
            </x-tooltip>
          </p>
          <select name="level">
            <option value="aware">Aware</option>
            <option value="literate">Literate</option>
            <option value="decision_maker">Decision maker</option>
            <option value="expert">Expert</option>
          </select>
        </label>

        <label>
          <p for='description'>Description of the training</p>
          <textarea name="description" rows="5"></textarea>
        </label>

        <label>
          <input class="btn btn-primary" type='submit' name='addTrainingRecord' value='Save'>
          <p for='addTrainingRecord'></p>
        </label>

      </form>

    </column>
  </row>
</container>
  `;

}
