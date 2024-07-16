import { TTHR } from "/js/modules/datetime/datetime.js";

// Notification card content generator
export function notification_card_generator(notification){
	console.log(notification);
	return `
		<a
			href="/x/notification/${notification["id"]}"
			class="
				min-h-50px w-100 p-1 px-3 d-flex flex-row flex-x-between gap-0-5
				${notification["type"] != null ? `surface-${notification["type"]}` : "bg-2 bs-default"}
				${notification["seen"] == 1 ? "filter-grayscale-90" : ''}
			"
		>
			<p class="w-100 text-size-0-8">${notification["event"]} | ${notification["type"]} | ${notification["sender"]} | ${notification["content"]}</p>
			<p class="w-auto text-size-0-6 text-color-secondary text-nowrap">${TTHR(notification["timestamp"])}</p>
		</a>
	`;
}

export function notification_content_generator(notification){
	return `
		<row class="min-h-50px w-100 p-1 px-3 flex-row flex-x-between gap-0-5 surface-v1">
			<p class="w-100 text-size-0-8">${notification["event"]} | ${notification["type"]} | ${notification["sender"]} | ${notification["content"]}</p>
			<p class="w-auto text-size-0-6 text-color-secondary text-nowrap">${TTHR(notification["timestamp"])}</p>
		</row>
	`;
}
