export function before(){
	window.x.Head.set_title("notifications_settings");
}

export default function main(){ return '<container class="padding-5 gap-0-5 max-width-1000px"></container>'; }

export async function after(){
	const container = document.querySelector("container");

	Loading.on_element_start(container);
	container.insertAdjacentHTML("beforeend", await build_notification_event_togglers_HTML());
	Loading.on_element_end(container);

	async function build_notification_event_togglers_HTML(){
		let disabled_event_names = await window.bridge({for: "get_disabled_event_names"});
		if("data" in disabled_event_names) disabled_event_names = disabled_event_names["data"].split(", ");
		else disabled_event_names = [];

		let all_event_names = await window.bridge({for: "get_all_event_names"});
		if("data" in all_event_names) all_event_names = all_event_names["data"];
		else all_event_names = [];


		let HTML = '';

		for (const event in all_event_names) HTML += `
			<row class="flex-row flex-x-between flex-y-center">
				<p class="text-size-0-8">${Lang.use(event+"_event_description")}</p>

				<input
					type="checkbox"
					class="checkbox-v1"
					${!disabled_event_names.includes(event) ? "checked" : ''}

					XR-post
					XR-for="toggle_disabled_notification_event"
					XR-data='{"event": "${event}"}'

					x-toast="on:any:message"
				>
			</row>
		`;

		return `
			<row class="flex-x-start">
				<x-svg
					name="arrow_left"
					color="white"
					onclick="history.back()"
					class="btn btn-primary"
				></x-svg>
			</row>

			<column class="width-100 surface-v1 padding-2 gap-1">${HTML}</column>
		`;
	}
}
