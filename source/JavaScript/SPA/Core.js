////////////////////////////////////////////////////////// SPA - Single Page Application

///////////////////////////// Core Classes and Modules (Order matters)

import Logger from "/JavaScript/modules/Logger.js";
import Response from "/JavaScript/SPA/Response.js";
import Request from "/JavaScript/SPA/Request.js";
import XR from "/JavaScript/modules/XR/XR.js";
import x_String from "/JavaScript/modules/String.js";
import Head from "/JavaScript/SPA/Head.js";
import Body from "/JavaScript/SPA/Body.js";
import Cover from "/JavaScript/SPA/Cover.js";
import CSS from "/JavaScript/SPA/CSS.js";
import Color_Mode from "/JavaScript/SPA/Color_Mode.js";
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
import User from "/JavaScript/SPA/User.js";


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

///////////////////////////// Modules (Least important)
import VFX from "/JavaScript/modules/FX/VFX.js";

//// Non built-in XEs will be manually imported on head section of the index.html
// <script type="module" src="/JavaScript/libs/XE/Sample_XE.js"></script>

export default class Core {
	/////////////////////////// Static

	// static {}


	static async init(){
		Log.info("Core.#init()");

		await Core.#get_initial_data();

		Language.init();
		x.Color_Mode.init();
		x.Menu.init();
		Header.init();
		Footer.init();
		x.Router.handle();
		x.Menu.set_active();

		await x.User.init_set_last_heartbeat_at();
		await x.Notification.init();

		// Core.#on_load();
		Core.#on_URL_change();
		Core.#on_hash_change();
		Core.#on_history_button_clicked();
		Core.#on_DOM_change();
		await Core.#on_user_session_change();
		Core.#observe_mutations();
	}

	static async #get_initial_data() {
		const CONFIGURATIONS = await window.x.Request.make({
			payload: {"for": "get:CONFIGURATIONS"},
			target_URL: "/API"
		});

		if ("data" in CONFIGURATIONS) window.CONF = CONFIGURATIONS["data"];
		else return Log.error("Core.#get_initial_data(): get:CONFIGURATIONS");



		const session = await window.x.Request.make({
			payload: {"for": "get:session"},
			target_URL: "/API"
		});

		if (session["type"] != "success") return Log.error("Core.#get_initial_data(): get:session");
		else if ("data" in session) window.session = session["data"];
		else window.session = {};



		const LANGUAGE_DICTIONARY = await window.x.Request.make({
			payload: {"for": "get:LANGUAGE_DICTIONARY"},
			target_URL: "/API",
			cacheable: { key_name: "x.cache.LANGUAGE_DICTIONARY" }
		});

		if (LANGUAGE_DICTIONARY["type"] != "success") return Log.error("Core.#get_initial_data(): get:LANGUAGE_DICTIONARY");
		else if ("data" in LANGUAGE_DICTIONARY) window.Language.DICTIONARY = LANGUAGE_DICTIONARY["data"];



		const USER_AUTHENTICITY_STATUSES = await window.x.Request.make({
			payload: {"for": "get:USER_AUTHENTICITY_STATUSES"},
			target_URL: "/API",
			cacheable: { key_name: "x.cache.USER_AUTHENTICITY_STATUSES" }
		});

		if (USER_AUTHENTICITY_STATUSES["type"] != "success") return Log.error("Core.#get_initial_data(): get:USER_AUTHENTICITY_STATUSES");
		else if ("data" in USER_AUTHENTICITY_STATUSES) window.USER_AUTHENTICITY_STATUSES = USER_AUTHENTICITY_STATUSES["data"];
		else window.USER_AUTHENTICITY_STATUSES = {};



		const USER_ROLES = await window.x.Request.make({
			payload: {"for": "get:USER_ROLES"},
			target_URL: "/API",
			cacheable: { key_name: "x.cache.USER_ROLES" }
		});

		if (USER_ROLES["type"] != "success") return Log.error("Core.#get_initial_data(): get:USER_ROLES");
		else if ("data" in USER_ROLES) window.USER_ROLES = USER_ROLES["data"];
		else window.USER_ROLES = {};


		const USER_OCCUPATIONS = await window.x.Request.make({
			payload: {"for": "get:USER_OCCUPATIONS"},
			target_URL: "/API",
			cacheable: { key_name: "x.cache.USER_OCCUPATIONS" }
		});

		if (USER_OCCUPATIONS["type"] != "success") return Log.error("Core.#get_initial_data(): get:USER_OCCUPATIONS");
		else if ("data" in USER_OCCUPATIONS) window.USER_OCCUPATIONS = USER_OCCUPATIONS["data"];
		else window.USER_OCCUPATIONS = {};



		const NOTIFICATION_TYPES = await window.x.Request.make({
			payload: {"for": "get:NOTIFICATION_TYPES"},
			target_URL: "/API",
			cacheable: { key_name: "x.cache.NOTIFICATION_TYPES" }
		});

		if (NOTIFICATION_TYPES["type"] != "success") return Log.error("Core.#get_initial_data(): get:NOTIFICATION_TYPES");
		else if ("data" in NOTIFICATION_TYPES) window.NOTIFICATION_TYPES = NOTIFICATION_TYPES["data"];
		else window.NOTIFICATION_TYPES = {};



		const PROJECT_SVG = await window.x.Request.make({
			payload: {"for": "get:PROJECT_SVG"},
			target_URL: "/API",
			cacheable: { key_name: "x.cache.PROJECT_SVG" }
		});

		if (PROJECT_SVG["type"] != "success") return Log.error("Core.#get_initial_data(): get:PROJECT_SVG");
		else if ("data" in PROJECT_SVG) window.SVG.load(PROJECT_SVG["data"]);



		const CURRENCIES = await window.x.Request.make({
			payload: {"for": "get:CURRENCIES"},
			target_URL: "/API",
			cacheable: { key_name: "x.cache.CURRENCIES" }
		});

		if (CURRENCIES["type"] != "success") return Log.error("Core.#get_initial_data(): get:CURRENCIES");
		else if ("data" in CURRENCIES) window.x["CURRENCIES"] = CURRENCIES["data"];
		else window.x["CURRENCIES"] = {};
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
			if ("detail" in event && event.detail !== null){
				window.session["user"] = event.detail;
				await x.User.init_set_last_heartbeat_at();
				await x.Notification.init();
			}

			// User session off
			else {
				delete window.session["user"];
				clearInterval(x.User.poll_func_set_last_heartbeat_at);
				clearInterval(x.Notification.poll_interval_func);
			}

			x.Color_Mode.detect_color_mode();
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

				window.x.XR.collect();
			}
		};

		// Create an observer instance linked to the callback function
		const observer = new MutationObserver(callback);

		observer.observe(document.body, {attributes: true, childList: true, subtree: true});

		// observer.disconnect();
	}
};

window.x["Core"] = Core;
