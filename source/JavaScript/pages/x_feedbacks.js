export function before(){
	window.x.Head.set_title("feedbacks");
}

export default function main(){ return `<container class="padding-5 max-width-1500px"></container>`; }

export async function after(){
	const container = document.querySelector("container");

	Loading.on_element_start(container);
	container.innerHTML = await build_feedbacks_HTML();
	Loading.on_element_end(container);

	async function build_feedbacks_HTML(){
		let feedbacks = await window.x.Request.make({for:"get_all_feedbacks"});
		if("data" in feedbacks) feedbacks = feedbacks["data"];
		else return `<p class="surface-info width-100 padding-2">No feedback</p>`;

		let HTML = '';

		for(let feedback of feedbacks) {
			let feedback_text = feedback["feedback_text"];
			if(feedback_text.length > 10) feedback_text = `
				<span id="modal_feedback_${feedback["id"]}">${feedback["feedback_text"].slice(0, 10)}...</span>
				<x-modal trigger_selector="span#modal_feedback_${feedback["id"]}">
					<p class="text-size-0-8 padding-2">${feedback["feedback_text"]}</p>
				</x-modal>
			`;

			HTML += `
				<tr>
					<td>${feedback["id"]}</td>
					<td>${feedback["created_by_user"] ?? "N/A"}</td>
					<td>${feedback["created_by_user"] != null ? feedback["users_fullname"] : feedback["fullname"]}</td>
					<td>${feedback["eMail"] || "N/S"}</td>
					<td>${feedback_text}</td>
					<td>${feedback["feedback_left_page"] || "N/A"}</td>
					<td>${feedback["timestamp"]}</td>

					<td>
						<x-svg id="modal_XR_delete_${feedback["id"]}" name="delete" class="btn btn-error" color="white"></x-svg>
						<x-modal trigger_selector="x-svg#modal_XR_delete_${feedback["id"]}">
							<column class="gap-1 padding-2">
								<p class="text-align-center text-size-1-2">Are you sure you want to delete this feedback?</p>

								<button
									XR-post
									XR-for="delete"
									XR-data='{"id": "${feedback["id"]}"}'

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
			<section class="table-container width-100">
				<table>
					<caption>${Lang.use("feedbacks")}</caption>
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
			</section>
		`;
	}
}
