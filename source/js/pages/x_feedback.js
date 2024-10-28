export const TITLE = window.Lang.use("feedback");

export default function main(){return `<container class="p-5 max-w-1500px"></container>`;}

export async function after(){
	const container = document.querySelector("container");

	Loading.on_element(container);
	container.innerHTML = await build_feedback_HTML();
	Loading.on_element(container);

	async function build_feedback_HTML(){
		let feedback = await window.bridge({for:"get_all_feedback"});
		if("data" in feedback) feedback = feedback["data"];
		else return `<p class="w-100 text-size-0-8 surface-info p-1">No feedback</p>`;

		let HTML = '';

		for(let cell of feedback){
			let feedback_text = cell["feedback_text"];
			if(feedback_text.length > 10) feedback_text = `
				<span id="modal_feedback_${cell["id"]}">${cell["feedback_text"].slice(0, 10)}...</span>
				<x-modal trigger_selector="span#modal_feedback_${cell["id"]}">
					<p class="text-size-0-8 p-2">${cell["feedback_text"]}</p>
				</x-modal>
			`;

			HTML += `
				<tr>
					<td>${cell["created_by_user"] ?? "N/A"}</td>
					<td>${cell["created_by_user"] != null ? cell["users_fullname"] : cell["fullname"]}</td>
					<td>${cell["created_by_user"] != null ? cell["users_eMail"] : cell["eMail"]}</td>
					<td>${feedback_text}</td>
					<td>${cell["feedback_left_page"] || "N/A"}</td>
					<td>${cell["timestamp"]}</td>

					<td>
						<x-svg
							xr-post
							xr-for="delete"
							xr-data='{"id": "${cell["id"]}"}'

							x-toast="on:any:message"

							name="delete"
							color="white"

							class="btn btn-error"
						></x-svg>
					</td>
				</tr>
			`;
		}

		return `
			<div class="scrollbar-x w-100 surface-v1 p-1">
				<table class="table-v1 table-zebra table-hover table-bordered">
					<caption>${Lang.use("feedback")}</caption>
					<thead>
						<tr>
							<th>User ID</th>
							<th>${window.Lang.use("fullname")}</th>
							<th>${window.Lang.use("eMail")}</th>
							<th>Feedback text</th>
							<th>Page</th>
							<th>${window.Lang.use("timestamp")}</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>${HTML}</tbody>
				</table>
			</div>
		`;
	}
}
