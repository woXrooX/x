export const TITLE = window.Lang.use("feedbacks");

export default function main(){return `<container class="p-5 max-w-1500px"></container>`;}

export async function after(){
	const container = document.querySelector("container");

	Loading.on_element(container);
	container.innerHTML = await build_feedbacks_HTML();
	Loading.on_element(container);

	async function build_feedbacks_HTML(){
		let feedbacks = await window.bridge({for:"get_all_feedbacks"});
		if("data" in feedbacks) feedbacks = feedbacks["data"];
		else return `<p class="w-100 text-size-0-8 surface-info p-1">No feedbacks</p>`;

		let HTML = '';

		for(let feedback of feedbacks){
			let feedback_text = feedback["feedback_text"];
			if(feedback_text.length > 10) feedback_text = `
				<span id="modal_feedback_${feedback["id"]}">${feedback["feedback_text"].slice(0, 10)}...</span>
				<x-modal trigger_selector="span#modal_feedback_${feedback["id"]}">
					<p class="text-size-0-8 p-2">${feedback["feedback_text"]}</p>
				</x-modal>
			`;

			HTML += `
				<tr>
					<td>${feedback["created_by_user"] ?? "N/A"}</td>
					<td>${feedback["created_by_user"] != null ? feedback["users_fullname"] : feedback["fullname"]}</td>
					<td>${feedback["created_by_user"] != null ? feedback["users_eMail"] : feedback["eMail"]}</td>
					<td>${feedback_text}</td>
					<td>${feedback["feedback_left_page"] || "N/A"}</td>
					<td>${feedback["timestamp"]}</td>

					<td>
						<x-svg
							xr-post
							xr-for="delete"
							xr-data='{"id": "${feedback["id"]}"}'

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
			<column class="w-100 surface-v1 p-1">
				<table class="table-v1 table-zebra table-hover table-bordered">
					<caption>${Lang.use("feedbacks")}</caption>
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
			</column>
		`;
	}
}
