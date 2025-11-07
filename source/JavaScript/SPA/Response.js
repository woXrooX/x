export default class Response {
	static handle_actions(response) {
		if (!("actions" in response)) return;

		if ("update_conf" in response["actions"]) window.x["CONF"] = response["actions"]["update_conf"];

		if ("set_session_user" in response["actions"]) window.dispatchEvent(new CustomEvent("user_session_change", {detail: response["actions"]["set_session_user"]}));
		if ("delete_session_user" in response["actions"]) window.dispatchEvent(new CustomEvent("user_session_change"));

		if ("DOM_change" in response["actions"]) window.dispatchEvent(new CustomEvent("DOM_change", {detail: response["actions"]["DOM_change"]}));

		if ("redirect" in response["actions"]) window.Hyperlink.locate(response["actions"]["redirect"]);
		if ("reload" in response["actions"]) window.location.reload();
		if ("open_URL_in_new_tab" in response["actions"]) window.Hyperlink.open_URL_in_new_tab(response["actions"]["open_URL_in_new_tab"]);
	}
}

window.x["Response"] = Response;
