////////////////////////////////////////////////////////// SPA - Single Page Application

///////////////////////////// Modules
// Order matters
import Logger from "/JavaScript/modules/Logger.js";
import bridge from "/JavaScript/modules/bridge.js";
import XRequest from "/JavaScript/modules/XRequest.js";
import x_String from "/JavaScript/modules/String.js";

///////////////////////////// SPA Classes
// Order matters
import Head from "/JavaScript/SPA/Head.js";
import Body from "/JavaScript/SPA/Body.js";
import Cover from "/JavaScript/SPA/Cover.js";
import CSS from "/JavaScript/SPA/CSS.js";
import Page from "/JavaScript/SPA/Page.js";
import DOM from "/JavaScript/SPA/DOM.js";
import Footer from "/JavaScript/SPA/Footer.js";
import Form from "/JavaScript/SPA/Form.js";
import Header from "/JavaScript/SPA/Header.js";
import Hyperlink from "/JavaScript/SPA/Hyperlink.js";
import Language from "/JavaScript/SPA/Language.js";
import Loading from "/JavaScript/SPA/Loading.js";
import Root from "/JavaScript/SPA/Root.js";
import Main from "/JavaScript/SPA/Main.js";
import Menu from "/JavaScript/SPA/Menu.js";
import Notification from "/JavaScript/SPA/Notification.js";
import Router from "/JavaScript/SPA/Router.js";
import SVG from "/JavaScript/SPA/SVG.js";
import URL from "/JavaScript/SPA/URL.js";


//// Built-in XEs
import Layers from "/JavaScript/libs/XE/Layers/Layers.js";
import Link from "/JavaScript/libs/XE/Link.js";
import Modal from "/JavaScript/libs/XE/Modal.js";
import Notification_Bell from "/JavaScript/libs/XE/Notification_Bell.js";
import Offline from "/JavaScript/libs/XE/Offline.js";
import Table from "/JavaScript/libs/XE/Table.js";
import Toast from "/JavaScript/libs/XE/Toast.js";
import Tooltip from "/JavaScript/libs/XE/Tooltip.js";
import XSVG from "/JavaScript/libs/XE/XSVG.js";

//// Non built-in XEs will be manually imported on head section of the index.html
// <script type="module" src="/JavaScript/libs/XE/Sample_XE.js"></script>

export default class Core{
	/////////////////////////// Static

	static {
		Core.#get_initial_data()
			.then(async ()=>{
				await Core.#init();
				Core.#on_load();
				Core.#on_URL_change();
				Core.#on_hash_change();
				Core.#on_history_button_clicked();
				Core.#on_DOM_change();
				await Core.#on_user_session_change();
				Core.#observe_mutations();
			});
	}

	static async #get_initial_data(){
		return new Promise( async (resolve, reject) => {
			let response = await window.bridge({for: "initial_data"}, "/API");

			if(typeof response === "object"){
				Log.success(response);

				window.session = response["session"];
				window.CONF = response["CONF"];
				window.Language.DICT = response["LANG_DICT"];
				window.USER_AUTHENTICITY_STATUSES = response["USER_AUTHENTICITY_STATUSES"];
				window.USER_ROLES = response["USER_ROLES"];
				window.USER_OCCUPATIONS = response["USER_OCCUPATIONS"];
				window.NOTIFICATION_TYPES = response["NOTIFICATION_TYPES"];
				window.SVG.load(response["PROJECT_SVG"]);

				resolve();
			}else{
				Log.error("Fetching the initial data failed!");

				reject();
			}
		});
	}

	static async #init(){
		Log.info("Core.#init()");

		Language.init();
		x.CSS.init();
		Menu.init();
		Header.init();
		Footer.init();
		Router.handle();

		await x.Notification.init();
	}

	/////////// Event Handlers

	static #on_load(){
		// Works On The First Visit
		document.addEventListener('readystatechange', ()=>{
			if(event.target.readyState === 'loading') return;
			if(event.target.readyState === 'interactive') return;
			// if(event.target.readyState === 'complete');

			// window.dispatchEvent(new Event('load'));
			Log.info("on_load");

			Router.handle();
			Menu.set_active();
		});
	}

	static #on_URL_change(){
		window.addEventListener('URL_change', ()=>{
			// window.dispatchEvent(new Event('URL_change'));
			Log.info("Core.#on_URL_change()");

			URL.handle_change();
			Modal.hide();
		});
	}

	static #on_hash_change(){
		window.addEventListener('hashchange', ()=>{
			// window.dispatchEvent(new Event('hashchange'));
			Log.info("Core.#on_hash_change()");
		});
	}

	static #on_history_button_clicked(){
		window.addEventListener('popstate', ()=>{
			// NOTE: Just calling history.pushState() or history.replaceState() won't trigger a popstate event.
			// The popstate event will be triggered by doing a browser action such as a click on the back or forward button (or calling history.back() or history.forward() in JavaScript).

			// NOTE: hashchange event also triggers the popstate. Web is a mess!

			// window.dispatchEvent(new Event('popstate'));

			// Trigger popstate event
			// const pop_state_event = new PopStateEvent('popstate', { state: { page: completed_URL.href } });
			// window.dispatchEvent(pop_state_event);

			Log.info("Core.#on_history_button_clicked()");

			URL.handle_change();
		});
	}

	static #on_DOM_change(){
		window.addEventListener('DOM_change', ()=>{
			// window.dispatchEvent(new CustomEvent('DOM_change'));
			// window.dispatchEvent(new CustomEvent("DOM_change", {detail:"menu"}));
			Log.info("Core.#on_DOM_change()");

			// Targets sample event.detail = ["menu", "main"...]
			// If has target(s) then update the dom. body > target
			if(!!event.detail === true) DOM.update(event.detail);
		});
	}

	static async #on_user_session_change(){
		window.addEventListener('user_session_change', async ()=>{
			// window.dispatchEvent(new CustomEvent('user_session_change'));
			// window.dispatchEvent(new CustomEvent("user_session_change", {detail:"user_session_data"}));
			Log.info("Core.#on_user_session_change()");

			// User session on
			if("detail" in event && event.detail !== null){
				window.session["user"] = event.detail;
				await x.Notification.init();
			}

			// User session off
			else{
				delete window.session["user"];
				clearInterval(x.Notification.poll_interval_func);
			}

			x.CSS.detect_color_mode();
		});
	}

	static #observe_mutations(){
		// Callback function to execute when mutations are observed
		const callback = (mutationList, observer)=>{
			// Ensure that any methods requiring execution upon a DOM change are encapsulated within the for loop provided below.
			for(const mutation of mutationList){

				// Skip observing based on element
				// if(mutation.target.nodeName == "IFRAME") continue;

				// Check if the mutation target is within an element to be ignored
				if(mutation.target.closest('[x-ignore-mutations]')) continue;

				// A child node has been added or removed.
				if(mutation.type === "childList"){
					Hyperlink.collect();
					Form.collect();
				}

				// The ${mutation.attributeName} attribute was modified.
				// else if(mutation.type === "attributes"){}

				XRequest.collect();
			}
		};

		// Create an observer instance linked to the callback function
		const observer = new MutationObserver(callback);

		observer.observe(document.body, {attributes: true, childList: true, subtree: true});

		// observer.disconnect();
	}
};
