// undefined = is used for removal of the tag

export default class Head{
	/////////////////////////// Static

	static #title = '';
	static #description = '';
	static #URL = '';

	static #author = undefined;
	static #article_published_time = undefined;
	static #article_modified_time = undefined;
	static #keywords = undefined;
	static #og_type = undefined;

	static {
		Head.#save_defaults();
	}

	/////////// APIs

	static reset_all(){
		Head.set_title(Head.#title);
		Head.set_description(Head.#description);
		Head.set_URL(Head.#URL);
		Head.set_author(Head.#author);
		Head.set_article_published_time(Head.#article_published_time);
		Head.set_article_modified_time(Head.#article_modified_time);
		Head.set_keywords(Head.#keywords);
		Head.set_og_type(Head.#og_type);
	}


	static set_title(title){
		let final_title = '';

		if(!!title === false) final_title = window.Lang.use(window.CONF["project_name"]);
		else final_title = `${window.Lang.use(title)} | ${window.Lang.use(window.CONF["project_name"])}`;

		document.title = final_title;
		document.querySelector('meta[property="og:title"]')?.setAttribute("content", final_title);
		document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", final_title);
	}

	static set_description(description){
		if (!!description === false) return;

		document.querySelector('meta[name="description"]')?.setAttribute('content', description);
		document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
		document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", description);
	}

	static set_URL(URL){
		if (!!URL === false) return;

		document.querySelector('link[rel="canonical"]')?.setAttribute('href', URL);
		document.querySelector('meta[property="og:url"]')?.setAttribute("content", URL);
	}

	static set_author(content){
		if (content === undefined) return document.querySelector('meta[name="author"]')?.remove();

		let element = document.querySelector('meta[name="author"]');

		if (!element) {
			element = document.createElement('meta');
			element.setAttribute('name', 'author');
			document.head.appendChild(element);
		}

		element.setAttribute('content', content);
	}

	static set_article_published_time(content) {
		if (content === undefined) return document.querySelector('meta[property="article:published_time"]')?.remove();

		let element = document.querySelector('meta[property="article:published_time"]');

		if (!element) {
			element = document.createElement('meta');
			element.setAttribute('property', 'article:published_time');
			document.head.appendChild(element);
		}

		element.setAttribute('content', content);
	}

	static set_article_modified_time(content) {
		if (content === undefined) return document.querySelector('meta[property="article:modified_time"]')?.remove();

		let element = document.querySelector('meta[property="article:modified_time"]');

		if (!element) {
			element = document.createElement('meta');
			element.setAttribute('property', 'article:modified_time');
			document.head.appendChild(element);
		}

		element.setAttribute('content', content);
	}

	static set_keywords(content) {
		if (content === undefined) return document.querySelector('meta[name="keywords"]')?.remove();

		let element = document.querySelector('meta[name="keywords"]');

		if (!element) {
			element = document.createElement('meta');
			element.setAttribute('name', 'keywords');
			document.head.appendChild(element);
		}

		element.setAttribute('content', content);
	}

	static set_og_type(content) {
		if (content === undefined) return document.querySelector('meta[property="og:type"]')?.remove();

		let element = document.querySelector('meta[property="og:type"]');

		if (!element) {
			element = document.createElement('meta');
			element.setAttribute('property', 'og:type');
			document.head.appendChild(element);
		}

		element.setAttribute('content', content);
	}


	/////////// Helpers

	static #save_defaults(){
		Head.#title = document.querySelector('title')?.textContent || '';
		Head.#description = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
		Head.#URL = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '';

		Head.#author = document.querySelector('meta[name="author"]')?.getAttribute('content') || undefined;
		Head.#article_published_time = document.querySelector('meta[property="article:published_time"]')?.getAttribute('content') || undefined;
		Head.#article_modified_time = document.querySelector('meta[property="article:modified_time"]')?.getAttribute('content') || undefined;
		Head.#keywords = document.querySelector('meta[name="keywords"]')?.getAttribute('content') || undefined;
		Head.#og_type = document.querySelector('meta[property="og:type"]')?.getAttribute('content') || undefined;
	}
}

window.x["Head"] = Head;
