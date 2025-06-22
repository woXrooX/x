import { timestamp_to_human_readable_v1, timestamp_to_human_readable_v2 } from "/JavaScript/modules/datetime/datetime.js";

// in_app_s
export async function notification_s_card_generator(notification){
	let content_JSON = {};
	try{
		content_JSON = JSON.parse(notification["content_JSON"]);
		if("timestamp" in content_JSON) content_JSON["timestamp"] = new Date(content_JSON["timestamp"]).toLocaleDateString('en-GB');
	}
	catch(error){}

	return `
		<a
			href="/x/notification/${notification["id"]}"
			class="
				min-height-50px width-100 padding-1 padding-x-2 display-flex flex-row flex-x-between gap-0-5
				${notification["type"] != null ? `surface-${notification["type"]}` : "bg-2 bs-default"}
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

// in_app_m
export async function notification_m_card_generator(notification){
	let label_HTML = "";
	let type_HTML = "";
	if(notification["type"] !== null){
		label_HTML = `<span class="height-100 radius-default bg-${notification["type"]}" style="width: 5px;"></span>`;
		type_HTML = `
			<x-svg name="type_${notification["type"]}" color="var(--color-${notification["type"]})"></x-svg>
			<p class="text-weight-bold text-transform-uppercase text-size-0-9">${Lang.use(notification["type"])}</p>
		`;
	}

	let content_JSON = {};
	try{content_JSON = JSON.parse(notification["content_JSON"]);}
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
