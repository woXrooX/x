export const TITLE = window.Lang.use("notification");

export default function main(){return '<container class="p-5 max-w-1000px"></container>';}

export async function after(){
	const container = document.querySelector("container");

	Loading.on_element(container);
	container.innerHTML = await build_notification_HTML();
	Loading.on_element(container);

	async function build_notification_HTML(){
		let notification = await window.bridge({for: "get_notification"});
		if("data" in notification) notification = notification["data"];
		else return `<p class="w-100 text-size-0-8 surface-info p-1">${Lang.use("no_notification")}</p>`;

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
		console.log(Notifications_module);

		return Notifications_module.notification_content_generator(notification);
	}
}
