"use strict";

export const TITLE = window.Lang.use("feedbacks");

export async function before(){

	window.pageData.feedbacksHTML = "";

	// Get All Users
	let feedbacks = await window.bridge("feedbacks", {for:"getAllFeedbacks"}, "application/json");

	// Check If Data Exists
	if(!!feedbacks["data"] === false){
	  window.pageData.feedbacksHTML = `
		<tr>
		  <td>No records to show</td>
		</tr>
	  `;
	  return;
	}


	for(let feedback of feedbacks["data"]){
		let feedbackData = feedback["feedback_text"];
		if(feedbackData.length > 10)
			feedbackData = `
				<x-modal trigger="click" type="text" value="${feedback["feedback_text"].slice(0, 10)}...">
					<p class="text-size-0-8 p-2">${feedback["feedback_text"]}</p>
				</x-modal>
			`;


		window.pageData.feedbacksHTML += `
			<tr>
				<td>${feedback["user_name"]}</td>
				<td>${feedback["eMail"]}</td>
				<td>${feedbackData}</td>
				<td>${feedback["feedback_left_page"] || "N/A"}</td>
				<td>${feedback["timestamp"]}</td>

				<td>
					<form action="feedbacks" for="delete">
						<input type="hidden" name="id" value="${feedback["id"]}">
						<button class="btn btn-primary" type="submit" name='delete'><x-icon color="white" name="trash"></x-icon></button>
					</form>
				</td>
			</tr>
		`;
	}
  }

export default function content(){
	return `
		<container class="home p-5">
			<column>
				<table class="x-default">

					<thead>
						<tr>
							<th>${window.Lang.use("name")}</th>
							<th>${window.Lang.use("eMail")}</th>
							<th>Feedback text</th>
							<th>Page</th>
							<th>${window.Lang.use("timestamp")}</th>
							<th>Actions</th>
						</tr>
					</thead>

					<tbody>${window.pageData.feedbacksHTML}</tbody>
				</table>
			</column>
		</container>
	`;
}
