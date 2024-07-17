import { TTHR } from "/js/modules/datetime/datetime.js";

// Notification card content generator
export function notification_card_generator(notification){
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
	const ICONS = {
		"success": "done_circle",
		"info": "info_circle",
		"warning": "warning_triangle",
		"important": "important",
		"error": "error_hexagon",
		"urgent": "hourglass_over"
	}
	
	let color_line = "";
	let type_info = "";
	if(notification["type"] !== null){
		color_line = `<span class="w-5px h-100 radius-default bg-${notification["type"]}"></span>`;
		type_info = `
			<row class="flex-row flex-x-start flex-y-center">
				<x-svg name="${ICONS[notification["type"]]}" color="var(--color-${notification["type"]})"></x-svg>
				<p class="text-weight-bold text-transform-uppercase">${Lang.use(notification["type"])}</p>
			</row>
		`;
	}

	return `
		<row class="flex-row gap-0-5 surface-v1 p-2">
			${color_line}

			<column class="flex-y-start w-100 gap-0-5">	
				<header class="d-flex flex-row flex-x-between flex-y-center w-100">
					${type_info}

					<x-svg
						name="delete"
						color="white"
						class="btn btn-error btn-s"
						
						xr-post
						xr-for="delete_notification"

						x-toast="on:any:message"
					></x-svg>
				</header>

				<main>
					${notification["event"]} |
					${notification["type"]} |
					${notification["sender"]} |
					${notification["recipient"]} |
					${notification["content"]}
				</main>
				
				<footer class="w-100 d-flex flex-row flex-x-end">
					<p class="w-auto text-size-0-6 text-color-secondary text-nowrap">${TTHR(notification["timestamp"])}</p>
				</footer>
			</column>	
		</row>
	`;
}
