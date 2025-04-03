export default class Title{
	static set(newTitle = ""){
		if(!!newTitle === false) document.title = window.Lang.use(window.CONF["default"]["title"]);
		else document.title = `${window.Lang.use(newTitle)} | ${window.Lang.use(window.CONF["default"]["title"])}`;
	}
}

// Make Title Usable W/O Importing It
window.Title = Title;
