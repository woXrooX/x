import { TTHR } from "/js/modules/datetime/datetime.js";

// Small card
export async function notification_s_card_generator(notification){
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

// Medium card
export async function notification_m_card_generator(notification){
	let label_HTML = "";
	let type_HTML = "";
	if(notification["type"] !== null){
		label_HTML = `<span class="h-100 radius-default bg-${notification["type"]}" style="width: 5px;"></span>`;
		type_HTML = `
			<x-svg name="type_${notification["type"]}" color="var(--color-${notification["type"]})"></x-svg>
			<p class="text-weight-bold text-transform-uppercase text-size-0-9">${Lang.use(notification["type"])}</p>
		`;
	}

	return `
		<row class="flex-row gap-0-5 surface-v1 p-1">
			${label_HTML}

			<column class="flex-y-start w-100">
				<header class="d-flex flex-row flex-x-between flex-y-center w-100">
					<row class="flex-row flex-x-start flex-y-center gap-0-3">${type_HTML}</row>

					<x-svg
						name="delete"
						color="white"
						class="btn btn-error"

						xr-post
						xr-for="delete_notification"

						x-toast="on:any:message"
					></x-svg>
				</header>

				<main class="text-size-0-8">${notification["event"]} | ${notification["type"]} | ${notification["sender"]} | ${notification["recipient"]} | ${notification["content"]}</main>

				<footer class="w-100 d-flex flex-row flex-x-end">
					<p class="w-auto text-size-0-7 text-color-secondary text-nowrap">${TTHR(notification["timestamp"])}</p>
				</footer>
			</column>
		</row>
	`;
}
