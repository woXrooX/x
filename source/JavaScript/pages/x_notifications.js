import { timestamp_to_human_readable_v2 } from "/JavaScript/modules/datetime/datetime.js";

export function before() { window.x.Head.set_title("notifications"); }

export default function main() { return `<container class="padding-5 gap-0-5 max-width-1200px"></container>`; }

export async function after() {
	const container = document.querySelector("container");

	Loading.on_element_start(container);
	container.insertAdjacentHTML("beforeend", `
		${build_actions_row_HTML()}
		${await build_notifications_HTML()}
	`);
	Loading.on_element_end(container);

	function build_actions_row_HTML() {
		return `
			<row class="flex-row flex-x-end gap-0-5 padding-2">
				${build_delete_all_button_HTML()}
				${build_anchor_notificatons_settings_HTML()}
			</row>
		`;

		function build_delete_all_button_HTML() {
			return `
				<x-svg id="modal_delete_all_notifications" name="delete" class="btn btn-error" color="white"></x-svg>
				<x-modal trigger_selector="x-svg#modal_delete_all_notifications">
					<column class="gap-1 padding-2">
						<p class="text-align-center text-size-1-2">Are you sure you want to delete all notifications?</p>

						<button
							XR-post
							XR-for="delete_all_notifications"

							x-toast="on:any:message"

							x-modal="on:success:hide"

							class="btn btn-error"
						>Yes, delete!</button>
					</column>
				</x-modal>
			`;
		}

		function build_anchor_notificatons_settings_HTML() {
			if (!("x_notifications_settings" in window.CONF["pages"])) return '';

			return `<a href="/x/notifications/settings" class="btn btn-primary"><x-svg name="gear" color="white"></x-svg></a>`;
		}
	}

	async function build_notifications_HTML(){
		let notifications = await window.bridge({for: "get_all_notifications"});
		if("data" in notifications) notifications = notifications["data"];
		else return `<p class="surface-info width-100 padding-2">${Lang.use("no_notifications")}</p>`;

		let HTML = '';

		for (const notification of notifications) HTML += build_notification_HTML(notification);

		return HTML;

		function build_notification_HTML(notification) {
			let content_JSON = {};

			try { content_JSON = JSON.parse(notification["content_JSON"]); }
			catch(error){}

			return `
				<a
					href="/x/notification/${notification["id"]}"
					class="
						min-height-50px width-100 padding-1 padding-x-2 display-flex flex-row flex-x-between gap-0-5
						${notification["type"] != null ? `surface-${notification["type"]}` : "bg-2 box-shadow-v0"}
						${notification["seen"] == 1 ? "filter_grayscale_90" : ''}
					"
				>
					<p class="width-100 text-size-0-8">${Lang.use(notification["event"]+"_in_app_s").x_format({
						"recipient": notification["recipient"],
						"sender": notification["sender"],
						"content_TEXT": notification["content_TEXT"],
						...content_JSON
					})}</p>
					<p class="width-auto text-size-0-6 text-color-secondary white-space-nowrap-important">${timestamp_to_human_readable_v2(notification["timestamp"])}</p>
				</a>
			`;
		}
	}
}
