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
		let disabled_events = await window.bridge({for: "get_disabled_events"});
		if("data" in disabled_events) disabled_events = disabled_events["data"];
		else disabled_events = [];

		let events = await window.bridge({for: "get_all_events"});
		if("data" in events) events = events["data"];
		else events = {};

		const disabled_events_obj = {};
		for (const event of disabled_events) disabled_events_obj[event.name] = event;

		let HTML = '';

		for (const event in events) HTML += `
			<row class="flex-row flex-x-between flex-y-center">
				<p class="text-size-0-8">${Lang.use(event+"_event_description")}</p>

				<row class="flex-row width-auto gap-1">
					<input
						type="checkbox"
						class="checkbox-v1"
						${event in disabled_events_obj && disabled_events_obj[event]["via_in_app"] == 1 ? '' : "checked"}

						XR-post
						XR-for="toggle_notification_method"
						XR-data='{"event": "${event}", "method": "in_app"}'

						x-toast="on:any:message"
					>

					<input
						type="checkbox"
						class="checkbox-v1"
						${event in disabled_events_obj && disabled_events_obj[event]["via_eMail"] == 1 ? '' : "checked"}

						XR-post
						XR-for="toggle_notification_method"
						XR-data='{"event": "${event}", "method": "eMail"}'

						x-toast="on:any:message"
					>

					<input
						type="checkbox"
						class="checkbox-v1"
						${event in disabled_events_obj && disabled_events_obj[event]["via_SMS"] == 1 ? '' : "checked"}

						XR-post
						XR-for="toggle_notification_method"
						XR-data='{"event": "${event}", "method": "SMS"}'

						x-toast="on:any:message"
					>
				</row>
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

			<column class="width-100 surface-v1 padding-2 gap-1">
				<row class="flex-row flex-x-between text-weight-bold">
					<p>Events</p>

					<row class="flex-row gap-1 width-auto">
						<p>in_app</p>
						<p>eMail</p>
						<p>SMS</p>
					</row>
				</row>

				${HTML}
			</column>
		`;
	}
}
