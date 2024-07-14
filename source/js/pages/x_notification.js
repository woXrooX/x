export const TITLE = window.Lang.use("notification");

export default function main(){return '<container class="p-5 max-w-1000px"></container>';}

export async function after(){
	const container = document.querySelector("container");

	Loading.on_element(container);
	container.innerHTML = await build_notification_HTML();
	Loading.on_element(container);

	async function build_notifications_HTML(){
		let notification = await window.bridge({for: "get_all_notifications"});
		if("data" in notification) notification = notification["data"];
		else return `<p class="w-100 text-size-0-8 surface-info p-1">${Lang.use("no_notification")}</p>`;

		let HTML = "";
		for(const notification of notifications) HTML += Notifications_module.NCG(notification);

		return HTML;
	}
}
