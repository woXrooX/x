import { timestamp_to_human_readable_v1 } from "/JavaScript/modules/datetime/datetime.js";

export function before() { window.x.Head.set_title("notification"); }

export default function main() {
	return `
		<container class="padding-5 gap-0-5 max-width-1200px">
			<row class="surface-v1 padding-2 flex-row flex-x-between flex-y-center">
				<row class="flex-row gap-0-5 width-auto flex-y-center flex-x-start">
					<x-link go="history:back" class="btn btn-primary"><x-svg name="arrow_back_v1" color="white"></x-svg></x-link>
					<p>${window.Lang.use("notification")}</p>
				</row>

				<row class="flex-row gap-0-5 width-auto flex-y-center flex-x-end">
					${build_modal_XR_delete_notification_HTML()}
				</row>
			</row>

			<row class="notification flex-row gap-0-5 surface-v1 padding-2"></row>
		</container>
	`;

	function build_modal_XR_delete_notification_HTML() {
		return `
			<x-svg id="modal_delete_notifications" name="delete" class="btn btn-error" color="white"></x-svg>
			<x-tooltip trigger_selector="x-svg#modal_delete_notifications" class="padding-1 text-size-0-6">Delete notification</x-tooltip>
			<x-modal trigger_selector="x-svg#modal_delete_notifications">
				<column class="gap-1 padding-2">
					<p class="text-align-center text-size-1-2">Are you sure you want to delete this notification?</p>

					<button
						XR-post
						XR-for="delete_notification"

						x-toast="on:any:message"

						x-modal="on:success:hide"

						class="btn btn-error"
					>Yes, delete!</button>
				</column>
			</x-modal>
		`;
	}
}

export async function after() {
	DOM.build("row.notification", async function build_notification_HTML() {
		let notification = await window.x.Request.make({for: "get_notification"});
		if ("data" in notification) notification = notification["data"];
		else return `<p class="surface-info width-100 padding-2">${Lang.use("no_notification")}</p>`;

		let content_JSON = {};

		try { content_JSON = JSON.parse(notification["content_JSON"]); }
		catch(error) {}

		return `
			${notification["type"] !== null ? `<span class="height-100 radius-default bg-${notification["type"]} width-5px"></span>` : ''}

			<column class="align-items-flex-start width-100 gap-0-5 text-size-0-8">
				${
					Lang.use(notification["event"]+"_in_app_m").x_format({
						"recipient": notification["recipient"],
						"sender": notification["sender"],
						"content_TEXT": notification["content_TEXT"],
						...content_JSON
					})
				}

				<row class="flex-row flex-x-end text-size-0-7 text-color-secondary">${timestamp_to_human_readable_v1(notification["timestamp"])}</row>
			</column>
		`;
	});
}
