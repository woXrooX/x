export function before() {
	window.x.Head.set_title("notification_settings");
}

export default function main() {
	return `
		<container class="padding-5 gap-0-5 max-width-1200px">
			<row class="surface-v1 padding-2 flex-row flex-x-between flex-y-center">
				<row class="flex-row gap-0-5 width-auto flex-y-center flex-x-start">
					<x-link go="history:back" class="btn btn-primary"><x-svg name="arrow_back_v1" color="white"></x-svg></x-link>
					<p>${Lang.use("notification_settings")}</p>
				</row>

				<row class="flex-row gap-0-5 width-auto flex-y-center flex-x-end"></row>
			</row>

			<column class="notification_events width-100 gap-0-5 padding-2 surface-v1"></column>
		</container>
	`;
}

export async function after() {
	DOM.build("column.notification_events", async function build_notification_event_togglers_HTML() {
		let disabled_events = await window.x.Request.make({for: "get_disabled_notification_events"});
		if ("data" in disabled_events) disabled_events = disabled_events["data"];
		else disabled_events = [];

		let events = await window.x.Request.make({for: "get_all_events"});
		if("data" in events) events = events["data"];
		else events = {};

		const disabled_events_object = {};
		for (const event of disabled_events) disabled_events_object[event.name] = event;

		let HTML = '';

		for (const event in events) HTML += `
			<row class="flex-row flex-x-between flex-y-center">
				<p class="text-size-0-8">${Lang.use(event+"_notification_event_description")}</p>

				<row class="flex-row width-auto gap-1">
					<input
						type="checkbox"
						class="checkbox-v1"
						${event in disabled_events_object && disabled_events_object[event]["method_in_app"] == 1 ? '' : "checked"}

						XR-post
						XR-for="toggle_disabled_notification_event_method"
						XR-data='{"event": "${event}", "method": "in_app"}'

						x-toast="on:any:message"
					>

					<input
						type="checkbox"
						class="checkbox-v1"
						${event in disabled_events_object && disabled_events_object[event]["method_eMail"] == 1 ? '' : "checked"}

						XR-post
						XR-for="toggle_disabled_notification_event_method"
						XR-data='{"event": "${event}", "method": "eMail"}'

						x-toast="on:any:message"
					>

					<input
						type="checkbox"
						class="checkbox-v1"
						${event in disabled_events_object && disabled_events_object[event]["method_SMS"] == 1 ? '' : "checked"}

						XR-post
						XR-for="toggle_disabled_notification_event_method"
						XR-data='{"event": "${event}", "method": "SMS"}'

						x-toast="on:any:message"
					>
				</row>
			</row>
		`;

		return `
			<row class="flex-row flex-x-between text-weight-bold">
				<p>Events</p>

				<row class="flex-row gap-1 width-auto">
					<p>App</p>
					<p>Email</p>
					<p>SMS</p>
				</row>
			</row>

			${HTML}
		`;
	});
}
