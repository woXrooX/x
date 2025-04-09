export function before(){
	window.x.Head.set_title("notification");
}

export default function main(){ return '<container class="padding-5 max-width-1000px"></container>'; }

export async function after(){
	const container = document.querySelector("container");

	Loading.on_element_start(container);
	container.innerHTML = await build_notification_HTML();
	Loading.on_element_end(container);

	async function build_notification_HTML(){
		let notification = await window.bridge({for: "get_notification"});
		if("data" in notification) notification = notification["data"];
		else return `<p class="width-100 text-size-0-8 surface-info padding-1">${Lang.use("no_notification")}</p>`;

		let Notifications_module;

		try{
			Notifications_module = await import("/JavaScript/modules/Notifications.js");
		}catch(error){
			Log.line();
			Log.error(error);
			Log.error(error.name);
			Log.error(error.stack);
			Log.line();

			return `<p class="width-100 text-size-0-8 surface-error padding-1">${Lang.use("unknown_error")}</p>`;
		}

		return await Notifications_module.notification_m_card_generator(notification);
	}
}
