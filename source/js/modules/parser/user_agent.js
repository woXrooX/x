export function parse_user_agent(user_agent_string){
	if(!user_agent_string) return null;

	const parse_result = {
		browser: null,
		browser_version: null,
		OS: null,
		OS_version: null,
		engine: null,
		device: null
	};

	const browser_patterns = {
		"Chrome": /Chrome\/(\d+\.\d+)/,
		"Firefox": /Firefox\/(\d+\.\d+)/,
		"Safari": /Safari\/(\d+\.\d+)/,
		"Opera": /OPR\/(\d+\.\d+)/,
		"Edge": /Edg\/(\d+\.\d+)/,
		"SamsungBrowser": /SamsungBrowser\/(\d+\.\d+)/
	};

	for(const [browser, pattern] of Object.entries(browser_patterns)){
		const match = user_agent_string.match(pattern);

		if(match){
			parse_result.browser = browser;
			parse_result.browser_version = match[1];
			break;
		}
	}

	const OS_patterns = {
		"iOS": {
			pattern: /CPU (?:iPhone |iPad )?OS (\d+_\d+(_\d+)?)/,
			process: (v)=>v[1].replace(/_/g, ".")
		},
		"Android": {
			pattern: /Android (\d+(\.\d+)?)/,
			process: (v)=>v[1]
		},
		"macOS": {
			pattern: /(Mac OS X|Macintosh) (\d+[._]\d+[._]\d+)/,
			process: (v)=>v[2].replace(/_/g, ".")
		},
		"Windows": {
			pattern: /Windows NT (\d+\.\d+)/,
			process: (v)=>v[1]
		},
		"Linux": {
			pattern: /Linux|Ubuntu|Debian|CentOS|Fedora|Red Hat|SUSE/,
			process: ()=>"Unknown"
		}
	};

	for(const [OS_name, {pattern, process}] of Object.entries(OS_patterns)){
		const match = user_agent_string.match(pattern);

		if(match){
			parse_result.OS = OS_name;
			parse_result.OS_version = process(match);
			break;
		}
	}

	const engine_patterns = {
		"WebKit": /WebKit\/(\d+\.\d+)/,
		"Gecko": /Gecko\/(\d+\.\d+)/,
		"Blink": /Blink\/(\d+\.\d+)/
	};

	for(const [engine, pattern] of Object.entries(engine_patterns)){
		const match = user_agent_string.match(pattern);

		if(match){
			parse_result.engine = `${engine} ${match[1]}`;
			break;
		}
	}

	if(user_agent_string.includes("Mobile")) parse_result.device = "mobile";
	else if(user_agent_string.includes("Tablet")) parse_result.device = "tablet";
	else parse_result.device = "desktop";

	return parse_result;
}
