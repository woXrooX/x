"use strict";

import {trainingExpiryUIBuilder} from "../modules/helpers.js";

export const TITLE = window.Lang.use("trainingsMatrix");

export async function before(){
	////// getAllData
	let data = await window.bridge("trainingsMatrix", {for:"getAllData"}, "application/json");
	window.pageData.trainingsHtml = ``;

	// Create Training Names
	for(let training of data["data"]["trainings"])
		window.pageData.trainingsHtml += `
			<th>
				<p style="width: 300px;">${training["name"]}</p>
				<p>${training["validity_duration"]} month(s)</p>
			</th>
		`;

	// Create User Names
	window.pageData.usersHtml = ``;

  	// Go Through Each User
	for(let user of data["data"]["users"]){
		let userPassedTrainings = ``;

		// Go Through Each Training And Check If User Passed Or Not
		for(let training of data["data"]["trainings"]){
			// By Default Not Passed
			let isUserPassed = `
				<td style="background-color:var(--color-error);" class="px-2">
					<row class="flex-x-between">
					<p class="p-2 radius-default">Missing</p>
					<x-modal trigger="click" button type="icon" icon-color="white" value="upload">
						<form action="trainingsMatrix" for="passTrainingForUser" enctype="multipart/form-data" class="p-2" x-modal-action="hide">
							<h1 style="text-align:center;">${training["name"]}</h1>

							<input type="hidden" name="user" value="${user["id"]}">
							<input type="hidden" name="training" value="${training["id"]}">

							<label>
								<p for="certificateCompletionDate">Enter training completion date</p>
								<input type="date" name="certificateCompletionDate">
							</label>

							<label>
								<p for="certificate">Upload training certificate</p>
								<input type="file" name="certificate">
							</label>

							<label>
								<input class="btn btn-primary" type="submit" name="passTrainingForUser" value="upload">
								<p for="passTrainingForUser"></p>
							</label>
						</form>
					</x-modal>
					</row>
				</td>
			`;

			for(const userPassedTraining of data["data"]["usersPassedTrainings"])
				if(userPassedTraining["user"] == user["id"] && userPassedTraining["training"] == training["id"])
					isUserPassed = trainingExpiryUIBuilder(userPassedTraining["certificateCompletionDate"], training["validity_duration"], userPassedTraining["user"], userPassedTraining["certificate"]);

			userPassedTrainings += isUserPassed;
		}

		window.pageData.usersHtml += `
			<tr>
				<td><p style="width: 200px">${user["firstname"]} ${user["lastname"]}</p></td>
				${userPassedTrainings}
			</tr>
		`;
	}
}

export default function content(){

	return `
		<container class="p-5 gap-1">

			<h1>${window.Lang.use("trainingsMatrix")}</h1>

			<column class="w-90 surface-clean p-5">

				<table class="scrollbar-x x-default max-vw-90">

					<thead>
						<tr>
						<th>${window.Lang.use("name")}</th>
						${window.pageData.trainingsHtml}
						</tr>
					</thead>

					<tbody>${window.pageData.usersHtml}</tbody>

				</table>

			</column>

		</container>
	`;
}
