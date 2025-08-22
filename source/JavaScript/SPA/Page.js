export default class Page{
	static current_page = null;

	static async load(page){
		if(!!page == false) return;

		Page.current_page = await import(`/JavaScript/pages/${page}.js`)

		await Page.life_cycle();
	}

	static async life_cycle(){
		Log.info("Page.life_cycle()");

		window.x.Head.reset_all();

		// Before
		if(!!Page.current_page.before === true) await Page.current_page.before();

		// Header
		await window.Header.handle(Page.current_page.header);

		// Default/Main
		if(typeof Page.current_page.default === "function") await window.Main.render(await Page.current_page.default());
		else await window.Main.render(Main.situational_content("error", "ERROR", "Page.life_cycle() -> No default function defined!"));

		// Footer
		await window.Footer.handle();

		// After
		if(!!Page.current_page.after === true) await Page.current_page.after();

		//// Scroll to top after page is ready

		// For desktop
		window.scrollTo(0, 0);

		// For mobile
		document.body.scrollTo({top: 0,left: 0});
	}
}

window.x["Page"] = Page;
