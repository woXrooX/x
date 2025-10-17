import { timestamp_to_human_readable_v1 } from "/JavaScript/modules/datetime/datetime.js";

export function before() { window.x.Head.set_title("notification"); }

export default function main() { return '<container class="padding-5 max-width-1000px"></container>'; }

export async function after() {
	const container = document.querySelector("container");

	Loading.on_element_start(container);
	container.innerHTML = await build_notification_HTML();
	Loading.on_element_end(container);

	async function build_notification_HTML() {
		let notification = await window.bridge({for: "get_notification"});
		if("data" in notification) notification = notification["data"];
		else return `<p class="surface-info width-100 padding-2">${Lang.use("no_notification")}</p>`;

		let label_HTML = "";
		let type_HTML = "";

		if (notification["type"] !== null) {
			label_HTML = `<span class="height-100 radius-default bg-${notification["type"]}" style="width: 5px;"></span>`;

			type_HTML = `
				<x-svg name="type_${notification["type"]}" color="var(--color-${notification["type"]})"></x-svg>
				<p class="text-weight-bold text-transform-uppercase text-size-0-9">${Lang.use(notification["type"])}</p>
			`;
		}

		let content_JSON = {};

		try{ content_JSON = JSON.parse(notification["content_JSON"]); }
		catch(error){}

		return `
			<row class="flex-row gap-0-5 surface-v1 padding-1">
				${label_HTML}

				<column class="flex-y-start width-100">
					<header class="display-flex flex-row flex-x-between flex-y-center width-100">
						<row class="flex-row flex-x-start flex-y-center gap-0-3">${type_HTML}</row>

						<x-svg
							name="delete"
							color="white"
							class="btn btn-error"

							XR-post
							XR-for="delete_notification"

							x-toast="on:any:message"
						></x-svg>
					</header>

					<main class="display-flex flex-column gap-1 text-size-0-8">${Lang.use(notification["event"]+"_in_app_m").x_format({
						"recipient": notification["recipient"],
						"sender": notification["sender"],
						"content_TEXT": notification["content_TEXT"],
						...content_JSON
					})}</main>

					<footer class="width-100 display-flex flex-row flex-x-end">
						<p class="width-auto text-size-0-7 text-color-secondary white-space-nowrap-important">${timestamp_to_human_readable_v1(notification["timestamp"])}</p>
					</footer>
				</column>
			</row>
		`;
	}
}
