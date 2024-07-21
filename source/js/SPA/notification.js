export default class Notification{
	static unseen_count = 0;
	static poll_interval_func = null;
	static poll_interval_duration = 60000;
	static types = [
		"success",
		"info",
		"warning",
		"important",
		"error",
		"urgent"
	];

	static async init(){
		if(!("user" in window.session)) return;

		await Notification.update_unseen_count();
		await Notification.#poll();
	}

	static async #poll(){
		Notification.poll_interval_func = setInterval(async ()=>{
			await Notification.update_unseen_count();
		}, Notification.poll_interval_duration);
	}

	static async update_unseen_count(){
		if(!("user" in window.session)) return;

		let data = await window.bridge({for: "get_unseen_count"}, "/x/notifications");
		if("error" in data) return;
		if(!("data" in data)) return;

		Notification.unseen_count = data["data"];
	}
}

window.x["Notification"] = Notification;
