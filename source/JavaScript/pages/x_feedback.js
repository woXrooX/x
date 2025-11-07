export function before(){
	window.x.Head.set_title("feedback");
}

export default function main(){ return `<container class="padding-5 max-width-1500px"></container>`; }

export async function after(){
	const container = document.querySelector("container");

	Loading.on_element_start(container);
	container.innerHTML = await build_feedback_HTML();
	Loading.on_element_end(container);

	async function build_feedback_HTML(){
		let feedback = await window.x.Request.make({for:"get_all_feedback"});
		if("data" in feedback) feedback = feedback["data"];
		else return `<p class="surface-info width-100 padding-2">No feedback</p>`;

		let HTML = '';

		for(let cell of feedback){
			let feedback_text = cell["feedback_text"];
			if(feedback_text.length > 10) feedback_text = `
				<span id="modal_feedback_${cell["id"]}">${cell["feedback_text"].slice(0, 10)}...</span>
				<x-modal trigger_selector="span#modal_feedback_${cell["id"]}">
					<p class="text-size-0-8 padding-2">${cell["feedback_text"]}</p>
				</x-modal>
			`;

			HTML += `
				<tr>
					<td>${cell["id"]}</td>
					<td>${cell["created_by_user"] ?? "N/A"}</td>
					<td>${cell["created_by_user"] != null ? cell["users_fullname"] : cell["fullname"]}</td>
					<td>${cell["eMail"] || "N/S"}</td>
					<td>${feedback_text}</td>
					<td>${cell["feedback_left_page"] || "N/A"}</td>
					<td>${cell["timestamp"]}</td>

					<td>
						<x-svg id="modal_XR_delete_${cell["id"]}" name="delete" class="btn btn-error" color="white"></x-svg>
						<x-modal trigger_selector="x-svg#modal_XR_delete_${cell["id"]}">
							<column class="gap-1 padding-2">
								<p class="text-align-center text-size-1-2">Are you sure you want to delete this feedback?</p>

								<button
									XR-post
									XR-for="delete"
									XR-data='{"id": "${cell["id"]}"}'

									x-toast="on:any:message"

									x-modal="on:success:hide"

									class="btn btn-error"
								>Yes, delete!</button>
							</column>
						</x-modal>

					</td>
				</tr>
			`;
		}

		return `
			<div class="scrollbar-x width-100 surface-v1 padding-1">
				<table class="table-v1 table-zebra table-hover table-bordered">
					<caption>${Lang.use("feedback")}</caption>
					<thead>
						<tr>
							<th>Feedback ID</th>
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
