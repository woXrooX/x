export const TITLE = window.Lang.use("notifications");

export default function main(){return '<container class="p-5 gap-0-5 max-w-1000px"></container>';}

export async function after(){
	const container = document.querySelector("container");

	Loading.on_element(container);
	container.innerHTML = await build_notifications_HTML();
	Loading.on_element(container);

	async function build_notifications_HTML(){
		let notifications = await window.bridge({for: "get_all_notifications"});
		if("data" in notifications) notifications = notifications["data"];
		else return `<p class="w-100 text-size-0-8 surface-info p-1">${Lang.use("no_notifications")}</p>`;

		let Notifications_module;

		try{
			Notifications_module = await import("/js/modules/Notifications.js");
		}catch(error){
			Log.line();
			Log.error(error);
			Log.error(error.name);
			Log.error(error.stack);
			Log.line();

			return `<p class="w-100 text-size-0-8 surface-error p-1">${Lang.use("unknown_error")}</p>`;
		}

		let HTML = "";
		for(const notification of notifications) HTML += Notifications_module.notification_s_card_generator(notification);

		return HTML;
	}
}
