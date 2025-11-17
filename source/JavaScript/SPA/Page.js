export default class Page {
	static current_page = null;

	static async handle(page_name) {
		try {
			if (Page.current_page !== null && !!Page.current_page.on_page_unmount === true ) await Page.current_page.on_page_unmount();

			// Start loading effects
			window.Loading.start();
			window.Main.animation_start();

			await Page.#load_file(page_name);
			await Page.life_cycle();
		}

		catch(error) {
			// Log.line();
			// Log.error(error);
			// Log.error(error.name);
			// Log.error(error.message);
			// Log.error(error.stack);
			// Log.line();

			window.Header.handle();

			if ("CONF" in window && window.CONF.tools.debug === true) {
				window.Main.render(Main.situational_content("error", error.name, error.stack));
				console.trace(error);
			}

			else window.Main.render(Main.situational_content("warning", Lang.use("warning"), Lang.use("something_went_wrong")));

			window.Footer.handle();
		}

		finally {
			// End page loading
			window.Loading.end();
			window.Main.animation_end();
		}
	}

	static async #load_file(page_name){
		if (!!page_name === false) return;

		window.Log.info(`x.Page.load_file(): ${page_name}.js`);

		Page.current_page = await import(`/JavaScript/pages/${page_name}.js`)
	}

	static async life_cycle() {
		Log.info("Page.life_cycle()");

		window.x.Head.reset_all();

		if (!!Page.current_page.before === true) await Page.current_page.before();

		await window.Header.handle();

		// Default/Main
		if (typeof Page.current_page.default === "function") await window.Main.render(await Page.current_page.default());
		else await window.Main.render(Main.situational_content("error", "ERROR", "Page.life_cycle() -> No default function defined!"));

		await window.Footer.handle();

		// End page loading
		window.Loading.end();
		window.Main.animation_end();

		if (!!Page.current_page.after === true) await Page.current_page.after();

		//// Scroll to top after page is ready
		// For desktop
		window.scrollTo(0, 0);
		// For mobile
		document.body.scrollTo({top: 0,left: 0});

		//// Scroll to hash if any
		window.x.URL.handle_scroll_to_hash();
	}
}

window.x["Page"] = Page;
