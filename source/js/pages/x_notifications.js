import { TTHR } from "/js/modules/datetime/datetime.js";

export const TITLE = window.Lang.use("notifications");

export default function main(){
	return '<container class="p-5 gap-0-5 max-w-1000px"></container>';
}

export async function after(){
	const container = document.querySelector("container");

	Loading.on_element(container);
	container.innerHTML += await notifications_HTML();
	Loading.on_element(container);

	async function notifications_HTML(){
		let notifications = await window.bridge({for: "get_all_notifications"});
		if("data" in notifications) notifications = notifications["data"];
		else return `<p class="w-100 text-size-0-8 surface-info p-1">${Lang.use("notification_does_not_exist")}</p>`;

		let HTML = "";
		for(const notification of notifications)
			HTML += `
				<a href="/x/notification/${notification["id"]}" class="w-100 p-2 d-flex flex-column flex-y-end surface-${notification['type']}">
					<p class="w-100">${notification['content']}</p>
					<p class="text-size-0-6">${TTHR(notification["timestamp"])}</p>
				</a>
			`;
		return HTML;
	}
}
