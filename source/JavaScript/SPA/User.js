export default class User{
	static poll_func_set_last_heartbeat_at = null;
	static poll_interval_duration_set_last_heartbeat_at = 60000;

	static async init_set_last_heartbeat_at(){
		if(!("user" in window.session)) return;

		await User.set_last_heartbeat_at();
		await User.#poll_set_last_heartbeat_at();
	}

	static async #poll_set_last_heartbeat_at(){
		User.poll_func_set_last_heartbeat_at = setInterval(async ()=>{
			await User.set_last_heartbeat_at();
		}, User.poll_interval_duration_set_last_heartbeat_at);
	}

	static async set_last_heartbeat_at(){
		if(!("user" in window.session)) return;

		let data = await window.bridge({for: "set_last_heartbeat_at"}, "/API");
		if("error" in data) return;

		Log.success("User.set_last_heartbeat_at()");
	}
}

window.x["User"] = User;
