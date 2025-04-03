export default class Title{
	static set(newTitle = ""){
		if(!!newTitle === false) document.title = window.Lang.use(window.CONF["default"]["title"]);
		else document.title = `${window.Lang.use(newTitle)} | ${window.Lang.use(window.CONF["default"]["title"])}`;
	}
}

window.Title = Title;
