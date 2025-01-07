export const TITLE = window.Lang.use("notifications");

export default function main(){ return `<container class="padding-5 gap-0-5 max-width-1200px"></container>`; }

export async function after(){
	const container = document.querySelector("container");

	Loading.on_element_start(container);
	container.insertAdjacentHTML("beforeend", `
		${build_actions_row_HTML()}
		${await build_notifications_HTML()}
	`);
	Loading.on_element_end(container);

	async function build_notifications_HTML(){
		let notifications = await window.bridge({for: "get_all_notifications"});
		if("data" in notifications) notifications = notifications["data"];
		else return `<p class="width-100 text-size-0-8 surface-info padding-1">${Lang.use("no_notifications")}</p>`;

		let Notifications_module;

		try{
			Notifications_module = await import("/JavaScript/modules/Notifications.js");
		}catch(error){
			// Log.line();
			// Log.error(error);
			// Log.error(error.name);
			// Log.error(error.stack);
			// Log.line();

			return `<p class="width-100 text-size-0-8 surface-error padding-1">${Lang.use("unknown_error")}</p>`;
		}

		let HTML = build_delete_all_button_HTML();

		for(const notification of notifications) HTML += await Notifications_module.notification_s_card_generator(notification);

		return HTML;
	}

	function build_actions_row_HTML(){
		return `
			<row class="flex-row flex-x-end gap-0-5 p-2">
				${build_delete_all_button_HTML()}
				${build_anchor_notificatons_settings_HTML()}
			</row>
		`;

		function build_delete_all_button_HTML(){
			return `
				<x-svg
					class="btn btn-error"
					name="delete"
					color="white"
					xr-post
					xr-for="delete_all_notifications"
					x-toast="on:any:message"
				></x-svg>
			`;
		}

		function build_anchor_notificatons_settings_HTML(){
			if(!("x_notifications_settings" in window.CONF["pages"])) return '';

			return `<a href="/x/notifications/settings" class="btn btn-primary"><x-svg name="gear" color="white"></x-svg></a>`;
		}
	}
}
