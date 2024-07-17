export default class Notification{
	static unseen_count = 0;
	static types = [
		"success",
		"info",
		"warning",
		"important",
		"error",
		"urgent"
	]

	static async update_unseen_count(){
		if(!("user" in window.session)) return;

		let data = await window.bridge({for: "get_unseen_count"}, "/x/notifications");
		if("error" in data) return;
		if(!("data" in data)) return;

		Notification.unseen_count = data["data"];
	}

}

window.x["Notification"] = Notification;
